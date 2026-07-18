from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, ensure_schema
from app.api import api_router

# Auto-create SQLite database tables on startup
ensure_schema()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ResumeIQ AI - Backend API for Resume ATS Scoring and Analysis",
    version="1.0.0"
)

# CORS configurations
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "docs": "/docs"
    }
