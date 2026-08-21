# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: tests/conftest.py | Last Modified: 2026-08-22
# ============================================================

import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

os.environ["CHOWKI_DATABASE_URL"] = "sqlite:///:memory:"
os.environ["CHOWKI_ENV"] = "test"

# Import models so Base.metadata has all table definitions
from apps.api.src.db.database import Base, get_db
import apps.api.src.db.models as models
from apps.api.src.main import app


# StaticPool ensures all connections share the SAME in-memory database
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function", autouse=True)
def clean_db():
    """
    Creates clean tables and seeds initial campus zones for every test function.
    """
    Base.metadata.create_all(bind=test_engine)
    
    # Seed default zones in test DB
    db = TestingSessionLocal()
    default_zones = [
        ("Hostel_A_Fl_1", "Hostel A — 1st Floor", "floor", "Hostel_A_Block", 60),
        ("Hostel_B_Fl_2", "Hostel B — 2nd Floor", "floor", "Hostel_B_Block", 55),
        ("Hostel_C_Fl_3", "Hostel C — 3rd Floor", "floor", "Hostel_C_Block", 65),
        ("Hostel_D_Fl_1", "Hostel D — 1st Floor", "floor", "Hostel_D_Block", 50),
        ("Mess_1_Main", "Mess 1 (Main Hall)", "mess", None, 450),
        ("Mess_2_Girls", "Mess 2 (Dining Hall 2)", "mess", None, 380)
    ]
    for token, name, z_type, parent, cap in default_zones:
        db.add(models.SpatialZone(
            zone_token=token,
            display_name=name,
            zone_type=z_type,
            parent_zone=parent,
            resident_capacity=cap,
            current_alert_level=0
        ))
    db.commit()
    db.close()

    def override_get_db():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=test_engine)
    app.dependency_overrides.clear()
