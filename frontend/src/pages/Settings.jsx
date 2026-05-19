import { Bell, Database, Lock, SlidersHorizontal } from "lucide-react";

const settings = [
  { title: "API Connector", detail: "FastAPI endpoint, timeout, and fallback mock mode.", icon: Database },
  { title: "Threat Policy", detail: "Detection thresholds for latency, failed requests, and protocols.", icon: SlidersHorizontal },
  { title: "Access Control", detail: "Demo authentication state and protected route behavior.", icon: Lock },
  { title: "Alerts", detail: "Notification preferences for high-risk packet events.", icon: Bell },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-cyan-200">Settings</p>
        <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Workspace Configuration</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        {settings.map((item) => (
          <article key={item.title} className="glass-panel rounded-lg p-5">
            <item.icon size={22} className="text-cyan-200" />
            <h2 className="mt-4 text-base font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
            <label className="mt-5 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-3 py-3 text-sm text-slate-300">
              Enabled
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-cyan-300" />
            </label>
          </article>
        ))}
      </section>
    </div>
  );
}
