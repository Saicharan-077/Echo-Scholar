"""
EchoXScholar - AI Professor Chat Endpoint
Document-grounded Q&A using RAG pipeline + Gemini.
Every answer is based ONLY on retrieved document chunks.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.crud import paper as paper_crud
from app.models.user import User
from app.services.openai_service import openai_service
from app.services.rag_service import RAGService
from app.services.vector_memory_service import VectorMemoryService

router = APIRouter(prefix="/chat", tags=["Chat"])


class AskRequestSchema(BaseModel):
    question: str
    agent_type: Optional[str] = "teacher"
    ai_model: Optional[str] = "gemini-2.0-flash"
    paper_id: Optional[int] = None


class ChatMessageSchema(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    paper_id: int
    message: str
    chat_history: Optional[List[ChatMessageSchema]] = []


class ChatResponse(BaseModel):
    message: str
    tokens_used: int
    citations: List[dict] = []


@router.post("/ask")
async def ask_general_chat(
    payload: AskRequestSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Document-grounded Q&A with strict RAG and Standard Citations."""
    paper_title = "your study material"
    context_str = ""
    citations = []

    if payload.paper_id:
        paper = await paper_crud.get_paper(db, payload.paper_id)
        if paper and paper.user_id == current_user.id:
            paper_title = paper.title
            
            rag_result = await RAGService.retrieve_context(
                db, payload.paper_id, payload.question, top_k=4, threshold=0.01
            )
            context_str = rag_result.get("formatted_context", "")
            citations = rag_result.get("citations", [])
            
    if not context_str:
        context_str = "NO CONTEXT AVAILABLE. The document does not contain information about this query."

    answer, _ = await openai_service.chat(payload.question, context_str, [])

    try:
        await VectorMemoryService.add_memory(
            db=db,
            user_id=current_user.id,
            content=f"Q: {payload.question[:100]} | Doc: {paper_title}",
            memory_type="QueryHistory",
            topic=payload.question[:40]
        )
    except Exception:
        pass

    formatted_citations = [f"📄 {paper_title} — Chunk {c['chunk_id']} (Score: {c['score']})" for c in citations[:3]]
    if not formatted_citations:
        formatted_citations = [f"📄 {paper_title}"]

    return {
        "status": "success",
        "agent_type": payload.agent_type,
        "model_used": payload.ai_model,
        "answer": answer,
        "citations": formatted_citations,
        "chunks_used": len(citations),
        "suggestions": [
            f"Can you explain this with a diagram or example?",
            f"What are the key formulas related to this?",
            f"Quiz me on this topic from the document"
        ]
    }


@router.post("", response_model=ChatResponse)
async def chat_with_paper(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Chat with a specific paper using RAG context."""
    paper = await paper_crud.get_paper(db, request.paper_id)
    if not paper or paper.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Paper not found or unauthorized")

    rag_result = await RAGService.retrieve_context(
        db, request.paper_id, request.message, top_k=4, threshold=0.01
    )
    context_str = rag_result.get("formatted_context", "")
    citations = rag_result.get("citations", [])

    if not context_str:
        context_str = "NO CONTEXT AVAILABLE. The document does not contain information about this query."

    history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]
    
    answer, tokens = await openai_service.chat(request.message, context_str, history_dicts)

    return ChatResponse(
        message=answer, 
        tokens_used=tokens,
        citations=citations
    )
