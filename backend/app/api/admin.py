from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.analysis import Analysis

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_resumes = db.query(Resume).count()
    total_analyses = db.query(Analysis).count()
    
    return {
        "total_users": total_users,
        "total_resumes": total_resumes,
        "total_analyses": total_analyses
    }
