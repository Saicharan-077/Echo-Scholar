"""
EchoScholar X - Voice AI Professor API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.edge_tts_service import EdgeTTSService
from app.services.vector_memory_service import VectorMemoryService
from app.services.learning_dna_service import LearningDNAService
from app.services.ai_model_router import AIModelRouter

router = APIRouter(prefix="/professor", tags=["Voice AI Professor"])


class VoiceInteractSchema(BaseModel):
    user_speech_text: Optional[str] = None
    text: Optional[str] = None
    target_language: Optional[str] = "English"
    language: Optional[str] = "English"
    mode: Optional[str] = "Interactive"
    voice_persona: Optional[str] = "en-IN-PrabhatNeural"
    voice: Optional[str] = "en-IN-PrabhatNeural"
    speed: Optional[str] = "1.0"
    ai_model: Optional[str] = "gemini-1.5-pro"
    paper_id: Optional[int] = None


@router.post("/speak")
async def interact_with_professor(
    payload: VoiceInteractSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query_text = payload.text or payload.user_speech_text or "Hello Professor Vox"
    lang = payload.language or payload.target_language or "English"
    voice = payload.voice or payload.voice_persona or "en-IN-PrabhatNeural"

    dna = await LearningDNAService.get_or_create_dna(db, current_user.id)

    # Fetch RAG context from student documents
    context_chunks = []
    if payload.paper_id:
        try:
            from app.services.rag_service import RAGService
            context_chunks = await RAGService.vector_search(db, payload.paper_id, query_text, top_k=2)
        except Exception as e:
            print(f"Error doing RAG vector search in voice: {e}")

    if not context_chunks:
        memories = await VectorMemoryService.retrieve_relevant_memories(db, current_user.id, query_text, limit=2)
        if memories:
            context_chunks = [{"text": m["content"]} for m in memories]

    context_str = ""
    if context_chunks:
        context_str = "\n\nRelevant Document Context:\n" + "\n".join([c["text"] for c in context_chunks])

    lang_instructions = f"Answer in {lang}. Explain clearly using analogies, step-by-step structure, and markdown."
    if lang in ["Teluglish", "Hinglish"]:
        lang_instructions += f" Use standard {lang[:3]} phrasing, but retain exact English technical computer science words."

    sys_prompt = f"You are Professor Vox, an empathetic AI Personal Professor tuned to Cognitive Twin model. {lang_instructions}{context_str}"
    model_choice = payload.ai_model or "gemini-1.5-pro"

    # Call AI Model Router (Gemini, Featherless, or Rich Generator)
    ai_text = await AIModelRouter.generate_response(
        prompt=query_text,
        system_instruction=sys_prompt,
        model_name=model_choice
    )

    # Determine voice persona
    if "telugu" in lang.lower():
        voice = "te-IN-MohanNeural"
    elif "hindi" in lang.lower():
        voice = "hi-IN-MadhurNeural"

    # Generate TTS audio
    audio_path = None
    try:
        clean_text_for_speech = ai_text.replace("#", "").replace("*", "").replace("`", "")[:400]
        audio_res = await EdgeTTSService.generate_audio(
            text=clean_text_for_speech,
            voice=voice
        )
        if audio_res.get("success"):
            audio_path = audio_res.get("file_path")
    except Exception as e:
        print(f"TTS generation note: {e}")

    # Log memory
    await VectorMemoryService.add_memory(
        db, current_user.id,
        content=f"Discussed: {query_text[:80]} | Response: {ai_text[:80]}",
        memory_type="DiscussionSummary"
    )

    return {
        "status": "success",
        "professor_response_text": ai_text,
        "text": ai_text,
        "response": ai_text,
        "model_used": model_choice,
        "language_used": lang,
        "voice_used": voice,
        "audio_url": f"/api/podcasts/audio/{audio_path.split('/')[-1]}" if audio_path else None
    }
