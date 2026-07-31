from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base, TimestampMixin

class Artifact(Base, TimestampMixin):
    """AI Artifact model - stores generated content for a paper."""
    __tablename__ = "artifacts"
    
    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Artifact metadata
    artifact_type = Column(String(50), nullable=False, index=True)  # summary, quiz, graph, podcast, notes, flashcards
    status = Column(String(50), default="pending")  # pending, generating, ready, failed, regenerating
    
    # Content payload
    content = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relationships
    paper = relationship("Paper", backref="artifacts")

    def __repr__(self):
        return f"<Artifact(id={self.id}, type={self.artifact_type}, status={self.status})>"
