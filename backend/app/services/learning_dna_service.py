"""
EchoScholar X - Learning DNA & Cognitive Twin Engine
"""
from typing import Dict, Any, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.learning_dna import LearningDNA, StudentMemory


class LearningDNAService:
    """Service for managing and continuously updating the Cognitive Twin profile of a student."""

    @staticmethod
    async def get_or_create_dna(db: AsyncSession, user_id: int) -> LearningDNA:
        result = await db.execute(select(LearningDNA).where(LearningDNA.user_id == user_id))
        dna = result.scalars().first()
        if not dna:
            dna = LearningDNA(
                user_id=user_id,
                semester="Current Semester",
                branch="Computer Science & AI",
                preferred_language="English",
                explanation_style="Analogy-Based",
                learning_speed=55.0,
                confidence_score=65.0,
                attention_span_mins=25,
                revision_frequency_days=3,
                memory_decay_rate=0.15,
                curiosity_score=75.0,
                preferred_quiz_difficulty="Medium",
                strong_subjects=["Data Structures", "Python"],
                weak_subjects=["Dynamic Programming"],
                common_misconceptions=["Recursion stack overflow", "Pointers dereferencing"]
            )
            db.add(dna)
            await db.commit()
            await db.refresh(dna)
        return dna

    @staticmethod
    async def update_dna(
        db: AsyncSession,
        user_id: int,
        updates: Dict[str, Any]
    ) -> LearningDNA:
        dna = await LearningDNAService.get_or_create_dna(db, user_id)
        for field, value in updates.items():
            if hasattr(dna, field) and value is not None:
                setattr(dna, field, value)
        await db.commit()
        await db.refresh(dna)
        return dna

    @staticmethod
    async def record_interaction_analytics(
        db: AsyncSession,
        user_id: int,
        topic: str,
        score: float, # 0.0 to 100.0
        interaction_type: str = "Quiz"
    ) -> LearningDNA:
        dna = await LearningDNAService.get_or_create_dna(db, user_id)
        
        # Adaptive confidence update
        new_conf = (dna.confidence_score * 0.8) + (score * 0.2)
        dna.confidence_score = round(min(100.0, max(0.0, new_conf)), 1)
        
        # Topic classification
        strong = list(dna.strong_subjects or [])
        weak = list(dna.weak_subjects or [])

        if score >= 75.0:
            if topic not in strong:
                strong.append(topic)
            if topic in weak:
                weak.remove(topic)
        elif score < 50.0:
            if topic not in weak:
                weak.append(topic)
            if topic in strong:
                strong.remove(topic)

        dna.strong_subjects = strong
        dna.weak_subjects = weak

        await db.commit()
        await db.refresh(dna)
        return dna

    @staticmethod
    async def get_cognitive_twin_prompt(db: AsyncSession, user_id: int) -> str:
        dna = await LearningDNAService.get_or_create_dna(db, user_id)
        return f"""
[COGNITIVE TWIN LEARNING DNA]
- Branch/Semester: {dna.branch} ({dna.semester})
- Preferred Language: {dna.preferred_language}
- Explanation Style: {dna.explanation_style} (Use analogies, step-by-step logic, and intuitive real-world examples)
- Learning Speed: {dna.learning_speed}/100 | Confidence Score: {dna.confidence_score}%
- Attention Span: {dna.attention_span_mins} mins | Preferred Quiz Tier: {dna.preferred_quiz_difficulty}
- Strong Subjects: {', '.join(dna.strong_subjects or ['General CS'])}
- Weak Subjects: {', '.join(dna.weak_subjects or ['Advanced Concepts'])}
- Common Misconceptions to Watch For: {', '.join(dna.common_misconceptions or ['None logged yet'])}
- Placement Goals: {dna.placement_goals or 'Top Tier Tech Role'}
"""
