from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_description = Column(Text, nullable=True)
    ats_score = Column(Integer, default=0)
    
    # Store feedback, keyword_gaps, and general recommendations as JSON
    # SQLite supports JSON columns automatically in SQLAlchemy
    feedback = Column(JSON, nullable=True)
    job_matching = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    resume = relationship("Resume", back_populates="analyses")
