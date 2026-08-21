# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/db/database.py | Last Modified: 2026-08-22
# ============================================================

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from apps.api.src.core.config import get_settings


settings = get_settings()

connect_args = {}
engine_kwargs = {"echo": settings.debug_mode}

if settings.database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    # PostgreSQL / Neon / Supabase / Vercel Postgres Pooling Settings
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    Database session dependency generator for FastAPI routes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initializes database tables idempotently.
    """
    Base.metadata.create_all(bind=engine)
