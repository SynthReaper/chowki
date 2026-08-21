# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/schemas/radar.py | Last Modified: 2026-08-22
# ============================================================

from typing import Optional
from pydantic import BaseModel, Field


class ZoneStatusSummary(BaseModel):
    zone_token: str
    display_name: str
    zone_type: str
    alert_level: int
    case_count: int
    is_hotspot: bool


class EpiCurvePoint(BaseModel):
    time_bin: str
    label: str
    case_count: int
    point_source_expected: float
    continuous_expected: float


class ClusterDetail(BaseModel):
    cluster_id: str
    zone: str
    zone_name: str
    case_count: int
    expected_count: float
    llr: float
    p_value: float
    relative_risk: float
    alert_level: int
    outbreak_probability: float
    top_pathogen: str
    top_pathogen_name: str
    pathogen_probabilities: dict[str, float]
    incubation_delta_hours: float
    likely_vehicle: str
    mess_hazard_score: float
    environmental_boost: float
    detected_at: str


class RadarLiveResponse(BaseModel):
    system_status: str
    total_reports_24h: int
    active_clusters_count: int
    primary_risk_zone: Optional[str]
    highest_alert_level: int
    zones: list[ZoneStatusSummary]
    clusters: list[ClusterDetail]
    epi_curve: list[EpiCurvePoint]
    last_updated: str
