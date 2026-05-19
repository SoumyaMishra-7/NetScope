export default function PacketInfoCard({ title, items }) {
  return (
    <section className="glass-panel rounded-lg p-4">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <dl className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <dt className="text-sm text-slate-400">{item.label}</dt>
            <dd className="text-right text-sm font-medium text-slate-100">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
