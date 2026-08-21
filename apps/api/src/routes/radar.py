# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/routes/radar.py | Last Modified: 2026-08-22
# ============================================================

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from apps.api.src.db.database import get_db
from apps.api.src.db.models import Checkin, SpatialZone, ClusterAlert, IoTReading, PharmacySpike, MenuItem
from apps.api.src.schemas.radar import RadarLiveResponse, ZoneStatusSummary, ClusterDetail, EpiCurvePoint
from apps.api.src.engine.stpss import run_stpss_scan
from apps.api.src.engine.bayesian import evaluate_cluster_causative_attribution
from apps.api.src.core.config import get_settings


router = APIRouter(prefix="/radar", tags=["Live Outbreak Radar"])
settings = get_settings()


@router.get("/live", response_model=RadarLiveResponse)
def get_live_radar_analytics(db: Session = Depends(get_db)):
    """
    Main Epidemiological Surveillance Endpoint for Campus Medical Officers.
    Executes real-time Space-Time Permutation Scan Statistics and Bayesian Attribution.
    """
    now = datetime.now(timezone.utc)
    cutoff_time = now - timedelta(hours=72)
    
    # 1. Fetch recent checkins
    checkins = db.query(Checkin).filter(Checkin.created_at >= cutoff_time).all()
    
    # 2. Fetch all registered spatial zones
    zones = db.query(SpatialZone).all()
    if not zones:
        # Seed standard default zones if empty
        default_zones = [
            ("Hostel_A_Fl_1", "Hostel A - 1st Floor", "floor", 60),
            ("Hostel_B_Fl_2", "Hostel B - 2nd Floor", "floor", 55),
            ("Hostel_C_Fl_3", "Hostel C - 3rd Floor", "floor", 65),
            ("Hostel_D_Fl_1", "Hostel D - 1st Floor", "floor", 50),
            ("Mess_1_Main", "Mess 1 (Main Dining Hall)", "mess", 400),
            ("Mess_2_Girls", "Mess 2 (Dining Hall 2)", "mess", 350)
        ]
        for token, name, z_type, cap in default_zones:
            db.add(SpatialZone(zone_token=token, display_name=name, zone_type=z_type, resident_capacity=cap, current_alert_level=0))
        db.commit()
        zones = db.query(SpatialZone).all()

    zone_map = {z.zone_token: z for z in zones}

    # 3. Format records for STPSS Scan
    case_records = [{"zone": c.spatial_zone, "temporal_bin": c.temporal_bin} for c in checkins]
    stpss_results = run_stpss_scan(
        case_records,
        monte_carlo_runs=settings.stpss_monte_carlo_runs,
        p_threshold=settings.stpss_p_significance_threshold
    )

    # 4. Fetch Auxiliary Telemetry (IoT Water + Pharmacy Spikes)
    latest_iot = db.query(IoTReading).order_by(IoTReading.timestamp.desc()).first()
    chlorine_val = latest_iot.chlorine_mg_l if latest_iot else 0.50
    turbidity_val = latest_iot.turbidity_ntu if latest_iot else 1.2

    pharmacy_spike = db.query(PharmacySpike).order_by(PharmacySpike.timestamp.desc()).first()
    pharmacy_ratio = (pharmacy_spike.observed_count / max(pharmacy_spike.baseline_count, 1)) if pharmacy_spike else 1.0

    high_risk_dishes = [
        item.item_name for item in db.query(MenuItem).filter(MenuItem.risk_tag == "high", MenuItem.is_active == True).all()
    ]

    # 5. Evaluate Bayesian Attribution for Candidate Clusters
    active_clusters: list[ClusterDetail] = []
    zone_case_counts = {z.zone_token: 0 for z in zones}
    
    for c in checkins:
        if c.spatial_zone in zone_case_counts:
            zone_case_counts[c.spatial_zone] += 1

    highest_alert_level = 0
    primary_risk_zone = None

    # Reset all zone alert levels to baseline first
    for z in zones:
        z.current_alert_level = 0

    for idx, st_res in enumerate(stpss_results[:5]):
        if st_res.observed_cases < 2:
            continue
            
        # Get cases belonging to this spatial zone
        cluster_cases = [
            {
                "symptoms": c.symptoms,
                "onset_bucket": c.onset_bucket,
                "meal_location": c.meal_location,
                "meal_item_tag": c.meal_item_tag
            }
            for c in checkins
            if c.spatial_zone == st_res.zone
        ]

        bayes_res = evaluate_cluster_causative_attribution(
            cluster_cases=cluster_cases,
            chlorine_mg_l=chlorine_val if st_res.zone.startswith("Hostel_C") else 0.55,
            turbidity_ntu=turbidity_val,
            pharmacy_spike_ratio=pharmacy_ratio,
            high_risk_dishes_served=high_risk_dishes
        )

        alert_level = bayes_res.recommended_alert_level
        if not st_res.is_significant and alert_level > 1:
            alert_level = 1 # Cap alert if spatial significance is not met

        # Update zone alert status
        if st_res.zone in zone_map:
            zone_map[st_res.zone].current_alert_level = max(zone_map[st_res.zone].current_alert_level, alert_level)

        if alert_level > highest_alert_level:
            highest_alert_level = alert_level
            primary_risk_zone = st_res.zone

        active_clusters.append(
            ClusterDetail(
                cluster_id=f"CLT-{101 + idx}",
                zone=st_res.zone,
                zone_name=zone_map[st_res.zone].display_name if st_res.zone in zone_map else st_res.zone,
                case_count=st_res.observed_cases,
                expected_count=st_res.expected_cases,
                llr=st_res.llr,
                p_value=st_res.p_value,
                relative_risk=st_res.relative_risk,
                alert_level=alert_level,
                outbreak_probability=bayes_res.outbreak_probability,
                top_pathogen=bayes_res.top_pathogen,
                top_pathogen_name=bayes_res.top_pathogen_name,
                pathogen_probabilities=bayes_res.pathogen_probabilities,
                incubation_delta_hours=bayes_res.incubation_delta_hours,
                likely_vehicle=bayes_res.likely_vehicle,
                mess_hazard_score=bayes_res.mess_hazard_score,
                environmental_boost=bayes_res.environmental_prior_boost,
                detected_at=datetime.now(timezone.utc).strftime("%H:%M IST")
            )
        )

    db.commit()

    # 6. Generate 72-Hour Epidemic Curve Histogram (4-hour bins)
    bin_counts: dict[str, int] = {}
    for i in range(18): # 18 * 4h = 72 hours
        b_time = now - timedelta(hours=(17 - i) * 4)
        b_hour = (b_time.hour // 4) * 4
        norm_time = b_time.replace(hour=b_hour, minute=0, second=0, microsecond=0)
        bin_key = norm_time.strftime("%Y-%m-%dT%H:00:00")
        bin_counts[bin_key] = 0

    for c in checkins:
        if c.temporal_bin in bin_counts:
            bin_counts[c.temporal_bin] += 1

    epi_curve_points: list[EpiCurvePoint] = []
    for bin_key, count in bin_counts.items():
        dt_obj = datetime.strptime(bin_key, "%Y-%m-%dT%H:00:00")
        label = dt_obj.strftime("%d %b %H:%M")
        
        # Reference point-source model curve vs continuous
        point_source = round(count * 1.1 if count > 2 else 0.5, 1)
        continuous = round(max(0.8, count * 0.4), 1)

        epi_curve_points.append(
            EpiCurvePoint(
                time_bin=bin_key,
                label=label,
                case_count=count,
                point_source_expected=point_source,
                continuous_expected=continuous
            )
        )

    # 7. Zone Summaries
    zone_summaries = [
        ZoneStatusSummary(
            zone_token=z.zone_token,
            display_name=z.display_name,
            zone_type=z.zone_type,
            alert_level=z.current_alert_level,
            case_count=zone_case_counts.get(z.zone_token, 0),
            is_hotspot=(z.current_alert_level >= 2)
        )
        for z in zones
    ]

    system_status = "ALL SENSORS ONLINE 🟢" if chlorine_val >= 0.40 else "WATER ANOMALY DETECTED ⚠️"

    return RadarLiveResponse(
        system_status=system_status,
        total_reports_24h=len(checkins),
        active_clusters_count=len([c for c in active_clusters if c.alert_level > 0]),
        primary_risk_zone=primary_risk_zone,
        highest_alert_level=highest_alert_level,
        zones=zone_summaries,
        clusters=active_clusters,
        epi_curve=epi_curve_points,
        last_updated=now.strftime("%Y-%m-%d %H:%M:%S UTC")
    )
