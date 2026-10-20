import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import OrgTree from "./OrgTree";
import { YAI_DEPARTMENTS, modulesFor } from "./yaiStructure";
import { QMS_LEADERS } from "./qmsStructure";

const role = (id,title,level,children=[],extra={}) => ({id,title,level,children,...extra});
const section = (department, area, team) => "structure=yai&department="+department+(area ? "&area="+area : "")+(team ? "&team="+team : "");
const qmsOpen = ["factory-gm","factory-manager","qms","qms-internal","qms-supervisors"];
export function buildManagementTree(order, selected="all") {
  const depts = YAI_DEPARTMENTS.filter(d => selected === "all" || d.id === selected);
  const managers = depts.map(d => {
    let children;
    if(d.id === "qms") children = [role("qms-internal", "Senior Quality Supervisor · Internal", "supervisor", [role("qms-supervisors", "Area Quality Supervisors", "supervisor", QMS_LEADERS.map(a => role("qms-area-"+a.id,a.title,"leader",[],{levelLabel:"Quality leader",sectionQuery:section("qms",a.area,a.id),note:a.coverage})), {levelLabel:"Supervisor coverage",note:"Area supervisor allocations pending",sectionQuery:section("qms")})], {levelLabel:"Senior supervisor",sectionQuery:section("qms"),note:"Internal quality oversight"}), role("qms-second", "Senior Quality Supervisor · Optional", "supervisor",[],{levelLabel:"Senior supervisor",note:"Second role / remit to confirm",sectionQuery:section("qms")})];
    else children = d.staff.map((n,i) => role(d.id+"-supervisor-"+i,n.title,"supervisor",[],{sectionQuery:section(d.id,String(i)),levelLabel: /Supervisor/.test(n.title) ? "Supervisor" : "Officer / staff",note:"Staff shown in section list"}));
    return role(d.id,d.head,"manager",children,{reorderable:true,department:d.id,sectionQuery:section(d.id),levelLabel:"Management",note:d.title});
  });
  managers.forEach(n=> { n.branch=n.id==="qms"?"operations":"administrative"; const d=depts.find(d=>d.id===n.id); n.children.push(role(n.id+"-ai",d.agent,"ai",[...modulesFor(d.groups).map((title,i)=>role(n.id+"-module-ai-"+i,title+" AI Agent","ai",[],{levelLabel:"Module AI agent",note:"Support · not an employee"})),role(n.id+"-mobile-ai","Mobile AI Agent","ai",[],{levelLabel:"AI agent",note:"Support · not an employee"}),role(n.id+"-web-ai","Web AI Agent","ai",[],{levelLabel:"AI agent",note:"Support · not an employee"})],{branch:"ai",levelLabel:"AI support",note:"Not a human reporting layer"})); });
  const sorted = managers.sort((a,b) => order.indexOf(a.id)-order.indexOf(b.id));
  const admin = sorted.filter(n=>n.id!=="qms"), operations=sorted.filter(n=>n.id==="qms");
  const shared = role("shared-ai", "Shared AI coordination", "ai", ["Management Dashboard AI Agent","System Analysis AI Agent","SOP Director AI Agent"].map((t,i)=>role("shared-ai-"+i,t,"ai",[],{levelLabel:"AI agent",note:"Support · no human headcount"})), {branch:"ai",levelLabel:"AI support",note:"Not a human reporting layer"});
  return role("factory-gm","Factory General Manager","gm",[role("factory-manager","Factory Manager","factory_manager",[...admin,shared,...operations])]);
}
const initialOrder=YAI_DEPARTMENTS.map(d=>d.id);
export default function YaiManagementTree() {
  const [selected,setSelected]=useState(()=>new URLSearchParams(typeof window === "undefined"?"":window.location.search).get("department")==="qms"?"qms":"all");
  const [order,setOrder]=useState(()=>{try {const saved=JSON.parse(localStorage.getItem("yai-management-order")||"null");return Array.isArray(saved)&&saved.length===initialOrder.length&&new Set(saved).size===initialOrder.length&&initialOrder.every(id=>saved.includes(id))?saved:initialOrder;}catch{return initialOrder;}});
  const tree=useMemo(()=>buildManagementTree(order,selected),[order,selected]);
  const [open,setOpen]=useState(()=>new Set(selected === "qms" ? qmsOpen : ["factory-gm","factory-manager",...initialOrder]));
  const reorder=(from,to)=>{if(from===to||!order.includes(from)||!order.includes(to))return;if((from==="qms")!==(to==="qms"))return;setOrder(old=>{const next=old.filter(id=>id!==from);next.splice(old.indexOf(to),0,from);try{localStorage.setItem("yai-management-order",JSON.stringify(next));}catch{}return next;});};
  return <section aria-label="YAIKH management organization tree">
    <div className="mb-3 flex flex-wrap items-center gap-2">{[{id:"all",title:"All departments"},...YAI_DEPARTMENTS].map(d=><button key={d.id} onClick={()=>{setSelected(d.id);setOpen(new Set(d.id === "qms" ? qmsOpen : ["factory-gm","factory-manager",...(d.id === "all" ? initialOrder : [d.id])]));}} aria-pressed={selected===d.id} className={`rounded-full border px-3 py-1 text-xs ${selected===d.id?"bg-white text-slate-900":"border-slate-600"}`}>{d.title}</button>)}<Link className="ml-auto text-xs font-bold text-sky-300 underline" to={"/dashboard/hr/sections?"+section(selected)}>Open section list →</Link></div>
    <OrgTree mgmt={tree} open={open} setOpen={setOpen} onReorder={reorder} />

  </section>;
}
