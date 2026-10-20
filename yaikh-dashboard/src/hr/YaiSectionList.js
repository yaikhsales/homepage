import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { UserRound } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { HrNav } from "./hr";
import { YAI_DEPARTMENTS, modulesFor } from "./yaiStructure";
import { QMS_SECTION_ROWS } from "./qmsStructure";
export { QMS_SECTION_ROWS } from "./qmsStructure";

const AREAS = [["", "All QMS teams"], ["0", "Sample room"], ["1", "Fabric warehouse"], ["2", "Accessory warehouse"], ["3", "Fabric / cutting"], ["4", "Print / embroidery"], ["5", "Sewing"], ["6", "Finishing"], ["7", "Packaging"], ["8", "Loading"], ["qa", "QA auditors · 10"], ["qo", "Brand QOs · 5"]];
const scope = area => "/dashboard/hr/sections?structure=yai&department=qms&area=" + area;
function Slots({team}) {
  return <div className={`mb-3 ${team.max > 5 ? "xl:col-span-3" : ""}`}>
    <h3 className="mb-2 text-xs font-bold text-slate-300">{team.label}{team.min ? ` · ${team.min}${team.max !== team.min ? "–" + team.max : ""} planned` : ""}</h3>
    {team.unknown ? <p className="text-xs text-slate-500">Staff allocation not specified yet.</p> : <div className="flex flex-wrap gap-2">{Array.from({length:team.max},(_,i) => <div key={i} className={`w-20 rounded-lg p-1 text-center ${i >= team.min ? "border border-dashed border-slate-600 opacity-60" : ""}`}>
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-500 text-slate-500"><UserRound size={20}/></div>
      <div className="mt-1 text-[10px] text-slate-400">ID unassigned</div><div className="text-[9px] text-slate-500">{i >= team.min ? "Optional " : "Slot "}{i+1}</div>
    </div>)}</div>}
  </div>;
}
function QualityRow({row}) {
  return <article className="mb-2 grid gap-4 rounded-xl border border-slate-700 bg-slate-800/40 p-3 md:grid-cols-[250px_minmax(0,1fr)]">
    <div className="md:border-r md:border-slate-700 md:pr-3">
      <div className="mb-2 text-xs text-slate-400">{row.supervisor || (row.area === "qo" ? "Brand representation · final quality" : row.area === "qa" ? "Shared department audit team" : "Quality supervision / area allocation")}</div>
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-sky-500 text-sky-300"><UserRound size={24}/></div>
      <h3 className="font-bold text-white">{row.leader}</h3><p className="text-xs text-slate-400">{row.shared || row.area === "qa" ? "Employee assignments pending" : row.area === "qo" ? "QO ID unassigned" : "Leader ID unassigned"}</p>
      {row.note && <p className="mt-2 text-xs text-slate-400">{row.note}</p>}
    </div>
    <div className="grid gap-3 xl:grid-cols-3">{row.teams.map(t => <Slots team={t} key={t.label}/>)}</div>
  </article>;
}
export default function YaiSectionList() {
  const [params,setParams] = useSearchParams();
  const [topRef,topPad] = useScreenTop();
  const dept = params.get("department") || "all", area = params.get("area"), team = params.get("team");
  const departments = YAI_DEPARTMENTS.filter(d => dept === "all" || d.id === dept);
  const chooseDept = id => setParams({structure:"yai",department:id});
  const chooseArea = id => setParams({structure:"yai",department:"qms",...(id ? {area:id} : {})});
  const qualityRows = QMS_SECTION_ROWS.filter(r => (!area || dept !== "qms" || r.area === area) && (!team || r.id === team || r.shared));
  return <div ref={topRef} style={{paddingTop:topPad}} className="yai-pa-aware min-h-screen bg-slate-900 px-4 pb-8 text-slate-200">
    <NavCover/>
    <div className="mb-3 flex flex-wrap items-center gap-3"><h1 className="text-lg font-black text-white">Section list</h1><HrNav current="sections"/></div>
    <p className="mb-3 text-xs text-slate-400">Supervisor / leader on the left; workers on the right, grouped by line. Planned slots have no assigned employee ID. These are not employee records and are excluded from actual headcount.</p>
    <div className="mb-4 flex flex-wrap gap-2">{[{id:"all",title:"All departments"},...YAI_DEPARTMENTS].map(d => <button key={d.id} onClick={() => chooseDept(d.id)} aria-pressed={dept === d.id} className={`rounded-full border px-3 py-1 text-xs ${dept === d.id ? "bg-white text-slate-900" : "border-slate-600"}`}>{d.title}</button>)}<Link to="/dashboard/org-chart-master" className="ml-auto text-sm text-sky-300 underline">Master chart</Link></div>
    {(dept === "all" || dept === "qms") && <div className="mb-4 rounded-lg border border-sky-500/40 p-3">
      <div className="flex flex-wrap gap-2" aria-label="QMS area filters">{AREAS.map(([id,label]) => <button key={id} onClick={() => chooseArea(id)} aria-pressed={dept === "qms" && (area || "") === id && !team} className={`rounded border px-2 py-1 text-xs ${dept === "qms" && (area || "") === id && !team ? "bg-sky-300 text-slate-900" : "border-slate-600"}`}>{label}</button>)}</div>
      <p className="mt-3 text-xs text-slate-300">QA auditors: about 10 across warehouse, cutting, sewing and packing; allocations vary, with one or two supporting some supervisors. <Link className="text-sky-300 underline" to={scope("qa")}>Open the shared QA team</Link>.</p>
      <p className="mt-1 text-xs text-slate-300">Brand QOs: five, one per brand, mainly warehouse and packaging for final quality. Each has 1–2 helpers, 5–10 helpers overall. <Link className="text-sky-300 underline" to={scope("qo")}>Open all five QOs and helpers</Link>. These shared teams are counted once.</p>
    </div>}
    {departments.map(d => <section key={d.id} className="mb-5"><h2 className="mb-2 font-bold text-white">{d.title}</h2><p className="mb-3 text-xs text-slate-400">YAIKH workflow coverage: {modulesFor(d.groups).join(" · ")}</p>
      {d.id === "qms" ? qualityRows.map(row => <QualityRow key={row.id} row={row}/>) : d.staff.map(s => <article key={s.title} className="mb-2 grid gap-4 rounded-xl border border-slate-700 p-3 md:grid-cols-[250px_minmax(0,1fr)]"><div><h3 className="font-bold">{s.title}</h3><p className="text-xs text-slate-400">Leader / officer ID unassigned</p></div><div>{(s.children || []).map(c => <div key={c.title} className="mb-2"><strong className="text-sm">{c.title}</strong><p className="text-xs text-slate-400">{c.detail || "Staff allocation to confirm"}</p><Slots team={c.title === "CSR Workers" ? {label:c.title,min:1,max:3} : {label:c.title,min:0,max:0,unknown:true}}/></div>)}{!s.children && <p className="text-xs text-slate-400">Staff allocation to confirm.</p>}</div></article>)}
    </section>)}
  </div>;
}
