"""Standards API Router: Standards Management & CRUD"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.session import get_db
from app.database.repository import StandardsRepository
from app.models.db_models import StandardDB
from app.models.schemas import (
    StandardResponse,
    StandardCreate,
    StandardUpdate,
    StandardStatus
)
from app.services.allied_expansion import AlliedExpansionService
from app.services.vector_search import VectorSearchService
from app.api.search import refresh_search_index
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/standards", tags=["Standards Knowledge Base"])
vector_service = VectorSearchService()

@router.get("", response_model=dict)
async def list_standards(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    sector: Optional[str] = None,
    status: Optional[StandardStatus] = None,
    query: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List Indian Standards with filtering and pagination"""
    standards, total = await StandardsRepository.list_standards(
        db, skip=skip, limit=limit, sector=sector, status=status, query=query
    )
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "items": [StandardResponse.model_validate(s) for s in standards]
    }

@router.get("/sectors", response_model=List[dict])
async def list_sectors(db: AsyncSession = Depends(get_db)):
    """List available sectors with standard counts"""
    stmt = (
        select(StandardDB.sector, func.count(StandardDB.id))
        .group_by(StandardDB.sector)
        .order_by(StandardDB.sector.asc())
    )
    result = await db.execute(stmt)
    return [{"sector": row[0], "count": row[1]} for row in result.all()]

@router.get("/code/{standard_no:path}", response_model=StandardResponse)
async def get_standard_by_no(standard_no: str, db: AsyncSession = Depends(get_db)):
    """Look up a standard by its exact IS standard number (e.g. IS 2925:1984)"""
    standard = await StandardsRepository.get_by_standard_no(db, standard_no)
    if not standard:
        raise HTTPException(status_code=404, detail=f"Standard '{standard_no}' not found in verified database.")
    return StandardResponse.model_validate(standard)

@router.get("/{standard_id}", response_model=StandardResponse)
async def get_standard_by_id(standard_id: str, db: AsyncSession = Depends(get_db)):
    """Get full details of a standard by ID"""
    standard = await StandardsRepository.get_by_id(db, standard_id)
    if not standard:
        raise HTTPException(status_code=404, detail="Standard not found.")
    return StandardResponse.model_validate(standard)

@router.get("/{standard_id}/allied", response_model=dict)
async def get_allied_standards(standard_id: str, db: AsyncSession = Depends(get_db)):
    """Get rich allied standards expansion for a standard"""
    standard = await StandardsRepository.get_by_id(db, standard_id)
    if not standard:
        raise HTTPException(status_code=404, detail="Standard not found.")
    return await AlliedExpansionService.expand_allied_standards(db, standard)

@router.post("", response_model=StandardResponse, status_code=status.HTTP_201_CREATED)
async def create_standard(data: StandardCreate, db: AsyncSession = Depends(get_db)):
    """Admin endpoint to create and index a new verified Indian Standard"""
    existing = await StandardsRepository.get_by_standard_no(db, data.standard_no)
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Standard with code '{data.standard_no}' already exists in database."
        )

    # Compute embedding for new standard
    kw_str = ", ".join(data.keywords)
    rep_text = f"Indian Standard {data.standard_no}: {data.title}. Sector: {data.sector}. Scope: {data.scope}. Keywords: {kw_str}"
    embedding = vector_service.embed_text(rep_text)

    created = await StandardsRepository.create(db, data, embedding=embedding)
    try:
        await refresh_search_index(db)
    except Exception as e:
        logger.warning(f"Could not refresh search index after create: {e}")
    return StandardResponse.model_validate(created)

@router.put("/{standard_id}", response_model=StandardResponse)
async def update_standard(standard_id: str, data: StandardUpdate, db: AsyncSession = Depends(get_db)):
    """Admin endpoint to update standard metadata (e.g. mark superseded)"""
    updated = await StandardsRepository.update(db, standard_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Standard not found.")
    try:
        await refresh_search_index(db)
    except Exception as e:
        logger.warning(f"Could not refresh search index after update: {e}")
    return StandardResponse.model_validate(updated)

@router.delete("/{standard_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_standard(standard_id: str, db: AsyncSession = Depends(get_db)):
    """Admin endpoint to delete a standard record"""
    success = await StandardsRepository.delete(db, standard_id)
    if not success:
        raise HTTPException(status_code=404, detail="Standard not found.")
    try:
        await refresh_search_index(db)
    except Exception as e:
        logger.warning(f"Could not refresh search index after delete: {e}")
    return None
