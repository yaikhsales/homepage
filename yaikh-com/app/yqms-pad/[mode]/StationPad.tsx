"use client";

import { useEffect, useState } from "react";

type Form = Record<string, string>;
const titles: Record<string, string> = { inline: "Inline Auditor", roaming: "Internal Roaming QC (IRQC)", checkout: "Garment Check Out", qa20: "20pcs QA Audit" };
const blank = (mode: string): Form => ({ mo: "", line: "", style: "", shift: "Day", inspector: "", employeeId: "", sample: mode === "qa20" ? "20" : "10", failed: "0", defects: "", severity: "major", operation: "", machine: "", operatorId: "", notes: "", pieceIds: "", receiver: "", destination: "Finishing", bundleId: "" });

export default function StationPad({ mode }: { mode: string }) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [code, setCode] = useState("");
  const [form, setForm] = useState<Form>(() => blank(mode));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const checkout = mode === "checkout";
  useEffect(() => {
    fetch(`/api/yqms/floor-login?mode=${encodeURIComponent(mode)}`, { cache: "no-store" })
      .then(response => response.json()).then(data => setAuthorized(Boolean(data.ok)))
      .catch(() => setError("Could not check the pad connection."))
      .finally(() => setChecking(false));
  }, [mode]);
  function field(label: string, key: string, required = false, type = "text", readOnly = false) {
    return <label className="sp-field"><span>{label}{required ? " *" : ""}</span><input value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} type={type} required={required} readOnly={readOnly} /></label>;
  }
  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/yqms/floor-login", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, code }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not open pad.");
      setAuthorized(true); setCode("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not open pad."); }
    finally { setBusy(false); }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const payload = { ...form, mode, defects: form.defects.split(",").map(value => value.trim()).filter(Boolean), pieceIds: form.pieceIds.split(/[\s,]+/).map(value => value.trim()).filter(Boolean) };
      const response = await fetch("/api/yqms/sewing-stations", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not save quality record.");
      setMessage(checkout ? "Sewing to finishing handoff saved." : "Quality audit saved for supervisor follow-up.");
      setForm(previous => ({ ...blank(mode), mo: previous.mo, line: previous.line, style: previous.style, shift: previous.shift, inspector: previous.inspector, employeeId: previous.employeeId }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : "Could not save quality record.";
      if (detail.includes("Sign in")) setAuthorized(false);
      setError(detail);
    } finally { setBusy(false); }
  }
  async function logout() {
    await fetch("/api/yqms/floor-login", { method: "DELETE", credentials: "same-origin" });
    setAuthorized(false); setForm(blank(mode)); setMessage("");
  }
  return <main className="sp-page"><style>{styles}</style><div className="sp-wrap"><header className="sp-header"><div><small>YAI · YQMS · SEWING</small><h1>{titles[mode]}</h1><p>{checkout ? "Passed garments to finishing" : "Connected floor quality inspection"}</p></div>{authorized && <button onClick={logout} className="sp-lock" type="button">Lock pad</button>}</header>
    {message && <div className="sp-success" role="status">{message}</div>}{error && <div className="sp-error" role="alert">{error}</div>}
    {checking ? <section className="sp-card">Opening floor pad…</section> : !authorized ? <section className="sp-card sp-login"><h2>Floor pad login</h2><p>Enter the six digit code after scanning this module’s QR code.</p><form onSubmit={login}><label className="sp-field"><span>Six digit code</span><input autoFocus type="password" inputMode="numeric" autoComplete="off" pattern="[0-9]{6}" minLength={6} maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required /></label><button className="sp-primary" disabled={busy || code.length !== 6}>{busy ? "Opening…" : "Open form"}</button></form></section> : <section className="sp-card"><h2>{checkout ? "Sewing to finishing handoff" : "Record a quality check"}</h2><p>{checkout ? "Only garments with passed end-line QC or passed reinspection may leave sewing." : mode === "qa20" ? "Select and inspect exactly 20 pieces. Record all failed pieces and defects." : "Inspect work in progress on the active sewing line and record actual issues."}</p><form onSubmit={save}><div className="sp-grid">{field("MO / order", "mo", true)}{field("Sewing line", "line", true)}{field("Style", "style", true)}<label className="sp-field"><span>Shift</span><select value={form.shift} onChange={event => setForm({ ...form, shift: event.target.value })}><option>Day</option><option>Night</option></select></label>{field("QC / QA inspector", "inspector", true)}{field("YHR employee ID", "employeeId", true)}</div><h3>{checkout ? "Released garments" : "Inspection result"}</h3>{checkout ? <><label className="sp-field"><span>Unique garment IDs *</span><textarea value={form.pieceIds} onChange={event => setForm({ ...form, pieceIds: event.target.value })} rows={3} required placeholder="Scan each ID; separate with spaces, commas or new lines" /></label><div className="sp-grid">{field("Bundle ID", "bundleId")}{field("Finishing receiver", "receiver", true)}{field("Destination", "destination", true)}</div></> : <div className="sp-grid">{field("Pieces checked", "sample", true, "number", mode === "qa20")}{field("Pieces failed", "failed", true, "number")}{field("Defects, comma separated", "defects")}{field("Operation", "operation")}{field("Machine ID", "machine")}{field("Operator ID", "operatorId")}<label className="sp-field"><span>Defect severity</span><select value={form.severity} onChange={event => setForm({ ...form, severity: event.target.value })}><option>minor</option><option>major</option><option>critical</option></select></label></div>}<label className="sp-field"><span>Notes and immediate correction</span><textarea value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} rows={3} /></label><button className="sp-primary" disabled={busy}>{busy ? "Saving…" : checkout ? "Save handoff" : "Save quality check"}</button></form></section>}
  </div></main>;
}
const styles = `.sp-page{min-height:100vh;background:#eef3f8;color:#14263b;font-family:Arial,sans-serif;padding:20px}.sp-wrap{max-width:900px;margin:auto}.sp-header{display:flex;justify-content:space-between;align-items:center;gap:20px;background:linear-gradient(110deg,#185d9a,#29a8ca);color:white;border-radius:19px;padding:24px;margin-bottom:16px}.sp-header small{letter-spacing:.14em;font-weight:800}.sp-header h1{font-size:26px;margin:6px 0}.sp-header p{margin:0;color:#e2faff}.sp-card{background:white;border:1px solid #d5e2ec;border-radius:18px;padding:26px;box-shadow:0 10px 30px #1a4b7110}.sp-card h2{margin:0 0 7px}.sp-card h3{border-top:1px solid #e4edf2;margin:24px 0 14px;padding-top:20px}.sp-card p{color:#567188;line-height:1.5}.sp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:20px 0}.sp-field{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:800;color:#36536a;margin:12px 0}.sp-field input,.sp-field select,.sp-field textarea{box-sizing:border-box;width:100%;border:1px solid #b6c9da;border-radius:10px;background:white;color:#18314b;font:inherit;font-weight:500;padding:12px;min-height:46px}.sp-field input:focus,.sp-field select:focus,.sp-field textarea:focus{outline:3px solid #a0e6f3}.sp-primary{background:#12689f;color:white;border:0;border-radius:10px;padding:13px 20px;font-size:16px;font-weight:800;cursor:pointer}.sp-primary:disabled{opacity:.6}.sp-lock{color:white;background:#ffffff25;border:1px solid #ffffff88;border-radius:9px;padding:10px 15px}.sp-login{max-width:440px;margin:40px auto}.sp-login input{text-align:center;font-size:25px;letter-spacing:.24em}.sp-success,.sp-error{padding:14px 18px;border-radius:10px;margin-bottom:15px;font-weight:700}.sp-success{background:#daf5e9;color:#066449}.sp-error{background:#ffe6dd;color:#952917}@media(max-width:650px){.sp-page{padding:10px}.sp-grid{grid-template-columns:1fr}.sp-card{padding:19px}.sp-header{padding:20px}.sp-header h1{font-size:21px}}`;
