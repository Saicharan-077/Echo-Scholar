"""
EchoXScholar - Activity Logging Service
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.activity_log import ActivityLog


class ActivityLogService:
    """Service to log user actions and fetch recent activity feeds."""

    @staticmethod
    async def log_activity(
        db: AsyncSession,
        user_id: int,
        action: str,
        module: str,
        device_info: Optional[str] = "Web Chrome / Windows",
        metadata: Optional[Dict[str, Any]] = None
    ) -> ActivityLog:
        log = ActivityLog(
            user_id=user_id,
            action=action,
            module=module,
            device_info=device_info,
            metadata_json=metadata or {}
        )
        db.add(log)
        await db.commit()
        await db.refresh(log)
        return log

    @staticmethod
    async def get_user_activities(
        db: AsyncSession,
        user_id: int,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        res = await db.execute(
            select(ActivityLog).where(ActivityLog.user_id == user_id).order_by(ActivityLog.created_at.desc()).limit(limit)
        )
        logs = list(res.scalars().all())

        return [
            {
                "id": l.id,
                "action": l.action,
                "module": l.module,
                "device_info": l.device_info,
                "metadata": l.metadata_json,
                "timestamp": l.created_at.isoformat() if l.created_at else None
            }
            for l in logs
        ]

    @staticmethod
    async def get_system_activities(
        db: AsyncSession,
        limit: int = 25
    ) -> List[Dict[str, Any]]:
        res = await db.execute(
            select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit)
        )
        logs = list(res.scalars().all())

        return [
            {
                "id": l.id,
                "user_id": l.user_id,
                "action": l.action,
                "module": l.module,
                "device_info": l.device_info,
                "metadata": l.metadata_json,
                "timestamp": l.created_at.isoformat() if l.created_at else None
            }
            for l in logs
        ]
