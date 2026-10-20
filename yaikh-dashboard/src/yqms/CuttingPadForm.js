import React, { useState } from "react";
import { CheckCircle2, ClipboardCheck } from "lucide-react";
import "./cutting-pad-ui.css";
import "./cutting-single-screen.css";

const Reference = ({label,children,wide=false}) => <div className={`cut-single-reference${wide?" is-wide":""}`}><span>{label}</span><strong>{children}</strong></div>;
export default function CuttingPadForm({order,orders,onSelectOrder,onSubmit,error,submitted}) {
  const [checked,setChecked]=useState(String(order.inspected));
  const [rejected,setRejected]=useState(String(order.rejected));
  const passed=Math.max(0,Number(checked)-Number(rejected));
  return <div className="cut-single-form">
    <div className="cut-single-heading"><h2><ClipboardCheck size={22}/>Cutting inspection</h2><span>{order.numbered} numbered pieces available</span></div>
    <section className="cut-single-setup" aria-label="Order setup">
      <label className="cut-single-mo">MO / style<select aria-label="Cutting form MO" value={order.mo} onChange={e=>onSelectOrder(e.target.value)}>{orders.map(item=><option key={item.mo} value={item.mo}>{item.mo} · {item.style}</option>)}</select></label>
      <label>Date<input name="inspectionDate" aria-label="Inspection date" defaultValue={order.date}/></label>
      <label>Table<input name="cuttingTable" aria-label="Cutting table" defaultValue={order.table}/></label>
    </section>
    <section className="cut-single-order" aria-label="Order details">
      <Reference label="Buyer">{order.buyer}</Reference><Reference label="Style">{order.style}</Reference><Reference label="Purchase order">{order.po}</Reference><Reference label="Colour / finish">{order.colour}</Reference>
    </section>
    <section className="cut-single-fabric" aria-label="Fabric and cutting setup">
      <h3>Fabric & cutting reference</h3>
      <div className="cut-single-reference-grid">
        <Reference label="Fabric / type" wide>{order.fabric} · {order.fabricType}</Reference><Reference label="Rolls">{order.rolls.length}</Reference><Reference label="Spread">{order.spreadYards} yd</Reference><Reference label="Gross / net">{order.gross} / {order.net} kg</Reference>
        <Reference label="Marker">{order.marker}</Reference><Reference label="Marker length">{order.markerLength} yd</Reference><Reference label="Plies · plan / actual">{order.planLayers} / {order.actualLayers}</Reference><Reference label="Cut output">{order.cutQty} pcs</Reference><Reference label="Table allocation">{order.allocation} pcs</Reference><Reference label="Order quantity">{order.orderQty} pcs</Reference>
      </div>
      <p className="cut-single-ratio"><strong>Ratio</strong>{["S","M","L","XL"].map((size,i)=><span key={size}>{size} <b>{order.ratio[i]}</b></span>)}<span>Sampling: AQL 1.0 · buyer plan applies</span></p>
    </section>
    <section aria-label="Panel inspection entry" className="cut-single-entry">
      <h3>Record inspection</h3>
      <div className="cut-single-entry-grid">
        <label>Pieces checked<input name="inspectionQty" aria-label="Pieces checked" type="number" inputMode="numeric" min="0" max={order.numbered} value={checked} onChange={e=>setChecked(e.target.value)}/></label>
        <label>Pieces rejected<input name="rejectedQty" aria-label="Rejected panels" type="number" inputMode="numeric" min="0" max={order.numbered} value={rejected} onChange={e=>setRejected(e.target.value)}/></label>
        <label>Bundle quantity<input aria-label="Bundle quantity" type="number" min="0" inputMode="numeric" defaultValue={order.bundles}/></label>
        <label>Bundles checked<input aria-label="Bundles checked" type="number" min="0" inputMode="numeric" defaultValue={order.bundles}/></label>
        <label>Panel<select aria-label="Panel" defaultValue="Front Panel"><option>Front Panel</option><option>Back Panel</option><option>Sleeve</option><option>Collar</option></select></label>
        <label>Size<select aria-label="Size" defaultValue="M">{["S","M","L","XL"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Cutting method<select aria-label="Cutting method"><option>Auto</option><option>Manual</option></select></label>
        <label>Tolerance<select aria-label="Measurement tolerance"><option>-1/8, 1/8</option><option>-1/4, 1/4</option></select></label>
      </div>
    </section>
    {error&&<p role="alert" className="cut-single-error">{error}</p>}{submitted&&<p role="status" className="cut-single-success">Saved · Dashboard totals updated for this session.</p>}
    <footer className="cut-single-submit"><div><CheckCircle2 size={22}/><strong>{passed} passed</strong><span>{rejected||0} rejected · held for reinspection</span></div><button onClick={onSubmit}>{submitted?"Saved":"Submit inspection"}<CheckCircle2 size={20}/></button></footer>
  </div>;
}
