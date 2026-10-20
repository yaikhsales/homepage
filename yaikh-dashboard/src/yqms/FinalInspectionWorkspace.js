import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
  Camera,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

const STAGES = [
  { id: "fin-check", label: "Fin Check", path: "/dashboard/yqms/fin-check" },
  { id: "pre-final", label: "Pre-final", path: "/dashboard/yqms/pre-final" },
  { id: "final", label: "Final inspection", path: "/dashboard/yqms/final-inspection" },
  { id: "buyer-final", label: "Buyer final", path: "/dashboard/yqms/buyer-final" },
];

const STAGE_COPY = {
  "fin-check": {
    title: "Fin Check · inspection record",
    purpose: "Record checked units, defects and repair re-inspection against the approved order and defect criteria. Use the dedicated report and settings views for their own tasks.",
    checker: "Assigned Quality Checker / Auditor (active QA roster)",
    reviewer: "Senior Quality Supervisor",
  },
  "pre-final": {
    title: "Pre-final inspection",
    purpose: "Check finished goods before the final lot inspection. Record defects and rework evidence against the approved order references.",
    checker: "Assigned Quality Auditor / Quality Checker (active QA roster)",
    reviewer: "Senior Quality Supervisor",
  },
  final: {
    title: "Final inspection",
    purpose: "Inspect the packed lot against the order’s approved specification and documented sampling plan before factory disposition.",
    checker: "Assigned Quality Auditor / Quality Checker (active QA roster)",
    reviewer: "Senior Quality Supervisor",
  },
  "buyer-final": {
    title: "Buyer final inspection",
    purpose: "Record the buyer or third-party inspection result and reconcile it with the factory’s final report.",
    checker: "Buyer / Third-party Inspector; QO records the brand result",
    reviewer: "Quality Manager owns factory hold or release",
  },
};

const Field = ({ label, children, className = "" }) => (
  <label className={`block min-w-0 ${className}`}>
    <span className="mb-1 block text-xs font-bold text-slate-600">{label}</span>
    {children}
  </label>
);

const inputClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

const emptyForm = {
  order: "", buyer: "", style: "", po: "", colour: "", lotQty: "", cartons: "", inspectionDate: new Date().toISOString().slice(0, 10),
  plan: "", level: "", sample: "", acMajor: "", reMajor: "", acMinor: "", reMinor: "",
  checked: "", passed: "", rejected: "", critical: "0", major: "0", minor: "0", measurementRejects: "0", notes: "",
};

const readDraft = (stage) => {
  try {
    return JSON.parse(window.localStorage.getItem(`yqms-final-inspection-draft-${stage}`) || "null");
  } catch (_) {
    return null;
  }
};

const FinalInspectionWorkspace = ({ stage = "final", onBack }) => {
  const navigate = useNavigate();
  const copy = STAGE_COPY[stage] || STAGE_COPY.final;
  const [form, setForm] = useState(() => ({ ...emptyForm, ...((readDraft(stage) || {}).form || {}) }));
  const [checks, setChecks] = useState(() => ({ workmanship: false, measurements: false, appearance: false, labels: false, packing: false, cartonMarks: false, ...((readDraft(stage) || {}).checks || {}) }));
  const [orderOptions, setOrderOptions] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [saved, setSaved] = useState(() => Boolean(readDraft(stage)));
  const set = (key) => (event) => { setSaved(false); setForm((old) => ({ ...old, [key]: event.target.value })); };
  const loadOrderOptions = useCallback(async () => {
    setOrderLoading(true);
    setOrderError("");
    try {
      const response = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ypi", view: "techpack" }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Order list unavailable");
      setOrderOptions((data.picker && data.picker.options) || []);
    } catch (_) {
      setOrderError("YPI order lookup is unavailable. Enter the order reference manually and verify it against the approved order pack.");
    } finally {
      setOrderLoading(false);
    }
  }, []);
  useEffect(() => { loadOrderOptions(); }, [loadOrderOptions]);

  const selectOrder = async (event) => {
    const orderRef = event.target.value;
    setSaved(false);
    setForm((old) => ({ ...old, order: orderRef, buyer: "", style: "", po: "", lotQty: "" }));
    if (!orderRef) return;
    setOrderDetailLoading(true);
    try {
      const response = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ypi", view: "techpack", pick: orderRef }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Order details unavailable");
      const order = data.order || {};
      const spec = data.spec_sheet || {};
      setForm((old) => ({ ...old, order: orderRef, buyer: spec.customer || order.buyer || "", style: order.style || spec.customer_style || "", po: spec.po_number || order.buyer_po || "", lotQty: order.qty == null ? "" : String(order.qty) }));
      setOrderError("");
    } catch (_) {
      setOrderError("Order details could not be loaded. Verify buyer, style, PO and quantity against the current approved order pack.");
    } finally {
      setOrderDetailLoading(false);
    }
  };
  const checkedCount = Number(form.checked) || 0;
  const passCount = Number(form.passed) || 0;
  const rejectCount = Number(form.rejected) || 0;
  const disposition = useMemo(() => {
    if (!form.plan || Number(form.sample) <= 0 || form.acMajor === "" || form.reMajor === "" || form.acMinor === "" || form.reMinor === "" || form.checked === "" || form.passed === "" || form.rejected === "") return "Enter the approved plan and inspection counts";
    if (passCount + rejectCount !== checkedCount) return "HOLD · passed plus rejected must equal units inspected";
    if (Number(form.critical) > 0) return "HOLD · critical defect requires Quality Manager disposition";
    if (Number(form.major) >= Number(form.reMajor) || Number(form.minor) >= Number(form.reMinor)) return "HOLD · rejection number reached; contain and follow the buyer re-inspection rule";
    if (Number(form.major) > Number(form.acMajor) || Number(form.minor) > Number(form.acMinor)) return "HOLD · acceptance number exceeded; contain and follow the buyer re-inspection rule";
    return "Within entered limits · submit for supervisor review";
  }, [form]);

  const saveDraft = () => {
    try {
      window.localStorage.setItem(`yqms-final-inspection-draft-${stage}`, JSON.stringify({ form, checks, savedAt: new Date().toISOString() }));
      setSaved(true);
    } catch (_) {
      setSaved(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          <button type="button" onClick={onBack} aria-label="Back to YQMS" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"><ArrowLeft size={19} /></button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600">YQMS · Final inspection tower</p>
            <h1 className="truncate text-lg font-black sm:text-xl">{copy.title}</h1>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800 sm:inline-flex"><CircleAlert size={14} /> Draft data is stored on this device only</span>
        </div>
        <nav aria-label="Final inspection workflow" className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-0.5">
          {STAGES.map((item, index) => (
            <button key={item.id} type="button" onClick={() => navigate(item.path)} aria-current={stage === item.id ? "step" : undefined}
              className={`min-h-10 shrink-0 rounded-lg border px-3 text-xs font-bold ${stage === item.id ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
              <span className="mr-1.5 opacity-70">0{index + 1}</span>{item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 p-3 pb-28 sm:p-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:pb-8">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700"><ClipboardCheck size={20} /></span>
              <div><h2 className="font-black">Inspection record</h2><p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">{copy.purpose}</p></div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">Tablet-ready form</span>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            <section aria-labelledby="order-reference-heading">
              <h3 id="order-reference-heading" className="mb-3 text-sm font-black">Order and lot reference</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="MO / order number">{orderOptions.length > 0 ? <select className={inputClass} value={form.order} onChange={selectOrder}><option value="">Select an available order…</option>{orderOptions.map((item) => <option key={item.id} value={item.id}>{item.name}{item.sub ? ` · ${item.sub}` : ""}</option>)}</select> : <input className={inputClass} value={form.order} onChange={set("order")} placeholder="Scan or enter order reference" />}</Field>
                <Field label="Buyer"><input className={inputClass} value={form.buyer} onChange={set("buyer")} placeholder="Buyer name" /></Field>
                <Field label="Style"><input className={inputClass} value={form.style} onChange={set("style")} placeholder="Factory style" /></Field>
                <Field label="Purchase order"><input className={inputClass} value={form.po} onChange={set("po")} placeholder="PO number" /></Field>
                <Field label="Colour / finish"><input className={inputClass} value={form.colour} onChange={set("colour")} placeholder="Colourway" /></Field>
                <Field label="Lot quantity"><input className={inputClass} type="number" min="0" value={form.lotQty} onChange={set("lotQty")} placeholder="Units" /></Field>
                <Field label="Cartons presented"><input className={inputClass} type="number" min="0" value={form.cartons} onChange={set("cartons")} placeholder="Cartons" /></Field>
                <Field label="Inspection date"><input className={inputClass} type="date" value={form.inspectionDate} onChange={set("inspectionDate")} /></Field>
              </div>
              {(orderLoading || orderDetailLoading || orderError) && <div role="status" className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${orderError ? "border border-amber-200 bg-amber-50 text-amber-900" : "bg-slate-50 text-slate-500"}`}>{orderError || (orderLoading ? "Loading available orders from YPI…" : "Loading approved order details…")}{orderError && <button type="button" onClick={loadOrderOptions} className="ml-2 underline">Retry</button>}</div>}
            </section>

            <section aria-labelledby="sampling-plan-heading" className="rounded-xl border border-violet-100 bg-violet-50/60 p-3 sm:p-4">
              <h3 id="sampling-plan-heading" className="mb-3 text-sm font-black">Approved sampling plan</h3>
              <p className="mb-3 text-xs leading-relaxed text-slate-600">Use the buyer-approved or factory-approved plan for this order. ISO 2859 provides selectable attribute-sampling systems; it does not mean every order uses the same AQL or sample size.</p>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <Field label="Plan / standard"><input className={inputClass} value={form.plan} onChange={set("plan")} placeholder="Buyer plan / ISO 2859-1" /></Field>
                <Field label="Inspection level"><input className={inputClass} value={form.level} onChange={set("level")} placeholder="General / special; buyer rule" /></Field>
                <Field label="Sample size"><input className={inputClass} type="number" min="0" value={form.sample} onChange={set("sample")} placeholder="Per approved plan" /></Field>
                <Field label="Major Ac / Re"><div className="grid grid-cols-2 gap-2"><input aria-label="Major acceptance number" className={inputClass} type="number" min="0" value={form.acMajor} onChange={set("acMajor")} placeholder="Ac" /><input aria-label="Major rejection number" className={inputClass} type="number" min="0" value={form.reMajor} onChange={set("reMajor")} placeholder="Re" /></div></Field>
                <Field label="Minor Ac / Re"><div className="grid grid-cols-2 gap-2"><input aria-label="Minor acceptance number" className={inputClass} type="number" min="0" value={form.acMinor} onChange={set("acMinor")} placeholder="Ac" /><input aria-label="Minor rejection number" className={inputClass} type="number" min="0" value={form.reMinor} onChange={set("reMinor")} placeholder="Re" /></div></Field>
              </div>
            </section>

            <section aria-labelledby="inspection-checks-heading">
              <h3 id="inspection-checks-heading" className="mb-3 text-sm font-black">Product and packing checks</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {[["workmanship", "Workmanship / construction"], ["measurements", "Measurements vs approved spec"], ["appearance", "Appearance, shade and finish"], ["labels", "Labels, care and buyer details"], ["packing", "Folding, assortment and pack method"], ["cartonMarks", "Carton marks and quantities"]].map(([id, label]) => (
                  <label key={id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                    <input className="h-5 w-5 accent-violet-600" type="checkbox" checked={checks[id]} onChange={(e) => setChecks((old) => ({ ...old, [id]: e.target.checked }))} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section aria-labelledby="defects-heading">
              <h3 className="mb-3 text-sm font-black">Inspection totals</h3>
              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Units inspected"><input className={inputClass} type="number" min="0" value={form.checked} onChange={set("checked")} placeholder="Actual inspected" /></Field>
                <Field label="Units passed"><input className={inputClass} type="number" min="0" value={form.passed} onChange={set("passed")} placeholder="Pass count" /></Field>
                <Field label="Units rejected"><input className={inputClass} type="number" min="0" value={form.rejected} onChange={set("rejected")} placeholder="Reject count" /></Field>
              </div>
              <h3 id="defects-heading" className="mb-3 text-sm font-black">Record findings</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Field label="Critical"><input className={inputClass} type="number" min="0" value={form.critical} onChange={set("critical")} /></Field>
                <Field label="Major"><input className={inputClass} type="number" min="0" value={form.major} onChange={set("major")} /></Field>
                <Field label="Minor"><input className={inputClass} type="number" min="0" value={form.minor} onChange={set("minor")} /></Field>
                <Field label="Measurement rejects"><input className={inputClass} type="number" min="0" value={form.measurementRejects} onChange={set("measurementRejects")} /></Field>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr]">
                    <Field label="Defect details / location"><textarea className={`${inputClass} min-h-24 resize-y`} value={form.notes} onChange={set("notes")} placeholder="Describe defect, garment location, quantity, containment and repair / re-inspection reference" /></Field>
                <Field label="Photo evidence"><span className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center text-xs font-bold text-slate-600 hover:bg-slate-100"><Camera size={20} className="text-violet-600" />Attach inspection photos<input className="sr-only" type="file" accept="image/*" multiple capture="environment" /></span></Field>
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div><p className="text-xs font-bold text-slate-500">Count summary</p><p className="mt-1 text-sm font-black"><span className="text-emerald-700">{passCount} passed</span><span className="mx-2 text-slate-300">·</span><span className="text-rose-700">{rejectCount} rejected</span><span className="mx-2 text-slate-300">·</span><span>{checkedCount} inspected</span></p></div>
              <p role="status" className={`max-w-lg text-xs font-bold ${disposition.startsWith("HOLD") ? "text-rose-700" : "text-slate-600"}`}>{disposition}</p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-violet-600" /><h2 className="text-sm font-black">Role and disposition</h2></div>
            <dl className="mt-3 space-y-3 text-xs">
              <div><dt className="font-bold text-slate-500">Performs / records</dt><dd className="mt-0.5 font-semibold text-slate-800">{copy.checker}</dd></div>
              <div><dt className="font-bold text-slate-500">Review / escalation</dt><dd className="mt-0.5 font-semibold text-slate-800">{copy.reviewer} → Quality Manager</dd></div>
              <div><dt className="font-bold text-slate-500">YHR chart alignment</dt><dd className="mt-0.5 leading-relaxed text-slate-600">The chart lists a Quality Manager and 1–2 Senior Quality Supervisors, with area quality leaders, auditors, brand QOs and checkers in the support scope. It does not name a dedicated final-inspection supervisor; assign the inspector and authorized reviewer from the active seasonal QA roster.</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-900"><PackageCheck size={18} /><h2 className="text-sm font-black">Shipment gate</h2></div>
            <p className="mt-2 text-xs leading-relaxed text-amber-900">An inspection result is evidence, not automatic shipment authorization. Hold failed or unresolved lots; record containment, corrective action, re-inspection and the authorized factory disposition.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><FileCheck2 size={18} className="text-slate-600" /><h2 className="text-sm font-black">Draft status</h2></div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">Order lookup reads the YPI tech-pack order list. This page has no YQMS inspection-record write endpoint, so Save Draft stores this form only in this browser on this device; it does not create an official report or release a lot.</p>
            {saved && <p role="status" className="mt-2 text-xs font-bold text-emerald-700">Draft saved on this device.</p>}
          </section>
        </aside>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-6px_20px_rgba(15,23,42,0.08)] backdrop-blur sm:static sm:mx-auto sm:mb-5 sm:w-full sm:max-w-7xl sm:rounded-xl sm:border sm:px-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:max-w-none">
          <div className="min-w-0"><p className="text-xs font-bold text-slate-500">Current inspection result</p><p className="truncate text-sm font-black text-slate-800">{disposition}</p></div>
          <button type="button" onClick={saveDraft} className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-black text-white shadow-md hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"><CheckCircle2 size={17} />Save draft</button>
        </div>
      </footer>
    </main>
  );
};

export default FinalInspectionWorkspace;
