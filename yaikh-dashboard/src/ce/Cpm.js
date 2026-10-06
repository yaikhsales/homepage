// CE · CPM — cost per minute, Gamini's meaning: the month's factory cost ÷ the earned minutes.
// TOP: a strip like YWIP's, numbers only — warehouse → fabric wh → accessory wh → cutting → L01…L32 →
// finishing → packing, overhead apart — each section's CPM for the period against its plan, red only when
// over plan. A now / week / month toggle. The big running CPM against plan, budget, cost to date, earned
// minutes vs plan, efficiency, the projected month. A stock-style chart of the last 12 months (weekly
// open / high / low / close candles + the plan line) with the 3-month forecast. By line and by section
// tables, and the "how it's calculated" box with the reconciliation checks.
// Data: {"module":"ce","view":"cpm","period":"now|week|month"} → headline, strip[], history[], forecast[],
// by_line[], by_section[], explain[], checks[].
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { post, num, usd, cpm4, CostingNav, Panel, Tile, Chip, TONE, Th, Explain } from "./costing";

const PERIODS = [["now", "Now"], ["week", "This week"], ["month", "Month to date"]];
const KIND = { support: "border-slate-600", cutting: "border-sky-500/50", line: "border-emerald-500/40", finishing: "border-teal-500/50", packing: "border-violet-500/50", overhead: "border-amber-500/50" };
const short = (t) => String(t || "").replace("Warehouse (general)", "Warehouse").replace("Accessory warehouse", "Accessory wh").replace("Fabric warehouse", "Fabric wh").replace("Line ", "");

// the stock chart: a candle per month (weekly open / high / low / close) with the plan line, then the forecast
const Candles = ({ history, forecast, height = 220 }) => {
  const all = [...(history || []).map((h) => ({ ...h, kind: "history" })), ...(forecast || []).map((f) => ({ ...f, kind: "forecast" }))];
  if (!all.length) return null;
  const W = 1000, H = height, top = 16, base = H - 26, left = 48, right = W - 12;
  const vals = all.flatMap((h) => [h.high, h.low, h.plan, h.cpm].filter((v) => typeof v === "number"));
  const lo = Math.min(...vals) * 0.97, hi = Math.max(...vals) * 1.03;
  const n = all.length;
  const slot = (right - left) / n;
  const X = (i) => left + slot * (i + 0.5);
  const Y = (v) => base - ((base - top) * (v - lo)) / (hi - lo || 1);
  const cw = Math.min(slot * 0.5, 30);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((g) => { const v = lo + (hi - lo) * g; return <g key={g}><line x1={left} x2={right} y1={Y(v)} y2={Y(v)} stroke="#334155" strokeDasharray="3 4" /><text x={left - 4} y={Y(v) + 3} textAnchor="end" fontSize={9} fill="#64748b">{v.toFixed(3)}</text></g>; })}
      {/* plan line across history and forecast */}
      <polyline points={all.map((h, i) => `${X(i)},${Y(h.plan)}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" />
      {all.map((h, i) => {
        if (h.kind === "forecast") return <g key={i}><circle cx={X(i)} cy={Y(h.cpm)} r={4} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="2 2" /><text x={X(i)} y={Y(h.cpm) - 8} textAnchor="middle" fontSize={9} fill="#7dd3fc">{h.cpm.toFixed(4)}</text><text x={X(i)} y={H - 8} textAnchor="middle" fontSize={9} fill="#7dd3fc">{h.month}</text></g>;
        const up = h.close <= h.open; // cost per minute falling = good = green
        const col = h.cpm > h.plan ? "#f43f5e" : up ? "#34d399" : "#fbbf24";
        const yo = Y(h.open), yc = Y(h.close);
        return (
          <g key={i}>
            <line x1={X(i)} x2={X(i)} y1={Y(h.high)} y2={Y(h.low)} stroke={col} strokeWidth={1.5} />
            <rect x={X(i) - cw / 2} y={Math.min(yo, yc)} width={cw} height={Math.max(Math.abs(yc - yo), 2)} fill={h.running ? "none" : col} stroke={col} strokeWidth={h.running ? 2 : 0} rx={1} />
            <text x={X(i)} y={Y(h.high) - 5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#e2e8f0">{h.cpm.toFixed(4)}</text>
            <text x={X(i)} y={H - 8} textAnchor="middle" fontSize={9} fill={h.running ? "#fff" : "#94a3b8"} fontWeight={h.running ? 700 : 400}>{h.month}</text>
            <title>{`${h.month} · CPM ${h.cpm} vs plan ${h.plan} · open ${h.open} high ${h.high} low ${h.low} close ${h.close} · cost ${usd(h.cost)} · ${num(h.earned_minutes)} earned minutes · ${h.weeks} weeks${h.running ? " · running" : ""}`}</title>
          </g>
        );
      })}
    </svg>
  );
};

const Cpm = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setData(await post({ view: "cpm", period })); } catch (e) { setError("CPM is unavailable right now. Please try again in a moment."); } finally { setLoading(false); }
  }, [period]);
  useEffect(() => { load(); }, [load]);

  const d = data || {};
  const h = d.headline || {};
  const strip = useMemo(() => (data && data.strip) || [], [data]);
  const main = strip.filter((s) => s.kind !== "overhead");
  const overhead = strip.filter((s) => s.kind === "overhead");
  const val = (s) => (period === "now" ? s.now : period === "week" ? s.week : s.month !== undefined ? s.month : s.cpm);
  const lineVal = (l) => (period === "now" ? l.cpm_now : period === "week" ? l.cpm_week : l.cpm_month);
  const running = period === "now" ? h.now : period === "week" ? h.week : h.cpm;
  const over = typeof running === "number" && typeof h.plan_cpm === "number" && running > h.plan_cpm;
  const overCount = strip.filter((s) => (typeof val(s) === "number" && typeof s.plan_cpm === "number" ? val(s) > s.plan_cpm : s.over)).length;

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; } .cpm-strip::-webkit-scrollbar { height: 6px; } .cpm-strip::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">CPM · Cost per minute</h1>
        <CostingNav current="cpm" />
        <span className="text-xs text-slate-400">{h.month ? `${h.month} · as of ${h.as_of} · working days ${h.working_days}` : ""}</span>
        <div className="ml-auto inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{PERIODS.map(([k, l]) => <button key={k} onClick={() => setPeriod(k)} className={`px-3 py-1 font-bold ${period === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
        <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}

      {/* TOP — the strip, numbers only */}
      <div className="cpm-strip flex gap-1.5 overflow-x-auto pb-1.5 mb-1">
        {main.map((s) => { const v = val(s); const bad = typeof v === "number" && typeof s.plan_cpm === "number" ? v > s.plan_cpm : s.over; return (
          <div key={s.key} title={`${s.title} · ${s.basis || ""} · cost ${usd(s.cost)} · ${num(s.earned_minutes)} minutes`} className={`flex-shrink-0 w-[92px] rounded-lg border bg-slate-800/60 px-2 py-1.5 ${bad ? "border-rose-500 bg-rose-500/10" : KIND[s.kind] || "border-slate-700"}`}>
            <div className="text-[10px] text-slate-400 truncate">{short(s.title)}</div>
            <div className={`font-black tabular-nums text-sm leading-tight ${bad ? "text-rose-300" : "text-white"}`}>{cpm4(v)}</div>
            <div className="text-[10px] text-slate-500 tabular-nums">plan {cpm4(s.plan_cpm)}</div>
          </div>
        ); })}
        {overhead.length > 0 && <div className="flex-shrink-0 w-px bg-slate-600 mx-1" />}
        {overhead.map((s) => { const v = val(s); const bad = typeof v === "number" && typeof s.plan_cpm === "number" ? v > s.plan_cpm : s.over; return (
          <div key={s.key} title={`${s.title} · ${s.basis || ""}`} className={`flex-shrink-0 w-[110px] rounded-lg border bg-slate-800/60 px-2 py-1.5 ${bad ? "border-rose-500 bg-rose-500/10" : KIND.overhead}`}>
            <div className="text-[10px] text-amber-300 truncate">{s.title}</div>
            <div className={`font-black tabular-nums text-sm leading-tight ${bad ? "text-rose-300" : "text-white"}`}>{cpm4(v)}</div>
            <div className="text-[10px] text-slate-500 tabular-nums">plan {cpm4(s.plan_cpm)}</div>
          </div>
        ); })}
      </div>
      <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-500 mb-3"><span>each section's cost per earned minute for the period, against its plan share · red = over plan ({overCount} over)</span><span>warehouse → fabric wh → accessory wh → cutting → lines → finishing → packing · overhead apart</span></div>

      {/* the headline */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className={`rounded-xl border-2 px-4 py-2 ${over ? "border-rose-500 bg-rose-500/10" : "border-emerald-500/60 bg-emerald-500/10"}`}><div className="text-[10px] uppercase tracking-wider text-slate-400">running CPM · {PERIODS.find((p) => p[0] === period)[1]}</div><div className={`text-3xl font-black tabular-nums leading-none ${over ? "text-rose-300" : "text-emerald-300"}`}>{cpm4(running)}</div><div className="text-[11px] text-slate-400 mt-0.5">plan <b className="text-white">{cpm4(h.plan_cpm)}</b> USD a minute · {over ? "over plan" : "under plan"}</div></div>
        <Tile label="Month budget" value={usd(h.budget)} sub={`cost to date ${usd(h.cost_to_date)} · ${num(h.budget_used_pct, 1)}% used`} />
        <Tile label="Earned minutes to date" value={num(h.earned_to_date)} sub={`plan ${num(h.plan_to_date)} · ${num(h.earned_vs_plan_pct, 1)}%`} tone={h.earned_vs_plan_pct >= 100 ? "text-emerald-300" : "text-amber-300"} />
        <Tile label="Efficiency" value={num(h.efficiency, 1) + "%"} sub={`plan ${num(h.plan_efficiency, 1)}%`} tone={h.efficiency >= h.plan_efficiency ? "text-emerald-300" : "text-amber-300"} />
        <Tile label="Projected month CPM" value={cpm4(h.projected_month_cpm)} sub={`plan ${cpm4(h.plan_cpm)} · ${num(h.plan_minutes_month)} plan minutes`} tone={h.projected_month_cpm > h.plan_cpm ? "text-rose-300" : "text-emerald-300"} />
        <Tile label="Now · week · month" value={`${cpm4(h.now)} · ${cpm4(h.week)} · ${cpm4(h.cpm)}`} />
      </div>

      <Panel title="CPM — the last 12 months, weekly candles, and the next 3 months" right="candle = the month's weekly open / high / low / close · dashed = plan · hollow = the running month · dotted circles = forecast from the 4DP line plan">
        <Candles history={d.history} forecast={d.forecast} />
        {(d.forecast || []).length > 0 && <div className="mt-1 flex flex-wrap gap-x-4 text-[11px] text-slate-400">{d.forecast.map((f) => <span key={f.month}>{f.month}: <b className="text-white">{cpm4(f.cpm)}</b> · {num(f.pieces)} pcs × {f.avg_sam} min · eff {f.efficiency}%</span>)}</div>}
      </Panel>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] mt-3">
        <Panel title="By line" right="cost per earned minute of each sewing line">
          <div className="overflow-auto max-h-96">
            <table className="w-full text-xs"><Th cols={["Line", "Factory · unit", "Now", "Week", "Month", "Plan", "Cost", "Earned minutes", ""]} /><tbody>{(d.by_line || []).map((l) => { const v = lineVal(l); const bad = typeof v === "number" ? v > l.plan : l.over; return <tr key={l.line} className={`border-t border-slate-700/60 ${bad ? "bg-rose-500/10" : "hover:bg-slate-800/40"}`}><td className="px-2 py-1 font-bold text-white">{l.line}</td><td className="px-2 py-1 text-slate-400">{l.factory} · {l.unit}</td><td className={`px-2 py-1 tabular-nums text-right ${period === "now" ? "font-bold text-white" : "text-slate-300"}`}>{cpm4(l.cpm_now)}</td><td className={`px-2 py-1 tabular-nums text-right ${period === "week" ? "font-bold text-white" : "text-slate-300"}`}>{cpm4(l.cpm_week)}</td><td className={`px-2 py-1 tabular-nums text-right ${period === "month" ? "font-bold text-white" : "text-slate-300"}`}>{cpm4(l.cpm_month)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-400">{cpm4(l.plan)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{usd(l.cost)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(l.earned_minutes)}</td><td className="px-2 py-1">{bad ? <Chip cls={TONE.red}>over plan</Chip> : <Chip cls={TONE.green}>ok</Chip>}</td></tr>; })}</tbody></table>
          </div>
        </Panel>
        <Panel title="By section" right="each section's share of the factory CPM">
          <div className="overflow-auto max-h-96">
            <table className="w-full text-xs"><Th cols={["Section", "Now", "Week", "Month", "Plan", "Cost", "Minutes", ""]} /><tbody>{(d.by_section || []).map((s) => { const v = period === "now" ? s.cpm_now : period === "week" ? s.cpm_week : s.cpm_month; const bad = typeof v === "number" && typeof s.plan === "number" ? v > s.plan : s.over; return <tr key={s.section} className={`border-t border-slate-700/60 ${bad ? "bg-rose-500/10" : ""} ${/^Factory$/.test(s.section) ? "font-bold bg-slate-800/60" : ""}`}><td className="px-2 py-1 text-white">{s.section}</td><td className={`px-2 py-1 tabular-nums text-right ${period === "now" ? "font-bold text-white" : "text-slate-300"}`}>{cpm4(s.cpm_now)}</td><td className={`px-2 py-1 tabular-nums text-right ${period === "week" ? "font-bold text-white" : "text-slate-300"}`}>{cpm4(s.cpm_week)}</td><td className={`px-2 py-1 tabular-nums text-right ${period === "month" ? "font-bold text-white" : "text-slate-300"}`}>{cpm4(s.cpm_month)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-400">{cpm4(s.plan)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{usd(s.cost)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(s.earned_minutes)}</td><td className="px-2 py-1">{bad ? <Chip cls={TONE.red}>over</Chip> : null}</td></tr>; })}</tbody></table>
          </div>
        </Panel>
      </div>
      <div className="mt-3"><Explain lines={d.explain} checks={d.checks} /></div>
      <p className="mt-2 text-[10px] text-slate-500">{d.as_of ? `As of ${String(d.as_of).replace("T", " ").slice(0, 16)} · ` : ""}simulated factory — invented figures, no real company</p>
    </div>
  );
};

export default Cpm;
