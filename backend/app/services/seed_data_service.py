"""
EchoScholar X - Data Seeding Service for Demo Accounts
"""
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, UserRole
from app.models.learning_dna import (
    LearningDNA,
    ConceptNode,
    ConceptDependency,
    ConfusionLog,
    LearningAnalytics,
    StudentMemory,
    AdaptiveQuiz,
    PlacementSession,
    LectureSession,
    LearningPath,
    GamificationState,
)
from app.models.activity_log import ActivityLog
from app.core.security import get_password_hash


class SeedDataService:
    """Service to seed realistic demo users and multi-month learning histories."""

    @staticmethod
    async def seed_all_demo_data(db: AsyncSession):
        demo_accounts = [
            ("demo@EchoScholar.ai", "Demo Student", "Current Semester", "Computer Science & AI", 1450, 3, 5, 240, 75.0, 68.0),
            ("advanced@EchoScholar.ai", "Advanced Student", "Final Year", "Computer Science & Engineering", 3200, 5, 14, 520, 92.0, 88.0),
            ("beginner@EchoScholar.ai", "Beginner Student", "First Year", "Information Technology", 450, 1, 2, 80, 45.0, 50.0),
            ("placement@EchoScholar.ai", "Placement Candidate", "Final Year", "AI & Data Science", 2100, 4, 8, 380, 84.0, 82.0),
            ("admin@EchoScholar.ai", "Admin Quality Lead", "Administration", "System Admin", 5000, 10, 30, 990, 99.0, 99.0),
        ]

        for email, full_name, sem, branch, xp, level, streak, coins, knowledge, readiness in demo_accounts:
            res = await db.execute(select(User).where(User.email == email))
            user = res.scalars().first()

            if not user:
                role = UserRole.ADMIN if email.startswith("admin") else UserRole.USER
                user = User(
                    email=email,
                    username=email.split("@")[0],
                    hashed_password=get_password_hash("Demo@123" if not email.startswith("admin") else "Admin@123"),
                    full_name=full_name,
                    role=role,
                    is_active=True
                )
                db.add(user)
                await db.commit()
                await db.refresh(user)

                # Seed Learning DNA
                dna = LearningDNA(
                    user_id=user.id,
                    semester=sem,
                    branch=branch,
                    preferred_language="Teluglish" if email.startswith("demo") else "English",
                    explanation_style="Analogy-Based" if not email.startswith("advanced") else "Step-by-Step",
                    learning_speed=65.0 if email.startswith("advanced") else 50.0,
                    confidence_score=readiness,
                    attention_span_mins=30 if email.startswith("advanced") else 25,
                    strong_subjects=["Data Structures", "Python", "SQL"] if readiness > 60 else ["Python Basics"],
                    weak_subjects=["Dynamic Programming", "System Design Caching"] if readiness <= 80 else [],
                    common_misconceptions=["Recursion call stack overflow", "Pointers dereferencing"]
                )
                db.add(dna)

                # Seed Gamification State
                game = GamificationState(
                    user_id=user.id,
                    xp=xp,
                    level=level,
                    current_streak=streak,
                    longest_streak=streak + 4,
                    study_coins=coins,
                    badges=[
                        {"id": "b1", "name": "Night Owl", "desc": "Studied past 10 PM", "icon": "Moon"},
                        {"id": "b2", "name": "Streak Master", "desc": f"Maintained a {streak}-day streak", "icon": "Flame"},
                        {"id": "b3", "name": "Placement Titan", "desc": "Completed 10 DSA mock interviews", "icon": "Award"}
                    ]
                )
                db.add(game)

                # Seed Analytics
                heatmap = {}
                today = datetime.now()
                for i in range(30):
                    d_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
                    heatmap[d_str] = (45 + (i * 13) % 90) if i % 2 == 0 else 0

                analytics = LearningAnalytics(
                    user_id=user.id,
                    knowledge_score=knowledge,
                    memory_score=knowledge - 4,
                    confidence_score=readiness - 5,
                    learning_velocity=2.1 if readiness > 70 else 1.2,
                    consistency_score=88.0,
                    revision_effectiveness=82.0,
                    predicted_exam_score=knowledge + 3,
                    placement_readiness=readiness,
                    activity_heatmap=heatmap
                )
                db.add(analytics)

                # Seed Placement Session
                place_session = PlacementSession(
                    user_id=user.id,
                    category="DSA",
                    title="Floyd's Cycle Detection Algorithm",
                    score=88.0 if readiness > 70 else 60.0,
                    feedback="Strong two-pointer step explanation! Explicitly state time complexity O(N) and space complexity O(1).",
                    action_items=["State Big-O time and space complexity upfront"]
                )
                db.add(place_session)

                # Seed Activity Log
                act = ActivityLog(
                    user_id=user.id,
                    action="LOGIN",
                    module="Auth",
                    device_info="Web Chrome / Windows",
                    metadata_json={"welcome_message": f"Welcome back {full_name}!"}
                )
                db.add(act)

                await db.commit()
