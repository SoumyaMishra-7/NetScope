import { GitBranch, Server, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useParams } from "react-router-dom";
import ChartCard from "../components/ChartCard";
import PacketInfoCard from "../components/PacketInfoCard";
import StatusBadge from "../components/StatusBadge";
import { latencySeries, packets, timeline } from "../data/mockData";
import { formatDateTime } from "../utils/formatters";

export default function PacketViewer() {
  const { id } = useParams();
  const packet = useMemo(() => packets.find((item) => item.id === id) || packets[0], [id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-cyan-200">Packet Viewer</p>
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{packet.id}</h1>
        </div>
        <div className="flex gap-2"><StatusBadge value={packet.status} /><StatusBadge value={packet.threatLevel} /></div>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <PacketInfoCard title="Packet Metadata" items={[
          { label: "IP Address", value: packet.ipAddress },
          { label: "Protocol", value: packet.protocol },
          { label: "Latency", value: `${packet.latency} ms` },
          { label: "Timestamp", value: formatDateTime(packet.timestamp) },
        ]} />
        <PacketInfoCard title="Device Info" items={[
          { label: "Device", value: packet.device.name },
          { label: "MAC", value: packet.device.mac },
          { label: "Zone", value: packet.device.zone },
          { label: "Owner", value: packet.device.owner },
        ]} />
        <PacketInfoCard title="Threat Analysis" items={[
          { label: "Threat Level", value: packet.threatLevel },
          { label: "Threat Score", value: `${packet.threatScore}/100` },
          { label: "Policy", value: "Zero Trust East-West" },
          { label: "Action", value: packet.status === "Critical" ? "Quarantine suggested" : "Monitor" },
        ]} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard title="Latency Graph" subtitle="Request history from the selected packet path">
          <ResponsiveContainer>
            <LineChart data={latencySeries.map((point, index) => ({ ...point, latency: point.latency + (index % 4) * 8 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.14)" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0b1424", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="latency" stroke="#67e8f9" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="glass-panel rounded-lg p-4">
          <h2 className="text-base font-semibold text-white">Timeline Activity</h2>
          <div className="mt-5 space-y-4">
            {timeline.map((item, index) => (
              <div key={item.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
                    {index === 0 ? <Server size={16} /> : index === 1 ? <GitBranch size={16} /> : <ShieldAlert size={16} />}
                  </div>
                  {index < timeline.length - 1 ? <div className="h-8 w-px bg-white/10" /> : null}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
