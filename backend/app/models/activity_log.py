"""
EchoXScholar - Activity Logging Database Model
"""
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, TimestampMixin


class ActivityLog(Base, TimestampMixin):
    """
    Stores structured user activity records for analytics and timeline feeds.
    """
    __tablename__ = "activity_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    action: Mapped[str] = mapped_column(String(100), index=True) # e.g. LOGIN, VOICE_INTERACTION, QUIZ_ATTEMPT, LECTURE_PROCESSED, MOCK_INTERVIEW
    module: Mapped[str] = mapped_column(String(50), index=True)  # e.g. VoiceProfessor, AdaptiveQuiz, PlacementHub, LectureAssistant, Auth
    device_info: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    metadata_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
