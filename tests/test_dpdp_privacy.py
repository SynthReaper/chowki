# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: tests/test_dpdp_privacy.py | Last Modified: 2026-08-22
# ============================================================

import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app
from apps.api.src.core.security import generate_pseudonym_token


client = TestClient(app)


def test_pseudonymization_weekly_rotation():
    """
    Verifies that tokens generated in different weeks produce distinct non-linkable hashes.
    """
    sid = "22BT0050"
    token_w1 = generate_pseudonym_token(sid, week_index=33)
    token_w2 = generate_pseudonym_token(sid, week_index=34)

    assert token_w1 != token_w2
    assert len(token_w1) == 64
    assert len(token_w2) == 64


def test_consent_revocation_and_erasure():
    """
    Tests DPDP Act 2023 Section 8(7) right to erasure.
    Submits a checkin, then revokes consent and verifies data is purged.
    """
    sid = "22ME0099"
    # 1. Submit check-in
    payload = {
        "student_id_or_device": sid,
        "spatial_zone": "Hostel_B_Fl_2",
        "symptoms": ["nausea"],
        "onset_bucket": "<2h",
        "meal_location": "canteen",
        "meal_item_tag": "Tea",
        "water_source": "bottled"
    }
    res = client.post("/api/v1/checkin", json=payload)
    assert res.status_code == 201
    token = res.json()["pseudonym_token"]

    # 2. Check consent status
    status_res = client.get(f"/api/v1/consent/{token}")
    assert status_res.status_code == 200
    assert status_res.json()["consent_given"] is True

    # 3. Revoke consent & trigger erasure
    delete_res = client.delete(f"/api/v1/consent/{token}")
    assert delete_res.status_code == 200
    assert "erased" in delete_res.json()["message"].lower()

    # 4. Subsequent check-in should be blocked
    res2 = client.post("/api/v1/checkin", json=payload)
    assert res2.status_code == 403


def test_compliance_audit_ledger_is_populated():
    """
    Verifies that compliance audit ledger captures statutory events upon telemetry check-in.
    """
    payload = {
        "student_id_or_device": "22CH0015",
        "spatial_zone": "Hostel_A_Fl_1",
        "symptoms": ["vomiting"],
        "onset_bucket": "2-8h",
        "meal_location": "mess_1",
        "meal_item_tag": "Dal",
        "water_source": "floor_ro"
    }
    client.post("/api/v1/checkin", json=payload)

    res = client.get("/api/v1/consent/audit/ledger")
    assert res.status_code == 200
    ledger = res.json()
    assert isinstance(ledger, list)
    assert len(ledger) > 0
    assert "event_type" in ledger[0]
    assert ledger[0]["event_type"] == "TELEMETRY_INGESTION"
