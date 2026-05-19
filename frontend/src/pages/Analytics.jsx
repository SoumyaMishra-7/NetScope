import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/ChartCard";
import NetworkTable from "../components/NetworkTable";
import StatusBadge from "../components/StatusBadge";
import { packets } from "../data/mockData";

const topTalkers = [
  { segment: "DMZ", events: 312, risk: 62 },
  { segment: "Cloud", events: 246, risk: 54 },
  { segment: "Production", events: 198, risk: 43 },
  { segment: "Branch", events: 132, risk: 37 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-200">Analytics</p>
        <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Traffic Intelligence</h1>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="glass-panel rounded-lg p-4">
          <h2 className="text-base font-semibold text-white">Threat Summary</h2>
          <div className="mt-4 space-y-3">
            {["High", "Medium", "Low"].map((level) => (
              <div key={level} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-3 py-3">
                <StatusBadge value={level} />
                <span className="text-sm text-slate-300">{packets.filter((packet) => packet.threatLevel === level).length} packets</span>
              </div>
            ))}
          </div>
        </div>
        <ChartCard title="Risk by Network Segment" subtitle="Events and weighted risk score by zone">
          <ResponsiveContainer>
            <BarChart data={topTalkers}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.14)" />
              <XAxis dataKey="segment" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0b1424", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
              <Bar dataKey="events" fill="#67e8f9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="risk" fill="#fb7185" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <NetworkTable packets={packets} />
    </div>
  );
}
