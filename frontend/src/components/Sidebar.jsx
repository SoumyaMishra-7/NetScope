import { Activity, BarChart3, ChevronLeft, ChevronRight, LogOut, Settings, Shield, UploadCloud } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { classNames } from "../utils/formatters";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Activity },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/packet/pkt-0001", label: "Packet Viewer", icon: Shield },
  { to: "/upload", label: "Upload Logs", icon: UploadCloud },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("netscope.auth");
    navigate("/login");
  };

  return (
    <>
      <div
        className={classNames("fixed inset-0 z-40 bg-black/60 transition lg:hidden", mobileOpen ? "block" : "hidden")}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 z-50 flex border-r border-white/10 bg-[#07101d]/95 backdrop-blur-xl transition-all duration-300 lg:sticky lg:top-0 lg:z-40",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex w-full flex-col p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
                <Shield size={22} />
              </div>
              {!collapsed ? (
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-semibold text-white">NetScope X</h1>
                  <p className="text-xs text-slate-400">Network Analytics</p>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-300 lg:block"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="mt-8 grid gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  classNames(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive ? "bg-cyan-300/12 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.25)]" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100",
                    collapsed && "justify-center"
                  )
                }
              >
                <link.icon size={19} />
                {!collapsed ? <span>{link.label}</span> : null}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.04] p-3">
            {!collapsed ? (
              <>
                <p className="text-sm font-medium text-white">Live Sensor Mesh</p>
                <p className="mt-1 text-xs text-slate-400">284 devices streaming telemetry.</p>
              </>
            ) : null}
            <button
              type="button"
              onClick={logout}
              className={classNames("mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.1]", collapsed && "mt-0")}
            >
              <LogOut size={16} />
              {!collapsed ? "Sign out" : null}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
