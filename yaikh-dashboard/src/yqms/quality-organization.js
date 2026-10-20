import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../hr/hr';
import QmsOrganization from '../hr/QmsOrganization';
let cached, pending;
async function readOrganization(){
  if(cached && Date.now()-cached.loadedAt<300000)return cached;
  if(pending)return pending;
  pending=(async()=>{
    const [tree,first]=await Promise.all([post({view:'org-tree'}),post({view:'employees',department:'qa',page:1})]);
    const rest=await Promise.all(Array.from({length:Math.max(0,(first.pages||1)-1)},(_,i)=>post({view:'employees',department:'qa',page:i+2})));
    const people=[...(first.rows||[]),...rest.flatMap(page=>page.rows||[])];
    if(!people.length)throw new Error('QA directory is empty');
    cached={people,tree:tree.mgmt,asOf:tree.as_of,simulated:tree.simulated,loadedAt:Date.now()};return cached;
  })().finally(()=>{pending=null;});return pending;
}
export function useQualityOrganization(){
  const [org,setOrg]=useState(cached||null),[error,setError]=useState('');
  useEffect(()=>{let alive=true;readOrganization().then(value=>{if(alive)setOrg(value);}).catch(()=>{if(alive)setError('YHR QA directory is unavailable. No employee IDs or authority are invented.');});return()=>{alive=false;};},[]);
  return {org,error};
}
export function qaChain(org,employee){
  const chain=[],seen=new Set();let person=org?.people.find(p=>p.emp_no===employee);
  while(person&&!seen.has(person.emp_no)){chain.push(person);seen.add(person.emp_no);const id=String(person.reports_to||'').split(' ')[0];person=org.people.find(p=>p.emp_no===id);}
  const top=chain[chain.length-1];if(top?.reports_to)chain.push({emp_no:top.reports_to.split(' ')[0],title:top.reports_to.split(' ').slice(1).join(' '),level:'gm'});
  return chain;
}
export function reviewerOptions(org,employee){return qaChain(org,employee).filter(p=>['leader','supervisor','manager'].includes(p.level));}
export const QUALITY_HANDOFFS=[
  ['Inspector / QC checker','A4 portrait pad','Identify order, lot, bundle and machine; enter checked and defective pieces, measurements, findings and evidence. Submit the recorded check.'],
  ['Area Quality Leader','Desktop review','Review sample coverage, current SOP, inspector training and evidence. Segregate defective goods and return corrections for linked reinspection.'],
  ['Senior Quality Supervisor','Desktop disposition','Verify affected quantity, location, corrective action, independent reinspection and required tests before authorising the defined release scope.'],
  ['Quality Manager','Desktop oversight','Own the quality plan, delegated release scope, staffing and escalation. Coordinate area leaders, QA auditors, five brand QOs and training through YHR.'],
  ['QA auditors · about 10 shared','Pad audit + desktop findings','Independently audit the assigned warehouse, cutting, sewing and packing scopes. Record findings and verify corrected work; allocation follows area and supervisor assignment.'],
  ['Brand QOs · 5 total','Desktop brand follow-up','One coordinator per brand follows final quality, especially warehouse and packaging, supported by 1–2 workers per QO. Confirm buyer requirements, packing and final report follow-up with the area leader; QO title alone does not grant release authority.'],
  ['Yai / PA','Assisted monitoring','Calculate results, find missing evidence, route tasks and flag overdue actions. Human reviewers own inspection and release decisions.'],
];
export function QualityOrganizationPanel(){
  const {org,error}=useQualityOrganization();
  const manager=org?.people.find(p=>p.level==='manager'),supervisors=org?.people.filter(p=>p.level==='supervisor')||[],leaders=org?.people.filter(p=>p.level==='leader')||[];
  return <section style={{padding:16,border:'1px solid #94a3b8',borderRadius:12,background:'#f8fafc',color:'#1e293b',margin:'12px 0'}} aria-label="Quality roles aligned with YHR">
    <h3 style={{fontWeight:800,margin:'0 0 8px'}}>Quality responsibilities · YHR organisation</h3>
    <QmsOrganization/><h4 style={{fontWeight:750,marginTop:14}}>Current employee assignments from the YHR directory</h4><p style={{fontSize:12}}>The planning chart above defines the intended department. Employee allocations below are the current simulated roster; unassigned posts are not filled with invented employee IDs.</p>
    {error?<p role="alert">{error}</p>:!org?<p>Loading the YHR QC / QA directory…</p>:<><p style={{fontSize:12}}>Source: the same YHR organisation and employee directory · {org.people.length} QC / QA positions · {org.simulated?'simulated factory':''} · as of {org.asOf||'current response'}.</p><p style={{fontWeight:700}}>{manager?.reports_to} → {manager?.emp_no} {manager?.title} → QC supervisors → QC leaders → inspectors</p><p style={{fontSize:12}}>{supervisors.map(p=>`${p.emp_no} ${p.title}`).join(' · ')}</p><p style={{fontSize:12}}>{leaders.map(p=>`${p.emp_no} ${p.title}`).join(' · ')}</p></>}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10,marginTop:12}}>{QUALITY_HANDOFFS.map(([role,surface,task])=><div key={role} style={{border:'1px solid #cbd5e1',padding:12,borderRadius:9,background:'white'}}><strong>{role}</strong><div style={{fontSize:11,color:'#0369a1'}}>{surface}</div><p style={{fontSize:12}}>{task}</p></div>)}</div>
    <p style={{fontSize:12}}>Required handoff: current spec / artwork + named sampling plan → inspector evidence → leader review → correction and independent reinspection when needed → authorised scope release. Pending tests or failed product cannot be cleared by relabelling.</p>
    <div style={{display:'flex',gap:16,fontWeight:700,fontSize:12,flexWrap:'wrap'}}><Link to="/dashboard/org-chart-master" style={{color:'#0369a1'}}>Open YHR master chart ↗</Link><Link to="/dashboard/hr/employees?department=qa" style={{color:'#0369a1'}}>Open QC / QA directory ↗</Link><Link to="/dashboard/sop-map" style={{color:'#0369a1'}}>Open SOP Director ↗</Link></div>
    <p style={{fontSize:11}}>Process references: <a href="https://www.iso.org/quality-management/quality-assurance" target="_blank" rel="noreferrer" style={{color:'#0369a1'}}>ISO quality assurance</a> · <a href="https://www.qima.com/blog/apparel/apparel-quality-control-procedures" target="_blank" rel="noreferrer" style={{color:'#0369a1'}}>QIMA apparel controls</a>. Role assignments and workflow are this factory demo's implementation, not rules imposed by those articles.</p>
  </section>;
}
