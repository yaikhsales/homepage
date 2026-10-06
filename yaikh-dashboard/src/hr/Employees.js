// HR · Employee directory — the 1,032 people as a searchable, filterable, paged table (employee number,
// title for management, position, level, department, section, factory, line, grade, status, today,
// reports to, codes on other screens). Filters come from the data; the URL query carries them so the
// org chart can open the directory on a node. Click a row for the profile.
// Data: {"module":"hr","view":"employees", group, department, factory, line, level, grade, status, search, page}.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { post, num, GROUP, LEVEL, HrNav, Chip, RoleIcon, todayChip } from "./hr";

const FILTERS = ["group", "department", "factory", "line", "level", "grade", "status"];
const label = (opt) => (Array.isArray(opt) ? opt[1] : String(opt));
const value = (opt) => (Array.isArray(opt) ? opt[0] : String(opt));

const Employees = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get("search") || "");
  const back = () => (onBack ? onBack() : navigate(-1));
  const page = Number(params.get("page") || 1);
  const applied = useMemo(() => { const o = {}; FILTERS.forEach((k) => { const v = params.get(k); if (v) o[k] = v; }); const s = params.get("search"); if (s) o.search = s; return o; }, [params]);
  const set = (k, v) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); if (k !== "page") n.delete("page"); setParams(n, { replace: true }); };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const j = await post({ view: "employees", ...applied, page });
      setData(j);
    } catch (e) {
      setError("The directory is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [applied, page]);
  useEffect(() => { load(); }, [load]);

  const d = data || {};
  const cols = d.columns || [];
  const rows = d.rows || [];
  const filters = d.filters || {};
  const pages = d.pages || 1;
  const cell = (r, k) => {
    const v = r[k];
    if (k === "emp_no") return <span className="inline-flex items-center gap-1.5"><RoleIcon level={r.level} size={13} /><b className="text-white">{v}</b></span>;
    if (k === "title") return v ? <b className="text-white">{v}</b> : <span className="text-slate-600">—</span>;
    if (k === "level") return <span className="text-slate-300">{(LEVEL[v] || {}).label || v}</span>;
    if (k === "today") return <Chip cls={todayChip(v)}>{v || "—"}</Chip>;
    if (k === "status") return <Chip cls={/active/.test(String(v)) ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}>{v}</Chip>;
    if (k === "grade") return v ? <span className="font-bold text-white">{v}</span> : "—";
    if (k === "reports_to") return v ? <button onClick={(e) => { e.stopPropagation(); navigate("/dashboard/hr/employee/" + String(v).split(" ")[0]); }} className="text-sky-300 hover:underline text-left">{v}</button> : "—";
    if (k === "aliases") return v ? <span className="text-slate-400">{v}</span> : <span className="text-slate-600">—</span>;
    return v === "" || v === null || v === undefined ? <span className="text-slate-600">—</span> : String(v);
  };

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">Employee directory</h1>
        <HrNav current="employees" />
        <div className="ml-auto flex flex-wrap gap-x-3 text-xs text-slate-400">{(d.summary || []).map((x) => <span key={x.label} className="whitespace-nowrap">{x.label} <b className="text-white tabular-nums">{num(x.value)}</b></span>)}</div>
        <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <form onSubmit={(e) => { e.preventDefault(); set("search", q.trim()); }} className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1"><Search size={13} className="text-slate-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="YAI0259, OP-0712, LL-07, P-01…" className="bg-transparent outline-none text-xs w-48 text-white placeholder-slate-500" />{applied.search && <button type="button" onClick={() => { setQ(""); set("search", ""); }} className="text-slate-500 hover:text-white" aria-label="clear"><X size={12} /></button>}</form>
        {FILTERS.map((k) => (filters[k] || []).length > 0 && (
          <select key={k} value={applied[k] || ""} onChange={(e) => set(k, e.target.value)} className={`rounded-lg border px-2 py-1 text-xs ${applied[k] ? "border-sky-500/60 bg-sky-500/10 text-white" : "border-slate-700 bg-slate-800 text-slate-300"}`} aria-label={k}>
            <option value="">{k}: all</option>
            {filters[k].map((o) => <option key={value(o)} value={value(o)}>{label(o)}</option>)}
          </select>
        ))}
        {applied.line && !(filters.line || []).length && <Chip cls="bg-sky-500/20 text-sky-300 border-sky-500/30">line {applied.line} <button onClick={() => set("line", "")} className="ml-1" aria-label="clear line">×</button></Chip>}
        {Object.keys(applied).length > 0 && <button onClick={() => { setQ(""); setParams(new URLSearchParams(), { replace: true }); }} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700">clear filters</button>}
        <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
          <button disabled={page <= 1} onClick={() => set("page", String(page - 1))} className="p-1 rounded border border-slate-700 bg-slate-800 disabled:opacity-40" aria-label="previous page"><ChevronLeft size={14} /></button>
          page <b className="text-white">{page}</b> / {pages}
          <button disabled={page >= pages} onClick={() => set("page", String(page + 1))} className="p-1 rounded border border-slate-700 bg-slate-800 disabled:opacity-40" aria-label="next page"><ChevronRight size={14} /></button>
        </span>
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-auto" style={{ maxHeight: "calc(100vh - 230px)" }}>
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-800 text-slate-400"><tr>{cols.map((c) => <th key={c.key} className="text-left font-semibold px-3 py-2 whitespace-nowrap uppercase tracking-wider text-[10px]">{c.label}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => <tr key={r.emp_no} onClick={() => navigate("/dashboard/hr/employee/" + r.emp_no)} className={`border-t border-slate-700/60 cursor-pointer hover:bg-slate-700/40 ${r.group === "administrative" ? "bg-violet-500/5" : ""}`}>{cols.map((c) => <td key={c.key} className="px-3 py-1.5 whitespace-nowrap">{cell(r, c.key)}</td>)}</tr>)}
            {rows.length === 0 && <tr><td colSpan={Math.max(cols.length, 1)} className="px-3 py-10 text-center text-slate-500">{loading ? "Loading…" : "Nobody matches."}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 text-[10px] text-slate-500"><span>rows tinted violet = Administrative, plain = Operations</span><span className="flex gap-1.5"><Chip cls={GROUP.operations.chip}>Operations</Chip><Chip cls={GROUP.administrative.chip}>Administrative</Chip></span><span>{d.subtitle}</span></div>
    </div>
  );
};

export default Employees;
