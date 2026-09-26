"""Search & Retrieval API Router for ManakSetu"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.database.repository import StandardsRepository
from app.models.schemas import SearchRequest, SearchResponse
from app.services.bm25_search import BM25SearchService
from app.services.vector_search import VectorSearchService
from app.services.hybrid_search import HybridSearchEngine

router = APIRouter(prefix="/search", tags=["Search & Retrieval"])

# Global search services loaded during application lifespan
bm25_service = BM25SearchService()
vector_service = VectorSearchService()
hybrid_engine = HybridSearchEngine(bm25_service, vector_service)

async def refresh_search_index(db: AsyncSession):
    """Load standards from DB into BM25 and Vector indices"""
    standards = await StandardsRepository.get_all_for_indexing(db)
    corpus = []
    precomputed_embs = []

    for s in standards:
        item = {
            "id": s.id,
            "standard_no": s.standard_no,
            "title": s.title,
            "sector": s.sector,
            "scope": s.scope,
            "status": s.status,
            "superseded_by": s.superseded_by,
            "current_version": s.current_version,
            "keywords": s.keywords,
            "source_ref": s.source_ref,
            "source_url": s.source_url,
            "last_verified_on": s.last_verified_on,
            "status_verified": s.status_verified,
            "status_current": s.status_current,
            "status_in_text": s.status_in_text,
            "qco_applicable": s.qco_applicable,
            "qco_reference": s.qco_reference,
            "qco_verified": s.qco_verified,
            "verification_notes": s.verification_notes,
            "certification": {
                "scheme": s.certification.scheme,
                "is_mandatory": s.certification.is_mandatory,
                "order_name": s.certification.order_name,
                "notifying_ministry": s.certification.notifying_ministry,
                "details": s.certification.details
            } if s.certification else None,
            "amendments": [
                {
                    "amendment_no": a.amendment_no,
                    "issue_date": a.issue_date,
                    "details": a.details
                }
                for a in s.amendments
            ],
            "related_standards": [
                {
                    "standard_no": r.standard_no or r.target_standard_no,
                    "target_standard_no": r.target_standard_no,
                    "target_title": r.target_title,
                    "relation_type": r.relation_type,
                    "relation_verified": r.relation_verified,
                    "description": r.description
                }
                for r in s.related_standards
            ]
        }
        corpus.append(item)
        precomputed_embs.append(s.embedding)

    bm25_service.index_standards(corpus)

    # If all embeddings exist in DB, use them directly; otherwise recompute
    if all(e is not None for e in precomputed_embs) and len(precomputed_embs) == len(corpus):
        vector_service.index_standards(corpus, precomputed_embeddings=precomputed_embs)
    else:
        vector_service.index_standards(corpus)

@router.post("", response_model=SearchResponse)
async def perform_search(req: SearchRequest, db: AsyncSession = Depends(get_db)):
    """Primary hybrid retrieval endpoint.
    Retrieves and ranks Indian Standards using BM25 keyword matching + FastEmbed semantic vectors.
    """
    if not hybrid_engine.bm25.standards_corpus:
        await refresh_search_index(db)

    result = hybrid_engine.search(
        query=req.query,
        top_k=req.top_k,
        sector_filter=req.sector,
        mode=req.search_mode
    )

    return SearchResponse(**result)

@router.get("/quick", response_model=SearchResponse)
async def quick_search(
    q: str = Query(..., min_length=2, description="Search query"),
    sector: Optional[str] = Query(None, description="Sector filter"),
    mode: str = Query("hybrid", description="hybrid, semantic, or keyword"),
    top_k: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Quick GET endpoint for search-as-you-type and quick queries"""
    if not hybrid_engine.bm25.standards_corpus:
        await refresh_search_index(db)

    result = hybrid_engine.search(
        query=q,
        top_k=top_k,
        sector_filter=sector,
        mode=mode
    )

    return SearchResponse(**result)
