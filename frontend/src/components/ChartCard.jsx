export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <section className="glass-panel rounded-lg p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="h-72">{children}</div>
    </section>
  );
}
