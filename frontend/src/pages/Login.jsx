import { motion } from "framer-motion";
import { Eye, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const login = (event) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      localStorage.setItem("netscope.auth", "true");
      navigate(location.state?.from || "/dashboard", { replace: true });
    }, 600);
  };

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-2xl md:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-[linear-gradient(135deg,rgba(45,212,191,0.14),rgba(96,165,250,0.08)),url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-8 md:block">
          <div className="flex h-full flex-col justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-300/25 bg-black/30 px-3 py-2 text-sm text-cyan-100 backdrop-blur">
              <ShieldCheck size={18} />
              NetScope X
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-white">Real-time network analytics for security teams.</h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">Monitor latency, traffic patterns, devices, packet risk, and log intelligence from one operational dashboard.</p>
            </div>
          </div>
        </div>
        <form onSubmit={login} className="glass-panel rounded-none border-0 p-6 sm:p-8">
          <div className="mb-8">
            <div className="grid h-12 w-12 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
              <ShieldCheck size={24} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">Sign in</h2>
            <p className="mt-2 text-sm text-slate-400">Use any email and password to enter the demo workspace.</p>
          </div>
          <label className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-slate-300 focus-within:border-cyan-300/50">
            <Mail size={18} />
            <input required type="email" placeholder="security@company.com" className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500" />
          </label>
          <label className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-slate-300 focus-within:border-cyan-300/50">
            <Lock size={18} />
            <input required type="password" placeholder="Password" className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500" />
            <Eye size={18} className="text-slate-500" />
          </label>
          <label className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" className="h-4 w-4 accent-cyan-300" />
            Remember this device
          </label>
          <button disabled={loading} className="w-full rounded-lg bg-cyan-300 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-60">
            {loading ? "Authenticating..." : "Enter dashboard"}
          </button>
        </form>
      </motion.section>
    </main>
  );
}
