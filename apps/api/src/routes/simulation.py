# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/routes/simulation.py | Last Modified: 2026-08-22
# ============================================================

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from apps.api.src.db.database import get_db
from apps.api.src.db.models import (
    Checkin, SpatialZone, MenuItem, IoTReading, PharmacySpike,
    WardenTask, ComplianceAuditLog, ClusterAlert
)
from apps.api.src.core.security import generate_pseudonym_token


router = APIRouter(prefix="/simulation", tags=["Outbreak Scenario Simulator"])


def get_current_4h_bin(offset_hours: int = 0) -> str:
    now = datetime.now(timezone.utc) - timedelta(hours=offset_hours)
    bin_hour = (now.hour // 4) * 4
    bin_time = now.replace(hour=bin_hour, minute=0, second=0, microsecond=0)
    return bin_time.strftime("%Y-%m-%dT%H:00:00")


@router.post("/outbreak")
def inject_genuine_outbreak_scenario(db: Session = Depends(get_db)):
    """
    Simulates Scenario A: Genuine Staphylococcus aureus Point-Source Outbreak.
    - 5 students on Hostel Block C, 3rd Floor falling sick within hours of dinner
    - High clinical vector match (vomiting + cramps, no fever)
    - Shared consumption of high-risk Palak Paneer at Mess 2
    - Auxiliary IoT chlorine dip in Block C Sump (0.18 mg/L)
    - Pharmacy POS ORS surge (+260%)
    - Dispersed background baseline across campus to establish spatial contrast
    """
    now = datetime.now(timezone.utc)
    current_bin = get_current_4h_bin(0)

    # 1. Ensure Palak Paneer exists as a high-risk dinner item
    paneer_dish = db.query(MenuItem).filter(MenuItem.item_name == "Palak Paneer").first()
    if not paneer_dish:
        paneer_dish = MenuItem(
            mess_id="Mess_2_Girls",
            meal_type="dinner",
            item_name="Palak Paneer",
            risk_tag="high",
            risk_multiplier=1.5,
            vendor_type="external",
            estimated_servings=320,
            is_active=True
        )
        db.add(paneer_dish)

    # 2. Inject baseline background cases across other blocks over last 36h
    background_cases = [
        ("21EC0012", "Hostel_A_Fl_1", ["nausea"], ">8h", "canteen", "Snack", "bottled", 12),
        ("21ME0034", "Hostel_B_Fl_2", ["cramps"], ">8h", "mess_1", "Dal", "floor_ro", 16),
        ("21CS0056", "Hostel_D_Fl_1", ["nausea"], ">8h", "off_campus", "Roll", "bottled", 20),
        ("21CH0078", "Hostel_A_Fl_1", ["cramps"], ">8h", "mess_1", "Rice", "floor_ro", 24),
        ("21EE0090", "Hostel_B_Fl_2", ["nausea"], ">8h", "canteen", "Tea", "bottled", 28),
        ("21BT0022", "Hostel_D_Fl_1", ["cramps"], ">8h", "personal_food", "Fruit", "bottled", 32)
    ]
    for sid, zone, symp, onset, loc, dish, water, h_ago in background_cases:
        db.add(Checkin(
            token=generate_pseudonym_token(sid),
            spatial_zone=zone,
            temporal_bin=get_current_4h_bin(h_ago),
            symptoms=symp,
            onset_bucket=onset,
            meal_location=loc,
            meal_item_tag=dish,
            water_source=water,
            created_at=now - timedelta(hours=h_ago)
        ))

    # 3. Inject 5 clustered cases into Hostel_C_Fl_3 in the current bin
    students = ["22CS0104", "22CS0118", "22CS0129", "22CS0142", "22CS0155"]
    for idx, sid in enumerate(students):
        token = generate_pseudonym_token(sid)
        checkin = Checkin(
            token=token,
            spatial_zone="Hostel_C_Fl_3",
            temporal_bin=current_bin,
            symptoms=["nausea", "vomiting", "cramps"],
            onset_bucket="2-8h",
            meal_location="Mess_2_Girls",
            meal_item_tag="Palak Paneer",
            water_source="floor_ro",
            created_at=now - timedelta(minutes=(idx * 8 + 5))
        )
        db.add(checkin)

    # 4. Inject Aux Telemetry: Chlorine drop in Block C + ORS Pharmacy surge
    db.add(IoTReading(
        sensor_id="SENSOR-BlockC-RO-01",
        zone="Hostel_C_Fl_3",
        chlorine_mg_l=0.18, # Below 0.2 threshold!
        turbidity_ntu=3.2,
        ph=7.1,
        flow_lpm=42.0,
        alert_triggered=True
    ))

    db.add(PharmacySpike(
        item_category="ORS / Ondansetron",
        baseline_count=5,
        observed_count=18,
        spike_percent=260.0
    ))

    # 5. Audit Log
    db.add(ComplianceAuditLog(
        event_type="SIMULATION_OUTBREAK_INJECTED",
        actor_role="demo_simulator",
        zone_affected="Hostel_C_Fl_3",
        legal_basis="HACKATHON_DEMO_BENCHMARK",
        details={"scenario": "STAPH_AUREUS_POINT_SOURCE", "target_zone": "Hostel_C_Fl_3", "cases": 5}
    ))
    db.commit()

    return {
        "status": "success",
        "scenario": "Scenario A: Genuine Point-Source Food Poisoning (S. aureus)",
        "injected_cases": 5,
        "zone": "Hostel C, Floor 3",
        "expected_result": "STPSS p < 0.05 (Significant), Bayesian Outbreak Prob > 80%, Level 2 RED Alert"
    }


@router.post("/coincidental")
def inject_coincidental_upsets_scenario(db: Session = Depends(get_db)):
    """
    Simulates Scenario B: Coincidental Unrelated Stomach Upsets (Exam Stress / Dietary Indiscretion).
    - 4 students scattered randomly across different blocks (A, B, D) over 36 hours
    - Heterogeneous single symptoms (mild acidity, isolated heartburn)
    - Heterogeneous food sources (Zomato, room rest, canteen)
    - Normal water sensors & normal pharmacy sales
    """
    now = datetime.now(timezone.utc)
    
    scattered = [
        ("22EE0044", "Hostel_A_Fl_1", ["nausea"], ">8h", "off_campus", "Late Night Pizza", 24),
        ("22ME0088", "Hostel_B_Fl_2", ["cramps"], ">8h", "canteen", "Tea & Samosa", 16),
        ("22CE0019", "Hostel_D_Fl_1", ["nausea"], ">8h", "personal_food", "Instant Noodles", 8),
        ("22CS0091", "Hostel_C_Fl_3", ["cramps"], ">8h", "mess_1", "Dal", 32)
    ]

    for sid, zone, symp, onset, loc, dish, h_ago in scattered:
        token = generate_pseudonym_token(sid)
        checkin = Checkin(
            token=token,
            spatial_zone=zone,
            temporal_bin=get_current_4h_bin(h_ago),
            symptoms=symp,
            onset_bucket=onset,
            meal_location=loc,
            meal_item_tag=dish,
            water_source="bottled",
            created_at=now - timedelta(hours=h_ago)
        )
        db.add(checkin)

    # Normal Water Telemetry (0.55 mg/L chlorine)
    db.add(IoTReading(
        sensor_id="SENSOR-BlockC-RO-01",
        zone="Hostel_C_Fl_3",
        chlorine_mg_l=0.55,
        turbidity_ntu=1.1,
        ph=7.4,
        flow_lpm=52.0,
        alert_triggered=False
    ))

    db.commit()

    return {
        "status": "success",
        "scenario": "Scenario B: Scattered Coincidental Stomach Upsets",
        "injected_cases": 4,
        "zones": ["Hostel A", "Hostel B", "Hostel D", "Hostel C"],
        "expected_result": "STPSS p >= 0.05 (Not Significant), Bayesian Outbreak Prob < 20%, Level 0 GREEN Baseline"
    }


@router.post("/reset")
def reset_surveillance_database(db: Session = Depends(get_db)):
    """
    Clears all simulated check-ins, alerts, and spikes to return to pristine campus baseline.
    """
    db.query(Checkin).delete()
    db.query(ClusterAlert).delete()
    db.query(PharmacySpike).delete()
    db.query(IoTReading).delete()
    db.query(WardenTask).delete()
    
    zones = db.query(SpatialZone).all()
    for z in zones:
        z.current_alert_level = 0

    db.add(IoTReading(
        sensor_id="SENSOR-BlockC-RO-01",
        zone="Hostel_C_Fl_3",
        chlorine_mg_l=0.52,
        turbidity_ntu=1.2,
        ph=7.3,
        flow_lpm=50.0,
        alert_triggered=False
    ))

    db.add(ComplianceAuditLog(
        event_type="SYSTEM_RESET",
        actor_role="system_admin",
        zone_affected="all",
        legal_basis="CAMPUS_RADAR_BASELINE_INIT",
        details={"action": "reset_all_surveillance_bins"}
    ))
    db.commit()

    return {"status": "success", "message": "Campus outbreak radar reset to pristine baseline"}
