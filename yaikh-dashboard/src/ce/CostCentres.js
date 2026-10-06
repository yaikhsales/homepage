// CE · Cost Centers — the manpower dashboard, visual only: the same strip of sections as CPM, each with
// its direct / indirect headcount and cost, OT hours, Sundays / holidays, premium cost, and its CPM with
// and without premium; a section is flagged red when OT runs over 2 h a day per worker. Headline tiles
// and the 12-month trend (direct / indirect labour, OT hours and pay, holiday pay).
// Data: {"module":"ce","view":"cost-centres-manpower"} → headline, strip[], trend[], checks[], rows[].
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { post, num, usd, cpm4, CostingNav, Panel, Tile, Chip, TONE, Th, Explain, InfoI } from "./costing";

const KIND = { support: "border-slate-600", cutting: "border-sky-500/50", line: "border-emerald-500/40", finishing: "border-teal-500/50", packing: "border-violet-500/50", overhead: "border-amber-500/50" };
const short = (t) => String(t || "").replace("Warehouse (general)", "Warehouse").replace("Accessory warehouse", "Accessory wh").replace("Fabric warehouse", "Fabric wh").replace("Line ", "");

// 12-month trend: direct + indirect labour as stacked bars, OT hours as a line
const Trend = ({ rows, height = 200 }) => {
  if (!rows || !rows.length) return null;
  const W = 1000, H = height, left = 60, right = W - 60, top = 14, base = H - 26;
  const maxCost = Math.max(1, ...rows.map((r) => (r.direct_cost || 0) + (r.indirect_cost || 0)));
  const maxOt = Math.max(1, ...rows.map((r) => r.ot_hours || 0));
  const slot = (right - left) / rows.length;
  const X = (i) => left + slot * (i + 0.5);
  const Yc = (v) => base - ((base - top) * v) / maxCost;
  const Yo = (v) => base - ((base - top) * v) / maxOt;
  const bw = Math.min(slot * 0.55, 44);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      {[0.5, 1].map((g) => <g key={g}><line x1={left} x2={right} y1={Yc(maxCost * g)} y2={Yc(maxCost * g)} stroke="#334155" strokeDasharray="3 4" /><text x={left - 4} y={Yc(maxCost * g) + 3} textAnchor="end" fontSize={9} fill="#64748b">{Math.round((maxCost * g) / 1000)}k</text><text x={right + 4} y={Yo(maxOt * g) + 3} fontSize={9} fill="#fbbf24">{num(Math.round(maxOt * g))} h</text></g>)}
      {rows.map((r, i) => <g key={r.month}><rect x={X(i) - bw / 2} y={Yc(r.direct_cost)} width={bw} height={base - Yc(r.direct_cost)} fill="#38bdf8" opacity={r.running ? 0.6 : 1} /><rect x={X(i) - bw / 2} y={Yc(r.direct_cost + r.indirect_cost)} width={bw} height={Yc(r.direct_cost) - Yc(r.direct_cost + r.indirect_cost)} fill="#a78bfa" opacity={r.running ? 0.6 : 1} /><text x={X(i)} y={H - 8} textAnchor="middle" fontSize={9} fill={r.running ? "#fff" : "#94a3b8"} fontWeight={r.running ? 700 : 400}>{r.month}</text><title>{`${r.month}: direct ${usd(r.direct_cost)} (${num(r.direct_hc)} people) · indirect ${usd(r.indirect_cost)} (${num(r.indirect_hc)}) · OT ${num(r.ot_hours)} h = ${usd(r.ot_pay)} · holidays ${num(r.holiday_hours)} h = ${usd(r.holiday_pay)}${r.running ? " · running" : ""}`}</title></g>)}
      <polyline points={rows.map((r, i) => `${X(i)},${Yo(r.ot_hours)}`).join(" ")} fill="none" stroke="#fbbf24" strokeWidth={2.5} strokeLinejoin="round" />
      {rows.map((r, i) => <circle key={"o" + i} cx={X(i)} cy={Yo(r.ot_hours)} r={3} fill="#fbbf24" />)}
    </svg>
  );
};

const CostCentres = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pick, setPick] = useState("");
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setData(await post({ view: "cost-centres-manpower" })); } catch (e) { setError("The manpower dashboard is unavailable right now. Please try again in a moment."); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const d = data || {};
  const h = d.headline || {};
  const strip = useMemo(() => (data && data.strip) || [], [data]);
  const sel = strip.find((s) => s.key === pick) || strip.find((s) => s.flag) || strip[0];
  const flagged = strip.filter((s) => s.flag);

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 484px; } .cc-strip::-webkit-scrollbar { height: 6px; } .cc-strip::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">Cost Centers · manpower</h1>
        <CostingNav current="cost-centers" />
        <span className="text-xs text-slate-400">{h.month ? `${h.month} · as of ${h.as_of} · OT 150% · Sunday / holiday 200%` : ""}</span>
        <button onClick={load} className="ml-auto p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm flex items-center gap-2">{error}<button onClick={load} className="rounded border border-amber-400/50 px-2 py-0.5 text-xs font-bold hover:bg-amber-500/10">Retry</button></div>}

      {/* the strip: a section's manpower at a glance; red = OT over 2 h a day per worker */}
      <div className="cc-strip flex gap-1.5 overflow-x-auto pb-1.5 mb-1">
        {strip.map((s) => (
          <button key={s.key} onClick={() => setPick(s.key)} title={`${s.title} · ${s.flag_text || "no flag"}`} className={`flex-shrink-0 w-[108px] rounded-lg border bg-slate-800/60 px-2 py-1.5 text-left ${s.flag ? "border-rose-500 bg-rose-500/10" : KIND[s.kind] || "border-slate-700"} ${sel && sel.key === s.key ? "ring-2 ring-sky-400" : ""}`}>
            <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">{s.flag && <AlertTriangle size={10} className="text-rose-300" />}{short(s.title)}</div>
            <div className="font-black tabular-nums text-sm leading-tight text-white">{num(s.direct_hc)}<span className="text-slate-500 font-normal"> + </span>{num(s.indirect_hc)}</div>
            <div className="text-[10px] text-slate-500 tabular-nums">{usd(s.labour_cost)}</div>
            <div className={`text-[10px] tabular-nums ${s.flag ? "text-rose-300 font-bold" : "text-slate-500"}`}>OT {num(s.ot_hours_per_worker_day, 1)} h/d</div>
          </button>
        ))}
      </div>
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-500"><InfoI text={`Direct + indirect headcount, labour cost this month and OT hours a day per worker; red = over 2 h (${flagged.length} sections). Click a section for its detail.`} /><span>{flagged.length} section{flagged.length === 1 ? "" : "s"} over 2 h OT · click a section</span></div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Tile label="Direct" value={`${num(h.direct_hc)} people`} sub={usd(h.direct_cost)} />
        <Tile label="Indirect" value={`${num(h.indirect_hc)} people`} sub={usd(h.indirect_cost)} />
        <Tile label="Direct : indirect" value={h.ratio || "—"} sub={`labour ${usd(h.labour_cost)}`} />
        <Tile label="OT hours" value={`${num(h.ot_hours_today)} today`} sub={`${num(h.ot_hours_week)} this week · ${num(h.ot_hours_mtd)} month to date`} tone="text-amber-300" />
        <Tile label="OT cost MTD" value={usd(h.ot_cost_mtd)} sub={`Sunday + holiday ${usd(h.holiday_cost_mtd)} · premium ${usd(h.premium_mtd)}`} tone="text-amber-300" />
        <Tile label="CPM with / without premium" value={`${cpm4(h.cpm_with)} / ${cpm4(h.cpm_without)}`} sub={`premium adds ${((h.cpm_with || 0) - (h.cpm_without || 0)).toFixed(4)} a minute`} />
        <Tile label="Sections over 2 h OT" value={num((h.flagged || []).length)} sub={(h.flagged || []).join(", ")} tone={(h.flagged || []).length ? "text-rose-300" : "text-emerald-300"} />
      </div>

      {sel && (
        <Panel title={`${sel.title}`} right={sel.flag ? <span className="text-rose-300 font-bold">{sel.flag_text}</span> : "within 2 h OT a day"} className="mb-3">
          <div className="flex flex-wrap gap-2">
            <Tile label="Direct" value={`${num(sel.direct_hc)} · ${usd(sel.direct_cost)}`} />
            <Tile label="Indirect" value={`${num(sel.indirect_hc)} · ${usd(sel.indirect_cost)}`} sub={sel.ratio} />
            <Tile label="OT hours" value={`${num(sel.ot_hours_now, 1)} now`} sub={`${num(sel.ot_hours_week, 1)} week · ${num(sel.ot_hours_month, 1)} month · ${num(sel.ot_workers_month, 1)} workers`} />
            <Tile label="OT a day per worker" value={num(sel.ot_hours_per_worker_day, 2) + " h"} sub={`${num(sel.days_over_2h)} day(s) over 2 h`} tone={sel.flag ? "text-rose-300" : "text-emerald-300"} />
            <Tile label="Sundays · holidays" value={`${num(sel.sundays && sel.sundays.days)} · ${num(sel.holidays && sel.holidays.days)}`} sub={`${num(sel.sundays && sel.sundays.hours, 1)} h + ${num(sel.holidays && sel.holidays.hours, 1)} h`} />
            <Tile label="Premium cost" value={usd(sel.premium_cost)} sub={`OT pay ${usd(sel.ot_pay)} · holiday pay ${usd(sel.holiday_pay)}`} tone="text-amber-300" />
            <Tile label="CPM with / without" value={`${cpm4(sel.cpm_with)} / ${cpm4(sel.cpm_without)}`} sub={`premium effect ${typeof sel.cpm_effect === "number" ? sel.cpm_effect.toFixed(4) : "—"}`} />
            <Tile label="Cost to date" value={usd(sel.cost_to_date)} sub={`labour ${usd(sel.labour_to_date)} · ${num(sel.minutes_to_date)} minutes`} />
          </div>
        </Panel>
      )}

      <Panel title="12-month trend" right={<span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-2 bg-sky-400" />direct labour <span className="inline-block w-3 h-2 bg-violet-400" />indirect <span className="inline-block w-3 h-0.5 bg-amber-400" />OT hours</span>}>
        <Trend rows={d.trend} />
      </Panel>

      <Panel title="All sections" right="direct / indirect headcount and cost, OT, premium, CPM with and without premium" className="mt-3">
        <div className="overflow-auto max-h-[28rem]">
          <table className="w-full text-xs">
            <Th cols={["Section", "Direct", "Direct cost", "Indirect", "Indirect cost", "Ratio", "OT now", "OT week", "OT month", "OT h / worker / day", "OT pay", "Holiday pay", "Premium", "CPM with", "CPM without", "Flag"]} />
            <tbody>{(d.rows || []).map((r) => <tr key={r.key} onClick={() => setPick(r.key)} className={`border-t border-slate-700/60 cursor-pointer ${r.flag_text ? "bg-rose-500/10" : "hover:bg-slate-800/40"} ${sel && sel.key === r.key ? "ring-1 ring-sky-400/60" : ""}`}><td className="px-2 py-1 text-white font-bold whitespace-nowrap">{r.title}</td><td className="px-2 py-1 tabular-nums text-right">{num(r.direct_hc)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{usd(r.direct_cost)}</td><td className="px-2 py-1 tabular-nums text-right">{num(r.indirect_hc)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{usd(r.indirect_cost)}</td><td className="px-2 py-1 text-slate-400 whitespace-nowrap">{r.ratio}</td><td className="px-2 py-1 tabular-nums text-right">{num(r.ot_hours_now, 1)}</td><td className="px-2 py-1 tabular-nums text-right">{num(r.ot_hours_week, 1)}</td><td className="px-2 py-1 tabular-nums text-right">{num(r.ot_hours_month, 1)}</td><td className={`px-2 py-1 tabular-nums text-right font-bold ${r.flag_text ? "text-rose-300" : "text-slate-200"}`}>{num(r.ot_hours_per_worker_day, 2)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{usd(r.ot_pay)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{usd(r.holiday_pay)}</td><td className="px-2 py-1 tabular-nums text-right text-amber-300">{usd(r.premium_cost)}</td><td className="px-2 py-1 tabular-nums text-right">{cpm4(r.cpm_with)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-400">{cpm4(r.cpm_without)}</td><td className="px-2 py-1">{r.flag_text ? <Chip cls={TONE.red}>OT &gt; 2 h</Chip> : <Chip cls={TONE.green}>ok</Chip>}</td></tr>)}</tbody>
          </table>
        </div>
      </Panel>
      <div className="mt-3"><Explain lines={["Direct = the people on the earned minutes (operators, cutters, finishers, packers); indirect = everyone the section needs around them (leaders, QC, mechanics, helpers, warehouse staff).", "Premium = overtime at 150% and Sundays / public holidays at 200% on top of normal pay; CPM with premium = the section's cost to date ÷ its earned minutes, CPM without = the same with the premium taken out.", "A section is flagged when its overtime runs over 2 hours a day per worker — cost rising faster than output."]} checks={d.checks} /></div>
      <p className="mt-2 text-[10px] text-slate-500">{d.as_of ? `As of ${String(d.as_of).replace("T", " ").slice(0, 16)} · ` : ""}simulated factory — invented figures, no real company or person</p>
    </div>
  );
};

export default CostCentres;
