"use client";

import { useEffect, useState } from "react";
import StationPad from "./StationPad";

type Form = Record<string, string>;
const blank = (): Form => ({ mo: "", line: "", style: "", color: "", size: "", shift: "Day", inspector: "", employeeId: "", sample: "20", failed: "0", sampleRef: "", machineIds: "", operatorIds: "", machineCheck: "pass", skillCheck: "pass", measurementCheck: "pass", measurementNotes: "", pieceId: "", result: "pass", severity: "major", defectLocation: "", operation: "", machine: "", defects: "", notes: "" });

function LegacyFloorPad({ params }: { params: { mode: string } }) {
  const mode = params.mode;
  const first = mode === "first-output";
  const valid = first || mode === "endline";
  const title = first ? "First Output Sewing" : "QC End Line Checking";
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [code, setCode] = useState("");
  const [form, setForm] = useState<Form>(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!valid) { setChecking(false); return; }
    fetch(`/api/yqms/floor-login?mode=${encodeURIComponent(mode)}`, { cache: "no-store" })
      .then(response => response.json()).then(data => setAuthorized(Boolean(data.ok)))
      .catch(() => setError("Could not check the pad connection."))
      .finally(() => setChecking(false));
  }, [mode, valid]);

  function field(name: string, key: string, required = false, type = "text", placeholder = "") {
    return <label className="fp-field"><span>{name}{required ? " *" : ""}</span><input value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} required={required} type={type} placeholder={placeholder} /></label>;
  }
  function choice(name: string, key: string, options: [string, string][]) {
    return <label className="fp-field"><span>{name}</span><select value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })}>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>;
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
      const response = await fetch("/api/yqms/sewing", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, mode, defects: form.defects.split(",").map(item => item.trim()).filter(Boolean) }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not save inspection.");
      setMessage(first ? "Startup trial saved. QA review is required before bulk sewing." : "Garment check saved. Failed pieces remain in repair or reinspection.");
      setForm(previous => ({ ...blank(), mo: previous.mo, line: previous.line, style: previous.style, color: previous.color, size: previous.size, shift: previous.shift, inspector: previous.inspector, employeeId: previous.employeeId, sampleRef: previous.sampleRef, machineIds: previous.machineIds, operatorIds: previous.operatorIds }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : "Could not save inspection.";
      if (detail.includes("Sign in")) setAuthorized(false);
      setError(detail);
    } finally { setBusy(false); }
  }
  async function logout() {
    await fetch("/api/yqms/floor-login", { method: "DELETE", credentials: "same-origin" });
    setAuthorized(false); setForm(blank()); setMessage("");
  }
  if (!valid) return <main className="fp-page"><section className="fp-card"><h1>Unknown quality pad</h1></section></main>;
  return <main className="fp-page"><style>{styles}</style><div className="fp-wrap">
    <header className="fp-header"><div><small>YAI · YQMS · SEWING</small><h1>{title}</h1><p>{first ? "Startup trial and quality release" : "100% finished sewing checks"}</p></div>{authorized && <button className="fp-logout" type="button" onClick={logout}>Lock pad</button>}</header>
    {checking ? <section className="fp-card"><p>Opening floor pad…</p></section> : !authorized ? <section className="fp-card fp-login"><div className="fp-lock">⌁</div><h2>Floor pad login</h2><p>Enter your six-digit code to open the inspection form.</p><form onSubmit={login}><label className="fp-field"><span>Six-digit code</span><input autoFocus value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" type="password" autoComplete="off" pattern="[0-9]{6}" minLength={6} maxLength={6} required aria-label="Six-digit code" /></label><button className="fp-primary" disabled={busy || code.length !== 6}>{busy ? "Opening…" : "Open inspection form"}</button></form></section> : <section className="fp-card"><h2>{first ? "Record a startup trial" : "Check one finished garment"}</h2><p className="fp-intro">{first ? "Sew and check the agreed first output before bulk production. A failed check holds the line for QA review." : "Check every unique garment after sewing. Record failed pieces for repair and reinspection."}</p><form onSubmit={save}><div className="fp-grid">{field("MO / order", "mo", true)}{field("Sewing line", "line", true)}{field("Style", "style", true)}{field("Colour", "color")}{field("Size", "size")}{choice("Shift", "shift", [["Day", "Day"], ["Night", "Night"]])}{field("QC / QA inspector", "inspector", true)}{field("YHR employee ID", "employeeId", true)}</div>
    <h3>{first ? "Startup checks" : "End-line result"}</h3><div className="fp-grid">{first ? <>{field("Pieces checked", "sample", true, "number")}{field("Pieces failed", "failed", true, "number")}{field("Approved sample / tech pack reference", "sampleRef", true)}{field("Machine IDs checked", "machineIds", true)}{field("Operator IDs checked", "operatorIds", true)}{choice("Machine settings", "machineCheck", [["pass", "Checked · pass"], ["fail", "Issue · hold"]])}{choice("Operator skills", "skillCheck", [["pass", "Checked · pass"], ["fail", "Issue · hold"]])}{choice("Measurements", "measurementCheck", [["pass", "Against spec · pass"], ["fail", "Out of tolerance · hold"]])}{field("Measurement notes", "measurementNotes")}</> : <>{field("Unique garment / piece ID", "pieceId", true)}{choice("Result", "result", [["pass", "Pass"], ["repair", "Repair / recheck"], ["reject", "Reject / contain"]])}{choice("Defect severity", "severity", [["minor", "Minor"], ["major", "Major"], ["critical", "Critical"]])}{field("Defect location", "defectLocation")}</>}{field("Operation", "operation")}{field("Machine ID", "machine")}{field("Defects, separated by commas", "defects")}</div><label className="fp-field fp-notes"><span>Notes / corrective action</span><textarea value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} rows={3} /></label><button className="fp-primary" disabled={busy}>{busy ? "Saving…" : "Save inspection"}</button></form></section>}
    {message && <div className="fp-success" role="status">{message}</div>}{error && <div className="fp-error" role="alert">{error}</div>}
  </div></main>;
}

const styles = `.fp-page{min-height:100vh;background:#eef3f8;color:#15243b;font-family:Arial,sans-serif;padding:24px}.fp-wrap{max-width:900px;margin:auto}.fp-header{background:linear-gradient(115deg,#1166a2,#0896c2);color:white;border-radius:20px;padding:25px 30px;margin-bottom:18px;display:flex;justify-content:space-between;gap:18px;align-items:center}.fp-header small{font-weight:800;letter-spacing:.14em}.fp-header h1{font-size:29px;font-weight:800;margin:6px 0}.fp-header p{margin:0;color:#d6f6ff}.fp-card{background:white;border:1px solid #d9e5ef;border-radius:20px;padding:28px;box-shadow:0 12px 36px #15385212}.fp-card h2{font-size:24px;font-weight:800;margin:0 0 8px}.fp-card h3{font-size:18px;font-weight:800;margin:25px 0 14px;border-top:1px solid #e4edf3;padding-top:22px}.fp-intro,.fp-login p{color:#577089;margin-bottom:22px}.fp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.fp-field{display:flex;flex-direction:column;gap:7px;font-weight:700;font-size:14px;color:#334b66}.fp-field input,.fp-field select,.fp-field textarea{width:100%;border:1px solid #b9cbdb;border-radius:11px;padding:13px 14px;font:inherit;font-weight:500;color:#172943;background:white;min-height:49px}.fp-field input:focus,.fp-field select:focus,.fp-field textarea:focus{outline:3px solid #8adcf7;border-color:#0787b8}.fp-notes{margin:18px 0}.fp-primary{background:#0868a7;color:white;border:0;border-radius:11px;font-size:17px;font-weight:800;padding:14px 24px;min-height:51px;margin-top:20px;cursor:pointer}.fp-primary:disabled{opacity:.6;cursor:wait}.fp-login{max-width:460px;margin:50px auto;text-align:center;padding:40px}.fp-login .fp-field{text-align:left}.fp-login .fp-field input{text-align:center;font-size:28px;letter-spacing:.32em}.fp-login .fp-primary{width:100%}.fp-lock{width:70px;height:70px;border-radius:18px;margin:0 auto 20px;background:#dcf3fb;color:#0868a7;font-size:44px;line-height:65px}.fp-logout{background:#ffffff28;color:white;border:1px solid #ffffff80;border-radius:10px;padding:10px 16px;font-weight:700;white-space:nowrap}.fp-success,.fp-error{padding:15px 20px;border-radius:12px;margin-top:16px;font-weight:700}.fp-success{background:#daf6eb;color:#076044}.fp-error{background:#ffe7e0;color:#9f2718}@media(max-width:650px){.fp-page{padding:12px}.fp-header{padding:21px;align-items:flex-start}.fp-header h1{font-size:23px}.fp-grid{grid-template-columns:1fr}.fp-card{padding:20px}.fp-login{margin:25px auto}}`;

export default function FloorPad({ params }: { params: { mode: string } }) {
  if (["inline", "roaming", "checkout", "qa20"].includes(params.mode)) return <StationPad mode={params.mode} />;
  return <LegacyFloorPad params={params} />;
}
