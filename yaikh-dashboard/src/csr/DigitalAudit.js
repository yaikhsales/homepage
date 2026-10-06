// CSR · Digital Audit — two tabs inside the Digital Audit card:
//   • Question bank: like the real one — left, the tree of standards (WRAP · amfori BSCI · Higg FEM · ILO ·
//     GMP) → sections, each with its compliance % bar (Green ÷ total); right, the question cards with
//     source, legal reference, explanation, Green / Red status, red reason, attachments x/7, evidence files;
//     factory F1–F4 / all and a Green / Red filter
//   • Findings & CAP: the corrective action plan for the findings of the latest audit of every programme —
//     severity (zero tolerance / major / minor), root cause, action, owner role, target date, closure,
//     overdue flags; follow-up audits
// Data: csr views question-bank, findings. Every question of the bank is simulated; no real audit text.
import React, { useMemo, useState } from "react";
import { FileText, Paperclip, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useView, num, pct, Chip, Status, Panel, Bar, Select, Tabs, Table, Clip, Summary, Info, Screen } from "./csr";

const Tree = ({ tree, sel, onSel }) => (
  <div className="space-y-2">
    {(tree || []).map((st) => (
      <div key={st.standard} className="rounded-lg border border-slate-700 bg-slate-900/50 overflow-hidden">
        <button onClick={() => onSel({ standard: sel.standard === st.standard && !sel.section ? "" : st.standard, section: "" })} className={`w-full text-left px-2 py-1.5 ${sel.standard === st.standard && !sel.section ? "bg-slate-700/60" : "hover:bg-slate-800"}`}>
          <div className="flex items-baseline justify-between gap-2"><span className="text-xs font-black text-white">{st.standard}</span><span className={`text-xs font-bold tabular-nums ${st.pct >= 95 ? "text-emerald-300" : st.pct >= 85 ? "text-amber-300" : "text-rose-300"}`}>{pct(st.pct)}</span></div>
          <div className="mt-1"><Bar v={st.pct} /></div>
          <div className="text-[10px] text-slate-500 mt-0.5">{num(st.green)} green · <span className={st.red ? "text-rose-300" : ""}>{num(st.red)} red</span> · {num(st.total)} questions · {(st.sections || []).length} sections</div>
        </button>
        {(sel.standard === st.standard || !sel.standard) && (st.sections || []).map((sec, i) => (
          <button key={sec.section} onClick={() => onSel({ standard: st.standard, section: sel.section === sec.section ? "" : sec.section })} className={`w-full text-left px-2 py-1 border-t border-slate-800 ${sel.section === sec.section ? "bg-slate-700/60" : "hover:bg-slate-800"}`}>
            <div className="flex items-baseline gap-2"><span className="text-[10px] text-slate-500 w-4 tabular-nums">{i + 1}</span><span className="text-[11px] text-slate-200 flex-1 truncate" title={sec.section}>{sec.section}</span><span className={`text-[11px] tabular-nums ${sec.red ? "text-rose-300" : "text-emerald-300"}`}>{pct(sec.pct)}</span></div>
            <div className="ml-6 mt-0.5"><Bar v={sec.pct} h={3} /></div>
          </button>
        ))}
      </div>
    ))}
  </div>
);

const Question = ({ q, onFinding }) => (
  <div className={`rounded-lg border p-2.5 ${q.status === "red" ? "border-rose-500/40 bg-rose-500/5" : "border-slate-700 bg-slate-800/40"}`}>
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-black text-white text-xs">{q.code}</span>
      <span className="text-[11px] text-slate-400">{q.standard} · {q.section}</span>
      <span className="ml-auto flex items-center gap-1.5">
        <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400" title="evidence attached / required"><Paperclip size={10} />{q.attachments}</span>
        <Chip tone={q.status === "green" ? "green" : "red"}>{q.status === "green" ? <><CheckCircle2 size={10} className="inline -mt-px mr-0.5" />Green</> : <><AlertTriangle size={10} className="inline -mt-px mr-0.5" />Red</>}</Chip>
      </span>
    </div>
    <div className="text-xs font-bold text-slate-100 mt-1">{q.issue}</div>
    <div className="text-xs text-slate-300">{q.question}</div>
    <div className="mt-1 grid gap-x-4 gap-y-0.5 md:grid-cols-2 text-[11px]">
      <div><span className="text-slate-500">Source</span> {q.source}</div>
      <div><span className="text-slate-500">Legal ref.</span> {q.legal_ref}</div>
      <div className="md:col-span-2"><span className="text-slate-500">Explanation</span> {q.explanation}</div>
      {q.status === "red" && <div className="md:col-span-2 text-rose-200"><span className="text-rose-400">Red reason</span> {q.red_reason}{q.finding_id && <button onClick={() => onFinding(q.finding_id)} className="ml-2 text-sky-300 hover:underline">finding {q.finding_id} →</button>}</div>}
    </div>
    {(q.evidence_files || []).length > 0 && <div className="mt-1 flex flex-wrap gap-1">{q.evidence_files.map((f, i) => <span key={i} className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900/60 px-1.5 py-0.5 text-[10px] text-slate-300"><FileText size={10} className="text-sky-300" />{f.name}<span className="text-slate-500">· {f.year}</span></span>)}</div>}
  </div>
);

const QuestionBank = ({ goFinding }) => {
  const [factory, setFactory] = useState("F1");
  const [status, setStatus] = useState("");
  const [sel, setSel] = useState({ standard: "", section: "" });
  const body = useMemo(() => ({ view: "question-bank", factory, standard: sel.standard || undefined, section: sel.section || undefined, status: status || undefined }), [factory, sel, status]);
  const { d, error, loading, reload } = useView(body);
  const rows = d.rows || [];
  return (
    <>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm flex items-center gap-2">{error}<button onClick={reload} className="rounded border border-amber-400/50 px-2 py-0.5 text-xs font-bold hover:bg-amber-500/10">Retry</button></div>}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{((d.filters || {}).factory || ["F1", "F2", "F3", "F4", "all"]).map((k) => <button key={k} onClick={() => setFactory(k)} className={`px-2.5 py-1 font-bold ${factory === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{k === "all" ? "All factories" : "Digital Audit " + k}</button>)}</div>
        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{[["", "All"], ["green", "Green"], ["red", "Red"]].map(([k, l]) => <button key={k} onClick={() => setStatus(k)} className={`px-2.5 py-1 font-bold ${status === k ? (k === "red" ? "bg-rose-400 text-slate-900" : k === "green" ? "bg-emerald-400 text-slate-900" : "bg-white text-slate-900") : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
        <span className="ml-auto"><Info text={d.subtitle} /></span>
      </div>
      <div className="grid gap-3 lg:grid-cols-[18rem,1fr] items-start">
        <div>
          <Tree tree={d.tree} sel={sel} onSel={setSel} />
          {(d.by_factory || []).length > 0 && <Panel title="Compliance by factory" className="mt-3">
            <table className="w-full text-[11px]"><thead className="text-slate-500"><tr><th className="text-left font-normal">Factory</th>{Object.keys(d.by_factory[0]).filter((k) => k !== "factory" && k !== "overall").map((k) => <th key={k} className="text-right font-normal">{k}</th>)}<th className="text-right font-normal">overall</th></tr></thead>
              <tbody>{d.by_factory.map((r) => <tr key={r.factory} className={`border-t border-slate-800 ${r.factory === factory ? "text-white" : "text-slate-400"}`}><td className="py-0.5 font-bold">{r.factory}</td>{Object.keys(r).filter((k) => k !== "factory" && k !== "overall").map((k) => <td key={k} className="py-0.5 text-right tabular-nums">{pct(r[k])}</td>)}<td className="py-0.5 text-right tabular-nums font-bold">{pct(r.overall)}</td></tr>)}</tbody></table>
          </Panel>}
          {d.tie && <div className="mt-2 text-[10px] text-slate-500">tie: {num(d.tie.red_from_findings)} red questions ↔ {num(d.tie.open_findings)} open findings {d.tie.match ? "✓" : "✗"}</div>}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2 text-[11px] text-slate-500">{sel.standard ? <><Chip tone="grey" onClick={() => setSel({ standard: "", section: "" })}>{sel.standard}{sel.section ? " · " + sel.section : ""} ✕</Chip></> : "all standards"}<span className="ml-auto">{loading ? "loading…" : `${rows.length} question${rows.length === 1 ? "" : "s"}`}</span></div>
          <div className="space-y-2 overflow-auto pr-1" style={{ maxHeight: 720 }}>
            {rows.map((q) => <Question key={q.code + q.factory} q={q} onFinding={goFinding} />)}
            {rows.length === 0 && <div className="text-sm p-3">{error ? <span className="text-amber-200">{error}</span> : loading ? <span className="text-slate-400">Loading…</span> : <span className="text-slate-500">No questions match.</span>}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

const SEV = { zero_tolerance: "red", major: "amber", minor: "sky" };
const Findings = ({ focus }) => {
  const [f, setF] = useState({ standard: "", severity: "", status: "", factory: "" });
  const { d, error, loading, reload } = useView({ view: "findings", standard: f.standard || undefined, severity: f.severity || undefined, status: f.status || undefined, factory: f.factory || undefined });
  const rows = (d.rows || []).filter((r) => !focus || r.id === focus);
  const fu = (d.tables || []).find((t) => t.key === "follow-ups");
  return (
    <>
      <div className="mb-2"><Summary items={d.summary} info={d.subtitle} /></div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Standard" value={f.standard} onChange={(v) => setF({ ...f, standard: v })} options={(d.filters || {}).standard} />
        <Select label="Severity" value={f.severity} onChange={(v) => setF({ ...f, severity: v })} options={(d.filters || {}).severity} />
        <Select label="Status" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={(d.filters || {}).status} />
        <Select label="Factory" value={f.factory} onChange={(v) => setF({ ...f, factory: v })} options={(d.filters || {}).factory} />
        <span className="flex gap-1.5">{Object.entries(SEV).map(([k, t]) => <Chip key={k} tone={t} onClick={() => setF({ ...f, severity: f.severity === k ? "" : k })} on={f.severity === k}>{k.replace("_", " ")} {d.by_severity && d.by_severity[k] !== undefined ? "· " + num(d.by_severity[k]) + " open" : ""}</Chip>)}</span>
        <span className="ml-auto text-xs text-slate-500">{loading ? "loading…" : `${rows.length} finding${rows.length === 1 ? "" : "s"} · click a row for root cause, action and closure`}</span>
      </div>
      <Table columns={d.columns} rows={rows} max={560} empty="No findings match." loading={loading} error={error} onRetry={reload} expand keys={["id", "audit", "standard", "question_code", "factory", "finding", "severity", "owner_role", "target_date", "status"]} widths={{ audit: "14rem", finding: "20rem", owner_role: "13rem" }} render={{
        id: (v, r) => <span className="font-bold text-white">{v}{(r.overdue_60d || r.past_target) && <Chip tone="red" title={r.overdue_60d ? "overdue 60+ days" : "past target date"}> !</Chip>}</span>,
        audit: (v, r) => <Clip v={`${v} · ${r.audit_name}`} />,
        finding: (v) => <Clip v={v} cls="text-slate-100" />,
        severity: (v) => <Chip tone={SEV[v] || "grey"}>{String(v).replace("_", " ")}</Chip>,
        owner_role: (v, r) => <Clip v={`${v} ${r.owner_emp || ""}`} />,
        target_date: (v, r) => <span className={r.past_target ? "text-rose-300 font-bold" : ""}>{v}</span>,
        closure_evidence: (v) => v ? <span className="inline-flex items-center gap-1 text-[10px] text-slate-300"><FileText size={10} className="text-sky-300" />{typeof v === "string" ? v : Array.isArray(v) ? v.length + " files" : "on file"}</span> : <span className="text-slate-600">—</span>,
      }} />
      {fu && <Panel title={fu.title} className="mt-3"><Table columns={fu.columns} rows={fu.rows} max={240} loading={loading} error={error} onRetry={reload} widths={{ audit_name: "14rem" }} render={{ id: (v) => <b className="text-white">{v}</b> }} /></Panel>}
    </>
  );
};

const DigitalAudit = ({ onBack }) => {
  const [tab, setTab] = useState("bank");
  const [focus, setFocus] = useState("");
  const head = useView({ view: "question-bank", factory: "F1" });
  return (
    <Screen onBack={onBack} heading="Digital Audit" summary={tab === "bank" ? head.d.summary : undefined} loading={head.loading} error={head.error} onReload={head.reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Tabs tabs={[["bank", "Question bank"], ["findings", "Findings & CAP"]]} value={tab} onChange={(t) => { setTab(t); if (t === "bank") setFocus(""); }} />
        {focus && <Chip tone="sky" onClick={() => setFocus("")}>showing finding {focus} ✕</Chip>}
      </div>
      {tab === "bank" && <QuestionBank goFinding={(id) => { setFocus(id); setTab("findings"); }} />}
      {tab === "findings" && <Findings focus={focus} />}
    </Screen>
  );
};
export default DigitalAudit;
