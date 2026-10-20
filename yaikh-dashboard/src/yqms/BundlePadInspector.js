import React, { useState } from "react";
import { ChevronLeft, Scissors, CheckCircle2 } from "lucide-react";
import "./cutting-pad-ui.css";
export default function BundlePadInspector({ initialBundles, onRecord }) {
  const [bundles,setBundles]=useState(initialBundles);
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("All");
  const [selected,setSelected]=useState(null);
  const [rejected,setRejected]=useState("0");
  const [note,setNote]=useState("");
  const [error,setError]=useState("");
  const [saved,setSaved]=useState("");
  const needsReview=bundles.filter(b=>b.defects>0).length;
  const filtered=bundles.filter(b=>(filter!=="Needs review"||b.defects>0)&&(filter!=="Clear"||!b.defects)&&`${b.id} ${b.style} ${b.part}`.toLowerCase().includes(query.toLowerCase()));
  function open(bundle){setSelected(bundle);setRejected(String(bundle.defects));setNote(bundle.note||"");setError("");}
  async function save(){const count=Number(rejected);if(!rejected.trim()||!Number.isInteger(count)||count<0||count>selected.qty){setError(`Enter a whole number from 0 to ${selected.qty}.`);return;}if(onRecord){try{await onRecord({...selected,mo:selected.id,checked:selected.qty,rejected:count,defects:count,note,status:count?'HOLD':'PENDING REVIEW'});}catch(error){setError(error.message||'Could not save check.');return;}}setBundles(items=>items.map(b=>b.id===selected.id?{...b,defects:count,status:count?"HOLD":"CLEAR",note,checked:true}:b));setSaved(`${selected.id} check saved`);setSelected(null);}
  if(selected)return <div className="cut-pad-app">
    <div className="cut-pad-heading"><div><p>Bundle inspection</p><h2>{selected.part}</h2></div><Scissors size={28}/></div>
    <button className="cut-pad-button" onClick={()=>setSelected(null)}><ChevronLeft size={20}/>Back to bundles</button>
    <div className="cut-pad-info-grid" style={{marginTop:20}}>{[["Bundle",selected.id],["Style",selected.style],["Table",selected.table],["Marker",selected.marker],["Size",selected.size],["Bundle quantity",`${selected.qty} pieces`]].map(([label,value])=><div className="cut-pad-info" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <h3>Check the panels</h3><p className="cut-pad-help">Review shape and dimensions, notches, fabric defects, shade and matching panel numbers. This demo records a full-bundle check.</p>
    <div className="cut-pad-fields"><label>Pieces checked<input aria-label="Bundle pieces checked" value={selected.qty} readOnly/></label><label>Rejected pieces<input aria-label="Bundle rejected pieces" type="number" inputMode="numeric" min="0" max={selected.qty} value={rejected} onChange={e=>setRejected(e.target.value)}/></label></div>
    <label style={{display:"grid",gap:8,fontWeight:700}}>Finding / correction<textarea aria-label="Bundle inspection note" value={note} onChange={e=>setNote(e.target.value)} placeholder="Record the defect, affected pieces and required correction" rows={4}/></label>
    <div className="cut-pad-pass" style={{marginTop:20}}><CheckCircle2/><div><strong>{Math.max(0,selected.qty-Number(rejected))} pieces passed</strong><span>Rejected panels stay on hold for correction and reinspection.</span></div></div>
    {error&&<p role="alert" className="cut-pad-error">{error}</p>}
    <p className="cut-pad-note">Training demo · Saving updates this worklist for the current session.</p>
    <footer className="cut-pad-footer"><button onClick={()=>setSelected(null)}>Cancel</button><button className="cut-pad-primary" onClick={save}>Save bundle check<CheckCircle2 size={20}/></button></footer>
  </div>;
  return <div className="cut-pad-app">
    <div className="cut-pad-heading"><div><p>Cutting room · bundle checks</p><h2>Inspect bundles</h2></div><Scissors size={28}/></div>
    <div className="cut-pad-production"><div><span>Daily cutting output</span><strong>8,450 <small>of 10,000 pcs</small></strong></div><span>84.5%</span><progress value="8450" max="10000" aria-label="Daily cutting progress"/></div>
    <div className="cut-pad-stat-row"><div><strong>{bundles.length}</strong><span>Bundles in worklist</span></div><div><strong>{needsReview}</strong><span>Need review</span></div><div><strong>{bundles.reduce((sum,b)=>sum+b.qty,0)}</strong><span>Pieces in worklist</span></div></div>
    <label className="cut-pad-help" htmlFor="pad-bundle-search">Find a bundle, style or panel</label><input id="pad-bundle-search" className="cut-pad-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. BND-501 or Front Panel"/>
    <div className="cut-pad-filter-row" aria-label="Bundle filters">{["All","Needs review","Clear"].map(item=><button key={item} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}</button>)}</div>
    {saved&&<p role="status" className="cut-pad-success">{saved}</p>}
    <div className="cut-pad-bundle-grid">{filtered.map(bundle=><article className="cut-pad-bundle" key={bundle.id}>
      <span className={`cut-pad-badge ${bundle.defects?"hold":""}`}>{bundle.defects?"Needs review":"Clear"}</span><h3>{bundle.part}</h3><p>{bundle.style} · Table {bundle.table}</p><p style={{marginTop:12}}><strong>{bundle.id}</strong></p><p>Size {bundle.size} · {bundle.qty} pieces</p><p>{bundle.defects?`${bundle.defects} rejected · hold for correction`:"No defects recorded"}</p><button className="cut-pad-button cut-pad-primary" aria-label={`Inspect ${bundle.id}`} onClick={()=>open(bundle)}>Inspect bundle</button>
    </article>)}</div>
    {!filtered.length&&<p className="cut-pad-note">No matching bundles. Try another search or select All.</p>}
    <p className="cut-pad-note">Tap a bundle to record the check. Daily output is the factory demo total; the worklist covers only the bundles displayed here.</p>
  </div>;
}
