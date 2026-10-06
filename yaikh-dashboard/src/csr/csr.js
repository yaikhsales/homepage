// CSR — shared bits for the CSR screens (Audit Plan · Certificates · Digital Audit · Checklist · Air).
// Data: the simulated factory on the M1, POST /api/m1/sim/view, module "csr". Every view returns
// title, subtitle, summary, columns, rows plus its own rich keys. People are role code + YAI id, no names.
// Gamini's UI rules: one compact header line carrying the figures (no stat-card rows repeating them), the
// long explanation behind a small "i", tables that reflow to the width left beside the PA panel, one line
// per cell, "Loading…" / an error with Retry — never an empty state for a pending or failed call.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Info as InfoIcon } from "lucide-react";
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
    try { setD(await post(JSON.parse(key))); } catch (e) { setError("This CSR view is unavailable right now."); } finally { setLoading(false); }
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
export const Chip = ({ tone, cls, children, onClick, on, title: t }) => <span title={t} onClick={onClick} className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap leading-4 ${cls || TONE[tone] || TONE.grey} ${onClick ? "cursor-pointer hover:brightness-125" : ""} ${on ? "ring-1 ring-white" : ""}`}>{children}</span>;
export const Status = ({ s }) => <Chip tone={toneOf(s)}>{title(s)}</Chip>;
// the long explanation of a view, behind a small "i"
export const Info = ({ text }) => (text ? <span title={text} className="inline-flex items-center text-slate-500 hover:text-slate-300 cursor-help align-middle" aria-label="about this view"><InfoIcon size={14} /></span> : null);
export const Panel = ({ title: t, right, info, children, className }) => <section className={`rounded-xl border border-slate-700 bg-slate-800/40 p-3 min-w-0 ${className || ""}`}>{(t || right) && <div className="flex items-baseline justify-between gap-2 mb-2"><div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">{t}{info && <Info text={info} />}</div>{right && <div className="text-xs text-slate-500">{right}</div>}</div>}{children}</section>;
export const Bar = ({ v, tone, h = 6 }) => <div className="w-full rounded-full bg-slate-700/70 overflow-hidden" style={{ height: h }}><div className={`h-full rounded-full ${tone || (v >= 95 ? "bg-emerald-400" : v >= 85 ? "bg-amber-400" : "bg-rose-400")}`} style={{ width: `${Math.max(0, Math.min(100, Number(v) || 0))}%` }} /></div>;
export const Select = ({ label, value, onChange, options, all = "all" }) => (
  <label className="inline-flex items-center gap-1 text-xs text-slate-400">{label}
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white">
      <option value="">{all}</option>
      {(options || []).map((o) => <option key={String(o)} value={String(o)}>{String(o)}</option>)}
    </select>
  </label>
);
export const Tabs = ({ tabs, value, onChange }) => <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-sm">{tabs.map(([k, l]) => <button key={k} onClick={() => onChange(k)} className={`px-3 py-1 font-bold ${value === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>;
// one line in a cell, the whole text on hover
export const Clip = ({ v, cls }) => (v === null || v === undefined || v === "" ? <span className="text-slate-600">—</span> : <span className={`block truncate ${cls || ""}`} title={typeof v === "string" ? v : undefined}>{v}</span>);
// the key figures as one text line (the same look as the header's)
export const Summary = ({ items, info }) => <div className="csr-summary flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-slate-400">{(items || []).map((x) => <span key={x.label} className="whitespace-nowrap">{x.label} <b className="text-white tabular-nums">{num(x.value)}</b></span>)}{info && <Info text={info} />}</div>;
// the state of a call: pending → "Loading…", failed → the error with Retry; never an empty state for those
export const State = ({ loading, error, onRetry, empty, colSpan }) => {
  const body = error ? <span className="text-amber-200">{error} {onRetry && <button onClick={onRetry} className="ml-1 rounded border border-amber-400/50 px-2 py-0.5 text-xs font-bold text-amber-200 hover:bg-amber-500/10">Retry</button>}</span> : loading ? <span className="text-slate-400">Loading…</span> : <span className="text-slate-500">{empty || "No rows match."}</span>;
  return colSpan ? <tr><td colSpan={colSpan} className="px-2 py-3 text-sm">{body}</td></tr> : <div className="px-2 py-3 text-sm">{body}</div>;
};
// a table that never clips an id, code, date, number, rank or status chip: those columns take their natural
// width (and the table scrolls sideways inside its own card when the minimums don't fit); only free-text
// columns (names, findings, actions, remarks) clip to one line with the full text on hover. `keys` picks the
// columns, `labels` gives short real header labels, `widths` the clip width of a text column, `expand` opens
// the whole record under the row on click; `render[key]` overrides a cell
const FIXED_KEY = /^(id|code|device|ref|issue_no|date|time|month|week|w\d|rank|status|result|stage|severity|level|factory|location|question_code|photo|before_photo|after_photo|report_cap|customer|days_to_expiry|validity_years|period_days|duration_min|findings|open_findings|submissions|passed|failed|pass_rate|penalty|avg_40|monthly_avg_40|completion_pct|evaluated|locations|co2|pm25|pm10|ch2o|tvoc|temp|rh|over|kind|interval)$|_date$|^(issued|expires|renewal|last_seen)/;
const isText = (key, rows) => !FIXED_KEY.test(key) && (rows || []).slice(0, 30).some((r) => typeof r[key] === "string" && r[key].length > 22);
export const Table = ({ columns, rows, render = {}, onRow, max = 400, empty, loading, error, onRetry, dense, keys, labels = {}, widths = {}, expand }) => {
  const all = cols(columns);
  const cs = keys ? keys.map((k) => all.find((c) => c.key === k) || { key: k, label: title(k) }) : all;
  const [open, setOpen] = useState(null);
  const list = rows || [];
  const text = Object.fromEntries(cs.map((c) => [c.key, isText(c.key, list)]));
  const rowKey = (r, i) => r.id || r.code || r.device || i;
  return (
    <div className="overflow-auto rounded-lg border border-slate-700" style={{ maxHeight: max }}>
      <table className={`min-w-full ${dense ? "text-xs" : "text-[13px]"}`}>
        <thead className="text-slate-500 sticky top-0 bg-slate-800 z-10"><tr>{cs.map((c) => <th key={c.key} className="text-left font-normal px-2 py-1 align-bottom leading-tight whitespace-nowrap">{labels[c.key] || c.label}</th>)}</tr></thead>
        <tbody>
          {list.map((r, i) => {
            const k = rowKey(r, i), isOpen = expand && open === k;
            return (
              <React.Fragment key={k}>
                <tr onClick={onRow ? () => onRow(r) : expand ? () => setOpen(isOpen ? null : k) : undefined} className={`border-t border-slate-800 ${onRow || expand ? "cursor-pointer hover:bg-slate-700/40" : ""} ${isOpen ? "bg-slate-700/30" : ""}`}>
                  {cs.map((c) => <td key={c.key} className={`px-2 py-1 align-top text-slate-200 ${text[c.key] ? "truncate" : "whitespace-nowrap"}`} style={text[c.key] ? { maxWidth: widths[c.key] || "16rem", minWidth: "6rem" } : undefined} title={typeof r[c.key] === "string" && text[c.key] && !render[c.key] ? r[c.key] : undefined}>{render[c.key] ? render[c.key](r[c.key], r) : cell(r[c.key], c.key)}</td>)}
                </tr>
                {isOpen && <tr className="border-t border-slate-800 bg-slate-900/60"><td colSpan={cs.length} className="px-3 py-2 whitespace-normal"><Record columns={all} row={r} /></td></tr>}
              </React.Fragment>
            );
          })}
          {list.length === 0 && <State loading={loading} error={error} onRetry={onRetry} empty={empty} colSpan={cs.length || 1} />}
        </tbody>
      </table>
    </div>
  );
};
// the whole record of a row, label: value, for the expand under a table row
export const Record = ({ columns, row }) => {
  const shown = new Set(cols(columns).map((c) => c.key));
  const extra = Object.keys(row || {}).filter((k) => !shown.has(k) && !/^(id|chips|stages|evidence_files|weeks)$/.test(k) && typeof row[k] !== "object");
  const items = [...cols(columns), ...extra.map((k) => ({ key: k, label: title(k) }))];
  return <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 text-xs">{items.map((c) => <div key={c.key} className="min-w-0"><span className="text-slate-500">{c.label}</span> <span className="text-slate-200 break-words">{cell(row[c.key], c.key)}</span></div>)}</div>;
};
export const cell = (v, key) => {
  if (v === null || v === undefined || v === "") return <span className="text-slate-600">—</span>;
  if (typeof v === "boolean") return <span className={v ? "text-emerald-300" : "text-slate-600"}>{v ? "yes" : "no"}</span>;
  if (/^(status|result|stage|severity|level)$/.test(key) && typeof v === "string") return <Status s={v} />;
  if (Array.isArray(v)) { const t = v.map((x) => (typeof x === "object" ? x.name || JSON.stringify(x) : String(x))).join(", "); return <span className="text-slate-400" title={t}>{t}</span>; }
  if (typeof v === "object") return <span className="text-slate-400">{JSON.stringify(v)}</span>;
  if (typeof v === "number") return <span className="tabular-nums whitespace-nowrap">{num(v, 2)}</span>;
  if (/^\d{4}-\d{2}-\d{2}/.test(String(v))) return <span className="whitespace-nowrap">{String(v)}</span>;
  return <span>{String(v)}</span>;
};

// the screen frame every CSR screen uses: below the nav, back arrow, title with the "i", the figures on the
// same line, refresh; the content keeps clear of the PA panel AND of its pin / minus buttons when it is open
// below ~900 px of CONTENT width (a narrow window, or the PA panel open) the multi-column grids
// (.csr-cols) stack full width with the chart first (.csr-first) and the header figures become chips
const NARROW = 900;
const useNarrow = () => {
  const ref = useRef(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth - 24 < NARROW));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, narrow];
};
export const Screen = ({ onBack, heading, sub, summary, loading, error, onReload, children }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [boxRef, narrow] = useNarrow();
  const back = () => (onBack ? onBack() : navigate(-1));
  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className={`yai-pa-aware csr-screen min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans ${narrow ? "narrow" : ""}`}>
      <style>{`body.yai-pa-open .yai-pa-aware.csr-screen { padding-right: 484px; }
.csr-screen.narrow .csr-cols { grid-template-columns: 1fr !important; }
.csr-screen.narrow .csr-first { order: -1; }
.csr-screen.narrow .csr-summary > span { border: 1px solid #334155; border-radius: 9999px; padding: 0 7px; font-size: 11px; line-height: 18px; background: rgba(15, 23, 42, 0.6); }
.csr-screen.narrow .csr-summary { gap: 4px; }`}</style>
      <div ref={boxRef} className="w-full" />
      <NavCover />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none flex items-center gap-1.5">{heading}<Info text={sub} /></h1>
        <div className="flex-1 min-w-[16rem]"><Summary items={summary} /></div>
        {onReload && <button onClick={onReload} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>}
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm flex items-center gap-2">{error}{onReload && <button onClick={onReload} className="rounded border border-amber-400/50 px-2 py-0.5 text-xs font-bold hover:bg-amber-500/10">Retry</button>}</div>}
      {children}
      <p className="mt-3 text-[10px] text-slate-500">simulated factory — role codes and employee numbers only, no real company, person or device</p>
    </div>
  );
};
