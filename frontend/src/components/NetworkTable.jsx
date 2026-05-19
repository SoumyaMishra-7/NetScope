import { ArrowDownUp, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { formatDateTime } from "../utils/formatters";
import SearchBar from "./SearchBar";
import StatusBadge from "./StatusBadge";

const pageSize = 8;

export default function NetworkTable({ packets }) {
  const [search, setSearch] = useState("");
  const [protocol, setProtocol] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState({ key: "timestamp", direction: "desc" });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 250);

  const filteredPackets = useMemo(() => {
    const searchText = debouncedSearch.toLowerCase();
    const result = packets
      .filter((packet) => protocol === "All" || packet.protocol === protocol)
      .filter((packet) => status === "All" || packet.status === status)
      .filter((packet) => {
        return [packet.ipAddress, packet.protocol, packet.status, packet.threatLevel, packet.id]
          .join(" ")
          .toLowerCase()
          .includes(searchText);
      })
      .sort((a, b) => {
        const first = a[sort.key];
        const second = b[sort.key];
        const direction = sort.direction === "asc" ? 1 : -1;
        return first > second ? direction : -direction;
      });

    return result;
  }, [packets, debouncedSearch, protocol, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredPackets.length / pageSize));
  const visiblePackets = filteredPackets.slice((page - 1) * pageSize, page * pageSize);

  const updateSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <section className="glass-panel rounded-lg p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Advanced Network Table</h2>
          <p className="mt-1 text-sm text-slate-400">Search, filter, sort, and inspect packet telemetry.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search IP, protocol, threat..." />
          <select value={protocol} onChange={(event) => { setProtocol(event.target.value); setPage(1); }} className="rounded-lg border border-white/10 bg-[#0b1424] px-3 py-2 text-sm text-white outline-none">
            {["All", "TCP", "UDP", "HTTP", "HTTPS", "DNS", "ICMP"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border border-white/10 bg-[#0b1424] px-3 py-2 text-sm text-white outline-none">
            {["All", "Healthy", "Warning", "Critical"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {[
                ["ipAddress", "IP Address"],
                ["protocol", "Protocol"],
                ["status", "Status"],
                ["latency", "Latency"],
                ["threatLevel", "Threat Level"],
                ["timestamp", "Timestamp"],
              ].map(([key, label]) => (
                <th key={key} className="px-3 py-2">
                  <button type="button" onClick={() => updateSort(key)} className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-100">
                    {label}
                    <ArrowDownUp size={13} />
                  </button>
                </th>
              ))}
              <th className="px-3 py-2">View</th>
            </tr>
          </thead>
          <tbody>
            {visiblePackets.map((packet) => (
              <tr key={packet.id} className="rounded-lg bg-white/[0.035] text-slate-200">
                <td className="rounded-l-lg px-3 py-3 font-mono text-xs text-cyan-100">{packet.ipAddress}</td>
                <td className="px-3 py-3">{packet.protocol}</td>
                <td className="px-3 py-3"><StatusBadge value={packet.status} /></td>
                <td className="px-3 py-3">{packet.latency} ms</td>
                <td className="px-3 py-3"><StatusBadge value={packet.threatLevel} /></td>
                <td className="px-3 py-3 text-slate-400">{formatDateTime(packet.timestamp)}</td>
                <td className="rounded-r-lg px-3 py-3">
                  <Link to={`/packet/${packet.id}`} className="inline-flex rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-100 hover:bg-cyan-300/20" aria-label={`View ${packet.id}`}>
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>{filteredPackets.length} packets matched</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-lg border border-white/10 bg-white/[0.04] p-2 disabled:opacity-40">
            <ChevronLeft size={16} />
          </button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded-lg border border-white/10 bg-white/[0.04] p-2 disabled:opacity-40">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
