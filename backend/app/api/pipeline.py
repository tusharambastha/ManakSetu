"""Tender Analysis & Pipeline API Router
Full pipeline: Document parsing -> NLP extraction -> Hybrid retrieval -> Grounded re-ranking -> History logging
"""
import uuid
import json
import time
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel, Field

from app.database.session import get_db
from app.models.db_models import AnalysisHistoryDB
from app.services.document_parser import DocumentParserService
from app.services.nlp_extractor import NLPExtractorService
from app.services.reranker import GroundedReranker
from app.services.compliance_intelligence import TenderComplianceIntelligence
from app.api.search import hybrid_engine, refresh_search_index

router = APIRouter(prefix="/analyze", tags=["Tender Analysis Pipeline"])

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=3, description="Tender specification or product description")
    sector: Optional[str] = Field(None, description="Optional sector filter")
    top_k: int = Field(5, ge=1, le=20)
    session_id: Optional[str] = Field(None, description="Client session ID for history")

DEMO_QUERIES = [
    {
        "id": "demo-ppe-helmet",
        "title": "Industrial Safety Helmets (PPE)",
        "sector": "PPE & Safety Equipment",
        "query": "Supply of heavy-duty industrial safety helmets with electrical insulation up to 440V, chinstrap, harness, and shock absorption for construction site engineers.",
        "expected_standard": "IS 2925:1984"
    },
    {
        "id": "demo-ppe-shoes",
        "title": "Safety Footwear with Steel Toe (PPE)",
        "sector": "PPE & Safety Equipment",
        "query": "Procurement of safety footwear leather shoes with 200 Joules steel toe cap impact resistance, slip resistance, and anti-static outsole for factory floor technicians.",
        "expected_standard": "IS 15298 (Part 2):2016"
    },
    {
        "id": "demo-elec-cable",
        "title": "PVC Insulated Building Wires (Electrical)",
        "sector": "Electrical & Power",
        "query": "Tender specification for supply of single core and multicore flexible PVC insulated copper conductor cables rated for 1100V working voltage with flame retardant FRLS properties.",
        "expected_standard": "IS 694:2010"
    },
    {
        "id": "demo-elec-mcb",
        "title": "Miniature Circuit Breakers - MCB (Electrical)",
        "sector": "Electrical & Power",
        "query": "Supply of 10kA breaking capacity C-curve miniature circuit breakers (MCB) 16A, 32A, and 63A for household and commercial distribution boards.",
        "expected_standard": "IS/IEC 60898-1:2015"
    },
    {
        "id": "demo-civil-tmt",
        "title": "Earthquake Resistant TMT Steel Rebars (Civil)",
        "sector": "Civil & Construction",
        "query": "Supply of high strength deformed steel bars Fe 500D with minimum 16% elongation and seismic ductile detailing for reinforced concrete bridge piers.",
        "expected_standard": "IS 1786:2008"
    },
    {
        "id": "demo-civil-pipe",
        "title": "HDPE Water Supply Pipes - JJM (Civil)",
        "sector": "Civil & Construction",
        "query": "Procurement of PE 100 high density polyethylene (HDPE) pipes PN 10 and PN 16 pressure classes for rural potable drinking water supply under Jal Jeevan Mission.",
        "expected_standard": "IS 4984:2016"
    },
    {
        "id": "demo-hindi-multilingual",
        "title": "Hindi Natural Language Query (Multilingual)",
        "sector": "Electrical & Power",
        "query": "हमें 1100V वोल्टेज के लिए तांबे के बिजली के तार (copper wire) और एमसीबी स्विच की आपूर्ति की आवश्यकता है।",
        "expected_standard": "IS 694:2010"
    },
    {
        "id": "demo-amber-cement",
        "title": "53 Grade OPC Cement (IS 12269 Deprecation Shield)",
        "sector": "Civil & Construction",
        "query": "Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 for multi-storey prestressed concrete construction works.",
        "expected_standard": "IS 269:2015"
    },
    {
        "id": "demo-compliance-audit",
        "title": "⚡ Multi-Issue Compliance Audit Demo (Controlled Test)",
        "sector": "Multi-Sector Infrastructure",
        "query": "Clause 4: Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 for multi-storey prestressed concrete construction works.\nClause 8: Supply of PVC insulated copper electrical wiring for site installation.\nClause 12: Heavy-duty industrial safety helmets with electrical insulation rating up to 415V.\nClause 16: Supply of industrial electrical equipment with rated operating voltage of 440V.",
        "expected_standard": "IS 269:2015, IS 694:2010, IS 2925:1984"
    }
]

@router.get("/demo-queries")
def get_demo_queries():
    """Return verified demo queries for hackathon presentation and quick testing"""
    return DEMO_QUERIES

async def execute_pipeline(
    raw_text: str,
    sector_filter: Optional[str],
    top_k: int,
    session_id: Optional[str],
    document_meta: Optional[Dict[str, Any]],
    db: AsyncSession
) -> Dict[str, Any]:
    """Core end-to-end execution pipeline"""
    start_time = time.time()

    # Ensure search engine is warmed up
    if not hybrid_engine.bm25.standards_corpus:
        await refresh_search_index(db)

    # 1. NLP Extraction & Multilingual Normalization
    nlp_res = NLPExtractorService.extract_structured_requirements(raw_text)

    # Effective sector: user filter takes precedence, else inferred sector
    target_sector = sector_filter or nlp_res["inferred_sector"]

    # 2. Hybrid Retrieval
    search_query = nlp_res["search_query"]
    retrieval_res = hybrid_engine.search(
        query=search_query,
        top_k=top_k * 2,
        sector_filter=target_sector,
        mode="hybrid"
    )

    # 3. Grounded Re-ranking & Justification
    rerank_res = GroundedReranker.rerank_and_explain(
        candidates=retrieval_res["results"],
        extracted_reqs=nlp_res
    )

    final_results = rerank_res["ranked_results"][:top_k]
    elapsed_ms = round((time.time() - start_time) * 1000, 2)

    # 4. Tender Compliance Intelligence Layer
    compliance_report = TenderComplianceIntelligence.analyze_compliance(
        raw_text=raw_text,
        extracted_reqs=nlp_res,
        recommended_standards=final_results,
        confident_match_found=rerank_res["confident_match_found"],
        all_standards=hybrid_engine.bm25.standards_corpus
    )

    # 5. Audit Log in Analysis History (skip for automated tests to keep user history clean)
    analysis_id = str(uuid.uuid4())
    is_test_session = session_id and any(session_id.startswith(p) for p in ("test", "pytest", "automated", "mock"))
    if not is_test_session:
        try:
            history_entry = AnalysisHistoryDB(
                id=analysis_id,
                session_id=session_id or "officer-session",
                query_text=raw_text[:2000],
                extracted_parameters_json=json.dumps(nlp_res, ensure_ascii=False),
                matched_standards_json=json.dumps(
                    [
                        {
                            "standard_no": r["standard_no"],
                            "title": r["title"],
                            "score": r["relevance_score"],
                            "status": r["status"]
                        }
                        for r in final_results
                    ],
                    ensure_ascii=False
                )
            )
            db.add(history_entry)
            await db.commit()
        except Exception as e:
            # Don't fail the request if history logging encounters an issue
            await db.rollback()

    return {
        "analysis_id": analysis_id,
        "execution_time_ms": elapsed_ms,
        "confident_match_found": rerank_res["confident_match_found"],
        "pipeline_message": rerank_res["message"],
        "detected_language": nlp_res.get("detected_language", "en"),
        "detected_standards": nlp_res.get("detected_standards", []),
        "extracted_requirements": {
            "product_type": nlp_res["product_type"],
            "inferred_sector": nlp_res["inferred_sector"],
            "technical_parameters": nlp_res["technical_parameters"],
            "was_multilingual": nlp_res["was_multilingual"],
            "detected_language": nlp_res.get("detected_language", "en"),
            "detected_standards": nlp_res.get("detected_standards", []),
            "original_query": raw_text,
            "normalized_query": nlp_res["normalized_text"][:250],
            "keywords": nlp_res["keywords"]
        },
        "document_metadata": document_meta,
        "recommended_standards": final_results,
        "compliance_report": compliance_report,
        "anti_hallucination_guarantee": (
            "All recommended standard numbers, titles, scopes, versions, amendments, and certification schemes "
            "are verified records retrieved directly from the local BIS database. Zero synthetic standard numbers."
        )
    }

@router.post("", response_model=dict)
async def analyze_text(payload: TextAnalysisRequest, db: AsyncSession = Depends(get_db)):
    """Analyze plain text specification or tender excerpt"""
    return await execute_pipeline(
        raw_text=payload.text,
        sector_filter=payload.sector,
        top_k=payload.top_k,
        session_id=payload.session_id,
        document_meta=None,
        db=db
    )

@router.post("/upload", response_model=dict)
async def analyze_file(
    file: UploadFile = File(..., description="Tender document in PDF or DOCX format"),
    sector: Optional[str] = Form(None),
    top_k: int = Form(5),
    session_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """Analyze uploaded tender document (PDF or DOCX), extracting technical specification section"""
    filename = file.filename.lower() if file.filename else ""
    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a PDF (.pdf) or Microsoft Word (.docx) document."
        )

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        if filename.endswith(".pdf"):
            parse_result = DocumentParserService.parse_pdf(file_bytes)
        else:
            parse_result = DocumentParserService.parse_docx(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Error parsing document: {str(e)}")

    extracted_text = parse_result["extracted_spec"]
    if not extracted_text or len(extracted_text.strip()) < 10:
        raise HTTPException(
            status_code=422,
            detail="Could not extract readable text from document. Ensure it contains selectable text and is not a scanned image."
        )

    doc_meta = {
        "filename": file.filename,
        "total_pages": parse_result["total_pages"],
        "total_chars": parse_result["total_chars"],
        "section_isolated": parse_result["section_isolated"],
        "preview": extracted_text[:350] + "..." if len(extracted_text) > 350 else extracted_text
    }

    return await execute_pipeline(
        raw_text=extracted_text,
        sector_filter=sector,
        top_k=top_k,
        session_id=session_id,
        document_meta=doc_meta,
        db=db
    )

@router.get("/history", response_model=dict)
async def get_analysis_history(
    limit: int = Query(30, ge=1, le=100),
    session_id: Optional[str] = Query(None),
    all_sessions: bool = Query(False),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve past analyses audit trail"""
    base_stmt = select(AnalysisHistoryDB).order_by(desc(AnalysisHistoryDB.created_at))
    
    items = []
    if session_id and not all_sessions:
        stmt = base_stmt.where(AnalysisHistoryDB.session_id == session_id).limit(limit)
        result = await db.execute(stmt)
        items = result.scalars().all()
    
    # Fallback to recent portal analyses if this specific session has no records yet
    if not items:
        stmt = base_stmt.limit(limit)
        result = await db.execute(stmt)
        items = result.scalars().all()

    return {
        "total": len(items),
        "history": [
            {
                "id": h.id,
                "session_id": h.session_id,
                "query_text": h.query_text,
                "query_preview": h.query_text[:140] + "..." if len(h.query_text) > 140 else h.query_text,
                "created_at": h.created_at.isoformat() if h.created_at else None,
                "matched_standards": json.loads(h.matched_standards_json) if h.matched_standards_json else []
            }
            for h in items
        ]
    }

@router.delete("/history", response_model=dict)
async def clear_analysis_history(
    session_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Clear past analyses audit history"""
    from sqlalchemy import delete
    stmt = delete(AnalysisHistoryDB)
    if session_id:
        stmt = stmt.where(AnalysisHistoryDB.session_id == session_id)
    await db.execute(stmt)
    await db.commit()
    return {"message": "Analysis history cleared successfully."}

