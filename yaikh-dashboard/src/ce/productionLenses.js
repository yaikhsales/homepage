// CE · the Production column's six lenses on the shared floor — the per-line DETAIL bodies and the
// per-station figure each lens writes under the worker on the drawing:
//   balancing    — load % against the pitch per station, the bottleneck red, line balance efficiency
//   productivity — the line's cut / sew / pack against target today, station output %
//   team         — efficiency, DHU and achievement per worker, the line's rank and month to date
//   skill        — grade A / B / C / newcomer, required grade, certified critical operations, line mix
//   learning     — day n on the style, line and station curve against plan
//   downtime     — minutes lost, the events (cause, mechanic, open / fixed), red if down now
// Data: {"module":"ce","view":"floor","lens":<lens>,"line":<line>} → detail (keys read below).
import React, { useEffect, useState } from "react";
import { AlertTriangle, Trophy, Award, TrendingUp, Timer, Bell, DollarSign } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

const num = (v, d = 1) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: d }) : v === null || v === undefined || v === "" ? "—" : String(v));
const pct = (v) => (typeof v === "number" ? v : Number(String(v || "").replace("%", "")) || 0);
const H = ({ children, right }) => <div className="flex items-baseline justify-between gap-2 mb-1.5"><div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{children}</div>{right && <div className="text-[11px] text-slate-500">{right}</div>}</div>;
const Panel = ({ title, right, children, className }) => <section className={`rounded-xl border border-slate-700 bg-slate-800/40 p-3 min-w-0 ${className || ""}`}><H right={right}>{title}</H>{children}</section>;
const Tile = ({ label, value, tone, sub }) => <span className="inline-flex items-baseline gap-1.5 rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-1 text-xs whitespace-nowrap"><span className="text-slate-400">{label}</span><b className={`tabular-nums text-sm ${tone || "text-white"}`}>{value}</b>{sub && <span className="text-[11px] text-slate-500">{sub}</span>}</span>;
const GRADE = { A: "bg-emerald-500 text-slate-900", B: "bg-sky-400 text-slate-900", C: "bg-amber-400 text-slate-900", newcomer: "bg-slate-500 text-white", N: "bg-slate-500 text-white" };
const Grade = ({ g }) => <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-[11px] font-black ${GRADE[g] || "bg-slate-600 text-white"}`} title={"grade " + g}>{g === "newcomer" ? "N" : g}</span>;
const Th = ({ cols }) => <thead className="text-slate-500"><tr>{cols.map((c) => <th key={c} className="text-left font-normal px-2 py-1 whitespace-nowrap">{c}</th>)}</tr></thead>;
const Bar = ({ v, max = 100, tone, h = "h-2.5" }) => <div className={`${h} rounded bg-slate-900/70 overflow-hidden`}><div className={`h-full rounded ${tone}`} style={{ width: Math.min(100, (pct(v) / max) * 100) + "%" }} /></div>;

// a small efficiency curve against plan (day by day), SVG
const Curve = ({ points, height = 120 }) => {
  if (!points || !points.length) return <div className="text-xs text-slate-500">No days on this style yet.</div>;
  const W = 600, H = height, top = 10, base = H - 22, left = 30, right = W - 10;
  const max = Math.max(100, ...points.map((p) => Math.max(pct(p.eff), pct(p.plan_eff))));
  const X = (i) => left + ((right - left) * i) / Math.max(points.length - 1, 1);
  const Y = (v) => base - ((base - top) * pct(v)) / max;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      {[50, 100].map((g) => <g key={g}><line x1={left} x2={right} y1={Y(g)} y2={Y(g)} stroke="#334155" strokeDasharray="3 4" /><text x={left - 4} y={Y(g) + 3} textAnchor="end" fontSize={9} fill="#64748b">{g}%</text></g>)}
      <polyline points={points.map((p, i) => `${X(i)},${Y(p.plan_eff)}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" />
      <polyline points={points.map((p, i) => `${X(i)},${Y(p.eff)}`).join(" ")} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinejoin="round" />
      {points.map((p, i) => <g key={i}><circle cx={X(i)} cy={Y(p.eff)} r={3} fill="#34d399" /><text x={X(i)} y={Y(p.eff) - 6} textAnchor="middle" fontSize={9} fontWeight={700} fill="#e2e8f0">{num(p.eff, 1)}%</text><text x={X(i)} y={H - 6} textAnchor="middle" fontSize={9} fill="#94a3b8">day {p.day}{p.date ? " · " + String(p.date).slice(0, 6) : ""}</text></g>)}
    </svg>
  );
};

/* ── balancing ──────────────────────────────────────────────────────────── */
export const BalancingBody = ({ detail: d }) => {
  const st = d.stations || [];
  const max = Math.max(120, ...st.map((s) => pct(s.load_pct)));
  const bn = d.bottleneck || {};
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Tile label="Total SMV" value={num(d.total_smv, 2) + " min"} />
        <Tile label="Pitch" value={num(d.pitch, 3) + " min"} />
        <Tile label="Takt" value={num(d.takt, 3) + " min"} />
        <Tile label="Balance efficiency" value={num(d.balance_efficiency, 1) + "%"} tone={pct(d.balance_efficiency) >= 85 ? "text-emerald-300" : pct(d.balance_efficiency) >= 75 ? "text-amber-300" : "text-rose-300"} />
        <Tile label="Bottleneck" value={bn.no ? `station ${bn.no}` : "—"} sub={bn.operation ? `${bn.operation} · ${num(bn.smv, 3)} min` : undefined} tone="text-rose-300" />
        <Tile label="Capacity at the bottleneck" value={num(d.capacity_ph, 0) + " pcs/h"} />
      </div>
      <Panel title="Station load against the pitch" right={d.balance_source}>
        <div className="space-y-1">
          {st.map((s) => {
            const l = pct(s.load_pct);
            const tone = s.bottleneck || l >= 110 ? "bg-rose-500" : l < 85 ? "bg-amber-400" : "bg-emerald-400";
            return (
              <div key={s.no} className="grid items-center gap-x-2 text-xs" style={{ gridTemplateColumns: "1.6rem 13rem 1fr 3.4rem 5rem" }}>
                <div className="text-slate-500 tabular-nums text-right">{s.no}</div>
                <div className="truncate"><span className="text-white font-bold">{s.operation}</span><span className="text-slate-500"> · {s.machine_code} · {s.worker}</span></div>
                <div className="relative h-5 rounded bg-slate-900/70 overflow-hidden">
                  <div className={"absolute inset-y-0 left-0 rounded " + tone} style={{ width: Math.round((l / max) * 100) + "%" }} />
                  <div className="absolute inset-y-0 border-l-2 border-dashed border-white/70" style={{ left: Math.round((100 / max) * 100) + "%" }} title="pitch = 100%" />
                </div>
                <div className={"tabular-nums text-right font-bold " + (s.bottleneck || l >= 110 ? "text-rose-300" : l < 85 ? "text-amber-300" : "text-emerald-300")}>{num(l, 0)}%</div>
                <div className="text-slate-400 whitespace-nowrap">{num(s.smv, 3)} min · {num(s.capacity_ph, 0)}/h{s.bottleneck ? <span className="text-rose-300 font-bold"> · bottleneck</span> : null}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500"><span>bar = station load against the pitch (dashed line = 100%)</span><span>red ≥ 110% or the bottleneck · amber &lt; 85% under-loaded</span></div>
      </Panel>
    </div>
  );
};

/* ── productivity ───────────────────────────────────────────────────────── */
export const ProductivityBody = ({ detail: d }) => {
  const c = d.cut_sew_pack || {};
  const st = d.stations || [];
  const row = (label, v, t) => <div key={label} className="grid items-center gap-2 text-xs" style={{ gridTemplateColumns: "4rem 1fr 7rem" }}><span className="text-slate-300 font-bold">{label}</span><Bar v={t ? (v / t) * 100 : 0} tone={t && v / t >= 0.95 ? "bg-emerald-400" : t && v / t >= 0.8 ? "bg-amber-400" : t ? "bg-rose-500" : "bg-slate-600"} h="h-3.5" /><span className="tabular-nums text-right text-white font-bold">{num(v, 0)} <span className="text-slate-500 font-normal">/ {num(t, 0)}</span></span></div>;
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Tile label="Cut" value={num(c.cut, 0)} sub={"target " + num(c.cut_target, 0)} />
        <Tile label="Sewn" value={num(c.sew, 0)} sub={"target " + num(c.sew_target, 0) + (c.sew_pct ? " · " + c.sew_pct : "")} tone={pct(c.sew_pct) >= 95 ? "text-emerald-300" : pct(c.sew_pct) >= 80 ? "text-amber-300" : "text-rose-300"} />
        <Tile label="Packed" value={num(c.pack, 0)} sub={"target " + num(c.pack_target, 0)} />
        <Tile label="Efficiency" value={c.efficiency || "—"} />
        {c.downtime ? <Tile label="Downtime" value={c.downtime} tone="text-rose-300" /> : null}
        <Tile label="As of" value={c.date || d.state || "—"} />
      </div>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Panel title="Cut · sew · pack against target">
          <div className="space-y-2">{row("Cut", c.cut, c.cut_target)}{row("Sew", c.sew, c.sew_target)}{row("Pack", c.pack, c.pack_target)}</div>
        </Panel>
        <Panel title="Station output against target now">
          <div className="space-y-1 max-h-80 overflow-auto">
            {st.map((s) => <div key={s.no} className="grid items-center gap-x-2 text-xs" style={{ gridTemplateColumns: "1.6rem 11rem 1fr 3.4rem 6rem" }}><div className="text-slate-500 tabular-nums text-right">{s.no}</div><div className="truncate"><span className="text-white font-bold">{s.operation}</span><span className="text-slate-500"> · {s.worker}</span></div><Bar v={s.achievement_pct} tone={pct(s.achievement_pct) >= 95 ? "bg-emerald-400" : pct(s.achievement_pct) >= 80 ? "bg-amber-400" : "bg-rose-500"} /><div className="tabular-nums text-right font-bold text-white">{num(s.achievement_pct, 0)}%</div><div className="text-slate-400 whitespace-nowrap tabular-nums">{num(s.done, 0)} / {num(s.target_now, 0)}{s.behind ? <span className="text-rose-300"> · −{num(s.behind, 0)}</span> : null}</div></div>)}
          </div>
        </Panel>
      </div>
    </div>
  );
};

/* ── team ───────────────────────────────────────────────────────────────── */
export const TeamBody = ({ detail: d }) => {
  const t = d.team || {};
  const st = [...(d.stations || [])].sort((a, b) => pct(b.worker_efficiency_pct) - pct(a.worker_efficiency_pct));
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Tile label="Rank" value={t.rank ? <span className="inline-flex items-center gap-1"><Trophy size={14} className="text-amber-300" />#{t.rank}</span> : "—"} sub="among the lines" />
        <Tile label="Achievement" value={t.achievement || "—"} tone={pct(t.achievement) >= 100 ? "text-emerald-300" : pct(t.achievement) >= 90 ? "text-amber-300" : "text-rose-300"} sub={`${num(t.output, 0)} / ${num(t.target, 0)}`} />
        <Tile label="Efficiency" value={t.efficiency || "—"} sub={t.planned ? "planned " + t.planned : undefined} />
        <Tile label="DHU" value={t.dhu || "—"} sub={`${num(t.defects, 0)} defects`} tone={pct(t.dhu) > 3 ? "text-rose-300" : pct(t.dhu) > 2 ? "text-amber-300" : "text-emerald-300"} />
        <Tile label="Downtime" value={num(t.downtime, 0) + " min"} tone={t.downtime > 30 ? "text-rose-300" : undefined} />
        <Tile label="Days on the order" value={num(t.days, 0)} sub={t.orders} />
      </div>
      <Panel title="Workers — efficiency, DHU, achievement" right="sorted by efficiency">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <Th cols={["#", "Worker", "Grade", "Operation", "Efficiency", "vs target", "DHU", "Achievement", "Done / target", "Rejects"]} />
            <tbody>
              {st.map((s) => <tr key={s.no} className="border-t border-slate-700/60 hover:bg-slate-800/40"><td className="px-2 py-1 tabular-nums text-slate-500">{s.no}</td><td className="px-2 py-1 font-bold text-white whitespace-nowrap">{s.worker}</td><td className="px-2 py-1"><Grade g={s.worker_grade} /></td><td className="px-2 py-1 text-slate-300">{s.operation}</td><td className="px-2 py-1 tabular-nums text-right font-bold text-white">{num(s.worker_efficiency_pct, 1)}%</td><td className="px-2 py-1 w-28"><Bar v={s.worker_efficiency_pct} tone={pct(s.worker_efficiency_pct) >= 85 ? "bg-emerald-400" : pct(s.worker_efficiency_pct) >= 70 ? "bg-amber-400" : "bg-rose-500"} /></td><td className={`px-2 py-1 tabular-nums text-right ${pct(s.dhu) > 3 ? "text-rose-300 font-bold" : "text-slate-300"}`}>{num(s.dhu, 1)}%</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(s.achievement_pct, 0)}%</td><td className="px-2 py-1 tabular-nums text-right text-slate-400">{num(s.done, 0)} / {num(s.target_now, 0)}</td><td className="px-2 py-1 tabular-nums text-right text-slate-400">{num(s.rejects, 0)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};

/* ── skill ──────────────────────────────────────────────────────────────── */
export const SkillBody = ({ detail: d }) => {
  const k = d.skill || {};
  const st = d.stations || [];
  const total = k.total || st.length || 1;
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {["A", "B", "C", "newcomer"].map((g) => <Tile key={g} label={g === "newcomer" ? "Newcomers" : "Grade " + g} value={<span className="inline-flex items-center gap-2"><Grade g={g} />{num(k[g], 0)}</span>} sub={`${Math.round(((k[g] || 0) / total) * 100)}% of ${total}`} />)}
        <Tile label="Critical stations" value={num(k.critical_stations, 0)} sub={k.critical_ops} />
        <Tile label="Certified for critical ops" value={num(k.certified, 0)} sub={`${num(k.backups, 0)} backups`} tone={k.backups ? "text-emerald-300" : "text-amber-300"} />
        <Tile label="Status" value={k.status || "—"} tone={/ok/i.test(k.status || "") ? "text-emerald-300" : "text-rose-300"} />
      </div>
      <Panel title="Line mix" right="share of operators by grade">
        <div className="flex h-4 rounded overflow-hidden">{["A", "B", "C", "newcomer"].map((g) => <div key={g} className={GRADE[g].split(" ")[0]} style={{ width: ((k[g] || 0) / total) * 100 + "%" }} title={`${g}: ${k[g] || 0}`} />)}</div>
      </Panel>
      <Panel title="Stations — grade against the required grade, critical operations, multi-skill">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <Th cols={["#", "Worker", "Grade", "Required", "Operation", "Critical", "Certified critical ops", "Also able to do"]} />
            <tbody>
              {st.map((s) => {
                const order = { A: 3, B: 2, C: 1, newcomer: 0 };
                const short = (order[s.worker_grade] ?? 0) < (order[s.required_grade] ?? 0);
                return <tr key={s.no} className={`border-t border-slate-700/60 ${s.critical ? "bg-rose-500/5" : ""}`}><td className="px-2 py-1 tabular-nums text-slate-500">{s.no}</td><td className="px-2 py-1 font-bold text-white whitespace-nowrap">{s.worker}</td><td className="px-2 py-1"><Grade g={s.worker_grade} /></td><td className={`px-2 py-1 ${short ? "text-rose-300 font-bold" : "text-slate-300"}`}>{s.required_grade || "—"}{short ? " ✗" : ""}</td><td className="px-2 py-1 text-slate-300">{s.operation}<div className="text-[10px] text-slate-500">{s.grade_text}</div></td><td className="px-2 py-1">{s.critical ? <span className="inline-flex items-center gap-1 text-rose-300 font-bold"><Award size={12} />critical</span> : <span className="text-slate-600">—</span>}</td><td className="px-2 py-1 text-slate-300">{(s.certified_critical_ops || []).join(", ") || "—"}</td><td className="px-2 py-1 text-slate-400">{(s.multi_skill || []).join(", ") || "—"}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};

/* ── learning ───────────────────────────────────────────────────────────── */
export const LearningBody = ({ detail: d }) => {
  const l = d.learning || {};
  const st = d.stations || [];
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Tile label="Days on the style" value={num(l.days, 0)} sub={d.style || d.garment} />
        <Tile label="Last day" value={num(l.last_eff, 1) + "%"} sub={l.last_date} tone={pct(l.last_eff) >= pct(l.plan_today) ? "text-emerald-300" : "text-amber-300"} />
        <Tile label="Plan today" value={num(l.plan_today, 1) + "%"} />
        <Tile label="Plan at full speed" value={num(l.plan_full, 1) + "%"} />
        <Tile label="Learning days left" value={num(l.learning_days, 0)} tone={l.learning_days ? "text-amber-300" : "text-emerald-300"} />
      </div>
      <Panel title="Line efficiency day by day against the plan" right={<span className="inline-flex items-center gap-2"><span className="inline-block w-4 h-0.5 bg-emerald-400" />actual <span className="inline-block w-4 border-t border-dashed border-slate-400" />plan</span>}>
        <Curve points={l.curve} />
      </Panel>
      <LearningPlanActual line={d.line} />
      <Panel title="Stations — today against plan, and each one's curve">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <Th cols={["#", "Worker", "Grade", "Operation", "Days", "Today", "Plan", "vs plan", "Curve (eff / plan by day)"]} />
            <tbody>
              {st.map((s) => <tr key={s.no} className="border-t border-slate-700/60 hover:bg-slate-800/40"><td className="px-2 py-1 tabular-nums text-slate-500">{s.no}</td><td className="px-2 py-1 font-bold text-white whitespace-nowrap">{s.worker}</td><td className="px-2 py-1"><Grade g={s.worker_grade} /></td><td className="px-2 py-1 text-slate-300">{s.operation}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(s.days_on_style, 0)}</td><td className={`px-2 py-1 tabular-nums text-right font-bold ${pct(s.efficiency_today) >= pct(s.plan_today) ? "text-emerald-300" : "text-amber-300"}`}>{num(s.efficiency_today, 1)}%</td><td className="px-2 py-1 tabular-nums text-right text-slate-400">{num(s.plan_today, 1)}%</td><td className="px-2 py-1 w-24"><Bar v={s.efficiency_today} tone={pct(s.efficiency_today) >= pct(s.plan_today) ? "bg-emerald-400" : "bg-amber-400"} /></td><td className="px-2 py-1 text-slate-400 tabular-nums">{(s.curve || []).map((c) => `d${c.day} ${num(c.eff, 0)}/${num(c.plan_eff, 0)}`).join(" · ") || "—"}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};

/* ── learning · plan vs actual on a new style (per line and per worker) ─────────────────────────────
   {"module":"ce","view":"learning-plan-actual","line"} → rows (every line on a new run: plan_curve,
   actual_curve, cum plan / actual, achieved, status ahead | achieving | behind | "starts …", projected
   target day, days late, minutes lost, cost effect, owners), tables.by_day and tables.workers for the
   selected line, cpm. Behind = amber / red with the reason and the "notified" owner chain; the cost
   effect = minutes lost × cost per minute, so the style costs more than planned. */
const STATUS = { ahead: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", achieving: "bg-sky-500/20 text-sky-300 border-sky-500/30", behind: "bg-rose-500/20 text-rose-300 border-rose-500/30", planned: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
const Status = ({ v, tone }) => <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${tone === "red" ? STATUS.behind : tone === "orange" || tone === "amber" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : STATUS[String(v || "").split(" ")[0]] || STATUS.planned}`}>{v || "—"}</span>;
const curve = (txt) => String(txt || "").split("→").map((x) => Number(String(x).replace(/[^0-9.]/g, ""))).filter((x) => !Number.isNaN(x) && x > 0);
const PlanActual = ({ plan, actual, height = 130 }) => {
  const n = Math.max(plan.length, actual.length);
  if (!n) return null;
  const W = 600, H = height, top = 12, base = H - 22, left = 36, right = W - 12;
  const max = Math.max(1, ...plan, ...actual);
  const X = (i) => left + ((right - left) * i) / Math.max(n - 1, 1);
  const Y = (v) => base - ((base - top) * v) / max;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      {[0.5, 1].map((g) => <g key={g}><line x1={left} x2={right} y1={Y(max * g)} y2={Y(max * g)} stroke="#334155" strokeDasharray="3 4" /><text x={left - 4} y={Y(max * g) + 3} textAnchor="end" fontSize={9} fill="#64748b">{num(Math.round(max * g), 0)}</text></g>)}
      <polyline points={plan.map((v, i) => `${X(i)},${Y(v)}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" />
      {actual.length > 0 && <polyline points={actual.map((v, i) => `${X(i)},${Y(v)}`).join(" ")} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinejoin="round" />}
      {plan.map((v, i) => <g key={i}><circle cx={X(i)} cy={Y(v)} r={2.5} fill="#94a3b8" /><text x={X(i)} y={H - 6} textAnchor="middle" fontSize={9} fill="#94a3b8">day {i + 1}</text></g>)}
      {actual.map((v, i) => <g key={"a" + i}><circle cx={X(i)} cy={Y(v)} r={3.5} fill={v >= (plan[i] || 0) ? "#34d399" : v >= (plan[i] || 0) * 0.82 ? "#fbbf24" : "#f43f5e"} /><text x={X(i)} y={Y(v) - 7} textAnchor="middle" fontSize={9} fontWeight={700} fill="#e2e8f0">{num(v, 0)}</text></g>)}
    </svg>
  );
};
const LearningPlanActual = ({ line }) => {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    let live = true;
    setD(null);
    setErr("");
    fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ce", view: "learning-plan-actual", line: line || undefined }) })
      .then((r) => r.json())
      .then((j) => { if (!live) return; if (!j.ok) throw new Error(j.error || "unavailable"); setD(j); })
      .catch(() => { if (live) setErr("Plan vs actual is unavailable right now."); });
    return () => { live = false; };
  }, [line]);
  if (err) return <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{err}</div>;
  if (!d) return <div className="text-xs text-slate-500">Loading plan vs actual…</div>;
  const rows = d.rows || [];
  // only lines with a new-style run in the window are valid (the picker lists them); when the floor's line is
  // not one of them, say so rather than showing another line's data (the view falls back to its first line)
  const valid = new Set(((d.picker && d.picker.options) || rows).map((o) => o.id || o.line));
  const me = line && !valid.has(line) ? null : rows.find((r) => r.line === line) || rows.find((r) => r.line === d.line) || null;
  const tables = Object.fromEntries((d.tables || []).map((t) => [t.key, t]));
  const workers = (tables.workers && tables.workers.rows) || [];
  const byDay = ((tables.by_day && tables.by_day.rows) || []).filter((r) => !me || r.line === me.line);
  const plan = me ? curve(me.plan_curve) : [];
  const actual = me ? curve(me.actual_curve) : [];
  const behind = me && /behind/.test(me.status || "");
  const started = me && me.day_today > 0;
  const cpm = d.cpm && typeof d.cpm === "object" ? d.cpm.cpm : d.cpm;
  const sum = Object.fromEntries((d.summary || []).map((x) => [x.label, x.value]));
  return (
    <div className="grid gap-3">
      <Panel title="Plan vs actual on the new style" right={me ? `${me.order} · ${me.garment} · starts ${me.start} · ${me.per_day ? num(me.per_day, 0) + " pcs/day at full speed" : ""}` : "this line has no new run"}>
        {me ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <Tile label="Status" value={<Status v={me.status} tone={me.tone} />} />
              <Tile label="Day on the style" value={started ? `day ${me.day_today}` : "not started"} sub={`learning ${num(me.learning_days, 0)} day(s) · target from day ${me.plan_target_day}`} />
              <Tile label="Plan curve" value={plan.map((v) => num(v, 0)).join(" → ")} sub="pieces per day" />
              <Tile label="Actual so far" value={actual.length ? actual.map((v) => num(v, 0)).join(" → ") : "—"} sub={started ? `${num(me.cum_actual, 0)} of ${num(me.cum_plan, 0)} planned · ${me.achieved}` : "no day run yet"} tone={behind ? "text-rose-300" : started ? "text-emerald-300" : undefined} />
              <Tile label="Reaches target" value={`day ${me.projected_target_day}`} sub={me.days_late ? `${me.days_late} day(s) late · plan day ${me.plan_target_day}` : `on plan (${me.projection})`} tone={me.days_late ? "text-rose-300" : "text-emerald-300"} />
              <Tile label="Minutes lost" value={num(me.minutes_lost, 0)} tone={me.minutes_lost ? "text-amber-300" : undefined} />
              <Tile label="Cost effect" value={<span className="inline-flex items-center gap-1"><DollarSign size={14} />{num(me.cost_effect, 2)}</span>} sub={cpm ? `minutes lost × CPM USD ${cpm}` : "minutes lost × CPM"} tone={me.cost_effect ? "text-rose-300" : undefined} />
              <Tile label="Workers behind" value={num(me.workers_behind, 0)} tone={me.workers_behind ? "text-rose-300" : "text-emerald-300"} />
            </div>
            {behind && <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"><div className="font-bold flex items-center gap-1"><AlertTriangle size={13} />Behind the ramp — {me.achieved} of plan so far, target now projected day {me.projected_target_day} ({me.days_late} late), {num(me.minutes_lost, 0)} min lost = USD {num(me.cost_effect, 2)} more than planned</div><div className="mt-1 flex items-center gap-1 text-rose-300/90"><Bell size={12} />notified: {String(me.owners || "").split("→").map((o) => o.trim().split("·").pop().trim()).join(" · ")}</div></div>}
            {!started && <div className="text-xs text-slate-400">Nothing to compare yet — the run starts {me.start}. The plan ramps {plan.map((v) => num(v, 0)).join(" → ")} pieces a day; actual fills in day by day, ahead / achieving / behind, with the owner chain alerted when a day falls under 82% of plan.</div>}
            <div className="grid gap-3 xl:grid-cols-2">
              <div><div className="text-[11px] text-slate-500 mb-1">pieces per day — plan (dashed) against actual</div><PlanActual plan={plan} actual={actual} /></div>
              <div className="overflow-auto max-h-48">
                <table className="w-full text-xs"><Th cols={["Day", "Date", "Plan", "Actual", "Gap", "Status"]} /><tbody>{byDay.map((r, i) => <tr key={i} className={`border-t border-slate-700/60 ${r.tone === "red" ? "bg-rose-500/10" : ""}`}><td className="px-2 py-1 tabular-nums text-slate-400">{r.day}</td><td className="px-2 py-1 text-slate-300 whitespace-nowrap">{r.date}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(r.plan, 0)}</td><td className="px-2 py-1 tabular-nums text-right font-bold text-white">{r.actual === "" ? "—" : num(r.actual, 0)}</td><td className={`px-2 py-1 tabular-nums text-right ${Number(r.gap) < 0 ? "text-rose-300 font-bold" : "text-slate-400"}`}>{r.gap === "" ? "—" : num(r.gap, 0)}</td><td className="px-2 py-1"><Status v={r.status} tone={r.tone} /></td></tr>)}</tbody></table>
              </div>
            </div>
          </div>
        ) : <div className="text-xs text-slate-500">No new style on {line || "this line"} in the window — the {rows.length} lines with a new run are listed below{d.picker && d.picker.options ? ": " + d.picker.options.map((o) => o.id || o.name).join(", ") : ""}.</div>}
      </Panel>
      <Panel title="Workers — plan vs actual by day" right={workers.length ? `${workers.length} workers · behind = amber / red with the reason` : undefined}>
        {me && workers.length ? (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs"><Th cols={["Worker", "Station", "Operation", "Grade", "SMV", "Plan by day", "Actual by day", "Achieved", "Last eff", "Status", "Min lost", "Cost"]} /><tbody>{workers.map((w, i) => <tr key={i} className={`border-t border-slate-700/60 ${w.tone === "red" || /behind/.test(w.status || "") ? "bg-rose-500/10" : ""}`}><td className="px-2 py-1 font-bold text-white whitespace-nowrap">{w.worker || w.operator}</td><td className="px-2 py-1 tabular-nums text-slate-400">{w.station}</td><td className="px-2 py-1 text-slate-300">{w.operation}</td><td className="px-2 py-1"><Grade g={w.grade} /></td><td className="px-2 py-1 tabular-nums text-slate-400">{num(w.smv, 3)}</td><td className="px-2 py-1 tabular-nums text-slate-400 whitespace-nowrap">{w.plan_by_day}</td><td className="px-2 py-1 tabular-nums text-slate-200 whitespace-nowrap">{w.actual_by_day || "—"}</td><td className="px-2 py-1 tabular-nums text-right text-white font-bold">{w.achieved}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{w.last_eff}</td><td className="px-2 py-1"><Status v={w.status} tone={w.tone} /></td><td className="px-2 py-1 tabular-nums text-right text-amber-300">{num(w.minutes_lost, 0)}</td><td className="px-2 py-1 tabular-nums text-right text-rose-300">{w.cost_effect ? "USD " + num(w.cost_effect, 2) : "—"}</td></tr>)}</tbody></table>
          </div>
        ) : <div className="text-xs text-slate-500">{me && !started ? "Per-worker plan vs actual starts with the run on " + me.start + "." : me ? "No worker rows for this line." : "No new style on this line in the window."}</div>}
      </Panel>
      <Panel title="All lines on a new style" right={`${sum["New runs"] ?? rows.length} new runs · ${sum["Started"] ?? 0} started · ${sum["Behind"] ?? 0} behind · ${sum["Achieving"] ?? 0} achieving · ${sum["Ahead"] ?? 0} ahead · gap cost USD ${sum["Cost of the gap (USD)"] ?? "0.00"}`}>
        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-xs"><Th cols={["Line", "Order", "Garment", "Start", "Day", "Plan curve", "Actual", "Achieved", "Status", "Target day", "Late", "Min lost", "Cost", "Workers behind"]} /><tbody>{rows.map((r) => <tr key={r.line} className={`border-t border-slate-700/60 ${r.line === (me && me.line) ? "bg-sky-500/10" : r.tone === "red" ? "bg-rose-500/10" : ""}`}><td className="px-2 py-1 font-bold text-white">{r.line}</td><td className="px-2 py-1 text-slate-300">{r.order}</td><td className="px-2 py-1 text-slate-400">{r.garment}</td><td className="px-2 py-1 text-slate-300 whitespace-nowrap">{r.start}</td><td className="px-2 py-1 tabular-nums text-slate-400">{r.day_today || "—"}</td><td className="px-2 py-1 tabular-nums text-slate-400 whitespace-nowrap">{r.plan_curve}</td><td className="px-2 py-1 tabular-nums text-slate-200 whitespace-nowrap">{r.actual_curve || "—"}</td><td className="px-2 py-1 tabular-nums text-right text-white">{r.achieved}</td><td className="px-2 py-1"><Status v={r.status} tone={r.tone} /></td><td className="px-2 py-1 tabular-nums text-slate-300">day {r.projected_target_day}{r.plan_target_day !== r.projected_target_day ? ` (plan ${r.plan_target_day})` : ""}</td><td className={`px-2 py-1 tabular-nums text-right ${r.days_late ? "text-rose-300 font-bold" : "text-slate-500"}`}>{r.days_late || "—"}</td><td className="px-2 py-1 tabular-nums text-right text-amber-300">{r.minutes_lost || "—"}</td><td className="px-2 py-1 tabular-nums text-right text-rose-300">{r.cost_effect ? "USD " + num(r.cost_effect, 2) : "—"}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{r.workers_behind || "—"}</td></tr>)}</tbody></table>
        </div>
        <div className="mt-1 text-[10px] text-slate-500">behind = a day under 82% of plan · owners notified in order: line leader → supervisor → production manager → factory manager · cost effect = minutes lost × cost per minute{d.cpm_source ? " (" + d.cpm_source + ")" : ""}</div>
      </Panel>
    </div>
  );
};

/* ── downtime ───────────────────────────────────────────────────────────── */
export const DowntimeBody = ({ detail: d }) => {
  const k = d.downtime || {};
  const st = d.stations || [];
  const events = st.flatMap((s) => (s.events || []).map((e) => ({ ...e, no: s.no, operation: s.operation, machine: s.machine_code, worker: s.worker, state: s.state }))).sort((a, b) => (a.status === "open" ? -1 : 1) - (b.status === "open" ? -1 : 1) || String(b.time).localeCompare(String(a.time)));
  const down = st.filter((s) => s.state === "open" || s.machine_status === "DOWN");
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Tile label="Minutes lost today" value={<span className="inline-flex items-center gap-1"><Timer size={14} />{num(k.minutes_today, 0)}</span>} tone={k.minutes_today > 60 ? "text-rose-300" : k.minutes_today > 20 ? "text-amber-300" : "text-emerald-300"} />
        <Tile label="Down now" value={num(k.open_now, 0)} tone={k.open_now ? "text-rose-300" : "text-emerald-300"} sub={down.length ? down.map((s) => `station ${s.no}`).join(", ") : "all running"} />
        <Tile label="Stoppages today" value={num(k.stoppages_today, 0)} />
        <Tile label="Line stoppages" value={num((k.line_stoppages || []).length, 0)} sub={(k.line_stoppages || []).map((x) => x.cause || x).join("; ") || "none"} />
      </div>
      <Panel title="Events today" right="open ones first">
        {events.length ? (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <Th cols={["Time", "Station", "Operation", "Machine", "Kind", "Cause", "Minutes", "Mechanic", "Status"]} />
              <tbody>
                {events.map((e, i) => <tr key={i} className={`border-t border-slate-700/60 ${e.status === "open" ? "bg-rose-500/10" : "hover:bg-slate-800/40"}`}><td className="px-2 py-1 tabular-nums text-slate-300">{e.time}</td><td className="px-2 py-1 font-bold text-white">{e.no}</td><td className="px-2 py-1 text-slate-300">{e.operation}</td><td className="px-2 py-1 text-slate-400">{e.machine}</td><td className="px-2 py-1 text-slate-300">{e.kind}</td><td className="px-2 py-1 text-slate-300">{e.cause}</td><td className="px-2 py-1 tabular-nums text-right font-bold text-white">{num(e.minutes, 0)}</td><td className="px-2 py-1 text-slate-400">{e.mechanic || "—"}</td><td className="px-2 py-1">{e.status === "open" ? <span className="inline-flex items-center gap-1 text-rose-300 font-bold"><AlertTriangle size={12} />open</span> : <span className="text-emerald-300">{e.status || "fixed"}</span>}</td></tr>)}
              </tbody>
            </table>
          </div>
        ) : <div className="text-xs text-emerald-300 inline-flex items-center gap-1"><TrendingUp size={14} />No stoppages on this line today.</div>}
      </Panel>
    </div>
  );
};

// per-station figure under the worker on the drawing, per lens
export const PRODUCTION_STATION = {
  balancing: (s) => `${num(s.load_pct, 0)}% of pitch${s.bottleneck ? " · bottleneck" : ""}`,
  productivity: (s) => `${num(s.achievement_pct, 0)}% · ${num(s.done, 0)}/${num(s.target_now, 0)}`,
  team: (s) => `eff ${num(s.worker_efficiency_pct, 0)}% · DHU ${num(s.dhu, 1)}%`,
  skill: (s) => `${s.worker_grade}${s.required_grade ? " / needs " + s.required_grade : ""}${s.critical ? " · critical" : ""}`,
  learning: (s) => `day ${num(s.days_on_style, 0)} · ${num(s.efficiency_today, 0)}% vs ${num(s.plan_today, 0)}%`,
  downtime: (s) => (s.state === "open" ? "DOWN now" : (s.events || []).length ? `${(s.events || []).reduce((a, e) => a + (e.minutes || 0), 0)} min lost` : "no stoppage"),
};
// why a station is amber or red, in the lens's own terms (the floor falls back to the live reason)
export const PRODUCTION_REASON = {
  balancing: (s) => (s.bottleneck ? `bottleneck · ${num(s.load_pct, 0)}% of pitch` : pct(s.load_pct) >= 110 ? `over pitch · ${num(s.load_pct, 0)}%` : pct(s.load_pct) < 85 ? `under-loaded · ${num(s.load_pct, 0)}%` : ""),
  productivity: (s) => (pct(s.achievement_pct) < 80 ? `behind by ${num(s.behind, 0)} pcs · ${num(s.achievement_pct, 0)}%` : pct(s.achievement_pct) < 95 ? `${num(s.achievement_pct, 0)}% of target · ${num(s.behind, 0)} behind` : ""),
  team: (s) => (pct(s.worker_efficiency_pct) < 70 ? `low efficiency ${num(s.worker_efficiency_pct, 0)}%` : pct(s.dhu) > 3 ? `DHU ${num(s.dhu, 1)}% — defects` : ""),
  skill: (s) => { const o = { A: 3, B: 2, C: 1, newcomer: 0 }; return (o[s.worker_grade] ?? 0) < (o[s.required_grade] ?? 0) ? `grade ${s.worker_grade} on a ${s.required_grade} operation` : s.critical && !(s.certified_critical_ops || []).length ? "critical op · not certified" : ""; },
  learning: (s) => (pct(s.efficiency_today) < pct(s.plan_today) - 5 ? `below plan · ${num(s.efficiency_today, 0)}% vs ${num(s.plan_today, 0)}%` : ""),
  downtime: (s) => { const o = (s.events || []).find((e) => e.status === "open"); if (o) return `down now · ${o.cause}${o.mechanic ? " · " + o.mechanic : ""}`; const m = (s.events || []).reduce((a, e) => a + (e.minutes || 0), 0); return m ? `${m} min lost · ${(s.events || []).map((e) => e.cause).join("; ")}` : ""; },
};
export const PRODUCTION_LENS_BODIES = { balancing: BalancingBody, productivity: ProductivityBody, team: TeamBody, skill: SkillBody, learning: LearningBody, downtime: DowntimeBody };
export const PRODUCTION_LENSES = [
  { lens: "balancing", view: "line-balancing", title: "Line Balancing", sub: "station load against the pitch, the bottleneck" },
  { lens: "productivity", view: "productivity", title: "Cut, Sew, Pack Productivity", sub: "cut / sew / pack against target today" },
  { lens: "team", view: "team-performance", title: "Team Performance", sub: "efficiency, DHU, achievement per worker" },
  { lens: "skill", view: "skill-inventory", title: "Skill Inventory", sub: "grades, critical operations, line mix" },
  { lens: "learning", view: "learning-curve", title: "Learning Curve", sub: "day n on the style, curve against plan" },
  { lens: "downtime", view: "downtimes", title: "Downtimes", sub: "minutes lost, events, down now" },
];
export default PRODUCTION_LENS_BODIES;
