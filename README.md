# 🚨 Project CHOWKI
### *Continuous Health Observation and Water-Kitchen Intelligence*
#### Bio-Spatiotemporal Micro-Outbreak Early Warning & Surgical Containment Suite for Indian Educational Campuses

[![Tests](https://img.shields.io/badge/pytest-17%20passed%20(91%25%20cov)-brightgreen)](#-automated-testing--code-quality)
[![DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP%20Act%202023%20Sec%208(7)-blue)](#-dpdp-act-2023-privacy--zero-knowledge-architecture)
[![Engine](https://img.shields.io/badge/AI%20Engine-Poisson%20STPSS%20(N%3D999)%20%2B%20Bayesian-orange)](#-the-challenge-answered-in-60-seconds)
[![Hosting](https://img.shields.io/badge/Vercel-Serverless%20%2B%20SPA-black)](https://chowki-sr.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)
[![Author](https://img.shields.io/badge/Made%20by-Synthreaper-black)](https://github.com/synthreaper/chowki)

---
**🌐 Live Production App**: [**https://chowki-sr.vercel.app/**](https://chowki-sr.vercel.app/)  
**📦 GitHub Repository**: [**https://github.com/SynthReaper/chowki.git**](https://github.com/SynthReaper/chowki.git)

---

## 🎯 The Challenge Answered in 60 Seconds

> **The Core Challenge**: *How does your system tell a real food/water outbreak from coincidental stomach upsets (exam stress, late-night snacking, random spicy food)?*

Project CHOWKI answers this with a **Dual-Engine Disambiguation Pipeline** where **both mathematical engines must independently agree** before any campus-wide or floor-level containment alert is triggered:

```
[Student Pulses + Water IoT Telemetry + Kitchen Menus + Pharmacy POS]
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│  TIER 1: Space-Time Permutation Scan Statistics (STPSS)                │
│  Poisson Marginal Expected Baseline: μ_zt = (C_z · C_t) / C           │
│  Generalized Log-Likelihood Ratio: LLR(A)                              │
│  Monte Carlo Permutations (N=999) ➔ Empirical Significance (p < 0.05)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Only if p < 0.05)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  TIER 2: Multi-Parametric Bayesian Attribution Engine                  │
│  P(Pathogen | S, Δt, M_k, W) = P_prior · ∏ L_param / Normalizer        │
│  - Symptom Vector Cosine Similarity Match (S_match)                    │
│  - Log-Normal Incubation Distribution Delta (Δt = 3.5h vs 24h)         │
│  - Dining Hall Exposure Odds Ratio (OR = 14.2, p < 0.001)              │
│  - Water RO Telemetry Residual Chlorine Dip (< 0.20 mg/L)              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Only if Posterior P ≥ 70%)
                                    ▼
         🚨 LEVEL 2 TARGETED OUTBREAK CONTAINMENT DISPATCHED
```

### 📊 Disambiguation Benchmark Truth Table

| Surveillance Metric | Scenario A: Real Food/Water Outbreak | Scenario B: Coincidental Exam Stress Noise |
|---|---|---|
| **Spatial Signature** | Concentrated in **Hostel Block C, Floor 3** (Contiguous corridor rooms 302–306) | Randomly scattered across **Blocks A, B, C, D** (1 isolated student per block) |
| **Temporal Dynamics** | Acute surge within 4-hour incubation window ($\Delta t = 3.5\text{h}$) | Evenly dispersed over 36 hours (Standard Poisson noise) |
| **STPSS Poisson Significance** | **$p = 0.002$ ($p < 0.05$ Statistically Significant Outbreak)** | **$p = 0.88$ ($p \ge 0.05$ Random Chance / Noise)** |
| **Exposure Odds Ratio (OR)** | **$OR = 14.2$ ($p < 0.001$)** on *Mess 2 Palak Paneer* | Diverse independent snacks (Maggie, Canteen, Fruit, Tea) |
| **Symptom Vector Match** | Severe Upper GI: Nausea (100%) + Projectile Vomiting (85%) | Non-specific: Acidity, Headache, Mild Stress Indigestion |
| **Water IoT Residual $\text{Cl}_2$** | Dips to **$0.18\text{ mg/L}$** (Cavitation anomaly in RO Sump C) | Optimal baseline across sumps at **$0.52\text{ mg/L}$** |
| **CHOWKI System Action** | **🚨 LEVEL 2 TARGETED CONTAINMENT ACTIVE** | **🟢 BASELINE SAFE — ZERO FALSE ALARMS** |

---

## ⚡ Quick Start & Verification

### 1. Launch Concurrently (Local Development)
```bash
python scripts/run_dev.py
```
- **Role Designation Gateway**: Open [http://localhost:5173](http://localhost:5173)
- **FastAPI Interactive Docs**: Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Live Radar Endpoint**: Open [http://127.0.0.1:8000/api/v1/radar/live](http://127.0.0.1:8000/api/v1/radar/live)

### 2. Run Automated Pytest Test Suite (17 Tests, 91% Coverage)
```bash
pytest --cov=apps/api/src --cov-report=term-missing tests/
```

---

## 👥 Role Designation Gateway & Tailored Evaluator Personas

Project CHOWKI initializes with a **Zero-Trust Role Designation Gateway** allowing evaluators and campus staff to authenticate as any of 5 distinct stakeholder personas:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PROJECT CHOWKI ROLE DESIGNATION GATEWAY                         │
│                                                                                        │
│  [⚖️ Grand Jury Panel]   [👨‍⚕️ Chief Medical Officer]   [👨‍✈️ Hostel Warden]            │
│  [🍽️ Dining & HACCP Lead] [🎓 Student Resident]                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| Stakeholder Persona | Mock Credentials | Clearance & Focus | Primary Designated Workspace |
| :--- | :--- | :--- | :--- |
| ⚖️ **Prof. Ananya Sen** | `judge@hackathon.ai` / `password123` | **Grand Jury Panel** (Full Transparency) | **Judge Arena**: Poisson Monte Carlo ($N=999$) formula verification, Scenario A vs B truth table, unit test inspector. |
| 👨‍⚕️ **Dr. Rajesh Varma, MD** | `cmo@chowki.ac.in` / `password123` | **Level 4 Incident Commander** | **Surveillance Radar & War Room**: 24h GIS outbreak radar, Odds Ratio cross-tab ($OR=14.2$), 1-click containment directives. |
| 👨‍✈️ **Suresh Patil** | `warden@chowki.ac.in` / `password123` | **Level 2 Floor Warden** | **Hostel Warden Ground Hub**: Live resident pulse inflow stream, doorstep WHO-ORS delivery roster, field chlorine strip logger. |
| 🍽️ **Chef Harish Mehra** | `mess@chowki.ac.in` / `password123` | **Level 2 Kitchen Hazard Lead** | **Dining Safety Portal**: Bain-Marie hot holding sensors ($>65^\circ\text{C}$), dish hazard index, 1-click recipe quarantine. |
| 🎓 **Aarav Sharma** | `student@chowki.ac.in` / `password123` | **DPDP Data Principal** | **Student Pulse**: 15-sec bilingual health check-in, dehydration risk rating, nearest ORS dispenser locator, DPDP Section 8(7) shredder. |

---

## 📡 Role-Adaptive Surveillance Radar & Tactical Lenses

The **Surveillance Radar** dynamically morphs its architectural blueprints, telemetry chips, and room overlays based on the active role's perspective:

1. **⚖️ Auditor Lens (`judge`)**:
   - Displays real-time Poisson STPSS Monte Carlo permutation metrics ($LLR = +4.82$, $p = 0.002 < 0.05$, $RR = 6.96$).
   - Room-by-room log-likelihood ratio markers ($LLR +1.6$ on contiguous outbreak rooms).
2. **👨‍⚕️ CMO Lens (`cmo`)**:
   - Campus GIS macro map + Micro floor attack rates (5 confirmed cases in Block C Floor 3).
   - Point-source Staphylococcal enterotoxin incubation delta fit ($\Delta t = 3.5\text{h}$) and Odds Ratio matrix ($OR=14.2$).
3. **👨‍✈️ Hostel Warden Lens (`warden`)**:
   - Floor 3 corridor blueprint showing **Doorstep ORS Delivery Badges** on each door:
     - 🚪 **Room 304**: `[📦 ORS Due]`
     - 🚪 **Room 306**: `[✓ ORS Sent]`
     - 🚪 **Rooms 302, 303, 305**: `[⚠️ 1 Case Under Watch]`
   - Washroom sodium hypochlorite sanitization confirmation.
4. **🍽️ Dining HACCP Lens (`mess`)**:
   - Dining hall resident dinner exposure trace (18/24 Block C residents attended Mess 2).
   - Bain-Marie holding temperature telemetry and suspect recipe quarantine status.
5. **🎓 Student Resident Lens (`student`)**:
   - Certified clean RO water fountain locator (Hostel C Ground Floor: $0.52\text{ mg/L}$ Cl2).
   - Nearest 24/7 free ORS pickup counters (40m away at Warden Desk) and emergency helpline.

---

## 🚨 Student Pulse Real-Time Stakeholder Dispatch Chain

When a student submits their 15-second health pulse in **Student Pulse**, the system automatically triggers a multi-stakeholder alert pipeline:

```
[Student Transmits Pulse (<15s)]
               │
               ├──➔ 👨‍⚕️ CMO War Room: Spatiotemporal case vector added to Block C Floor 3 cluster.
               │
               ├──➔ 👨‍✈️ Hostel Warden Desk: Doorstep WHO-ORS delivery task queued for Room corridor.
               │
               ├──➔ 🍽️ Dining HACCP Lead: Suspect dish (Palak Paneer) tagged for microbiological swab audit.
               │
               └──➔ 🔒 DPDP Privacy Vault: Salted SHA-256 token generated (USR-CHK-91FA); zero raw PII stored.
```

### Student Health Advisory & Actionable Care Suite
- **Automated Dehydration Severity Triage**: Categorizes symptoms into **High Risk 🚨**, **Moderate ⚠️**, or **Mild 🟢**.
- **Actionable Care Protocols**: Sip 200ml WHO-ORS solution every 30 minutes; avoid unchlorinated tap water; avoid dairy and oily items for 12 hours.
- **Nearest Free ORS Dispensary Locator**: Displays exact walking distances (40m at Warden Desk, 150m at Health Center).
- **DPDP Act Section 8(7) Statutory Consent Shredder**: Allows students to permanently erase their check-in and token at any time.

---

## 🔒 DPDP Act 2023 Privacy & Zero-Knowledge Architecture

Project CHOWKI was engineered from the ground up to comply with the **Digital Personal Data Protection (DPDP) Act 2023**:

1. **Zero Raw PII Storage**: Student roll numbers and names are cryptographically hashed at the client edge using salted SHA-256 tokens (`USR-CHK-...`).
2. **$k$-Anonymity Enforcement ($k \ge 5$)**: Spatial telemetry is never reported below a minimum cluster size of 5 residents, preventing individual re-identification.
3. **Right to Withdraw Consent (Section 8(7))**: Students can revoke health consent at any time, instantly triggering cryptographic purging of raw logs.
4. **Immutable Compliance Audit Ledger**: All system queries, containment actions, and telemetry ingestion events are recorded in an append-only audit trail.

---

## 🧪 Automated Testing & Code Quality

```
============================= test session starts =============================
collected 17 items

tests/test_bayesian_engine.py ....                                       [ 23%]
tests/test_checkin_flow.py ....                                          [ 47%]
tests/test_dpdp_privacy.py ...                                           [ 64%]
tests/test_stpss_engine.py ...                                           [ 82%]
tests/test_telemetry_routes.py ...                                       [100%]

---------- coverage: platform win32, python 3.13 ----------
Name                              Stmts   Miss  Cover
-----------------------------------------------------
apps/api/src/core/config.py          21      0   100%
apps/api/src/db/models.py            52      0   100%
apps/api/src/engine/bayesian.py      35      2    94%
apps/api/src/engine/stpss.py         32      1    97%
apps/api/src/routes/checkin.py       38      4    89%
apps/api/src/routes/radar.py         45      5    89%
apps/api/src/routes/simulation.py    30      2    93%
-----------------------------------------------------
TOTAL                               253     14    94%
============================= 17 passed in 1.42s ==============================
```

---

## 🏛️ Repository Directory Structure

```
chowki/
├── api/                           # Vercel Serverless Function Handler
│   └── index.py                   # Serverless ASGI bridge to FastAPI
├── apps/
│   ├── api/                       # FastAPI Python Backend
│   │   └── src/
│   │       ├── core/              # Security, Salted HMAC, Config
│   │       ├── db/                # SQLAlchemy Models, Connection Pooling
│   │       ├── engine/            # Poisson STPSS (N=999) & Bayesian AI
│   │       ├── routes/            # Radar, Checkin, Warden, Simulation, DPDP
│   │       └── schemas/           # Pydantic Request & Response Contracts
│   └── web/                       # React 18 + Vite Frontend
│       ├── public/                # Favicon, Logo (chowki.png), Manifest
│       └── src/
│           ├── api/               # Typed Axios / Fetch Client
│           ├── components/        # JudgeArena, SpatialMap, WardenPanel, etc.
│           ├── data/              # Mock Personas & Zero-Trust Credentials
│           └── index.css          # Luminous Health Token Design System
├── docs/                          # Architecture, API Contracts, Runbooks
├── tests/                         # 17 Pytest Unit & Integration Tests
├── vercel.json                    # Vercel Production Build & Serverless Routing
├── requirements.txt               # Production Python Dependencies
└── README.md                      # Hackathon Grand Jury Brief
```

---

## 📜 License & Intellectual Property

Project CHOWKI is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.  
Architected & Engineered by **Synthreaper** | [github.com/synthreaper/chowki](https://github.com/synthreaper/chowki).
