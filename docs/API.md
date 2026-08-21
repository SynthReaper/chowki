# API.md — Project CHOWKI API Specification (v1.0.0)
## *RESTful Endpoints & Schema Contracts*
> **Attribution**: Made by Synthreaper | github.com/synthreaper/chowki

---

### Base URL: `/api/v1`

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `POST` | `/checkin` | Ingests ambient 15-second student symptom pulse | Student / Public |
| `GET` | `/radar/live` | Main surveillance analytics feed (clusters, epi-curve, zones) | CMO / Medical Staff |
| `GET` | `/menu` | Lists active mess dining schedules and hazard tags | All Roles |
| `POST` | `/menu` | Registers new menu item with automated risk tagging | Mess Manager |
| `PATCH` | `/menu/{id}/suspend` | Suspends high-risk dish upon Level 2/3 alert | Mess Manager / CMO |
| `GET` | `/telemetry/iot` | Returns latest inline water sensor measurements | IoT / Admin |
| `POST` | `/telemetry/iot` | Ingests chlorine, turbidity, and flow readings | Inline Sensor / MQTT |
| `POST` | `/telemetry/pharmacy` | Ingests retail pharmacy OTC sales counts | Pharmacy POS Hook |
| `GET` | `/warden/tasks/{zone}` | Returns SOP containment checklist for warden | Hostel Warden |
| `PATCH` | `/warden/tasks/{id}` | Marks containment task completed with verification note | Hostel Warden |
| `POST` | `/warden/field-log` | Submits manual DPD chlorine test & washroom sanitization log | Hostel Warden |
| `GET` | `/consent/{token}` | Returns student consent status & processing history | Data Principal / DPO |
| `DELETE` | `/consent/{token}` | Revokes consent & purges checkin telemetry (DPDP Sec 8(7)) | Data Principal |
| `GET` | `/consent/audit/ledger` | Returns immutable compliance audit log | DPO / Auditor |
| `POST` | `/simulation/outbreak` | Injects synthetic *S. aureus* outbreak in Block C | Demo / Tester |
| `POST` | `/simulation/coincidental`| Injects scattered background noise (Level 0) | Demo / Tester |
| `POST` | `/simulation/reset` | Resets database to clean campus baseline | Demo / Tester |
| `GET` | `/health` | Liveness & readiness probe | Public |
