"""Hybrid Retrieval Engine combining BM25 Keyword Search and Dense Vector Semantic Search"""
import time
import re
from typing import List, Dict, Any, Optional
from app.config import settings
from app.services.bm25_search import BM25SearchService
from app.services.vector_search import VectorSearchService
from app.services.multilingual_normalizer import MultilingualNormalizer

class HybridSearchEngine:
    def __init__(self, bm25_service: BM25SearchService, vector_service: VectorSearchService):
        self.bm25 = bm25_service
        self.vector = vector_service
        self.bm25_weight = settings.HYBRID_BM25_WEIGHT
        self.vector_weight = settings.HYBRID_VECTOR_WEIGHT

    def search(
        self,
        query: str,
        top_k: int = 10,
        sector_filter: Optional[str] = None,
        mode: str = "hybrid"
    ) -> Dict[str, Any]:
        """Perform hybrid or single-mode retrieval.
        Modes: 'hybrid', 'semantic', 'keyword'
        """
        start_time = time.time()
        query_clean = query.strip()
        if not query_clean:
            return {
                "query": query,
                "total_results": 0,
                "results": [],
                "retrieval_method": mode,
                "execution_time_ms": 0.0
            }

        candidate_pool: Dict[str, Dict[str, Any]] = {}

        # 1. BM25 Search
        bm25_results = []
        if mode in ("hybrid", "keyword"):
            bm25_results = self.bm25.search(query_clean, top_k=top_k * 2, sector_filter=sector_filter)
            max_bm25 = max([score for _, score, _ in bm25_results], default=1.0)
            if max_bm25 <= 0:
                max_bm25 = 1.0

            for rank, (std, raw_score, matched_terms) in enumerate(bm25_results, start=1):
                std_no = std["standard_no"]
                norm_score = min(raw_score / max_bm25, 1.0)
                candidate_pool[std_no] = {
                    "standard": std,
                    "bm25_raw": raw_score,
                    "bm25_norm": norm_score,
                    "bm25_rank": rank,
                    "matched_keywords": matched_terms,
                    "vector_score": 0.0,
                    "vector_rank": 999
                }

        # 2. Vector Semantic Search
        vector_results = []
        if mode in ("hybrid", "semantic"):
            vector_results = self.vector.search(query_clean, top_k=top_k * 2, sector_filter=sector_filter)
            for rank, (std, vec_score) in enumerate(vector_results, start=1):
                std_no = std["standard_no"]
                # Cosine similarity clamp between 0.0 and 1.0
                norm_vec = max(0.0, min(vec_score, 1.0))
                if std_no in candidate_pool:
                    candidate_pool[std_no]["vector_score"] = norm_vec
                    candidate_pool[std_no]["vector_rank"] = rank
                else:
                    candidate_pool[std_no] = {
                        "standard": std,
                        "bm25_raw": 0.0,
                        "bm25_norm": 0.0,
                        "bm25_rank": 999,
                        "matched_keywords": [],
                        "vector_score": norm_vec,
                        "vector_rank": rank
                    }

        # 2.5 Explicit Standard Number Prioritization
        explicit_standards = MultilingualNormalizer.extract_is_standards(query_clean)
        explicit_numbers = []
        for s in explicit_standards:
            m = re.search(r'\d+', s)
            if m:
                explicit_numbers.append(m.group())

        if explicit_numbers and self.bm25.standards_corpus:
            for std in self.bm25.standards_corpus:
                std_no = std.get("standard_no", "")
                if any(num in std_no for num in explicit_numbers):
                    if std_no not in candidate_pool:
                        candidate_pool[std_no] = {
                            "standard": std,
                            "bm25_raw": 15.0,
                            "bm25_norm": 1.0,
                            "bm25_rank": 1,
                            "matched_keywords": [std_no],
                            "vector_score": 1.0,
                            "vector_rank": 1,
                            "exact_boost": True
                        }
                    else:
                        candidate_pool[std_no]["exact_boost"] = True
                        candidate_pool[std_no]["bm25_norm"] = 1.0
                        candidate_pool[std_no]["vector_score"] = max(candidate_pool[std_no]["vector_score"], 0.95)

        # 3. Fuse Scores
        scored_items = []
        rrf_k = 60

        for std_no, data in candidate_pool.items():
            std = data["standard"]
            norm_bm25 = data["bm25_norm"]
            norm_vec = data["vector_score"]

            if data.get("exact_boost"):
                final_score = 0.99
            elif mode == "keyword":
                final_score = norm_bm25
            elif mode == "semantic":
                final_score = norm_vec
            else: # hybrid
                # Reciprocal Rank Fusion + Linear Weight Blend
                rrf_bm25 = 1.0 / (rrf_k + data["bm25_rank"]) if data["bm25_rank"] < 900 else 0.0
                rrf_vec = 1.0 / (rrf_k + data["vector_rank"]) if data["vector_rank"] < 900 else 0.0
                rrf_score = (rrf_bm25 + rrf_vec) * 30.0 # scale factor

                linear_score = (self.bm25_weight * norm_bm25) + (self.vector_weight * norm_vec)
                final_score = (0.6 * linear_score) + (0.4 * rrf_score)

            # Round to 3 decimal places and clamp
            final_score = round(min(max(final_score, 0.0), 1.0), 3)

            # Grounded explanation derived strictly from standard's scope & title
            explanation = self._generate_grounded_explanation(std, query_clean, data["matched_keywords"])

            # Extract matched requirement snippet
            matched_req = self._extract_matched_requirement(std, query_clean)

            scored_items.append({
                "id": std.get("id", std_no),
                "standard_no": std["standard_no"],
                "title": std["title"],
                "sector": std["sector"],
                "scope": std["scope"],
                "status": std.get("status", "active"),
                "superseded_by": std.get("superseded_by"),
                "current_version": std.get("current_version", std["standard_no"]),
                "relevance_score": final_score,
                "exact_boost": data.get("exact_boost", False),
                "bm25_score": round(data["bm25_raw"], 2),
                "vector_score": round(norm_vec, 3),
                "matched_keywords": data["matched_keywords"],
                "matched_requirement": matched_req,
                "explanation": explanation,
                "certification": std.get("certification"),
                "amendments": std.get("amendments", []),
                "allied_standards": std.get("related_standards", []),
                "source_ref": std.get("source_ref"),
                "source_url": std.get("source_url") or std.get("source_ref"),
                "last_verified_on": std.get("last_verified_on"),
                "status_verified": std.get("status_verified", False),
                "status_current": std.get("status_current", std.get("status", "active")),
                "status_in_text": std.get("status_in_text"),
                "qco_applicable": std.get("qco_applicable", True),
                "qco_reference": std.get("qco_reference"),
                "qco_verified": std.get("qco_verified", False),
                "verification_notes": std.get("verification_notes")
            })

        # Sort descending by relevance score
        scored_items.sort(key=lambda x: x["relevance_score"], reverse=True)
        top_results = scored_items[:top_k]
        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "query": query,
            "sector_filter": sector_filter,
            "total_results": len(top_results),
            "results": top_results,
            "retrieval_method": mode,
            "execution_time_ms": elapsed_ms
        }

    def _generate_grounded_explanation(self, std: Dict[str, Any], query: str, matched_keywords: List[str]) -> str:
        """Construct grounded justification purely from the official standard record without hallucination"""
        title = std.get("title", "")
        std_no = std.get("standard_no", "")
        scope = std.get("scope", "")
        sector = std.get("sector", "")

        matched_clause = f" Directly matches technical parameters: {', '.join(matched_keywords)}." if matched_keywords else ""

        # Ground explanation strictly in the standard's verified scope
        first_sentence = scope.split(".")[0] if "." in scope else scope
        explanation = (
            f"Recommended because {std_no} ({title}) governs requirements in the {sector} sector. "
            f"{first_sentence}.{matched_clause}"
        )
        return explanation

    def _extract_matched_requirement(self, std: Dict[str, Any], query: str) -> str:
        """Find the most relevant clause or sentence from standard scope matching user input"""
        scope = std.get("scope", "")
        sentences = [s.strip() for s in scope.split(".") if len(s.strip()) > 10]
        query_words = set(query.lower().split())

        best_sentence = sentences[0] if sentences else scope
        max_overlap = -1

        for sent in sentences:
            sent_words = set(sent.lower().split())
            overlap = len(query_words.intersection(sent_words))
            if overlap > max_overlap:
                max_overlap = overlap
                best_sentence = sent

        return best_sentence
