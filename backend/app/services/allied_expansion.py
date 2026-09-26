"""Allied Standards Expansion Module
Resolves normative references, test methods, terminology, safety, installation,
and related product standards from the verified knowledge base.
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.repository import StandardsRepository
from app.models.db_models import StandardDB

class AlliedExpansionService:
    @staticmethod
    async def expand_allied_standards(db: AsyncSession, standard: StandardDB) -> Dict[str, Any]:
        """Expand and enrich allied standards for a given standard"""
        grouped_relations = {
            "normative_reference": [],
            "test_method": [],
            "terminology": [],
            "safety": [],
            "installation": [],
            "related_product": []
        }

        allied_items = []

        for rel in standard.related_standards:
            target_no = rel.target_standard_no
            rel_type = rel.relation_type
            description = rel.description
            target_title = rel.target_title

            # Check if target standard exists in the knowledge base
            target_db = await StandardsRepository.get_by_standard_no(db, target_no)

            item = {
                "standard_no": target_no,
                "title": target_db.title if target_db else (target_title or "Standard specification"),
                "relation_type": rel_type,
                "description": description or (target_db.scope[:140] + "..." if target_db else None),
                "is_in_kb": target_db is not None,
                "status": target_db.status if target_db else "active",
                "current_version": target_db.current_version if target_db else target_no,
                "sector": target_db.sector if target_db else standard.sector,
                "certification_required": (
                    target_db.certification.scheme if target_db and target_db.certification else None
                )
            }

            allied_items.append(item)
            if rel_type in grouped_relations:
                grouped_relations[rel_type].append(item)
            else:
                grouped_relations["related_product"].append(item)

        return {
            "standard_no": standard.standard_no,
            "title": standard.title,
            "total_allied_standards": len(allied_items),
            "allied_standards": allied_items,
            "grouped_by_type": grouped_relations
        }
