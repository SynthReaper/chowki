# SCHEMA.md — Database Schema & Data Dictionary
## *Project CHOWKI PostgreSQL + PostGIS Data Model*
> **Attribution**: Made by Synthreaper | github.com/synthreaper/chowki

---

### Core Tables & Relationships

1. **`spatial_zones`**:
   - `zone_token` (VARCHAR(64), PK): e.g. `Hostel_C_Fl_3`
   - `display_name` (VARCHAR(100)): Human readable name
   - `zone_type` (VARCHAR(30)): `block`, `floor`, `mess`, `water_sump`
   - `parent_zone` (VARCHAR(64), FK): Hierarchy grouping
   - `current_alert_level` (INTEGER): 0=Normal, 1=Advisory, 2=Alert, 3=Emergency

2. **`checkins`**:
   - `id` (UUID, PK)
   - `token` (VARCHAR(64), Indexed): HMAC-SHA256 weekly-rotating salted token
   - `spatial_zone` (VARCHAR(64), FK)
   - `temporal_bin` (VARCHAR(32), Indexed): ISO 4-hour temporal sliding window
   - `symptoms` (JSONB): Array of symptom tokens
   - `onset_bucket` (VARCHAR(20)): `<2h`, `2-8h`, `>8h`
   - `meal_location` (VARCHAR(50)): `mess_1`, `mess_2`, `canteen`, `off_campus`
   - `meal_item_tag` (VARCHAR(100)): e.g. `Palak Paneer`
   - `water_source` (VARCHAR(50)): `floor_ro`, `water_cooler`, `bottled`
   - `purge_after` (TIMESTAMPTZ): 30-day automatic data minimization purge deadline

3. **`cluster_alerts`**:
   - `id` (UUID, PK)
   - `alert_level` (INTEGER): Escalation tier (1–3)
   - `zone` (VARCHAR(64), FK)
   - `outbreak_probability` (FLOAT): Posterior confidence ($0.0 \to 1.0$)
   - `top_pathogen` (VARCHAR(64)): e.g. `staphylococcus_aureus`
   - `pathogen_scores` (JSONB): Probability distribution over all reference pathogens
   - `incubation_delta_h` (FLOAT): Mean incubation hours
   - `mk_score` (FLOAT): Mess hazard exposure metric

4. **`iot_readings`**:
   - `id` (UUID, PK)
   - `sensor_id` (VARCHAR(64))
   - `zone` (VARCHAR(64), FK)
   - `chlorine_mg_l` (FLOAT): Free residual chlorine ($<0.20\text{ mg/L}$ triggers alert)
   - `turbidity_ntu` (FLOAT): Water turbidity ($>4.0\text{ NTU}$ triggers alert)

5. **`compliance_audit_log`** *(APPEND-ONLY)*:
   - `id` (BIGSERIAL, PK)
   - `event_type` (VARCHAR(64))
   - `actor_role` (VARCHAR(32))
   - `legal_basis` (VARCHAR(128))
   - `details` (JSONB)
   - `created_at` (TIMESTAMPTZ)
