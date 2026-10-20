import React from "react";
import { Link } from "react-router-dom";

const roles = [
  ["QC inspector / End-line QC checker", "Records startup checks or each unique garment, defects and repair reinspection. Reports quality issues to QA leader / manager; calls line leader and sewing supervisor for containment."],
  ["Line leader", "Coordinates operators, contains affected pieces and arranges repair. Calls the sewing supervisor when correction needs support."],
  ["Sewing supervisor", "Owns line correction and operator skill follow-up. Calls mechanic for machine causes and Production Manager for unresolved production or resource issues."],
  ["QA leader / manager", "Reviews first-output evidence and records startup approval or hold. Reviews repeated or unresolved end-line defects. Approval requires factory-authorized QA identity."],
  ["Production Manager", "Resolves production capacity, staffing and cross-line corrective-action issues escalated by the sewing supervisor. Coordinates with QA; production acknowledgement does not grant quality release."],
  ["Mechanic (YTM)", "Receives machine-related call-outs, corrects setup or faults and returns the operation for QC verification."]
];
export default function SewingQualityRoles() {
  return <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-4" aria-label="Sewing quality role mapping">
    <h2 className="text-lg font-bold text-white">Sewing quality · responsibilities and escalation</h2>
    <p className="mt-2 text-sm text-slate-300">Workflow role map for First Output Sewing and QC End Line Checking. These hand-offs do not verify the factory’s actual reporting lines.</p>
    <div className="my-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100"><strong>Identity and approval gap</strong><p className="mt-1">YHR shows simulated employee numbers and roles in a read-only directory. A name or YHR ID entered on a QC record provides traceability, not verified QA authorization. Confirm real employee, line and shift, QA approval scope, backup approver and escalation contact before person-level routing or relying on a release decision. This map does not assign people, send notifications or enforce permissions.</p></div>
    <div className="grid gap-3 md:grid-cols-2">{roles.map(([title, detail]) => <article key={title} className="rounded-lg border border-slate-700 p-3"><h3 className="font-bold text-white">{title}</h3><p className="mt-1 text-sm text-slate-300">{detail}</p></article>)}</div>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <article className="rounded-lg border border-sky-500/40 p-3"><Link to="/dashboard/yqms/first-output-sewing" className="font-bold text-sky-300 underline">First Output Sewing →</Link><p className="mt-2 text-sm">QC records the agreed startup trial, normally 10–20 pieces, against approved references. Failed quality, machine or skill checks hold the line. Call QA leader / manager, sewing supervisor and line leader; include mechanic for machine causes. Correct and record a new trial. QA leader / manager records the release decision before bulk sewing.</p></article>
      <article className="rounded-lg border border-sky-500/40 p-3"><Link to="/dashboard/yqms/endline-check" className="font-bold text-sky-300 underline">QC End Line Checking →</Link><p className="mt-2 text-sm">QC checks every unique garment. Contain failures and call line leader + sewing supervisor; include mechanic for machine causes. QA leader / manager reviews repeated or unresolved defects. Supervisor escalates unresolved production/resource issues to Production Manager. QC reinspects repaired garments on the same piece record.</p></article>
    </div>
    <p className="mt-3 text-xs text-slate-400">Factory-approved SOP must set recurrence thresholds, response times, shift coverage and release authority. Role recipients describe intended follow-up, not confirmed delivery to a named employee.</p>
  </section>;
}
