"""Validation and Unit Tests for ManakSetu Hybrid Retrieval Engine & Database"""
import asyncio
from app.database.session import AsyncSessionLocal, init_db
from app.database.repository import StandardsRepository
from app.api.search import hybrid_engine, refresh_search_index

def run_async(coro):
    """Helper to run async coroutines in synchronous pytest tests"""
    return asyncio.run(coro)

def test_database_has_curated_standards():
    async def _test():
        await init_db()
        async with AsyncSessionLocal() as db:
            standards, total = await StandardsRepository.list_standards(db, limit=100)
            assert total >= 40, f"Expected at least 40 curated standards, found {total}"
            
            # Verify IS 2925 exists with certification and amendments
            helmet_std = await StandardsRepository.get_by_standard_no(db, "IS 2925:1984")
            assert helmet_std is not None
            assert helmet_std.sector == "PPE & Safety Equipment"
            assert helmet_std.certification is not None
            assert helmet_std.certification.scheme == "BIS Product Certification"
            assert len(helmet_std.amendments) >= 3
            assert len(helmet_std.related_standards) >= 4
    run_async(_test())

def test_bm25_keyword_retrieval():
    """Verify BM25 keyword matching for exact engineering terms"""
    async def _test():
        async with AsyncSessionLocal() as db:
            await refresh_search_index(db)
        results = hybrid_engine.bm25.search("copper conductor 1100V building wire", top_k=5)
        assert len(results) > 0
        top_standard, score, matched = results[0]
        assert top_standard["standard_no"] == "IS 694:2010"
        assert "1100v" in matched or "copper" in matched or "wire" in matched
    run_async(_test())

def test_vector_semantic_retrieval():
    """Verify semantic search retrieves the correct standard without direct keyword overlap"""
    # Natural language query without saying "IS 2925" or "hard hat"
    query = "head protection gear to shield construction laborers against impact from falling debris and tools"
    results = hybrid_engine.vector.search(query, top_k=5)
    assert len(results) > 0
    top_standard, sim_score = results[0]
    assert top_standard["standard_no"] in ["IS 2925:1984", "IS 16890:2018"]
    assert sim_score > 0.55

def test_hybrid_search_fusion():
    """Verify hybrid search combines vector and BM25 scores and attaches full DB metadata"""
    query = "TMT high strength steel bars Fe 500D for earthquake resistant concrete structures"
    res = hybrid_engine.search(query, top_k=5, mode="hybrid")
    
    assert res["total_results"] > 0
    top_hit = res["results"][0]
    assert top_hit["standard_no"] == "IS 1786:2008"
    assert top_hit["relevance_score"] >= 0.70
    assert top_hit["certification"] is not None
    assert top_hit["certification"]["scheme"] == "BIS Product Certification"
    assert top_hit["certification"]["is_mandatory"] is True
    assert len(top_hit["allied_standards"]) > 0

def test_superseded_detection():
    """Verify that querying for old superseded standards flags them with replacement standard"""
    res = hybrid_engine.search("Ordinary Portland Cement 53 grade IS 12269", top_k=5, mode="hybrid")
    assert res["total_results"] > 0
    
    # Check if IS 12269 is flagged as superseded
    found_superseded = False
    for item in res["results"]:
        if item["standard_no"] == "IS 12269:2013":
            assert item["status"] == "superseded"
            assert item["superseded_by"] == "IS 269:2015"
            found_superseded = True
            break
    assert found_superseded, "Superseded standard IS 12269 should be retrieved and flagged"

def test_allied_standards_relation_types():
    """Verify allied standards retain their authentic relationship types"""
    res = hybrid_engine.search("safety footwear with steel toe cap", top_k=5, mode="hybrid")
    assert res["total_results"] > 0
    top_hit = res["results"][0]
    assert top_hit["standard_no"] == "IS 15298 (Part 2):2016"
    
    relation_types = [a["relation_type"] for a in top_hit["allied_standards"]]
    assert "test_method" in relation_types # Points to IS 15298 Part 1
    assert "normative_reference" in relation_types or "related_product" in relation_types
