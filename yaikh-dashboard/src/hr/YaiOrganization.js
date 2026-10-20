import React, { useState } from "react";
import { Bot, Users, ChevronDown, ChevronRight } from "lucide-react";
import { DASHBOARD_DATA } from "../data/module";
import QmsOrganization from "./QmsOrganization";

const workflowGroups = DASHBOARD_DATA.flatMap(s => s.groups || []);
const modulesFor = ids => workflowGroups.filter(g => ids.includes(g.id)).flatMap(g => g.modules.map(m => m.title));
export const YAI_DEPARTMENTS = [
  { id: "qms", title: "YQMS · Quality", groups: ["qa-col"], head: "Quality Manager", duty: "Owns quality across sample room, warehouse, inspection, cutting, printing/embroidery, sewing, finishing, packaging and loading.", staff: [{title: "Senior Quality Supervisors · 1–2", detail: "One internal; area quality leaders, QA auditors, brand QOs and quality checkers."}], agent: "YQMS AI Agent" },
  { id: "finance", title: "Accounting & Billing", groups: ["accountant-col", "billing-col"], head: "Finance Manager / Senior Accountant", duty: "Owns accounting, billing and department oversight.", staff: [{title: "Accountant", children: [{title: "Accounting / Billing Clerk"}]}], agent: "Accounting & Billing AI Agent" },
  { id: "hr", title: "Human Resources", groups: ["hr-col"], head: "HR Manager / HR Senior Supervisor", duty: "Owns the employee lifecycle, organization, training, temporary workers and Speak Up.", staff: [{title: "HR Officer", children: [{title: "HR Clerk"}]}], agent: "HR AI Agent" },
  { id: "admin", title: "Admin", groups: ["admin-col"], head: "Admin Manager", duty: "Owns site administration and coordinates the supervisor teams.", staff: [
    {title: "Property & Maintenance Supervisor", children: [{title: "Construction & Maintenance Workers", detail: "Welder · Carpenter · Masonry worker · Mechanical maintenance worker"}, {title: "Hostel & Rooms Staff", detail: "Cleaner / room support"}]},
    {title: "Electrical Supervisor", children: [{title: "Electrical Staff"}]},
    {title: "Security & Safety / Chief Security Supervisor", children: [{title: "Security Guards"}, {title: "Disaster Management Team"}]},
    {title: "Vehicle & Maintenance Supervisor", children: [{title: "Vehicle & Maintenance Staff"}]}
  ], agent: "Admin AI Agent" },
  { id: "csr", title: "CSR", groups: ["csr-col"], head: "CSR Manager", duty: "Owns the whole CSR department and its compliance work.", staff: [{title: "CSR Supervisor / CSR Officer", detail: "Coordinates daily work and follows up on the team’s tasks.", children: [{title: "CSR Workers", detail: "1–3 workers, as described; actual assigned headcount to confirm."}]}], agent: "CSR AI Agent" },
  { id: "shipping", title: "Shipping & E-government", groups: ["shipping-col", "egov-col"], head: "Shipping Manager / Shipping Senior Supervisor", duty: "Owns shipping and the team’s work with government platforms through E-government.", staff: [{title: "Shipping Supervisor", children: [{title: "Shipping Clerk"}]}], agent: "Shipping AI Agent" }
];

function HumanNode({node}) {
  return <li className="mt-3"><div className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"><div className="flex items-start gap-2"><Users size={15} className="mt-0.5 shrink-0 text-sky-300" /><div><strong className="text-sm text-white">{node.title}</strong>{node.detail && <p className="mt-1 text-xs text-slate-300">{node.detail}</p>}</div></div></div>{node.children && <ul className="ml-4 border-l-2 border-slate-600 pl-4">{node.children.map(child => <HumanNode node={child} key={child.title} />)}</ul>}</li>;
}
function Agent({title, children}) {
  return <div className="rounded-lg border border-violet-400/50 bg-violet-500/10 px-3 py-2"><div className="flex items-center gap-2 text-sm font-bold text-violet-200"><Bot size={16} className="shrink-0" />{title}</div><span className="text-[10px] uppercase tracking-wide text-violet-300">AI agent · not an employee</span>{children}</div>;
}
export default function YaiOrganization() {
  const [selected, setSelected] = useState(() => new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("department") === "qms" ? "qms" : "all");
  const [expanded, setExpanded] = useState(() => new Set(YAI_DEPARTMENTS.map(d => d.id)));
  const toggle = id => setExpanded(old => { const next = new Set(old); next.has(id) ? next.delete(id) : next.add(id); return next; });
  return <section aria-label="YAIKH organization chart">
    <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4"><h2 className="text-lg font-black text-white">YAIKH organization · people and AI agents</h2><p className="mt-1 text-sm text-slate-300">Department structure supplied by Gamini. Managers own their departments; supervisors and officers coordinate their teams. AI agents support the work and are shown separately from human reporting lines.</p><p className="mt-2 text-xs text-slate-400">Role structure only — employee assignments, vacancies and actual headcounts are not yet connected. “/” indicates alternative titles, not additional posts. AI agent boxes describe their place in the structure; they do not confirm a live connection or grant approval authority.</p></div>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter departments">{[{id:"all",title:"All departments"},...YAI_DEPARTMENTS].map(d => <button key={d.id} onClick={() => setSelected(d.id)} aria-pressed={selected === d.id} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${selected === d.id ? "border-white bg-white text-slate-900" : "border-slate-600 text-slate-200 hover:bg-slate-800"}`}>{d.title}</button>)}</div>
    {selected === "qms" && <QmsOrganization />}
    {selected !== "qms" && <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px_minmax(0,1fr)]">
      <div className="xl:col-start-2 xl:row-start-1"><div className="rounded-xl border border-violet-400/50 bg-slate-800/60 p-3 xl:sticky xl:top-4"><h3 className="font-bold text-white">Shared AI coordination</h3><p className="my-2 text-xs text-slate-300">Supports all departments · AI agents, separate from human management.</p><div className="space-y-2"><Agent title="Management Dashboard AI Agent" /><Agent title="System Analysis AI Agent" /><Agent title="SOP Director AI Agent" /></div><p className="mt-3 text-xs text-slate-400">Cross-department analysis and process hand-offs. Human managers retain department accountability.</p></div></div>
      {[0,1].map(side => <div key={side} className={`${side ? "xl:col-start-3" : "xl:col-start-1"} xl:row-start-1 space-y-4`}>{YAI_DEPARTMENTS.filter((d,i) => selected === "all" ? i % 2 === side : d.id === selected && side === 0).map(d => <article key={d.id} className="rounded-xl border border-slate-600 bg-slate-900/70 p-3"><button onClick={() => toggle(d.id)} aria-expanded={expanded.has(d.id)} className="flex w-full items-center gap-2 text-left font-black text-white">{expanded.has(d.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}{d.title}</button>{expanded.has(d.id) && <><ul><HumanNode node={{title:d.head,detail:d.duty,children:d.staff}} /></ul><div className="mt-4 border-t border-dashed border-violet-400/40 pt-3"><p className="mb-2 text-xs font-bold text-violet-300">AI support for this department</p><Agent title={d.agent}><div className="mt-2 grid gap-2 sm:grid-cols-2"><Agent title="Mobile AI Agent" /><Agent title="Web AI Agent" /></div></Agent></div>{d.id === "qms" && <button onClick={() => setSelected("qms")} className="mt-3 rounded-lg bg-sky-500 px-3 py-2 text-sm font-bold text-slate-950">Open full YQMS team and staffing plan</button>}<div className="mt-3"><h4 className="text-xs font-bold text-slate-300">YAIKH workflow coverage</h4><p className="mt-1 text-xs leading-relaxed text-slate-400">{modulesFor(d.groups).join(" · ")}</p></div></>}</article>)}</div>)}
    </div>}
    <p className="mt-4 text-xs text-slate-400">This revision covers YQMS and the administrative departments described here. Factory operations and their simulated employee hierarchy remain available in “Simulated factory”; sewing QA responsibilities remain in “Sewing quality roles”.</p>
  </section>;
}
