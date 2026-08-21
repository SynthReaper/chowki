# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/routes/telemetry.py | Last Modified: 2026-08-22
# ============================================================

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from apps.api.src.db.database import get_db
from apps.api.src.db.models import IoTReading, PharmacySpike, ComplianceAuditLog
from apps.api.src.schemas.telemetry import IoTReadingCreate, PharmacySpikeCreate
from apps.api.src.core.config import get_settings


router = APIRouter(prefix="/telemetry", tags=["Telemetry Feeds"])
settings = get_settings()


@router.get("/iot")
def get_latest_iot_telemetry(db: Session = Depends(get_db)):
    """
    Returns latest water quality IoT sensor measurements across campus RO sumps.
    """
    readings = db.query(IoTReading).order_by(IoTReading.timestamp.desc()).limit(10).all()
    return [
        {
            "id": r.id,
            "sensor_id": r.sensor_id,
            "zone": r.zone,
            "chlorine_mg_l": r.chlorine_mg_l,
            "turbidity_ntu": r.turbidity_ntu,
            "ph": r.ph,
            "flow_lpm": r.flow_lpm,
            "alert_triggered": r.alert_triggered,
            "timestamp": r.timestamp.isoformat()
        }
        for r in readings
    ]


@router.post("/iot", status_code=status.HTTP_201_CREATED)
def record_iot_reading(payload: IoTReadingCreate, db: Session = Depends(get_db)):
    """
    Ingests continuous telemetry from inline drinking water sensors.
    """
    is_alert = (
        payload.chlorine_mg_l < settings.chlorine_lower_threshold_mg_l or
        payload.turbidity_ntu > settings.turbidity_upper_threshold_ntu
    )
    
    reading = IoTReading(
        sensor_id=payload.sensor_id,
        zone=payload.zone,
        chlorine_mg_l=payload.chlorine_mg_l,
        turbidity_ntu=payload.turbidity_ntu,
        ph=payload.ph or 7.2,
        flow_lpm=payload.flow_lpm or 50.0,
        alert_triggered=is_alert
    )
    db.add(reading)
    
    if is_alert:
        db.add(ComplianceAuditLog(
            event_type="IOT_WATER_ANOMALY",
            actor_role="iot_subsystem",
            zone_affected=payload.zone,
            legal_basis="CAMPUS_WATER_SAFETY_MONITORING",
            details={
                "chlorine": payload.chlorine_mg_l,
                "turbidity": payload.turbidity_ntu,
                "sensor": payload.sensor_id
            }
        ))
        
    db.commit()
    db.refresh(reading)
    return {"message": "IoT reading ingested", "alert_triggered": is_alert, "id": reading.id}


@router.get("/pharmacy")
def get_pharmacy_spikes(db: Session = Depends(get_db)):
    """
    Returns recent retail pharmacy point-of-sale spike anomalies.
    """
    spikes = db.query(PharmacySpike).order_by(PharmacySpike.timestamp.desc()).limit(10).all()
    return [
        {
            "id": s.id,
            "item_category": s.item_category,
            "baseline_count": s.baseline_count,
            "observed_count": s.observed_count,
            "spike_percent": s.spike_percent,
            "timestamp": s.timestamp.isoformat()
        }
        for s in spikes
    ]


@router.post("/pharmacy", status_code=status.HTTP_201_CREATED)
def record_pharmacy_spike(payload: PharmacySpikeCreate, db: Session = Depends(get_db)):
    """
    Ingests privacy-preserving aggregated Point-of-Sale sales data from campus pharmacies.
    """
    baseline = payload.baseline_count or 5
    ratio = payload.observed_count / max(baseline, 1)
    spike_pct = (ratio - 1.0) * 100.0

    spike = PharmacySpike(
        item_category=payload.item_category,
        baseline_count=baseline,
        observed_count=payload.observed_count,
        spike_percent=round(spike_pct, 1)
    )
    db.add(spike)
    db.commit()
    return {"message": "Pharmacy POS metric logged", "spike_percent": spike.spike_percent}
