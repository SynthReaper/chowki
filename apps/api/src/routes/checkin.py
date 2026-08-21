# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/routes/checkin.py | Last Modified: 2026-08-22
# ============================================================

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from apps.api.src.db.database import get_db
from apps.api.src.db.models import Checkin, SpatialZone, ConsentRecord, ComplianceAuditLog
from apps.api.src.schemas.checkin import CheckinCreateRequest, CheckinResponse
from apps.api.src.core.security import generate_pseudonym_token
from apps.api.src.core.config import get_settings


router = APIRouter(prefix="/checkin", tags=["Student Check-in"])
settings = get_settings()


def get_current_4h_bin() -> str:
    """
    Computes ISO string for current 4-hour temporal sliding window.
    e.g. 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
    """
    now = datetime.now(timezone.utc)
    bin_hour = (now.hour // 4) * 4
    bin_time = now.replace(hour=bin_hour, minute=0, second=0, microsecond=0)
    return bin_time.strftime("%Y-%m-%dT%H:00:00")


@router.post("", response_model=CheckinResponse, status_code=status.HTTP_201_CREATED)
def submit_student_checkin(
    payload: CheckinCreateRequest,
    db: Session = Depends(get_db)
):
    """
    15-second zero-friction ambient student check-in endpoint.
    Performs client-edge pseudonymization and DPDP consent validation.
    """
    # 1. Generate salted weekly-rotating pseudonym token
    token = generate_pseudonym_token(payload.student_id_or_device)
    
    # 2. Check if student has explicitly opted out
    consent = db.query(ConsentRecord).filter(ConsentRecord.token == token).first()
    if consent and not consent.consent_given:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Consent has been revoked for this token. Re-enable in Privacy Hub to submit check-ins."
        )

    # If first time, record implicit DPDP opt-in
    if not consent:
        new_consent = ConsentRecord(token=token, consent_given=True)
        db.add(new_consent)

    # 3. Verify spatial zone exists (or create default)
    zone = db.query(SpatialZone).filter(SpatialZone.zone_token == payload.spatial_zone).first()
    if not zone:
        zone = SpatialZone(
            zone_token=payload.spatial_zone,
            display_name=payload.spatial_zone.replace("_", " "),
            zone_type="floor",
            current_alert_level=0
        )
        db.add(zone)
        db.flush()

    # 4. Save Checkin record
    temporal_bin = get_current_4h_bin()
    checkin = Checkin(
        token=token,
        spatial_zone=payload.spatial_zone,
        temporal_bin=temporal_bin,
        symptoms=payload.symptoms,
        onset_bucket=payload.onset_bucket,
        meal_location=payload.meal_location,
        meal_item_tag=payload.meal_item_tag,
        water_source=payload.water_source
    )
    db.add(checkin)

    # 5. Log audit event
    audit_entry = ComplianceAuditLog(
        event_type="TELEMETRY_INGESTION",
        actor_role="student_principal",
        zone_affected=payload.spatial_zone,
        legal_basis="DPDP_ACT_2023_SECTION_6_CONSENT",
        details={"token": token, "symptoms_count": len(payload.symptoms), "bin": temporal_bin}
    )
    db.add(audit_entry)
    db.commit()

    # 6. Compute instant floor status advisory
    alert_level = zone.current_alert_level
    if alert_level == 0:
        floor_status = "normal"
        status_color = "green"
        advisory_msg = "All clear. Floor water chlorinated at 0.5 mg/L. Stay hydrated!"
    elif alert_level == 1:
        floor_status = "advisory"
        status_color = "yellow"
        advisory_msg = "Elevated stomach complaints detected nearby. Drink boiled or bottled water."
    elif alert_level == 2:
        floor_status = "alert"
        status_color = "red"
        advisory_msg = "Active cluster alert in this block. Avoid unchlorinated water; free ORS available at warden desk."
    else:
        floor_status = "emergency"
        status_color = "crimson"
        advisory_msg = "Institutional emergency response active. Medical taskforce deployed to your block."

    return CheckinResponse(
        checkin_id=checkin.id,
        pseudonym_token=token,
        spatial_zone=payload.spatial_zone,
        floor_status=floor_status,
        status_color=status_color,
        advisory_message=advisory_msg,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
