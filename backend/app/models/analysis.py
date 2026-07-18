from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_description = Column(Text, nullable=True)
    ats_score = Column(Integer, default=0)
    ats_breakdown = Column(JSON, nullable=True)
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    grammar_issues = Column(JSON, nullable=True)
    formatting_issues = Column(JSON, nullable=True)
    professional_summary = Column(Text, nullable=True)
    recruiter_suggestions = Column(Text, nullable=True)
    overall_review = Column(Text, nullable=True)

    # Store feedback, keyword_gaps, and general recommendations as JSON
    # SQLite supports JSON columns automatically in SQLAlchemy
    feedback = Column(JSON, nullable=True)
    job_matching = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    resume = relationship("Resume", back_populates="analyses")
