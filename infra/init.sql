-- ──────────────────────────────────────────────────────────
-- UrbanBot Database Schema
-- Runs automatically on first PostgreSQL container startup
-- ──────────────────────────────────────────────────────────

-- Enable TimescaleDB extension for time-series telemetry
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ── ZONES ─────────────────────────────────────────────────
-- City areas the robot patrols and maintains
CREATE TABLE zones (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  geojson     JSONB,
  priority    INTEGER DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── JOBS ──────────────────────────────────────────────────
-- Scheduled maintenance tasks dispatched to the robot
CREATE TABLE jobs (
  id           SERIAL PRIMARY KEY,
  zone_id      INTEGER REFERENCES zones(id),
  type         VARCHAR(50) NOT NULL,
  status       VARCHAR(20) DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── TELEMETRY ─────────────────────────────────────────────
-- Time-series sensor data streamed from the robot via MQTT
CREATE TABLE telemetry (
  time           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  robot_id       VARCHAR(50) NOT NULL,
  battery_level  FLOAT,
  speed          FLOAT,
  lat            DOUBLE PRECISION,
  lng            DOUBLE PRECISION,
  status         VARCHAR(50),
  current_job_id INTEGER REFERENCES jobs(id),
  raw            JSONB
);

-- Convert telemetry to hypertable for time-series performance
SELECT create_hypertable('telemetry', 'time');

-- ── MAINTENANCE LOGS ──────────────────────────────────────
-- Record of actions taken and findings per job
CREATE TABLE maintenance_logs (
  id        SERIAL PRIMARY KEY,
  job_id    INTEGER REFERENCES jobs(id),
  zone_id   INTEGER REFERENCES zones(id),
  robot_id  VARCHAR(50),
  action    VARCHAR(100),
  result    TEXT,
  images    JSONB,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SEED DATA ─────────────────────────────────────────────
-- Initial Konza Technopolis patrol zones
INSERT INTO zones (name, description, priority) VALUES
  ('Phase 1 — Konza Complex',   'Main complex area with cobblestone paths and aggressive shrub growth', 1),
  ('Phase 2 — University Area', 'University precinct with grass encroachment on pedestrian pavers',    2),
  ('Phase 3 — Central Strip',   'Central median strip with overgrown bushes along main boulevard',     1),
  ('Phase 4 — South Plots',     'Southern residential plots with unmanaged vegetation',                3);