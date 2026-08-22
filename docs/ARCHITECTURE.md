# ARCHITECTURE.md — Project CHOWKI System Architecture
## *Continuous Health Observation and Water-Kitchen Intelligence*
> **Attribution**: Made by Synthreaper | github.com/synthreaper/chowki | Version 1.0.0

---

## 1. HIGH-LEVEL SYSTEM ARCHITECTURE

```
+-----------------------------------------------------------------------------------+
|                            MULTI-CHANNEL INGESTION LAYER                          |
|  +---------------------+  +---------------------+  +----------------------------+ |
|  | Student Web Pulse   |  | Campus Pharmacy POS |  | Inline Water IoT Sensors   | |
|  | (15-Sec Bilingual)  |  | (ORS / Antiemetic)  |  | (Chlorine, Turbidity, Flow)| |
|  +----------+----------+  +----------+----------+  +-------------+--------------+ |
+-------------|------------------------|---------------------------|----------------+
              |                        |                           |
              v                        v                           v
+-----------------------------------------------------------------------------------+
|               EDGE CRYPTOGRAPHIC PSEUDONYMIZATION & CONSENT GATE                  |
|  - Salted Rotating Hash: HMAC-SHA256(Student_ID, Salt_weekly)                     |
|  - DPDP Act 2023 Consent Verification (Sec 6) & Spatial k-Anonymity (k >= 5)      |
+--------------------------------------+--------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                   DUAL-ENGINE EPIDEMIOLOGICAL DISAMBIGUATION                      |
|                                                                                   |
|  +-------------------------------------+   +------------------------------------+ |
|  | TIER 1: STPSS SCAN STATISTICS       |   | TIER 2: MULTI-PARAMETRIC BAYESIAN  | |
|  | - 4-Hour Temporal Sliding Bins      |   | - Symptom Cosine Match (S_match)   | |
|  | - Poisson Marginal Baseline mu_zt   |   | - Incubation Gaussian PDF (Delta t)| |
|  | - Poisson LLR Formulation           |   | - Mess Exposure Odds Ratio (OR)    | |
|  | - Monte Carlo Permutations (N=999)  |   | - IoT Chlorine / Sump Prior        | |
|  | - Output: Empirical p-value & RR    |   | - Output: Pathogen Probability %   | |
|  +------------------+------------------+   +-----------------+------------------+ |
+---------------------|----------------------------------------|--------------------+
                      +-------------------+--------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        5 ROLE-TAILORED OPERATIONAL HUBS                           |
|                                                                                   |
|   +-------------------+  +-------------------+  +------------------------------+  |
|   | 1. Grand Jury     |  | 2. CMO War Room   |  | 3. Hostel Warden Hub         |  |
|   | - Poisson Overlay |  | - Macro GIS Radar |  | - Live Resident Pulse Stream |  |
|   | - Truth Table Lab |  | - Odds Ratio Matrix| - Doorstep ORS Delivery Roster|  |
|   | - 17 Unit Tests   |  | - 1-Click Lockdown|  | - Chemical Test Strip Logger |  |
|   +-------------------+  +-------------------+  +------------------------------+  |
|                                                                                   |
|   +--------------------------------------+  +----------------------------------+  |
|   | 4. Dining Hall & HACCP Lead          |  | 5. Student Resident Pulse        |  |
|   | - Bain-Marie Thermal Danger Zones    |  | - 15-Second Health Telemetry     |  |
|   | - Dish Risk Multipliers (Paneer)     |  | - Dehydration Severity Triage    |  |
|   | - 1-Click Recipe Quarantine          |  | - Free ORS Dispensary Locator    |  |
|   +--------------------------------------+  +----------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. MATHEMATICAL & ALGORITHMIC SPECIFICATIONS

### 2.1 Tier 1: Space-Time Permutation Scan Statistics (STPSS)
1. **Marginal Expected Baseline**:
   $$\mu_{zt} = \frac{C_z \cdot C_t}{C}$$
   Where $C_z$ is the total case count in spatial zone $z$, $C_t$ is the case count in temporal bin $t$, and $C$ is the total observed cases across the campus in the sliding scan window.

2. **Poisson Generalized Log-Likelihood Ratio**:
   $$LLR(A) = \left[ c_A \ln\left(\frac{c_A}{\mu_A}\right) + (C - c_A) \ln\left(\frac{C - c_A}{C - \mu_A}\right) \right] \cdot \mathbb{I}[c_A > \mu_A]$$

3. **Monte Carlo Permutation Testing**:
   - Executes $N=999$ permutations of $(z, t)$ pairs under the null hypothesis $H_0$ of conditional space-time independence.
   - Empirical statistical significance:
     $$p = \frac{n_{\ge} + 1}{N + 1}$$
   - An institutional alert is strictly prohibited unless $p < 0.05$.

### 2.2 Tier 2: Multi-Parametric Bayesian Pathogen Attribution
$$P(\text{Pathogen}_i \mid \text{Evidence}) \propto P(\text{Pathogen}_i) \cdot P(\Delta t \mid \text{Pathogen}_i) \cdot S_{match, i} \cdot (w_{Mk} \cdot M_k + w_{env} \cdot P_{env})$$

- **Incubation Fitting**: Gaussian PDF $P(\Delta t \mid \text{Pathogen}_i) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(\Delta t - \mu_i)^2}{2\sigma_i^2}\right)$.
  - *S. aureus*: $\mu=3.5\text{h}, \sigma=1.2\text{h}$ (Toxigenic Food).
  - *B. cereus*: $\mu=2.0\text{h}, \sigma=1.0\text{h}$ (Emetic Rice).
  - *Salmonella*: $\mu=16.0\text{h}, \sigma=4.0\text{h}$ (Infectious Meat/Eggs).
  - *Norovirus*: $\mu=24.0\text{h}, \sigma=6.0\text{h}$ (Waterborne).

---

## 3. ZERO-TRUST SECURITY & DPDP ACT 2023 COMPLIANCE

1. **Client-Edge Pseudonymization**:
   - `token = HMAC_SHA256(student_roll_id, weekly_salt)[:16]`
   - Raw roll numbers are NEVER persisted to PostgreSQL or SQLite disks.
2. **$k$-Anonymity Spatial Aggregation ($k \ge 5$)**:
   - Heatmap queries and corridor cluster reports require $n \ge 5$ distinct pseudonym tokens before spatial reporting is rendered.
3. **Statutory Consent Revocation (Section 8(7))**:
   - When a data principal requests deletion, `DELETE FROM checkins WHERE token = :token` and `DELETE FROM consent_records WHERE token = :token` execute in an atomic transaction.
4. **Append-Only Cryptographic Audit Ledger**:
   - All containment directives, data queries, and ingestion events are logged with timestamp, actor role, and SHA-256 hash chains.
