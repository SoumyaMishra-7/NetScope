import { Activity, Gauge, RadioTower, Router, ShieldAlert, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard";
import DashboardCard from "../components/DashboardCard";
import LoaderSkeleton from "../components/LoaderSkeleton";
import NetworkTable from "../components/NetworkTable";
import { latencySeries, packets, protocolDistribution, trafficSeries } from "../data/mockData";
import useRealtimeSeries from "../hooks/useRealtimeSeries";
import { getAnalytics, getPackets } from "../services/api";
import { compactNumber } from "../utils/formatters";

export default function Dashboard() {
  const realtimeLatency = useRealtimeSeries(latencySeries);
  const [analytics, setAnalytics] = useState(null);
  const [packetRows, setPacketRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const [analyticsResponse, packetsResponse] = await Promise.all([getAnalytics(), getPackets()]);
      setAnalytics(analyticsResponse.data);
      setPacketRows(packetsResponse.data.packets || packets);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <LoaderSkeleton rows={8} />;
  }

  const cards = [
    { title: "Active Devices", value: analytics.activeDevices, change: "+18 devices in 24h", icon: Router, tone: "cyan" },
    { title: "Network Health", value: `${analytics.networkHealth}%`, change: "SLA stable across zones", icon: Wifi, tone: "emerald" },
    { title: "Packet Loss", value: `${analytics.packetLoss}%`, change: "0.2% below weekly avg", icon: Activity, tone: "amber" },
    { title: "Active Connections", value: compactNumber(analytics.activeConnections), change: "Peaked 11 minutes ago", icon: RadioTower, tone: "blue" },
    { title: "System Latency", value: `${analytics.systemLatency} ms`, change: "Realtime p95 tracking", icon: Gauge, tone: "cyan" },
    { title: "Threat Detection", value: analytics.threatDetections, change: "4 high confidence events", icon: ShieldAlert, tone: "rose" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-cyan-200">Real-Time Network Analytics Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">NetScope X Command Center</h1>
        </div>
        <span className="w-fit rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">Live telemetry online</span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => <DashboardCard key={card.title} {...card} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartCard title="Realtime Latency" subtitle="Updated every 2 seconds from simulated telemetry">
          <ResponsiveContainer>
            <LineChart data={realtimeLatency}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.14)" />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#0b1424", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="latency" stroke="#67e8f9" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="jitter" stroke="#f8c471" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Protocol Distribution" subtitle="Traffic share by decoded protocol">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={protocolDistribution} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100} paddingAngle={4}>
                {protocolDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0b1424", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <ChartCard title="Traffic Analytics" subtitle="Inbound, outbound, and blocked request volume">
        <ResponsiveContainer>
          <AreaChart data={trafficSeries}>
            <defs>
              <linearGradient id="inbound" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.35} /><stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} /></linearGradient>
              <linearGradient id="outbound" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#60a5fa" stopOpacity={0.28} /><stop offset="95%" stopColor="#60a5fa" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.14)" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "#0b1424", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="inbound" stroke="#2dd4bf" fill="url(#inbound)" />
            <Area type="monotone" dataKey="outbound" stroke="#60a5fa" fill="url(#outbound)" />
            <Area type="monotone" dataKey="blocked" stroke="#fb7185" fill="#fb718522" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <NetworkTable packets={packetRows} />
    </div>
  );
}
