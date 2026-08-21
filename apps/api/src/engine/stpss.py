# ============================================================
# Project CHOWKI — Campus Outbreak Surveillance System
# Made by Synthreaper | github.com/synthreaper/chowki
# File: apps/api/src/engine/stpss.py | Last Modified: 2026-08-22
# ============================================================

import numpy as np
from typing import NamedTuple


class StpssCandidateCluster(NamedTuple):
    zone: str
    temporal_bin: str
    observed_cases: int
    expected_cases: float
    llr: float
    p_value: float
    relative_risk: float
    is_significant: bool


def calculate_poisson_llr(c_A: float, mu_A: float, C_total: float) -> float:
    """
    Computes the Poisson Generalized Log-Likelihood Ratio for a space-time cylinder.
    Formula:
      LLR = [c_A * ln(c_A / mu_A) + (C - c_A) * ln((C - c_A) / (C - mu_A))] * I[c_A > mu_A]
    """
    if c_A <= mu_A or mu_A <= 0 or C_total <= 0:
        return 0.0
    if c_A >= C_total:
        return float(c_A * np.log(c_A / mu_A))

    term1 = c_A * np.log(c_A / mu_A)
    term2 = (C_total - c_A) * np.log(max((C_total - c_A) / max(C_total - mu_A, 1e-6), 1e-6))
    llr = term1 + term2
    return float(max(0.0, llr))


def run_stpss_scan(
    case_records: list[dict],
    monte_carlo_runs: int = 999,
    p_threshold: float = 0.05,
    min_cluster_cases: int = 2
) -> list[StpssCandidateCluster]:
    """
    Executes Space-Time Permutation Scan Statistics (STPSS) over observed case records.
    Applies minimum cluster case threshold to eliminate single sporadic background cases.
    
    Args:
        case_records: List of dicts with keys 'zone' and 'temporal_bin'.
        monte_carlo_runs: Number of random permutations for empirical p-value testing.
        p_threshold: Significance alpha level (default 0.05).
        min_cluster_cases: Minimum cases in cylinder to qualify as a cluster (default 2).
        
    Returns:
        List of StpssCandidateCluster objects sorted by highest LLR and case count.
    """
    if not case_records or len(case_records) < 2:
        return []

    # 1. Extract unique zones and temporal bins
    zones = sorted(list(set(r["zone"] for r in case_records)))
    bins = sorted(list(set(r["temporal_bin"] for r in case_records)))
    
    zone_idx = {z: i for i, z in enumerate(zones)}
    bin_idx = {b: i for i, b in enumerate(bins)}
    
    num_zones = len(zones)
    num_bins = len(bins)
    
    # 2. Build 2D Case Count Matrix (Zone x TemporalBin)
    count_matrix = np.zeros((num_zones, num_bins), dtype=np.float64)
    for r in case_records:
        z = zone_idx[r["zone"]]
        b = bin_idx[r["temporal_bin"]]
        count_matrix[z, b] += 1.0

    C_total = float(len(case_records))
    if C_total == 0:
        return []

    # Marginal totals
    C_z = count_matrix.sum(axis=1) # Total cases per zone
    C_t = count_matrix.sum(axis=0) # Total cases per time bin

    # Expected count under null hypothesis H0: mu_A = (C_z * C_t) / C
    expected_matrix = np.outer(C_z, C_t) / C_total

    # 3. Calculate observed LLR for candidate cylinders with >= min_cluster_cases
    observed_llr_matrix = np.zeros((num_zones, num_bins), dtype=np.float64)
    for z in range(num_zones):
        for b in range(num_bins):
            c_A = count_matrix[z, b]
            mu_A = expected_matrix[z, b]
            if c_A >= min_cluster_cases and c_A > mu_A:
                observed_llr_matrix[z, b] = calculate_poisson_llr(c_A, mu_A, C_total)

    # 4. Monte Carlo Hypothesis Permutations
    zone_array = np.array([zone_idx[r["zone"]] for r in case_records], dtype=np.int32)
    bin_array = np.array([bin_idx[r["temporal_bin"]] for r in case_records], dtype=np.int32)
    
    max_sim_llrs = np.zeros(monte_carlo_runs, dtype=np.float64)
    rng = np.random.default_rng(seed=42)

    for sim in range(monte_carlo_runs):
        shuffled_bins = rng.permutation(bin_array)
        sim_counts = np.zeros((num_zones, num_bins), dtype=np.float64)
        np.add.at(sim_counts, (zone_array, shuffled_bins), 1.0)
        
        max_sim_llr = 0.0
        for z in range(num_zones):
            for b in range(num_bins):
                sim_cA = sim_counts[z, b]
                mu_A = expected_matrix[z, b]
                if sim_cA >= min_cluster_cases and sim_cA > mu_A:
                    llr = calculate_poisson_llr(sim_cA, mu_A, C_total)
                    if llr > max_sim_llr:
                        max_sim_llr = llr
                        
        max_sim_llrs[sim] = max_sim_llr

    # 5. Build results list
    results: list[StpssCandidateCluster] = []
    
    for z in range(num_zones):
        for b in range(num_bins):
            c_A = count_matrix[z, b]
            mu_A = expected_matrix[z, b]
            llr = observed_llr_matrix[z, b]
            
            if c_A < min_cluster_cases:
                continue

            # Empirical p-value
            p_val = float((np.sum(max_sim_llrs >= llr) + 1.0) / (monte_carlo_runs + 1.0))
            
            # Relative Risk inside cylinder vs outside
            denom_c = C_total - c_A
            denom_mu = C_total - mu_A
            if denom_c > 0 and denom_mu > 0 and mu_A > 0:
                rr = float((c_A / mu_A) / (denom_c / denom_mu))
            else:
                rr = float(c_A / max(mu_A, 0.001))

            is_sig = bool((p_val < p_threshold) and (llr > 0.4))

            results.append(
                StpssCandidateCluster(
                    zone=zones[z],
                    temporal_bin=bins[b],
                    observed_cases=int(c_A),
                    expected_cases=float(round(mu_A, 2)),
                    llr=float(round(llr, 3)),
                    p_value=float(round(p_val, 4)),
                    relative_risk=float(round(rr, 2)),
                    is_significant=is_sig
                )
            )

    # Sort results by highest case count and LLR
    results.sort(key=lambda x: (x.llr, x.observed_cases), reverse=True)
    return results
