-- ============================================================
-- Project CHOWKI — Campus Outbreak Surveillance System
-- Made by Synthreaper | github.com/synthreaper/chowki
-- Migration: V001_20260822_initial_schema.sql
-- Date: 2026-08-22
-- ============================================================

-- Enable PostGIS extension for spatial topology
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Spatial Zones & Campus GIS Topology
CREATE TABLE IF NOT EXISTS spatial_zones (
    zone_token VARCHAR(64) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    zone_type VARCHAR(30) NOT NULL, -- block, floor, wing, mess
    parent_zone VARCHAR(64),
    resident_capacity INTEGER DEFAULT 50,
    current_alert_level INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for parent-child spatial hierarchy traversal
CREATE INDEX IF NOT EXISTS idx_spatial_zones_parent ON spatial_zones(parent_zone);

-- 2. Pseudonymous Checkin Telemetry
CREATE TABLE IF NOT EXISTS checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(64) NOT NULL, -- SHA-256 rotating pseudonym token
    spatial_zone VARCHAR(64) NOT NULL REFERENCES spatial_zones(zone_token),
    temporal_bin VARCHAR(32) NOT NULL, -- ISO 4-hour temporal sliding window
    symptoms JSONB NOT NULL,
    onset_bucket VARCHAR(20) NOT NULL,
    meal_location VARCHAR(50),
    meal_item_tag VARCHAR(100),
    water_source VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    purge_after TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_checkins_zone_bin ON checkins(spatial_zone, temporal_bin);
CREATE INDEX IF NOT EXISTS idx_checkins_token ON checkins(token);

-- 3. Mess Dining Schedules & Microbiological Risk Tags
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mess_id VARCHAR(50) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    service_start TIMESTAMPTZ DEFAULT NOW(),
    item_name VARCHAR(100) NOT NULL,
    risk_tag VARCHAR(20) DEFAULT 'normal', -- normal, high
    risk_multiplier FLOAT DEFAULT 1.0,
    estimated_servings INTEGER DEFAULT 300,
    vendor_type VARCHAR(30) DEFAULT 'in-house',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(mess_id, is_active);

-- 4. Space-Time Permutation Scan Statistic (STPSS) Scan Results
CREATE TABLE IF NOT EXISTS stpss_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_timestamp TIMESTAMPTZ DEFAULT NOW(),
    zone VARCHAR(64) NOT NULL,
    temporal_bin VARCHAR(32) NOT NULL,
    case_count INTEGER NOT NULL,
    expected_count FLOAT NOT NULL,
    llr FLOAT NOT NULL,
    p_value FLOAT NOT NULL,
    relative_risk FLOAT NOT NULL,
    is_significant BOOLEAN DEFAULT FALSE
);

-- 5. Cluster Alerts & Bayesian Pathogen Profiler
CREATE TABLE IF NOT EXISTS cluster_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_ref_id VARCHAR(36),
    alert_level INTEGER NOT NULL,
    zone VARCHAR(64) NOT NULL REFERENCES spatial_zones(zone_token),
    outbreak_probability FLOAT NOT NULL,
    top_pathogen VARCHAR(64) NOT NULL,
    pathogen_scores JSONB NOT NULL,
    incubation_delta_h FLOAT,
    mk_score FLOAT,
    exposure_vector VARCHAR(200),
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 6. Water IoT Inline Telemetry
CREATE TABLE IF NOT EXISTS iot_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id VARCHAR(64) NOT NULL,
    zone VARCHAR(64) NOT NULL REFERENCES spatial_zones(zone_token),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    chlorine_mg_l FLOAT NOT NULL,
    turbidity_ntu FLOAT NOT NULL,
    ph FLOAT DEFAULT 7.2,
    flow_lpm FLOAT DEFAULT 50.0,
    alert_triggered BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_iot_zone_time ON iot_readings(zone, timestamp DESC);

-- 7. Pharmacy Point-of-Sale OTC Spikes
CREATE TABLE IF NOT EXISTS pharmacy_spikes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    item_category VARCHAR(50) NOT NULL,
    baseline_count INTEGER DEFAULT 5,
    observed_count INTEGER DEFAULT 5,
    spike_percent FLOAT DEFAULT 0.0
);

-- 8. DPDP Act 2023 Consent & Erasure Ledger
CREATE TABLE IF NOT EXISTS consent_records (
    token VARCHAR(64) PRIMARY KEY,
    consent_given BOOLEAN DEFAULT TRUE,
    given_at TIMESTAMPTZ DEFAULT NOW(),
    withdrawn_at TIMESTAMPTZ,
    purge_deadline TIMESTAMPTZ
);

-- 9. Immutable Statutory Compliance Audit Log (APPEND-ONLY)
CREATE TABLE IF NOT EXISTS compliance_audit_log (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    zone_affected VARCHAR(64),
    legal_basis VARCHAR(128) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Warden SOP Containment Tasks
CREATE TABLE IF NOT EXISTS warden_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone VARCHAR(64) NOT NULL REFERENCES spatial_zones(zone_token),
    alert_level INTEGER DEFAULT 1,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    completed_by VARCHAR(64),
    verification_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. System Configuration
CREATE TABLE IF NOT EXISTS system_config (
    key VARCHAR(64) PRIMARY KEY,
    value JSONB NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROLLBACK SCRIPT:
-- DROP TABLE IF EXISTS warden_tasks CASCADE;
-- DROP TABLE IF EXISTS compliance_audit_log CASCADE;
-- DROP TABLE IF EXISTS consent_records CASCADE;
-- DROP TABLE IF EXISTS pharmacy_spikes CASCADE;
-- DROP TABLE IF EXISTS iot_readings CASCADE;
-- DROP TABLE IF EXISTS cluster_alerts CASCADE;
-- DROP TABLE IF EXISTS stpss_results CASCADE;
-- DROP TABLE IF EXISTS menu_items CASCADE;
-- DROP TABLE IF EXISTS checkins CASCADE;
-- DROP TABLE IF EXISTS spatial_zones CASCADE;
-- DROP TABLE IF EXISTS system_config CASCADE;
-- ============================================================
