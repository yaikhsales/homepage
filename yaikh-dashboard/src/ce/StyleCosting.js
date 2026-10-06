// CE · Style Costing — every order part on the unit plan with its PLAN cost (CM = CPM × SAM, plus
// embroidery / printing / washing / heat transfer from the cost sheet, plus contingency) against the
// ACTUAL cost from the learning curve (the minutes the line really spent a piece), the variance red loss /
// green saving, FOB and margin. Click an order → its cost build-up as a waterfall next to the actual, and
// the day-by-day learning curve behind the actual cost.
// Data: {"module":"ce","view":"style-costing-plan"} → rows[], tables.extras, tables.actual_days, cpm,
// op_rate, contingency.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Search } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { post, num, usd, CostingNav, Panel, Tile, Chip, TONE, Th, InfoI } from "./costing";

const money = (v) => (typeof v === "number" ? v.toFixed(3) : "—");
const tone = (r) => (r.tone === "red" || r.result === "loss" ? TONE.red : r.tone === "green" || r.result === "saving" ? TONE.green : r.result === "on plan" ? TONE.amber : TONE.grey);

// the cost build-up: plan pieces stacked to the plan cost, the actual beside it
const Waterfall = ({ r }) => {
  const parts = [["Cutting", r.sam_cut * r.cpm, "#64748b"], ["Sewing", r.sam_sew * r.cpm, "#38bdf8"], ["Finishing", r.sam_finish * r.cpm, "#14b8a6"], ["Packing", r.sam_pack * r.cpm, "#a78bfa"], ["Embroidery", r.embroidery, "#f59e0b"], ["Printing", r.printing, "#f97316"], ["Washing", r.washing, "#06b6d4"], ["Heat transfer", r.heat_transfer, "#ec4899"], ["Contingency", r.contingency, "#94a3b8"]].filter(([, v]) => typeof v === "number" && v > 0);
  const total = parts.reduce((a, [, v]) => a + v, 0);
  const max = Math.max(total, r.actual_cost || 0, r.fob || 0) || 1;
  const W = 600, H = 190, left = 70, right = W - 20, top = 14;
  const X = (v) => left + ((right - left) * v) / max;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      <text x={left - 6} y={top + 22} textAnchor="end" fontSize={10} fill="#94a3b8">plan</text>
      {parts.map(([label, v, c], i) => { const x0 = X(acc); acc += v; return <g key={label}><rect x={x0} y={top + 8} width={Math.max(X(acc) - x0, 1)} height={28} fill={c} /><title>{`${label}: USD ${v.toFixed(3)}`}</title>{X(acc) - x0 > 42 && <text x={(x0 + X(acc)) / 2} y={top + 26} textAnchor="middle" fontSize={9} fill="#0f172a" fontWeight={700}>{label} {v.toFixed(2)}</text>}</g>; })}
      <text x={X(total) + 4} y={top + 26} fontSize={10} fontWeight={700} fill="#e2e8f0">USD {total.toFixed(3)}</text>
      <text x={left - 6} y={top + 70} textAnchor="end" fontSize={10} fill="#94a3b8">actual</text>
      {typeof r.actual_cost === "number" ? <><rect x={left} y={top + 56} width={Math.max(X(r.actual_cost) - left, 1)} height={28} fill={r.result === "saving" ? "#34d399" : r.result === "loss" ? "#f43f5e" : "#fbbf24"} /><text x={X(r.actual_cost) + 4} y={top + 74} fontSize={10} fontWeight={700} fill="#e2e8f0">USD {r.actual_cost.toFixed(3)}{typeof r.variance_pc === "number" ? ` (${r.variance_pc > 0 ? "+" : ""}${r.variance_pc.toFixed(3)} a piece)` : ""}</text></> : <text x={left + 4} y={top + 74} fontSize={10} fill="#64748b">not started — no actual yet</text>}
      <text x={left - 6} y={top + 118} textAnchor="end" fontSize={10} fill="#94a3b8">FOB</text>
      {typeof r.fob === "number" && <><rect x={left} y={top + 104} width={Math.max(X(r.fob) - left, 1)} height={28} fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" /><text x={X(r.fob) + 4} y={top + 122} fontSize={10} fontWeight={700} fill="#e2e8f0">USD {r.fob.toFixed(2)} · margin {num(r.margin, 1)}%</text></>}
      <line x1={X(total)} x2={X(total)} y1={top + 4} y2={top + 136} stroke="#e2e8f0" strokeDasharray="2 3" />
      <text x={left} y={H - 8} fontSize={9} fill="#64748b">cutting · sewing · finishing · packing = SAM × CPM {r.cpm} · then the cost-sheet extras and contingency · vs the actual minutes a piece × CPM</text>
    </svg>
  );
};

// the learning curve behind the actual: cost a piece by day against the plan CM
const DayCurve = ({ days, planCost }) => {
  if (!days.length) return <div className="text-xs text-slate-500">No days run yet.</div>;
  const W = 600, H = 150, left = 40, right = W - 12, top = 14, base = H - 24;
  const vals = days.map((x) => x.cm_pc).concat([planCost]).filter((v) => typeof v === "number");
  const lo = Math.min(...vals) * 0.9, hi = Math.max(...vals) * 1.1;
  const X = (i) => left + ((right - left) * i) / Math.max(days.length - 1, 1);
  const Y = (v) => base - ((base - top) * (v - lo)) / (hi - lo || 1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      {typeof planCost === "number" && <><line x1={left} x2={right} y1={Y(planCost)} y2={Y(planCost)} stroke="#94a3b8" strokeDasharray="5 4" /><text x={right} y={Y(planCost) - 4} textAnchor="end" fontSize={9} fill="#94a3b8">plan CM {planCost.toFixed(3)}</text></>}
      <polyline points={days.map((x, i) => `${X(i)},${Y(x.cm_pc)}`).join(" ")} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinejoin="round" />
      {days.map((x, i) => <g key={i}><circle cx={X(i)} cy={Y(x.cm_pc)} r={3.5} fill={x.result === "saving" ? "#34d399" : x.result === "loss" ? "#f43f5e" : "#fbbf24"} /><text x={X(i)} y={Y(x.cm_pc) - 7} textAnchor="middle" fontSize={9} fontWeight={700} fill="#e2e8f0">{x.cm_pc.toFixed(2)}</text><text x={X(i)} y={H - 6} textAnchor="middle" fontSize={9} fill="#94a3b8">day {x.day_no}{x.kind && x.kind !== "full" ? " (" + x.kind + ")" : ""}</text></g>)}
    </svg>
  );
};

const StyleCosting = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [only, setOnly] = useState("");
  const [pick, setPick] = useState(null); // order + garment
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setData(await post({ view: "style-costing-plan" })); } catch (e) { setError("Style costing is unavailable right now. Please try again in a moment."); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const d = data || {};
  const rows = useMemo(() => (data && data.rows) || [], [data]);
  const shown = useMemo(() => { const s = q.trim().toLowerCase(); return rows.filter((r) => (!only || (only === "running" ? r.status === "running" : only === "loss" ? r.result === "loss" : only === "saving" ? r.result === "saving" : true)) && (!s || `${r.order} ${r.customer} ${r.style} ${r.garment} ${r.lines}`.toLowerCase().includes(s))); }, [rows, q, only]);
  const sel = pick ? rows.find((r) => r.order === pick.order && r.garment === pick.garment) : shown.find((r) => r.status === "running") || shown[0];
  const tables = Object.fromEntries((d.tables || []).map((t) => [t.key, t]));
  const days = sel ? ((tables.actual_days && tables.actual_days.rows) || []).filter((x) => x.order === sel.order && x.garment === sel.garment) : [];
  const cpm = d.cpm || {};
  const sum = Object.fromEntries((d.summary || []).map((x) => [x.label, x.value]));

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 484px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">Style Costing</h1>
        <CostingNav current="style-costing" />
        <span className="text-xs text-slate-400">{cpm.month ? `${cpm.month} · CPM USD ${cpm.cpm} · contingency ${num((d.contingency || 0) * 100)}%` : ""}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-[11px]">{[["", "all"], ["running", "running"], ["loss", "losses"], ["saving", "savings"]].map(([k, l]) => <button key={k} onClick={() => setOnly(k)} className={`px-2 py-1 font-bold ${only === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1"><Search size={13} className="text-slate-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="order, style, line…" className="bg-transparent outline-none text-xs w-36 text-white placeholder-slate-500" /></div>
          <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm flex items-center gap-2">{error}<button onClick={load} className="rounded border border-amber-400/50 px-2 py-0.5 text-xs font-bold hover:bg-amber-500/10">Retry</button></div>}
      <div className="flex flex-wrap gap-2 mb-3">
        <Tile label="CPM" value={sum.CPM || (cpm.cpm ? "USD " + cpm.cpm : "—")} sub={cpm.earned_minutes ? `${usd(cpm.factory_cost)} ÷ ${num(cpm.earned_minutes)} min` : undefined} />
        <Tile label="Order parts" value={num(sum["Order parts"])} sub={`${num(sum["Running / done"])} running / done`} />
        <Tile label="Losses" value={sum.Losses || "0"} tone="text-rose-300" />
        <Tile label="Savings" value={sum.Savings || "0"} tone="text-emerald-300" />
        <Tile label="On plan" value={num(sum["On plan"])} />
        <Tile label="Net variance" value={sum["Net variance (USD)"] !== undefined ? "USD " + sum["Net variance (USD)"] : "—"} sub="negative = cheaper than plan" tone={String(sum["Net variance (USD)"] || "").startsWith("-") ? "text-emerald-300" : "text-rose-300"} />
      </div>

      {sel && (
        <div className="grid gap-3 xl:grid-cols-2 mb-3">
          <Panel title={`Cost build-up · ${sel.order} ${sel.garment}`} right={`${sel.style} · ${sel.customer} · ${sel.lines} · ${sel.start} → ${sel.end} · ${sel.status}`}>
            <Waterfall r={sel} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-0.5 text-[11px] mt-1">
              {[["SAM", `${sel.sam} min (cut ${sel.sam_cut} · sew ${sel.sam_sew} · finish ${sel.sam_finish} · pack ${sel.sam_pack})`], ["Plan CM", money(sel.plan_cm)], ["Extras", `${money(sel.extras)} — ${sel.extras_note || "none"}`], ["Contingency", money(sel.contingency)], ["Plan cost", money(sel.plan_cost)], ["Actual", `${money(sel.actual_cost)} (${sel.actual_min_pc || "—"} min a piece, SAM ${sel.actual_sam || "—"})`], ["Variance", typeof sel.variance_pc === "number" ? `${sel.variance_pc > 0 ? "+" : ""}${sel.variance_pc.toFixed(3)} a piece · USD ${num(sel.variance_total)} on ${num(sel.pieces_made)} made` : "—"], ["FOB · margin", `${money(sel.fob)} · ${num(sel.margin, 1)}%`]].map(([k, v]) => <div key={k}><span className="text-slate-500">{k} </span><b className="text-white">{v}</b></div>)}
            </div>
          </Panel>
          <Panel title="The learning curve behind the actual" right={days.length ? `${days.length} day(s) run · ${num(sel.pieces_made)} of ${num(sel.pieces)} pieces` : sel.status}>
            <DayCurve days={days} planCost={sel.plan_cm} />
            {days.length > 0 && <div className="overflow-auto max-h-40 mt-1"><table className="w-full text-[11px]"><Th cols={["Day", "Date", "Line", "Plan", "Out", "Minutes", "Min / pc", "CM / pc", "Variance", "Result"]} /><tbody>{days.map((x, i) => <tr key={i} className="border-t border-slate-700/60"><td className="px-2 py-0.5 tabular-nums">{x.day_no}</td><td className="px-2 py-0.5 text-slate-300">{x.date}</td><td className="px-2 py-0.5 text-slate-300">{x.line}</td><td className="px-2 py-0.5 tabular-nums text-right text-slate-300">{num(x.plan)}</td><td className="px-2 py-0.5 tabular-nums text-right text-white font-bold">{num(x.out)}</td><td className="px-2 py-0.5 tabular-nums text-right text-slate-300">{num(x.minutes)}</td><td className="px-2 py-0.5 tabular-nums text-right text-slate-300">{x.min_pc}</td><td className="px-2 py-0.5 tabular-nums text-right text-white">{money(x.cm_pc)}</td><td className={`px-2 py-0.5 tabular-nums text-right ${x.variance_pc > 0 ? "text-rose-300" : "text-emerald-300"}`}>{x.variance_pc > 0 ? "+" : ""}{money(x.variance_pc)}</td><td className="px-2 py-0.5"><Chip cls={tone(x)}>{x.result}</Chip></td></tr>)}</tbody></table></div>}
          </Panel>
        </div>
      )}

      <Panel title="Orders on the unit plan — plan cost against actual" right={`${shown.length} order parts · click one for its build-up`}>
        <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
          <table className="w-full text-xs">
            <Th cols={["Order", "Customer", "Garment", "Lines", "Status", "Pieces", "SAM", "Plan CM", "Extras", "Cont.", "Plan cost", "FOB", "Margin", "Made", "Actual cost", "Variance / pc", "Variance total", "Result"]} />
            <tbody>
              {shown.map((r) => <tr key={r.order + r.garment} onClick={() => setPick({ order: r.order, garment: r.garment })} className={`border-t border-slate-700/60 cursor-pointer ${sel && sel.order === r.order && sel.garment === r.garment ? "bg-sky-500/10" : r.result === "loss" ? "bg-rose-500/10" : "hover:bg-slate-800/40"}`}><td className="px-2 py-1 font-bold text-white whitespace-nowrap">{r.order}</td><td className="px-2 py-1 text-slate-400">{r.customer}</td><td className="px-2 py-1 text-slate-300 whitespace-nowrap">{r.garment}</td><td className="px-2 py-1 text-slate-400 whitespace-nowrap">{r.lines}</td><td className="px-2 py-1"><Chip cls={r.status === "running" ? TONE.green : TONE.grey}>{r.status}</Chip></td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(r.pieces)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{r.sam}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{money(r.plan_cm)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{money(r.extras)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-400">{money(r.contingency)}</td><td className="px-2 py-1 tabular-nums text-right font-bold text-white">{money(r.plan_cost)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{money(r.fob)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(r.margin, 1)}%</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(r.pieces_made)}</td><td className="px-2 py-1 tabular-nums text-right font-bold text-white">{money(r.actual_cost)}</td><td className={`px-2 py-1 tabular-nums text-right font-bold ${typeof r.variance_pc !== "number" ? "text-slate-500" : r.variance_pc > 0 ? "text-rose-300" : "text-emerald-300"}`}>{typeof r.variance_pc === "number" ? (r.variance_pc > 0 ? "+" : "") + r.variance_pc.toFixed(3) : "—"}</td><td className={`px-2 py-1 tabular-nums text-right ${typeof r.variance_total !== "number" ? "text-slate-500" : r.variance_total > 0 ? "text-rose-300" : "text-emerald-300"}`}>{typeof r.variance_total === "number" ? usd(r.variance_total) : "—"}</td><td className="px-2 py-1"><Chip cls={tone(r)}>{r.result}</Chip></td></tr>)}
              {shown.length === 0 && <tr><td colSpan={18} className="px-2 py-8 text-center text-slate-500">{loading ? "Loading…" : "No order matches."}</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><InfoI text={`Plan cost = CPM × SAM (cutting + sewing + finishing + packing) + embroidery / printing / washing / heat transfer from the cost sheet + contingency. Actual = the minutes the line really spent a piece × CPM + extras. Red = loss, green = saving. ${cpm.rule || ""}`} /><span>how the plan and actual cost are computed</span></div>
      </Panel>
      <p className="mt-2 text-[10px] text-slate-500">{d.as_of ? `As of ${String(d.as_of).replace("T", " ").slice(0, 16)} · ` : ""}simulated factory — invented figures, no real company</p>
    </div>
  );
};

export default StyleCosting;
