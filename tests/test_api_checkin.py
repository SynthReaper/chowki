# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: tests/test_api_checkin.py | Last Modified: 2026-08-22
# ============================================================

import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app
from apps.api.src.db.database import init_db


@pytest.fixture(autouse=True)
def setup_db():
    init_db()


client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "CHOWKI" in data["service"]


def test_submit_valid_student_checkin():
    payload = {
        "student_id_or_device": "22CS0999",
        "spatial_zone": "Hostel_C_Fl_3",
        "symptoms": ["nausea", "vomiting"],
        "onset_bucket": "2-8h",
        "meal_location": "mess_2",
        "meal_item_tag": "Palak Paneer",
        "water_source": "floor_ro"
    }
    response = client.post("/api/v1/checkin", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "pseudonym_token" in data
    assert len(data["pseudonym_token"]) == 64 # SHA-256 hex length
    assert data["spatial_zone"] == "Hostel_C_Fl_3"
    assert "advisory_message" in data
    assert response.headers.get("x-powered-by") == "CHOWKI/1.0 (Synthreaper)"


def test_live_radar_endpoint_returns_data():
    response = client.get("/api/v1/radar/live")
    assert response.status_code == 200
    data = response.json()
    assert "system_status" in data
    assert "zones" in data
    assert "epi_curve" in data
    assert len(data["zones"]) >= 4
