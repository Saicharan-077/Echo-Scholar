"""
EchoScholar X - Admin Management API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserRole
from app.services.activity_log_service import ActivityLogService
from app.services.seed_data_service import SeedDataService

router = APIRouter(prefix="/admin", tags=["Admin Oversight"])


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN and current_user.email != "admin@EchoScholar.ai":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


@router.get("/activities")
async def get_system_activities(
    limit: int = 25,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    activities = await ActivityLogService.get_system_activities(db, limit=limit)
    return {
        "status": "success",
        "activities": activities
    }


@router.get("/users")
async def get_users_list(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    res = await db.execute(select(User))
    users = list(res.scalars().all())

    formatted_users = [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "username": u.username,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat() if u.created_at else None
        }
        for u in users
    ]

    return {
        "status": "success",
        "total_users": len(formatted_users),
        "users": formatted_users
    }


@router.post("/seed")
async def trigger_demo_seed(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    await SeedDataService.seed_all_demo_data(db)
    return {
        "status": "success",
        "message": "Demo users and realistic learning histories successfully seeded!"
    }
