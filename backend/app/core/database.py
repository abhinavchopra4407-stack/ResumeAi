from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# For SQLite, we need connect_args={"check_same_thread": False}
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def ensure_schema():
    Base.metadata.create_all(bind=engine)

    if not settings.DATABASE_URL.startswith("sqlite"):
        return

    inspector = inspect(engine)
    if "analyses" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("analyses")}
    with engine.begin() as conn:
        if "user_id" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN user_id INTEGER"))
        if "ats_breakdown" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN ats_breakdown JSON"))
        if "strengths" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN strengths JSON"))
        if "weaknesses" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN weaknesses JSON"))
        if "missing_skills" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN missing_skills JSON"))
        if "grammar_issues" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN grammar_issues JSON"))
        if "formatting_issues" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN formatting_issues JSON"))
        if "professional_summary" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN professional_summary TEXT"))
        if "recruiter_suggestions" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN recruiter_suggestions TEXT"))
        if "overall_review" not in columns:
            conn.execute(text("ALTER TABLE analyses ADD COLUMN overall_review TEXT"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
