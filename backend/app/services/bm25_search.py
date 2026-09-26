"""BM25 Keyword Retrieval Service for Indian Standards"""
import re
from typing import List, Dict, Any, Tuple
from rank_bm25 import BM25Okapi

def tokenize(text: str) -> List[str]:
    """Tokenize text preserving alphanumeric codes like IS 2925, 1100V, Fe500D, MCB, 200J"""
    if not text:
        return []
    # Normalize punctuation while keeping hyphens and alphanumeric tokens intact
    text = text.lower()
    tokens = re.findall(r'[a-z0-9]+(?:[-/][a-z0-9]+)*', text)
    return tokens

class BM25SearchService:
    def __init__(self):
        self.standards_corpus: List[Dict[str, Any]] = []
        self.tokenized_corpus: List[List[str]] = []
        self.bm25: BM25Okapi = None

    def index_standards(self, standards: List[Dict[str, Any]]):
        """Index a list of standard dictionaries"""
        self.standards_corpus = standards
        self.tokenized_corpus = []

        for std in standards:
            # Combine standard number, title, scope, keywords for indexing
            keywords_str = " ".join(std.get("keywords", []))
            doc_text = f"{std.get('standard_no', '')} {std.get('title', '')} {std.get('scope', '')} {keywords_str} {std.get('sector', '')}"
            self.tokenized_corpus.append(tokenize(doc_text))

        if self.tokenized_corpus:
            self.bm25 = BM25Okapi(self.tokenized_corpus)

    def search(self, query: str, top_k: int = 10, sector_filter: str = None) -> List[Tuple[Dict[str, Any], float, List[str]]]:
        """Search standards using BM25.
        Returns: List of tuples (standard_dict, raw_bm25_score, matched_keywords)
        """
        if not self.bm25 or not query.strip():
            return []

        query_tokens = tokenize(query)
        if not query_tokens:
            return []

        scores = self.bm25.get_scores(query_tokens)
        results = []

        for idx, score in enumerate(scores):
            if score <= 0.0:
                continue

            std = self.standards_corpus[idx]

            # Apply sector filter if specified
            if sector_filter and std.get("sector") != sector_filter:
                continue

            # Identify which query tokens directly appeared in document tokens
            STOPWORDS = {
                "a", "an", "the", "and", "or", "for", "with", "of", "to", "in", "on",
                "at", "by", "as", "is", "are", "be", "this", "that", "shall", "must",
                "required", "supply", "procurement", "specification", "tender", "bid",
                "from", "into", "through", "under", "over", "quality", "type", "types",
                "item", "items", "work", "works", "contractor", "such", "all", "any",
                "used", "using", "use", "purposes", "general", "other", "part", "parts"
            }
            doc_tokens = set(self.tokenized_corpus[idx])
            matched_terms = [t for t in query_tokens if t in doc_tokens and t not in STOPWORDS]

            results.append((std, float(score), matched_terms))

        # Sort descending by score
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]
