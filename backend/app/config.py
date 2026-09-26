"""Application Configuration for ManakSetu Backend"""
import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "app" / "data"

class Settings(BaseModel):
    PROJECT_NAME: str = "ManakSetu — Standards Engine for Tender & Utility"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Database URL: defaults to local SQLite file if PostgreSQL is not specified
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{BASE_DIR}/setu.db")
    SYNC_DATABASE_URL: str = os.getenv("SYNC_DATABASE_URL", f"sqlite:///{BASE_DIR}/setu.db")
    
    # Embedding Model: local open-source FastEmbed BAAI/bge-small-en-v1.5 (384 dimensions)
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "BAAI/bge-small-en-v1.5")
    EMBEDDING_DIM: int = 384
    
    # Search Weights for Hybrid Fusion
    HYBRID_BM25_WEIGHT: float = 0.45
    HYBRID_VECTOR_WEIGHT: float = 0.55
    DEFAULT_TOP_K: int = 10

settings = Settings()
