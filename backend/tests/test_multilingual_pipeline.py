import asyncio
import pytest
from app.services.multilingual_normalizer import MultilingualNormalizer
from app.services.nlp_extractor import NLPExtractorService
from app.api.pipeline import execute_pipeline
from app.database.session import AsyncSessionLocal


def run_async(coro):
    return asyncio.run(coro)


def test_normalizer_language_detection():
    # Test 1: Hindi Devanagari
    q1 = "हमें 1100 वोल्ट के लिए तांबे के तार की आवश्यकता है।"
    assert MultilingualNormalizer.detect_language(q1) == "hi"

    # Test 2: Hinglish Roman Hindi
    q2 = "Hume 1100 volt ke liye copper wire chahiye."
    assert MultilingualNormalizer.detect_language(q2) == "hinglish"

    # Test 3: Standard English
    q3 = "We require copper wire suitable for 1100 volts."
    assert MultilingualNormalizer.detect_language(q3) == "en"

    # Test 4: Hinglish with explicit IS
    q4 = "Hume copper wire chahiye jo IS 1554 ke according ho."
    assert MultilingualNormalizer.detect_language(q4) == "hinglish"

    # Test 5: Mixed Hindi + English
    q5 = "तांबे के तार IS 1554 के अनुसार होने चाहिए।"
    assert MultilingualNormalizer.detect_language(q5) == "mixed"

    # Test 6: Hinglish query
    q6 = "ISI mark mandatory hai kya?"
    assert MultilingualNormalizer.detect_language(q6) == "hinglish"


def test_explicit_standard_extraction():
    stds1 = MultilingualNormalizer.extract_is_standards("Hume copper wire chahiye jo IS 1554 ke according ho.")
    assert "IS 1554" in stds1

    stds2 = MultilingualNormalizer.extract_is_standards("तांबे के तार IS 1554 के अनुसार होने चाहिए।")
    assert "IS 1554" in stds2

    stds3 = MultilingualNormalizer.extract_is_standards("IS 2925")
    assert "IS 2925" in stds3

    stds4 = MultilingualNormalizer.extract_is_standards("We require copper wire suitable for 1100 volts.")
    assert len(stds4) == 0


def test_case_1_hindi_devanagari_copper_wire():
    """TEST 1: हमें 1100 वोल्ट के लिए तांबे के तार की आवश्यकता है।"""
    async def _run():
        async with AsyncSessionLocal() as db:
            return await execute_pipeline(
                raw_text="हमें 1100 वोल्ट के लिए तांबे के तार की आवश्यकता है।",
                sector_filter=None,
                top_k=3,
                session_id="pytest-multilingual-1",
                document_meta=None,
                db=db
            )
    res = run_async(_run())
    assert res["detected_language"] == "hi"
    assert res["extracted_requirements"]["was_multilingual"] is True
    assert res["confident_match_found"] is True
    top_std = res["recommended_standards"][0]["standard_no"]
    assert "694" in top_std or "1554" in top_std


def test_case_2_hinglish_copper_wire():
    """TEST 2: Hume 1100 volt ke liye copper wire chahiye."""
    async def _run():
        async with AsyncSessionLocal() as db:
            return await execute_pipeline(
                raw_text="Hume 1100 volt ke liye copper wire chahiye.",
                sector_filter=None,
                top_k=3,
                session_id="pytest-multilingual-2",
                document_meta=None,
                db=db
            )
    res = run_async(_run())
    assert res["detected_language"] == "hinglish"
    assert res["extracted_requirements"]["was_multilingual"] is True
    assert res["confident_match_found"] is True
    top_std = res["recommended_standards"][0]["standard_no"]
    assert "694" in top_std or "1554" in top_std


def test_case_3_standard_english_copper_wire():
    """TEST 3: We require copper wire suitable for 1100 volts."""
    async def _run():
        async with AsyncSessionLocal() as db:
            return await execute_pipeline(
                raw_text="We require copper wire suitable for 1100 volts.",
                sector_filter=None,
                top_k=3,
                session_id="pytest-multilingual-3",
                document_meta=None,
                db=db
            )
    res = run_async(_run())
    assert res["detected_language"] == "en"
    assert res["extracted_requirements"]["was_multilingual"] is False
    assert res["confident_match_found"] is True
    top_std = res["recommended_standards"][0]["standard_no"]
    assert "694" in top_std or "1554" in top_std


def test_case_4_hinglish_explicit_is_1554():
    """TEST 4: Hume copper wire chahiye jo IS 1554 ke according ho."""
    async def _run():
        async with AsyncSessionLocal() as db:
            return await execute_pipeline(
                raw_text="Hume copper wire chahiye jo IS 1554 ke according ho.",
                sector_filter=None,
                top_k=3,
                session_id="pytest-multilingual-4",
                document_meta=None,
                db=db
            )
    res = run_async(_run())
    assert res["detected_language"] == "hinglish"
    assert "IS 1554" in res["detected_standards"]
    assert res["confident_match_found"] is True
    top_std = res["recommended_standards"][0]["standard_no"]
    assert "1554" in top_std


def test_case_5_hindi_mixed_explicit_is_1554():
    """TEST 5: तांबे के तार IS 1554 के अनुसार होने चाहिए।"""
    async def _run():
        async with AsyncSessionLocal() as db:
            return await execute_pipeline(
                raw_text="तांबे के तार IS 1554 के अनुसार होने चाहिए।",
                sector_filter=None,
                top_k=3,
                session_id="pytest-multilingual-5",
                document_meta=None,
                db=db
            )
    res = run_async(_run())
    assert res["detected_language"] in ("mixed", "hi")
    assert "IS 1554" in res["detected_standards"]
    assert res["confident_match_found"] is True
    top_std = res["recommended_standards"][0]["standard_no"]
    assert "1554" in top_std


def test_case_6_isi_mark_question_zero_hallucination():
    """TEST 6: ISI mark mandatory hai kya?"""
    async def _run():
        async with AsyncSessionLocal() as db:
            return await execute_pipeline(
                raw_text="ISI mark mandatory hai kya?",
                sector_filter=None,
                top_k=3,
                session_id="pytest-multilingual-6",
                document_meta=None,
                db=db
            )
    res = run_async(_run())
    assert res["detected_language"] == "hinglish"
    assert res["extracted_requirements"]["was_multilingual"] is True
    # Zero-hallucination guard triggers because no specific product is specified
    assert res["confident_match_found"] is False
    assert res["compliance_report"]["insufficient_evidence"] is True


def test_case_7_exact_standard_query():
    """TEST 7: IS 2925 exact standard number."""
    async def _run():
        async with AsyncSessionLocal() as db:
            return await execute_pipeline(
                raw_text="IS 2925",
                sector_filter=None,
                top_k=3,
                session_id="pytest-multilingual-7",
                document_meta=None,
                db=db
            )
    res = run_async(_run())
    assert "IS 2925" in res["detected_standards"]
    assert res["confident_match_found"] is True
    top_std = res["recommended_standards"][0]["standard_no"]
    assert "2925" in top_std
