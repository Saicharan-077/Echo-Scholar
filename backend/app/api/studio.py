"""
EchoScholar X - AI Learning Studio API Routes
Configures learning modes, session parameters, and LLM-agnostic prompt mappings.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.crud import paper as paper_crud
from app.core.prompts import get_mapped_prompt, PROMPT_MAP

router = APIRouter(prefix="/studio", tags=["AI Learning Studio"])


class LearningStudioConfigRequest(BaseModel):
    paper_id: Optional[int] = None
    paper_title: Optional[str] = "Attention Is All You Need — Transformer Architecture"
    learning_mode: Optional[str] = "story_mode"  # story_mode, debate_mode, group_discussion, interview_mode, literature_review
    language: Optional[str] = "English"
    duration: Optional[str] = "15-Min Deep Dive"
    difficulty: Optional[str] = "Practitioner / Engineer"
    focus: Optional[str] = "General Understanding"


@router.post("/configure")
async def configure_learning_session(
    payload: LearningStudioConfigRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Configures AI Learning Studio session.
    Validates mode and maps prompt template without triggering live LLM execution (Phase 1).
    """
    if payload.learning_mode not in PROMPT_MAP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid learning mode '{payload.learning_mode}'. Must be one of: {list(PROMPT_MAP.keys())}"
        )

    paper_title = payload.paper_title or "Selected Research Paper"
    if payload.paper_id:
        paper = await paper_crud.get_paper(db, payload.paper_id)
        if paper:
            paper_title = paper.title

    mapped_prompt = get_mapped_prompt(
        learning_mode=payload.learning_mode,
        paper_title=paper_title,
        language=payload.language or "English",
        duration=payload.duration or "15-Min Deep Dive",
        difficulty=payload.difficulty or "Practitioner / Engineer",
        focus=payload.focus or "General Understanding"
    )

    return {
        "status": "configured",
        "paper_id": payload.paper_id,
        "paper_title": paper_title,
        "learning_mode": payload.learning_mode,
        "configuration": {
            "language": payload.language,
            "duration": payload.duration,
            "difficulty": payload.difficulty,
            "focus": payload.focus
        },
        "mapped_prompt_template": mapped_prompt,
        "message": "AI Learning Studio session configured successfully. Ready for Phase 2 AI generation."
    }
