"""
EchoXScholar - Vector Memory & RAG Retrieval Engine
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.learning_dna import StudentMemory
from app.models.paper import Paper


class VectorMemoryService:
    """Service to store and retrieve long-term student memories and document chunks."""

    @staticmethod
    async def add_memory(
        db: AsyncSession,
        user_id: int,
        content: str,
        memory_type: str = "KeyInsight",
        topic: Optional[str] = None,
        importance: float = 1.0
    ) -> StudentMemory:
        mem = StudentMemory(
            user_id=user_id,
            content=content,
            memory_type=memory_type,
            topic=topic,
            importance_score=importance
        )
        db.add(mem)
        await db.commit()
        await db.refresh(mem)
        return mem

    @staticmethod
    async def retrieve_relevant_memories(
        db: AsyncSession,
        user_id: int,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        # 1. Fetch user memories
        res = await db.execute(
            select(StudentMemory).where(StudentMemory.user_id == user_id).order_by(StudentMemory.importance_score.desc())
        )
        memories = list(res.scalars().all())

        results = []
        words = query.lower().split()
        for m in memories:
            content_lower = m.content.lower()
            overlap = sum(1 for w in words if len(w) > 3 and w in content_lower)
            results.append({
                "id": m.id,
                "type": m.memory_type,
                "topic": m.topic,
                "content": m.content,
                "relevance": round(overlap * 0.3 + m.importance_score * 0.5, 2)
            })

        # 2. Fetch uploaded user study papers
        paper_res = await db.execute(
            select(Paper).where(Paper.user_id == user_id)
        )
        papers = list(paper_res.scalars().all())

        for p in papers:
            text = (p.summary or "") + "\n" + (p.raw_text or "")
            if text.strip():
                text_lower = text.lower()
                overlap = sum(1 for w in words if len(w) > 3 and w in text_lower)
                snippet = p.summary or (p.raw_text[:300] + "..." if p.raw_text else p.title)
                results.append({
                    "id": f"paper_{p.id}",
                    "type": "StudyDocument",
                    "topic": p.title,
                    "content": f"Document: {p.title}\nSummary: {snippet}",
                    "relevance": round(overlap * 0.4 + 1.0, 2)
                })

        results.sort(key=lambda x: x["relevance"], reverse=True)
        return results[:limit]
