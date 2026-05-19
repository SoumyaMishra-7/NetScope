-- Filter packets by protocol and status.
SELECT p.*, d.name AS device_name, d.zone
FROM packets p
JOIN devices d ON d.id = p.device_id
WHERE ($1::text IS NULL OR p.protocol = $1)
  AND ($2::text IS NULL OR p.status = $2)
ORDER BY p.captured_at DESC
LIMIT 50;

-- Sort packets by latency for incident triage.
SELECT p.id, p.ip_address, p.protocol, p.latency_ms, p.threat_level, d.name AS device_name
FROM packets p
JOIN devices d ON d.id = p.device_id
ORDER BY p.latency_ms DESC
LIMIT 20;

-- Protocol analytics for dashboard pie charts.
SELECT protocol, COUNT(*) AS packet_count
FROM packets
GROUP BY protocol
ORDER BY packet_count DESC;

-- Threat detection summary for security overview cards.
SELECT threat_level, COUNT(*) AS total, AVG(threat_score)::numeric(5,2) AS average_score
FROM packets
GROUP BY threat_level
ORDER BY average_score DESC;

-- Failed request and suspicious activity summary from uploaded logs.
SELECT
  SUM(parsed_rows) AS parsed_rows,
  SUM(suspicious_activity) AS suspicious_activity,
  SUM(failed_requests) AS failed_requests
FROM logs
WHERE uploaded_at >= NOW() - INTERVAL '24 hours';

-- Device health rollup by network zone.
SELECT zone, status, COUNT(*) AS devices
FROM devices
GROUP BY zone, status
ORDER BY zone, status;
