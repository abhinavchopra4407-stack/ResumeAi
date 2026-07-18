from typing import Any, List, Optional
from pydantic import BaseModel
from datetime import datetime

class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    user_id: Optional[int] = None
    job_description: Optional[str] = None
    ats_score: int
    ats_breakdown: Optional[Any] = None
    strengths: Optional[Any] = None
    weaknesses: Optional[Any] = None
    missing_skills: Optional[Any] = None
    grammar_issues: Optional[Any] = None
    formatting_issues: Optional[Any] = None
    professional_summary: Optional[str] = None
    recruiter_suggestions: Optional[str] = None
    overall_review: Optional[str] = None
    feedback: Optional[Any] = None # JSON structure
    job_matching: Optional[Any] = None # JSON structure
    created_at: datetime

    class Config:
        from_attributes = True

class ResumeBase(BaseModel):
    filename: str

class ResumeCreate(ResumeBase):
    file_content_text: str

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ResumeDetailsResponse(ResumeResponse):
    file_content_text: Optional[str] = None
    analyses: List[AnalysisResponse] = []

    class Config:
        from_attributes = True

class AnalysisCreateRequest(BaseModel):
    job_description: str
