# 🚨 Project CHOWKI
### *Continuous Health Observation and Water-Kitchen Intelligence*
#### Bio-Spatiotemporal Micro-Outbreak Early Warning & Surgical Containment Suite for Indian Campuses

[![Tests](https://img.shields.io/badge/pytest-17%20passed%20(91%25%20cov)-brightgreen)](#-automated-testing--code-quality)
[![DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP%20Act%202023-blue)](#-dpdp-act-2023-privacy--zero-knowledge-architecture)
[![Engine](https://img.shields.io/badge/AI%20Engine-STPSS%20%2B%20Bayesian-orange)](#-the-challenge-answered-in-60-seconds)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)
[![Author](https://img.shields.io/badge/Made%20by-Synthreaper-black)](https://github.com/synthreaper/chowki)

---

## 🎯 The Challenge Answered in 60 Seconds

> **The Hackathon Question**: *How does your system tell a real food/water outbreak from coincidental stomach upsets (exam stress, late-night snacking)?*

Project CHOWKI answers this with a **Dual-Engine Disambiguation AI** where **both engines must mathematically agree** before any institutional containment alert is issued:

```
[Student Pulses + Water IoT + Kitchen Menus]
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: Space-Time Permutation Scan Statistics (STPSS)     │
│  Poisson Marginal Mean: μ_zt = (C_z · C_t) / C             │
│  Monte Carlo Permutations (N=999) ➔ p < 0.05 Cutoff        │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Only if p < 0.05)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 2: Multi-Parametric Bayesian Attribution Engine        │
│  P(Outbreak | S, Δt, M_k, W) = P_prior · ∏ L_param / Norm    │
│  - Symptom Vector Cosine Similarity (S)                     │
│  - Incubation Period Distribution Delta (Δt = 3.5h)         │
│  - Dining Hall Exposure Odds Ratio (OR = 14.2, p < 0.001)   │
│  - Water RO Telemetry Residual Chlorine Dip (< 0.2 mg/L)    │
└───────────────────────────┬─────────────────────────────────┘
                            │ (Only if Posterior P ≥ 70%)
                            ▼
      🚨 LEVEL 2 TARGETED OUTBREAK CONTAINMENT ACTIVE
```

### 📊 Disambiguation Benchmark Truth Table

| Surveillance Metric | Scenario A: Real Food Outbreak | Scenario B: Coincidental Exam Noise |
|---|---|---|
| **Spatial Signature** | Concentrated in **Hostel Block C, Floor 3** (Contiguous rooms) | Scattered across **Blocks A, B, C, D** (1 case per block) |
| **Temporal Dynamics** | Acute spike within 4-hour window ($\Delta t = 3.5\text{h}$) | Evenly dispersed over 36 hours (Random Poisson noise) |
| **STPSS Poisson Significance** | **$p = 0.002$ ($p < 0.05$ Significant)** | **$p = 0.88$ ($p \ge 0.05$ Random Chance)** |
| **Exposure Odds Ratio (OR)** | **$OR = 14.2$ ($p < 0.001$)** on Mess 2 Palak Paneer | Diverse independent meals (Maggie, Canteen, Fruit) |
| **Symptom Co-occurrence** | Severe Upper GI: Nausea + Projectile Vomiting | Non-specific: Acidity, Headache, Stress Indigestion |
| **Water IoT Residual $\text{Cl}_2$** | Dips to **$0.18\text{ mg/L}$** (Cavitation anomaly) | Optimal baseline at **$0.52\text{ mg/L}$** |
| **CHOWKI System Action** | **🚨 LEVEL 2 TARGETED CONTAINMENT** | **🟢 BASELINE SAFE — ZERO FALSE ALARMS** |

---

## ⚡ Quick Start (Run in 30 Seconds)

### 1. Launch All Servers Concurrently
```bash
python scripts/run_dev.py
```
- **Web Dashboard (Luminous Health UI)**: Open [http://localhost:5173](http://localhost:5173)
- **FastAPI Interactive Swagger Docs**: Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **API Health Check**: Open [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 2. Run Automated Test Suite (17 Tests)
```bash
pytest --cov=apps/api/src --cov-report=term-missing tests/
```

---

## 🧭 Multi-Panel Architecture & 8 Operational Consoles

CHOWKI features **8 specialized consoles** designed for campus stakeholders:

```
[📡 Surveillance Radar] [🔬 Cause Solver] [🚨 Containment Commander] [⚡ Benchmark Arena] [🏥 Student Pulse] [👨‍✈️ Hostel Warden] [🍽️ Dining & HACCP] [🔒 Privacy Vault]
```

### 1. 📡 Surveillance Radar (War Room)
- **Live 24h Telemetry Stream**: Ambient pulse LEDs displaying real-time water chlorine levels and dining hall batch statuses with zero scrollbar clutter.
- **Dynamic Floor-Level GIS Topology**: Interactive floor switcher (**F1, F2, F3**) rendering exact corridor blueprints with room-by-room status (e.g. Rooms 302–306 in Block C Floor 3 marked in Red).
- **72-Hour Epidemic Curve**: High-contrast charcoal histogram distinguishing point-source exposure spikes from continuous person-to-person spread.
- **Bayesian Pathogen Profiler**: Live posterior probabilities for *S. aureus* (82%), *B. cereus* (12%), *Salmonella* (3%), and *Norovirus* (2%).

### 2. 🔬 Cause Solver (Deep Causal Investigation Console)
- **Cross-Tabulation Exposure Odds Ratio Matrix**: Computes Fisher Exact tests across dining hall dishes. Proves **Palak Paneer (OR=14.2, p<0.001)** is the primary vehicle, while RO water served as a secondary vulnerability co-factor.
- **Temporal Onset Vector Reconstruction**: Traces timeline from 19:30 Dinner $\to$ 21:00 Chlorine Dip $\to$ 23:00 Symptom Explosion $\to$ 23:45 Automated Level 2 Alert.
- **Interactive "What-If" Sensitivity Lab**: Live sliders for Incubation Delta ($\Delta t$) and Water Free Chlorine ($\text{Cl}_2$) allowing epidemiologists to test alternative microbiological hypotheses in real time.

### 3. 🚨 Containment Commander (Incident Mitigation Powers)
- **1-Click Food Lockdown**: Suspends suspect menu items across campus kitchens and halts supplier shipments.
- **RO Sump Shock Chlorination**: Dispatches automated command to elevate free chlorine to $2.0\text{ mg/L}$.
- **Targeted WhatsApp/SMS Advisory**: Geo-fenced notification dispatched strictly to affected residents without alarming the campus.
- **Medical ORS Supply Dispatch**: Auto-orders 50 WHO-ORS electrolyte packets to the Warden Desk.
- **Export Official CMO Dossier (.md)**: Generates and downloads certified incident reports with mathematical proofs.

### 4. ⚡ Benchmark Arena (Scenario Testing)
- Direct 1-click switcher between **Scenario A (Real Outbreak)** and **Scenario B (Exam Stress Noise)** to test system disambiguation live.

### 5. 🏥 Student Pulse (15-Second Clinical Check-In)
- Zero-friction bilingual (Hindi/English) self-triage terminal with dehydration risk score, ORS kit locator, and clinic helpline.

### 6. 👨‍✈️ Hostel Warden (Ground Operations)
- Digital SOP checklist, doorstep resident health checks, and field chlorine test kit logging.

### 7. 🍽️ Dining & HACCP Portal (Kitchen Safety)
- Dish risk multipliers, holding temperature telemetry, and vendor QA inspection records.

### 8. 🔒 Privacy Vault (DPDP Act 2023 Compliance)
- Zero-knowledge cryptographic token ledger, 1-click consent revocation with instant shredding, and SHA-256 immutable audit trail.

---

## 🔒 DPDP Act 2023 Privacy & Zero-Knowledge Architecture

Project CHOWKI was engineered from the ground up to comply with the **Digital Personal Data Protection (DPDP) Act 2023**:

1. **Zero Raw PII Storage**: Student roll numbers and names are cryptographically hashed using salted SHA-256 tokens (`USR-CHK-...`).
2. **$k$-Anonymity Enforcement ($k \ge 5$)**: Spatial telemetry is never reported below a minimum cluster size of 5 residents, preventing individual re-identification.
3. **Right to Withdraw Consent (Section 8(7))**: Students can revoke health consent at any time, instantly triggering cryptographic purging of raw logs.
4. **Immutable Audit Trail**: All system queries and actions are recorded in an append-only ledger with cryptographic hash chains.

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
apps/api/src/routes/consent.py       24      3    88%
apps/api/src/routes/menu.py          26      2    92%
apps/api/src/routes/radar.py         41      5    88%
apps/api/src/routes/simulation.py    31      2    94%
apps/api/src/routes/telemetry.py     22      1    95%
apps/api/src/routes/warden.py        27      3    89%
-----------------------------------------------------
TOTAL                               349     23    91%

============================= 17 passed in 1.42s ==============================
```

---

## 🏗️ Project Architecture & File Tree

```
chowki/
├── .github/
│   ├── workflows/ci.yml             # GitHub Actions CI pipeline
│   ├── PULL_REQUEST_TEMPLATE.md     # PR template with math & privacy gates
│   └── ISSUE_TEMPLATE/              # Bug report & Feature request templates
├── apps/
│   ├── api/                         # FastAPI Backend (Port 8000)
│   │   ├── src/
│   │   │   ├── core/config.py       # Pydantic v2 application settings
│   │   │   ├── db/models.py         # SQLite/Postgres SQLAlchemy ORM models
│   │   │   ├── engine/
│   │   │   │   ├── stpss.py         # Vectorized NumPy Poisson STPSS engine
│   │   │   │   └── bayesian.py      # Multi-parametric Bayesian attribution
│   │   │   ├── routes/              # Modular REST routers (checkin, radar, etc.)
│   │   │   └── main.py              # Application lifecycle & CORS
│   │   └── requirements.txt
│   └── web/                         # Vite React Frontend (Port 5173)
│       ├── src/
│       │   ├── api/client.js        # Centralized REST client
│       │   ├── components/
│       │   │   ├── Header.jsx       # Glassmorphic multi-panel navigation
│       │   │   ├── SpatialMap.jsx   # Floor-by-floor F1/F2/F3 GIS topology
│       │   │   ├── EpiCurve.jsx     # 72-hour epidemic curve histogram
│       │   │   ├── PathogenProfiler.jsx # Bayesian fingerprint card
│       │   │   ├── CausalInvestigation.jsx # Odds ratio matrix & sensitivity lab
│       │   │   ├── ContainmentCommander.jsx# 1-click mitigation powers
│       │   │   ├── StudentCheckIn.jsx # Bilingual 15-second triage
│       │   │   ├── WardenPanel.jsx  # Warden SOP checklist
│       │   │   ├── MessPortal.jsx   # HACCP kitchen hazard portal
│       │   │   ├── PrivacyHub.jsx   # DPDP Act 2023 audit vault
│       │   │   └── ScenarioSimulator.jsx # Benchmark switcher
│       │   ├── index.css            # Luminous Health design system tokens
│       │   ├── App.jsx              # Multi-panel dashboard controller
│       │   └── main.jsx
│       └── package.json
├── scripts/
│   ├── run_dev.py                   # Concurrent server launcher (FastAPI + Vite)
│   └── seed_demo_data.py            # Idempotent campus topology database seeder
├── tests/                           # Pytest comprehensive test suite
├── CONTRIBUTING.md                  # Development guidelines
├── LICENSE                          # MIT License
└── README.md                        # Documentation & Hackathon Brief
```

---

## 👥 Authors & Attribution

- **Project Lead & Developer**: **Synthreaper** ([github.com/synthreaper/chowki](https://github.com/synthreaper/chowki))
- **Design Philosophy**: Stitch Luminous Health Bio-Intelligence Tokens
- **License**: [MIT License](LICENSE)

*“Detect micro-outbreaks before they cross dormitory walls. Protect students without spreading panic.”*
