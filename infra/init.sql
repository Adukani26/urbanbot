-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Zones: city areas the robot patrols
CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  geojson JSONB,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs: scheduled maintenance tasks
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  zone_id INTEGER REFERENCES zones(id),
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Telemetry: time-series sensor data from robot
CREATE TABLE telemetry (
  time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  robot_id VARCHAR(50) NOT NULL,
  battery_level FLOAT,
  speed FLOAT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status VARCHAR(50),
  current_job_id INTEGER REFERENCES jobs(id),
  raw JSONB
);

SELECT create_hypertable('telemetry', 'time');

-- Maintenance logs
CREATE TABLE maintenance_logs (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id),
  zone_id INTEGER REFERENCES zones(id),
  robot_id VARCHAR(50),
  action VARCHAR(100),
  result TEXT,
  images JSONB,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed zones
INSERT INTO zones (name, description, priority) VALUES
  ('Zone A - North Plaza', 'Cobblestone area near north entrance with aggressive shrub growth', 1),
  ('Zone B - East Walkway', 'Pedestrian walkway with grass encroachment on pavers', 2),
  ('Zone C - Central Park Strip', 'Median strip with overgrown bushes', 1),
  ('Zone D - South Plots', 'Residential plots with unmanaged vegetation', 3);