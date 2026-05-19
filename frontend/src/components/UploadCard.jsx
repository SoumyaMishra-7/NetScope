import { CheckCircle2, FileJson, FileText, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { uploadLogs } from "../services/api";

export default function UploadCard() {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".txt") && !file.name.endsWith(".json")) {
      setError("Only .txt and .json logs are supported.");
      return;
    }

    setError("");
    setSummary(null);
    setProgress(12);
    const progressTimer = window.setInterval(() => {
      setProgress((value) => Math.min(92, value + 16));
    }, 160);

    try {
      const response = await uploadLogs(file);
      setSummary(response.data);
      setProgress(100);
    } catch {
      setError("Upload failed. Please retry with a smaller log file.");
    } finally {
      window.clearInterval(progressTimer);
    }
  };

  return (
    <section className="glass-panel rounded-lg p-5">
      <div
        onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={`grid place-items-center rounded-lg border border-dashed p-8 text-center transition ${dragActive ? "border-cyan-300 bg-cyan-300/10" : "border-white/15 bg-white/[0.03]"}`}
      >
        <input ref={inputRef} type="file" accept=".txt,.json" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
        <div className="grid h-14 w-14 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
          <UploadCloud size={28} />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-white">Upload Network Logs</h2>
        <p className="mt-2 max-w-md text-sm text-slate-400">Drop .txt or .json logs to parse suspicious activity, failed requests, and session health.</p>
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
          Select log file
        </button>
      </div>

      {progress > 0 ? (
        <div className="mt-5">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Parsing telemetry</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-4 rounded-lg border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">{error}</p> : null}

      {summary ? (
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            ["Parsed Rows", summary.parsedRows, FileText],
            ["Suspicious", summary.suspiciousActivity, FileJson],
            ["Failed Requests", summary.failedRequests, UploadCloud],
            ["Risk Score", `${summary.riskScore}%`, CheckCircle2],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <Icon size={18} className="text-cyan-200" />
              <p className="mt-3 text-sm text-slate-400">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
