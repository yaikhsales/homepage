import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function cuttingAudits(firstOutput) {
  const styles = ["STY-1015", "STY-7497", "STY-7495", "STY-9191"];
  const statuses = ["PASS", "FAIL", "PASS", "PASSED WITH CAP"];
  return styles.map((style, i) => ({
    id: `AUD-${101+i}`, style, auditor: ["YAI0350","YAI0322","YAI0538","YAI0960"][i],
    samples: 20, defects: [1,4,0,2][i], status: statuses[i], date: ["2026-02-14","2026-02-14","2026-02-13","2026-02-12"][i],
    mo: ["MO-1015-01","MO-7497-02","MO-7495-01","MO-9191-03"][i],
    buyer: ["Customer BB","Customer CC","Customer AA","Customer BB"][i],
    color: ["Navy","Black","White","Olive"][i], size: ["M","L","S","XL"][i], table: ["04","02","01","03"][i],
    lay: `LAY-${101+i}`, marker: `MK-${101+i}-R2`, pattern: `${style}-P03`, shade: `SG-${i+1}`, roll: `RL-${501+i}`,
    scope: firstOutput ? "First cut from this marker and lay; compare the first panel set before repeat cutting." : "Independent QA review of numbered output before transfer to sewing.",
    finding: ["One removable chalk mark on a back panel; cleaned and reinspected.","Four sleeve panels have a notch displaced by 5 mm; held for replacement.","No defects found in the 20 checked panels.","Two edge defects corrected by same-roll replacement; preventive maintenance remains open."][i],
    cause: ["Excess marking chalk at table setup.","Marker shifted while the lay was being secured.","No corrective action required.","Blade condition deteriorated between routine checks."][i],
    action: ["Reduce chalk pressure and retain the clean reference panel.","Stop the affected lay, secure the marker, recut the four panels from the matching shade and check the full affected bundle.","Retain the accepted reference and continue routine monitoring.","Service the blade guide and document the next setup check; continue only within the identified released lot."][i],
    cap: ["Closed","Open · product hold","None","Open · prevention only"][i],
    release: ["RELEASED · correction verified by QA", "HOLD · no transfer to sewing", "RELEASED · checked scope only", "CONDITIONAL RELEASE · product corrections verified"][i],
    verification: ["YAI0350 · 10:35 · 1/1 corrected panel accepted", "Not signed · replacement and QA reinspection required", "YAI0538 · 09:45 · 20/20 accepted", "YAI0960 · 14:20 · 2/2 replacement panels accepted"][i],
    due: ["Closed 10:35", "Before restart / transfer", "Routine next lay", "Next shift setup" ][i],
    measurements: [
      {point:"Panel length",target:600,actual:[601,600,599,601][i]},
      {point:"Panel width",target:280,actual:[280,281,280,279][i]},
      {point:"Notch position",target:120,actual:[120,125,121,120][i]},
    ],
  }));
}

export default function CuttingAuditDetails({ audit, title, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    return () => previous?.focus();
  }, []);
  function keyboard(event) {
    if (event.key === "Escape") onClose();
    if (event.key === "Tab") {
      const controls = Array.from(dialogRef.current.querySelectorAll('button,a[href]'));
      const first = controls[0], last = controls[controls.length-1];
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    }
  }
  const checks = [
    ["Approved pattern / marker",`${audit.pattern} / ${audit.marker}; revision verified.`],
    ["Fabric release / shade",`${audit.roll}, ${audit.shade}; released material only.`],
    ["Lay setup",`${audit.lay}; alignment, tension and ply count reviewed.`],
    ["Cut shape / dimensions","Compare to the effective pattern; see measurements below."],
    ["Notches / drill marks",audit.status==="FAIL"?"FAIL · displaced sleeve notch; stop and correct.":"Location and completeness accepted after correction where applicable."],
    ["Grain / direction","Panel direction matches marker; no size mixing observed."],
    ["Edges / fabric defects",audit.finding],
    ["Numbering / bundle identity",`Size ${audit.size}; matching serials and shade; bundle ${audit.lay}-B01.`],
  ];
  return <div className="fixed inset-0 z-[100] bg-slate-950/60 p-3 sm:p-8 flex items-center justify-center" onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="cutting-audit-title" onKeyDown={keyboard} className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90dvh] overflow-auto text-slate-800">
      <header className="sticky top-0 bg-white border-b p-5 flex justify-between items-start gap-4 z-10">
        <div><p className="text-sm font-bold text-blue-700">{title} · Audit details</p><h2 id="cutting-audit-title" className="text-2xl font-black">{audit.id} · {audit.style}</h2><p className="mt-1 font-bold">{audit.status} · {audit.release}</p></div>
        <button ref={closeRef} onClick={onClose} aria-label="Close audit details" className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-700"><X size={24}/></button>
      </header>
      <div className="p-5 sm:p-7 space-y-6">
        <p className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm">Training demo · All orders, measurements and approvals below are simulated. The 20-panel scope and ±2 mm tolerance are demo settings, not a buyer AQL rule or universal tolerance.</p>
        <section><h3 className="text-lg font-bold mb-3">Order and inspection scope</h3><div className="grid sm:grid-cols-2 gap-3 text-sm">{Object.entries({"MO / buyer":`${audit.mo} / ${audit.buyer}`,"Colour / size":`${audit.color} / ${audit.size}`,"Date / inspector":`${audit.date} / ${audit.auditor}`,"Table / lay":`${audit.table} / ${audit.lay}`,"Checked / initially defective":`${audit.samples} / ${audit.defects} panels`,"CAP status":audit.cap}).map(([label,value])=><div key={label} className="p-3 border rounded-xl"><p className="text-slate-500">{label}</p><p className="font-bold">{value}</p></div>)}</div><p className="mt-3">{audit.scope} Select top, middle and bottom plies across the identified size; record coverage before release.</p></section>
        <section><h3 className="text-lg font-bold mb-3">Inspection checkpoints</h3><dl className="divide-y border rounded-xl">{checks.map(([label,value])=><div className="p-3 grid sm:grid-cols-[210px_1fr] gap-2" key={label}><dt className="font-bold">{label}</dt><dd>{value}</dd></div>)}</dl></section>
        <section><h3 className="text-lg font-bold mb-3">Recorded measurements</h3><p className="text-sm mb-3">Demo pattern dimensions in mm · tolerance ±2 mm · representative checked readings.</p><div className="overflow-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-100"><tr>{["Point","Target","Actual","Deviation","Result"].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{audit.measurements.map(m=><tr className="border-b" key={m.point}><td className="p-3">{m.point}</td><td className="p-3">{m.target}</td><td className="p-3">{m.actual}</td><td className="p-3">{m.actual-m.target>0?"+":""}{m.actual-m.target}</td><td className={`p-3 font-bold ${Math.abs(m.actual-m.target)>2?"text-rose-700":"text-emerald-700"}`}>{Math.abs(m.actual-m.target)>2?"FAIL":"PASS"}</td></tr>)}</tbody></table></div></section>
        <section className="bg-slate-50 rounded-xl p-4 space-y-3"><h3 className="text-lg font-bold">Containment, corrective action and release</h3><p><strong>Finding:</strong> {audit.finding}</p><p><strong>Cause:</strong> {audit.cause}</p><p><strong>Action:</strong> {audit.action}</p><p><strong>Owner:</strong> Cutting Supervisor · QA verifies closure. <strong>Due:</strong> {audit.due}</p><p><strong>Reinspection evidence:</strong> {audit.verification}</p><p className="font-bold">{audit.release}</p><p className="text-sm">A failed check blocks the affected output. Conditional release here means the product corrections passed; the remaining CAP concerns prevention. Any changed pattern or setup requires a new check.</p></section>
        <section className="text-sm text-slate-600"><h3 className="font-bold">Public training reference</h3><p>Check categories adapted from the Ministry of Labour and Skills garment-production module, sections 4.2 and 5.1 (2022). Demo records and release decisions are illustrative.</p><a className="text-blue-700 underline inline-block py-3" href="https://library.dbpolytech.edu.et/Resource/ICT/Produce%20cut%20panels%20with%20Delicate%20Fabrics%20.pdf" target="_blank" rel="noreferrer">Read cutting inspection and bundling reference</a></section>
      </div>
    </section>
  </div>;
}
