import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ClipboardCheck, LayoutDashboard, BookOpen, RefreshCw, ExternalLink, FileText, Settings, Plus, History, Video } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import SewingReports from "./SewingReports";
import { sewingExamples, sewingExampleForm } from "./sewingExamples";
import SewingDecisionRegister from "./SewingDecisionRegister";
import YQMSProcessIcon from "../components/YQMSProcessIcon";
import "./SewingQuality.css";
import YqmsLanguageBar from './YqmsLanguageBar';

const API = "/api/yqms/sewing";
const initial = () => ({ mo: "", line: "", style: "", color: "", size: "", shift: "Day", inspector: "", employeeId: "", sample: "20", failed: "0", sampleRef: "", machineIds: "", operatorIds: "", machineCheck: "pass", skillCheck: "pass", measurementCheck: "pass", measurementNotes: "", pieceId: "", result: "pass", severity: "major", defectLocation: "", operation: "", machine: "", defects: "", notes: "" });
const date = value => value ? new Date(value).toLocaleString() : "—";
const label = value => String(value || "").replaceAll("-", " ");
const csvCell = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
const roles = [
  ["QC checker / QA inspector", "Enter the inspection on the pad and contain failed pieces."],
  ["Line leader + sewing supervisor", "Correct operation, retrain or rebalance the line; arrange repair."],
  ["Mechanic", "Act on machine setting, needle, tension or oil issues."],
  ["QA leader / QA manager", "Review startup release, repeated defects and unresolved end-line issues."],
];
const Field = ({ title, children }) => <label className="sq-field"><span>{title}</span>{children}</label>;
const input = (form, setForm, key, placeholder = "", type = "text", required = false) => <input value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} placeholder={placeholder} type={type} required={required} />;

export default function SewingQuality({ mode, onBack }) {
  const first = mode === "first-output";
  const [tab, setTab] = useState("pad");
  const [form, setForm] = useState(() => sewingExampleForm(mode));
  const [exampleMode, setExampleMode] = useState(true);
  const [records, setRecords] = useState([]);
  const [viewer, setViewer] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [review, setReview] = useState({ actor: "", employeeId: "", note: "" });
  const [activeId, setActiveId] = useState("");
  const [recheck, setRecheck] = useState("pass");
  const [decision, setDecision] = useState("approved");
  const title = first ? "First Output Sewing" : "QC End Line Checking";
  const floorUrl = `https://yaikh.com/yqms-pad/${mode}`;

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}?mode=${encodeURIComponent(mode)}`, { credentials: "same-origin", cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not load inspections.");
      setRecords(data.records || []);
      setViewer(data.viewer || "");
      setError("");
    } catch (err) { setViewer(""); setError(err.message); }
    finally { setLoading(false); }
  }, [mode]);
  useEffect(() => { setRecords([]); setForm(sewingExampleForm(mode)); setExampleMode(true); setTab("pad"); reload(); }, [reload]);

  const shownRecords = useMemo(() => exampleMode ? sewingExamples(mode) : records, [exampleMode, mode, records]);
  const filtered = useMemo(() => shownRecords.filter(row => [row.mo, row.line, row.style, row.pieceId].join(" ").toLowerCase().includes(filter.toLowerCase())), [shownRecords, filter]);
  const metrics = useMemo(() => {
    if (first) return {
      checks: shownRecords.length, pieces: shownRecords.reduce((sum, row) => sum + (row.sample || 0), 0),
      held: shownRecords.filter(row => row.decision === "hold").length,
      pending: shownRecords.filter(row => row.decision === "pending-qa").length,
      approved: shownRecords.filter(row => row.decision === "approved").length,
    };
    const inspected = shownRecords.length;
    const defective = shownRecords.filter(row => row.result !== "pass").length;
    const defects = shownRecords.reduce((sum, row) => sum + (row.defects?.length || 0), 0);
    return { inspected, defective, defects, firstPass: inspected ? Math.round(100 * (inspected - defective) / inspected) : 0, dhu: inspected ? (100 * defects / inspected).toFixed(1) : "0.0", open: shownRecords.filter(row => row.repairStatus === "open").length };
  }, [shownRecords, first]);
  const common = { mode, ...form, defects: form.defects.split(",").map(value => value.trim()).filter(Boolean) };
  async function save(event) {
    event.preventDefault(); if (exampleMode) return; setBusy(true); setMessage(""); setError("");
    try {
      const response = await fetch(API, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(common) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not save inspection.");
      setMessage(first ? "Startup check saved. QA review is required before bulk release." : "Garment check saved. Any failed piece stays in the repair and reinspection queue.");
      setForm(previous => ({ ...initial(), mo: previous.mo, line: previous.line, style: previous.style, color: previous.color, size: previous.size, shift: previous.shift, inspector: previous.inspector, employeeId: previous.employeeId, sampleRef: previous.sampleRef, machineIds: previous.machineIds, operatorIds: previous.operatorIds }));
      await reload();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  async function update(row, action) {
    if (exampleMode || row.isExample) return;
    if (!review.actor.trim() || !review.employeeId.trim()) { setError("Enter the QA Supervisor name and YHR employee ID."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(API, { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row._id, action, actor: review.actor, employeeId: review.employeeId, note: review.note, decision, result: recheck }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not update inspection.");
      setMessage("Review saved in the quality record."); setActiveId(""); await reload();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  function downloadReport() {
    const columns = ["Created", "MO", "Line", "Style", "Inspector", "YHR ID", first ? "Sample pieces" : "Piece ID", first ? "Failed pieces" : "First result", first ? "QA decision" : "Repair status", "Defects", "Notes"];
    const rows = records.map(row => [row.createdAt, row.mo, row.line, row.style, row.inspector, row.employeeId, first ? row.sample : row.pieceId, first ? row.failed : row.result, first ? row.decision : row.repairStatus, (row.defects || []).join("; "), row.notes]);
    const csv = [columns, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `yqms-${mode}-report.csv`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const nav = [["pad", "QC pad", ClipboardCheck], ["dashboard", "Dashboard", LayoutDashboard], ["report", "Report", FileText], ["modify", "Modify", Settings], ["adding", "Adding", Plus], ["dr", "DR", History]];
  return <div className={`sq-page ${first ? "sq-first" : "sq-endline"}`}>
    <header className="sq-header"><div className="sq-header-title"><button className="sq-back" onClick={onBack} aria-label="Go back"><ArrowLeft size={18} /></button><span className="sq-process-logo"><YQMSProcessIcon title={title} /></span><div><div className="sq-eyebrow">YQMS · SEWING</div><h1>{title}</h1><p>{first ? "Startup trial · machine and skill check · QA release" : "100% garment check · defect, repair and reinspection"}</p></div></div>
      <nav className="sq-nav" aria-label="Sewing quality views">{nav.map(([key, text, Icon]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}><Icon size={17} />{text}</button>)}</nav>
      <div className="sq-header-side"><button className="sq-training" disabled title="A module-specific video has not been assigned yet"><Video size={16} />Video</button><button className="sq-training" onClick={() => setTab("sop")} title="Open SOP training and role guidance"><BookOpen size={16} />SOP</button><div className="sq-operator" title="Yai access-session viewer. The inspector entered on the pad is separate and not verified as a YHR login."><span className="sq-avatar">{viewer ? viewer.slice(0, 2).toUpperCase() : "?"}</span><span><strong>{viewer || "Sign in required"}</strong><small>{form.employeeId.trim() ? `Pad inspector ${form.employeeId.trim()} · unverified` : "Yai access session"}</small></span></div><button className="sq-refresh" onClick={reload} disabled={loading} aria-label="Refresh inspections"><RefreshCw size={15} /></button></div>
      <YqmsLanguageBar />
    </header>
    {message && <div className="sq-message" role="status">{message}</div>}{error && !exampleMode && tab !== "adding" && <div className="sq-error" role="alert">{error} {error.includes("Sign in") && <a href="/SDTV">Open Yai access page</a>}</div>}
    <main className="sq-main">
      <div className="sq-example-banner"><strong>{exampleMode ? "Training examples · 8 sample records" : "Live quality records"}</strong><span>{exampleMode ? "Fictional names, IDs and orders. Nothing shown here is a factory inspection or approval." : "Entries are loaded from the connected quality system."}</span><button type="button" onClick={() => { setExampleMode(value => !value); setForm(exampleMode ? initial() : sewingExampleForm(mode)); setActiveId(""); }}>{exampleMode ? "Start live entry" : "Show examples"}</button></div>
      {tab !== "adding" && <div className="sq-limit">Pilot workflow: Yai records the entered YHR ID but does not yet authenticate that employee’s QA role. Confirm QA authority through the factory’s existing release process before bulk sewing.</div>}
      {tab === "pad" && <div className="sq-two"><div className="sq-tablet"><div className="sq-tablet-label">Floor pad · {title}</div><section className="sq-panel"><h2>{first ? "Record a startup trial" : "Check one finished garment"}</h2><p className="sq-muted">{first ? "Check the first 10–20 pieces with the line team. Record the approved sample, machine setup, skill check and defects. A failed trial stays on hold." : "Scan each unique garment or bundle piece ID once. Reinspection updates the original check so the piece is never counted twice."}</p><form onSubmit={save}><div className="sq-grid"><Field title="MO / order *">{input(form, setForm, "mo", "MO number", "text", true)}</Field><Field title="Line *">{input(form, setForm, "line", "Line ID", "text", true)}</Field><Field title="Style *">{input(form, setForm, "style", "Style number", "text", true)}</Field><Field title="Colour">{input(form, setForm, "color")}</Field><Field title="Size">{input(form, setForm, "size")}</Field><Field title="Shift"><select value={form.shift} onChange={event => setForm({ ...form, shift: event.target.value })}><option>Day</option><option>Night</option></select></Field><Field title="QC / QA inspector *">{input(form, setForm, "inspector", "Full name", "text", true)}</Field><Field title="YHR employee ID *">{input(form, setForm, "employeeId", "e.g. YAI0123", "text", true)}</Field></div>
      {first ? <><h3>Startup checks</h3><div className="sq-grid"><Field title="Pieces checked *">{input(form, setForm, "sample", "10–20", "number", true)}</Field><Field title="Pieces failed *">{input(form, setForm, "failed", "0", "number", true)}</Field><Field title="Approved sample / tech pack ref *">{input(form, setForm, "sampleRef", "Reference", "text", true)}</Field><Field title="Machine IDs checked *">{input(form, setForm, "machineIds", "All machine IDs", "text", true)}</Field><Field title="Operator IDs checked *">{input(form, setForm, "operatorIds", "All operator IDs", "text", true)}</Field><Field title="Machines / settings *"><select value={form.machineCheck} onChange={event => setForm({ ...form, machineCheck: event.target.value })}><option value="pass">Checked · pass</option><option value="fail">Issue · hold</option></select></Field><Field title="Operator skill / operation *"><select value={form.skillCheck} onChange={event => setForm({ ...form, skillCheck: event.target.value })}><option value="pass">Checked · pass</option><option value="fail">Issue · hold</option></select></Field><Field title="Measurements *"><select value={form.measurementCheck} onChange={event => setForm({ ...form, measurementCheck: event.target.value })}><option value="pass">Checked against spec · pass</option><option value="fail">Out of tolerance · hold</option></select></Field><Field title="Measurement notes">{input(form, setForm, "measurementNotes", "Points and actual values")}</Field><Field title="Operation">{input(form, setForm, "operation", "e.g. side seam")}</Field><Field title="Machine ID">{input(form, setForm, "machine", "ID if issue found")}</Field></div></> : <><h3>100% end-line check</h3><div className="sq-grid"><Field title="Unique garment / piece ID *">{input(form, setForm, "pieceId", "Scan or enter ID", "text", true)}</Field><Field title="Inspection result *"><select value={form.result} onChange={event => setForm({ ...form, result: event.target.value })}><option value="pass">Pass</option><option value="repair">Repair / recheck</option><option value="reject">Reject / contain</option></select></Field><Field title="Defect severity"><select value={form.severity} onChange={event => setForm({ ...form, severity: event.target.value })}><option value="minor">Minor</option><option value="major">Major</option><option value="critical">Critical</option></select></Field><Field title="Defect location">{input(form, setForm, "defectLocation", "e.g. left side seam")}</Field><Field title="Operation">{input(form, setForm, "operation", "Where defect arose")}</Field><Field title="Machine ID">{input(form, setForm, "machine", "If known")}</Field></div></>}
      <div className="sq-grid"><Field title="Defect codes / names (comma separated)">{input(form, setForm, "defects", "e.g. skipped stitch, open seam")}</Field><Field title="Notes / corrective action"><textarea value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} rows="3" placeholder="Cause, correction, photo reference or instructions" /></Field></div><button className="sq-primary" disabled={busy || exampleMode}>{exampleMode ? "Example only · switch to live entry" : busy ? "Saving…" : "Save inspection"}</button></form></section></div><aside className="sq-panel sq-guidance"><h2>At the station</h2><ol>{first ? <><li>Gather line leader, supervisor, operators, mechanic if needed and QC.</li><li>Sew the agreed startup sample; verify construction and measurements against the approved sample and tech pack.</li><li>Check machine settings and each critical operator’s skill. Hold and correct defects.</li><li>QA leader reviews the record. If any check fails, rerun and record a new trial.</li></> : <><li>Check every completed sewn garment before it moves to finishing.</li><li>Record each piece ID once, with all defects and operation or machine if known.</li><li>Segregate failures, alert line leader and QA; send for repair.</li><li>Reinspect the same piece after repair. Do not count it as a new first check.</li></>}</ol><p>Quality records are saved to Yai. The YHR employee ID is recorded for traceability; role assignment follows the QA organization chart.</p></aside></div>}
      {tab === "dashboard" && <><div className="sq-kpis">{Object.entries(metrics).map(([key, value]) => <div className="sq-kpi" key={key}><span>{label(key)}</span><strong>{value}{key === "firstPass" || key === "dhu" ? "%" : ""}</strong></div>)}</div><div className="sq-two"><section className="sq-panel"><h2>{first ? "Startup decisions" : "Defect Pareto"}</h2>{first ? <div className="sq-breakdown">{["approved", "pending-qa", "hold"].map(status => <p key={status}><b>{label(status)}</b><span>{shownRecords.filter(row => row.decision === status).length}</span></p>)}</div> : <div className="sq-breakdown">{Object.entries(shownRecords.flatMap(row => row.defects || []).reduce((map, defect) => ({ ...map, [defect]: (map[defect] || 0) + 1 }), {})).sort((a,b) => b[1]-a[1]).slice(0,10).map(([name,count]) => <p key={name}><b>{name}</b><span>{count}</span></p>)}</div>}</section><section className="sq-panel"><h2>Line view</h2><div className="sq-breakdown">{Object.entries(shownRecords.reduce((map,row) => ({ ...map, [row.line]: [...(map[row.line] || []), row] }), {})).map(([line, rows]) => <p key={line}><b>{line}</b><span>{rows.length} checks · {rows.filter(row => first ? row.decision === "hold" : row.result !== "pass").length} issues</span></p>)}</div></section></div><p className="sq-muted">{first ? "Startup totals count sampled pieces; a repeated trial is a separate check." : "First pass rate counts unique first checks. DHU counts defect instances per 100 first-checked garments; repairs and rechecks do not increase the denominator."}</p></>}
      {tab === "report" && <SewingReports records={shownRecords} mode={mode} loading={loading && !exampleMode} exampleMode={exampleMode} />}{tab === "modify" && <><div className="sq-toolbar"><h2>QA Supervisor review and modification</h2><div className="sq-toolbar-actions"><input placeholder="Filter MO, line, style or piece ID" value={filter} onChange={event => setFilter(event.target.value)} />{tab === "report" && <button className="sq-secondary" onClick={downloadReport} disabled={!shownRecords.length}>Download CSV</button>}</div></div>{loading && !exampleMode ? <p>Loading records…</p> : !filtered.length ? <div className="sq-empty">No saved checks match this view. Start from QC pad.</div> : <div className="sq-cards">{filtered.map(row => <article className="sq-record" key={row._id}><div className="sq-record-top"><div><small>{row.mo} · {row.line} · {row.style}</small><h3>{first ? `${row.sample} startup pieces` : `Piece ${row.pieceId}`}</h3></div><span className={`sq-badge ${first ? row.decision : row.result}`}>{label(first ? row.decision : row.result)}</span></div><p>{date(row.createdAt)} · {row.inspector} ({row.employeeId})</p><p>{first ? `${row.failed} failed · machine ${row.machineCheck} · skill ${row.skillCheck}` : `Defects: ${row.defects?.length || 0} · repair ${row.repairStatus}`}</p>{row.defects?.length > 0 && <p><b>Defects:</b> {row.defects.join(", ")}</p>}{row.notes && <p>{row.notes}</p>}{first ? <p><b>QA review:</b> {row.approvalBy || "Awaiting QA leader / manager"}{row.approvalEmployeeId ? ` (${row.approvalEmployeeId})` : ""}</p> : row.result !== "pass" && <p><b>Call-out:</b> line leader + sewing supervisor; QA leader for repeated or unresolved issue{row.machine ? "; mechanic for machine " + row.machine : ""}. {row.alertAcknowledgedBy ? `Acknowledged by ${row.alertAcknowledgedBy}` : "Needs acknowledgement"}. {row.recheckResult ? `Recheck: ${row.recheckResult} by ${row.recheckedBy}` : "Recheck pending"}.</p>}{tab === "modify" && !exampleMode && <><button className="sq-link" onClick={() => setActiveId(activeId === row._id ? "" : row._id)}>{activeId === row._id ? "Close review" : first ? "QA review" : row.result !== "pass" ? "Acknowledge / recheck" : "Details"}</button>{activeId === row._id && <div className="sq-review"><div className="sq-grid"><Field title="QA Supervisor name">{input(review, setReview, "actor", "Full name")}</Field><Field title="QA Supervisor YHR ID">{input(review, setReview, "employeeId", "YAI ID")}</Field></div>{first ? <><Field title="QA decision"><select value={decision} onChange={event => setDecision(event.target.value)}><option value="approved">Approve startup</option><option value="hold">Hold line</option></select></Field><Field title="Review note">{input(review, setReview, "note")}</Field><button className="sq-primary" disabled={busy} onClick={() => update(row, "review")}>Save QA decision</button></> : row.result !== "pass" && <><div className="sq-actions"><button disabled={busy} onClick={() => update(row, "acknowledge")}>Acknowledge call-out</button><select value={recheck} onChange={event => setRecheck(event.target.value)}><option value="pass">Recheck pass</option><option value="repair">Still needs repair</option><option value="reject">Reject</option></select><button className="sq-primary" disabled={busy} onClick={() => update(row, "recheck")}>Save recheck</button></div></>}</div>}</>}</article>)}</div>}</>}
      {tab === "adding" && <section className="sq-panel sq-qr-panel"><div><h2>Scan to open the floor pad</h2><p className="sq-muted">Use the A4 floor tablet to scan this QR code. Enter the six-digit code on the tablet to open the connected {title} inspection form.</p><p className="sq-muted">Saved checks flow into this module’s dashboard, reports and decision register.</p><a href={floorUrl} target="_blank" rel="noreferrer">{floorUrl}</a></div><div className="sq-qr-code"><QRCodeSVG value={floorUrl} size={236} level="M" marginSize={2} title={`${title} floor pad`} /><strong>{title}</strong><span>Scan with floor tablet</span></div></section>}
      {tab === "dr" && <SewingDecisionRegister mode={mode} records={shownRecords} exampleMode={exampleMode} />}
      {tab === "sop" && <div className="sq-two"><section className="sq-panel"><h2>{first ? "SOP · First output gate" : "SOP · End-line 100% check"}</h2><ol className="sq-steps">{(first ? ["Line leader prepares the approved sample, tech pack, MO, operators and machines.", "Operators sew the agreed first output, normally 10–20 pieces; record actual sample count.", "QC checks construction, measurements, operation skill, machine setup and every defect.", "Any failed piece or failed setup holds the line. Supervisor and mechanic correct the cause; QC repeats a new trial.", "QA leader or manager records review. Only approved startup may move to normal bulk sewing."] : ["QC checker inspects every sewn garment and scans its unique piece ID.", "Record pass, repair or reject, all defects, and operation / machine if known.", "Contain defects. Line leader and supervisor arrange correction; mechanic handles machine causes; QA leader reviews recurrence.", "Repair staff return the same piece for QC reinspection. Log result on the original record.", "QA manager reviews daily line trends, first pass rate, DHU and unresolved call-outs."]).map((step,index) => <li key={step}><b>{index + 1}.</b> {step}</li>)}</ol><p className="sq-muted">Buyer-specific tolerances and sample plans take precedence. Startup sample count and escalation thresholds must be set in the approved factory SOP; these screens do not substitute an AQL final inspection.</p><h3>Public references</h3><p className="sq-muted"><a href="https://www.sscamh.com/public/backend-assets/js/ckfinder/files/Production%20Supervisor-%20Sewing_V4_0_ENG_PHB-compressed.pdf" target="_blank" rel="noreferrer">Production supervisor sewing handbook</a> · <a href="https://asiagarmenthub.net/resources/2021/sl9-checking-garments-sewing-room-operations-pdfen.pdf" target="_blank" rel="noreferrer">ILO garment checking guide</a> · <a href="https://asiagarmenthub.net/resources/2021/fit-indicators-guideen.pdf" target="_blank" rel="noreferrer">ILO quality indicators</a></p></section><section className="sq-panel"><h2>YHR QA role hand-offs</h2>{roles.map(([title, desc]) => <div className="sq-role" key={title}><strong>{title}</strong><p>{desc}</p></div>)}<a className="sq-link" href="/experience/dashboard/org-chart-master">Open YHR organization chart <ExternalLink size={14} /></a><p className="sq-muted">The org chart currently provides roles and a read-only directory. Confirm named ownership in YHR before using automated person-level routing.</p></section></div>}
    </main>
  </div>;
}
