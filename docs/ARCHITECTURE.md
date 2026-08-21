# ARCHITECTURE.md — Project CHOWKI System Architecture
## *Continuous Health Observation and Water-Kitchen Intelligence*
> **Attribution**: Made by Synthreaper | github.com/synthreaper/chowki | Version 1.0.0

---

## 1. HIGH-LEVEL ARCHITECTURE OVERVIEW

```
+-----------------------------------------------------------------------------------+
|                            MULTI-CHANNEL INGESTION LAYER                          |
|  +---------------------+  +---------------------+  +----------------------------+ |
|  | Student Web Portal  |  | Campus Pharmacy POS |  | Inline Water IoT Sensors   | |
|  | & WhatsApp Bot (15s)|  | (ORS / Antiemetic)  |  | (Chlorine, Turbidity, Flow)| |
|  +----------+----------+  +----------+----------+  +-------------+--------------+ |
+-------------|------------------------|---------------------------|----------------+
              |                        |                           |
              v                        v                           v
+-----------------------------------------------------------------------------------+
|               EDGE CRYPTOGRAPHIC PSEUDONYMIZATION & CONSENT GATE                  |
|  - Salted Weekly Rotating Hash: HMAC-SHA256(Roll, Salt_w)                         |
|  - DPDP Act 2023 Consent Verification & Spatial Aggregation (k >= 5)              |
+--------------------------------------+--------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                   DUAL-ENGINE EPIDEMIOLOGICAL DISAMBIGUATION                      |
|                                                                                   |
|  +-------------------------------------+   +------------------------------------+ |
|  | TIER 1: STPSS SCAN STATISTICS       |   | TIER 2: MULTI-PARAMETRIC BAYESIAN  | |
|  | - 4-Hour Temporal Sliding Bins      |   | - Symptom Cosine Match (S_match)   | |
|  | - Marginal Baseline mu_A            |   | - Incubation Gaussian PDF (Delta t)| |
|  | - Poisson LLR Formulation           |   | - Mess Exposure Hazard (M_k)       | |
|  | - Monte Carlo Permutations (N=999)  |   | - IoT Chlorine / Pharmacy Prior    | |
|  | - Output: Empirical p-value & RR    |   | - Output: Pathogen Probability %   | |
|  +------------------+------------------+   +-----------------+------------------+ |
+---------------------|----------------------------------------|--------------------+
                      +-------------------+--------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                         ROLE-GATED TACTICAL SURVEILLANCE                          |
|                                                                                   |
|   +-------------------+  +-------------------+  +------------------------------+  |
|   | CMO Live Radar    |  | Hostel Warden     |  | Mess Dining Hall             |  |
|   | - Spatial Heatmap |  | - Containment SOP |  | - Food Hazard Tagging        |  |
|   | - 72h Epi Curve   |  | - RO Valve Lock   |  | - 1-Click Dish Quarantine    |  |
|   | - 1-Click Actions |  | - Bleach Log      |  |                              |  |
|   +-------------------+  +-------------------+  +------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. DUAL-ENGINE MATHEMATICAL SPECIFICATION

### 2.1 Tier 1: Space-Time Permutation Scan Statistics (STPSS)
1. **Marginal Expected Baseline**:
   $$\mu_A = \frac{C_z \cdot C_t}{C}$$
2. **Poisson Generalized Log-Likelihood Ratio**:
   $$LLR(A) = \left[ c_A \ln\left(\frac{c_A}{\mu_A}\right) + (C - c_A) \ln\left(\frac{C - c_A}{C - \mu_A}\right) \right] \cdot \mathbb{I}[c_A > \mu_A]$$
3. **Monte Carlo Significance Testing**: $N=999$ permutations of $(z, t)$ records under $H_0$ conditional independence. Empirical $p = (n_{\ge} + 1) / (N + 1)$.

### 2.2 Tier 2: Multi-Parametric Bayesian Attribution
$$P(\text{Pathogen}_i \mid \text{Evidence}) \propto P(\Delta t \mid \text{Pathogen}_i) \cdot S_{match, i} \cdot (w_{Mk} \cdot M_k + w_{env} \cdot P_{env})$$
- Distinguishes acute toxigenic food poisoning (*S. aureus*, $\mu=5.0\text{h}$) from waterborne pathogens (*Norovirus*, $\mu=24.0\text{h}$) and coincidental background stress ($P < 20\%$).
