# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: scripts/seed_demo_data.py | Last Modified: 2026-08-22
# ============================================================

import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from apps.api.src.db.database import init_db, SessionLocal
from apps.api.src.db.models import SpatialZone, MenuItem, IoTReading, ComplianceAuditLog


def seed_database():
    """
    Idempotent database seeder for Project CHOWKI.
    """
    print("[INIT] Initializing Project CHOWKI Database Schema...")
    init_db()
    
    db = SessionLocal()
    try:
        print("[SEED] Seeding Campus Spatial Topology Zones...")
        default_zones = [
            ("Hostel_A_Fl_1", "Hostel A — 1st Floor", "floor", "Hostel_A_Block", 60),
            ("Hostel_B_Fl_2", "Hostel B — 2nd Floor", "floor", "Hostel_B_Block", 55),
            ("Hostel_C_Fl_3", "Hostel C — 3rd Floor", "floor", "Hostel_C_Block", 65),
            ("Hostel_D_Fl_1", "Hostel D — 1st Floor", "floor", "Hostel_D_Block", 50),
            ("Mess_1_Main", "Mess 1 (Main Hall)", "mess", None, 450),
            ("Mess_2_Girls", "Mess 2 (Dining Hall 2)", "mess", None, 380)
        ]
        for token, name, z_type, parent, cap in default_zones:
            existing = db.query(SpatialZone).filter(SpatialZone.zone_token == token).first()
            if not existing:
                db.add(SpatialZone(
                    zone_token=token,
                    display_name=name,
                    zone_type=z_type,
                    parent_zone=parent,
                    resident_capacity=cap,
                    current_alert_level=0
                ))

        print("[SEED] Seeding Initial Dining Hall Menus & Food Hazard Ratings...")
        if db.query(MenuItem).count() == 0:
            db.add(MenuItem(
                mess_id="Mess_2_Girls",
                meal_type="dinner",
                item_name="Palak Paneer",
                risk_tag="high",
                risk_multiplier=1.5,
                vendor_type="external",
                estimated_servings=320,
                is_active=True
            ))
            db.add(MenuItem(
                mess_id="Mess_2_Girls",
                meal_type="dinner",
                item_name="Steamed Rice",
                risk_tag="high",
                risk_multiplier=1.2,
                vendor_type="in-house",
                estimated_servings=320,
                is_active=True
            ))
            db.add(MenuItem(
                mess_id="Mess_1_Main",
                meal_type="dinner",
                item_name="Dal Tadka & Roti",
                risk_tag="normal",
                risk_multiplier=1.0,
                vendor_type="in-house",
                estimated_servings=400,
                is_active=True
            ))

        print("[SEED] Seeding Clean Water RO Telemetry Baseline...")
        if db.query(IoTReading).count() == 0:
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
            event_type="SEED_DATABASE_EXECUTION",
            actor_role="system_admin",
            zone_affected="all",
            legal_basis="CAMPUS_RADAR_BASELINE_INIT",
            details={"status": "complete", "script": "seed_demo_data.py"}
        ))
        db.commit()
        print("[SUCCESS] Project CHOWKI Seeding Complete!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
