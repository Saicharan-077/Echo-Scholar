import os
import aiofiles
import asyncio
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.crud import paper as paper_crud
from app.schemas import (
    PaperResponse,
    PaperDetail,
    PaperCreate,
    PaperUpdate,
    PaperUploadResponse,
    PaperProcessingStatus,
    MessageResponse,
)
from app.models.user import User
from app.services.pdf_service import pdf_service
from app.services.openai_service import openai_service

router = APIRouter(prefix="/papers", tags=["Papers"])


@router.post("/extract-text")
async def extract_paper_text(
    file: UploadFile = File(...)
):
    """Extract clean human-readable text from uploaded PDF/DOCX/PPTX file using PyMuPDF."""
    allowed_exts = ('.pdf', '.docx', '.pptx', '.txt')
    if not file.filename.lower().endswith(allowed_exts):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Supported formats: PDF, DOCX, PPTX, TXT"
        )
    
    file_content = await file.read()
    temp_dir = Path("./uploads/temp")
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_path = temp_dir / f"temp_{file.filename}"
    
    with open(temp_path, "wb") as f:
        f.write(file_content)
        
    try:
        raw_text = await pdf_service.extract_text(str(temp_path))
    finally:
        if temp_path.exists():
            temp_path.unlink()
            
    # Clean text lines
    lines = [l.strip() for l in raw_text.split("\n") if l.strip() and not l.strip().isdigit()]
    text = "\n\n".join(lines)

    # Generate AI summary using AIModelRouter (Gemma / Ollama)
    ai_summary = await AIModelRouter.generate_response(
        prompt=f"Summarize the key sections, technical findings, and main points of this document ({file.filename}) in 3 clear paragraphs:\n\n{text[:2500]}",
        system_instruction="You are Professor Vox, an expert academic AI mentor analyzing uploaded research papers and resumes."
    )
    
    return {
        "filename": file.filename,
        "text": text,
        "paragraphs": lines,
        "ai_summary": ai_summary
    }


@router.post("/upload", response_model=PaperUploadResponse)
async def upload_paper(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload a research paper (PDF)."""
    # Validate file type
    allowed_exts = ('.pdf', '.docx', '.pptx', '.txt')
    if not file.filename.lower().endswith(allowed_exts):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Supported formats: PDF, DOCX, PPTX, TXT"
        )
    
    # Check file size
    file_content = await file.read()
    if len(file_content) > settings.max_upload_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds {settings.max_upload_size / 1024 / 1024}MB limit"
        )
    
    # Save file
    file_path = pdf_service.save_uploaded_file(file_content, file.filename, current_user.id)
    
    # Create paper record
    paper_data = PaperCreate(
        title=title,
        filename=file.filename,
        file_path=file_path,
        file_size=len(file_content),
        mime_type="application/pdf"
    )
    
    paper = await paper_crud.create_paper(db, current_user.id, paper_data)
    
    # Schedule background processing
    background_tasks.add_task(run_processing, paper.id, current_user.id, None)

    return PaperUploadResponse(
        paper_id=paper.id,
        title=paper.title,
        message="Paper uploaded successfully. Background processing started."
    )


@router.get("", response_model=List[PaperResponse])
async def list_papers(
    skip: int = 0,
    limit: int = 50,
    processed_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all papers for the current user."""
    papers = await paper_crud.list_user_papers(
        db, current_user.id, skip, limit, processed_only
    )
    return papers


@router.get("/{paper_id}", response_model=PaperDetail)
async def get_paper(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get paper details."""
    paper = await paper_crud.get_paper(db, paper_id)
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found"
        )
    
    if paper.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this paper"
        )
    
    return paper


@router.put("/{paper_id}", response_model=PaperResponse)
async def update_paper(
    paper_id: int,
    paper_data: PaperUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update paper details."""
    paper = await paper_crud.get_paper(db, paper_id)
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found"
        )
    
    if paper.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this paper"
        )
    
    paper = await paper_crud.update_paper(db, paper, paper_data)
    return paper


@router.delete("/{paper_id}", response_model=MessageResponse)
async def delete_paper(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a paper."""
    paper = await paper_crud.get_paper(db, paper_id)
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found"
        )
    
    if paper.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this paper"
        )
    
    # Delete file
    pdf_service.delete_file(paper.file_path)
    
    # Delete from database
    await paper_crud.delete_paper(db, paper_id)
    
    return MessageResponse(message="Paper deleted successfully")

async def run_processing(paper_id: int, user_id: int, db_session_factory):
    \"\"\"Background task for processing paper: Document Processing Pipeline.\"\"\"
    from app.core.database import AsyncSessionLocal
    from app.services.artifact_manager import artifact_manager
    async with AsyncSessionLocal() as db:
        paper = await paper_crud.get_paper(db, paper_id)
        if not paper:
            return

        try:
            print(f"DEBUG: [Pipeline] Starting processing for paper {paper_id}")
            
            # 1. Text Extraction
            print(f"DEBUG: [Pipeline] Extracting text")
            raw_text = await pdf_service.extract_text(paper.file_path)
            
            # 2. Cleaning
            # Remove very short lines, page numbers, weird artifacts
            lines = [l.strip() for l in raw_text.split("\n") if len(l.strip()) > 3 or l.strip().isalnum()]
            clean_text = "\n".join(lines)
            paper.raw_text = clean_text
            await db.commit()
            
            # 3. AI Analysis & Metadata (Summary, Topics)
            print("DEBUG: [Pipeline] Generating AI Metadata (Summary/Topics)...")
            summary, topics = await asyncio.gather(
                openai_service.generate_summary(clean_text),
                openai_service.extract_topics(clean_text)
            )
            
            paper.summary = summary
            paper.topics = topics
            
            # 4. Entity Extraction & Relationship Extraction (For Knowledge Graph)
            print("DEBUG: [Pipeline] Extracting Entities and Relationships...")
            entities = await openai_service.extract_entities(clean_text)
            relationships = await openai_service.extract_relationships(clean_text, entities)
            
            # Store in Artifact Manager immediately
            from app.models.artifact import Artifact
            db.add(Artifact(paper_id=paper_id, artifact_type="entities", status="ready", content=entities))
            db.add(Artifact(paper_id=paper_id, artifact_type="relationships", status="ready", content=relationships))
            await db.commit()
            
            # Trigger other core artifacts to generate in background so they are ready
            await artifact_manager.get_or_generate_artifact(db, paper_id, "quiz", clean_text)
            await artifact_manager.get_or_generate_artifact(db, paper_id, "flashcards", clean_text)
            await artifact_manager.get_or_generate_artifact(db, paper_id, "graph", clean_text)
            await artifact_manager.get_or_generate_artifact(db, paper_id, "podcast", clean_text, title=paper.title, summary=summary)
            
            # 5. Chunking, Embedding, Vector Storage (RAG Indexing)
            print("DEBUG: [Pipeline] Starting semantic chunking & vector indexing...")
            from app.services.rag_service import RAGService
            rag_res = await RAGService.process_and_index_document(db, paper.id)
            print(f"DEBUG: [Pipeline] RAG indexing result: {rag_res}")

            # 6. Document Intelligence Layer Ready
            paper.is_processed = True
            paper.processing_status = "completed"
            
            await db.commit()
            print(f"DEBUG: [Pipeline] Processing complete for paper {paper_id}")
            
        except Exception as e:
            print(f"DEBUG: [Pipeline] Error processing paper {paper_id}: {str(e)}")
            import traceback
            traceback.print_exc()
            paper.processing_status = "failed"
            paper.processing_error = str(e)
            await db.commit()

@router.post("/{paper_id}/process", response_model=PaperProcessingStatus)
async def process_paper(
    paper_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start paper processing in the background."""
    paper = await paper_crud.get_paper(db, paper_id)
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found"
        )
    
    if paper.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to process this paper"
        )
    
    if paper.processing_status == "processing":
        return PaperProcessingStatus(
            paper_id=paper.id,
            status="processing",
            progress=50,
            message="Already processing"
        )

    # Reset/Set status to processing
    paper.processing_status = "processing"
    paper.processing_error = None
    await db.commit()

    # Add background task
    background_tasks.add_task(run_processing, paper_id, current_user.id, None)
    
    return PaperProcessingStatus(
        paper_id=paper.id,
        status="processing",
        progress=10,
        message="Processing started in background"
    )


@router.get("/{paper_id}/status", response_model=PaperProcessingStatus)
async def get_processing_status(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get paper processing status."""
    paper = await paper_crud.get_paper(db, paper_id)
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found"
        )
    
    if paper.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this paper"
        )
    
    progress = 0
    if paper.processing_status == "completed":
        progress = 100
    elif paper.processing_status == "processing":
        progress = 50
    
    return PaperProcessingStatus(
        paper_id=paper.id,
        status=paper.processing_status,
        progress=progress,
        message=paper.processing_error
    )


@router.get("/{paper_id}/related", response_model=List[PaperResponse])
async def get_related_papers(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get related papers."""
    paper = await paper_crud.get_paper(db, paper_id)
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found"
        )
    
    if paper.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this paper"
        )
    
    related = await paper_crud.get_related_papers(db, current_user.id, paper_id)
    return related


@router.post("/{paper_id}/progress", response_model=PaperResponse)
async def update_reading_progress(
    paper_id: int,
    progress: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update reading progress."""
    paper = await paper_crud.get_paper(db, paper_id)
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paper not found"
        )
    
    if paper.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this paper"
        )
    
    paper = await paper_crud.update_reading_progress(db, paper_id, progress)
    return paper


@router.get("/{paper_id}/flowchart")
async def get_paper_flowchart(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate a React Flow / Mermaid compatible flowchart JSON from paper."""
    paper = await paper_crud.get_paper(db, paper_id)
    if not paper or paper.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Paper not found")
        
    if not paper.is_processed:
        raise HTTPException(status_code=400, detail="Paper not processed")
        
    flowchart_nodes = await openai_service.generate_flowchart(paper.raw_text or paper.summary or "")
    return {"nodes": flowchart_nodes, "paper_title": paper.title}


@router.get("/{paper_id}/flashcards")
async def get_paper_flashcards(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate flashcards directly from paper text."""
    paper = await paper_crud.get_paper(db, paper_id)
    if not paper or paper.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Paper not found")
    if not paper.is_processed:
        raise HTTPException(status_code=400, detail="Paper not processed")
    items = await openai_service.generate_flashcards(paper.raw_text or paper.summary or "")
    return {"flashcards": items}


@router.get("/{paper_id}/quiz")
async def get_paper_quiz(
    paper_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate quiz questions directly from paper text."""
    paper = await paper_crud.get_paper(db, paper_id)
    if not paper or paper.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Paper not found")
    if not paper.is_processed:
        raise HTTPException(status_code=400, detail="Paper not processed")
    items = await openai_service.generate_quiz(paper.raw_text or paper.summary or "")
    return {"questions": items}

