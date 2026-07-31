"""
EchoXScholar Multi-Agent Academic Learning System
"""
from typing import Dict, Any, Optional
from app.services.openai_service import OpenAIService
from app.services.learning_dna_service import LearningDNAService


class CoordinatorAgent:
    """
    Coordinator Agent: Routes incoming study queries automatically to specialized academic learning agents.
    """

    @staticmethod
    async def route_and_execute(
        prompt: str,
        user_id: int,
        db_session,
        preferred_agent: Optional[str] = None
    ) -> Dict[str, Any]:
        # 1. Fetch Cognitive Twin context
        dna_context = await LearningDNAService.get_cognitive_twin_prompt(db_session, user_id)
        
        # 2. Determine target agent
        target = preferred_agent
        if not target or target == "auto":
            p_lower = prompt.lower()
            if any(w in p_lower for w in ["quiz", "test", "question", "mcq"]):
                target = "quiz"
            elif any(w in p_lower for w in ["schedule", "plan", "roadmap", "calendar", "study plan"]):
                target = "planner"
            elif any(w in p_lower for w in ["summarize", "notes", "bullet", "takeaways"]):
                target = "notes"
            elif any(w in p_lower for w in ["flashcard", "card", "memorize"]):
                target = "flashcard"
            elif any(w in p_lower for w in ["confused", "stuck", "revise", "misconception", "why"]):
                target = "revision"
            elif any(w in p_lower for w in ["depressed", "tired", "unmotivated", "hard", "encourage"]):
                target = "motivator"
            else:
                target = "teacher"

        # 3. Build Agent System Prompts
        system_prompts = {
            "teacher": f"{dna_context}\n\nYou are Professor Vox, an empathetic AI Personal Professor. Explain concepts clearly using analogies, step-by-step breakdown, and end with a quick check for understanding question.",
            "quiz": f"{dna_context}\n\nYou are the Adaptive Quiz Agent. Generate challenging multi-format questions tailored to the student's mastery level.",
            "planner": f"{dna_context}\n\nYou are the Learning Path Planner. Generate structured daily and weekly study roadmaps taking into account memory decay and exam dates.",
            "notes": f"{dna_context}\n\nYou are the Notes Agent. Produce crisp, structured markdown notes with clear headers, key takeaways, and bullet points.",
            "flashcard": f"{dna_context}\n\nYou are the Flashcard Agent. Create Q&A active recall cards optimized for spaced repetition.",
            "revision": f"{dna_context}\n\nYou are the Revision Agent. Focus on diagnosing root misconceptions, explaining foundational prerequisites first, and guiding the student step-by-step.",
            "motivator": f"{dna_context}\n\nYou are the Learning Motivator. Provide energizing, uplifting, and actionable advice to boost the student's streak and confidence."
        }

        agent_prompt = system_prompts.get(target, system_prompts["teacher"])
        
        # 4. Generate response using OpenAI/LLM service
        ai_response = await OpenAIService.generate_response(
            messages=[
                {"role": "system", "content": agent_prompt},
                {"role": "user", "content": prompt}
            ]
        )

        return {
            "agent_used": target,
            "response": ai_response,
            "cognitive_twin_applied": True
        }
