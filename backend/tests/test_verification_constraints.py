"""Test Suite for Data Verification Constraints

Ensures zero hallucination and enforces strict verification rules:
(a) Fails if any record has status_verified=true without https deep link source_url and last_verified_on.
(b) Fails if any supersedes/superseded_by relation is unverified but still triggers a redirect.
(c) Fails if admin stats do not match the dataset.
(d) Fails if qco_applicable is missing, or if Codes of Practice are marked with mandatory QCO.
(e) Fails if query "53 grade cement" does not return IS 269:2015 in top 3 or IS 12269 lacks shield warning.
(f) Fails if helmet query does not return IS 2925 with its verified QCO reference.
"""
import json
import re
import asyncio
from pathlib import Path
from urllib.parse import urlparse
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.services.reranker import GroundedReranker
from app.api.search import hybrid_engine, refresh_search_index
from app.database.session import AsyncSessionLocal
from app.api.pipeline import execute_pipeline

DATA_FILE = Path(__file__).resolve().parent.parent / "app" / "data" / "standards_dataset.json"

def run_async(coro):
    return asyncio.run(coro)

def test_verified_records_must_have_source_url_and_date():
    """Fails if any record has status_verified=true without https deep link source_url and last_verified_on"""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    date_regex = re.compile(r"^\d{4}-\d{2}-\d{2}$")

    for rec in data:
        std_no = rec.get("standard_no", "Unknown")
        is_verified = rec.get("status_verified", False)
        
        if is_verified:
            source_url = rec.get("source_url")
            verified_date = rec.get("last_verified_on")

            assert source_url is not None and len(str(source_url).strip()) > 0, (
                f"Record '{std_no}' has status_verified=True but source_url is missing or empty"
            )
            assert str(source_url).startswith("https://"), (
                f"Record '{std_no}' source_url '{source_url}' must be https://"
            )
            parsed = urlparse(source_url)
            assert parsed.scheme == "https", f"Record '{std_no}' scheme must be https"
            assert parsed.netloc, f"Record '{std_no}' missing host in source_url"
            assert parsed.path and parsed.path.strip("/") != "", (
                f"Record '{std_no}' source_url '{source_url}' must be a deep link with a path, never a bare domain"
            )

            assert verified_date is not None and len(str(verified_date).strip()) > 0, (
                f"Record '{std_no}' has status_verified=True but last_verified_on is missing"
            )
            assert date_regex.match(str(verified_date)), (
                f"Record '{std_no}' last_verified_on '{verified_date}' is not in YYYY-MM-DD format"
            )

def test_deprecation_shield_unverified_relation_no_redirect():
    """Fails if any supersedes/superseded_by relation is unverified but still triggers a redirect"""
    unverified_item = {
        "standard_no": "IS 99999:1990",
        "title": "Hypothetical Unverified Standard",
        "sector": "Electrical & Power",
        "scope": "Specification for testing purposes.",
        "status": "superseded",
        "superseded_by": "IS 88888:2020",
        "status_verified": False,
        "related_standards": [
            {
                "standard_no": "IS 88888:2020",
                "relation_type": "superseded_by",
                "relation_verified": False
            }
        ],
        "certification": None
    }

    explanation_unverified = GroundedReranker._build_grounded_explanation(
        item=unverified_item,
        inferred_sector="Electrical & Power",
        matched_params=[],
        extracted_reqs={}
    )

    assert "Status could not be confirmed - check the latest status on BIS portal." in explanation_unverified, (
        "Unverified superseded standard should show neutral note and not suggest transition"
    )
    assert "transition to active standard" not in explanation_unverified, (
        "Unverified superseded standard must NOT trigger a redirect to replacement standard"
    )

    verified_item = {
        "standard_no": "IS 12269:2013",
        "title": "Ordinary Portland Cement, 53 Grade - Specification",
        "sector": "Civil & Construction",
        "scope": "Specification for 53 Grade OPC.",
        "status": "superseded",
        "superseded_by": "IS 269:2015",
        "status_verified": True,
        "related_standards": [
            {
                "standard_no": "IS 269:2015",
                "relation_type": "superseded_by",
                "relation_verified": True
            }
        ],
        "certification": None
    }

    explanation_verified = GroundedReranker._build_grounded_explanation(
        item=verified_item,
        inferred_sector="Civil & Construction",
        matched_params=[],
        extracted_reqs={}
    )

    assert "transition to active standard 'IS 269:2015'" in explanation_verified, (
        "Verified superseded standard must properly guide officers to replacement standard"
    )

def test_qco_applicable_field_and_codes_of_practice():
    """Fails if qco_applicable is missing, or if Codes of Practice are marked with mandatory QCO"""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    codes_of_practice = {
        "IS 456:2000",
        "IS 800:2007",
        "IS 13920:2016",
        "IS 3043:2018",
        "IS 732:2019"
    }

    for rec in data:
        std_no = rec.get("standard_no")
        assert "qco_applicable" in rec, f"Record '{std_no}' missing qco_applicable field"
        assert isinstance(rec["qco_applicable"], bool), f"Record '{std_no}' qco_applicable must be boolean"

        if std_no in codes_of_practice:
            assert rec["qco_applicable"] is False, f"Code of Practice '{std_no}' must have qco_applicable=False"
            assert rec["qco_verified"] is False, f"Code of Practice '{std_no}' must have qco_verified=False"
            assert rec["qco_reference"] is None, f"Code of Practice '{std_no}' must have qco_reference=None"

def test_query_53_grade_cement_returns_is269_top3_and_is12269_shield():
    """query '53 grade cement' returns IS 269:2015 in top 3 and IS 12269 carries the shield warning"""
    async def _test():
        async with AsyncSessionLocal() as db:
            await refresh_search_index(db)
            res = await execute_pipeline(
                raw_text="Procurement of 53 grade cement for high strength structural bridge deck slab casting.",
                sector_filter=None,
                top_k=5,
                session_id="test-cement",
                document_meta=None,
                db=db
            )

        top_standards = [r["standard_no"] for r in res["recommended_standards"][:3]]
        assert "IS 269:2015" in top_standards, f"IS 269:2015 must be in top 3 results, got {top_standards}"

        # Find IS 12269:2013 and verify shield warning
        is_12269 = next((r for r in res["recommended_standards"] if r["standard_no"] == "IS 12269:2013"), None)
        assert is_12269 is not None, "IS 12269:2013 should be retrieved in candidate results"
        assert is_12269["status"] == "superseded", "IS 12269:2013 must have status=superseded"
        assert is_12269["superseded_by"] == "IS 269:2015", "IS 12269:2013 must point to IS 269:2015"
        assert "transition to active standard 'IS 269:2015'" in is_12269["explanation"], (
            f"IS 12269:2013 explanation missing shield warning: {is_12269['explanation']}"
        )

    run_async(_test())

def test_query_helmet_returns_is2925_with_qco():
    """helmet query returns IS 2925 with its verified QCO"""
    async def _test():
        async with AsyncSessionLocal() as db:
            await refresh_search_index(db)
            res = await execute_pipeline(
                raw_text="Industrial safety helmets with electrical insulation up to 440V and harness for site safety.",
                sector_filter=None,
                top_k=5,
                session_id="test-helmet",
                document_meta=None,
                db=db
            )

        top_standard = res["recommended_standards"][0]
        assert top_standard["standard_no"] == "IS 2925:1984", f"Expected IS 2925:1984 as top hit, got {top_standard['standard_no']}"
        assert top_standard["qco_verified"] is True, "IS 2925:1984 must have qco_verified=True"
        assert top_standard["qco_reference"] == "S.O. 4649(E) dated 23-10-2023", (
            f"Expected S.O. 4649(E) dated 23-10-2023, got {top_standard['qco_reference']}"
        )

    run_async(_test())

def test_admin_stats_match_dataset():
    """Fails if admin stats do not match the dataset"""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    expected_total = len(dataset)
    expected_active = len([s for s in dataset if s.get("status") == "active"])
    expected_superseded = len([s for s in dataset if s.get("status") == "superseded"])
    expected_verified = len([s for s in dataset if s.get("status_verified") is True])
    expected_mandatory_qcos = len([s for s in dataset if s.get("qco_verified") is True])

    async def _test():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res = await client.get("/api/v1/health")
            assert res.status_code == 200
            data = res.json()
            kb_stats = data["knowledge_base_stats"]

            assert kb_stats["total_standards"] == expected_total, (
                f"Total standards mismatch: API {kb_stats['total_standards']} != Dataset {expected_total}"
            )
            assert kb_stats["active_standards"] == expected_active, (
                f"Active standards mismatch: API {kb_stats['active_standards']} != Dataset {expected_active}"
            )
            assert kb_stats["superseded_standards"] == expected_superseded, (
                f"Superseded standards mismatch: API {kb_stats['superseded_standards']} != Dataset {expected_superseded}"
            )
            assert kb_stats["verified_standards"] == expected_verified, (
                f"Verified standards mismatch: API {kb_stats['verified_standards']} != Dataset {expected_verified}"
            )
            assert kb_stats["mandatory_qcos"] == expected_mandatory_qcos, (
                f"Mandatory QCOs mismatch: API {kb_stats['mandatory_qcos']} != Dataset {expected_mandatory_qcos}"
            )

    run_async(_test())

def test_authoritative_government_source_policy():
    """Fails if any record labeled BIS_OFFICIAL or GOVERNMENT_GAZETTE points to a non-government domain"""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    for rec in dataset:
        std_no = rec.get("standard_no")
        source_type = rec.get("source_type")
        official_url = rec.get("official_source_url")

        assert source_type in [
            "BIS_OFFICIAL",
            "GOVERNMENT_GAZETTE",
            "MINISTRY_OFFICIAL",
            "SECONDARY_REFERENCE",
            "PENDING_VERIFICATION"
        ], f"Record {std_no} has invalid source_type: {source_type}"

        if source_type in ["BIS_OFFICIAL", "GOVERNMENT_GAZETTE", "MINISTRY_OFFICIAL"]:
            assert official_url is not None, f"Official record {std_no} missing official_source_url"
            assert str(official_url).startswith("https://"), f"Record {std_no} official URL must be https://"
            parsed = urlparse(official_url)
            netloc = parsed.netloc.lower()
            assert (
                netloc.endswith("bis.gov.in") or
                netloc.endswith("egazette.gov.in") or
                netloc.endswith(".gov.in") or
                netloc.endswith(".nic.in")
            ), f"Record {std_no} official_source_url '{official_url}' is not on an official government domain"
            assert "law.resource.org" not in official_url, f"Third-party repository cannot be official_source_url for {std_no}"

        # If secondary URL is present, verify it is separate
        sec_url = rec.get("secondary_source_url")
        if sec_url:
            assert sec_url != official_url, f"Record {std_no} secondary_source_url cannot be identical to official_source_url"

        # QCO verified must have gazette_verified and valid gazette_url
        if rec.get("qco_verified"):
            assert rec.get("gazette_verified") is True, f"Record {std_no} has qco_verified=True but gazette_verified is not True"
            assert rec.get("gazette_url") is not None, f"Record {std_no} missing gazette_url"
            assert "egazette.gov.in" in rec["gazette_url"], f"Record {std_no} gazette_url must be egazette.gov.in"

def test_knowledge_base_source_audit_integrity():
    """Fails if knowledge_base_source_audit.json is missing, malformed, or does not cover all 49 standards"""
    audit_file = DATA_FILE.parent.parent.parent.parent / "knowledge_base_source_audit.json"
    assert audit_file.exists(), f"Audit file {audit_file} not found"

    with open(audit_file, "r", encoding="utf-8") as f:
        audit_data = json.load(f)

    assert len(audit_data) == 49, f"Expected 49 audit records, got {len(audit_data)}"

    for entry in audit_data:
        for req_field in [
            "standard_number", "source_type", "official_source_url",
            "source_verified", "status_verified", "status_source_url",
            "qco_applicable", "qco_verified", "qco_source_url",
            "gazette_verified", "gazette_url", "last_verified_on"
        ]:
            assert req_field in entry, f"Entry {entry.get('standard_number')} missing {req_field}"

