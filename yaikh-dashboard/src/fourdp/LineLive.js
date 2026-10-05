// Live view of one sewing line, drawn as a U-shaped hanger line: one box per
// machine with its operation, a status light and its count. Last level of the
// 4DP plan (Master Plan → Unit Plan → Line Plan T&A → Line Plan → this).
// Data: M1 /sim/view {module:"4dp", view:"line-live", line}. Simulated.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Maximize } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const TONE = {
  green: { box: "border-emerald-500/60 bg-emerald-500/10", light: "bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.8)]", text: "text-emerald-300" },
  orange: { box: "border-amber-400 bg-amber-500/15", light: "bg-amber-400 shadow-[0_0_12px_3px_rgba(251,191,36,0.9)]", text: "text-amber-300" },
  red: { box: "border-rose-500 bg-rose-500/20", light: "bg-rose-500 shadow-[0_0_14px_4px_rgba(244,63,94,0.9)]", text: "text-rose-300" },
  idle: { box: "border-slate-600 bg-slate-800/60", light: "bg-slate-500", text: "text-slate-400" },
};
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v);

function Station({ s }) {
  const t = TONE[s.status] || TONE.idle;
  return (
    <div title={`${s.machine_id} · ${s.operator} · ${s.note}`} className={`relative rounded-xl border ${t.box} px-2.5 py-1.5 w-full`} style={{ minHeight: 56 }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-slate-400 tabular-nums">#{String(s.no).padStart(2, "0")} · {s.machine}</span>
        <span className={`inline-block w-3 h-3 rounded-full ${t.light} ${s.status === "idle" ? "" : "animate-pulse"}`} />
      </div>
      <div className="text-xs font-bold text-white leading-tight truncate">{s.op}</div>
      <div className={`text-[10px] leading-tight truncate ${t.text}`}>
        {s.status === "red" ? "BREAKDOWN" : s.status === "orange" ? `${s.defects} defects` : s.status === "idle" ? "not running" : "OK"} · {num(s.pieces)}/{num(s.target)}
      </div>
    </div>
  );
}

const LineLive = () => {
  const { line } = useParams();
  const navigate = useNavigate();
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const n = Math.min(32, Math.max(1, parseInt(String(line || "L01").replace(/\D/g, ""), 10) || 1));
  const id = `L${String(n).padStart(2, "0")}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "4dp", view: "line-live", line: id }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setD(j);
      setError("");
    } catch (e) {
      setError("Line data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { setD(null); load(); const t = setInterval(load, 20000); return () => clearInterval(t); }, [load]);

  const st = (d && d.stations) || [];
  const side = Math.ceil((st.length - 5) / 2); // machines on each arm of the U
  const left = st.slice(0, side);
  const bottom = st.slice(side, st.length - side);
  const right = st.slice(st.length - side).reverse(); // flows back up the other arm
  const go = (k) => navigate(`/dashboard/4dp/line/L${String(((n - 1 + k + 32) % 32) + 1).padStart(2, "0")}`);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-6 pt-28 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard/4dp/line-plan")} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white" aria-label="Back to Line Plan"><ArrowLeft size={22} /></button>
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">4DP · Line Plan · live line · simulated factory</div>
            <h1 className="text-2xl font-black text-white leading-tight">{id}{d ? ` — ${d.factory}` : ""}</h1>
            <p className="text-sm text-slate-400">{d ? `${d.order} · customer ${d.customer} · ${d.garment} · ${num(d.pieces)} pcs · ${d.run}` : "Loading…"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-1 py-1">
            <button onClick={() => go(-1)} className="p-1.5 hover:bg-slate-700 rounded-lg" aria-label="Previous line"><ChevronLeft size={18} /></button>
            <span className="px-2 text-sm font-bold text-white tabular-nums">{id}</span>
            <button onClick={() => go(1)} className="p-1.5 hover:bg-slate-700 rounded-lg" aria-label="Next line"><ChevronRight size={18} /></button>
          </div>
          <button onClick={load} className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
          <button onClick={() => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen()} className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700" aria-label="Full screen"><Maximize size={16} /></button>
        </div>
      </div>

      {error && <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm">{error}</div>}

      {d && (
        <div className="grid gap-3" style={{ gridTemplateColumns: "minmax(170px, 1fr) minmax(0, 3.2fr) minmax(170px, 1fr)" }}>
          {/* left arm — garment enters at the top and travels down */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 text-center">cut pieces in ↓</div>
            {left.map((s) => <Station key={s.no} s={s} />)}
          </div>

          {/* middle — the open part of the U, then the bottom run */}
          <div className="flex flex-col justify-between gap-3">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {d.summary.map((x) => (
                  <div key={x.label} className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">{x.label}</div>
                    <div className={`text-3xl font-black tabular-nums leading-tight ${x.label === "Machines down" && x.value ? "text-rose-400" : "text-white"}`}>{num(x.value)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                <span>Efficiency <b className="text-white">{d.efficiency}</b></span>
                <span>Daily target <b className="text-white">{num(d.target_day)}</b></span>
                <span>Machines <b className="text-white">{d.operators}</b></span>
                <span className="text-slate-400">{d.running ? "Line is running" : "Line is not running now (outside shift, or this order starts later)"}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><span className={`inline-block w-3 h-3 rounded-full ${TONE.green.light}`} />Target OK · quality OK</span>
                <span className="flex items-center gap-1.5"><span className={`inline-block w-3 h-3 rounded-full ${TONE.orange.light}`} />Defects at this machine</span>
                <span className="flex items-center gap-1.5"><span className={`inline-block w-3 h-3 rounded-full ${TONE.red.light}`} />Machine breakdown</span>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {st.filter((s) => s.status === "red" || s.status === "orange").map((s) => (
                  <li key={s.no} className={TONE[s.status].text}>#{String(s.no).padStart(2, "0")} {s.op} ({s.machine_id}) — {s.note}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 text-center mb-1">→ hanger line turns →</div>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.max(bottom.length, 1)}, minmax(0, 1fr))` }}>
                {bottom.map((s) => <Station key={s.no} s={s} />)}
              </div>
            </div>
          </div>

          {/* right arm — travels back up to the end-line check */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 text-center">↑ finished garments out</div>
            {right.map((s) => <Station key={s.no} s={s} />)}
          </div>
        </div>
      )}
      <p className="mt-3 text-[11px] text-slate-500">{d ? `As of ${String(d.as_of).replace("T", " ").slice(0, 19)} · refreshes every 20 seconds · ` : ""}Simulated line — machine and operator codes are invented.</p>
    </div>
  );
};

export default LineLive;
