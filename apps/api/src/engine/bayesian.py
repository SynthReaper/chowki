# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/engine/bayesian.py | Last Modified: 2026-08-22
# ============================================================

import math
import numpy as np
from typing import NamedTuple, Optional


SYMPTOM_KEYS = ["nausea", "vomiting", "diarrhea", "cramps", "fever"]

PATHOGEN_REFERENCE_PROFILES = {
    "staphylococcus_aureus": {
        "name": "Staphylococcus aureus (Enterotoxigenic)",
        "incubation_mean_h": 5.0,
        "incubation_std_h": 1.5,
        "symptom_vector": [1.0, 1.0, 0.2, 1.0, 0.1],
        "likely_vehicles": ["Palak Paneer", "Shahi Paneer", "Dairy Curds", "Cold Cream"],
        "base_risk": 0.85
    },
    "salmonella_spp": {
        "name": "Salmonella typhimurium / enterica",
        "incubation_mean_h": 16.0,
        "incubation_std_h": 4.0,
        "symptom_vector": [0.6, 0.4, 1.0, 0.8, 0.7],
        "likely_vehicles": ["Steamed Rice", "Raw Mint Chutney", "Gol Gappa Water", "Poultry"],
        "base_risk": 0.80
    },
    "bacillus_cereus": {
        "name": "Bacillus cereus (Diarrheal type)",
        "incubation_mean_h": 10.0,
        "incubation_std_h": 3.0,
        "symptom_vector": [0.5, 0.3, 1.0, 0.9, 0.2],
        "likely_vehicles": ["Ambient-Held Cooked Rice", "Dal Makhani", "Pasta"],
        "base_risk": 0.75
    },
    "norovirus": {
        "name": "Norovirus (Waterborne / Contact)",
        "incubation_mean_h": 24.0,
        "incubation_std_h": 6.0,
        "symptom_vector": [0.9, 1.0, 0.8, 0.6, 0.3],
        "likely_vehicles": ["Unchlorinated Water", "Salad", "Shared Utensils"],
        "base_risk": 0.78
    },
    "e_coli_stec": {
        "name": "Shiga Toxin-producing E. coli (STEC)",
        "incubation_mean_h": 48.0,
        "incubation_std_h": 12.0,
        "symptom_vector": [0.5, 0.4, 1.0, 1.0, 0.9],
        "likely_vehicles": ["Contaminated Borewell Water", "RO Sump Biofilm", "Raw Vegetables"],
        "base_risk": 0.90
    }
}


class BayesianAttributionResult(NamedTuple):
    outbreak_probability: float # Joint posterior probability that this is a real infectious outbreak
    top_pathogen: str
    top_pathogen_name: str
    pathogen_probabilities: dict[str, float]
    symptom_cosine_similarity: float
    incubation_delta_hours: float
    mess_hazard_score: float # M_k
    environmental_prior_boost: float # P_env
    is_infectious_outbreak: bool
    recommended_alert_level: int
    likely_vehicle: str


def compute_cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """
    Computes cosine similarity between two feature vectors.
    """
    a = np.array(vec_a, dtype=np.float64)
    b = np.array(vec_b, dtype=np.float64)
    
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def compute_gaussian_density(x: float, mean: float, std: float) -> float:
    """
    Evaluates univariate Gaussian probability density function.
    """
    if std <= 0:
        return 1.0 if x == mean else 0.0
    exponent = -0.5 * ((x - mean) / std) ** 2
    return (1.0 / (std * math.sqrt(2 * math.pi))) * math.exp(exponent)


def evaluate_cluster_causative_attribution(
    cluster_cases: list[dict],
    chlorine_mg_l: Optional[float] = None,
    turbidity_ntu: Optional[float] = None,
    pharmacy_spike_ratio: Optional[float] = None,
    high_risk_dishes_served: Optional[list[str]] = None
) -> BayesianAttributionResult:
    """
    Evaluates clinical and epidemiological parameters to distinguish genuine infectious outbreaks
    from coincidental stomach upsets.
    
    Args:
        cluster_cases: List of dicts representing cases in the cluster with symptoms, onset_bucket,
                       meal_location, meal_item_tag.
        chlorine_mg_l: Free residual chlorine sensor value at the connected RO sump.
        turbidity_ntu: Water turbidity measurement.
        pharmacy_spike_ratio: Ratio of current ORS/antiemetic sales over baseline.
        high_risk_dishes_served: High-risk dishes served in the associated mess meal.
    """
    if not cluster_cases:
        return BayesianAttributionResult(
            outbreak_probability=0.0,
            top_pathogen="none",
            top_pathogen_name="No Active Outbreak",
            pathogen_probabilities={},
            symptom_cosine_similarity=0.0,
            incubation_delta_hours=0.0,
            mess_hazard_score=0.0,
            environmental_prior_boost=0.0,
            is_infectious_outbreak=False,
            recommended_alert_level=0,
            likely_vehicle="None"
        )

    num_cases = len(cluster_cases)
    
    # 1. Calculate Aggregated Symptom Frequency Vector
    symptom_counts = {s: 0.0 for s in SYMPTOM_KEYS}
    for c in cluster_cases:
        s_list = c.get("symptoms", [])
        for s in s_list:
            s_clean = s.lower().strip()
            if s_clean in symptom_counts:
                symptom_counts[s_clean] += 1.0

    observed_symptom_vector = [symptom_counts[k] / max(num_cases, 1) for k in SYMPTOM_KEYS]

    # 2. Estimate Mean Incubation Delta (delta_t)
    # Map onset buckets to nominal hours: '<2h' -> 1.5h, '2-8h' -> 4.5h, '>8h' -> 16.0h
    bucket_map = {"<2h": 1.5, "2-8h": 4.5, ">8h": 16.0}
    deltas = [bucket_map.get(c.get("onset_bucket", "2-8h"), 4.5) for c in cluster_cases]
    mean_delta_t = float(np.mean(deltas))

    # 3. Compute Mess Exposure Hazard Metric (M_k)
    # Check what fraction of cases shared the same meal location or dish
    meal_locations = [c.get("meal_location") for c in cluster_cases if c.get("meal_location")]
    meal_items = [c.get("meal_item_tag") for c in cluster_cases if c.get("meal_item_tag")]
    
    if meal_locations:
        most_common_loc = max(set(meal_locations), key=meal_locations.count)
        loc_shared_count = meal_locations.count(most_common_loc)
        base_mk = loc_shared_count / num_cases
    else:
        base_mk = 0.1

    # Boost M_k if high-risk items like Paneer or raw chutney were consumed
    high_risk_boost = 1.0
    if meal_items:
        most_common_item = max(set(meal_items), key=meal_items.count)
        if high_risk_dishes_served:
            for dish in high_risk_dishes_served:
                if dish.lower() in most_common_item.lower():
                    high_risk_boost = 1.4
                    break
    else:
        most_common_item = "Unknown Dish"

    mk_score = min(1.0, base_mk * high_risk_boost)

    # 4. Environmental & Pharmacy Telemetry Prior Probability Boost (P_env)
    p_env = 0.20 # Baseline prior
    
    if chlorine_mg_l is not None and chlorine_mg_l < 0.20:
        p_env += 0.40 # Significant drop in disinfectant chlorine
    elif chlorine_mg_l is not None and chlorine_mg_l < 0.40:
        p_env += 0.15

    if turbidity_ntu is not None and turbidity_ntu > 4.0:
        p_env += 0.20 # Particulate turbidity spike

    if pharmacy_spike_ratio is not None and pharmacy_spike_ratio > 2.0:
        p_env += 0.30 # Over 200% spike in ORS/antiemetic OTC sales
    elif pharmacy_spike_ratio is not None and pharmacy_spike_ratio > 1.4:
        p_env += 0.15

    p_env = min(1.0, p_env)

    # 5. Pathogen Bayesian Likelihood Evaluation
    unnormalized_probs = {}
    cosine_sims = {}

    for p_id, profile in PATHOGEN_REFERENCE_PROFILES.items():
        # A. Clinical Profile Match (Cosine Similarity)
        cos_sim = compute_cosine_similarity(observed_symptom_vector, profile["symptom_vector"])
        cosine_sims[p_id] = cos_sim

        # B. Temporal Alignment (Incubation PDF)
        inc_prob = compute_gaussian_density(
            mean_delta_t,
            profile["incubation_mean_h"],
            profile["incubation_std_h"]
        )
        
        # Scaling incubation density to normalized [0, 1] range
        max_density = compute_gaussian_density(profile["incubation_mean_h"], profile["incubation_mean_h"], profile["incubation_std_h"])
        normalized_inc = (inc_prob / max(max_density, 1e-6))

        # C. Combined Likelihood
        w_mk = 0.55
        w_env = 0.45
        exposure_factor = (w_mk * mk_score) + (w_env * p_env)

        score = (cos_sim * 0.45) + (normalized_inc * 0.35) + (exposure_factor * 0.20)
        unnormalized_probs[p_id] = max(0.001, score)

    # Normalize posterior distribution across pathogens
    total_score = sum(unnormalized_probs.values())
    normalized_pathogen_probs = {
        p_id: float(round(score / total_score, 4))
        for p_id, score in unnormalized_probs.items()
    }

    # Find Top Pathogen
    top_pathogen_id = max(normalized_pathogen_probs, key=normalized_pathogen_probs.get)
    top_profile = PATHOGEN_REFERENCE_PROFILES[top_pathogen_id]
    best_cos_sim = cosine_sims[top_pathogen_id]

    # 6. Overall Outbreak Probability vs Coincidental Indigestion
    # For a real outbreak: high symptom similarity (>0.70) AND high shared exposure OR incubation alignment
    raw_outbreak_confidence = (
        (best_cos_sim * 0.40) +
        (mk_score * 0.35) +
        (p_env * 0.25)
    )
    outbreak_prob = float(round(min(0.99, max(0.05, raw_outbreak_confidence)), 3))

    is_outbreak = outbreak_prob >= 0.70

    # Determine recommended alert level
    if not is_outbreak or num_cases < 3:
        alert_level = 0
    elif num_cases < 5 and outbreak_prob < 0.80:
        alert_level = 1
    elif num_cases >= 5 or outbreak_prob >= 0.80:
        alert_level = 2
        if num_cases >= 12 or p_env > 0.70:
            alert_level = 3
    else:
        alert_level = 1

    likely_vehicle = top_profile["likely_vehicles"][0]
    if most_common_item and most_common_item != "Unknown Dish":
        likely_vehicle = f"{most_common_item} ({likely_vehicle})"

    return BayesianAttributionResult(
        outbreak_probability=outbreak_prob,
        top_pathogen=top_pathogen_id,
        top_pathogen_name=top_profile["name"],
        pathogen_probabilities=normalized_pathogen_probs,
        symptom_cosine_similarity=float(round(best_cos_sim, 3)),
        incubation_delta_hours=float(round(mean_delta_t, 1)),
        mess_hazard_score=float(round(mk_score, 3)),
        environmental_prior_boost=float(round(p_env, 3)),
        is_infectious_outbreak=is_outbreak,
        recommended_alert_level=alert_level,
        likely_vehicle=likely_vehicle
    )
