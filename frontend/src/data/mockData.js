export const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "ICMP"];
export const statuses = ["Healthy", "Warning", "Critical"];

const now = Date.now();

export const packets = Array.from({ length: 48 }, (_, index) => {
  const protocol = protocols[index % protocols.length];
  const status = statuses[(index + (index % 4 === 0 ? 1 : 0)) % statuses.length];
  const latency = Math.round(18 + Math.random() * 170 + (status === "Critical" ? 95 : 0));
  const threatScore = status === "Critical" ? 88 + (index % 9) : status === "Warning" ? 48 + (index % 20) : 8 + (index % 24);

  return {
    id: `pkt-${String(index + 1).padStart(4, "0")}`,
    ipAddress: `10.${12 + (index % 6)}.${24 + (index % 12)}.${80 + index}`,
    protocol,
    status,
    latency,
    threatLevel: threatScore > 80 ? "High" : threatScore > 45 ? "Medium" : "Low",
    threatScore,
    timestamp: new Date(now - index * 1000 * 60 * 17).toISOString(),
    device: {
      name: ["Edge Gateway", "Core Switch", "API Node", "DNS Relay", "VPN Concentrator", "IoT Segment"][index % 6],
      mac: `A4:9D:${String(20 + index).padStart(2, "0")}:7C:${String(50 + index).padStart(2, "0")}:B${index % 9}`,
      zone: ["DMZ", "Production", "Branch", "Cloud", "Internal"][index % 5],
      owner: ["Security Ops", "Platform", "Network Team"][index % 3],
    },
  };
});

export const latencySeries = Array.from({ length: 16 }, (_, index) => ({
  time: `${String(index + 8).padStart(2, "0")}:00`,
  latency: 32 + Math.round(Math.sin(index / 2) * 16 + Math.random() * 28),
  jitter: 8 + Math.round(Math.random() * 18),
}));

export const trafficSeries = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}m`,
  inbound: 280 + Math.round(Math.random() * 240),
  outbound: 180 + Math.round(Math.random() * 190),
  blocked: 18 + Math.round(Math.random() * 64),
}));

export const protocolDistribution = [
  { name: "HTTPS", value: 38, color: "#2dd4bf" },
  { name: "TCP", value: 24, color: "#60a5fa" },
  { name: "DNS", value: 16, color: "#f8c471" },
  { name: "UDP", value: 13, color: "#a78bfa" },
  { name: "ICMP", value: 9, color: "#fb7185" },
];

export const timeline = [
  { label: "Packet captured", detail: "Mirrored from core switch span port", tone: "cyan" },
  { label: "Protocol decoded", detail: "TLS handshake and DNS metadata extracted", tone: "blue" },
  { label: "Threat model scored", detail: "Behavior compared against baseline profile", tone: "amber" },
  { label: "Policy evaluated", detail: "Matched zero-trust east-west traffic rule", tone: "emerald" },
];
