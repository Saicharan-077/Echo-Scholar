"""
EchoXScholar - AI Professor Chat Endpoint
Document-grounded Q&A using RAG pipeline + multiple AI providers.
Supports both synchronous and streaming SSE responses.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.crud import paper as paper_crud
from app.models.user import User
from app.services.openai_service import openai_service
from app.services.rag_service import RAGService
from app.services.ai_model_router import AIModelRouter
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
    """
    Document-grounded Q&A with RAG context + Socratic AI Tutor.
    1. RAG vector search for relevant chunks (with threshold)
    2. Build rich Socratic system prompt with document context
    3. Call AI via openai_service (primary) or AIModelRouter (fallback)
    4. Return answer with citations + follow-up suggestions
    """
    paper_title = "your study material"
    context_str = ""
    citations = []

    # Step 1: RAG vector search with improved threshold
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
        context_str = "No specific document context available for this query."

    # Step 2: Build Socratic system prompt (local's strength)
    system_instruction = f"""You are Professor Vox, an expert AI tutor for EchoXScholar.

PRIMARY INSTRUCTIONS:
1. If the user's question relates to the document context provided below, ground your answer in that context and cite relevant sections/pages.
2. If the user asks a question NOT covered in the provided document context (e.g. general knowledge, math, coding, system design), DO NOT refuse to answer! Provide a comprehensive, accurate response using your deep AI knowledge, and add a brief note at the end: "(Note: Answered using general knowledge as this wasn't found in your uploaded paper context)."
3. Format your answers clearly with:
   - Markdown headers (##)
   - Bullet points for key takeaways
   - Bold text for technical terms
   - Code/math blocks for equations or code snippets
4. Always end with an engaging Socratic follow-up question to encourage deeper learning.

ACTIVE STUDY MATERIAL: {paper_title}

RELEVANT DOCUMENT CONTEXT:
{context_str}"""

    # Step 3: Generate response - try openai_service first, fall back to AIModelRouter
    try:
        answer, _ = await openai_service.chat(payload.question, context_str, [])
    except Exception:
        answer = await AIModelRouter.generate_response(
            prompt=payload.question,
            system_instruction=system_instruction,
            model_name=payload.ai_model or "gemini-2.0-flash",
            temperature=0.4,
            max_tokens=1500
        )

    # Step 4: Log to memory
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
            "Can you explain this with a diagram or example?",
            "What are the key formulas related to this?",
            "Quiz me on this topic from the document"
        ]
    }


@router.post("", response_model=ChatResponse)
async def chat_with_paper(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Chat with a specific paper using RAG context + chat history."""
    paper = await paper_crud.get_paper(db, request.paper_id)
    if not paper or paper.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Paper not found or unauthorized")

    rag_result = await RAGService.retrieve_context(
        db, request.paper_id, request.message, top_k=4, threshold=0.01
    )
    context_str = rag_result.get("formatted_context", "")
    citations = rag_result.get("citations", [])

    if not context_str:
        # Fall back to raw text excerpt for context
        context_str = paper.raw_text[:3000] if paper.raw_text else paper.summary or paper.title

    history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]

    try:
        answer, tokens = await openai_service.chat(request.message, context_str, history_dicts)
    except Exception:
        system = (
            f"You are Professor Vox teaching from the document: '{paper.title}'. "
            f"Ground all answers in this content:\n\n{context_str}"
        )
        answer = await AIModelRouter.generate_response(
            prompt=request.message,
            system_instruction=system,
            temperature=0.4,
            max_tokens=1200
        )
        tokens = len(answer.split()) + 100

    return ChatResponse(message=answer, tokens_used=tokens, citations=citations)


@router.post("/stream")
async def chat_with_paper_stream(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Real streaming SSE endpoint for Chatting with a paper."""
    paper = await paper_crud.get_paper(db, request.paper_id)
    if not paper or paper.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Paper not found or unauthorized")

    # Get RAG context
    rag_result = await RAGService.retrieve_context(
        db, request.paper_id, request.message, top_k=4, threshold=0.01
    )
    context_str = rag_result.get("formatted_context", "")

    if not context_str:
        context_str = paper.raw_text[:3000] if paper.raw_text else paper.summary or paper.title

    system = (
        f"You are Professor Vox, an expert AI tutor for EchoXScholar, teaching from the document: '{paper.title}'. "
        f"Answer clearly and helpfully. Ground all answers in this content:\n\n{context_str}"
    )

    async def stream_generator():
        async for chunk in AIModelRouter.generate_response_stream(
            prompt=request.message,
            system_instruction=system,
            temperature=0.4,
            max_tokens=1200
        ):
            # SSE format
            yield f"data: {chunk}\n\n"

        # End event
        yield f"data: [DONE]\n\n"

    return StreamingResponse(stream_generator(), media_type="text/event-stream")
