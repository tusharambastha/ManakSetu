"""Semantic Vector Search Service using local FastEmbed open-source model"""
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from fastembed import TextEmbedding
from app.config import settings

class VectorSearchService:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.EMBEDDING_MODEL_NAME
        self._model = None
        self.standards_corpus: List[Dict[str, Any]] = []
        self.embeddings_matrix: Optional[np.ndarray] = None

    @property
    def model(self) -> TextEmbedding:
        if self._model is None:
            self._model = TextEmbedding(model_name=self.model_name)
        return self._model

    def embed_text(self, text: str) -> List[float]:
        """Generate 384-dimensional embedding for a single text"""
        generator = self.model.embed([text])
        return list(generator)[0].tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        generator = self.model.embed(texts)
        return [emb.tolist() for emb in generator]

    def index_standards(self, standards: List[Dict[str, Any]], precomputed_embeddings: Optional[List[List[float]]] = None):
        """Index standards with dense vector embeddings"""
        self.standards_corpus = standards
        
        if precomputed_embeddings and len(precomputed_embeddings) == len(standards):
            self.embeddings_matrix = np.array(precomputed_embeddings, dtype=np.float32)
        else:
            # Generate representation text for each standard
            corpus_texts = []
            for std in standards:
                keywords_str = ", ".join(std.get("keywords", []))
                doc_text = f"Indian Standard {std.get('standard_no', '')}: {std.get('title', '')}. Sector: {std.get('sector', '')}. Scope: {std.get('scope', '')}. Technical terms: {keywords_str}"
                corpus_texts.append(doc_text)

            embs = self.embed_batch(corpus_texts)
            self.embeddings_matrix = np.array(embs, dtype=np.float32)

        # Normalize matrix for fast cosine similarity dot product
        norms = np.linalg.norm(self.embeddings_matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1e-10
        self.embeddings_matrix = self.embeddings_matrix / norms

    def search(self, query: str, top_k: int = 10, sector_filter: str = None) -> List[Tuple[Dict[str, Any], float]]:
        """Semantic search against embedded standards.
        Returns: List of tuples (standard_dict, cosine_similarity_score)
        """
        if self.embeddings_matrix is None or len(self.standards_corpus) == 0 or not query.strip():
            return []

        # Embed query and normalize
        query_emb = np.array(self.embed_text(query), dtype=np.float32)
        query_norm = np.linalg.norm(query_emb)
        if query_norm > 0:
            query_emb = query_emb / query_norm

        # Cosine similarity is the dot product of normalized vectors
        scores = np.dot(self.embeddings_matrix, query_emb)
        results = []

        for idx, score in enumerate(scores):
            std = self.standards_corpus[idx]

            # Apply sector filter if specified
            if sector_filter and std.get("sector") != sector_filter:
                continue

            results.append((std, float(score)))

        # Sort descending by cosine similarity
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]
