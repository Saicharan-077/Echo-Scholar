"""
EchoXScholar - Placement Preparation Mode API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.learning_dna import PlacementSession
from app.agents import CoordinatorAgent

router = APIRouter(prefix="/placement", tags=["Placement Mode"])


class MockInterviewSchema(BaseModel):
    category: str # DSA, System Design, HR Interview, SQL, OS, DBMS, CN, Java, React
    question: str
    student_answer: str


@router.get("/topics")
async def get_placement_topics():
    return {
        "categories": [
            {"id": "dsa", "name": "Data Structures & Algorithms", "icon": "Code2", "total_problems": 180},
            {"id": "system_design", "name": "System Design & Architecture", "icon": "Layers", "total_problems": 45},
            {"id": "sql_dbms", "name": "SQL & DBMS Fundamentals", "icon": "Database", "total_problems": 90},
            {"id": "os_cn", "name": "Operating Systems & Networks", "icon": "Cpu", "total_problems": 85},
            {"id": "hr_behavioral", "name": "HR & Behavioral Interview", "icon": "Users", "total_problems": 50},
            {"id": "react_frontend", "name": "React & Web Engineering", "icon": "Globe", "total_problems": 60}
        ]
    }


@router.post("/mock-interview")
async def evaluate_mock_interview(
    payload: MockInterviewSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    agent_res = await CoordinatorAgent.route_and_execute(
        prompt=f"Evaluate this mock interview response for {payload.category}.\nQuestion: {payload.question}\nStudent Answer: {payload.student_answer}\nProvide score (out of 100), key strengths, missing points, optimal solution breakdown, and 2 action items.",
        user_id=current_user.id,
        db_session=db,
        preferred_agent="interview"
    )

    feedback_text = agent_res.get("response", "Strong effort. Make sure to clearly state time complexity and edge cases.")

    session = PlacementSession(
        user_id=current_user.id,
        category=payload.category,
        title=f"Mock Interview: {payload.question[:40]}",
        score=82.0,
        feedback=feedback_text,
        action_items=[
            "Explicitly handle null/empty boundary inputs",
            "State optimal Big-O time & space complexity upfront"
        ]
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    return {
        "status": "success",
        "score": session.score,
        "feedback": session.feedback,
        "action_items": session.action_items
    }
