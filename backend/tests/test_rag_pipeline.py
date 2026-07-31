import pytest
from app.services.rag_service import RAGService

def test_rag_chunking():
    sample_text = "Section 1: Introduction.\n" + ("This is detailed text for chunking evaluation. " * 30) + "\nSection 2: Architecture.\n" + ("Deep learning models require self-attention. " * 30)
    
    chunks = RAGService.chunk_text(sample_text, chunk_size=500, overlap=50)
    
    assert isinstance(chunks, list)
    assert len(chunks) > 0
    assert "Section 1: Introduction" in chunks[0]["text"] or "chunking evaluation" in chunks[0]["text"]
