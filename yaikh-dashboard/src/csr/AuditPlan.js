// CSR · Audit Plan — one row per audit with its five stages (Pre-Audit → On-Site → Reporting → CAP →
// Completed), the stage tracker with the red counters, filters by year / stage / standard / type, and
// per-row details (stage dates, planned vs actual, evidence files, findings, result, follow-up). Two more
// tabs live inside this card: Visits (buyer / VIP visit requests) and the CSR Calendar (the "CSR
// Schedule" button). Data: csr views audit-plan, visits, csr-calendar.
import React, { useMemo, useState } from "react";
import { CalendarDays, FileText, Users, ClipboardList } from "lucide-react";
import { useView, num, Chip, Status, Panel, Tile, Select, Tabs, Table, cell, toneOf, Screen } from "./csr";


// evidence_files comes as a list, or as a map stage → list, or as a count
const files = (v) => {
  if (Array.isArray(v)) return v.map((f) => (typeof f === "string" ? { name: f } : f || {}));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([stage, l]) => (Array.isArray(l) ? l : [l]).filter(Boolean).map((f) => ({ ...(typeof f === "string" ? { name: f } : f), stage })));
  return [];
};
const STAGES = [["plan", "Planned"], ["pre-audit", "Pre-Audit"], ["on-site", "On-Site Audit"], ["reporting", "Reporting & Assessment"], ["CAP", "CAP (Verification & Final)"], ["completed", "Completed"]];

// the five stage chips of a row: name · date (or Pending / In Progress) · evidence count
const Flow = ({ stages }) => (
  <div className="flex items-center gap-1 flex-wrap">
    {(stages || []).map((s, i) => {
      const tone = toneOf(s.status) === "grey" ? (s.date === "In Progress" ? "amber" : s.date === "Pending" ? "grey" : "green") : toneOf(s.status);
      return (
        <React.Fragment key={s.name}>
          {i > 0 && <span className="text-slate-600">›</span>}
          <span className={`inline-flex flex-col rounded-md border px-1.5 py-0.5 leading-tight ${{ green: "border-emerald-500/40 bg-emerald-500/10", amber: "border-amber-500/40 bg-amber-500/10", red: "border-rose-500/40 bg-rose-500/10", grey: "border-slate-700 bg-slate-800/60", sky: "border-sky-500/40 bg-sky-500/10", violet: "border-violet-500/40 bg-violet-500/10" }[tone]}`} title={`${s.name} · planned ${s.planned || "—"} · ${s.status || ""}${s.evidence ? " · " + s.evidence + " evidence" : ""}`}>
            <span className="text-[10px] font-bold text-white whitespace-nowrap">{s.name}</span>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">{s.date || "—"}{typeof s.evidence === "number" && s.evidence > 0 ? <span className="text-sky-300"> · {s.evidence}📎</span> : null}</span>
          </span>
        </React.Fragment>
      );
    })}
  </div>
);

const Details = ({ r }) => (
  <div className="grid gap-3 md:grid-cols-3 text-xs">
    <Panel title="The audit">
      <div className="space-y-0.5 text-slate-300">
        <div><span className="text-slate-500">Programme</span> {r.programme}</div>
        <div><span className="text-slate-500">Standard</span> {r.standard} · <span className="text-slate-500">customer</span> {r.customer}</div>
        <div><span className="text-slate-500">Type</span> {r.type} · <span className="text-slate-500">form</span> {r.audit_form}</div>
        <div><span className="text-slate-500">Handled by</span> {r.handled_by} <span className="text-sky-300">{r.handled_by_emp}</span></div>
        <div><span className="text-slate-500">Dates</span> pre-audit {r.pre_audit_date} · audit {(r.audit_dates || [r.audit_date]).join(", ")} · {r.period_days} day{r.period_days === 1 ? "" : "s"}</div>
        <div><span className="text-slate-500">Result</span> {r.result || "—"} · <span className="text-slate-500">findings</span> {num(r.findings)} ({num(r.open_findings)} open)</div>
        {r.follow_up_of && <div><span className="text-slate-500">Follow-up of</span> {r.follow_up_of}</div>}
        {r.completion_date && <div><span className="text-slate-500">Completed</span> {r.completion_date}</div>}
      </div>
    </Panel>
    <Panel title="Stages — planned vs actual">
      <table className="w-full text-[11px]"><tbody>
        {(r.stages || []).map((s) => <tr key={s.name} className="border-t border-slate-800"><td className="py-0.5 pr-2 font-bold text-white">{s.name}</td><td className="py-0.5 pr-2 text-slate-400">planned {s.planned || "—"}</td><td className="py-0.5 pr-2">{s.date || "—"}</td><td className="py-0.5"><Status s={s.status || s.date} /></td><td className="py-0.5 text-right text-slate-400">{typeof s.evidence === "number" ? `${s.evidence} file${s.evidence === 1 ? "" : "s"}` : ""}</td></tr>)}
      </tbody></table>
    </Panel>
    <Panel title="Evidence" right={`${typeof r.evidence_files === "number" ? r.evidence_files : files(r.evidence_files).length} files on file`}>
      <div className="space-y-0.5 mb-1">{(r.stages || []).filter((s) => s.evidence || s.evidence_kind).map((s) => <div key={s.name} className="text-[11px] text-slate-300"><span className="font-bold text-white">{s.name}</span> · {num(s.evidence)} file{s.evidence === 1 ? "" : "s"}{s.evidence_kind ? <span className="text-slate-500"> — {s.evidence_kind}</span> : null}</div>)}</div>
      <div className="flex flex-wrap gap-1">{files(r.evidence_files).map((f, i) => <span key={i} className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900/60 px-1.5 py-0.5 text-[10px] text-slate-300"><FileText size={10} className="text-sky-300" />{f.name}{f.stage ? <span className="text-slate-500">· {f.stage}</span> : null}{f.year ? <span className="text-slate-500">· {f.year}</span> : null}</span>)}{files(r.evidence_files).length === 0 && !(r.stages || []).some((s) => s.evidence) && <span className="text-slate-500">none yet</span>}</div>
    </Panel>
  </div>
);

const Plans = ({ year, setYear }) => {
  const [f, setF] = useState({ stage: "", standard: "", type: "" });
  const [openRow, setOpenRow] = useState(null);
  const body = useMemo(() => ({ view: "audit-plan", year: year || undefined, stage: f.stage || undefined, standard: f.standard || undefined, type: f.type || undefined }), [year, f]);
  const { d, error, loading, reload } = useView(body);
  const rows = d.rows || [];
  return (
    <>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <Panel title="Activity audit plan — track every audit through its five stages" right={d.subtitle} className="mb-3">
        <div className="flex flex-wrap items-stretch gap-2">
          {STAGES.map(([k, l]) => { const t = (d.stage_tracker || []).find((x) => x.stage === k); const n = t ? t.count : 0; const on = f.stage === k; return (
            <button key={k} onClick={() => setF({ ...f, stage: on ? "" : k })} className={`relative rounded-xl border px-3 py-2 text-left min-w-[9rem] ${on ? "border-white bg-slate-700/60" : "border-slate-700 bg-slate-900/60 hover:border-slate-500"}`}>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{k === "CAP" ? "CAP" : k.replace("-", " ")}</div>
              <div className="text-sm font-black text-white leading-tight">{l}</div>
              <span className={`absolute -top-2 -right-2 rounded-full px-1.5 min-w-[1.4rem] text-center text-[11px] font-black ${n ? "bg-rose-500 text-white" : "bg-slate-700 text-slate-300"}`}>{n}</span>
            </button>); })}
        </div>
      </Panel>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Year" value={year} onChange={setYear} options={(d.filters || {}).year} all="this year" />
        <Select label="Standard" value={f.standard} onChange={(v) => setF({ ...f, standard: v })} options={(d.filters || {}).standard} />
        <Select label="Type" value={f.type} onChange={(v) => setF({ ...f, type: v })} options={(d.filters || {}).type} />
        {(f.stage || f.standard || f.type) && <button onClick={() => setF({ stage: "", standard: "", type: "" })} className="text-[11px] text-sky-300 hover:underline">clear filters</button>}
        <span className="ml-auto text-[11px] text-slate-500">{loading ? "loading…" : `${rows.length} audit${rows.length === 1 ? "" : "s"} · click a row for its stages and evidence`}</span>
        <button onClick={reload} className="text-[11px] text-slate-400 hover:text-white">refresh</button>
      </div>
      <div className="overflow-auto rounded-lg border border-slate-700" style={{ maxHeight: 640 }}>
        <table className="min-w-full text-xs">
          <thead className="text-slate-500 sticky top-0 bg-slate-800 z-10"><tr>{["Plan", "Audit", "Standard · customer", "Type · form", "Handled by", "Dates", "Activity process flow", "Findings", "Result"].map((h) => <th key={h} className="text-left font-normal px-2 py-1 whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <React.Fragment key={r.id}>
                <tr onClick={() => setOpenRow(openRow === r.id ? null : r.id)} className={`border-t border-slate-800 cursor-pointer hover:bg-slate-700/40 ${openRow === r.id ? "bg-slate-700/30" : ""}`}>
                  <td className="px-2 py-1.5 align-top whitespace-nowrap"><div className="font-bold text-white">{r.id}</div><div className="text-[10px] text-slate-500">{r.location}</div>{r.follow_up_of && <Chip tone="sky">follow-up of {r.follow_up_of}</Chip>}</td>
                  <td className="px-2 py-1.5 align-top"><div className="font-bold text-white">{r.audit_name}</div><div className="text-[10px] text-slate-500">{r.programme !== r.audit_name ? r.programme : ""}</div></td>
                  <td className="px-2 py-1.5 align-top whitespace-nowrap"><div>{r.standard}</div><div className="text-[10px] text-slate-500">{r.customer}</div></td>
                  <td className="px-2 py-1.5 align-top"><div>{r.type}</div><div className="text-[10px] text-slate-500">{r.audit_form}</div></td>
                  <td className="px-2 py-1.5 align-top whitespace-nowrap"><div>{r.handled_by}</div><div className="text-[10px] text-sky-300">{r.handled_by_emp}</div></td>
                  <td className="px-2 py-1.5 align-top whitespace-nowrap text-slate-300"><div>pre {r.pre_audit_date}</div><div>audit {r.audit_date} · {r.period_days}d</div></td>
                  <td className="px-2 py-1.5 align-top"><Flow stages={r.stages} /></td>
                  <td className="px-2 py-1.5 align-top whitespace-nowrap tabular-nums">{num(r.findings)}{r.open_findings ? <span className="text-rose-300"> · {num(r.open_findings)} open</span> : null}</td>
                  <td className="px-2 py-1.5 align-top"><Status s={r.stage} /><div className="text-[10px] text-slate-400 mt-0.5">{r.result}</div></td>
                </tr>
                {openRow === r.id && <tr className="border-t border-slate-800 bg-slate-900/60"><td colSpan={9} className="px-2 py-2"><Details r={r} /></td></tr>}
              </React.Fragment>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} className="px-2 py-3 text-slate-500">{loading ? "Loading…" : "No audits match."}</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Visits = () => {
  const [f, setF] = useState({ customer: "", level: "", status: "" });
  const { d, error, loading } = useView({ view: "visits" });
  const rows = (d.rows || []).filter((r) => (!f.customer || r.customer === f.customer) && (!f.level || r.level === f.level) && (!f.status || r.status === f.status));
  return (
    <>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <p className="text-[11px] text-slate-500 mb-2">{d.subtitle}</p>
      <div className="flex flex-wrap gap-2 mb-2">{(d.summary || []).map((x) => <Tile key={x.label} label={x.label} value={num(x.value)} />)}</div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Customer" value={f.customer} onChange={(v) => setF({ ...f, customer: v })} options={(d.filters || {}).customer} />
        <Select label="Level" value={f.level} onChange={(v) => setF({ ...f, level: v })} options={(d.filters || {}).level} />
        <Select label="Status" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={(d.filters || {}).status} />
        <span className="ml-auto flex gap-1.5">{(d.levels || []).map((l) => <Chip key={l.level} tone="grey">{l.level} · {l.name.replace(/^Level \d — /, "")} · {l.minutes} min</Chip>)}</span>
      </div>
      <Table columns={d.columns} rows={rows} max={560} empty={loading ? "Loading…" : "No visits match."} render={{
        customer: (v) => <b className="text-white">customer {v}</b>,
        level: (v, r) => <Chip tone={v === "L1" ? "violet" : v === "L2" ? "sky" : "grey"}>{v} · {r.duration_min} min</Chip>,
        participants_roles: (v) => <span className="text-slate-400">{String(v || "").split("; ").join(" · ")}</span>,
        report_cap: (v) => <Status s={v} />,
      }} />
    </>
  );
};

const TYPES = ["audit", "pre-audit", "follow-up", "renewal", "expiry", "visit", "fire drill"];
const TYPE_TONE = { audit: "violet", "pre-audit": "sky", "follow-up": "amber", renewal: "green", expiry: "red", visit: "grey", "fire drill": "amber" };
const Calendar = ({ year, setYear }) => {
  const [type, setType] = useState("");
  const [month, setMonth] = useState("");
  const { d, error, loading } = useView({ view: "csr-calendar", year: year || undefined, type: type || undefined, month: month ? Number(month) : undefined });
  const months = d.months || [];
  const peak = Math.max(1, ...months.map((m) => TYPES.reduce((s, t) => s + (m[t] || 0), 0)));
  return (
    <>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <p className="text-[11px] text-slate-500 mb-2">{d.subtitle}</p>
      <div className="flex flex-wrap gap-2 mb-2">{(d.summary || []).map((x) => <Tile key={x.label} label={x.label} value={num(x.value)} onClick={TYPES.includes(String(x.label).toLowerCase()) ? () => setType(type === String(x.label).toLowerCase() ? "" : String(x.label).toLowerCase()) : undefined} on={type === String(x.label).toLowerCase()} />)}</div>
      <Panel title={`Year timeline ${d.year || year || ""} — events per month, click a month`} className="mb-3">
        <div className="grid grid-cols-12 gap-1">
          {months.map((m) => { const tot = TYPES.reduce((s, t) => s + (m[t] || 0), 0); const mm = Number(String(m.month).slice(-2)); const on = String(mm) === month; return (
            <button key={m.month} onClick={() => setMonth(on ? "" : String(mm))} className={`rounded-lg border p-1.5 text-left ${on ? "border-white bg-slate-700/60" : "border-slate-700 bg-slate-900/60 hover:border-slate-500"}`}>
              <div className="text-[10px] text-slate-500">{new Date(2000, mm - 1, 1).toLocaleString("en-US", { month: "short" })}</div>
              <div className="text-sm font-black text-white tabular-nums">{tot}</div>
              <div className="flex h-8 items-end gap-px mt-1">{TYPES.map((t) => <div key={t} title={`${t} ${m[t] || 0}`} className={`flex-1 rounded-sm ${{ violet: "bg-violet-400", sky: "bg-sky-400", amber: "bg-amber-400", green: "bg-emerald-400", red: "bg-rose-400", grey: "bg-slate-400" }[TYPE_TONE[t]]}`} style={{ height: `${Math.round(((m[t] || 0) / peak) * 100)}%`, opacity: m[t] ? 1 : 0.15 }} />)}</div>
            </button>); })}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">{TYPES.map((t) => <Chip key={t} tone={TYPE_TONE[t]} onClick={() => setType(type === t ? "" : t)} on={type === t}>{t}</Chip>)}</div>
      </Panel>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Year" value={year} onChange={setYear} options={(d.filters || {}).year} all="this year" />
        {(type || month) && <button onClick={() => { setType(""); setMonth(""); }} className="text-[11px] text-sky-300 hover:underline">clear filters</button>}
        <span className="ml-auto text-[11px] text-slate-500">{loading ? "loading…" : `${(d.rows || []).length} events`}</span>
      </div>
      <Table columns={d.columns} rows={d.rows} max={560} render={{ type: (v) => <Chip tone={TYPE_TONE[v] || "grey"}>{v}</Chip>, title: (v) => <b className="text-white">{v}</b>, ref: (v) => <span className="text-sky-300">{v}</span> }} />
    </>
  );
};

const AuditPlan = ({ onBack }) => {
  const [tab, setTab] = useState("plans");
  const [year, setYear] = useState("");
  const head = useView({ view: "audit-plan", year: year || undefined });
  return (
    <Screen onBack={onBack} heading="Audit Plan" sub={tab === "plans" ? head.d.subtitle : undefined} summary={tab === "plans" ? head.d.summary : undefined} loading={head.loading} onReload={head.reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Tabs tabs={[["plans", "Audit plans"], ["visits", "Visits"], ["calendar", "CSR calendar"]]} value={tab} onChange={setTab} />
        <button onClick={() => setTab("calendar")} className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-bold ${tab === "calendar" ? "bg-white text-slate-900 border-white" : "border-sky-500/50 bg-sky-500/10 text-sky-200 hover:bg-sky-500/25"}`}><CalendarDays size={12} />CSR Schedule</button>
        <span className="text-[11px] text-slate-500 inline-flex items-center gap-1"><ClipboardList size={11} />audits · <Users size={11} />buyer / VIP visits · <CalendarDays size={11} />renewals, expiries, fire drills</span>
      </div>
      {tab === "plans" && <Plans year={year} setYear={setYear} />}
      {tab === "visits" && <Visits />}
      {tab === "calendar" && <Calendar year={year} setYear={setYear} />}
    </Screen>
  );
};
export { cell };
export default AuditPlan;
