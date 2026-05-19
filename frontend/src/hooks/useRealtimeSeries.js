import { useEffect, useState } from "react";

export default function useRealtimeSeries(initialData, intervalMs = 2000) {
  const [series, setSeries] = useState(initialData);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeries((current) => {
        const last = current[current.length - 1];
        const nextLatency = Math.max(14, Math.round((last?.latency || 45) + (Math.random() - 0.45) * 22));
        const nextPoint = {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          latency: nextLatency,
          jitter: Math.max(4, Math.round((last?.jitter || 12) + (Math.random() - 0.5) * 8)),
        };
        return [...current.slice(1), nextPoint];
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return series;
}
