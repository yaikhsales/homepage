// Live view of one sewing line, drawn as a line diagram (LineDiagram): every
// style has its own layout, a zig-zag line or a U-shape hanger line, with a few
// machines off-line. Last level of the 4DP plan
// (Master Plan → Unit Plan → Section Plan → Line Plan → this).
// Data: M1 /sim/view {module:"4dp", view:"line-live", line}. Simulated.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Maximize } from "lucide-react";

import LineDiagram, { withSteps } from "./LineDiagram";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const TONE = {
  green: { box: "border-emerald-500/60 bg-emerald-500/10", light: "bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.8)]", text: "text-emerald-300" },
  orange: { box: "border-amber-400 bg-amber-500/15", light: "bg-amber-400 shadow-[0_0_12px_3px_rgba(251,191,36,0.9)]", text: "text-amber-300" },
  red: { box: "border-rose-500 bg-rose-500/20", light: "bg-rose-500 shadow-[0_0_14px_4px_rgba(244,63,94,0.9)]", text: "text-rose-300" },
  idle: { box: "border-slate-600 bg-slate-800/60", light: "bg-slate-500", text: "text-slate-400" },
};
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v);

const LineLive = () => {
  const { line } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const order = search.get("order") || undefined; // a chosen order on this line; otherwise the one running now
  const garment = search.get("garment") || undefined;
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const n = Math.min(32, Math.max(1, parseInt(String(line || "L01").replace(/\D/g, ""), 10) || 1));
  const id = `L${String(n).padStart(2, "0")}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "4dp", view: "line-live", line: id, order, garment }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setD(j);
      setError("");
    } catch (e) {
      setError("Line data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [id, order, garment]);

  useEffect(() => { setD(null); load(); const t = setInterval(load, 20000); return () => clearInterval(t); }, [load]);

  const st = (d && d.stations) || [];
  const bad = withSteps(st).filter((x) => x.status === "red" || x.status === "orange");
  const go = (k) => navigate(`/dashboard/4dp/line/L${String(((n - 1 + k + 32) % 32) + 1).padStart(2, "0")}`);

  return (
    <div className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-6 pt-28 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
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
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-3">
          {/* figures in one row */}
          <div className="flex flex-wrap items-stretch gap-2">
            {d.summary.map((x) => (
              <div key={x.label} className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-1.5 min-w-[130px]">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{x.label}</div>
                <div className={`text-2xl font-black tabular-nums leading-tight ${x.label === "Machines down" && x.value ? "text-rose-400" : "text-white"}`}>{num(x.value)}</div>
              </div>
            ))}
            <div className="flex flex-col justify-center gap-1 px-2 text-sm">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${d.running ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-300"}`}>{d.state_text || (d.running ? "running" : "not running")}</span>
                <span>Efficiency <b className="text-white">{d.efficiency}</b></span>
                <span>Daily target <b className="text-white">{num(d.target_day)}</b></span>
                <span>Machines <b className="text-white">{d.operators}</b></span>
                {d.layout_name && <span className="rounded-full px-2.5 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300">{d.layout_name} · {d.offline_machines} off-line</span>}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><span className={`inline-block w-3 h-3 rounded-full ${TONE.green.light}`} />Target OK · quality OK</span>
                <span className="flex items-center gap-1.5"><span className={`inline-block w-3 h-3 rounded-full ${TONE.orange.light}`} />Defects at this machine</span>
                <span className="flex items-center gap-1.5"><span className={`inline-block w-3 h-3 rounded-full ${TONE.red.light}`} />Machine breakdown</span>
                <span className="text-slate-400">number in the round = operation step</span>
              </div>
            </div>
          </div>

          {/* the line */}
          <div className="mt-1"><LineDiagram stations={st} layout={d.layout} size="big" /></div>

          {bad.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {bad.map((x) => (
                <li key={x.no} className={`flex items-center gap-2 ${TONE[x.status].text}`}>
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${x.status === "red" ? "bg-rose-500 animate-pulse" : "bg-amber-400"}`} />
                  <b className="text-white">Step {x.step} {x.op}{x.offline ? " (off-line)" : ""}</b> ({x.machine_id}) — {x.note}
                </li>
              ))}
            </ul>
          )}
          {!d.running && <div className="text-sm text-slate-400">Line is not running now (outside shift, or this order starts later).</div>}
        </div>
      )}
      <p className="mt-3 text-[11px] text-slate-500">{d ? `As of ${String(d.as_of).replace("T", " ").slice(0, 19)} · refreshes every 20 seconds · ` : ""}Simulated line — machine and operator codes are invented.</p>
    </div>
  );
};

export default LineLive;
