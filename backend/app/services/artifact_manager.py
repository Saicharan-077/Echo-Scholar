import asyncio
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.artifact import Artifact
from app.services.openai_service import openai_service

class AIArtifactManager:
    """Manages AI artifact generation, caching, and state tracking."""
    
    @classmethod
    async def get_or_generate_artifact(
        cls, 
        db: AsyncSession, 
        paper_id: int, 
        artifact_type: str, 
        raw_text: str,
        force_regenerate: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Retrieves an artifact from DB if Ready. 
        If missing or failed (or force_regenerate), sets to Generating and triggers generation.
        """
        # 1. Check existing artifact
        res = await db.execute(select(Artifact).where(Artifact.paper_id == paper_id, Artifact.artifact_type == artifact_type))
        artifact = res.scalars().first()
        
        if artifact and not force_regenerate:
            if artifact.status == "ready":
                return {"status": "ready", "content": artifact.content}
            if artifact.status in ["generating", "pending", "regenerating"]:
                return {"status": "generating", "message": "Artifact is currently being generated"}
                
        # 2. Need to generate
        if not artifact:
            artifact = Artifact(paper_id=paper_id, artifact_type=artifact_type, status="pending")
            db.add(artifact)
            
        artifact.status = "regenerating" if force_regenerate else "generating"
        artifact.error_message = None
        await db.commit()
        await db.refresh(artifact)
        
        # 3. Trigger background generation (fire and forget for this request context)
        # Ideally this should be pushed to a queue (Celery/RQ), but for now we use asyncio.create_task
        asyncio.create_task(cls._generate_artifact_task(db, artifact.id, artifact_type, raw_text, **kwargs))
        
        return {"status": artifact.status, "message": "Generation started"}
        
    @classmethod
    async def _generate_artifact_task(cls, db: AsyncSession, artifact_id: int, artifact_type: str, raw_text: str, **kwargs):
        """Background task to generate and save artifact."""
        from app.core.database import AsyncSessionLocal
        
        async with AsyncSessionLocal() as session:
            artifact = await session.get(Artifact, artifact_id)
            if not artifact:
                return
                
            try:
                print(f"ArtifactManager: Starting generation of {artifact_type} for artifact {artifact_id}")
                content = None
                
                if artifact_type == "summary":
                    content = await openai_service.generate_summary(raw_text)
                elif artifact_type == "quiz":
                    content = await openai_service.generate_quiz(raw_text)
                elif artifact_type == "graph":
                    content = await openai_service.generate_flowchart(raw_text)
                elif artifact_type == "flashcards":
                    content = await openai_service.generate_flashcards(raw_text)
                elif artifact_type == "notes":
                    title = kwargs.get("title", "Document")
                    content = await openai_service.generate_study_notes(raw_text, title)
                elif artifact_type == "podcast":
                    # Assumes summary and key_findings are passed in kwargs or fetched
                    title = kwargs.get("title", "Document")
                    summary = kwargs.get("summary", "")
                    findings = kwargs.get("key_findings", [])
                    style = kwargs.get("style", "educational")
                    voice_male = kwargs.get("voice_male_name", "Prabhat")
                    voice_female = kwargs.get("voice_female_name", "Neerja")
                    content = await openai_service.generate_podcast_script(
                        paper_title=title, 
                        summary=summary, 
                        key_findings=findings, 
                        style=style,
                        voice_male_name=voice_male,
                        voice_female_name=voice_female,
                        document_text=raw_text
                    )
                elif artifact_type == "entities":
                    content = await openai_service.extract_entities(raw_text)
                elif artifact_type == "relationships":
                    entities = kwargs.get("entities", [])
                    content = await openai_service.extract_relationships(raw_text, entities)
                else:
                    raise ValueError(f"Unknown artifact type: {artifact_type}")
                    
                artifact.content = content
                artifact.status = "ready"
                await session.commit()
                print(f"ArtifactManager: Successfully generated {artifact_type}")
                
            except Exception as e:
                print(f"ArtifactManager Error ({artifact_type}): {e}")
                artifact.status = "failed"
                artifact.error_message = str(e)
                await session.commit()

artifact_manager = AIArtifactManager()
