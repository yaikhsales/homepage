import React, { useState } from "react";
import { ChevronLeft, ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react";
import "./cutting-pad-ui.css";

const Steps = ["Order", "Fabric & cutting", "Inspection"];
const Info = ({label,children}) => <div className="cut-pad-info"><span>{label}</span><strong>{children}</strong></div>;
export default function CuttingPadForm({order,orders,onSelectOrder,onSubmit,error,submitted}) {
  const [step,setStep]=useState(0);
  const [checked,setChecked]=useState(String(order.inspected));
  const [rejected,setRejected]=useState(String(order.rejected));
  const passed=Math.max(0,Number(checked)-Number(rejected));
  return <div className="cut-pad-app">
    <div className="cut-pad-heading"><div><p>Cutting room · inspection entry</p><h2>Check cut panels</h2></div><ClipboardCheck size={28}/></div>
    <div className="cut-pad-order-switch"><label htmlFor="cut-pad-mo">Working order</label><select id="cut-pad-mo" aria-label="Cutting form MO" value={order.mo} onChange={e=>onSelectOrder(e.target.value)}>{orders.map(item=><option key={item.mo} value={item.mo}>{item.mo} · {item.style}</option>)}</select><span>{order.buyer} · {order.colour}</span></div>
    <nav className="cut-pad-steps" aria-label="Inspection steps">{Steps.map((name,i)=><button key={name} onClick={()=>setStep(i)} aria-current={step===i?"step":undefined}><span>{i+1}</span>{name}</button>)}</nav>
    <div className="cut-pad-body">
      <section hidden={step!==0} aria-label="Order setup">
        <h3>Confirm the order</h3><p className="cut-pad-help">Check the order and table before starting your inspection.</p>
        <div className="cut-pad-fields"><label>Inspection date<input name="inspectionDate" aria-label="Inspection date" defaultValue={order.date}/></label><label>Cutting table<input name="cuttingTable" aria-label="Cutting table" defaultValue={order.table}/></label></div>
        <div className="cut-pad-info-grid"><Info label="Buyer">{order.buyer}</Info><Info label="Style">{order.style}</Info><Info label="Purchase order">{order.po}</Info><Info label="Colour / finish">{order.colour}</Info></div>
        <div className="cut-pad-totals"><Info label="Table allocation">{order.allocation} pcs</Info><Info label="Whole order">{order.orderQty} pcs</Info></div>
        <p className="cut-pad-note">This inspection covers the selected cutting table. Whole-order quantity is shown for reference.</p>
      </section>
      <section hidden={step!==1} aria-label="Fabric and cutting setup">
        <h3>Review the cutting setup</h3><p className="cut-pad-help">Reference values from this order’s cutting record.</p>
        <div className="cut-pad-info-grid"><Info label="Fabric">{order.fabric}</Info><Info label="Rolls">{order.rolls.length}</Info><Info label="Spread length">{order.spreadYards} yd</Info><Info label="Marker">{order.marker}</Info><Info label="Marker length">{order.markerLength} yd</Info><Info label="Gross / net weight">{order.gross} / {order.net} kg</Info><Info label="Planned / actual plies">{order.planLayers} / {order.actualLayers}</Info><Info label="Cut output">{order.cutQty} pcs</Info></div>
        <h3 className="cut-pad-section-title">Size ratio per ply</h3><div className="cut-pad-size-ratio">{["S","M","L","XL"].map((size,i)=><div key={size}><span>{size}</span><strong>{order.ratio[i]}</strong></div>)}</div>
        <p className="cut-pad-note">Check the marker, shade and layer identity before measuring. Refer to the Dashboard for fabric inspection and hold status.</p>
      </section>
      <section hidden={step!==2} aria-label="Panel inspection entry">
        <h3>Record your inspection</h3><p className="cut-pad-help">Enter whole pieces. Maximum available: <strong>{order.numbered} numbered pieces</strong>.</p>
        <div className="cut-pad-fields"><label>Pieces checked<input name="inspectionQty" aria-label="Pieces checked" type="number" inputMode="numeric" min="0" max={order.numbered} value={checked} onChange={e=>setChecked(e.target.value)}/></label><label>Pieces rejected<input name="rejectedQty" aria-label="Rejected panels" type="number" inputMode="numeric" min="0" max={order.numbered} value={rejected} onChange={e=>setRejected(e.target.value)}/></label></div>
        <div className="cut-pad-pass"><CheckCircle2 size={26}/><div><strong>{passed} pieces passed</strong><span>Checked minus rejected · rejected pieces remain held.</span></div></div>
        <div className="cut-pad-fields"><label>Bundle quantity<input type="number" min="0" inputMode="numeric" defaultValue={order.bundles}/></label><label>Bundles checked<input type="number" min="0" inputMode="numeric" defaultValue={order.bundles}/></label></div>
        <div className="cut-pad-fields"><label>Panel<select defaultValue="Front Panel"><option>Front Panel</option><option>Back Panel</option><option>Sleeve</option><option>Collar</option></select></label><label>Size<select defaultValue="M">{["S","M","L","XL"].map(x=><option key={x}>{x}</option>)}</select></label><label>Cutting method<select><option>Auto</option><option>Manual</option></select></label><label>Measurement tolerance<select><option>-1/8, 1/8</option><option>-1/4, 1/4</option></select></label></div>
        <p className="cut-pad-note">Sampling reference: AQL 1.0 as shown in the web form. Use the approved buyer inspection plan for acceptance. This demo saves checked/rejected totals to the current Dashboard session.</p>
        {error && <p role="alert" className="cut-pad-error">{error}</p>}{submitted && <p role="status" className="cut-pad-success">Inspection saved. View updated totals in Dashboard.</p>}
      </section>
    </div>
    <footer className="cut-pad-footer"><button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}><ChevronLeft size={20}/>Back</button><span>{step+1} of 3</span>{step<2?<button className="cut-pad-primary" onClick={()=>setStep(step+1)}>Next<ArrowRight size={20}/></button>:<button className="cut-pad-primary" onClick={onSubmit}>{submitted?"Saved":"Submit inspection"}<CheckCircle2 size={20}/></button>}</footer>
  </div>;
}
