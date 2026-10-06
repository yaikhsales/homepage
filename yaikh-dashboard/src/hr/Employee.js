// HR · one employee's profile — role (title for management levels), the manager chain up to the GM, the
// direct reports (with their own team sizes), skills and machines for operators, attendance today, hire
// date, contract, wage band, and the codes it appears under elsewhere (OP-0101 on the floor, LL-07,
// P-01 in Icom) as "also known as". Employee numbers and roles only, no names, no photo.
// Data: {"module":"hr","view":"employee","emp_no"} → profile, manager_chain, direct_reports / rows.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, ChevronRight, Wrench, Award, CalendarDays, FileText, Users } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { post, num, GROUP, LEVEL, HrNav, Chip, RoleIcon, Person, Panel, Tile, todayChip } from "./hr";

const KV = ({ items }) => <div className="grid gap-x-4 gap-y-0.5 text-xs sm:grid-cols-2">{items.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => <div key={k} className="flex gap-2 border-b border-slate-700/60 py-0.5"><span className="text-slate-500 whitespace-nowrap w-28">{k}</span><b className="text-white min-w-0">{String(v)}</b></div>)}</div>;

const Employee = ({ onBack }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [topRef, topPad] = useScreenTop();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const j = await post(/^YAI\d+$/i.test(id) ? { view: "employee", emp_no: id.toUpperCase() } : { view: "employee", alias: id });
      setData(j);
    } catch (e) {
      setError(`Employee ${id} is unavailable right now. Please try again in a moment.`);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const d = data || {};
  const p = d.profile || {};
  const chain = d.manager_chain || [];
  const reports = d.direct_reports || d.rows || [];
  const L = LEVEL[p.level] || LEVEL.staff;
  const g = GROUP[p.group] || GROUP.operations;
  const att = p.attendance_today || p.today || {};
  const sk = p.skills;
  const aliases = Array.isArray(p.aliases) ? p.aliases : p.aliases ? String(p.aliases).split(/,\s*/) : [];

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">Employee {id}</h1>
        <HrNav current="employees" />
        <button onClick={load} className="ml-auto p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      {p.emp_no && (
        <div className="grid gap-3">
          {/* the head: role badge, no photo */}
          <div className={`rounded-2xl border-2 bg-slate-800/60 p-4 flex flex-wrap items-center gap-4 ${L.ring}`}>
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center bg-slate-900 ${L.ring}`}><RoleIcon level={p.level} size={32} /></div>
            <div className="min-w-0">
              <div className="text-xl font-black text-white leading-tight">{p.title || p.emp_no}</div>
              <div className="text-sm text-slate-300">{p.title ? p.emp_no + " · " : ""}{p.position}{p.grade ? ` · grade ${p.grade}` : ""}</div>
              <div className="mt-1 flex flex-wrap gap-1.5"><Chip cls={g.chip}>{g.label}</Chip><Chip cls="bg-slate-500/20 text-slate-300 border-slate-500/30">{L.label}</Chip><Chip cls={todayChip(att.state || p.today)}>{att.state ? "today: " + att.state + (att.reason ? " · " + att.reason : "") : "today: —"}</Chip><Chip cls={/active/.test(String(p.status)) ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}>{p.status}</Chip></div>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <Tile label="Department" value={p.department_name || p.department} sub={[p.section, p.factory, p.unit].filter(Boolean).join(" · ")} />
              {p.line && <Tile label="Line" value={p.line} sub={sk && sk.station ? `station ${sk.station} · ${sk.station_operation || ""}` : undefined} />}
              <Tile label="Reports to" value={chain[0] ? chain[0].title || chain[0].emp_no : "—"} sub={chain[0] ? chain[0].emp_no : undefined} />
              {reports.length > 0 && <Tile label="Direct reports" value={num(reports.length)} />}
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            <Panel title="Manager chain" right="up to the General Manager">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2"><Person p={{ emp_no: p.emp_no, title: p.title, level: p.level, position: p.position, grade: p.grade }} big /><span className="text-[11px] text-slate-500">this employee</span></div>
                {chain.map((m) => <div key={m.emp_no} className="flex items-center gap-2 ml-3"><ChevronRight size={12} className="text-slate-600" /><Person p={m} onClick={() => navigate("/dashboard/hr/employee/" + m.emp_no)} /><span className="text-[11px] text-slate-500">{m.position}</span></div>)}
                {chain.length === 0 && <div className="text-xs text-slate-500">Top of the organization.</div>}
              </div>
            </Panel>
            <Panel title="Employment">
              <KV items={[["Employee", p.emp_no], ["Position", p.position], ["Level", L.label], ["Group", g.label], ["Department", p.department_name || p.department], ["Section", p.section], ["Factory · unit", [p.factory, p.unit].filter(Boolean).join(" · ")], ["Line", p.line], ["Grade", p.grade], ["Shift", p.shift], ["Hire date", p.hire_date], ["Contract", p.contract ? `${p.contract.type}${p.contract.term_months ? " · " + p.contract.term_months + " months" : ""}${p.contract.end_date ? " · to " + p.contract.end_date : ""}` : undefined], ["Wage band", p.wage ? `${p.wage.band}${p.wage.monthly_gross_usd ? " · USD " + num(p.wage.monthly_gross_usd) + " / month" : ""}` : undefined], ["Payroll group", p.payroll_group], ["Gender · age", [p.gender, p.age_band].filter(Boolean).join(" · ")]]} />
            </Panel>
            <Panel title="Also known as" right="the codes this person carries on other screens">
              {aliases.length ? <div className="flex flex-wrap gap-1.5">{aliases.map((a) => <Chip key={a} cls="bg-sky-500/20 text-sky-300 border-sky-500/30">{a}</Chip>)}</div> : <div className="text-xs text-slate-500">No other codes — this person appears only as {p.emp_no}.</div>}
              <div className="mt-2 text-[10px] text-slate-500">OP-… = a station on the CE floor and the 4DP live line · LL-… = a line leader · P-… = a PA in Icom · EMP-… = attendance</div>
              <div className="mt-3 flex items-center gap-2 text-xs"><CalendarDays size={13} className="text-slate-400" /><span className="text-slate-400">attendance today:</span><Chip cls={todayChip(att.state)}>{att.state || "—"}{att.reason ? " · " + att.reason : ""}</Chip>{att.date && <span className="text-slate-500">{att.date}</span>}</div>
            </Panel>
          </div>

          {sk && (
            <Panel title="Skills and machines" right={sk.critical_station ? "sits on a critical station" : undefined}>
              <div className="grid gap-3 md:grid-cols-3 text-xs">
                <div><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1"><Wrench size={11} />machines</div><div className="flex flex-wrap gap-1">{(sk.machines || []).map((m) => <Chip key={m} cls="bg-slate-500/20 text-slate-200 border-slate-500/30">{m}</Chip>)}{!(sk.machines || []).length && <span className="text-slate-500">—</span>}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">operations</div><div className="text-slate-300">{(sk.operations || []).join(" · ") || "—"}</div>{sk.station && <div className="text-slate-500 mt-1">station {sk.station} · {sk.station_operation}{sk.required_grade ? ` · needs grade ${sk.required_grade}` : ""}</div>}</div>
                <div><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1"><Award size={11} />certified critical operations</div><div className="flex flex-wrap gap-1">{(sk.certified_critical_ops || []).map((m) => <Chip key={m} cls="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{m}</Chip>)}{!(sk.certified_critical_ops || []).length && <span className="text-slate-500">none</span>}</div></div>
              </div>
            </Panel>
          )}

          {reports.length > 0 && (
            <Panel title="Direct reports" right={`${reports.length} people`}>
              <div className="overflow-auto max-h-96">
                <table className="w-full text-xs">
                  <thead className="text-slate-500"><tr>{["Employee", "Title / position", "Level", "Section", "Line", "Grade", "Status", "Today", "Codes"].map((c) => <th key={c} className="text-left font-normal px-2 py-1 whitespace-nowrap">{c}</th>)}</tr></thead>
                  <tbody>{reports.map((r) => <tr key={r.emp_no} onClick={() => navigate("/dashboard/hr/employee/" + r.emp_no)} className="border-t border-slate-700/60 cursor-pointer hover:bg-slate-700/40"><td className="px-2 py-1 whitespace-nowrap"><span className="inline-flex items-center gap-1.5"><RoleIcon level={r.level} size={12} /><b className="text-white">{r.emp_no}</b></span></td><td className="px-2 py-1">{r.title ? <b className="text-white">{r.title}</b> : r.position}{r.team ? <span className="text-slate-500"> · team {num(r.team)}</span> : null}</td><td className="px-2 py-1 text-slate-300">{(LEVEL[r.level] || {}).label || r.level}</td><td className="px-2 py-1 text-slate-300">{r.section || "—"}</td><td className="px-2 py-1 text-slate-300">{r.line || "—"}</td><td className="px-2 py-1 font-bold text-white">{r.grade || "—"}</td><td className="px-2 py-1 text-slate-300">{r.status}</td><td className="px-2 py-1"><Chip cls={todayChip(r.today)}>{r.today || "—"}</Chip></td><td className="px-2 py-1 text-slate-400">{r.aliases || "—"}</td></tr>)}</tbody>
                </table>
              </div>
            </Panel>
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            <button onClick={() => navigate("/dashboard/hr/employees?" + new URLSearchParams(p.line ? { department: p.department, line: p.line } : { department: p.department }).toString())} className="inline-flex items-center gap-1 rounded-lg border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 px-2 py-1 font-bold"><Users size={12} />everyone in {p.line ? "line " + p.line : p.department_name || p.department}</button>
            <button onClick={() => navigate("/dashboard/org-chart-master")} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 px-2 py-1 font-bold"><FileText size={12} />organization chart</button>
          </div>
        </div>
      )}
      {!p.emp_no && !error && <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">{loading ? "Loading the profile…" : "No such employee."}</div>}
      <p className="mt-3 text-[10px] text-slate-500">simulated factory — employee numbers and roles only, no real person; wage figures are the simulator's</p>
    </div>
  );
};

export default Employee;
