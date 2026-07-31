"""
EchoXScholar - Learning DNA & Cognitive Twin Database Models
"""
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.core.database import Base, TimestampMixin


class LearningDNA(Base, TimestampMixin):
    """
    Cognitive Twin profile model storing inferred learner characteristics.
    """
    __tablename__ = "learning_dna"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)

    # Demographic & Academic Profile
    semester: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    branch: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    preferred_language: Mapped[str] = mapped_column(String(50), default="English") # English, Telugu, Hindi, Teluglish, Hinglish
    placement_goals: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    exam_goals: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Inferred Cognitive Twin Metrics (0.0 to 100.0 scale or enum)
    explanation_style: Mapped[str] = mapped_column(String(50), default="Analogy-Based") # Analogy-Based, Visual, Step-by-Step, First-Principles, Intuitive
    learning_speed: Mapped[float] = mapped_column(Float, default=50.0) # 0 = slow/thorough, 100 = fast
    confidence_score: Mapped[float] = mapped_column(Float, default=60.0)
    attention_span_mins: Mapped[int] = mapped_column(Integer, default=25)
    revision_frequency_days: Mapped[int] = mapped_column(Integer, default=3)
    memory_decay_rate: Mapped[float] = mapped_column(Float, default=0.15) # decay constant
    curiosity_score: Mapped[float] = mapped_column(Float, default=70.0)
    preferred_quiz_difficulty: Mapped[str] = mapped_column(String(50), default="Medium")

    # Topic Lists (JSON stored)
    strong_subjects: Mapped[List[str]] = mapped_column(JSON, default=list)
    weak_subjects: Mapped[List[str]] = mapped_column(JSON, default=list)
    common_misconceptions: Mapped[List[str]] = mapped_column(JSON, default=list)

    # Relationships
    user = relationship("User", back_populates="learning_dna")


class ConceptNode(Base, TimestampMixin):
    """
    Knowledge Graph Node representing a concept or topic in a subject.
    """
    __tablename__ = "concept_nodes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    subject: Mapped[str] = mapped_column(String(100), index=True)
    name: Mapped[str] = mapped_column(String(150), index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Learning state
    mastery_percentage: Mapped[float] = mapped_column(Float, default=0.0) # 0.0 to 100.0
    status: Mapped[str] = mapped_column(String(50), default="Not Started") # Not Started, In Progress, Mastered, Needs Revision
    last_reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class ConceptDependency(Base, TimestampMixin):
    """
    Prerequisite relationship between concept nodes.
    """
    __tablename__ = "concept_dependencies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parent_concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concept_nodes.id", ondelete="CASCADE"))
    child_concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concept_nodes.id", ondelete="CASCADE"))
    dependency_type: Mapped[str] = mapped_column(String(50), default="Prerequisite") # Prerequisite, Corequisite, Extension


class ConfusionLog(Base, TimestampMixin):
    """
    Records detected confusion, struggle patterns, and underlying root cause diagnosis.
    """
    __tablename__ = "confusion_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    detected_topic: Mapped[str] = mapped_column(String(150))
    root_cause_concept: Mapped[str] = mapped_column(String(150))
    source: Mapped[str] = mapped_column(String(50)) # Chat, Quiz, Voice, Lecture
    confidence_level: Mapped[float] = mapped_column(Float, default=80.0)
    recommended_revision: Mapped[str] = mapped_column(Text)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)


class LearningAnalytics(Base, TimestampMixin):
    """
    Calculated analytics metrics for student performance dashboards.
    """
    __tablename__ = "learning_analytics"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)

    knowledge_score: Mapped[float] = mapped_column(Float, default=65.0)
    memory_score: Mapped[float] = mapped_column(Float, default=70.0)
    confidence_score: Mapped[float] = mapped_column(Float, default=60.0)
    learning_velocity: Mapped[float] = mapped_column(Float, default=1.2) # topics per week
    consistency_score: Mapped[float] = mapped_column(Float, default=85.0)
    revision_effectiveness: Mapped[float] = mapped_column(Float, default=78.0)
    predicted_exam_score: Mapped[float] = mapped_column(Float, default=75.0)
    placement_readiness: Mapped[float] = mapped_column(Float, default=55.0)

    # Activity Heatmap Data JSON: {"YYYY-MM-DD": minutes_studied}
    activity_heatmap: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)


class StudentMemory(Base, TimestampMixin):
    """
    Structured and vector context items remembered for each student.
    """
    __tablename__ = "student_memories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    memory_type: Mapped[str] = mapped_column(String(50)) # Mistake, KeyInsight, Goal, Preference, DiscussionSummary
    content: Mapped[str] = mapped_column(Text)
    topic: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    importance_score: Mapped[float] = mapped_column(Float, default=1.0)


class AdaptiveQuiz(Base, TimestampMixin):
    """
    Adaptive Quiz sessions and stored question details.
    """
    __tablename__ = "adaptive_quizzes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    subject: Mapped[str] = mapped_column(String(100))
    topic: Mapped[str] = mapped_column(String(150))
    difficulty_level: Mapped[str] = mapped_column(String(50), default="Medium") # Easy, Medium, Hard, Application, Case Study, Interview, Competitive Programming
    score_percentage: Mapped[float] = mapped_column(Float, default=0.0)
    total_questions: Mapped[int] = mapped_column(Integer, default=5)
    correct_count: Mapped[int] = mapped_column(Integer, default=0)
    questions_data: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    misconception_analysis: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class PlacementSession(Base, TimestampMixin):
    """
    Placement Mode session (DSA, Mock Interview, System Design, HR).
    """
    __tablename__ = "placement_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    category: Mapped[str] = mapped_column(String(50)) # DSA, SQL, OS, DBMS, CN, OOP, Java, Python, React, System Design, HR Interview, Resume Review
    title: Mapped[str] = mapped_column(String(200))
    score: Mapped[float] = mapped_column(Float, default=0.0)
    feedback: Mapped[str] = mapped_column(Text)
    action_items: Mapped[List[str]] = mapped_column(JSON, default=list)


class LectureSession(Base, TimestampMixin):
    """
    Live Lecture Assistant processing session.
    """
    __tablename__ = "lecture_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    raw_transcript: Mapped[str] = mapped_column(Text, default="")
    structured_notes: Mapped[str] = mapped_column(Text, default="")
    key_points: Mapped[List[str]] = mapped_column(JSON, default=list)
    mind_map_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    flashcards_json: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    quiz_json: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)


class LearningPath(Base, TimestampMixin):
    """
    Personalized study roadmap (daily, weekly, monthly).
    """
    __tablename__ = "learning_paths"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    duration_type: Mapped[str] = mapped_column(String(50)) # Daily, Weekly, Monthly
    target_exam_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    total_hours: Mapped[float] = mapped_column(Float, default=10.0)
    completed_percentage: Mapped[float] = mapped_column(Float, default=0.0)
    roadmap_items: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)


class GamificationState(Base, TimestampMixin):
    """
    Gamification profile (XP, Level, Streak, Badges, Coins).
    """
    __tablename__ = "gamification_states"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    current_streak: Mapped[int] = mapped_column(Integer, default=1)
    longest_streak: Mapped[int] = mapped_column(Integer, default=1)
    study_coins: Mapped[int] = mapped_column(Integer, default=50)
    badges: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    unlocked_rewards: Mapped[List[str]] = mapped_column(JSON, default=list)
