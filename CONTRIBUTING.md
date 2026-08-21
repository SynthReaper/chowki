# Contributing to Project CHOWKI

Thank you for your interest in contributing to **Project CHOWKI (Continuous Health Observation and Water-Kitchen Intelligence)**!

## Development Guidelines

1. **Dual-Engine Discipline**:
   - Any modifications to `apps/api/src/engine/stpss.py` must maintain vectorized NumPy performance and ensure Monte Carlo permutations ($N=999$) complete in under $50\text{ms}$.
   - Any modifications to `apps/api/src/engine/bayesian.py` must follow standard microbiological incubation distributions.
2. **DPDP Act 2023 Compliance**:
   - Zero raw PII in database or telemetry logs.
   - All spatial analytics must respect the $k$-Anonymity constraint ($k \ge 5$).
3. **No Hardcoded Data**:
   - All zones, menus, readings, tasks, and audit logs are dynamically queried from the database.
4. **Attribution**:
   - Maintain the header comment: `Made by Synthreaper | github.com/synthreaper/chowki` on all source files.

## Running Tests
```bash
pytest --cov=apps/api/src --cov-report=term-missing tests/
```
Ensure all 17 tests pass with $\ge 90\%$ code coverage.
