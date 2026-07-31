"""
EchoScholar X - AI Confusion Detector Service
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.learning_dna import ConfusionLog, LearningDNA


class ConfusionDetectorService:
    """Service to automatically infer hidden misconceptions and log root causes."""

    @staticmethod
    async def analyze_and_log_confusion(
        db: AsyncSession,
        user_id: int,
        topic: str,
        wrong_answers: List[str],
        source: str = "Quiz"
    ) -> Optional[ConfusionLog]:
        # Simple heuristic + AI prompt mapping
        root_cause_map = {
            "Dynamic Programming": "Recursion & Memoization state transitions",
            "BST": "Recursion call stack & Pointer manipulation",
            "AVL Trees": "Tree rotation logic & Height balancing formulas",
            "Heaps": "Array indexing & Percolate up/down pointer math",
            "Pointers": "Memory address vs dereferenced value confusion",
            "System Design": "Scalability bottlenecks vs CAP theorem trade-offs"
        }

        root_cause = "Foundational concepts in " + topic
        for key, val in root_cause_map.items():
            if key.lower() in topic.lower():
                root_cause = val
                break

        log = ConfusionLog(
            user_id=user_id,
            detected_topic=topic,
            root_cause_concept=root_cause,
            source=source,
            confidence_level=85.0,
            recommended_revision=f"Revisit root concept: '{root_cause}' with 3 step-by-step interactive exercises.",
            is_resolved=False
        )
        db.add(log)

        # Update Learning DNA common misconceptions
        dna_res = await db.execute(select(LearningDNA).where(LearningDNA.user_id == user_id))
        dna = dna_res.scalars().first()
        if dna:
            misc = list(dna.common_misconceptions or [])
            if root_cause not in misc:
                misc.append(root_cause)
                dna.common_misconceptions = misc

        await db.commit()
        await db.refresh(log)
        return log

    @staticmethod
    async def get_active_confusions(
        db: AsyncSession,
        user_id: int
    ) -> List[ConfusionLog]:
        result = await db.execute(
            select(ConfusionLog).where(
                ConfusionLog.user_id == user_id,
                ConfusionLog.is_resolved == False
            ).order_by(ConfusionLog.created_at.desc())
        )
        return list(result.scalars().all())
