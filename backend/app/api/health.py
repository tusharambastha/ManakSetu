"""Health and Architecture Status API Router"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.session import get_db
from app.models.db_models import StandardDB
from app.config import settings
from app.api.search import hybrid_engine

router = APIRouter(tags=["System Health & Architecture"])

@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """System status and anti-hallucination verification status"""
    total_standards = await db.scalar(select(func.count(StandardDB.id))) or 0
    active_standards = await db.scalar(select(func.count(StandardDB.id)).where(StandardDB.status == "active")) or 0
    superseded_standards = await db.scalar(select(func.count(StandardDB.id)).where(StandardDB.status == "superseded")) or 0
    verified_standards = await db.scalar(select(func.count(StandardDB.id)).where(StandardDB.status_verified.is_(True))) or 0
    mandatory_qcos = await db.scalar(select(func.count(StandardDB.id)).where(StandardDB.qco_verified.is_(True))) or 0

    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "architecture_guarantee": {
            "principle": "Retrieval-First, Generation-Second (Zero Hallucination)",
            "rule": "All standard numbers, titles, scopes, versions, and certification schemes are verified records from local DB, never generated freely.",
            "embedding_model": settings.EMBEDDING_MODEL_NAME,
            "embedding_dim": settings.EMBEDDING_DIM,
            "hybrid_fusion": f"BM25 ({settings.HYBRID_BM25_WEIGHT}) + Dense Vectors ({settings.HYBRID_VECTOR_WEIGHT}) + RRF"
        },
        "knowledge_base_stats": {
            "total_standards": total_standards,
            "active_standards": active_standards,
            "superseded_standards": superseded_standards,
            "verified_standards": verified_standards,
            "mandatory_qcos": mandatory_qcos,
            "indexed_in_memory": len(hybrid_engine.bm25.standards_corpus)
        }
    }
