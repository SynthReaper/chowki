# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/schemas/checkin.py | Last Modified: 2026-08-22
# ============================================================

from typing import Optional
from pydantic import BaseModel, Field


class CheckinCreateRequest(BaseModel):
    """
    15-second ambient student check-in submission schema.
    """
    student_id_or_device: str = Field(..., description="Student roll number or device identifier (will be hashed at edge)")
    spatial_zone: str = Field(..., description="e.g. Hostel_C_Fl_3, Hostel_B_Fl_1")
    symptoms: list[str] = Field(default_factory=list, description="List of symptoms e.g. nausea, vomiting, cramps, diarrhea, fever")
    onset_bucket: str = Field(default="2-8h", description="<2h, 2-8h, >8h")
    meal_location: Optional[str] = Field(default="mess_2", description="mess_1, mess_2, canteen, off_campus")
    meal_item_tag: Optional[str] = Field(default=None, description="e.g. Palak Paneer, Steamed Rice")
    water_source: Optional[str] = Field(default="floor_ro", description="floor_ro, water_cooler, bottled")


class CheckinResponse(BaseModel):
    """
    Response returned to student device after check-in.
    """
    checkin_id: str
    pseudonym_token: str
    spatial_zone: str
    floor_status: str # normal, advisory, alert, emergency
    status_color: str # green, yellow, red, crimson
    advisory_message: str
    timestamp: str
