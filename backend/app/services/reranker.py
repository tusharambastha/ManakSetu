"""Grounded Re-ranking and Justification Engine
Re-scores retrieved candidate standards against structured technical parameters
and generates grounded justifications citing only verified database records.
"""
from typing import List, Dict, Any, Optional

class GroundedReranker:
    CONFIDENCE_THRESHOLD = 0.30

    @classmethod
    def rerank_and_explain(
        cls,
        candidates: List[Dict[str, Any]],
        extracted_reqs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Re-rank candidate standards and attach grounded justifications.
        Zero hallucination: only attributes present in the KB record are cited.
        """
        if not candidates:
            return {
                "confident_match_found": False,
                "message": "No matching Indian Standard found for the provided specification.",
                "ranked_results": []
            }

        inferred_sector = extracted_reqs.get("inferred_sector")
        tech_params = extracted_reqs.get("technical_parameters", {})
        product_type = extracted_reqs.get("product_type", "").lower()

        # Collect all extracted parameter values into a flat list
        all_param_values = []
        for p_list in tech_params.values():
            all_param_values.extend([p.lower() for p in p_list])

        reranked_items = []

        for item in candidates:
            std_no = item["standard_no"]
            title = item["title"]
            scope = item["scope"]
            sector = item["sector"]
            status = item.get("status", "active")
            keywords = [k.lower() for k in item.get("matched_keywords", [])]

            scope_lower = scope.lower()
            title_lower = title.lower()

            # 1. Base Score from Hybrid Search
            score = item["relevance_score"]

            # 2. Sector alignment
            if inferred_sector and sector == inferred_sector:
                score += 0.05
            elif inferred_sector and sector != inferred_sector:
                score -= 0.15 # Cross-domain penalty

            # 3. Check for exact parameter matches in candidate scope
            matched_clauses = []
            param_matches_count = 0

            for param in all_param_values:
                if param in scope_lower or param in title_lower or param in keywords:
                    param_matches_count += 1
                    matched_clauses.append(param)

            if param_matches_count > 0:
                score += min(param_matches_count * 0.06, 0.20)

            # 4. Status adjustment (superseded standards are penalized slightly but preserved with warning)
            if status == "superseded":
                score -= 0.08

            # Check for exact explicit standard number match
            detected_standards = extracted_reqs.get("detected_standards", [])
            has_explicit_std_match = item.get("exact_boost") or any(
                ds.lower().replace(" ", "") in std_no.lower().replace(" ", "")
                for ds in detected_standards
            )
            if has_explicit_std_match:
                score = 0.99
                final_score = 0.99
                item["exact_boost"] = True
            else:
                # Clamp score between 0.05 and 0.99
                final_score = round(min(max(score, 0.05), 0.99), 3)

            # 5. Build Grounded Explanation
            explanation = cls._build_grounded_explanation(
                item=item,
                inferred_sector=inferred_sector,
                matched_params=matched_clauses,
                extracted_reqs=extracted_reqs
            )

            item["relevance_score"] = final_score
            item["parameter_matches"] = matched_clauses
            item["explanation"] = explanation
            reranked_items.append(item)

        # Sort descending by re-ranked relevance score
        reranked_items.sort(key=lambda x: x["relevance_score"], reverse=True)

        top_item = reranked_items[0] if reranked_items else None
        confident_match = False

        if top_item:
            top_score = top_item["relevance_score"]
            has_keyword_match = len(top_item.get("matched_keywords", [])) > 0
            has_param_match = len(top_item.get("parameter_matches", [])) > 0
            vector_score = top_item.get("vector_score", 0.0)

            # If top item was an explicit standard match, it is confident by definition
            if top_item.get("exact_boost"):
                confident_match = True
            elif inferred_sector is None and not has_param_match and not has_keyword_match:
                confident_match = False
            elif has_param_match and top_score >= 0.40:
                confident_match = True
            elif has_keyword_match and top_score >= 0.42:
                confident_match = True
            elif vector_score >= 0.60 and top_score >= 0.55:
                confident_match = True

        message = (
            f"Successfully identified {len(reranked_items)} relevant Indian Standard(s) from verified database."
            if confident_match
            else "No confident Indian Standard match found for the technical requirements. Results below are exploratory."
        )

        return {
            "confident_match_found": confident_match,
            "message": message,
            "ranked_results": reranked_items
        }

    @classmethod
    def _build_grounded_explanation(
        cls,
        item: Dict[str, Any],
        inferred_sector: Optional[str],
        matched_params: List[str],
        extracted_reqs: Dict[str, Any]
    ) -> str:
        """Compose a factual explanation strictly grounded in the database record"""
        std_no = item["standard_no"]
        title = item["title"]
        scope = item["scope"]
        sector = item["sector"]
        status = item.get("status", "active")
        superseded_by = item.get("superseded_by")
        cert = item.get("certification")

        # First sentence from scope
        first_clause = scope.split(".")[0] if "." in scope else scope

        parts = [
            f"Recommended because {std_no} ({title}) is the authoritative Indian Standard governing requirements in the {sector} sector."
        ]

        if matched_params:
            unique_params = list(dict.fromkeys(matched_params))
            parts.append(
                f"Directly satisfies technical parameters: '{', '.join(unique_params)}' as prescribed in its official scope ({first_clause})."
            )
        else:
            parts.append(f"Official scope specifies: {first_clause}.")

        if status == "superseded":
            has_verified_superseded = False
            allied = item.get("allied_standards", []) or item.get("related_standards", [])
            for rel in allied:
                rel_type = rel.get("relation_type") if isinstance(rel, dict) else getattr(rel, "relation_type", None)
                rel_ver = rel.get("relation_verified") if isinstance(rel, dict) else getattr(rel, "relation_verified", False)
                if rel_type in ["supersedes", "superseded_by"] and rel_ver:
                    has_verified_superseded = True
                    break
            
            if not has_verified_superseded and item.get("status_verified") and superseded_by:
                has_verified_superseded = True

            if has_verified_superseded and superseded_by:
                parts.append(
                    f"⚠️ CAUTION: This standard is SUPERSEDED. Procurement officers should transition to active standard '{superseded_by}'."
                )
            else:
                parts.append(
                    "Status could not be confirmed - check the latest status on BIS portal."
                )
        elif cert and cert.get("scheme") and cert.get("scheme") != "None":
            order = cert.get("order_name") or "Statutory Order"
            ministry = cert.get("notifying_ministry") or "Government of India"
            if item.get("qco_verified"):
                parts.append(
                    f"Mandatory compliance: Requires {cert['scheme']} under {order} ({ministry})."
                )
            else:
                parts.append(
                    f"Regulatory Mapping: {order} ({ministry}) applies. Certification requirement: Verification pending."
                )

        return " ".join(parts)
