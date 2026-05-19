export function formatDateTime(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function compactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function classNames(...values) {
  return values.filter(Boolean).join(" ");
}
