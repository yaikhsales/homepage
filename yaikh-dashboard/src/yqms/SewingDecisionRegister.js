import React, { useCallback, useEffect, useMemo, useState } from "react";
import { sewingExampleEvents } from "./sewingExamples";
import { useNarrativeTranslation } from './useNarrativeTranslation';

const API = "/api/yqms/decisions";
const when = value => value ? new Date(value).toLocaleString() : "—";
const label = value => String(value || "").replaceAll("-", " ");
const initial = { kind: "decision", role: "QA Supervisor", actor: "", employeeId: "", summary: "", nextAction: "", dueAt: "", mo: "", line: "" };
const exampleForm = { ...initial, role: "Quality Manager", actor: "Demo Quality Manager", employeeId: "DEMO-QM-001", summary: "DEMO: Hold the affected bundle and review the defect trend.", nextAction: "DEMO: QA Supervisor checks the correction before release.", mo: "DEMO-MO-102", line: "S03", dueAt: "2026-10-20T17:00" };

function recordEvents(records) {
  return records.flatMap(row => {
    const context = `${row.mo || "—"} · ${row.line || "—"} · ${row.style || "—"}`;
    const item = row.pieceId ? ` · garment ${row.pieceId}` : row.pieceIds?.length ? ` · ${row.pieceIds.length} garments` : row.sample ? ` · ${row.sample} pieces` : "";
    const created = { id: `${row._id}-created`, at: row.createdAt, kind: "inspection", source: "quality-record", actor: row.inspector, role: "QC / QA", employeeId: row.employeeId, summary: `${context}${item}: ${row.status || row.decision || row.result || "recorded"}. ${row.failed ? `${row.failed} failed. ` : ""}${(row.defects || []).join(", ")}`, nextAction: row.status === "action-needed" || row.decision === "hold" || row.repairStatus === "open" ? "Contain failed work and arrange correction." : "" };
    const history = [...(row.history || []), ...(row.reviewHistory || [])].filter(event => event.action !== "created").map((event, index) => ({ id: `${row._id}-history-${index}`, at: event.at, kind: event.action || "review", source: "quality-record", actor: event.actor, role: "QA Supervisor", employeeId: event.employeeId, summary: `${context}: ${label(event.action)}.`, nextAction: event.note || row.correctiveAction || "" }));
    if (!history.length && row.approvedAt) history.push({ id: `${row._id}-approved`, at: row.approvedAt, kind: "review", source: "quality-record", actor: row.approvalBy, role: "QA Supervisor", employeeId: row.approvalEmployeeId, summary: `${context}: ${label(row.decision)}`, nextAction: row.approvalNote || "" });
    return [created, ...history];
  });
}

export default function SewingDecisionRegister({ mode, records, exampleMode = false }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(() => exampleMode ? exampleForm : initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const reload = useCallback(async () => {
    try {
      const response = await fetch(`${API}?mode=${encodeURIComponent(mode)}`, { credentials: "same-origin", cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not load decision events.");
      setEvents(data.events || []); setError("");
    } catch (cause) { setError(cause.message); }
  }, [mode]);
  useEffect(() => { if (!exampleMode) reload(); }, [reload, exampleMode]);
  useEffect(() => { setForm(exampleMode ? exampleForm : initial); }, [exampleMode, mode]);
  const timeline = useMemo(() => [...recordEvents(records), ...(exampleMode ? sewingExampleEvents(mode) : events.map(event => ({ ...event, id: event._id })))].sort((a, b) => new Date(b.at) - new Date(a.at)), [records, events, mode, exampleMode]);
  const notes = useMemo(() => timeline.flatMap(event => event.source === 'quality-record' ? [event.nextAction] : [event.summary, event.nextAction]).filter(Boolean), [timeline]);
  const narrative = useNarrativeTranslation(notes, !exampleMode);
  async function submit(event) {
    event.preventDefault(); if (exampleMode) return; setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(API, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, mode }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not save decision.");
      setForm(initial); setMessage("Named decision added to the register."); await reload();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }
  return <section className="sq-dr"><div className="sq-two"><div className="sq-panel"><h2>Decision register</h2><p className="sq-muted">Time ordered quality checks, decisions, corrective actions and next steps. PA notices and Big Brain questions/replies appear only when their connected systems send events. Names and YHR IDs are recorded; role authority is not yet verified against YHR.</p>{narrative.state==='loading'&&<p>Translating report notes…</p>}{narrative.state==='unavailable'&&<p>Note translation unavailable; original notes are shown.</p>}{error && <div className="sq-error" role="alert">{error}</div>}{message && <div className="sq-message" role="status">{message}</div>}{!timeline.length ? <div className="sq-empty">No quality events or decisions recorded yet.</div> : <div className="sq-timeline">{timeline.map(event => <article key={event.id}><div><time>{when(event.at)}</time><span className="sq-badge">{label(event.kind)}</span><span className="sq-badge">{event.source === "example" ? "Training example" : event.source === "connected-agent" ? "Connected PA / Big Brain" : event.source === "human" ? "Management decision" : "Quality record"}</span></div><h3>{event.source==='quality-record'?event.summary:narrative.render(event.summary)}</h3><p><b>{event.role || "Recorded by"}:</b> {event.actor || "—"}{event.employeeId ? ` (${event.employeeId})` : ""}</p>{event.nextAction && <p><b>Next action:</b> {narrative.render(event.nextAction)}</p>}{event.dueAt && <p><b>Due:</b> {when(event.dueAt)}</p>}{(event.mo || event.line) && <small>{[event.mo, event.line].filter(Boolean).join(" · ")}</small>}</article>)}</div>}</div><aside className="sq-panel"><h2>Record a management action</h2><p className="sq-muted">Factory Manager, Quality Manager, Senior Supervisor or QA Supervisor records the decision under their own name.</p><form onSubmit={submit} className="sq-decision-form"><label className="sq-field"><span>Action type *</span><select value={form.kind} onChange={event => setForm({ ...form, kind: event.target.value })}><option value="decision">Decision</option><option value="corrective-action">Corrective action</option></select></label><label className="sq-field"><span>Role *</span><select value={form.role} onChange={event => setForm({ ...form, role: event.target.value })}><option>QA Supervisor</option><option>Senior Supervisor</option><option>Quality Manager</option><option>Factory Manager</option></select></label><label className="sq-field"><span>Name *</span><input value={form.actor} onChange={event => setForm({ ...form, actor: event.target.value })} required /></label><label className="sq-field"><span>YHR employee ID *</span><input value={form.employeeId} onChange={event => setForm({ ...form, employeeId: event.target.value })} required /></label><label className="sq-field"><span>Decision or issue handled *</span><textarea value={form.summary} onChange={event => setForm({ ...form, summary: event.target.value })} rows="3" required /></label><label className="sq-field"><span>Corrective action / what next</span><textarea value={form.nextAction} onChange={event => setForm({ ...form, nextAction: event.target.value })} rows="3" /></label><div className="sq-grid"><label className="sq-field"><span>MO</span><input value={form.mo} onChange={event => setForm({ ...form, mo: event.target.value })} /></label><label className="sq-field"><span>Line</span><input value={form.line} onChange={event => setForm({ ...form, line: event.target.value })} /></label></div><label className="sq-field"><span>Due date / time</span><input type="datetime-local" value={form.dueAt} onChange={event => setForm({ ...form, dueAt: event.target.value })} /></label><button className="sq-primary" disabled={busy || exampleMode}>{exampleMode ? "Example only · switch to live entry" : busy ? "Saving…" : "Record decision"}</button></form></aside></div></section>;
}
