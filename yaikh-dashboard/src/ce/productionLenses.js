// CE · the Production column's six lenses on the shared floor — the per-line DETAIL bodies and the
// per-station figure each lens writes under the worker on the drawing:
//   balancing    — load % against the pitch per station, the bottleneck red, line balance efficiency
//   productivity — the line's cut / sew / pack against target today, station output %
//   team         — efficiency, DHU and achievement per worker, the line's rank and month to date
//   skill        — grade A / B / C / newcomer, required grade, certified critical operations, line mix
//   learning     — day n on the style, line and station curve against plan
//   downtime     — minutes lost, the events (cause, mechanic, open / fixed), red if down now
// Data: {"module":"ce","view":"floor","lens":<lens>,"line":<line>} → detail (keys read below).
import React from "react";
import { AlertTriangle, Trophy, Award, TrendingUp, Timer } from "lucide-react";

const num = (v, d = 1) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: d }) : v === null || v === undefined || v === "" ? "—" : String(v));
const pct = (v) => (typeof v === "number" ? v : Number(String(v || "").replace("%", "")) || 0);
const H = ({ children, right }) => <div className="flex items-baseline justify-between gap-2 mb-1.5"><div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{children}</div>{right && <div className="text-[11px] text-slate-500">{right}</div>}</div>;
const Panel = ({ title, right, children, className }) => <section className={`rounded-xl border border-slate-700 bg-slate-800/40 p-3 min-w-0 ${className || ""}`}><H right={right}>{title}</H>{children}</section>;
const Tile = ({ label, value, tone, sub }) => <div className="rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className={`font-black tabular-nums text-base leading-tight ${tone || "text-white"}`}>{value}</div>{sub && <div className="text-[10px] text-slate-500">{sub}</div>}</div>;
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
            <Th cols={["#", "Worker", "Grade", "Operation", "Efficiency", "", "DHU", "Achievement", "Done / target", "Rejects"]} />
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
      <Panel title="Stations — today against plan, and each one's curve">
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <Th cols={["#", "Worker", "Grade", "Operation", "Days", "Today", "Plan", "", "Curve (eff / plan by day)"]} />
            <tbody>
              {st.map((s) => <tr key={s.no} className="border-t border-slate-700/60 hover:bg-slate-800/40"><td className="px-2 py-1 tabular-nums text-slate-500">{s.no}</td><td className="px-2 py-1 font-bold text-white whitespace-nowrap">{s.worker}</td><td className="px-2 py-1"><Grade g={s.worker_grade} /></td><td className="px-2 py-1 text-slate-300">{s.operation}</td><td className="px-2 py-1 tabular-nums text-right text-slate-300">{num(s.days_on_style, 0)}</td><td className={`px-2 py-1 tabular-nums text-right font-bold ${pct(s.efficiency_today) >= pct(s.plan_today) ? "text-emerald-300" : "text-amber-300"}`}>{num(s.efficiency_today, 1)}%</td><td className="px-2 py-1 tabular-nums text-right text-slate-400">{num(s.plan_today, 1)}%</td><td className="px-2 py-1 w-24"><Bar v={s.efficiency_today} tone={pct(s.efficiency_today) >= pct(s.plan_today) ? "bg-emerald-400" : "bg-amber-400"} /></td><td className="px-2 py-1 text-slate-400 tabular-nums">{(s.curve || []).map((c) => `d${c.day} ${num(c.eff, 0)}/${num(c.plan_eff, 0)}`).join(" · ") || "—"}</td></tr>)}
            </tbody>
          </table>
        </div>
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
