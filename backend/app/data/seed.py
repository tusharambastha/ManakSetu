"""Database Seeding Script for ManakSetu Standards Knowledge Base"""
import sys
import json
import asyncio
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

from app.database.session import init_db_sync, AsyncSessionLocal
from app.database.repository import StandardsRepository
from app.models.schemas import StandardCreate, AmendmentBase, CertificationBase, RelatedStandardBase
from app.services.vector_search import VectorSearchService

DATA_FILE = Path(__file__).parent / "standards_dataset.json"

async def seed_database():
    print(f"Loading standards dataset from {DATA_FILE}...")
    if not DATA_FILE.exists():
        print(f"Error: {DATA_FILE} not found. Run build_seed_data.py first.")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        standards_data = json.load(f)

    print(f"Loaded {len(standards_data)} curated Indian Standards. Initializing database tables...")
    init_db_sync()

    print("Generating dense vector embeddings using local FastEmbed model...")
    vector_service = VectorSearchService()

    async with AsyncSessionLocal() as db:
        for idx, item in enumerate(standards_data, start=1):
            std_no = item["standard_no"]
            
            # Check if standard already exists
            existing = await StandardsRepository.get_by_standard_no(db, std_no)
            if existing:
                print(f"[{idx}/{len(standards_data)}] Standard {std_no} already exists, skipping.")
                continue

            # Build representation text for embedding
            kw_str = ", ".join(item.get("keywords", []))
            rep_text = f"Indian Standard {std_no}: {item['title']}. Sector: {item['sector']}. Scope: {item['scope']}. Keywords: {kw_str}"
            embedding = vector_service.embed_text(rep_text)

            # Construct Pydantic DTO
            amendments_in = [
                AmendmentBase(
                    amendment_no=am["amendment_no"],
                    issue_date=am.get("issue_date"),
                    details=am.get("details")
                )
                for am in item.get("amendments", [])
            ]

            cert_data = item.get("certification")
            cert_in = None
            if cert_data:
                cert_in = CertificationBase(
                    scheme=cert_data.get("scheme"),
                    is_mandatory=cert_data.get("is_mandatory", True),
                    order_name=cert_data.get("order_name"),
                    notifying_ministry=cert_data.get("notifying_ministry"),
                    details=cert_data.get("details")
                )

            related_in = [
                RelatedStandardBase(
                    standard_no=rel.get("standard_no") or rel.get("target_standard_no"),
                    target_standard_no=rel.get("target_standard_no") or rel.get("standard_no"),
                    target_title=rel.get("target_title"),
                    relation_type=rel["relation_type"],
                    relation_verified=rel.get("relation_verified", False),
                    description=rel.get("description")
                )
                for rel in item.get("related_standards", [])
            ]

            std_in = StandardCreate(
                standard_no=std_no,
                title=item["title"],
                sector=item["sector"],
                scope=item["scope"],
                status=item.get("status", "active"),
                superseded_by=item.get("superseded_by"),
                current_version=item.get("current_version", std_no),
                keywords=item.get("keywords", []),
                source_ref=item.get("source_ref"),
                source_url=item.get("source_url") or item.get("source_ref"),
                last_verified_on=item.get("last_verified_on"),
                status_verified=item.get("status_verified", False),
                status_current=item.get("status_current", item.get("status", "active")),
                status_in_text=item.get("status_in_text"),
                qco_applicable=item.get("qco_applicable", True),
                qco_reference=item.get("qco_reference"),
                qco_verified=item.get("qco_verified", False),
                verification_notes=item.get("verification_notes"),
                source_type=item.get("source_type", "PENDING_VERIFICATION"),
                source_authority=item.get("source_authority"),
                source_verified=item.get("source_verified", False),
                source_verified_on=item.get("source_verified_on") or item.get("last_verified_on"),
                source_title=item.get("source_title"),
                source_document_type=item.get("source_document_type"),
                official_source_url=item.get("official_source_url"),
                secondary_source_url=item.get("secondary_source_url"),
                discovery_source_url=item.get("discovery_source_url"),
                source_verification_status=item.get("source_verification_status", "pending"),
                status_source_url=item.get("status_source_url") or item.get("official_source_url") or item.get("source_url"),
                status_verified_on=item.get("status_verified_on") or item.get("last_verified_on"),
                relationship_source_url=item.get("relationship_source_url"),
                relationship_verified=item.get("relationship_verified", False),
                qco_source_verified=item.get("qco_source_verified", False),
                gazette_verified=item.get("gazette_verified", False),
                gazette_url=item.get("gazette_url"),
                qco_source_url=item.get("qco_source_url"),
                amendments=amendments_in,
                certification=cert_in,
                related_standards=related_in
            )

            await StandardsRepository.create(db, std_in, embedding=embedding)
            print(f"[{idx}/{len(standards_data)}] Seeded {std_no}: {item['title'][:45]}...")

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
