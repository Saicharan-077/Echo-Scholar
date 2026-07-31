"""
EchoScholar X - Gamification Engine API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.learning_dna import GamificationState

router = APIRouter(prefix="/gamification", tags=["Gamification Hub"])


@router.get("/")
async def get_gamification_state(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(GamificationState).where(GamificationState.user_id == current_user.id))
    state = res.scalars().first()

    if not state:
        state = GamificationState(
            user_id=current_user.id,
            xp=1450,
            level=3,
            current_streak=5,
            longest_streak=12,
            study_coins=240,
            badges=[
                {"id": "b1", "name": "Night Owl", "desc": "Studied past 10 PM", "icon": "Moon"},
                {"id": "b2", "name": "Streak Master", "desc": "Maintained a 5-day streak", "icon": "Flame"},
                {"id": "b3", "name": "Placement Titan", "desc": "Completed 10 DSA mock interviews", "icon": "Award"}
            ],
            unlocked_rewards=["Theme: Cyberpunk Glass", "Professor Avatar: Einstein"]
        )
        db.add(state)
        await db.commit()
        await db.refresh(state)

    return {
        "status": "success",
        "xp": state.xp,
        "level": state.level,
        "current_streak": state.current_streak,
        "longest_streak": state.longest_streak,
        "study_coins": state.study_coins,
        "badges": state.badges,
        "unlocked_rewards": state.unlocked_rewards
    }
