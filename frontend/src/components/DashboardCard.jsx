import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function DashboardCard({ title, value, change, icon: Icon, tone = "cyan" }) {
  const toneClass = {
    cyan: "from-cyan-400/20 text-cyan-200",
    emerald: "from-emerald-400/20 text-emerald-200",
    amber: "from-amber-300/20 text-amber-100",
    rose: "from-rose-400/20 text-rose-100",
    blue: "from-blue-400/20 text-blue-100",
  }[tone];

  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="glass-panel rounded-lg p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-normal text-white">{value}</h3>
        </div>
        <div className={`rounded-lg bg-gradient-to-br to-white/5 p-2.5 ${toneClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1 text-xs text-slate-400">
        <ArrowUpRight size={14} className="text-cyan-300" />
        {change}
      </p>
    </motion.article>
  );
}
