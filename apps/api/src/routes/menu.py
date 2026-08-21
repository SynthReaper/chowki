# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/routes/menu.py | Last Modified: 2026-08-22
# ============================================================

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from apps.api.src.db.database import get_db
from apps.api.src.db.models import MenuItem, ComplianceAuditLog
from apps.api.src.schemas.menu import MenuItemCreate, MenuItemResponse


router = APIRouter(prefix="/menu", tags=["Mess Dining & Menu Tracking"])

HIGH_RISK_KEYWORDS = ["paneer", "chutney", "curd", "cream", "street", "gol gappa", "mayo", "raw"]


@router.get("", response_model=list[MenuItemResponse])
def list_menu_items(db: Session = Depends(get_db)):
    """
    Lists current active mess menu schedule and dish hazard ratings.
    """
    items = db.query(MenuItem).order_by(MenuItem.service_start.desc()).all()
    return [
        MenuItemResponse(
            id=item.id,
            mess_id=item.mess_id,
            meal_type=item.meal_type,
            item_name=item.item_name,
            risk_tag=item.risk_tag,
            risk_multiplier=item.risk_multiplier,
            vendor_type=item.vendor_type,
            estimated_servings=item.estimated_servings,
            is_active=item.is_active,
            created_at=item.created_at.isoformat()
        )
        for item in items
    ]


@router.post("", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(payload: MenuItemCreate, db: Session = Depends(get_db)):
    """
    Registers a new dish item with automated microbiological hazard tagging.
    """
    item_name_lower = payload.item_name.lower()
    is_high_risk = any(kw in item_name_lower for kw in HIGH_RISK_KEYWORDS) or payload.risk_tag == "high"
    
    risk_tag = "high" if is_high_risk else "normal"
    multiplier = 1.5 if is_high_risk else 1.0

    menu_item = MenuItem(
        mess_id=payload.mess_id,
        meal_type=payload.meal_type,
        item_name=payload.item_name,
        risk_tag=risk_tag,
        risk_multiplier=multiplier,
        vendor_type=payload.vendor_type,
        estimated_servings=payload.estimated_servings,
        is_active=True
    )
    db.add(menu_item)
    db.commit()
    db.refresh(menu_item)

    return MenuItemResponse(
        id=menu_item.id,
        mess_id=menu_item.mess_id,
        meal_type=menu_item.meal_type,
        item_name=menu_item.item_name,
        risk_tag=menu_item.risk_tag,
        risk_multiplier=menu_item.risk_multiplier,
        vendor_type=menu_item.vendor_type,
        estimated_servings=menu_item.estimated_servings,
        is_active=menu_item.is_active,
        created_at=menu_item.created_at.isoformat()
    )


@router.patch("/{item_id}/suspend")
def suspend_menu_item(item_id: str, db: Session = Depends(get_db)):
    """
    Allows Mess Managers to immediately suspend a high-risk dish upon Level 2/3 outbreak alert.
    """
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
        
    item.is_active = False
    
    # Audit trail
    db.add(ComplianceAuditLog(
        event_type="DISH_SUSPENSION",
        actor_role="mess_manager",
        zone_affected=item.mess_id,
        legal_basis="CAMPUS_FOOD_SAFETY_SOP",
        details={"dish": item.item_name, "mess": item.mess_id}
    ))
    db.commit()

    return {"message": f"Successfully suspended dish: {item.item_name}", "is_active": False}
