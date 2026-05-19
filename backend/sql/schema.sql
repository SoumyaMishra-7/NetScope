CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'analyst',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE devices (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  ip_address INET NOT NULL UNIQUE,
  mac_address TEXT NOT NULL,
  zone TEXT NOT NULL,
  owner_team TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Healthy', 'Warning', 'Critical')),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE packets (
  id TEXT PRIMARY KEY,
  device_id BIGINT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  protocol TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Healthy', 'Warning', 'Critical')),
  latency_ms INTEGER NOT NULL,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('Low', 'Medium', 'High')),
  threat_score INTEGER NOT NULL CHECK (threat_score BETWEEN 0 AND 100),
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE logs (
  id BIGSERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  uploaded_by BIGINT REFERENCES users(id),
  parsed_rows INTEGER NOT NULL DEFAULT 0,
  suspicious_activity INTEGER NOT NULL DEFAULT 0,
  failed_requests INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL
);
