# SECRETS.md — Environment Variable & Secret Registry
## *Zero Hardcoded Data Policy Reference*
> **Attribution**: Made by Synthreaper | github.com/synthreaper/chowki

---

| Variable Name | Required / Optional | Default (Development) | Purpose |
|---|---|---|---|
| `CHOWKI_ENV` | Optional | `development` | Deployment environment (`development`, `production`, `test`) |
| `CHOWKI_PORT` | Optional | `8000` | FastAPI server listening port |
| `CHOWKI_DATABASE_URL` | Required | `sqlite:///./chowki_surveillance.db` | PostgreSQL/SQLite connection string |
| `CHOWKI_JWT_SECRET` | Required | `chowki-surveillance-secret-key-32-bytes-min!` | JWT HMAC / RSA signing secret |
| `CHOWKI_SALT_SEED` | Required | `chowki-weekly-rotating-salt-2026` | Master seed for weekly student pseudonym rotation |
| `CHOWKI_STPSS_MC_RUNS` | Optional | `999` | Monte Carlo permutation iterations for scan statistics |
| `CHOWKI_STPSS_P_THRESH` | Optional | `0.05` | Statistical significance threshold |
| `CHOWKI_CHLORINE_THRESH`| Optional | `0.2` | Minimum safe free residual chlorine in mg/L |
| `CHOWKI_K_ANONYMITY` | Optional | `5` | Spatial aggregation k-anonymity minimum floor |
