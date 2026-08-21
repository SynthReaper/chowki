# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: tests/test_simulation_and_ops.py | Last Modified: 2026-08-22
# ============================================================

import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app


client = TestClient(app)


def test_simulation_outbreak_and_radar_alert():
    """
    Triggers synthetic S. aureus outbreak and verifies that live radar reports Level 2 Alert.
    """
    res = client.post("/api/v1/simulation/outbreak")
    assert res.status_code == 200
    assert res.json()["injected_cases"] == 5

    radar_res = client.get("/api/v1/radar/live")
    assert radar_res.status_code == 200
    data = radar_res.json()
    assert data["highest_alert_level"] >= 2
    assert "Hostel_C" in data["primary_risk_zone"]
    assert len(data["clusters"]) > 0
    top_cluster = data["clusters"][0]
    assert "staphylococcus" in top_cluster["top_pathogen"].lower()


def test_simulation_coincidental_and_radar_baseline():
    """
    Resets radar and injects coincidental noise. Live radar should remain at Level 0.
    """
    client.post("/api/v1/simulation/reset")
    client.post("/api/v1/simulation/coincidental")

    radar_res = client.get("/api/v1/radar/live")
    assert radar_res.status_code == 200
    data = radar_res.json()
    assert data["highest_alert_level"] == 0
    assert data["active_clusters_count"] == 0


def test_menu_creation_and_dish_suspension():
    """
    Tests creating a high-risk dish and suspending it via the warden/mess API.
    """
    menu_payload = {
        "mess_id": "Mess_2_Girls",
        "meal_type": "dinner",
        "item_name": "Shahi Paneer Cream",
        "risk_tag": "high",
        "vendor_type": "external",
        "estimated_servings": 250
    }
    create_res = client.post("/api/v1/menu", json=menu_payload)
    assert create_res.status_code == 201
    item_id = create_res.json()["id"]
    assert create_res.json()["risk_tag"] == "high"

    # Suspend dish
    suspend_res = client.patch(f"/api/v1/menu/{item_id}/suspend")
    assert suspend_res.status_code == 200
    assert suspend_res.json()["is_active"] is False


def test_telemetry_iot_and_pharmacy_ingestion():
    """
    Tests water IoT sensor ingestion and pharmacy POS spike logging.
    """
    iot_payload = {
        "sensor_id": "SENSOR-BlockB-RO-02",
        "zone": "Hostel_B_Fl_2",
        "chlorine_mg_l": 0.15, # low chlorine alert
        "turbidity_ntu": 4.5,  # high turbidity alert
        "ph": 7.1,
        "flow_lpm": 48.0
    }
    iot_res = client.post("/api/v1/telemetry/iot", json=iot_payload)
    assert iot_res.status_code == 201
    assert iot_res.json()["alert_triggered"] is True

    pharmacy_payload = {
        "item_category": "ORS Electral",
        "observed_count": 22,
        "baseline_count": 6
    }
    pharmacy_res = client.post("/api/v1/telemetry/pharmacy", json=pharmacy_payload)
    assert pharmacy_res.status_code == 201
    assert pharmacy_res.json()["spike_percent"] > 200.0


def test_warden_sop_tasks_and_field_log():
    """
    Tests warden SOP task checklist retrieval, completion, and field chlorination logging.
    """
    zone = "Hostel_C_Fl_3"
    tasks_res = client.get(f"/api/v1/warden/tasks/{zone}")
    assert tasks_res.status_code == 200
    tasks = tasks_res.json()
    assert len(tasks) >= 3

    # Mark first task complete
    first_task_id = tasks[0]["id"]
    update_res = client.patch(
        f"/api/v1/warden/tasks/{first_task_id}",
        json={"is_completed": True, "verification_notes": "RO intake valve locked securely at 00:15 IST."}
    )
    assert update_res.status_code == 200
    assert update_res.json()["is_completed"] is True

    # Submit field log
    field_log_payload = {
        "zone": zone,
        "free_chlorine_mg_l": 0.65,
        "ro_unit_status": "operational",
        "sanitization_performed": True,
        "notes": "Bleach sanitization performed on floor 3 common washroom."
    }
    log_res = client.post("/api/v1/warden/field-log", json=field_log_payload)
    assert log_res.status_code == 201
