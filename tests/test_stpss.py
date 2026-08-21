# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: tests/test_stpss.py | Last Modified: 2026-08-22
# ============================================================

import pytest
from apps.api.src.engine.stpss import calculate_poisson_llr, run_stpss_scan


def test_poisson_llr_calculation():
    """
    Verifies Poisson Log-Likelihood Ratio mathematical properties.
    """
    # When observed <= expected, LLR should be 0.0
    assert calculate_poisson_llr(c_A=2, mu_A=3.5, C_total=20) == 0.0
    assert calculate_poisson_llr(c_A=0, mu_A=1.0, C_total=20) == 0.0

    # When observed significantly exceeds expected, LLR should be positive
    llr = calculate_poisson_llr(c_A=6, mu_A=1.0, C_total=20)
    assert llr > 4.0


def test_stpss_detects_concentrated_outbreak_cluster():
    """
    Simulates a realistic campus environment (24 total cases over 48h across 4 blocks).
    Hostel Block C has a sudden spike of 6 cases in a single 4-hour window (20:00).
    STPSS should flag this cylinder with p < 0.05 and high LLR.
    """
    records = []
    
    # 6 cases tightly clustered in Hostel_C_Fl_3 in target bin T_20
    for _ in range(6):
        records.append({"zone": "Hostel_C_Fl_3", "temporal_bin": "2026-08-22T20:00:00"})

    # 18 baseline cases dispersed across 4 blocks and multiple time windows
    background_zones = ["Hostel_A_Fl_1", "Hostel_B_Fl_2", "Hostel_D_Fl_1"]
    time_windows = [
        "2026-08-21T08:00:00", "2026-08-21T12:00:00", "2026-08-21T16:00:00",
        "2026-08-21T20:00:00", "2026-08-22T08:00:00", "2026-08-22T12:00:00"
    ]
    
    for z in background_zones:
        for t in time_windows:
            records.append({"zone": z, "temporal_bin": t})

    results = run_stpss_scan(records, monte_carlo_runs=299, p_threshold=0.05)
    
    assert len(results) > 0
    top_cluster = results[0]
    
    assert top_cluster.zone == "Hostel_C_Fl_3"
    assert top_cluster.temporal_bin == "2026-08-22T20:00:00"
    assert top_cluster.observed_cases == 6
    assert top_cluster.llr > 3.0
    assert top_cluster.p_value < 0.05
    assert top_cluster.is_significant is True


def test_stpss_rejects_uniform_coincidental_scatter():
    """
    Simulates scattered cases uniformly distributed across space and time.
    STPSS should determine that no spatial cluster reaches significance.
    """
    records = [
        {"zone": "Hostel_A_Fl_1", "temporal_bin": "2026-08-21T08:00:00"},
        {"zone": "Hostel_B_Fl_2", "temporal_bin": "2026-08-21T16:00:00"},
        {"zone": "Hostel_C_Fl_3", "temporal_bin": "2026-08-22T04:00:00"},
        {"zone": "Hostel_D_Fl_1", "temporal_bin": "2026-08-22T12:00:00"},
    ]

    results = run_stpss_scan(records, monte_carlo_runs=199, p_threshold=0.05)
    
    # None of the single, scattered cases should be statistically significant
    for cluster in results:
        assert cluster.is_significant is False
