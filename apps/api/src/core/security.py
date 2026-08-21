# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/core/security.py | Last Modified: 2026-08-22
# ============================================================

import hmac
import hashlib
import time
from datetime import datetime, timezone
from typing import Optional
from jose import jwt, JWTError
from apps.api.src.core.config import get_settings


settings = get_settings()


def generate_pseudonym_token(roll_or_device_id: str, week_index: Optional[int] = None) -> str:
    """
    Generates a cryptographically salted pseudonymous token for a student/device.
    Tokens rotate weekly to prevent longitudinal tracking while allowing micro-cluster analysis.
    Complies with DPDP Act 2023 k-anonymity and pseudonymization requirements.
    """
    if week_index is None:
        # ISO week number (1 to 53)
        week_index = datetime.now(timezone.utc).isocalendar()[1]
        
    salt = f"{settings.salt_rotation_seed}_w{week_index}".encode("utf-8")
    message = roll_or_device_id.strip().lower().encode("utf-8")
    
    return hmac.new(salt, message, hashlib.sha256).hexdigest()


def create_access_token(data: dict, expires_delta_seconds: Optional[int] = None) -> str:
    """
    Issues a signed JWT access token with role claims.
    """
    to_encode = data.copy()
    expire_sec = expires_delta_seconds or (settings.access_token_expire_minutes * 60)
    expire_timestamp = int(time.time()) + expire_sec
    to_encode.update({"exp": expire_timestamp, "iat": int(time.time())})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


def verify_access_token(token: str) -> Optional[dict]:
    """
    Decodes and verifies token signature and expiration.
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        return None
