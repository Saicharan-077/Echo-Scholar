"""
EchoXScholar - Local Vector RAG Engine
Implements: chunking → embedding → storage → cosine similarity search
Uses Google Gemini text-embedding-004 model (available in v1beta).
"""
import os
import math
import httpx
import asyncio
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.models.paper import Paper


class RAGService:
    """Production-grade RAG Service: semantic chunking, embedding, and vector similarity search."""

    @classmethod
    def chunk_text(cls, text: str, chunk_size: int = 800, overlap: int = 150) -> List[Dict[str, Any]]:
        """
        Split text into overlapping chunks at sentence/paragraph boundaries.
        Overlap ensures context is not lost between chunks.
        """
        if not text or len(text.strip()) < 50:
            return []

        chunks = []
        # Prefer paragraph-level splits
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]

        current_chunk = ""
        chunk_idx = 1

        for para in paragraphs:
            # If adding this paragraph would exceed chunk_size, save current chunk
            if len(current_chunk) + len(para) > chunk_size and current_chunk:
                chunks.append({
                    "id": chunk_idx,
                    "text": current_chunk.strip(),
                    "length": len(current_chunk.strip())
                })
                chunk_idx += 1
                # Keep overlap: carry last 'overlap' chars into next chunk
                current_chunk = current_chunk[-overlap:] + "\n\n" + para
            else:
                current_chunk += ("\n\n" if current_chunk else "") + para

        # Don't forget last chunk
        if current_chunk.strip() and len(current_chunk.strip()) > 30:
            chunks.append({
                "id": chunk_idx,
                "text": current_chunk.strip(),
                "length": len(current_chunk.strip())
            })

        # If paragraph splitting produced too few chunks, fall back to character splitting
        if len(chunks) < 3 and len(text) > chunk_size:
            chunks = []
            chunk_idx = 1
            start = 0
            text_len = len(text)
            while start < text_len:
                end = min(start + chunk_size, text_len)
                chunk_text = text[start:end].strip()
                if chunk_text and len(chunk_text) > 30:
                    chunks.append({
                        "id": chunk_idx,
                        "text": chunk_text,
                        "length": len(chunk_text)
                    })
                    chunk_idx += 1
                start += (chunk_size - overlap)

        return chunks

    @classmethod
    async def get_embedding(cls, text: str) -> Optional[List[float]]:
        """
        Fetch embedding vector from Google Gemini text-embedding-004.
        Returns None on failure (caller handles fallback).
        """
        gemini_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "gemini_api_key", None) or ""
        if not gemini_key or gemini_key.startswith("your_") or len(gemini_key) < 10:
            return None

        # text-embedding-004 is the stable embedding model in v1beta
        embedding_models = ["text-embedding-004", "embedding-001"]

        for model in embedding_models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:embedContent?key={gemini_key}"
                payload = {
                    "model": f"models/{model}",
                    "content": {"parts": [{"text": text[:2000]}]}  # Embed up to 2000 chars per chunk
                }
                async with httpx.AsyncClient(timeout=15.0) as client:
                    res = await client.post(url, json=payload)

                if res.status_code == 200:
                    data = res.json()
                    values = data.get("embedding", {}).get("values")
                    if values and len(values) > 0:
                        return values

                elif res.status_code == 429:
                    await asyncio.sleep(1.5)

                elif res.status_code in [400, 404]:
                    # Try next model
                    continue

            except Exception as e:
                print(f"RAGService embedding error ({model}): {e}")

        return None

    @classmethod
    async def process_and_index_document(cls, db: AsyncSession, paper_id: int) -> Dict[str, Any]:
        """
        Full RAG ingestion pipeline:
        1. Fetch paper raw_text
        2. Chunk into overlapping segments
        3. Generate embeddings (with fallback to keyword hashing)
        4. Store embedded chunks in paper.embeddings JSON column
        """
        # 1. Fetch paper
        res = await db.execute(select(Paper).where(Paper.id == paper_id))
        paper = res.scalars().first()

        if not paper:
            return {"status": "failed", "message": "Paper not found"}

        if not paper.raw_text or len(paper.raw_text.strip()) < 50:
            return {"status": "failed", "message": "Paper has no extracted text"}

        print(f"RAGService: Processing paper {paper_id} ({len(paper.raw_text)} chars)")

        # 2. Chunk
        chunks = cls.chunk_text(paper.raw_text)
        if not chunks:
            return {"status": "failed", "message": "Failed to produce chunks from text"}

        print(f"RAGService: Created {len(chunks)} chunks")

        # 3. Embed each chunk
        gemini_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "gemini_api_key", None) or ""
        has_api_key = bool(gemini_key) and len(gemini_key) > 10 and not gemini_key.startswith("your_")

        embedded_chunks = []
        embedding_success_count = 0

        for chunk in chunks:
            vector = None

            if has_api_key:
                vector = await cls.get_embedding(chunk["text"])
                if vector:
                    embedding_success_count += 1
                # Small delay to avoid rate limits during bulk embedding
                await asyncio.sleep(0.3)

            if vector is None:
                # Keyword hash fallback: deterministic per-chunk vector based on word frequencies
                # This ensures different documents produce different vectors
                words = chunk["text"].lower().split()
                word_freq: Dict[str, int] = {}
                for w in words:
                    if len(w) > 3:
                        word_freq[w] = word_freq.get(w, 0) + 1

                # 128-dim vector based on character hash of top words
                vector = [0.0] * 128
                for word, freq in sorted(word_freq.items(), key=lambda x: -x[1])[:20]:
                    for i, char in enumerate(word[:8]):
                        idx = (ord(char) * (i + 1) * freq) % 128
                        vector[idx] += freq * 0.01

                # Normalize
                norm = math.sqrt(sum(v * v for v in vector))
                if norm > 0:
                    vector = [v / norm for v in vector]

            embedded_chunks.append({
                "id": chunk["id"],
                "text": chunk["text"],
                "vector": vector,
                "has_real_embedding": vector is not None and embedding_success_count > 0
            })

        # 4. Store
        paper.embeddings = embedded_chunks
        await db.commit()

        print(f"RAGService: Stored {len(embedded_chunks)} chunks. Real embeddings: {embedding_success_count}/{len(chunks)}")

        return {
            "status": "completed",
            "chunks_count": len(embedded_chunks),
            "embedding_dimension": len(embedded_chunks[0]["vector"]) if embedded_chunks else 0,
            "real_embeddings": embedding_success_count,
            "fallback_embeddings": len(embedded_chunks) - embedding_success_count
        }

    @classmethod
    def cosine_similarity(cls, vec_a: List[float], vec_b: List[float]) -> float:
        """Cosine similarity between two vectors."""
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0
        return dot / (norm_a * norm_b)

    @classmethod
    async def vector_search(cls, db: AsyncSession, paper_id: int, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Semantic search over document chunks.
        Returns top_k most relevant chunks for the given query.
        """
        # Fetch paper
        res = await db.execute(select(Paper).where(Paper.id == paper_id))
        paper = res.scalars().first()

        if not paper:
            return []

        if not paper.embeddings or len(paper.embeddings) == 0:
            # No embeddings — return first few chunks as context (better than nothing)
            if paper.raw_text:
                chunks = cls.chunk_text(paper.raw_text, chunk_size=600)
                return [{"id": c["id"], "text": c["text"], "score": 1.0} for c in chunks[:top_k]]
            return []

        # Try embedding the query
        query_vector = await cls.get_embedding(query)

        if query_vector and len(query_vector) == len(paper.embeddings[0].get("vector", [])):
            # Full vector similarity search
            scored = []
            for chunk in paper.embeddings:
                chunk_vec = chunk.get("vector", [])
                sim = cls.cosine_similarity(query_vector, chunk_vec)
                scored.append({
                    "id": chunk["id"],
                    "text": chunk["text"],
                    "score": round(sim, 4)
                })
            scored.sort(key=lambda x: x["score"], reverse=True)
            return scored[:top_k]

        else:
            # Keyword overlap fallback — still document-specific!
            query_words = set(w.lower() for w in query.split() if len(w) > 3)
            scored = []
            for chunk in paper.embeddings:
                text_lower = chunk["text"].lower()
                # Count matching words + bonus for exact phrase
                word_hits = sum(1 for w in query_words if w in text_lower)
                phrase_bonus = 2 if query.lower()[:20] in text_lower else 0
                score = (word_hits + phrase_bonus) / max(len(query_words), 1)
                scored.append({
                    "id": chunk["id"],
                    "text": chunk["text"],
                    "score": round(score, 4)
                })
            scored.sort(key=lambda x: x["score"], reverse=True)

            # Always return top_k, even if score is 0 (still document-specific content)
            result = scored[:top_k]
            # If no good matches, add first chunk as general context
            if not result or result[0]["score"] == 0:
                result = [{"id": c["id"], "text": c["text"], "score": 0.1}
                         for c in paper.embeddings[:top_k]]
            return result

    @classmethod
    async def retrieve_context(
        cls,
        db: AsyncSession,
        paper_id: int,
        query: str,
        top_k: int = 4,
        threshold: float = 0.0
    ) -> Dict[str, Any]:
        """
        High-level RAG context retrieval.
        Returns a dict with:
          - formatted_context: string ready to inject into AI prompt
          - citations: list of dicts with chunk_id and score
        """
        chunks = await cls.vector_search(db, paper_id, query, top_k=top_k)

        # Filter by threshold if specified
        if threshold > 0:
            chunks = [c for c in chunks if c.get("score", 0) >= threshold]

        if not chunks:
            return {"formatted_context": "", "citations": []}

        formatted_context = "\n\n---\n\n".join([
            f"[Document Chunk {c['id']}]\n{c['text']}"
            for c in chunks
        ])

        citations = [
            {"chunk_id": c["id"], "score": c.get("score", 0.0)}
            for c in chunks
        ]

        return {
            "formatted_context": formatted_context,
            "citations": citations
        }

