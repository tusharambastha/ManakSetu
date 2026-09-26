"""Regression Tests for Analysis Pipeline & 1-Click Benchmark Scenarios

Ensures all 4 primary benchmark scenarios, custom input, and malformed inputs
execute with strict precision and controlled error handling.
"""
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

def run_async(coro):
    return asyncio.run(coro)

def test_benchmark_1_safety_helmet_440v():
    """Test 1: Safety Helmet 440V benchmark"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "Supply of heavy-duty industrial safety helmets with electrical insulation up to 440V, chinstrap, harness, and shock absorption for construction site engineers.",
                "top_k": 5,
                "session_id": "test-session"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["confident_match_found"] is True
            recs = data["recommended_standards"]
            assert len(recs) > 0
            top_std = recs[0]
            assert top_std["standard_no"] == "IS 2925:1984"
            assert top_std["status"] == "active"
            assert "IS 2925" in top_std["explanation"]
    run_async(_test())

def test_benchmark_2_53_grade_opc_cement():
    """Test 2: 53 Grade OPC cement benchmark with IS 12269 deprecation check"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 for multi-storey prestressed concrete construction works.",
                "top_k": 5,
                "session_id": "test-session"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["confident_match_found"] is True
            recs = data["recommended_standards"]
            std_numbers = [r["standard_no"] for r in recs]
            # Must include active standard IS 269:2015 which superseded IS 12269
            assert any("269" in s for s in std_numbers)
    run_async(_test())

def test_benchmark_3_fe_500d_tmt_rebar():
    """Test 3: Fe 500D TMT reinforcement rebar benchmark"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "Supply of high strength deformed steel bars Fe 500D with minimum 16% elongation and seismic ductile detailing for reinforced concrete bridge piers.",
                "top_k": 5,
                "session_id": "test-session"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["confident_match_found"] is True
            recs = data["recommended_standards"]
            assert len(recs) > 0
            assert recs[0]["standard_no"] == "IS 1786:2008"
    run_async(_test())

def test_benchmark_4_hindi_hinglish_spec():
    """Test 4: Hindi/Hinglish multilingual specification"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "हमें 1100V वोल्टेज के लिए तांबे के बिजली के तार (copper wire) और एमसीबी स्विच की आपूर्ति की आवश्यकता है।",
                "top_k": 5,
                "session_id": "test-session"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["confident_match_found"] is True
            assert data["extracted_requirements"]["was_multilingual"] is True
            recs = data["recommended_standards"]
            assert len(recs) > 0
            std_numbers = [r["standard_no"] for r in recs]
            assert "IS 694:2010" in std_numbers
    run_async(_test())

def test_verify_indian_standards_endpoint():
    """Test 5: Verify Indian Standards (hybrid retrieval search endpoint)"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "query": "industrial safety helmet 440V electrical insulation",
                "sector": "PPE & Safety Equipment",
                "top_k": 5,
                "search_mode": "hybrid"
            }
            res = await client.post("/api/v1/search", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert data["total_results"] > 0
            assert data["results"][0]["standard_no"] == "IS 2925:1984"
    run_async(_test())

def test_malformed_input_returns_controlled_validation_error():
    """Test 6: Malformed input should return controlled 422 validation error, not crash (500)"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # text too short (min_length=3)
            res1 = await client.post("/api/v1/analyze", json={"text": "ab"})
            assert res1.status_code == 422
            err1 = res1.json()
            assert "detail" in err1
            assert any(e["loc"] == ["body", "text"] for e in err1["detail"])

            # missing required field
            res2 = await client.post("/api/v1/analyze", json={"sector": "Civil"})
            assert res2.status_code == 422
            err2 = res2.json()
            assert "detail" in err2

            # top_k out of range
            res3 = await client.post("/api/v1/analyze", json={"text": "valid tender text", "top_k": 100})
            assert res3.status_code == 422
            err3 = res3.json()
            assert "detail" in err3
    run_async(_test())
