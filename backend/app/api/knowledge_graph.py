"""
EchoXScholar - Concept Dependency Knowledge Graph API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.dependency_graph_service import DependencyGraphService

router = APIRouter(prefix="/knowledge-graph", tags=["Knowledge Graph"])


@router.get("/")
async def get_knowledge_graph(
    subject: str = Query("Data Structures & Algorithms"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    graph = await DependencyGraphService.get_user_subject_graph(
        db, current_user.id, subject
    )
    return {
        "status": "success",
        "graph": graph
    }


@router.get("/gaps")
async def check_concept_gaps(
    concept: str = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gaps = await DependencyGraphService.check_prerequisite_gaps(
        db, current_user.id, concept
    )
    return {
        "status": "success",
        "target_concept": concept,
        "has_prerequisite_gaps": len(gaps) > 0,
        "gaps": gaps
    }
