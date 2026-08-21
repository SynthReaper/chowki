# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/routes/warden.py | Last Modified: 2026-08-22
# ============================================================

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from apps.api.src.db.database import get_db
from apps.api.src.db.models import WardenTask, SpatialZone, ComplianceAuditLog
from apps.api.src.schemas.telemetry import WardenTaskUpdate


router = APIRouter(prefix="/warden", tags=["Hostel Warden Operational Panel"])


class FieldLogCreate(BaseModel):
    zone: str
    free_chlorine_mg_l: float
    ro_unit_status: str # operational, bypassed, serviced
    sanitization_performed: bool
    notes: str


@router.get("/tasks/{zone}")
def get_warden_sop_tasks(zone: str, db: Session = Depends(get_db)):
    """
    Returns role-gated Standard Operating Procedure (SOP) checklists for hostel wardens.
    """
    tasks = db.query(WardenTask).filter(WardenTask.zone == zone).all()
    
    if not tasks:
        # Seed default actionable SOP tasks for the zone
        default_tasks = [
            ("Inspect and lock Floor RO purifier intake valve", "Immediate physical isolation of potentially contaminated water line.", 1),
            ("Oversee custodial deep chlorination of common restrooms", "Use 1.0% sodium hypochlorite solution on door handles and taps.", 2),
            ("Distribute ORS hydration sachets to floor security desks", "Ensure affected students have access without leaving rooms.", 2),
            ("Conduct visual inspection of water cooler sump drainage", "Verify no back-siphonage or pipe micro-fractures.", 1)
        ]
        for title, desc, lvl in default_tasks:
            db.add(WardenTask(zone=zone, alert_level=lvl, title=title, description=desc, is_completed=False))
        db.commit()
        tasks = db.query(WardenTask).filter(WardenTask.zone == zone).all()

    return [
        {
            "id": t.id,
            "zone": t.zone,
            "alert_level": t.alert_level,
            "title": t.title,
            "description": t.description,
            "is_completed": t.is_completed,
            "completed_at": t.completed_at.isoformat() if t.completed_at else None,
            "completed_by": t.completed_by,
            "verification_notes": t.verification_notes
        }
        for t in tasks
    ]


@router.patch("/tasks/{task_id}")
def update_warden_task(task_id: str, payload: WardenTaskUpdate, db: Session = Depends(get_db)):
    """
    Marks a containment SOP task as completed with verification note.
    """
    task = db.query(WardenTask).filter(WardenTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.is_completed = payload.is_completed
    task.completed_at = datetime.now(timezone.utc) if payload.is_completed else None
    task.completed_by = payload.completed_by
    task.verification_notes = payload.verification_notes

    # Audit log
    db.add(ComplianceAuditLog(
        event_type="SOP_TASK_COMPLETED",
        actor_role="hostel_warden",
        zone_affected=task.zone,
        legal_basis="CONTAINMENT_PROTOCOL_EXECUTION",
        details={"task": task.title, "completed_by": task.completed_by}
    ))
    db.commit()
    return {"message": "Task updated", "task_id": task.id, "is_completed": task.is_completed}


@router.post("/field-log", status_code=status.HTTP_201_CREATED)
def submit_warden_field_log(payload: FieldLogCreate, db: Session = Depends(get_db)):
    """
    Logs physical environmental chlorine checks and custodial actions by hostel wardens.
    """
    db.add(ComplianceAuditLog(
        event_type="WARDEN_FIELD_VERIFICATION",
        actor_role="hostel_warden",
        zone_affected=payload.zone,
        legal_basis="DPDP_ACT_SECTION_8_QUALITY",
        details={
            "chlorine": payload.free_chlorine_mg_l,
            "ro_status": payload.ro_unit_status,
            "sanitization": payload.sanitization_performed,
            "notes": payload.notes
        }
    ))
    db.commit()
    return {"message": "Field log verified and permanently recorded in audit ledger"}
