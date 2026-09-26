"""Comprehensive Test Suite for ManakSetu Tender Compliance Intelligence

Validates:
1. Outdated standard detection & replacement mapping (e.g. IS 12269 -> IS 269:2015)
2. Active standard verification (no false-positive outdated alerts)
3. Statutory QCO detection & metadata verification
4. Missing mandatory certification compliance gap detection
5. Clause conflict detection (e.g. 440V vs 415V across clauses)
6. Zero-hallucination guard for insufficient verified evidence (no synthetic standards)
7. Multilingual Hindi/Hinglish compliance analysis
"""
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

def run_async(coro):
    return asyncio.run(coro)

def test_compliance_1_outdated_standard_detection():
    """Test 1: Detects superseded standard IS 12269 and maps to active replacement IS 269:2015"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "Clause 3: Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269 for structural deck slab.",
                "top_k": 5,
                "session_id": "test-compliance"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert "compliance_report" in data
            report = data["compliance_report"]
            assert report["health_indicator"] in ("critical_review", "review_recommended")
            assert len(report["outdated_standards"]) > 0
            
            outdated = report["outdated_standards"][0]
            assert "12269" in outdated["standard_no"]
            assert outdated["status"] == "superseded"
            assert "269" in outdated["current_reference"]
            assert len(outdated["affected_clauses"]) > 0
            assert "Clause 3" in outdated["affected_clauses"]
            assert outdated["evidence"] is not None
            assert outdated["evidence"]["source_url"].startswith("http")
    run_async(_test())

def test_compliance_2_active_standard_no_outdated_warning():
    """Test 2: Active standard (IS 2925) should not trigger outdated standard findings"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "Supply of Industrial Safety Helmets with 440V electrical insulation and ISI certification conforming to IS 2925:1984.",
                "top_k": 5,
                "session_id": "test-compliance"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            report = data.get("compliance_report", {})
            # Should have zero outdated standards
            assert len(report.get("outdated_standards", [])) == 0
    run_async(_test())

def test_compliance_3_qco_applicable():
    """Test 3: Detects applicable statutory Quality Control Order (QCO) for regulated items"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "Supply of heavy-duty industrial safety helmets with electrical insulation up to 440V and ISI marking for construction personnel.",
                "top_k": 5,
                "session_id": "test-compliance"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            report = data["compliance_report"]
            qco_findings = report.get("qco_findings", [])
            assert len(qco_findings) > 0
            first_qco = qco_findings[0]
            assert first_qco["qco_applicable"] is True
            assert first_qco["qco_reference"] is not None
            assert "2925" in first_qco["standard_no"]
    run_async(_test())

def test_compliance_4_potential_missing_certification_gap():
    """Test 4: Flags potential compliance gap when mandatory QCO applies but tender omits ISI/certification clause"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # Note: No mention of ISI mark, BIS license, or certification in text
            payload = {
                "text": "Procurement of safety helmets with electrical insulation for factory workers.",
                "top_k": 5,
                "session_id": "test-compliance"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            report = data["compliance_report"]
            qco_gaps = [q for q in report.get("qco_findings", []) if q.get("gap_detected")]
            assert len(qco_gaps) > 0
            assert "mandatory" in qco_gaps[0]["observation"].lower()
            assert report["health_indicator"] in ("critical_review", "review_recommended")
    run_async(_test())

def test_compliance_5_clause_conflict_detection():
    """Test 5: Detects conflicting technical parameters across tender clauses"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": (
                    "Clause 4: Rated voltage of equipment shall be 440V AC 3-phase.\n"
                    "Clause 12: All connected safety helmets and electrical appliances must be rated for 415V operating voltage."
                ),
                "top_k": 5,
                "session_id": "test-compliance"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            report = data["compliance_report"]
            conflicts = report.get("conflicts", [])
            assert len(conflicts) > 0
            voltage_conflict = conflicts[0]
            assert "Voltage" in voltage_conflict["conflict_type"]
            assert len(voltage_conflict["clauses_involved"]) >= 2
    run_async(_test())

def test_compliance_6_insufficient_evidence_guard():
    """Test 6: Returns insufficient verified evidence rather than hallucinating standards for unsupported domains"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "Fresh organic Alfonso mangoes from Ratnagiri farms export quality fruit boxes.",
                "top_k": 5,
                "session_id": "test-compliance"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            report = data["compliance_report"]
            assert report["health_indicator"] == "insufficient_evidence"
            assert report["insufficient_evidence"] is True
            assert "Insufficient Verified Evidence" in report["health_label"]
            assert len(report["outdated_standards"]) == 0
    run_async(_test())

def test_compliance_7_multilingual_compliance_analysis():
    """Test 7: Hindi/Hinglish specifications pass cleanly through the compliance pipeline"""
    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "text": "440V safety helmet ke liye applicable Indian Standard aur mandatory QCO requirement batao.",
                "top_k": 5,
                "session_id": "test-compliance"
            }
            res = await client.post("/api/v1/analyze", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert "compliance_report" in data
            report = data["compliance_report"]
            assert report["summary_metrics"]["standards_identified"] > 0
            assert report["relationship_graph"] is not None
    run_async(_test())
