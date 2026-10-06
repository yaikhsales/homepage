// CSR — shared bits for the CSR screens (Audit Plan · Certificates · Digital Audit · Checklist · Air).
// Data: the simulated factory on the M1, POST /api/m1/sim/view, module "csr". Every view returns
// title, subtitle, summary, columns, rows plus its own rich keys. People are role code + YAI id, no names.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";

export const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
export const post = async (body) => {
  const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "csr", ...body }) });
  const j = await r.json();
  if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
  return j;
};
// one view, re-fetched whenever the body changes
export const useView = (body) => {
  const key = JSON.stringify(body);
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setD(await post(JSON.parse(key))); } catch (e) { setError("This CSR view is unavailable right now. Please try again in a moment."); } finally { setLoading(false); }
  }, [key]);
  useEffect(() => { load(); }, [load]);
  return { d: d || {}, error, loading, reload: load };
};
export const num = (v, dd = 0) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: dd }) : v === null || v === undefined || v === "" ? "—" : String(v));
export const pct = (v) => (typeof v === "number" ? v.toFixed(1) + "%" : v === null || v === undefined || v === "" ? "—" : String(v));
export const title = (s) => String(s || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
export const cols = (c) => (c || []).map((x) => (Array.isArray(x) ? { key: x[0], label: x[1] } : typeof x === "string" ? { key: x, label: title(x) } : { key: x.key, label: x.label || title(x.key) }));

export const TONE = {
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", red: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  amber: "bg-amber-500/20 text-amber-300 border-amber-500/30", sky: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  violet: "bg-violet-500/20 text-violet-300 border-violet-500/30", grey: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};
// the tone of a status word, wherever it comes from (stages, certificates, findings, visits, 8S)
export const toneOf = (s) => {
  const x = String(s || "").toLowerCase();
  if (/^(completed|done|closed|valid|green|pass|passed|online|verified|ok|uploaded)/.test(x)) return "green";
  if (/^(expired|red|fail|failed|offline|open|zero|overdue|fixing)/.test(x)) return "red";
  if (/^(expiring|in.?progress|in_progress|active|today|rehearsal|acceptable|major|pending)/.test(x)) return "amber";
  if (/^(planned|plan|pre|minor|no expiry|upcoming)/.test(x)) return "sky";
  if (/^(on-site|reporting|cap)/.test(x)) return "violet";
  return "grey";
};
export const Chip = ({ tone, cls, children, onClick, on }) => <span onClick={onClick} className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${cls || TONE[tone] || TONE.grey} ${onClick ? "cursor-pointer hover:brightness-125" : ""} ${on ? "ring-1 ring-white" : ""}`}>{children}</span>;
export const Status = ({ s }) => <Chip tone={toneOf(s)}>{title(s)}</Chip>;
export const Panel = ({ title: t, right, children, className }) => <section className={`rounded-xl border border-slate-700 bg-slate-800/40 p-3 min-w-0 ${className || ""}`}>{(t || right) && <div className="flex items-baseline justify-between gap-2 mb-2"><div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{t}</div>{right && <div className="text-[11px] text-slate-500">{right}</div>}</div>}{children}</section>;
export const Tile = ({ label, value, sub, tone, onClick, on }) => <button onClick={onClick} disabled={!onClick} className={`text-left rounded-lg border bg-slate-900/60 px-2.5 py-1.5 min-w-[6.5rem] ${on ? "border-white" : "border-slate-700"} ${onClick ? "hover:border-slate-400" : "cursor-default"}`}><div className="text-[10px] uppercase tracking-wider text-slate-500 whitespace-nowrap">{label}</div><div className={`font-black tabular-nums text-base leading-tight ${tone || "text-white"}`}>{value}</div>{sub && <div className="text-[10px] text-slate-500">{sub}</div>}</button>;
export const Bar = ({ v, tone, h = 6 }) => <div className="w-full rounded-full bg-slate-700/70 overflow-hidden" style={{ height: h }}><div className={`h-full rounded-full ${tone || (v >= 95 ? "bg-emerald-400" : v >= 85 ? "bg-amber-400" : "bg-rose-400")}`} style={{ width: `${Math.max(0, Math.min(100, Number(v) || 0))}%` }} /></div>;
export const Select = ({ label, value, onChange, options, all = "all" }) => (
  <label className="inline-flex items-center gap-1 text-[11px] text-slate-400">{label}
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-0.5 text-[11px] text-white">
      <option value="">{all}</option>
      {(options || []).map((o) => <option key={String(o)} value={String(o)}>{String(o)}</option>)}
    </select>
  </label>
);
export const Tabs = ({ tabs, value, onChange }) => <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{tabs.map(([k, l]) => <button key={k} onClick={() => onChange(k)} className={`px-3 py-1 font-bold ${value === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>;
// a table from a view's columns + rows; `render[key]` overrides a cell, `onRow` makes rows clickable
export const Table = ({ columns, rows, render = {}, onRow, max = 400, empty = "No rows." }) => {
  const cs = cols(columns);
  return (
    <div className="overflow-auto rounded-lg border border-slate-700" style={{ maxHeight: max }}>
      <table className="min-w-full text-xs">
        <thead className="text-slate-500 sticky top-0 bg-slate-800 z-10"><tr>{cs.map((c) => <th key={c.key} className="text-left font-normal px-2 py-1 whitespace-nowrap">{c.label}</th>)}</tr></thead>
        <tbody>
          {(rows || []).map((r, i) => <tr key={r.id || r.code || r.device || i} onClick={onRow ? () => onRow(r) : undefined} className={`border-t border-slate-800 ${onRow ? "cursor-pointer hover:bg-slate-700/40" : ""}`}>{cs.map((c) => <td key={c.key} className="px-2 py-1 align-top text-slate-200">{render[c.key] ? render[c.key](r[c.key], r) : cell(r[c.key], c.key)}</td>)}</tr>)}
          {(rows || []).length === 0 && <tr><td colSpan={cs.length} className="px-2 py-3 text-slate-500">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
};
export const cell = (v, key) => {
  if (v === null || v === undefined || v === "") return <span className="text-slate-600">—</span>;
  if (typeof v === "boolean") return <span className={v ? "text-emerald-300" : "text-slate-600"}>{v ? "yes" : "no"}</span>;
  if (/^(status|result|stage|severity|level)$/.test(key) && typeof v === "string") return <Status s={v} />;
  if (Array.isArray(v)) return <span className="text-slate-400">{v.map((x) => (typeof x === "object" ? x.name || JSON.stringify(x) : String(x))).join(", ")}</span>;
  if (typeof v === "object") return <span className="text-slate-400">{JSON.stringify(v)}</span>;
  if (typeof v === "number") return <span className="tabular-nums">{num(v, 2)}</span>;
  return <span className="whitespace-pre-wrap">{String(v)}</span>;
};
export const Summary = ({ items }) => <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400">{(items || []).map((x) => <span key={x.label} className="whitespace-nowrap">{x.label} <b className="text-white tabular-nums">{num(x.value)}</b></span>)}</div>;

// the screen frame every CSR screen uses: below the nav, back arrow, title, summary strip, refresh
export const Screen = ({ onBack, heading, sub, summary, loading, error, onReload, children }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const back = () => (onBack ? onBack() : navigate(-1));
  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">{heading}</h1>
        <div className="ml-auto"><Summary items={summary} /></div>
        {onReload && <button onClick={onReload} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>}
      </div>
      {sub && <p className="text-[11px] text-slate-500 mb-2">{sub}</p>}
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      {children}
      <p className="mt-3 text-[10px] text-slate-500">simulated factory — role codes and employee numbers only, no real company, person or device</p>
    </div>
  );
};
