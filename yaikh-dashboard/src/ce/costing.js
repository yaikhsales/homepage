// CE · Product Costing — shared bits for CPM, Style Costing and Cost Centres (the manpower dashboard).
// Data: the simulated factory on the M1, POST /api/m1/sim/view, module "ce". Invented figures.
import React from "react";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
export const post = async (body) => {
  const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ce", ...body }) });
  const j = await r.json();
  if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
  return j;
};
export const num = (v, d = 0) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 }) : v === null || v === undefined || v === "" ? "—" : String(v));
export const usd = (v, d = 0) => (typeof v === "number" ? "USD " + v.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d }) : v === null || v === undefined || v === "" ? "—" : String(v));
export const cpm4 = (v) => (typeof v === "number" ? v.toFixed(4) : v === null || v === undefined || v === "" ? "—" : String(v));
export const pct = (v) => Number(String(v === undefined || v === null ? "" : v).replace("%", "")) || 0;

export const COSTING_NAV = [
  { view: "cpm", title: "CPM", path: "/dashboard/ce/cpm" },
  { view: "style-costing", title: "Style Costing", path: "/dashboard/ce/style-costing" },
  { view: "cost-centers", title: "Cost Centers", path: "/dashboard/ce/cost-centers" },
];
export const CostingNav = ({ current }) => {
  const navigate = useNavigate();
  return <div className="flex flex-wrap gap-1">{COSTING_NAV.map((n) => <button key={n.view} onClick={() => navigate(n.path)} className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${n.view === current ? "bg-white text-slate-900 border-white" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{n.title}</button>)}</div>;
};
export const Panel = ({ title, right, children, className }) => <section className={`rounded-xl border border-slate-700 bg-slate-800/40 p-3 min-w-0 ${className || ""}`}><div className="flex items-baseline justify-between gap-2 mb-2"><div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{title}</div>{right && <div className="text-[11px] text-slate-500">{right}</div>}</div>{children}</section>;
export const Tile = ({ label, value, sub, tone }) => <span className="inline-flex items-baseline gap-1.5 rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-1 text-xs whitespace-nowrap"><span className="text-slate-400">{label}</span><b className={`tabular-nums text-sm ${tone || "text-white"}`}>{value}</b>{sub && <span className="text-[11px] text-slate-500">{sub}</span>}</span>;
export const Chip = ({ cls, children }) => <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${cls}`}>{children}</span>;
export const TONE = { green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", red: "bg-rose-500/20 text-rose-300 border-rose-500/30", amber: "bg-amber-500/20 text-amber-300 border-amber-500/30", grey: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
export const Th = ({ cols }) => <thead className="text-slate-500 sticky top-0 bg-slate-800"><tr>{cols.map((c) => <th key={c} className="text-left font-normal px-2 py-1 whitespace-nowrap">{c}</th>)}</tr></thead>;
// the explain / checks box: how the number is calculated, and that the pieces add up
export const Explain = ({ lines, checks }) => (
  <Panel title="How it's calculated" right={checks ? `${checks.filter((c) => c.ok).length} of ${checks.length} checks tie` : undefined}>
    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">{(lines || []).map((l, i) => <li key={i}>{l}</li>)}</ul>
    {checks && checks.length > 0 && <div className="mt-2 grid gap-x-4 gap-y-0.5 md:grid-cols-2 text-[11px]">{checks.map((c, i) => <div key={i} className="flex gap-2"><span className={`mt-1 inline-block w-2 h-2 rounded-full flex-shrink-0 ${c.ok ? "bg-emerald-500" : "bg-rose-500"}`} /><span className="text-slate-400">{c.check}{c.value ? <span className="text-slate-500"> — {c.value}</span> : null}</span></div>)}</div>}
  </Panel>
);
// the long explanation of a screen, behind a small "i"
export const InfoI = ({ text }) => (text ? <span title={text} className="inline-flex items-center text-slate-500 hover:text-slate-300 cursor-help align-middle" aria-label="about this screen"><Info size={14} /></span> : null);
