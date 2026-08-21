# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/db/models.py | Last Modified: 2026-08-22
# ============================================================

import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
)
from apps.api.src.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Checkin(Base):
    """
    Pseudonymous student health check-in record.
    Purged automatically after 30 days per DPDP Act data minimization mandate.
    """
    __tablename__ = "checkins"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    token = Column(String(64), index=True, nullable=False) # Pseudonymous hash
    spatial_zone = Column(String(64), index=True, nullable=False) # e.g. Hostel_C_Fl_3
    temporal_bin = Column(String(32), index=True, nullable=False) # ISO bin string e.g. 2026-08-22T00:00:00
    symptoms = Column(JSON, nullable=False) # e.g. ["nausea", "vomiting", "cramps"]
    onset_bucket = Column(String(20), nullable=False) # '<2h', '2-8h', '>8h'
    meal_location = Column(String(50), nullable=True) # mess_1, mess_2, canteen, off_campus
    meal_item_tag = Column(String(100), nullable=True) # palak_paneer, rice, etc.
    water_source = Column(String(50), nullable=True) # floor_ro, water_cooler, bottled
    created_at = Column(DateTime, default=get_utc_now)
    purge_after = Column(DateTime, default=lambda: get_utc_now() + timedelta(days=30))


class SpatialZone(Base):
    """
    Campus GIS-mapped physical zones (blocks, wings, floors, messes).
    """
    __tablename__ = "spatial_zones"

    zone_token = Column(String(64), primary_key=True) # e.g. Hostel_C_Fl_3
    display_name = Column(String(100), nullable=False)
    zone_type = Column(String(30), nullable=False) # block, wing, floor, mess, library
    parent_zone = Column(String(64), nullable=True) # e.g. Hostel_C_Block
    resident_capacity = Column(Integer, default=50)
    current_alert_level = Column(Integer, default=0) # 0=Normal, 1=Advisory, 2=Alert, 3=Emergency


class MenuItem(Base):
    """
    Mess dining schedule and dish hazard tracking.
    """
    __tablename__ = "menu_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    mess_id = Column(String(50), index=True, nullable=False) # mess_1, mess_2
    meal_type = Column(String(20), nullable=False) # breakfast, lunch, dinner, snacks
    service_start = Column(DateTime, default=get_utc_now)
    item_name = Column(String(100), nullable=False)
    risk_tag = Column(String(20), default="normal") # normal, high
    risk_multiplier = Column(Float, default=1.0)
    estimated_servings = Column(Integer, default=300)
    vendor_type = Column(String(30), default="in-house") # in-house, external
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=get_utc_now)


class StpssResult(Base):
    """
    Output of Space-Time Permutation Scan Statistic (STPSS) execution.
    """
    __tablename__ = "stpss_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_timestamp = Column(DateTime, default=get_utc_now)
    zone = Column(String(64), index=True, nullable=False)
    temporal_bin = Column(String(32), nullable=False)
    case_count = Column(Integer, nullable=False)
    expected_count = Column(Float, nullable=False)
    llr = Column(Float, nullable=False) # Log-Likelihood Ratio
    p_value = Column(Float, nullable=False) # Monte Carlo p-value
    relative_risk = Column(Float, nullable=False)
    is_significant = Column(Boolean, default=False)


class ClusterAlert(Base):
    """
    Active micro-outbreak alerts with Bayesian pathogen attribution and SOP status.
    """
    __tablename__ = "cluster_alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_ref_id = Column(String(36), nullable=True)
    alert_level = Column(Integer, nullable=False) # 1, 2, 3
    zone = Column(String(64), index=True, nullable=False)
    outbreak_probability = Column(Float, nullable=False)
    top_pathogen = Column(String(64), nullable=False)
    pathogen_scores = Column(JSON, nullable=False)
    incubation_delta_h = Column(Float, nullable=True)
    mk_score = Column(Float, nullable=True) # Mess exposure hazard score
    exposure_vector = Column(String(200), nullable=True)
    status = Column(String(30), default="active") # active, acknowledged, resolved
    created_at = Column(DateTime, default=get_utc_now)
    resolved_at = Column(DateTime, nullable=True)


class IoTReading(Base):
    """
    Water quality telemetry streamed from inline sensors.
    """
    __tablename__ = "iot_readings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    sensor_id = Column(String(64), index=True, nullable=False)
    zone = Column(String(64), index=True, nullable=False)
    timestamp = Column(DateTime, default=get_utc_now)
    chlorine_mg_l = Column(Float, nullable=False)
    turbidity_ntu = Column(Float, nullable=False)
    ph = Column(Float, default=7.2)
    flow_lpm = Column(Float, default=50.0)
    alert_triggered = Column(Boolean, default=False)


class PharmacySpike(Base):
    """
    Pharmacy Point-of-Sale over-the-counter medication sale anomalies.
    """
    __tablename__ = "pharmacy_spikes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    timestamp = Column(DateTime, default=get_utc_now)
    item_category = Column(String(50), nullable=False) # ORS, antiemetic, antidiarrheal
    baseline_count = Column(Integer, default=5)
    observed_count = Column(Integer, default=5)
    spike_percent = Column(Float, default=0.0)


class ConsentRecord(Base):
    """
    DPDP Act 2023 Student Consent Ledger.
    """
    __tablename__ = "consent_records"

    token = Column(String(64), primary_key=True)
    consent_given = Column(Boolean, default=True)
    given_at = Column(DateTime, default=get_utc_now)
    withdrawn_at = Column(DateTime, nullable=True)
    purge_deadline = Column(DateTime, nullable=True)


class ComplianceAuditLog(Base):
    """
    Immutable regulatory compliance and de-anonymization ledger.
    Append-only per DPDP Act Section 8 and Section 7(d).
    """
    __tablename__ = "compliance_audit_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_type = Column(String(64), nullable=False)
    actor_role = Column(String(32), nullable=False)
    zone_affected = Column(String(64), nullable=True)
    legal_basis = Column(String(128), nullable=False)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)


class WardenTask(Base):
    """
    Actionable SOP containment tasks dispatched to Hostel Wardens and Mess Staff.
    """
    __tablename__ = "warden_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    zone = Column(String(64), index=True, nullable=False)
    alert_level = Column(Integer, default=1)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    completed_by = Column(String(64), nullable=True)
    verification_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)


class SystemConfig(Base):
    """
    Dynamic operational thresholds and parameters editable without code deploy.
    """
    __tablename__ = "system_config"

    key = Column(String(64), primary_key=True)
    value = Column(JSON, nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)
