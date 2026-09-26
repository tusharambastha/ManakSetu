"""ManakSetu — Standards Engine for Tender & Utility
FastAPI Application Entry Point
"""
import sys
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend root is on sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.config import settings
from app.database.session import init_db, AsyncSessionLocal
from app.api import standards, search, health, pipeline, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events: initialize DB and warm up search index on startup"""
    print("🚀 Initializing ManakSetu Database and Models...")
    await init_db()

    # Preload and index standards into BM25 and Vector search engines
    print("⚡ Indexing standards knowledge base for hybrid retrieval...")
    async with AsyncSessionLocal() as db:
        await search.refresh_search_index(db)
        print(f"✅ Indexed {len(search.hybrid_engine.bm25.standards_corpus)} Indian Standards successfully!")

    yield
    print("🛑 Shutting down ManakSetu services...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "ManakSetu: AI-Powered Standards Engine for Tender & Utility (SIH 2026, Problem Statement SIH26108). "
        "Retrieval-first, zero-hallucination recommendation of verified Indian Standards."
    ),
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api/v1
app.include_router(health.router, prefix="/api/v1")
app.include_router(standards.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(pipeline.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")

# Mount built frontend if available
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")
else:
    @app.get("/")
    def root():
        return {
            "message": "Welcome to ManakSetu — Standards Engine for Tender & Utility",
            "tagline": "Bridging procurement officials to the right Indian Standard, instantly.",
            "docs_url": "/docs",
            "health_check": "/api/v1/health"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
