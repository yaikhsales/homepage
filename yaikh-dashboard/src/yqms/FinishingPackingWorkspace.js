import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import AuditReport from "./AuditReport";
import PackingInspection from "./PackingInspection";
import HumidityReportAdd from "./HumidityReport/add-model";
import {
  ArrowLeft, BookOpen, Camera, CheckCircle2, ClipboardCheck,
  Download, FileText, History, LayoutDashboard, PackageCheck, Plus,
  QrCode, Settings2, ShieldCheck, Shirt, Thermometer, Video,
} from "lucide-react";

const MODULES = {
  finishing: { title: "Finishing Inspection", slug: "finishing-inspection", icon: Shirt, colors: ["#2458a7", "#4f7fc1"], video: "", fields: ["MO / order", "Style", "Colour", "Size", "Finishing line", "Finishing standard", "Pieces checked", "Defects found", "Appearance result", "Measurement result", "Label / trim result", "Inspector notes"] },
  ironing: { title: "Ironing Inspection", slug: "ironing-inspection", icon: Thermometer, colors: ["#b45309", "#ea580c"], video: "", fields: ["MO / order", "Style", "Colour", "Size", "Ironing line", "Iron / steam setting", "Pieces checked", "Scorch / shine defects", "Shape / press result", "Measurement result", "Inspector notes"] },
  aquaboy: { title: "Humidity Aquaboy", slug: "aquaboy", icon: Thermometer, colors: ["#087e8b", "#18a6a0"], video: "/assets/short-video-training/Humidity.mp4", fields: ["MO / order", "Factory style", "Buyer style", "Customer", "Fabrication", "Colour", "Humidity specification (% RH)", "Before dry room (% RH)", "Top reading (% RH)", "Middle reading (% RH)", "Bottom reading (% RH)", "Inspection notes"] },
  offline: { title: "Offline Audit", slug: "offline-audit", icon: ClipboardCheck, colors: ["#5141a5", "#7c5bc5"], video: "/assets/short-video-training/digital-audit.mp4", fields: ["MO / order", "Style", "Colour", "Area / line", "Audit scope", "Audit type", "Units checked", "Defects found", "Workmanship result", "Measurement result", "Packing result", "Corrective action / notes"] },
  packing: { title: "Packing Inspection", slug: "packing-inspection", icon: PackageCheck, colors: ["#236047", "#32815e"], video: "", fields: ["MO / order", "PO", "Style", "Colour", "Size ratio", "Carton number", "Cartons checked", "Units checked", "Barcode / SKU result", "Carton marks result", "Packing result", "Carton L × W × H", "Gross weight", "Packing notes"] },
  qa: { title: "QA Audit Finishing & Packing", slug: "qa-audit-finishing", icon: ShieldCheck, colors: ["#9c294e", "#c64b4b"], video: "", fields: ["MO / order", "Style", "Colour", "Finishing / packing line", "Audit scope", "Units checked", "Defects found", "Finishing result", "Ironing result", "Humidity result", "Packing result", "Corrective action / notes"] },
};
const TABS = [
  ["pad", "QC Pad", ClipboardCheck], ["dashboard", "Dashboard", LayoutDashboard],
  ["report", "Report", FileText], ["modify", "Modify", Settings2],
  ["adding", "Adding", Plus], ["dr", "DR", History],
];
const STORAGE_KEY = "yqms-finishing-packing-workspace-v1";
const tabClass = (active) => `flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-extrabold transition ${active ? "border-blue-600 bg-blue-600 text-white shadow" : "border-slate-200 bg-white text-slate-600 hover:bg-blue-50"}`;
const controlClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const loadWorkspace = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) { return {}; } };
const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export default function FinishingPackingWorkspace({ module = "finishing", onBack }) {
  const config = MODULES[module] || MODULES.finishing;
  const legacyPad = module === "packing"
    ? <PackingInspection embedded onBack={onBack} />
    : module === "aquaboy"
      ? <HumidityReportAdd embedded onBack={onBack} />
      : <AuditReport embedded title={module === "finishing" ? "Finishing Inspection" : module === "ironing" ? "Ironing Inspection" : module === "offline" ? "Offline Audit" : "QA Audit Finishing & Packing"} onBack={onBack} />;
  const Icon = config.icon;
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(loadWorkspace);
  const [active, setActive] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get("view");
    return TABS.some(([id]) => id === requested) ? requested : "pad";
  });
  const [selectedReport, setSelectedReport] = useState("Daily activity");
  const [sessionCode, setSessionCode] = useState("");
  const [sessionEmployeeId, setSessionEmployeeId] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [form, setForm] = useState({ inspector: "", employeeId: "", shift: "Day", outcome: "Pass", ...Object.fromEntries(config.fields.map((f) => [f, ""])) });
  const [notice, setNotice] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [managerRole, setManagerRole] = useState("");
  const [correctionField, setCorrectionField] = useState("");
  const [reason, setReason] = useState("");
  const [correction, setCorrection] = useState("");
  const [supervisorDecision, setSupervisorDecision] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [decisionOutcome, setDecisionOutcome] = useState("Keep current status");
  const [drForm, setDrForm] = useState({ type: "Issue", title: "", details: "", rootCause: "", containment: "", correctiveAction: "", preventiveAction: "", owner: "", dueDate: "", nextStep: "", status: "Open", source: "", actor: "", actorId: "" });

  const rows = workspace.records || [];
  const events = workspace.events || [];
  const moduleRows = rows.filter((r) => r.module === module);
  const moduleEvents = events.filter((e) => e.module === module).sort((a, b) => b.at.localeCompare(a.at));
  const lineField = config.fields.find((field) => /line|area/i.test(field));
  const lineStats = Object.values(moduleRows.reduce((groups, record) => {
    const line = record.values[lineField] || "Line not recorded";
    if (!groups[line]) groups[line] = { line, checks: 0, pass: 0, hold: 0, defects: 0 };
    groups[line].checks += 1;
    groups[line].pass += record.outcome === "Pass" ? 1 : 0;
    groups[line].hold += record.outcome === "Hold" ? 1 : 0;
    groups[line].defects += Number(record.values["Defects found"] || record.values["Scorch / shine defects"] || 0);
    return groups;
  }, {}));
  const openCallouts = moduleEvents.filter((event) => !["Resolved", "Recorded", "Finalized"].includes(event.status));
  const issueRows = moduleRows.filter((record) => record.outcome === "Hold" || Number(record.values["Defects found"] || record.values["Scorch / shine defects"] || 0) > 0);
  const reportRows = {
    "Daily activity": moduleRows.filter((record) => new Date(record.createdAt).toDateString() === new Date().toDateString()),
    "Line performance": moduleRows,
    "Defect Pareto": issueRows,
    "Open actions": openCallouts.map((event) => ({ ...event, createdAt: event.at, inspector: event.actor || "", employeeId: "", shift: "", outcome: event.status, values: { ...config.fields.reduce((values, field) => ({ ...values, [field]: "" }), {}), [config.fields[0]]: event.title, "Corrective action / notes": event.nextStep } })),
    "Full traceability log": moduleRows,
  };
  const reportDescriptions = { "Daily activity": "Inspections recorded today", "Line performance": "Saved checks grouped by production line or audit area", "Defect Pareto": "Saved records with defects or holds", "Open actions": "Unresolved issue and decision-register actions", "Full traceability log": "Complete inspection record export" };
  const qrUrl = `${window.location.origin}${window.location.pathname.split("/dashboard/")[0]}/dashboard/yqms/${config.slug}?view=pad`;
  const summary = useMemo(() => ({
    total: moduleRows.length,
    pass: moduleRows.filter((r) => r.outcome === "Pass").length,
    hold: moduleRows.filter((r) => r.outcome === "Hold").length,
    defects: moduleRows.reduce((n, r) => n + (Number(r.values["Defects found"] || r.values["Scorch / shine defects"] || 0)), 0),
  }), [moduleRows]);

  const persist = (next) => { setWorkspace(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const addEvent = (next, event) => ({ ...next, events: [...(next.events || []), { id: `DR-${Date.now()}`, module, at: new Date().toISOString(), ...event }] });
  const saveInspection = () => {
    if (!form.inspector.trim() || !form.employeeId.trim() || !form[config.fields[0]].trim()) { setNotice("Enter inspector name, YHR ID and order reference before saving."); return; }
    const record = { id: `${config.slug.toUpperCase()}-${Date.now()}`, module, title: config.title, createdAt: new Date().toISOString(), inspector: form.inspector, employeeId: form.employeeId, shift: form.shift, outcome: form.outcome, photoNames: form["Photo files"] || "", values: Object.fromEntries(config.fields.map((field) => [field, form[field] || ""])), history: [] };
    let next = { ...workspace, records: [...rows, record] };
    if (form.outcome === "Hold" || Number(form["Defects found"] || form["Scorch / shine defects"] || 0) > 0) next = addEvent(next, { type: "Issue", title: `${config.title}: ${record.values[config.fields[0]] || record.id}`, details: record.values["Corrective action / notes"] || record.values["Inspector notes"] || "Issue recorded in inspection pad.", owner: "", nextStep: "Supervisor review", status: "Open", recordId: record.id, actor: `${form.inspector} (${form.employeeId})` });
    persist(next); setNotice(`Saved ${record.id} on this device. Shared server sync is not configured in this checkout.`); setForm({ inspector: "", employeeId: "", shift: "Day", outcome: "Pass", ...Object.fromEntries(config.fields.map((f) => [f, ""])) });
  };
  const exportRows = (name, filtered = moduleRows) => {
    const columns = ["id", "module", "createdAt", "inspector", "employeeId", "shift", "outcome", ...config.fields];
    const csv = [columns.map(csvCell).join(","), ...filtered.map((r) => [r.id, r.module, r.createdAt, r.inspector, r.employeeId, r.shift, r.outcome, ...config.fields.map((f) => r.values[f])].map(csvCell).join(","))].join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); link.download = `${config.slug}-${name}.csv`; link.click(); URL.revokeObjectURL(link.href);
  };
  const applyCorrection = () => {
    if (!selectedId || !supervisor.trim() || !supervisorId.trim() || !managerRole.trim() || !reason.trim() || !supervisorDecision.trim() || !correctiveAction.trim() || (correctionField && !correction.trim())) { setNotice("Select a record and enter the authorized manager, YHR ID, decision, reason and corrective action. Enter a corrected value when changing a field."); return; }
    const nextRows = rows.map((r) => r.id !== selectedId || r.module !== module ? r : ({ ...r, outcome: decisionOutcome === "Keep current status" ? r.outcome : decisionOutcome, values: { ...r.values, ...(correctionField ? { [correctionField]: correction } : {}), "Management decision": supervisorDecision, "Corrective action": correctiveAction }, supervisorDecision, correctiveAction, history: [...(r.history || []), { at: new Date().toISOString(), actor: supervisor, employeeId: supervisorId, role: managerRole, reason, correctionField, correction, decisionOutcome, before: { outcome: r.outcome, values: { ...r.values } } }] }));
    let next = { ...workspace, records: nextRows };
    next = addEvent(next, { type: "Management amendment", title: `Record ${selectedId} reviewed`, details: `${supervisorDecision}; ${correctiveAction}${correctionField ? `; changed ${correctionField}` : ""}`, owner: supervisor, nextStep: "Original and amended values retained in management history", status: "Recorded", recordId: selectedId, actor: `${supervisor} (${supervisorId}) · ${managerRole}`, reason });
    persist(next); setNotice("Management decision and original-value history saved on this device."); setReason(""); setCorrection(""); setSupervisorDecision(""); setCorrectiveAction(""); setDecisionOutcome("Keep current status");
  };
  const createDecision = () => {
    if (!drForm.title.trim() || !drForm.details.trim() || !drForm.nextStep.trim() || !drForm.actor.trim() || !drForm.actorId.trim()) { setNotice("Enter the event, details, next step and the responsible person's name and YHR ID."); return; }
    if (["PA notice", "Big Brain question", "Big Brain reply"].includes(drForm.type) && !drForm.source.trim()) { setNotice("Enter the actual PA/Big Brain message reference or source before recording it."); return; }
    if (drForm.status === "Finalized" && (!drForm.rootCause.trim() || !drForm.containment.trim() || !drForm.correctiveAction.trim() || !drForm.preventiveAction.trim())) { setNotice("A CAP cannot be finalized until root cause, containment, corrective action and preventive action are recorded."); return; }
    persist(addEvent(workspace, { ...drForm, actor: `${drForm.actor} (${drForm.actorId})`, finalizedAt: drForm.status === "Finalized" ? new Date().toISOString() : "" }));
    setDrForm({ type: "Issue", title: "", details: "", rootCause: "", containment: "", correctiveAction: "", preventiveAction: "", owner: "", dueDate: "", nextStep: "", status: "Open", source: "", actor: "", actorId: "" }); setNotice("DR / CAP event added to this device's register.");
  };

  return <main className="min-h-screen bg-slate-100 text-slate-800">
    <header className="sticky top-0 z-30 border-b border-white/20 shadow-sm" style={{ background: `linear-gradient(110deg, ${config.colors[0]}, ${config.colors[1]})` }}>
      <div className="flex min-h-[76px] flex-wrap items-center gap-3 px-4 py-2 lg:px-6">
        <button onClick={onBack || (() => navigate("/dashboard/submenu/yqms"))} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600" aria-label="Back to YQMS"><ArrowLeft size={18}/></button>
        <div className="flex min-w-[190px] flex-1 items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/35 bg-white/15 text-white"><Icon size={24}/></span>
          <div className="text-white"><p className="text-[10px] font-black uppercase tracking-widest text-white/75">YQMS · Finishing &amp; Packing</p><h1 className="text-base font-black sm:text-lg">{config.title}</h1></div>
        </div>
        <nav aria-label="Module workspace" className="order-3 flex w-full gap-2 overflow-x-auto pb-1 lg:order-none lg:w-auto">
          {TABS.map(([id, label, TabIcon]) => <button key={id} className={tabClass(active === id)} onClick={() => { setActive(id); setNotice(""); }}><TabIcon size={15}/>{label}</button>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {config.video ? <a href={config.video} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-xs font-bold text-white sm:inline-flex"><Video size={15}/> Video</a> : <button disabled title="No approved module video is assigned" className="hidden items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs font-bold text-white/50 sm:inline-flex"><Video size={15}/> Video</button>}
          <button onClick={() => setNotice("No approved module-specific SOP link is connected yet; training guidance must come from the current YHR chart and approved SOP.")} className="hidden items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-xs font-bold text-white sm:inline-flex"><BookOpen size={15}/> SOP</button>
          <div className="flex items-center gap-2 rounded-xl border border-white/25 bg-black/10 px-3 py-2 text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-300 text-xs font-black text-slate-900">YQ</span><span className="hidden text-xs font-bold sm:block">Yai session<br/><small className="font-normal text-white/70">pilot · role not verified</small></span></div>
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-7xl space-y-4 p-3 sm:p-5">
      {notice && <p role="status" className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900">{notice}</p>}
      {active === "pad" && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">A4 floor pad · {config.title}</div>{legacyPad}</section>}
      {active === "dashboard" && <section className="space-y-4"><div><h2 className="text-2xl font-black">{config.title} dashboard</h2><p className="text-sm text-slate-500">Saved checks, status, line performance and open callouts.</p></div><div className="grid gap-3 sm:grid-cols-4">{[["Saved records", summary.total],["Pass", summary.pass],["Hold", summary.hold],["Defects entered", summary.defects]].map(([label,value])=><div key={label} className="rounded-xl border bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}</div><div className="grid gap-4 lg:grid-cols-2"><section className="overflow-x-auto rounded-2xl border bg-white p-4"><h3 className="mb-3 font-black">Line / area performance</h3><table className="w-full min-w-[420px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase"><tr>{[lineField || "Line / area", "Checks", "Pass", "Hold", "Defects"].map((x)=><th className="p-2" key={x}>{x}</th>)}</tr></thead><tbody>{lineStats.map((line)=><tr key={line.line} className="border-t"><td className="p-2 font-semibold">{line.line}</td><td className="p-2">{line.checks}</td><td className="p-2">{line.pass}</td><td className="p-2">{line.hold}</td><td className="p-2">{line.defects}</td></tr>)}{!lineStats.length&&<tr><td colSpan="5" className="p-6 text-center text-slate-500">No line checks saved yet.</td></tr>}</tbody></table></section><section className="rounded-2xl border bg-white p-4"><h3 className="mb-3 font-black">Open callouts</h3>{openCallouts.map((event)=><article key={event.id} className="mb-2 rounded-lg bg-amber-50 p-3"><p className="font-bold">{event.title}</p><p className="mt-1 text-xs text-slate-600">{event.status} · {event.owner || "Owner not assigned"} · {event.nextStep}</p></article>)}{!openCallouts.length&&<p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No open callouts.</p>}</section></div><div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase"><tr>{["Record","Order","Inspector / YHR ID","Shift","Result","Saved"].map((x)=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{moduleRows.map((r)=><tr key={r.id} className="border-t"><td className="p-3 font-bold">{r.id}</td><td className="p-3">{r.values[config.fields[0]] || "—"}</td><td className="p-3">{r.inspector} · {r.employeeId}</td><td className="p-3">{r.shift}</td><td className="p-3">{r.outcome}</td><td className="p-3">{new Date(r.createdAt).toLocaleString()}</td></tr>)}{!moduleRows.length && <tr><td colSpan="6" className="p-10 text-center text-slate-500">No saved inspections yet.</td></tr>}</tbody></table></div></section>}

      {active === "report" && <section className="space-y-4"><div><h2 className="text-2xl font-black">Reports</h2><p className="text-sm text-slate-500">Five live views and CSV exports, built from checks and decisions saved for this module.</p></div><div className="flex flex-wrap gap-2">{Object.keys(reportRows).map((name)=><button key={name} onClick={()=>setSelectedReport(name)} className={tabClass(selectedReport===name)}>{name}</button>)}</div><section className="rounded-2xl border bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-black">{selectedReport}</h3><p className="text-sm text-slate-500">{reportDescriptions[selectedReport]}</p></div><button onClick={()=>exportRows(selectedReport.toLowerCase().replaceAll(" ","-"),reportRows[selectedReport])} className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white"><Download size={16}/> Export CSV</button></div>{selectedReport==="Line performance"?<div className="mt-4 overflow-x-auto"><table className="w-full min-w-[420px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase"><tr>{[lineField||"Line / area","Checks","Pass","Hold","Defects"].map((x)=><th className="p-2" key={x}>{x}</th>)}</tr></thead><tbody>{lineStats.map((line)=><tr key={line.line} className="border-t"><td className="p-2">{line.line}</td><td className="p-2">{line.checks}</td><td className="p-2">{line.pass}</td><td className="p-2">{line.hold}</td><td className="p-2">{line.defects}</td></tr>)}{!lineStats.length&&<tr><td colSpan="5" className="p-6 text-center text-slate-500">No line performance records yet.</td></tr>}</tbody></table></div>:<div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase"><tr>{["Record / event","Order / title","Inspector / actor","Status","Recorded"].map((x)=><th className="p-2" key={x}>{x}</th>)}</tr></thead><tbody>{reportRows[selectedReport].map((record)=><tr key={record.id} className="border-t"><td className="p-2 font-semibold">{record.id}</td><td className="p-2">{record.values?.[config.fields[0]]||record.title||"—"}</td><td className="p-2">{record.inspector||record.actor||"—"} {record.employeeId&&`· ${record.employeeId}`}</td><td className="p-2">{record.outcome||record.status}</td><td className="p-2">{new Date(record.createdAt||record.at).toLocaleString()}</td></tr>)}{!reportRows[selectedReport].length&&<tr><td colSpan="5" className="p-6 text-center text-slate-500">No records in this report yet.</td></tr>}</tbody></table></div>}</section></section>}

      {active === "modify" && <section className="mx-auto max-w-3xl space-y-4 rounded-2xl border bg-white p-5"><div><h2 className="text-2xl font-black">Management review and amendment</h2><p className="text-sm text-slate-500">For higher-level management. Every changed field keeps its original value and review history.</p></div><label className="block text-xs font-bold">Record<select className={`${controlClass} mt-1`} value={selectedId} onChange={(e)=>setSelectedId(e.target.value)}><option value="">Select record…</option>{moduleRows.map((r)=><option key={r.id} value={r.id}>{r.id} · {r.values[config.fields[0]]}</option>)}</select></label><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold">Manager / authorized reviewer<input className={`${controlClass} mt-1`} value={supervisor} onChange={(e)=>setSupervisor(e.target.value)} placeholder="Full name"/></label><label className="text-xs font-bold">YHR employee ID<input className={`${controlClass} mt-1`} value={supervisorId} onChange={(e)=>setSupervisorId(e.target.value)} placeholder="YHR ID"/></label><label className="text-xs font-bold sm:col-span-2">Management role<input className={`${controlClass} mt-1`} value={managerRole} onChange={(e)=>setManagerRole(e.target.value)} placeholder="Role authorized to approve this change"/></label><label className="text-xs font-bold sm:col-span-2">Decision<textarea className={`${controlClass} mt-1 min-h-16`} value={supervisorDecision} onChange={(e)=>setSupervisorDecision(e.target.value)} placeholder="Management decision"/></label><label className="text-xs font-bold">Update inspection status<select className={`${controlClass} mt-1`} value={decisionOutcome} onChange={(e)=>setDecisionOutcome(e.target.value)}><option>Keep current status</option><option>Pass</option><option>Hold</option><option>Pending</option></select></label><label className="text-xs font-bold">Correct a saved field<select className={`${controlClass} mt-1`} value={correctionField} onChange={(e)=>setCorrectionField(e.target.value)}><option value="">No field change</option>{config.fields.map((field)=><option key={field}>{field}</option>)}</select></label>{correctionField&&<label className="text-xs font-bold sm:col-span-2">Corrected value<input className={`${controlClass} mt-1`} value={correction} onChange={(e)=>setCorrection(e.target.value)} placeholder="Corrected value"/></label>}<label className="text-xs font-bold sm:col-span-2">Reason for change<textarea className={`${controlClass} mt-1 min-h-20`} value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="Why is management changing this report?"/></label><label className="text-xs font-bold sm:col-span-2">Corrective action<textarea className={`${controlClass} mt-1 min-h-20`} value={correctiveAction} onChange={(e)=>setCorrectiveAction(e.target.value)} placeholder="Action, owner and due date"/></label></div><p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">This pilot records the entered manager name and YHR ID but does not authenticate role authority. Connect the YHR authorization service before treating changes as approved.</p><button onClick={applyCorrection} className="min-h-11 rounded-xl bg-blue-700 px-5 font-black text-white">Save management decision and history</button><div className="space-y-2"><h3 className="font-black">Management history</h3>{moduleRows.flatMap((r)=>(r.history||[]).map((h)=><p key={`${r.id}${h.at}`} className="rounded-lg bg-slate-50 p-3 text-sm"><b>{r.id}</b> · {h.actor} · {h.role} · {new Date(h.at).toLocaleString()} · {h.reason} · {h.correctionField?`${h.correctionField}: ${h.correction}`:h.decisionOutcome}<details className="mt-2"><summary>View original values</summary><pre className="overflow-auto text-xs">{JSON.stringify(h.before,null,2)}</pre></details></p>))}{!moduleRows.some((r)=>(r.history||[]).length>0)&&<p className="text-sm text-slate-500">No management amendments recorded.</p>}</div></section>}

      {active === "adding" && <section className="mx-auto max-w-4xl rounded-2xl border bg-white p-5 sm:p-8"><h2 className="text-2xl font-black">Add a floor inspection</h2><p className="mt-1 text-sm text-slate-500">Scan this module’s QR on the A4 floor tablet. The pad requests the six-digit pilot code 111111.</p><div className="mt-6 grid items-center gap-6 sm:grid-cols-[minmax(250px,1fr)_280px]"><div className="space-y-3 text-sm leading-6 text-slate-600"><p><b>1.</b> Scan the QR code on the floor tablet.</p><p><b>2.</b> Enter the pilot access code <b>111111</b> and the inspector’s name and YHR ID.</p><p><b>3.</b> Record checks, defects and corrective action. A hold creates a DR issue event.</p><p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">QR opens the same module form. The current checkout stores records on this device; shared server sync must be connected separately.</p><a className="break-all text-blue-700 underline" href={qrUrl}>{qrUrl}</a><button onClick={()=>window.print()} className="flex items-center gap-2 rounded-lg border px-4 py-2 font-bold text-slate-700"><QrCode size={16}/> Print A4 QR sheet</button></div><div className="mx-auto rounded-2xl border bg-white p-5 text-center"><QRCodeSVG value={`${qrUrl}`} size={230} level="M" includeMargin/><p className="mt-3 font-black">{config.title}</p><p className="text-xs text-slate-500">Scan with floor tablet</p></div></div></section>}

      {active === "dr" && <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-3">
          <div><h2 className="text-2xl font-black">Decision Register · Root cause and CAP</h2><p className="text-sm text-slate-500">Track each issue through containment, root cause, corrective and preventive action, management decision and finalization.</p></div>
          {moduleEvents.map((event)=><article key={event.id} className="rounded-xl border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black">{event.title}</p><span className={`rounded-full px-2 py-1 text-xs font-bold ${event.status === "Finalized" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{event.type} · {event.status}</span></div>
            <p className="mt-2 text-sm text-slate-600">{event.details}</p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><p><b>Root cause:</b> {event.rootCause || "Pending investigation"}</p><p><b>Containment:</b> {event.containment || "Not recorded"}</p><p><b>Corrective action:</b> {event.correctiveAction || "Not recorded"}</p><p><b>Preventive action:</b> {event.preventiveAction || "Not recorded"}</p></div>
            <p className="mt-3 text-xs text-slate-500">{new Date(event.at).toLocaleString()} · {event.actor || "Actor not recorded"}{event.owner ? ` · Owner: ${event.owner}` : ""}{event.dueDate ? ` · Due: ${event.dueDate}` : ""}</p>
            <p className="mt-1 text-sm"><b>Decision / next step:</b> {event.nextStep}</p>{event.finalizedAt&&<p className="mt-2 text-xs font-bold text-emerald-800">Finalized {new Date(event.finalizedAt).toLocaleString()}</p>}{event.source&&<p className="mt-1 break-all text-xs text-slate-500"><b>Source:</b> {event.source}</p>}
          </article>)}
          {!moduleEvents.length&&<div className="rounded-xl border border-dashed bg-white p-10 text-center text-slate-500">No issues or management decisions recorded yet.</div>}
        </div>
        <div className="h-fit space-y-3 rounded-2xl border bg-white p-5">
          <h3 className="font-black">Record issue, CAP or decision</h3>
          <label className="block text-xs font-bold">Event type<select className={`${controlClass} mt-1`} value={drForm.type} onChange={(e)=>setDrForm({...drForm,type:e.target.value})}>{["Issue","Root cause analysis","CAP action","Supervisor decision","Manager decision","PA notice","Big Brain question","Big Brain reply"].map((v)=><option key={v}>{v}</option>)}</select></label>
          {[ ["title","Issue / decision title"], ["details","Issue details"], ["rootCause","Root cause"], ["containment","Immediate containment"], ["correctiveAction","Corrective action (CAP)"], ["preventiveAction","Preventive action"], ["owner","Action owner"], ["dueDate","Due date"], ["nextStep","Decision / next step"], ["source","PA / Big Brain source reference"] ].map(([key,label])=><label key={key} className="block text-xs font-bold">{label}{["details","rootCause","containment","correctiveAction","preventiveAction","nextStep"].includes(key)?<textarea className={`${controlClass} mt-1 min-h-16`} value={drForm[key]} onChange={(e)=>setDrForm({...drForm,[key]:e.target.value})}/>:<input className={`${controlClass} mt-1`} type={key==="dueDate"?"date":"text"} value={drForm[key]} onChange={(e)=>setDrForm({...drForm,[key]:e.target.value})}/>}</label>)}
          <div className="grid grid-cols-2 gap-3"><label className="block text-xs font-bold">Recorded by<input className={`${controlClass} mt-1`} value={drForm.actor} onChange={(e)=>setDrForm({...drForm,actor:e.target.value})}/></label><label className="block text-xs font-bold">YHR ID<input className={`${controlClass} mt-1`} value={drForm.actorId} onChange={(e)=>setDrForm({...drForm,actorId:e.target.value})}/></label></div>
          <label className="block text-xs font-bold">Lifecycle<select className={`${controlClass} mt-1`} value={drForm.status} onChange={(e)=>setDrForm({...drForm,status:e.target.value})}><option>Open</option><option>In progress</option><option>Finalized</option></select></label>
          {drForm.status==="Finalized"&&<p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Finalization requires root cause, containment, corrective action and preventive action.</p>}
          <button onClick={createDecision} className="min-h-11 w-full rounded-xl bg-blue-700 font-black text-white">Save DR / CAP event</button>
          <p className="text-xs leading-5 text-slate-500">Pilot limitation: event history is saved in this browser; the shared server and YHR role authentication are not connected.</p>
        </div>
      </section>}
    </div>
  </main>;
}
