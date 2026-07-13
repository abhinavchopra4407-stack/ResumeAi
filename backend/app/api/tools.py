from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.core.depedencies import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.services.ai_service import AIService
from app.services.resume_parser import ResumeParser

router = APIRouter(prefix="/tools", tags=["tools"])

class CoverLetterRequest(BaseModel):
    resume_id: int
    job_description: str

class InterviewPrepRequest(BaseModel):
    resume_id: int
    job_description: str

class RoadmapRequest(BaseModel):
    resume_id: int
    target_role: str

class RewriteRequest(BaseModel):
    resume_id: int
    section_text: str
    tone: str # "Professional", "Impactful", "Technical"

@router.post("/cover-letter")
def generate_cover_letter(
    payload: CoverLetterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    parsed_data = ResumeParser.parse_text(resume.file_content_text)
    cover_letter = AIService.generate_cover_letter(resume.file_content_text, parsed_data, payload.job_description)
    return {"cover_letter": cover_letter}

@router.post("/interview-prep")
def generate_interview_prep(
    payload: InterviewPrepRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    parsed_data = ResumeParser.parse_text(resume.file_content_text)
    qa = AIService.generate_interview_prep(resume.file_content_text, parsed_data, payload.job_description)
    return {"questions": qa}

@router.post("/roadmap")
def generate_roadmap(
    payload: RoadmapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    parsed_data = ResumeParser.parse_text(resume.file_content_text)
    roadmap = AIService.generate_roadmap(resume.file_content_text, parsed_data, payload.target_role)
    return roadmap

@router.post("/rewrite")
def rewrite_resume(
    payload: RewriteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    parsed_data = ResumeParser.parse_text(resume.file_content_text)
    rewritten_text = AIService.rewrite_resume_section(resume.file_content_text, parsed_data, payload.section_text, payload.tone)
    return {"rewritten_text": rewritten_text}
