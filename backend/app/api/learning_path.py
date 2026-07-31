"""
EchoScholar X - Personalized Learning Path API Routes
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.learning_dna import LearningPath
from app.agents import CoordinatorAgent

router = APIRouter(prefix="/learning-path", tags=["Personalized Learning Path"])


@router.get("/")
async def get_learning_path(
    duration_type: str = Query("Weekly"), # Daily, Weekly, Monthly
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(
        select(LearningPath).where(
            LearningPath.user_id == current_user.id,
            LearningPath.duration_type == duration_type
        )
    )
    path = res.scalars().first()

    if not path:
        roadmap_items = [
            {"day": "Monday", "task": "Recursion & Call Stack Visualization", "duration_mins": 45, "completed": True},
            {"day": "Tuesday", "task": "Memoization & Top-Down DP Patterns", "duration_mins": 60, "completed": True},
            {"day": "Wednesday", "task": "Tabulation & State Space Reduction", "duration_mins": 45, "completed": False},
            {"day": "Thursday", "task": "Dynamic Programming Case Studies", "duration_mins": 60, "completed": False},
            {"day": "Friday", "task": "System Design Caching Layer Practice", "duration_mins": 45, "completed": False},
            {"day": "Saturday", "task": "Placement Mock HR & Behavioral Prep", "duration_mins": 30, "completed": False},
            {"day": "Sunday", "task": "Weekly Adaptive Quiz & Learning DNA Update", "duration_mins": 45, "completed": False}
        ]

        path = LearningPath(
            user_id=current_user.id,
            title=f"Personalized {duration_type} Mastery Roadmap",
            duration_type=duration_type,
            total_hours=5.5,
            completed_percentage=28.5,
            roadmap_items=roadmap_items
        )
        db.add(path)
        await db.commit()
        await db.refresh(path)

    return {
        "status": "success",
        "learning_path": path
    }
