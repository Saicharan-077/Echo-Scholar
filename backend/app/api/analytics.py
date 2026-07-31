"""
EchoXScholar - Learning Analytics API Routes
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Learning Analytics"])


@router.get("/")
async def get_learning_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analytics = await AnalyticsService.get_or_create_analytics(db, current_user.id)
    return {
        "status": "success",
        "analytics": analytics
    }
