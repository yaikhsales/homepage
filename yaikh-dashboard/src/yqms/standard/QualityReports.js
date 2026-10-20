import React,{useMemo,useState} from 'react';
import {effective,defectNames} from './modules';
import {useTranslation} from '../../translate/TranslationContext';
import {useNarrativeTranslation} from '../useNarrativeTranslation';
const day=x=>new Date(x).toLocaleDateString('en-CA',{timeZone:'Asia/Phnom_Penh'});
const csv=v=>{let s=String(v??'');if(typeof v!=='number'&&/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
export function reportsFor(records,events){const rows=records.map(effective),daily=new Map(),teams=new Map(),defects=new Map();for(const r of rows){for(const [map,key]of[[daily,day(r.at)],[teams,r.line||r.inspector||'Unassigned']]){const a=map.get(key)||[0,0,0,0];a[0]++;a[1]+=r.checked;a[2]+=r.rejected;a[3]+=Number(/HOLD|FAIL|PENDING|REVIEW/i.test(r.status));map.set(key,a);}for(const [name,n]of defectNames(r))defects.set(name,(defects.get(name)||0)+n);}const summaries=map=>Array.from(map,([key,a])=>[key,...a,a[1]?((a[2]/a[1])*100).toFixed(2)+'%':'—']);const cases=new Map();for(const e of events.filter(e=>e.kind==='CAP decision').sort((a,b)=>new Date(a.at)-new Date(b.at)))cases.set(e.caseId||e.id,e);return [
 {name:'Daily activity',columns:['Date','Checks','Checked quantity','Defective quantity','Pending / held checks','Defective rate'],rows:summaries(daily)},
 {name:'Line / team performance',columns:['Line / team','Checks','Checked quantity','Defective quantity','Pending / held checks','Defective rate'],rows:summaries(teams)},
 {name:'Issue and defect analysis',columns:['Defect / issue','Recorded events'],rows:[...defects].sort((a,b)=>b[1]-a[1]).concat(events.filter(e=>e.issue).map(e=>[e.issue,1]))},
 {name:'Open actions and holds',columns:['Type','Reference','Order / owner','Issue / status','Next action','Due'],rows:[...rows.filter(r=>/HOLD|FAIL|PENDING|REVIEW/i.test(r.status)).map(r=>['Inspection',r.id,r.order,r.status,r.payload.action||r.payload.notes||r.payload.note||'Review required','Before release']),...[...cases.values()].filter(e=>e.state!=='FINALISED').map(e=>['CAP',e.id,e.ownerId,e.issue,e.correction,e.due])]},
 {name:'Full traceability',columns:['Recorded','Record','Order','Style','Inspector / session','Checked','Defective','Original status','Amended by','Report note / original reference'],rows:rows.map(r=>[new Date(r.at).toLocaleString(),r.id,r.order,r.style,r.inspector||r.actor,r.checked,r.rejected,r.status,r.amendedBy,r.reportNote||r.payload.evidence||r.payload.reference||''])},
 ];}
export default function QualityReports({records,events,moduleKey,onView}){const {t}=useTranslation(),[which,W]=useState(0),reports=useMemo(()=>reportsFor(records,events),[records,events]),r=reports[which];
 const notes=useMemo(()=>{
  if(which===2)return events.map(e=>e.issue).filter(Boolean);
  if(which===3)return [...events.flatMap(e=>[e.issue,e.correction]),...records.flatMap(r=>[r.payload?.action,r.payload?.notes,r.payload?.note])].filter(Boolean);
  if(which===4)return records.map(record=>effective(record).reportNote).filter(Boolean);
  return [];
 },[records,events,which]);
 const narrative=useNarrativeTranslation(notes),noteSet=new Set(notes);
 const displayed=value=>noteSet.has(value)?narrative.render(value):String(value??'—');
 function download(){const a=document.createElement('a'),url=URL.createObjectURL(new Blob(['\uFEFF'+[r.columns,...r.rows].map((row,i)=>row.map(value=>csv(i>0&&noteSet.has(value)?narrative.csv(value):t(value))).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));a.href=url;a.download=`${moduleKey}-${which+1}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <section className="qs-card"><div className="qs-toolbar"><div><h2>Quality reports</h2><p>Five different views of saved pad records and CAP decisions. Amendments are applied to report values; ground records stay intact.</p></div><button onClick={download} disabled={!r.rows.length}>Export this report · CSV</button></div><div className="qs-report-tabs">{reports.map((v,i)=><button key={v.name} aria-pressed={which===i} onClick={()=>W(i)}>{i+1}. {v.name}</button>)}</div><h3>{r.name}</h3>{narrative.state==='loading'&&<p>Translating report notes…</p>}{narrative.state==='unavailable'&&<p>Note translation unavailable; original notes are shown.</p>}<div className="qs-scroll"><table><thead><tr>{r.columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{r.rows.map((row,i)=><tr key={i}>{row.map((x,j)=><td key={j}>{displayed(x)}</td>)}</tr>)}</tbody></table>{!r.rows.length&&<p>No saved records for this report yet.</p>}</div><p>Rates describe recorded samples, which may overlap; they do not represent unique total production.</p><div className="qs-toolbar">{records.slice(0,8).map(record=><button key={record._id} onClick={()=>onView(record)}>View {record.id}</button>)}</div></section>;}
