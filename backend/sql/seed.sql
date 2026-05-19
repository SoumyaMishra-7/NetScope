INSERT INTO users (email, full_name, role) VALUES
  ('security@netscope.local', 'Security Analyst', 'admin'),
  ('network@netscope.local', 'Network Operator', 'analyst');

INSERT INTO devices (name, ip_address, mac_address, zone, owner_team, status) VALUES
  ('Edge Gateway', '10.12.24.80', 'A4:9D:20:7C:50:B0', 'DMZ', 'Security Ops', 'Healthy'),
  ('Core Switch', '10.13.25.81', 'A4:9D:21:7C:51:B1', 'Production', 'Network Team', 'Warning'),
  ('API Node', '10.14.26.82', 'A4:9D:22:7C:52:B2', 'Cloud', 'Platform', 'Critical');

INSERT INTO packets (id, device_id, ip_address, protocol, status, latency_ms, threat_level, threat_score, captured_at) VALUES
  ('pkt-0001', 1, '10.12.24.80', 'HTTPS', 'Healthy', 34, 'Low', 12, NOW() - INTERVAL '5 minutes'),
  ('pkt-0002', 2, '10.13.25.81', 'DNS', 'Warning', 128, 'Medium', 58, NOW() - INTERVAL '12 minutes'),
  ('pkt-0003', 3, '10.14.26.82', 'TCP', 'Critical', 231, 'High', 91, NOW() - INTERVAL '18 minutes');

INSERT INTO logs (file_name, uploaded_by, parsed_rows, suspicious_activity, failed_requests) VALUES
  ('edge-gateway-2026-05-20.json', 1, 1280, 23, 61),
  ('core-switch-2026-05-20.txt', 2, 940, 14, 38);

INSERT INTO analytics (metric_name, metric_value, window_start, window_end) VALUES
  ('active_devices', 284, NOW() - INTERVAL '1 hour', NOW()),
  ('network_health', 96, NOW() - INTERVAL '1 hour', NOW()),
  ('packet_loss', 0.7, NOW() - INTERVAL '1 hour', NOW()),
  ('threat_detections', 17, NOW() - INTERVAL '1 hour', NOW());
