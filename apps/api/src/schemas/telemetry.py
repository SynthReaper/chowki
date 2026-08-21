# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/schemas/telemetry.py | Last Modified: 2026-08-22
# ============================================================

from typing import Optional
from pydantic import BaseModel, Field


class IoTReadingCreate(BaseModel):
    sensor_id: str
    zone: str
    chlorine_mg_l: float
    turbidity_ntu: float
    ph: Optional[float] = 7.2
    flow_lpm: Optional[float] = 50.0


class PharmacySpikeCreate(BaseModel):
    item_category: str # ORS, antiemetic, antidiarrheal
    observed_count: int
    baseline_count: Optional[int] = 5


class WardenTaskUpdate(BaseModel):
    is_completed: bool
    completed_by: Optional[str] = "Warden Mrs. Sharma"
    verification_notes: Optional[str] = None
