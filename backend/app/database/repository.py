"""Standards Knowledge Base Repository Layer"""
from typing import List, Optional, Tuple
import json
from sqlalchemy import select, func, or_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.db_models import StandardDB, AmendmentDB, CertificationDB, RelatedStandardDB
from app.models.schemas import StandardCreate, StandardUpdate, RelatedStandardCreate

class StandardsRepository:
    @staticmethod
    async def get_by_id(db: AsyncSession, standard_id: str) -> Optional[StandardDB]:
        stmt = (
            select(StandardDB)
            .where(StandardDB.id == standard_id)
            .options(
                selectinload(StandardDB.amendments),
                selectinload(StandardDB.certification),
                selectinload(StandardDB.related_standards),
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_standard_no(db: AsyncSession, standard_no: str) -> Optional[StandardDB]:
        stmt = (
            select(StandardDB)
            .where(func.lower(StandardDB.standard_no) == standard_no.strip().lower())
            .options(
                selectinload(StandardDB.amendments),
                selectinload(StandardDB.certification),
                selectinload(StandardDB.related_standards),
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def list_standards(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 50,
        sector: Optional[str] = None,
        status: Optional[str] = None,
        query: Optional[str] = None
    ) -> Tuple[List[StandardDB], int]:
        stmt = select(StandardDB).options(
            selectinload(StandardDB.amendments),
            selectinload(StandardDB.certification),
            selectinload(StandardDB.related_standards),
        )

        count_stmt = select(func.count(StandardDB.id))

        if sector:
            stmt = stmt.where(StandardDB.sector == sector)
            count_stmt = count_stmt.where(StandardDB.sector == sector)

        if status:
            stmt = stmt.where(StandardDB.status == status)
            count_stmt = count_stmt.where(StandardDB.status == status)

        if query:
            q_pattern = f"%{query.strip()}%"
            filter_expr = or_(
                StandardDB.standard_no.ilike(q_pattern),
                StandardDB.title.ilike(q_pattern),
                StandardDB.scope.ilike(q_pattern),
                StandardDB.keywords_json.ilike(q_pattern)
            )
            stmt = stmt.where(filter_expr)
            count_stmt = count_stmt.where(filter_expr)

        total = await db.scalar(count_stmt) or 0
        stmt = stmt.order_by(StandardDB.standard_no.asc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all()), total

    @staticmethod
    async def get_all_for_indexing(db: AsyncSession) -> List[StandardDB]:
        stmt = (
            select(StandardDB)
            .options(
                selectinload(StandardDB.amendments),
                selectinload(StandardDB.certification),
                selectinload(StandardDB.related_standards),
            )
            .order_by(StandardDB.standard_no.asc())
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def create(db: AsyncSession, data: StandardCreate, embedding: Optional[List[float]] = None) -> StandardDB:
        standard = StandardDB(
            standard_no=data.standard_no.strip(),
            title=data.title.strip(),
            sector=data.sector.strip(),
            scope=data.scope.strip(),
            status=data.status,
            superseded_by=data.superseded_by,
            current_version=data.current_version.strip(),
            source_ref=data.source_ref,
            source_url=data.source_url,
            last_verified_on=data.last_verified_on,
            status_verified=data.status_verified,
            status_current=data.status_current or data.status,
            status_in_text=data.status_in_text,
            qco_applicable=data.qco_applicable,
            qco_reference=data.qco_reference,
            qco_verified=data.qco_verified,
            verification_notes=data.verification_notes,
            source_type=data.source_type or "PENDING_VERIFICATION",
            source_authority=data.source_authority,
            source_verified=data.source_verified,
            source_verified_on=data.source_verified_on,
            source_title=data.source_title,
            source_document_type=data.source_document_type,
            official_source_url=data.official_source_url,
            secondary_source_url=data.secondary_source_url,
            discovery_source_url=data.discovery_source_url,
            source_verification_status=data.source_verification_status or "pending",
            status_source_url=data.status_source_url,
            status_verified_on=data.status_verified_on,
            relationship_source_url=data.relationship_source_url,
            relationship_verified=data.relationship_verified,
            qco_source_verified=data.qco_source_verified,
            gazette_verified=data.gazette_verified,
            gazette_url=data.gazette_url,
            qco_source_url=data.qco_source_url,
        )
        standard.keywords = data.keywords
        if embedding:
            standard.embedding = embedding

        db.add(standard)
        await db.flush()

        # Add Amendments
        for am in data.amendments:
            amendment = AmendmentDB(
                standard_id=standard.id,
                amendment_no=am.amendment_no,
                issue_date=am.issue_date,
                details=am.details
            )
            db.add(amendment)

        # Add Certification
        if data.certification and data.certification.scheme:
            cert = CertificationDB(
                standard_id=standard.id,
                scheme=data.certification.scheme,
                is_mandatory=data.certification.is_mandatory,
                order_name=data.certification.order_name,
                notifying_ministry=data.certification.notifying_ministry,
                details=data.certification.details
            )
            db.add(cert)

        # Add Related Standards
        for rel in data.related_standards:
            t_std = rel.target_standard_no or rel.standard_no or ""
            related = RelatedStandardDB(
                source_standard_id=standard.id,
                standard_no=rel.standard_no or t_std,
                target_standard_no=t_std.strip(),
                target_title=rel.target_title,
                relation_type=rel.relation_type,
                relation_verified=rel.relation_verified,
                description=rel.description
            )
            db.add(related)

        await db.commit()
        await db.refresh(standard)
        return standard

    @staticmethod
    async def update(db: AsyncSession, standard_id: str, data: StandardUpdate) -> Optional[StandardDB]:
        standard = await StandardsRepository.get_by_id(db, standard_id)
        if not standard:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "keywords":
                standard.keywords = value
            else:
                setattr(standard, field, value)

        await db.commit()
        await db.refresh(standard)
        return standard

    @staticmethod
    async def delete(db: AsyncSession, standard_id: str) -> bool:
        standard = await StandardsRepository.get_by_id(db, standard_id)
        if not standard:
            return False
        await db.delete(standard)
        await db.commit()
        return True
