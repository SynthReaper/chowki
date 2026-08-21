# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/schemas/menu.py | Last Modified: 2026-08-22
# ============================================================

from typing import Optional
from pydantic import BaseModel, Field


class MenuItemCreate(BaseModel):
    mess_id: str = Field(..., description="e.g. mess_1, mess_2")
    meal_type: str = Field(..., description="breakfast, lunch, dinner, snacks")
    item_name: str = Field(..., description="e.g. Palak Paneer, Steamed Rice, Mint Chutney")
    risk_tag: str = Field(default="normal", description="normal, high")
    vendor_type: str = Field(default="in-house", description="in-house, external")
    estimated_servings: int = Field(default=300)


class MenuItemResponse(BaseModel):
    id: str
    mess_id: str
    meal_type: str
    item_name: str
    risk_tag: str
    risk_multiplier: float
    vendor_type: str
    estimated_servings: int
    is_active: bool
    created_at: str
