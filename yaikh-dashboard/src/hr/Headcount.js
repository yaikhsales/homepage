// HR · Headcount — the 1,032 people by group (Operations / Administrative) and department: management
// vs workers / staff, present / absent / on leave today, share of women, payroll, with the
// reconciliation of the HR master against the attendance screen by payroll group.
// Data: {"module":"hr","view":"headcount"} → summary, rows, tables.reconciliation.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { post, num, GROUP, HrNav, Chip, Panel, Tile } from "./hr";

const Headcount = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setData(await post({ view: "headcount" })); } catch (e) { setError("Headcount is unavailable right now. Please try again in a moment."); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const d = data || {};
  const rows = useMemo(() => (data && data.rows) || [], [data]);
  const groups = useMemo(() => ["operations", "administrative"].map((g) => ({ id: g, rows: rows.filter((r) => r.group === g) })).map((g) => ({ ...g, total: g.rows.reduce((a, r) => a + (r.headcount || 0), 0), mgmt: g.rows.reduce((a, r) => a + (r.management || 0), 0), present: g.rows.reduce((a, r) => a + (r.present || 0), 0), leave: g.rows.reduce((a, r) => a + (r.on_leave || 0), 0), absent: g.rows.reduce((a, r) => a + (r.absent || 0), 0), payroll: g.rows.reduce((a, r) => a + (r.payroll_usd || 0), 0) })), [rows]);
  const max = Math.max(1, ...rows.map((r) => r.headcount || 0));
  const recon = (d.tables || []).find((t) => t.key === "reconciliation");
  const sum = Object.fromEntries((d.summary || []).map((x) => [x.label, x.value]));

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">Headcount</h1>
        <HrNav current="headcount" />
        <button onClick={load} className="ml-auto p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <div className="flex flex-wrap gap-2 mb-3">
        <Tile label="Employees" value={num(sum.Employees)} sub="HR master" />
        <Tile label="Operations" value={num(sum.Operations)} tone="text-emerald-300" />
        <Tile label="Administrative" value={num(sum.Administrative)} tone="text-violet-300" />
        <Tile label="Present today" value={num(sum["Present today"])} tone="text-emerald-300" />
        <Tile label="On leave today" value={num(sum["On leave today"])} tone="text-amber-300" />
        <Tile label="Attendance screen" value={num(sum["Attendance screen workforce"])} sub={`difference ${num(sum.Difference)}`} tone={Number(sum.Difference) ? "text-rose-300" : "text-emerald-300"} />
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {groups.map((g) => (
          <Panel key={g.id} title={GROUP[g.id].label} right={`${num(g.total)} people · ${num(g.mgmt)} management · ${num(g.present)} present · ${num(g.leave)} on leave · ${num(g.absent)} absent · payroll USD ${num(g.payroll)}`}>
            <div className="space-y-1.5">
              {g.rows.sort((a, b) => (b.headcount || 0) - (a.headcount || 0)).map((r) => (
                <div key={r.department} className="grid items-center gap-x-2 text-xs" style={{ gridTemplateColumns: "13rem 1fr 3.5rem 10rem" }}>
                  <button onClick={() => navigate("/dashboard/hr/employees?" + new URLSearchParams({ group: g.id, search: r.department }).toString())} className="truncate text-left text-slate-200 hover:text-white hover:underline" title={r.department}>{r.department}</button>
                  <div className="relative h-4 rounded bg-slate-900/70 overflow-hidden" title={`${num(r.management)} management · ${num(r.workers_staff)} workers / staff`}>
                    <div className={`absolute inset-y-0 left-0 ${GROUP[g.id].bar}`} style={{ width: ((r.headcount || 0) / max) * 100 + "%" }} />
                    <div className="absolute inset-y-0 left-0 bg-white/40" style={{ width: ((r.management || 0) / max) * 100 + "%" }} />
                  </div>
                  <div className="tabular-nums text-right font-bold text-white">{num(r.headcount)}</div>
                  <div className="text-[11px] text-slate-400 whitespace-nowrap tabular-nums"><span className="text-emerald-300">{num(r.present)}</span> in · <span className="text-amber-300">{num(r.on_leave)}</span> leave · <span className="text-rose-300">{num(r.absent)}</span> out{r.female_pct !== undefined ? ` · ${r.female_pct}% F` : ""}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-slate-500">bar = headcount · the lighter head of the bar = management (GM, factory managers, managers, supervisors, leaders) · click a department for its people</div>
          </Panel>
        ))}
      </div>
      {recon && (
        <Panel title={recon.title} right="every payroll group ties to the attendance screen" className="mt-3">
          <div className="overflow-auto max-h-80">
            <table className="w-full text-xs">
              <thead className="text-slate-500 sticky top-0 bg-slate-800"><tr>{recon.columns.map(([k, l]) => <th key={k} className="text-left font-normal px-2 py-1 whitespace-nowrap">{l}</th>)}</tr></thead>
              <tbody>{recon.rows.map((r, i) => <tr key={i} className={`border-t border-slate-700/60 ${Number(r.diff) ? "bg-rose-500/10" : ""}`}>{recon.columns.map(([k]) => <td key={k} className={`px-2 py-1 whitespace-nowrap ${typeof r[k] === "number" ? "tabular-nums text-right" : ""} ${k === "diff" ? (Number(r[k]) ? "text-rose-300 font-bold" : "text-emerald-300") : "text-slate-300"}`}>{num(r[k])}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Panel>
      )}
      <div className="mt-2 flex gap-1.5"><Chip cls={GROUP.operations.chip}>Operations = 4DP, YPI, MRP, FC, cutting, sewing lines, finishing, QA, CE, YTM…</Chip><Chip cls={GROUP.administrative.chip}>Administrative = HR, accounting, admin, CSR, shipping, IT…</Chip></div>
      <p className="mt-2 text-[10px] text-slate-500">{d.as_of ? `As of ${String(d.as_of).replace("T", " ").slice(0, 16)} · ` : ""}simulated factory — employee numbers and roles only, no real person</p>
    </div>
  );
};

export default Headcount;
