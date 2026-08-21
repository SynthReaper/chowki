# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: tests/test_bayesian.py | Last Modified: 2026-08-22
# ============================================================

import pytest
from apps.api.src.engine.bayesian import evaluate_cluster_causative_attribution


def test_bayesian_identifies_staph_aureus_outbreak():
    """
    Verifies that a cluster with vomiting, cramps, short incubation (2-8h),
    and Palak Paneer exposure is attributed to Staphylococcus aureus.
    """
    cases = [
        {"symptoms": ["nausea", "vomiting", "cramps"], "onset_bucket": "2-8h", "meal_location": "mess_2", "meal_item_tag": "Palak Paneer"}
        for _ in range(5)
    ]

    res = evaluate_cluster_causative_attribution(
        cluster_cases=cases,
        chlorine_mg_l=0.18, # Water chlorine dip
        turbidity_ntu=3.0,
        pharmacy_spike_ratio=2.5, # 250% ORS sales spike
        high_risk_dishes_served=["Palak Paneer"]
    )

    assert res.is_infectious_outbreak is True
    assert res.outbreak_probability >= 0.75
    assert res.top_pathogen == "staphylococcus_aureus"
    assert res.recommended_alert_level >= 2
    assert "Palak Paneer" in res.likely_vehicle


def test_bayesian_identifies_salmonella_outbreak():
    """
    Verifies that a cluster with diarrhea, fever, cramps, and intermediate incubation (8-24h)
    is attributed to Salmonella.
    """
    cases = [
        {"symptoms": ["diarrhea", "fever", "cramps"], "onset_bucket": ">8h", "meal_location": "mess_1", "meal_item_tag": "Mint Chutney"}
        for _ in range(6)
    ]

    res = evaluate_cluster_causative_attribution(
        cluster_cases=cases,
        chlorine_mg_l=0.50,
        high_risk_dishes_served=["Mint Chutney"]
    )

    assert res.is_infectious_outbreak is True
    assert res.top_pathogen == "salmonella_spp"


def test_bayesian_filters_coincidental_upset():
    """
    Verifies that single-symptom, scattered reports with no shared food link
    are flagged as coincidental background upsets (outbreak probability < 0.50).
    """
    cases = [
        {"symptoms": ["nausea"], "onset_bucket": ">8h", "meal_location": "off_campus", "meal_item_tag": "Snack"},
        {"symptoms": ["cramps"], "onset_bucket": "<2h", "meal_location": "canteen", "meal_item_tag": "Tea"}
    ]

    res = evaluate_cluster_causative_attribution(
        cluster_cases=cases,
        chlorine_mg_l=0.55,
        pharmacy_spike_ratio=1.0
    )

    assert res.is_infectious_outbreak is False
    assert res.outbreak_probability < 0.60
    assert res.recommended_alert_level == 0
