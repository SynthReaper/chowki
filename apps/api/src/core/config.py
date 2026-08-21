# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/core/config.py | Last Modified: 2026-08-22
# ============================================================

import os
import sys
from functools import lru_cache
from pydantic import BaseModel, Field


def resolve_database_url() -> str:
    """
    Dynamically resolves the database connection string.
    Supports Neon, Supabase, Vercel Postgres, SQLite, and serverless /tmp fallbacks.
    """
    raw_url = (
        os.getenv("DATABASE_URL")
        or os.getenv("POSTGRES_URL")
        or os.getenv("CHOWKI_DATABASE_URL")
        or ""
    )
    
    if raw_url:
        # SQLAlchemy 1.4+ / 2.0 requires postgresql:// instead of postgres://
        if raw_url.startswith("postgres://"):
            return raw_url.replace("postgres://", "postgresql://", 1)
        return raw_url
    
    # Check if running in a Serverless environment (e.g., Vercel, AWS Lambda) where only /tmp is writable
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
        return "sqlite:////tmp/chowki_surveillance.db"
    
    return "sqlite:///./chowki_surveillance.db"


class Settings(BaseModel):
    """
    Project CHOWKI Core System Settings.
    All parameters are dynamically loaded from environment variables with safe defaults.
    """
    # Environment & Identity
    app_name: str = Field(default="Project CHOWKI API")
    app_version: str = Field(default="1.0.0")
    environment: str = Field(default=os.getenv("CHOWKI_ENV", "production" if os.getenv("VERCEL") else "development"))
    debug_mode: bool = Field(default=os.getenv("CHOWKI_DEBUG", "false").lower() == "true")
    api_prefix: str = Field(default="/api/v1")
    
    # Server Host & Port
    host: str = Field(default=os.getenv("CHOWKI_HOST", "0.0.0.0"))
    port: int = Field(default=int(os.getenv("CHOWKI_PORT", "8000")))
    cors_origins: list[str] = Field(
        default=[
            origin.strip() 
            for origin in os.getenv("CHOWKI_CORS_ORIGINS", "*").split(",")
        ]
    )

    # Database
    database_url: str = Field(default_factory=resolve_database_url)

    # Security & Cryptography
    jwt_secret: str = Field(default=os.getenv("CHOWKI_JWT_SECRET", "chowki-surveillance-secret-key-32-bytes-min!"))
    jwt_algorithm: str = Field(default=os.getenv("CHOWKI_JWT_ALGORITHM", "HS256"))
    access_token_expire_minutes: int = Field(default=int(os.getenv("CHOWKI_TOKEN_EXPIRE_MINUTES", "15")))
    salt_rotation_seed: str = Field(default=os.getenv("CHOWKI_SALT_SEED", "chowki-weekly-rotating-salt-2026"))

    # Epidemiological STPSS Engine Settings
    stpss_monte_carlo_runs: int = Field(default=int(os.getenv("CHOWKI_STPSS_MC_RUNS", "999")))
    stpss_p_significance_threshold: float = Field(default=float(os.getenv("CHOWKI_STPSS_P_THRESH", "0.05")))
    stpss_temporal_bin_hours: int = Field(default=int(os.getenv("CHOWKI_STPSS_BIN_HOURS", "4")))
    
    # DPDP Act 2023 Compliance
    k_anonymity_floor: int = Field(default=int(os.getenv("CHOWKI_K_ANONYMITY", "5")))
    retention_days_raw_checkin: int = Field(default=int(os.getenv("CHOWKI_RETENTION_DAYS", "30")))
    consent_withdrawal_purge_hours: int = Field(default=int(os.getenv("CHOWKI_PURGE_HOURS", "72")))

    # IoT & Environmental Thresholds
    chlorine_lower_threshold_mg_l: float = Field(default=float(os.getenv("CHOWKI_CHLORINE_THRESH", "0.2")))
    chlorine_target_mg_l: float = Field(default=float(os.getenv("CHOWKI_CHLORINE_TARGET", "0.5")))
    turbidity_upper_threshold_ntu: float = Field(default=float(os.getenv("CHOWKI_TURBIDITY_THRESH", "4.0")))


@lru_cache()
def get_settings() -> Settings:
    return Settings()
