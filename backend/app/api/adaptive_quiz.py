"""
EchoScholar X - Document-Grounded Adaptive Quiz Engine
Generates quiz questions ONLY from the uploaded document using RAG pipeline.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import os
import httpx

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.learning_dna import AdaptiveQuiz
from app.crud import paper as paper_crud
from app.services.confusion_detector_service import ConfusionDetectorService
from app.services.learning_dna_service import LearningDNAService

router = APIRouter(prefix="/quiz", tags=["Adaptive Quiz Engine"])


class QuizSubmitSchema(BaseModel):
    quiz_id: Optional[str] = None
    subject: str
    topic: str
    difficulty: str
    user_answers: Dict[int, int]
    questions: List[Dict[str, Any]]


class QuizGenerateSchema(BaseModel):
    subject: Optional[str] = "General"
    topic: Optional[str] = "Study Material"
    difficulty: Optional[str] = "Medium"
    num_questions: Optional[int] = 5
    paper_id: Optional[int] = None


async def _call_gemini(prompt: str, system: str) -> str:
    """Direct Gemini API call for quiz generation."""
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    if not gemini_key or gemini_key.startswith("your_"):
        return ""
    for model_id in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={gemini_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "systemInstruction": {"parts": [{"text": system}]}
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
            if res.status_code == 200:
                data = res.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            elif res.status_code == 429:
                import asyncio
                await asyncio.sleep(2.0)
            else:
                break
        except Exception as e:
            print(f"Gemini quiz generation error ({model_id}): {e}")
    return ""


async def generate_quiz_from_text(text: str, num_questions: int = 5, difficulty: str = "Medium") -> List[Dict[str, Any]]:
    """Generate quiz questions from actual document text using Gemini."""
    # Use first 8000 chars for quiz generation (enough context)
    source_text = text[:8000] if len(text) > 8000 else text

    system = (
        "You are an expert educational assessment designer. "
        "Generate quiz questions STRICTLY from the provided study material text. "
        "Every question must be directly answerable from the given text. "
        "Do NOT generate generic questions. "
        "Return ONLY a valid JSON array, no markdown, no explanation."
    )

    prompt = f"""Generate exactly {num_questions} quiz questions at {difficulty} difficulty from the text below.

IMPORTANT: Every question must reference specific concepts, terms, definitions, algorithms, or facts from THIS text.

Return a JSON array with this structure:
[
  {{
    "q": "Question text referencing specific content from the document",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Explanation citing the specific part of the document that contains the answer",
    "type": "MCQ"
  }}
]

Mix question types:
- Multiple choice (4 options)  
- True/False (2 options: "True", "False")
- Concept application

STUDY MATERIAL TEXT:
{source_text}

Return ONLY the JSON array, starting with [ and ending with ]."""

    raw = await _call_gemini(prompt, system)
    if not raw:
        return []

    # Parse JSON robustly
    raw = raw.strip()
    start = raw.find('[')
    end = raw.rfind(']')
    if start == -1 or end == -1:
        return []
    try:
        items = json.loads(raw[start:end+1])
        return items if isinstance(items, list) else []
    except Exception as e:
        print(f"Quiz JSON parse error: {e}")
        return []


@router.get("/generate")
@router.post("/generate")
async def generate_adaptive_quiz(
    payload: Optional[QuizGenerateSchema] = None,
    subject: str = Query("General"),
    topic: str = Query("Study Material"),
    difficulty: Optional[str] = None,
    paper_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate quiz questions from the uploaded document."""
    diff = (payload.difficulty if payload else None) or difficulty or "Medium"
    num_q = (payload.num_questions if payload else None) or 5
    p_id = (payload.paper_id if payload else None) or paper_id

    # Get paper context
    paper = None
    if p_id:
        paper = await paper_crud.get_paper(db, p_id)
        if paper and paper.user_id != current_user.id:
            paper = None

    # If we have a paper with raw text, generate document-grounded questions
    if paper and paper.raw_text and len(paper.raw_text) > 100:
        questions = await generate_quiz_from_text(paper.raw_text, num_q, diff)
        if questions:
            return {
                "status": "success",
                "subject": paper.title,
                "topic": paper.title,
                "difficulty_level": diff,
                "source": "document",
                "questions": questions
            }

    # If no paper or generation failed, return informative message
    if not paper:
        return {
            "status": "no_document",
            "message": "Please upload and select a document first to generate document-specific quiz questions.",
            "questions": []
        }

    # Paper exists but text extraction failed
    return {
        "status": "processing",
        "message": f"Document '{paper.title}' is still being processed. Please wait a moment and try again.",
        "questions": []
    }


@router.post("/submit")
async def submit_quiz(
    payload: QuizSubmitSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total = len(payload.questions)
    correct = 0
    wrong_topics = []

    for idx, q in enumerate(payload.questions):
        user_ans = payload.user_answers.get(idx)
        correct_ans = q.get("correct_option") or q.get("correct")
        if user_ans == correct_ans:
            correct += 1
        else:
            wrong_topics.append(q.get("question", f"Question {idx+1}")[:60])

    score_pct = (correct / total * 100.0) if total > 0 else 0.0

    confusion_log = None
    if score_pct < 75.0 and wrong_topics:
        try:
            confusion_log = await ConfusionDetectorService.analyze_and_log_confusion(
                db, current_user.id, payload.topic, wrong_topics, source="Adaptive Quiz"
            )
        except Exception:
            pass

    quiz = AdaptiveQuiz(
        user_id=current_user.id,
        subject=payload.subject,
        topic=payload.topic,
        difficulty_level=payload.difficulty,
        score_percentage=score_pct,
        total_questions=total,
        correct_count=correct,
        questions_data=payload.questions,
        misconception_analysis=confusion_log.recommended_revision if confusion_log else (
            f"Outstanding! {round(score_pct)}% score demonstrated on '{payload.topic}'."
            if score_pct >= 80
            else f"Review these weak areas: {', '.join(wrong_topics[:3])}"
        )
    )
    db.add(quiz)

    try:
        await LearningDNAService.record_interaction_analytics(
            db, current_user.id, payload.topic, score_pct, interaction_type="Quiz"
        )
    except Exception:
        pass

    await db.commit()
    await db.refresh(quiz)

    return {
        "status": "success",
        "score_percentage": round(score_pct, 1),
        "correct_count": correct,
        "total_questions": total,
        "misconception_analysis": quiz.misconception_analysis,
        "recommended_next_action": "Proceed to next difficulty tier" if score_pct >= 80.0 else "Review the document sections related to incorrect answers"
    }
