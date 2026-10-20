import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ClipboardCheck, LayoutDashboard, BookOpen, RefreshCw, FileText, Settings, Plus, History, Video } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import SewingReports from "./SewingReports";
import { sewingExamples, sewingExampleForm } from "./sewingExamples";
import SewingDecisionRegister from "./SewingDecisionRegister";
import YQMSProcessIcon from "../components/YQMSProcessIcon";
import "./SewingQuality.css";

const API = "/api/yqms/sewing-stations";
const config = {
  inline: { title: "Inline Auditor", subtitle: "Operation audits · sewing line follow-up", description: "Audit sampled garments and operations on one sewing line. Record defects and immediate correction." },
  roaming: { title: "Internal Roaming QC (IRQC)", subtitle: "Move between sewing lines · find and follow up quality issues", description: "Visit sewing lines, sample work in progress, and record issues requiring line leader or QA follow-up." },
  checkout: { title: "Garment Check Out", subtitle: "Released garments · sewing to finishing handoff", description: "Check out only garments with a passed end-line or passed reinspection record before handing them to finishing." },
  qa20: { title: "20pcs QA Audit", subtitle: "Independent 20-piece quality audit", description: "QA audits exactly 20 pieces from a sewing line and records defects, severity and corrective action." },
};
const empty = mode => ({ mo: "", line: "", style: "", shift: "Day", inspector: "", employeeId: "", sample: mode === "qa20" ? "20" : "10", failed: "0", defects: "", severity: "major", operation: "", machine: "", operatorId: "", notes: "", pieceIds: "", receiver: "", destination: "Finishing", bundleId: "" });
const Field = ({ title, children }) => <label className="sq-field"><span>{title}</span>{children}</label>;
const date = value => value ? new Date(value).toLocaleString() : "—";

export default function SewingStations({ mode, onBack }) {
  const item = config[mode];
  const checkout = mode === "checkout";
  const [tab, setTab] = useState("pad");
  const [form, setForm] = useState(() => sewingExampleForm(mode));
  const [exampleMode, setExampleMode] = useState(true);
  const [records, setRecords] = useState([]);
  const [viewer, setViewer] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [activeId, setActiveId] = useState("");
  const [review, setReview] = useState({ actor: "", employeeId: "", note: "", status: "resolved" });
  const floorUrl = `https://yaikh.com/yqms-pad/${mode}`;
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}?mode=${encodeURIComponent(mode)}`, { credentials: "same-origin", cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not load quality records.");
      setRecords(data.records || []); setViewer(data.viewer || ""); setError("");
    } catch (cause) { setViewer(""); setError(cause.message); }
    finally { setLoading(false); }
  }, [mode]);
  useEffect(() => { setTab("pad"); setForm(sewingExampleForm(mode)); setExampleMode(true); reload(); }, [reload, mode]);
  const shownRecords = useMemo(() => exampleMode ? sewingExamples(mode) : records, [exampleMode, mode, records]);
  const filtered = useMemo(() => shownRecords.filter(row => [row.mo, row.line, row.style, row.inspector, ...(row.pieceIds || [])].join(" ").toLowerCase().includes(filter.toLowerCase())), [shownRecords, filter]);
  const metrics = useMemo(() => ({ checks: shownRecords.length, pieces: shownRecords.reduce((sum, row) => sum + Number(row.sample || row.quantity || 0), 0), issues: shownRecords.reduce((sum, row) => sum + Number(row.failed || 0), 0), open: shownRecords.filter(row => row.status === "action-needed").length }), [shownRecords]);
  const input = (key, placeholder = "", type = "text", required = false, readOnly = false) => <input value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} placeholder={placeholder} type={type} required={required} readOnly={readOnly} />;
  async function save(event) {
    event.preventDefault(); if (exampleMode) return; setBusy(true); setError(""); setMessage("");
    try {
      const payload = { ...form, mode, defects: form.defects.split(",").map(value => value.trim()).filter(Boolean), pieceIds: form.pieceIds.split(/[\s,]+/).map(value => value.trim()).filter(Boolean) };
      const response = await fetch(API, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not save quality record.");
      setMessage(checkout ? "Garments checked out to finishing. Handoff saved." : "Quality check saved. Failed checks remain open for QA Supervisor follow-up.");
      setForm(previous => ({ ...empty(mode), mo: previous.mo, line: previous.line, style: previous.style, shift: previous.shift, inspector: previous.inspector, employeeId: previous.employeeId }));
      await reload();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }
  async function modify(row) {
    if (exampleMode || row.isExample) return;
    if (!review.actor.trim() || !review.employeeId.trim() || !review.note.trim()) { setError("Enter QA Supervisor name, YHR ID and review note."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(API, { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row._id, ...review }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not save review.");
      setMessage("QA Supervisor review saved with name and YHR ID."); setActiveId(""); setReview({ actor: "", employeeId: "", note: "", status: "resolved" }); await reload();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }
  const nav = [["pad", "QC pad", ClipboardCheck], ["dashboard", "Dashboard", LayoutDashboard], ["report", "Report", FileText], ["modify", "Modify", Settings], ["adding", "Adding", Plus], ["dr", "DR", History]];
  return <div className="sq-page sq-station"><header className="sq-header"><div className="sq-header-title"><button className="sq-back" onClick={onBack} aria-label="Go back"><ArrowLeft size={18} /></button><span className="sq-process-logo"><YQMSProcessIcon title={item.title} /></span><div><div className="sq-eyebrow">YQMS · SEWING</div><h1>{item.title}</h1><p>{item.subtitle}</p></div></div><nav className="sq-nav" aria-label="Sewing quality views">{nav.map(([key, title, Icon]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}><Icon size={17} />{title}</button>)}</nav><div className="sq-header-side"><button className="sq-training" disabled title="A module-specific video has not been assigned yet"><Video size={16} />Video</button><button className="sq-training" onClick={() => setTab("sop")}><BookOpen size={16} />SOP</button><div className="sq-operator"><span className="sq-avatar">{viewer ? viewer.slice(0, 2).toUpperCase() : "?"}</span><span><strong>{viewer || "Sign in required"}</strong><small>Yai access session</small></span></div><button className="sq-refresh" onClick={reload} disabled={loading} aria-label="Refresh quality records"><RefreshCw size={15} /></button></div></header>
    {message && <div className="sq-message" role="status">{message}</div>}{error && !exampleMode && tab !== "adding" && <div className="sq-error" role="alert">{error}</div>}
    <main className="sq-main"><div className="sq-example-banner"><strong>{exampleMode ? "Training examples · 6 sample records" : "Live quality records"}</strong><span>{exampleMode ? "Fictional names, IDs and orders. Nothing shown here is a factory inspection or release." : "Entries are loaded from the connected quality system."}</span><button type="button" onClick={() => { setExampleMode(value => !value); setForm(exampleMode ? empty(mode) : sewingExampleForm(mode)); setActiveId(""); }}>{exampleMode ? "Start live entry" : "Show examples"}</button></div>{tab !== "adding" && <div className="sq-limit">Pilot workflow: Yai records the entered YHR ID and QA Supervisor name but does not yet verify role authority against YHR. Confirm supervisor authority through the factory’s release process.</div>}
      {tab === "pad" && <div className="sq-two"><div className="sq-tablet"><div className="sq-tablet-label">Floor pad · {item.title}</div><section className="sq-panel"><h2>{checkout ? "Sewing to finishing handoff" : "Record a sewing quality check"}</h2><p className="sq-muted">{item.description}</p><form onSubmit={save}><div className="sq-grid"><Field title="MO / order *">{input("mo", "MO number", "text", true)}</Field><Field title="Sewing line *">{input("line", "Line ID", "text", true)}</Field><Field title="Style *">{input("style", "Style", "text", true)}</Field><Field title="Shift"><select value={form.shift} onChange={event => setForm({ ...form, shift: event.target.value })}><option>Day</option><option>Night</option></select></Field><Field title="QC / QA inspector *">{input("inspector", "Full name", "text", true)}</Field><Field title="YHR employee ID *">{input("employeeId", "YHR ID", "text", true)}</Field></div>{checkout ? <><h3>Released garments</h3><div className="sq-grid"><Field title="Garment IDs *"><textarea value={form.pieceIds} onChange={event => setForm({ ...form, pieceIds: event.target.value })} rows="4" required placeholder="Scan each garment ID; separate with a space, comma or line break" /></Field><Field title="Bundle ID">{input("bundleId")}</Field><Field title="Destination *">{input("destination", "Finishing", "text", true)}</Field><Field title="Received by *">{input("receiver", "Finishing receiver name", "text", true)}</Field></div><p className="sq-muted">Each ID must have a passed end-line or passed reinspection record. The same ID cannot be checked out twice.</p></> : <><h3>{mode === "qa20" ? "20-piece QA sample" : "Line sample"}</h3><div className="sq-grid"><Field title="Pieces checked *">{input("sample", "Quantity", "number", true, mode === "qa20")}</Field><Field title="Pieces failed *">{input("failed", "0", "number", true)}</Field><Field title="Defects, comma separated">{input("defects", "e.g. open seam, skipped stitch")}</Field><Field title="Defect severity"><select value={form.severity} onChange={event => setForm({ ...form, severity: event.target.value })}><option value="minor">Minor</option><option value="major">Major</option><option value="critical">Critical</option></select></Field><Field title="Operation">{input("operation", "e.g. sleeve attach")}</Field><Field title="Machine ID">{input("machine")}</Field><Field title="Operator ID">{input("operatorId")}</Field></div></>}<Field title="Notes / immediate correction"><textarea value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} rows="3" /></Field><button className="sq-primary" disabled={busy || exampleMode}>{exampleMode ? "Example only · switch to live entry" : busy ? "Saving…" : checkout ? "Check out garments" : "Save quality check"}</button></form></section></div><aside className="sq-panel sq-guidance"><h2>At the station</h2><ol>{(checkout ? ["Scan each garment that is leaving sewing.", "Confirm every piece passed end-line QC or reinspection.", "Record the finishing receiver and destination.", "Keep failed or uninspected pieces in sewing or repair."] : mode === "roaming" ? ["Move between active sewing lines.", "Sample current work and record the line, operation and machine.", "Contain defects and tell the line leader and sewing supervisor.", "QA Supervisor records the corrective action and follow-up decision."] : mode === "inline" ? ["Audit a sewing line during production.", "Record the actual sample and every defect.", "Call the line leader, supervisor and mechanic when relevant.", "QA Supervisor reviews recurring or unresolved issues."] : ["Select 20 pieces from the line.", "Record every failed piece and defect.", "Hold and correct quality issues before release.", "QA Supervisor reviews the result and corrective action."]).map(step => <li key={step}>{step}</li>)}</ol></aside></div>}
      {tab === "dashboard" && <><div className="sq-kpis">{Object.entries(metrics).map(([key, value]) => <div className="sq-kpi" key={key}><span>{key === "pieces" && checkout ? "Released garments" : key}</span><strong>{value}</strong></div>)}</div><div className="sq-two"><section className="sq-panel"><h2>Line activity</h2><div className="sq-breakdown">{Object.entries(shownRecords.reduce((map, row) => ({ ...map, [row.line]: [...(map[row.line] || []), row] }), {})).map(([line, rows]) => <p key={line}><b>{line}</b><span>{rows.length} checks · {rows.reduce((sum, row) => sum + Number(row.failed || 0), 0)} issues</span></p>)}</div></section><section className="sq-panel"><h2>Current follow-up</h2><div className="sq-breakdown">{["action-needed", "resolved", "pass", "released", "reviewed"].map(status => <p key={status}><b>{status.replaceAll("-", " ")}</b><span>{shownRecords.filter(row => row.status === status).length}</span></p>)}</div></section></div><p className="sq-muted">Counts come from saved records in this module. A missing record is not treated as a pass.</p></>}
      {tab === "report" && <SewingReports records={shownRecords} mode={mode} loading={loading && !exampleMode} exampleMode={exampleMode} />}
      {tab === "modify" && <><div className="sq-toolbar"><h2>QA Supervisor review and modification</h2><input placeholder="Filter MO, line, style or inspector" value={filter} onChange={event => setFilter(event.target.value)} /></div>{loading && !exampleMode ? <p>Loading records…</p> : !filtered.length ? <div className="sq-empty">No saved checks match this view. Start from QC pad.</div> : <div className="sq-cards">{filtered.map(row => <article className="sq-record" key={row._id}><div className="sq-record-top"><div><small>{row.mo} · {row.line} · {row.style}</small><h3>{checkout ? `${row.quantity} garments checked out` : `${row.sample} pieces audited`}</h3></div><span className="sq-badge">{row.status}</span></div><p>{date(row.createdAt)} · {row.inspector} ({row.employeeId})</p>{checkout ? <p>Receiver: {row.receiver} · {row.destination} · IDs: {row.pieceIds?.join(", ")}</p> : <p>{row.failed} failed · Defects: {(row.defects || []).join(", ") || "none"}</p>}{row.notes && <p>{row.notes}</p>}{row.reviewedBy && <p><b>QA Supervisor:</b> {row.reviewedBy} ({row.reviewedEmployeeId}) · {row.correctiveAction}</p>}{!exampleMode && <button className="sq-link" onClick={() => setActiveId(activeId === row._id ? "" : row._id)}>{activeId === row._id ? "Close review" : "QA Supervisor review"}</button>}{!exampleMode && activeId === row._id && <div className="sq-review"><div className="sq-grid"><Field title="QA Supervisor name *"><input value={review.actor} onChange={event => setReview({ ...review, actor: event.target.value })} required /></Field><Field title="QA Supervisor YHR ID *"><input value={review.employeeId} onChange={event => setReview({ ...review, employeeId: event.target.value })} required /></Field></div>{!checkout && <Field title="Decision"><select value={review.status} onChange={event => setReview({ ...review, status: event.target.value })}><option value="resolved">Resolved after correction</option><option value="action-needed">Keep open / hold</option><option value="pass">Reviewed · pass</option></select></Field>}<Field title="Corrective action and next step *"><textarea value={review.note} onChange={event => setReview({ ...review, note: event.target.value })} rows="3" required /></Field><button className="sq-primary" disabled={busy} onClick={() => modify(row)}>Save supervisor decision</button></div>}</article>)}</div>}</>}
      {tab === "adding" && <section className="sq-panel sq-qr-panel"><div><h2>Scan to open the floor pad</h2><p className="sq-muted">Use the A4 floor tablet to scan this QR code. Enter the six-digit code to open the connected {item.title} form.</p><p className="sq-muted">Saved checks appear in this module’s dashboard, five reports, modification queue and decision register.</p><a href={floorUrl} target="_blank" rel="noreferrer">{floorUrl}</a></div><div className="sq-qr-code"><QRCodeSVG value={floorUrl} size={236} level="M" marginSize={2} title={`${item.title} floor pad`} /><strong>{item.title}</strong><span>Scan with floor tablet</span></div></section>}
      {tab === "dr" && <SewingDecisionRegister mode={mode} records={shownRecords} exampleMode={exampleMode} />}
      {tab === "sop" && <section className="sq-panel"><h2>SOP · {item.title}</h2><p>{item.description}</p><ol><li>QC records the check on the floor pad.</li><li>Contain failed pieces and inform the line leader or sewing supervisor.</li><li>QA Supervisor records their named review, corrective action and next step.</li><li>Management decisions and PA / Big Brain events appear in DR when actually recorded.</li></ol><p className="sq-muted">Use the approved buyer and factory SOP for sample plans, limits and release authority.</p></section>}
    </main></div>;
}
