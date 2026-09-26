"""Integration Test for FastAPI Endpoints"""
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

def run_async(coro):
    return asyncio.run(coro)

def test_api_health():
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res = await client.get("/api/v1/health")
            assert res.status_code == 200
            data = res.json()
            assert data["status"] == "healthy"
            assert data["knowledge_base_stats"]["total_standards"] >= 40
            assert "Zero Hallucination" in data["architecture_guarantee"]["principle"]
    run_async(_test())

def test_api_list_standards():
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res = await client.get("/api/v1/standards?limit=10")
            assert res.status_code == 200
            data = res.json()
            assert data["total"] >= 40
            assert len(data["items"]) == 10
            first_std = data["items"][0]
            assert "standard_no" in first_std
            assert "current_version" in first_std
    run_async(_test())

def test_api_get_sectors():
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res = await client.get("/api/v1/standards/sectors")
            assert res.status_code == 200
            sectors = res.json()
            assert len(sectors) >= 3
            sector_names = [s["sector"] for s in sectors]
            assert "PPE & Safety Equipment" in sector_names
            assert "Electrical & Power" in sector_names
            assert "Civil & Construction" in sector_names
    run_async(_test())

def test_api_search_endpoint():
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "query": "Tender specification for supply of 1100V grade PVC insulated flame retardant copper wire for internal electrification",
                "top_k": 3,
                "search_mode": "hybrid"
            }
            res = await client.post("/api/v1/search", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["total_results"] > 0
            top_res = data["results"][0]
            assert top_res["standard_no"] == "IS 694:2010"
            assert top_res["certification"]["scheme"] == "BIS Product Certification"
            assert top_res["certification"]["is_mandatory"] is True
            assert "Zero synthetic standard numbers" in data["anti_hallucination_guarantee"]
    run_async(_test())

def test_api_allied_standards_endpoint():
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # First find ID of IS 2925
            res = await client.get("/api/v1/standards?query=IS 2925")
            assert res.status_code == 200
            data = res.json()
            std_id = data["items"][0]["id"]

            # Query allied standards
            allied_res = await client.get(f"/api/v1/standards/{std_id}/allied")
            assert allied_res.status_code == 200
            allied_data = allied_res.json()
            assert allied_data["total_allied_standards"] >= 4
            assert "test_method" in allied_data["grouped_by_type"]
            assert "safety" in allied_data["grouped_by_type"]
    run_async(_test())
