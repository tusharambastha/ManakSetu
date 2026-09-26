# ManakSetu — Standards Engine for Tender & Utility
> *"ManakSetu — bridging procurement officials to the right Indian Standard, instantly."*  
> **SIH 2026 | Problem Statement SIH26108**

---

## 🏛️ Core Design Principle: Zero Hallucination

In public procurement (e.g. GeM, CPWD, Railway, Defence, and State tenders), referencing an incorrect, non-existent, or superseded Indian Standard can compromise safety, cause audit failures, or invalidate tenders.

**ManakSetu enforces a strict retrieval-first, generation-second architecture:**
- **Zero Synthetic Standard Numbers**: Standard numbers, titles, scopes, versions, amendments, and certification requirements are populated strictly from the verified local database.
- **Controlled Semantic Scoring**: Vector embeddings (`BAAI/bge-small-en-v1.5`) and BM25 Okapi algorithms rank verified database records.
- **Grounded Explanations**: Explanations cite only the verified scope and parameters present in the retrieved database record.

---

## 📁 Repository Structure

```
SETU/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health.py             # Health check & architecture verification
│   │   │   ├── search.py             # Hybrid search (POST /search, GET /search/quick)
│   │   │   └── standards.py          # Standards CRUD, sectors, and allied expansion
│   │   ├── config.py                 # Application configuration & weights
│   │   ├── data/
│   │   │   ├── build_seed_data.py    # Curated BIS dataset builder
│   │   │   ├── seed.py               # Database seeder with vector embeddings
│   │   │   └── standards_dataset.json# 46 verified BIS standards with relationships
│   │   ├── database/
│   │   │   ├── repository.py         # DB operations & query abstractions
│   │   │   ├── schema.sql            # PostgreSQL + pgvector schema definition
│   │   │   └── session.py            # Async & Sync SQLAlchemy session managers
│   │   ├── models/
│   │   │   ├── db_models.py          # SQLAlchemy ORM models
│   │   │   └── schemas.py            # Pydantic validation schemas
│   │   ├── services/
│   │   │   ├── allied_expansion.py   # Allied standards resolver & graph traversal
│   │   │   ├── bm25_search.py        # Domain-tuned BM25 keyword search
│   │   │   ├── hybrid_search.py      # Hybrid score fusion (RRF + weighted linear)
│   │   │   └── vector_search.py      # Self-hosted FastEmbed BAAI/bge-small-en-v1.5
│   │   └── main.py                   # FastAPI application entry point
│   ├── tests/
│   │   ├── test_api_endpoints.py     # HTTP integration test suite
│   │   └── test_retrieval.py         # BM25, semantic, and hybrid retrieval test suite
│   └── setu.db                       # Seeded SQLite database with vector embeddings
├── requirements.txt                  # Python dependencies
└── README.md                         # Documentation
```

---

## 🚀 Quickstart & Verification

### 1. Activate Environment & Run Tests
```bash
source venv/bin/activate
PYTHONPATH=backend pytest backend/tests/ -v
```

### 2. Start the FastAPI Server
```bash
source venv/bin/activate
PYTHONPATH=backend uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- System Health & Stats: `http://localhost:8000/api/v1/health`

---

## 🔍 Verified Knowledge Base Sectors

| Sector | Key Indian Standards Included | Typical Allied Relationships | Mandatory Certification Scheme |
|---|---|---|---|
| **PPE & Safety Equipment** | IS 2925 (Helmets), IS 15298 Pt 2 (Footwear), IS 9473 (Masks/Respirators), IS 5983 (Goggles), IS 3521 Pt 1 (Harness), IS 6994 Pt 1 (Gloves), IS 4770 (Electrical Gloves), IS 15809 (Hi-Vis), IS 9167 (Ear-Protectors), IS 16890 (Firefighter Helmets) | IS 15298 Pt 1 (Toe test), IS 6229 (Sound test), IS 2314 (Chinstrap), IS 17354 (Fall arresters) | BIS Product Certification (ISI Mark) under DPIIT PPE QCO |
| **Electrical & Power** | IS 694 (PVC Cables), IS 7098 Pt 1 & 2 (XLPE LV/HT Cables), IS/IEC 60898-1 (MCB), IS 12640 Pt 1 (RCCB), IS 1180 Pt 1 (Distribution Transformers), IS 1293 (Plugs/Sockets), IS 10322 (LED Luminaires), IS 13779 (Energy Meters), IS 16444 (Smart Meters), IS 3043 (Earthing Code), IS 732 (Wiring Code), IS 3854 (Switches) | IS 8130 (Conductors), IS 5831 (Insulation), IS 10810 (Cable tests), IS 15959 (DLMS/COSEM), IS/IEC 60529 (IP Ratings) | BIS Product Certification / Compulsory Registration Scheme (CRS) for LED & Electronics / BEE Star Rating |
| **Civil & Construction** | IS 1786 (TMT Rebars Fe 500D), IS 2062 (Structural Steel), IS 12269 (OPC 53), IS 8112 (OPC 43), IS 1489 Pt 1 (PPC Cement), IS 4985 (uPVC Pipes), IS 4984 (HDPE Pipes), IS 8329 (Ductile Iron Pipes), IS 456 (Concrete Code), IS 4926 (RMC), IS 383 (Aggregates & M-sand), IS 458 (RCC Pipes), IS 800 (Steel Design Code), IS 13920 (Seismic Detailing), IS 2185 Pt 1 (Concrete Blocks), IS 1322 (Bitumen Felts) | IS 4031 (Cement tests), IS 1608 (Tensile test), IS 12235 (Hydrostatic test), IS 516 (Cube test), IS 7634 (Pipe laying) | BIS Product Certification (ISI Mark) under Steel, Cement, and Pipe QCOs |

---

## 🧪 Validated Sample Test Queries

1. **Exact Engineering Term Match (BM25)**:
   - Query: `"copper conductor 1100V building wire"`
   - Result: **IS 694:2010** (Score: 0.88, BIS Product Certification: Mandatory)
2. **Semantic Understanding Without Direct Keywords (Vector)**:
   - Query: `"head protection gear to shield construction laborers against impact from falling debris and tools"`
   - Result: **IS 2925:1984** (Similarity > 0.55, allied with IS 2314 Chinstraps & IS 5983 Eye Protectors)
3. **Earthquake Detailing & Rebar Grade (Hybrid Fusion)**:
   - Query: `"TMT high strength steel bars Fe 500D for earthquake resistant concrete structures"`
   - Result: **IS 1786:2008** (Score: 0.82, allied with IS 456 concrete design & IS 1608 tensile test)
4. **Superseded Standard Flagging**:
   - Query: `"Supply of 53 Grade Ordinary Portland Cement conforming to IS 12269"`
   - Result: Flagged as `superseded` (Deprecation Shield warning), routing procurement official to active unified standard **IS 269:2015**.
