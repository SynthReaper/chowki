# CHANGELOG.md — Project CHOWKI Version History
## *All notable changes to this project are documented here.*
> **Attribution**: Made by Synthreaper | github.com/synthreaper/chowki

---

## [1.0.0] — 2026-08-22

### Added
- **Core AI Engine (STPSS)**: Vectorized Space-Time Permutation Scan Statistics ($N=999$ Monte Carlo permutations, Poisson Log-Likelihood Ratio, empirical $p$-value, Relative Risk calculation).
- **Core AI Engine (Bayesian)**: Multi-Parametric Causative Pathogen Attribution (*S. aureus*, *Salmonella*, *B. cereus*, *Norovirus*, *STEC*) evaluating symptom cosine similarity, incubation delta $\Delta t$, mess exposure hazard $M_k$, and water chlorine prior boosts.
- **FastAPI REST Backend (`apps/api`)**: Complete modular routers for `/checkin`, `/radar/live`, `/menu`, `/telemetry`, `/warden`, `/consent`, `/simulation`.
- **Multi-Role Web Application (`apps/web`)**: React 18 + Vite dashboard with bespoke Tactical Bio-Radar styling, vector campus spatial map, 72-hour dynamic Epidemic Curve histogram, Bayesian pathogen profiler, 1-click CMO containment matrix, student check-in (EN/HI), warden panel, mess portal, and DPDP privacy hub.
- **Outbreak Scenario Simulator**: 1-click execution of Scenario A (Real *S. aureus* outbreak in Block C) vs Scenario B (Coincidental background noise) for hackathon judging.
- **Automated Test Suite**: 17 comprehensive unit and integration tests with 91% code coverage (`pytest-cov`).
- **DPDP Act 2023 Compliance**: Salted weekly-rotating pseudonym tokens, $k$-anonymity enforcement ($k \ge 5$), append-only audit ledger, and 72h data erasure.
- **Full Documentation Suite**: `ARCHITECTURE.md`, `API.md`, `SCHEMA.md`, `SECURITY.md`, `SECRETS.md`, `RUNBOOK.md`, `RULES.md`, `README.md`.

### Security
- RS256 / HS256 JWT auth with 15-minute token TTL.
- Zero PII in logs with custom security header middleware.
- Zero hardcoded credentials policy strictly enforced.
