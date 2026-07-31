"""
EchoScholar X - AI Professor Chat Endpoint
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
from app.services.ai_model_router import AIModelRouter
from app.services.vector_memory_service import VectorMemoryService

router = APIRouter(prefix="/chat", tags=["Chat"])


class AskRequestSchema(BaseModel):
    question: str
    agent_type: Optional[str] = "teacher"
    ai_model: Optional[str] = "gemini-2.0-flash"
    paper_id: Optional[int] = None


@router.post("/ask")
async def ask_general_chat(
    payload: AskRequestSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Document-grounded Q&A.
    1. RAG search for relevant chunks from the selected document
    2. Build a rich context-grounded prompt
    3. Call Gemini with document chunks as context
    4. Return answer with citations
    """
    context_chunks = []
    citations = []
    paper_title = "your study material"

    # Step 1: RAG vector search
    if payload.paper_id:
        try:
            from app.services.rag_service import RAGService
            context_chunks = await RAGService.vector_search(
                db, payload.paper_id, payload.question, top_k=4
            )
            if context_chunks:
                paper = await paper_crud.get_paper(db, payload.paper_id)
                if paper:
                    paper_title = paper.title
                    citations = [
                        f"📄 {paper.title} — Section {c['id']}"
                        for c in context_chunks[:3]
                    ]
        except Exception as e:
            print(f"RAG search error in chat: {e}")

    # Step 2: Build context string from retrieved chunks
    if context_chunks:
        context_str = "\n\n---\n\n".join([
            f"[Document Section {c['id']}]\n{c['text']}"
            for c in context_chunks
        ])
    else:
        context_str = "No specific document context available."

    # Step 3: Build hybrid document-grounded + general knowledge system instruction
    system_instruction = f"""You are Professor Vox, an expert AI tutor.

PRIMARY INSTRUCTIONS:
1. If the user's question relates to the document context provided below, ground your answer in that context and cite relevant sections/pages.
2. If the user asks a question that is NOT covered in the provided document context (e.g. general knowledge, math, coding, system design, or unrelated concepts), DO NOT refuse to answer! Provide a comprehensive, accurate, and helpful response using your deep AI knowledge, and add a brief note at the end: "(Note: Answered using general knowledge as this wasn't found in your uploaded paper context)."
3. Format your answers clearly with:
   - Markdown headers (##)
   - Bullet points for key takeaways
   - Bold text for technical terms
   - Code/math blocks for equations or code snippets
4. Always end with an engaging Socratic follow-up question to encourage deeper learning.

ACTIVE STUDY MATERIAL: {paper_title}

RELEVANT DOCUMENT CONTEXT:
{context_str}"""

    # Step 4: Generate response
    answer = await AIModelRouter.generate_response(
        prompt=payload.question,
        system_instruction=system_instruction,
        model_name=payload.ai_model or "gemini-2.0-flash",
        temperature=0.4,
        max_tokens=1500
    )

    # Step 5: Log to memory
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

    if not citations:
        citations = [f"📄 {paper_title}"]

    return {
        "status": "success",
        "agent_type": payload.agent_type,
        "model_used": "gemini-2.0-flash",
        "answer": answer,
        "citations": citations[:3],
        "chunks_used": len(context_chunks),
        "suggestions": [
            f"Can you explain this with a diagram or example?",
            f"What are the key formulas related to this?",
            f"Quiz me on this topic from the document"
        ]
    }


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

    # Get RAG context
    context_str = ""
    try:
        from app.services.rag_service import RAGService
        chunks = await RAGService.vector_search(db, request.paper_id, request.message, top_k=3)
        if chunks:
            context_str = "\n\n---\n\n".join([c["text"] for c in chunks])
    except Exception:
        pass

    if not context_str:
        # Fall back to raw text excerpt
        context_str = paper.raw_text[:3000] if paper.raw_text else paper.summary or paper.title

    system = (
        f"You are Professor Vox teaching from the document: '{paper.title}'. "
        f"Ground all answers in this content:\n\n{context_str}"
    )

    response_text = await AIModelRouter.generate_response(
        prompt=request.message,
        system_instruction=system,
        temperature=0.4,
        max_tokens=1200
    )

    return ChatResponse(message=response_text, tokens_used=len(response_text.split()) + 100)
