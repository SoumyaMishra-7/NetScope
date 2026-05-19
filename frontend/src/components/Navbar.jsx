import { Menu, Search, ShieldCheck } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07101d]/85 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-200 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="hidden min-w-0 max-w-xl flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-400 md:flex">
          <Search size={16} className="text-cyan-200" />
          Search packets, IPs, protocols, devices
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">Security Operations</p>
            <p className="text-xs text-slate-400">Production workspace</p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
