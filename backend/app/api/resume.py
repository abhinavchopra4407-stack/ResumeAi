from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.services.resume_parser import ResumeParser
from app.services.ai_service import AIService
from app.services.ats_scorer import ATSScorer
from app.services.job_matcher import JobMatcher
from app.schemas.resume import ResumeCreate, ResumeResponse, AnalysisResponse, ResumeDetailsResponse
import shutil
from datetime import datetime
import os
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resumes", tags=["resumes"])
resume_parser = ResumeParser()
ai_service = AIService()
ats_scorer = ATSScorer()
job_matcher = JobMatcher()

@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_bytes = await file.read()
    file_name = file.filename
    file_path = os.path.join("/tmp", f"{current_user.id}_{datetime.utcnow().timestamp()}_{file_name}")
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    parsed_data = await resume_parser.parse(file_bytes, file_name)
    resume = Resume(
        user_id=current_user.id,
        filename=file_name,
        file_content_text=parsed_data.get("full_text", "")
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume

@router.get("", response_model=List[ResumeDetailsResponse])
def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).all()

@router.get("/{resume_id}", response_model=ResumeDetailsResponse)
def get_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.post("/{resume_id}/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze a resume with full ATS scoring"""
    try:
        # Get the resume
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        ).first()
        
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found"
            )
        
        logger.info(f"Analyzing resume {resume_id} for user {current_user.email}")
        
        # Parse the resume using stored extracted text
        parsed_data = None
        if resume.file_content_text:
            parsed_data = resume_parser.parse_text(resume.file_content_text)

        if not parsed_data or not parsed_data.get('full_text'):
            logger.info("No usable extracted text found; returning empty analysis")
            parsed_data = resume_parser.parse_text("")
        
        # Calculate ATS score
        try:
            ats_data = ats_scorer.calculate_score(parsed_data)
            ats_score = int(round(ats_data.get("total_score", 0)))
            logger.info(f"ATS Score calculated: {ats_score}")
        except Exception as e:
            logger.error(f"ATS scoring failed: {str(e)}")
            ats_data = {
                "total_score": 0,
                "breakdown": {},
                "recommendations": ["ATS scoring failed. Please try again."]
            }
        
        # Generate AI analysis
        try:
            analysis_data = await ai_service.generate_resume_analysis(parsed_data)
            logger.info("AI analysis generated successfully")
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}")
            analysis_data = {
                "strengths": ["Analysis temporarily unavailable"],
                "weaknesses": ["Please try again later"],
                "missing_skills": [],
                "grammar_issues": [],
                "formatting_issues": [],
                "professional_summary": "Analysis in progress...",
                "recruiter_suggestions": "",
                "overall_review": "Your resume analysis is being processed."
            }
        
        # Check for existing analysis
        existing_analysis = db.query(Analysis).filter(
            Analysis.resume_id == resume.id
        ).first()
        
        if existing_analysis:
            # Update existing analysis
            existing_analysis.ats_score = ats_score
            existing_analysis.ats_breakdown = ats_data.get("breakdown", {})
            existing_analysis.strengths = analysis_data.get("strengths", [])
            existing_analysis.weaknesses = analysis_data.get("weaknesses", [])
            existing_analysis.missing_skills = analysis_data.get("missing_skills", [])
            existing_analysis.grammar_issues = analysis_data.get("grammar_issues", [])
            existing_analysis.formatting_issues = analysis_data.get("formatting_issues", [])
            existing_analysis.professional_summary = analysis_data.get("professional_summary", "")
            existing_analysis.recruiter_suggestions = analysis_data.get("recruiter_suggestions", "")
            existing_analysis.overall_review = analysis_data.get("overall_review", "")
            
            db.commit()
            db.refresh(existing_analysis)
            logger.info(f"Updated existing analysis for resume {resume_id}")
            return existing_analysis
        
        # Create new analysis
        analysis = Analysis(
            resume_id=resume.id,
            user_id=current_user.id,
            ats_score=ats_score,
            ats_breakdown=ats_data.get("breakdown", {}),
            strengths=analysis_data.get("strengths", []),
            weaknesses=analysis_data.get("weaknesses", []),
            missing_skills=analysis_data.get("missing_skills", []),
            grammar_issues=analysis_data.get("grammar_issues", []),
            formatting_issues=analysis_data.get("formatting_issues", []),
            professional_summary=analysis_data.get("professional_summary", ""),
            recruiter_suggestions=analysis_data.get("recruiter_suggestions", ""),
            overall_review=analysis_data.get("overall_review", "")
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        logger.info(f"Created new analysis for resume {resume_id}")
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in analyze_resume: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.delete("/{resume_id}")
def delete_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted"}

@router.get("/analysis/{resume_id}")
async def get_analysis(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analysis for a specific resume"""
    analysis = db.query(Analysis).filter(
        Analysis.resume_id == resume_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return {
        "id": analysis.id,
        "resume_id": analysis.resume_id,
        "ats_score": analysis.ats_score or 0,
        "ats_breakdown": analysis.ats_breakdown or {},
        "strengths": analysis.strengths or [],
        "weaknesses": analysis.weaknesses or [],
        "missing_skills": analysis.missing_skills or [],
        "grammar_issues": analysis.grammar_issues or [],
        "formatting_issues": analysis.formatting_issues or [],
        "professional_summary": analysis.professional_summary or "Analysis in progress...",
        "recruiter_suggestions": analysis.recruiter_suggestions or "",
        "overall_review": analysis.overall_review or "",
        "created_at": analysis.created_at
    }