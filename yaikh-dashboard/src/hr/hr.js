// HR · shared bits for the organization chart, the employee directory, the profile and the headcount.
// Data: the simulated factory on the M1, POST /api/m1/sim/view, module "hr". Every person is an
// employee number (YAI0001 … YAI1032) plus a role — titles only for management levels, no names,
// no photos; the codes other screens use (OP-0101, LL-07, P-01 …) are "also known as".
import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Factory, Briefcase, UserCog, Users, User, UserRound } from "lucide-react";

export const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
export const post = async (body) => {
  const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "hr", ...body }) });
  const j = await r.json();
  if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
  return j;
};
export const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v === null || v === undefined || v === "" ? "—" : String(v));

// the org rule: GM → Factory Manager → Supervisors → Leaders → Workers; one plain role icon per level
export const LEVEL = {
  gm: { label: "General Manager", icon: Crown, tone: "text-amber-300", ring: "border-amber-400" },
  factory_manager: { label: "Factory Manager", icon: Factory, tone: "text-sky-300", ring: "border-sky-400" },
  manager: { label: "Manager", icon: Briefcase, tone: "text-sky-300", ring: "border-sky-400" },
  supervisor: { label: "Supervisor", icon: UserCog, tone: "text-emerald-300", ring: "border-emerald-400" },
  leader: { label: "Leader", icon: Users, tone: "text-teal-300", ring: "border-teal-400" },
  worker: { label: "Worker", icon: User, tone: "text-slate-300", ring: "border-slate-500" },
  staff: { label: "Staff", icon: UserRound, tone: "text-slate-300", ring: "border-slate-500" },
};
export const GROUP = {
  operations: { label: "Operations", chip: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", bar: "bg-emerald-400", box: "border-emerald-500/50" },
  administrative: { label: "Administrative", chip: "bg-violet-500/20 text-violet-300 border-violet-500/30", bar: "bg-violet-400", box: "border-violet-500/50" },
};
export const TODAY = { present: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", absent: "bg-rose-500/20 text-rose-300 border-rose-500/30", leave: "bg-amber-500/20 text-amber-300 border-amber-500/30", late: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
export const todayChip = (t) => { const s = String(t || "").toLowerCase(); return TODAY[s.split(" ")[0]] || (/leave/.test(s) ? TODAY.leave : /absent/.test(s) ? TODAY.absent : TODAY.present); };

// a person: management levels show their title, everyone else the employee number only
export const RoleIcon = ({ level, size = 14, className }) => { const L = LEVEL[level] || LEVEL.staff; const I = L.icon; return <I size={size} className={className || L.tone} />; };
export const Person = ({ p, big, onClick }) => {
  const L = LEVEL[p.level] || LEVEL.staff;
  const titled = !!p.title;
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-lg border bg-slate-900/70 px-2 py-1 text-left hover:border-slate-400 transition-colors ${L.ring}`}>
      <RoleIcon level={p.level} size={big ? 18 : 14} />
      <span className="min-w-0">
        <span className={`block font-black text-white leading-tight ${big ? "text-sm" : "text-xs"}`}>{titled ? p.title : p.emp_no}</span>
        <span className="block text-[10px] text-slate-400 leading-tight">{titled ? p.emp_no : p.position || L.label}{p.grade && !titled ? ` · grade ${p.grade}` : ""}</span>
      </span>
    </button>
  );
};

export const HR_NAV = [
  { view: "org-chart-master", title: "Master chart", path: "/dashboard/org-chart-master" },
  { view: "sections", title: "Section chart", path: "/dashboard/hr/sections" },
  { view: "employees", title: "Employee directory", path: "/dashboard/hr/employees" },
  { view: "headcount", title: "Headcount", path: "/dashboard/hr/headcount" },
];
export const HrNav = ({ current }) => {
  const navigate = useNavigate();
  return <div className="flex flex-wrap gap-1">{HR_NAV.map((n) => <button key={n.view} onClick={() => navigate(n.path)} className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${n.view === current ? "bg-white text-slate-900 border-white" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{n.title}</button>)}</div>;
};
export const Panel = ({ title, right, children, className }) => <section className={`rounded-xl border border-slate-700 bg-slate-800/40 p-3 min-w-0 ${className || ""}`}><div className="flex items-baseline justify-between gap-2 mb-2"><div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{title}</div>{right && <div className="text-[11px] text-slate-500">{right}</div>}</div>{children}</section>;
export const Tile = ({ label, value, sub, tone }) => <div className="rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className={`font-black tabular-nums text-base leading-tight ${tone || "text-white"}`}>{value}</div>{sub && <div className="text-[10px] text-slate-500">{sub}</div>}</div>;
export const Chip = ({ cls, children }) => <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${cls}`}>{children}</span>;
