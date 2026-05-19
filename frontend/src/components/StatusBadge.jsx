import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { classNames } from "../utils/formatters";

const styles = {
  Healthy: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Warning: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  Critical: "border-rose-400/35 bg-rose-400/10 text-rose-100",
  Low: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Medium: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  High: "border-rose-400/35 bg-rose-400/10 text-rose-100",
};

const icons = {
  Healthy: CheckCircle2,
  Warning: AlertTriangle,
  Critical: ShieldAlert,
  Low: CheckCircle2,
  Medium: AlertTriangle,
  High: ShieldAlert,
};

export default function StatusBadge({ value }) {
  const Icon = icons[value] || CheckCircle2;

  return (
    <span className={classNames("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", styles[value])}>
      <Icon size={13} />
      {value}
    </span>
  );
}
