"""
EchoXScholar - Learning DNA API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.learning_dna_service import LearningDNAService

router = APIRouter(prefix="/learning-dna", tags=["Learning DNA"])


class DNAUpdateSchema(BaseModel):
    semester: Optional[str] = None
    branch: Optional[str] = None
    preferred_language: Optional[str] = None
    explanation_style: Optional[str] = None
    placement_goals: Optional[str] = None
    exam_goals: Optional[str] = None


@router.get("/")
async def get_learning_dna(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dna = await LearningDNAService.get_or_create_dna(db, current_user.id)
    return {
        "status": "success",
        "learning_dna": dna
    }


@router.put("/")
async def update_learning_dna(
    payload: DNAUpdateSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dna = await LearningDNAService.update_dna(
        db, current_user.id, payload.model_dump(exclude_unset=True)
    )
    return {
        "status": "success",
        "message": "Cognitive Twin profile updated successfully",
        "learning_dna": dna
    }
