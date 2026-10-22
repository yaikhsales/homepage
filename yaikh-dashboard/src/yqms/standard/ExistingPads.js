import React,{useState} from 'react';
import DecorationQuality from '../decoration/DecorationQuality';
import FincheckWorkspace from '../Fin-check/FincheckWorkspace';
import CuttingPanel from '../Cutting-panel';
import CuttingInspection from '../CuttingInspection';
import QCFile from '../qc-file';
import MeetingStudio from '../PPM/MeetingStudio';
import {cuttingAudits} from '../CuttingAuditDetails';
import CuttingFormTablet from '../CuttingFormTablet';
import QCFilePad from './QCFilePad';
import QACuttingPad from './QACuttingPad';
import FinishingPackingPad from './FinishingPackingPad';
import {useQualityOrganization} from '../quality-organization';
import './preproduction-pad.css';
const points=['Approved pattern / marker','Fabric release / shade','Lay setup','Cut shape / dimensions','Notches / drill marks','Grain / direction','Edges / fabric defects','Numbering / bundle identity'];
export default function ExistingPads({moduleKey,config,onRecord,records=[]}){
 if(config.kind==='finishing-packing')return <FinishingPackingPad moduleKey={moduleKey} config={config} onRecord={onRecord}/>;
 if(config.kind==='decoration')return <DecorationQuality embeddedPad mode={config.mode} onRecord={onRecord}/>;
 if(config.kind==='fincheck')return <FincheckWorkspace embeddedPad workflowConfig={{...config,moduleKey}} onRecord={onRecord}/>;
 if(config.kind==='cut-panel')return <CuttingPanel embeddedPad onRecord={onRecord}/>;
 if(config.kind==='bundle')return <CuttingInspection embeddedPad onRecord={onRecord}/>;
 if(moduleKey==='qa-cutting')return <QACuttingPad onRecord={onRecord}/>;
 if(config.kind==='cut-audit')return <AuditPad first title={config.title} onRecord={onRecord}/>;
 if(config.kind==='ppm')return <MeetingPad onRecord={onRecord} records={records}/>;
 return <QCFilePad onRecord={onRecord} legacy={<QCFile onRecord={onRecord} onBack={()=>{}}/>}/>;
}
function MeetingPad({onRecord,records}){
 return <MeetingStudio onRecord={onRecord} records={records}/>;
}
function AuditPad({first,title,onRecord}){const examples=cuttingAudits(first),[selected,S]=useState(examples[0].id),a=examples.find(x=>x.id===selected),[checked,C]=useState('20'),[rejected,R]=useState('0'),[inspector,I]=useState(''),[checks,K]=useState(Object.fromEntries(points.map(x=>[x,'PENDING']))),[values,V]=useState(['','','']),[note,N]=useState(''),[error,E]=useState(''),{org}=useQualityOrganization();async function save(e){e.preventDefault();const qty=Number(checked),bad=Number(rejected);if(!inspector||!Number.isInteger(qty)||qty<1||!Number.isInteger(bad)||bad<0||bad>qty){E('Select a YHR inspector and enter valid checked / defective quantities.');return;}const fail=Object.values(checks).includes('FAIL')||values.some((x,i)=>x!==''&&Math.abs(Number(x)-a.measurements[i].target)>2)||bad>0,status=fail?'HOLD':'PENDING REVIEW';try{const {id,status:oldStatus,release,verification,cap,cause,action,finding,defects,samples,date,...reference}=a;await onRecord({...reference,date:new Date().toLocaleDateString('en-CA'),checked:qty,rejected:bad,inspector,status,checks,measurements:a.measurements.map((m,i)=>({...m,actual:values[i]===''?null:Number(values[i])})),note,source:'New floor inspection'});E('');}catch(cause){E(cause.message);}}
 return <CuttingFormTablet label={title}><form className="qs-audit-pad" onSubmit={save}><h2>{title}</h2><p>Compare the identified lay and panels with the approved pattern. Demo dimensions ±2 mm; the buyer plan applies.</p><div className="qs-form-grid"><label>Order / style<select value={selected} onChange={e=>{S(e.target.value);V(['','','']);K(Object.fromEntries(points.map(x=>[x,'PENDING'])));}}>{examples.map(x=><option key={x.id} value={x.id}>{x.mo} · {x.style}</option>)}</select></label><label>YHR inspector<select value={inspector} onChange={e=>I(e.target.value)}><option value="">Select inspector</option>{org?.people.filter(p=>['worker','staff','leader'].includes(p.level)).map(p=><option key={p.emp_no} value={p.emp_no}>{p.emp_no} · {p.position||p.title}</option>)}</select></label><label>Checked pieces<input type="number" value={checked} onChange={e=>C(e.target.value)}/></label><label>Defective pieces<input type="number" value={rejected} onChange={e=>R(e.target.value)}/></label></div><p>{a.buyer} · {a.color} · size {a.size} · table {a.table}<br/>{a.lay} · {a.marker} · {a.pattern} · {a.roll} / {a.shade}</p><div className="qs-form-grid">{points.map(x=><label key={x}>{x}<select value={checks[x]} onChange={e=>K({...checks,[x]:e.target.value})}><option>PENDING</option><option>PASS</option><option>FAIL</option></select></label>)}</div><h3>Measurements · mm</h3><div className="qs-form-grid three">{a.measurements.map((m,i)=><label key={m.point}>{m.point} · {m.target} ±2<input aria-label={m.point} type="number" value={values[i]} onChange={e=>V(values.map((x,j)=>j===i?e.target.value:x))}/></label>)}</div><label>Finding / containment / evidence<textarea rows={3} value={note} onChange={e=>N(e.target.value)}/></label>{error&&<p className="qs-error" role="alert">{error}</p>}<button className="qs-primary">Submit inspection</button></form></CuttingFormTablet>;
}
