import React,{useEffect,useState} from 'react';
import {ArrowLeft,ExternalLink,RefreshCw} from 'lucide-react';
import {Link} from 'react-router-dom';
import {MODULES} from './standard/modules';
import InspectionReports from './standard/InspectionReports';
import QualityReports from './standard/QualityReports';
import FactoryReportSignIn from './FactoryReportSignIn';
import {RecordView} from './standard/QualityModule';
import YqmsLanguageBar from './YqmsLanguageBar';
import './standard/quality-standard.css';

export default function YQMSReport({onBack}){
 const [moduleKey,M]=useState('final-inspection'),[data,D]=useState({records:[],events:[],viewer:null}),[loading,L]=useState(true),[error,E]=useState(''),[revision,R]=useState(0),[chosen,S]=useState('');
 const config=MODULES[moduleKey];
 useEffect(()=>{
  const controller=new AbortController();L(true);E('');D({records:[],events:[],viewer:null});S('');
  (async()=>{try{const response=await fetch(`/api/yqms/module-records?module=${encodeURIComponent(moduleKey)}`,{credentials:'same-origin',cache:'no-store',signal:controller.signal});if(!(response.headers.get('content-type')||'').includes('application/json'))throw new Error('The report service could not be reached. Please retry.');const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||'The saved reports could not be loaded.');if(!controller.signal.aborted)D({records:result.records||[],events:result.events||[],viewer:result.viewer});}catch(cause){if(!controller.signal.aborted)E(cause.message);}finally{if(!controller.signal.aborted)L(false);}})();
  return()=>controller.abort();
 },[moduleKey,revision]);
 const selected=data.records.find(r=>r._id===chosen)||data.records[0];
 return <div className="qs-standard" style={{'--qs-colour':'#326db4'}}>
  <header className="qs-header"><div className="qs-brand"><button aria-label="Back to YQMS" onClick={onBack}><ArrowLeft size={22}/></button><div><small>YQMS · REPORT LIBRARY</small><h1>Report Filing Agent</h1><p>Saved inspection reports and quality summaries</p></div></div><div className="qs-training-user"><Link to={`/dashboard/yqms/${moduleKey}`} className="flex items-center gap-2 rounded-lg border border-white/30 px-3 py-2 text-sm font-bold text-white">Open module <ExternalLink size={16}/></Link><button aria-label="Refresh report library" onClick={()=>R(n=>n+1)}><RefreshCw size={18}/></button></div><YqmsLanguageBar/></header>
  <main><section className="qs-card"><div className="qs-toolbar"><div><h2>All YQMS inspection reports</h2><p>Select the subject to open its saved reports. Original floor entries and amendment history stay attached to each inspection.</p></div><strong>{loading?'Loading reports…':error?'Reports unavailable':`${data.records.length} loaded reports`}</strong></div><label>Report subject<select aria-label="Report subject" value={moduleKey} onChange={e=>M(e.target.value)}>{Object.entries(MODULES).map(([key,value])=><option key={key} value={key}>{value.group} · {value.title}</option>)}</select></label>{data.records.some(r=>['demo','training-example'].includes(r.source))&&<p className="qs-pilot">Includes clearly labelled demonstration / training records. Factory records require the factory sign-in session.</p>}</section>
  {!loading&&(!data.viewer||data.viewer==='Public demo')&&<FactoryReportSignIn onSignedIn={()=>R(n=>n+1)}/>}
  {loading?<section className="qs-card" role="status"><h2>Loading {config.title} reports…</h2></section>:error?<section className="qs-card" role="alert"><h2>Reports could not be loaded</h2><p>{error}</p><p>This is a loading or access problem; it does not mean the saved reports were deleted.</p><button className="qs-primary" onClick={()=>R(n=>n+1)}>Retry loading reports</button></section>:<>
   {config.kind==='fincheck'?<InspectionReports key={`inspection-${moduleKey}`} records={data.records} selectedId={chosen} onSelect={S}/>:<section className="qs-card"><h2>{config.title} · saved inspection reports</h2><label>Inspection report<select aria-label="Select saved subject report" value={selected?._id||''} onChange={e=>S(e.target.value)}>{data.records.map(r=><option key={r._id} value={r._id}>{r.id} · {r.order} · {r.status}</option>)}</select></label>{selected?<RecordView record={selected}/>:<p>No saved report was returned for this subject.</p>}</section>}
   <QualityReports key={`quality-${moduleKey}`} moduleKey={moduleKey} records={data.records} events={data.events} onView={r=>{S(r._id);window.scrollTo({top:0,behavior:'smooth'});}}/>
  </>}
  </main>
 </div>;
}
