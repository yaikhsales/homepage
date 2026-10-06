import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getSkills } from "../chatbot/gemini-api";
import ChartAsk from "../chatbot/ChartAsk";

/* Management Dashboard — the GM's single screen (Big Brain's own module,
 * Management Dashboard → Dashboard). Everything comes from the 14 PAs'
 * skills feed (POST /api/m1/pa/skills {pa:"all"} — plain data, no Claude):
 *  - forecasts as KPI cards with a mini chart,
 *  - one tile per department with its red / amber alerts and today's
 *    reminders (click → filter),
 *  - the alert list (red first) and today's reminders.
 * Every item links to the screen where it is handled. */

const DEPTS = [
  ["4dp", "4DP · Planning", "#f472b6", "/dashboard/4dp/master-plan"],
  ["ypi", "YPI · Merchandising", "#60a5fa", "/dashboard/ypi/techpack"],
  ["mrp", "MRP · Materials", "#fbbf24", "/dashboard/mrp/board"],
  ["fc", "FC · Fabric Center", "#a78bfa", "/dashboard/fc/warehouse-tracking"],
  ["ce", "CE · IE", "#22d3ee", "/dashboard/ce"],
  ["production", "Production", "#fb923c", "/dashboard/ywip"],
  ["qa", "Quality · QMS", "#fb7185", "/dashboard/yqms/dashboard"],
  ["ytm", "YTM · Maintenance", "#facc15", "/dashboard/ytm"],
  ["hr", "HR", "#34d399", "/dashboard/yhr"],
  ["admin", "Admin", "#cbd5e1", "/dashboard/ticket"],
  ["csr", "CSR", "#4ade80", "/dashboard/audit-plan"],
  ["shipping", "Shipping", "#2dd4bf", "/dashboard/shipping/request"],
  ["accounting", "Accounting", "#a3e635", "/dashboard/payroll"],
].map(([slug, label, color, hub]) => ({ slug, label, color, hub }));
const DEPT = Object.fromEntries(DEPTS.map((d) => [d.slug, d]));
const deptOf = (slug) => DEPT[slug] || { slug, label: String(slug || "").toUpperCase(), color: "#94a3b8", hub: null };

const fmt = (v) => (typeof v === "number" ? (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString() : String(v)) : String(v ?? "—"));
// Local calendar date (not UTC — at 04:35 in Phnom Penh UTC is still yesterday).
const localISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

function MiniChart({ chart, color }) {
  if (!chart || !Array.isArray(chart.y) || chart.y.length < 2) return null;
  const W = 220, H = 46, ys = chart.y.map(Number), max = Math.max(...ys, 1), min = Math.min(0, ...ys);
  const sx = (i) => (i / (ys.length - 1)) * (W - 4) + 2, sy = (v) => H - 4 - ((v - min) / (max - min || 1)) * (H - 8);
  if (chart.type === "line") {
    const d = ys.map((v, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(" ");
    return <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="mt-2"><path d={d} fill="none" stroke={color} strokeWidth="2" /></svg>;
  }
  const bw = (W - 4) / ys.length;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="mt-2">
      {ys.map((v, i) => <rect key={i} x={2 + i * bw + 1} y={sy(v)} width={Math.max(bw - 2, 1)} height={H - 4 - sy(v)} rx="1.5" fill={color} opacity="0.8" />)}
    </svg>
  );
}

const ManagementDashboard = ({ onBack }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const load = () => { setLoading(true); getSkills("all").then((d) => setData(d)).finally(() => setLoading(false)); };
  useEffect(() => { load(); const t = setInterval(load, 120000); return () => clearInterval(t); }, []);

  const alerts = useMemo(() => (data?.alerts || []).slice().sort((a, b) => (a.severity === "red" ? 0 : 1) - (b.severity === "red" ? 0 : 1)), [data]);
  const reminders = data?.reminders || [];
  const forecasts = data?.forecasts || [];
  // the factory's own date from the feed (as_of carries +07:00), else this device's local date
  const today = (data?.as_of && /^\d{4}-\d{2}-\d{2}/.test(data.as_of)) ? data.as_of.slice(0, 10) : localISO();

  const byDept = useMemo(() => {
    const m = {};
    DEPTS.forEach((d) => { m[d.slug] = { red: 0, amber: 0, rem: 0, top: null }; });
    alerts.forEach((a) => {
      const x = m[a.dept] || (m[a.dept] = { red: 0, amber: 0, rem: 0, top: null });
      if (a.severity === "red") x.red += 1; else x.amber += 1;
      if (!x.top) x.top = a;
    });
    reminders.forEach((r) => { if (!r.when || r.when <= today) { const x = m[r.dept] || (m[r.dept] = { red: 0, amber: 0, rem: 0, top: null }); x.rem += 1; } });
    return m;
  }, [alerts, reminders, today]);

  const red = alerts.filter((a) => a.severity === "red").length;
  const amber = alerts.length - red;
  const remToday = reminders.filter((r) => !r.when || r.when <= today);
  const shownAlerts = alerts.filter((a) => !dept || a.dept === dept);
  const shownRem = remToday.filter((r) => !dept || r.dept === dept);
  const go = (link) => { if (link) navigate(link); };
  const asOf = data?.as_of ? new Date(data.as_of).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

  return (
    // pt-20 clears the fixed agent bar that floats under the header
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-20 pb-10">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-white/10" aria-label="Back"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <div className="font-bold text-lg leading-tight">Management Dashboard · GM</div>
          <div className="text-xs text-slate-400">The whole factory on one screen, live from the 14 PAs{asOf ? ` · as of ${asOf}` : ""}{data?.simulated ? " · simulated factory" : ""}</div>
        </div>
        <button onClick={load} className="p-2 rounded-lg hover:bg-white/10" title="Refresh"><RefreshCw size={16} className={loading ? "animate-spin text-slate-400" : "text-slate-300"} /></button>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* headline numbers */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ["Red alerts", red, "text-rose-400"],
            ["Amber alerts", amber, "text-amber-300"],
            ["Waiting approvals", data?.approvals_count ?? "—", "text-sky-300"],
            ["Open tasks", data?.tasks_count ?? "—", "text-slate-200"],
            ["Reminders today", remToday.length, "text-emerald-300"],
          ].map(([label, v, cls]) => (
            <div key={label} className="rounded-xl bg-slate-800 border border-white/10 px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
              <div className={`text-3xl font-bold ${cls}`}>{fmt(v)}</div>
            </div>
          ))}
        </div>

        {/* charts on demand from the PAs */}
        <ChartAsk storageKey="yai-charts-gm" dark />

        {/* departments */}
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-sm font-semibold">Departments</div>
            <div className="text-xs text-slate-500">{dept ? <>Showing {deptOf(dept).label} · <button className="underline" onClick={() => setDept(null)}>show all</button></> : "click a department to filter"}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
            {DEPTS.map((d) => {
              const x = byDept[d.slug] || {};
              const on = dept === d.slug;
              return (
                <button key={d.slug} onClick={() => setDept(on ? null : d.slug)} className="text-left rounded-xl p-3 border transition hover:brightness-125"
                  style={{ background: on ? `${d.color}26` : "#1e293b", borderColor: on ? d.color : "rgba(255,255,255,0.08)", borderLeft: `4px solid ${d.color}` }}>
                  <div className="text-xs font-bold truncate" style={{ color: d.color }}>{d.label}</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-rose-400">{x.red || 0}</span>
                    <span className="text-sm font-semibold text-amber-300">{x.amber || 0}</span>
                    <span className="text-[11px] text-slate-400 ml-auto">{x.rem || 0} today</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 mt-1 leading-snug" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {x.top ? x.top.label : "All clear"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* forecasts */}
        <div>
          <div className="text-sm font-semibold mb-2">Forecasts</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {forecasts.filter((f) => !dept || f.dept === dept).map((f) => {
              const d = deptOf(f.dept);
              const Trend = f.trend === "up" ? TrendingUp : f.trend === "down" ? TrendingDown : Minus;
              return (
                <button key={f.id} onClick={() => go(f.link || d.hub)} className="text-left rounded-xl bg-slate-800 border border-white/10 p-3 hover:bg-slate-700/70">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: d.color }}>{d.label}</span>
                    {f.trend && <Trend size={13} className="ml-auto text-slate-400" />}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">{f.metric}</div>
                  <div className="text-2xl font-bold mt-0.5">{fmt(f.value)} <span className="text-xs font-normal text-slate-400">{f.unit}</span></div>
                  {f.text && <div className="text-[11px] text-slate-400 mt-1 leading-snug">{f.text}</div>}
                  <MiniChart chart={f.chart} color={d.color} />
                </button>
              );
            })}
            {forecasts.filter((f) => !dept || f.dept === dept).length === 0 && <div className="text-xs text-slate-500">No forecasts for this department yet.</div>}
          </div>
        </div>

        {/* alerts + reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-sm font-semibold">Alerts</div>
              <div className="text-xs text-slate-500">{shownAlerts.length} · red first</div>
            </div>
            <div className="space-y-1.5">
              {(showAll ? shownAlerts : shownAlerts.slice(0, 25)).map((a) => {
                const d = deptOf(a.dept);
                return (
                  <button key={a.id} onClick={() => go(a.link || d.hub)} className="w-full text-left flex items-start gap-2 rounded-lg bg-slate-800/70 border border-white/5 px-3 py-2 hover:bg-slate-700/70">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${a.severity === "red" ? "bg-rose-500" : "bg-amber-400"}`} />
                    <span className="text-[13px] text-slate-200 flex-1">{a.label}</span>
                    <span className="text-[10px] font-bold flex-shrink-0" style={{ color: d.color }}>{d.label.split(" ·")[0]}</span>
                  </button>
                );
              })}
              {shownAlerts.length > 25 && (
                <button onClick={() => setShowAll((v) => !v)} className="w-full text-center text-xs text-slate-400 py-1.5 hover:text-slate-200">
                  {showAll ? "Show fewer" : `+ ${shownAlerts.length - 25} more`}
                </button>
              )}
              {shownAlerts.length === 0 && <div className="text-xs text-slate-500">No alerts.</div>}
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-sm font-semibold">Today</div>
              <div className="text-xs text-slate-500">meetings, trainings, questions, deadlines</div>
            </div>
            {["morning", "afternoon", null].map((slot) => {
              const list = shownRem.filter((r) => (slot ? r.time === slot : !r.time || (r.time !== "morning" && r.time !== "afternoon")));
              if (!list.length) return null;
              return (
                <div key={slot || "any"} className="mb-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{slot || "any time"}</div>
                  <div className="space-y-1.5">
                    {list.slice(0, 20).map((r) => {
                      const d = deptOf(r.dept);
                      return (
                        <button key={r.id} onClick={() => go(r.link || d.hub)} className="w-full text-left rounded-lg bg-slate-800/70 border border-white/5 px-3 py-2 hover:bg-slate-700/70">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wide text-slate-400">{r.type}</span>
                            <span className="text-[10px] font-bold ml-auto" style={{ color: d.color }}>{d.label.split(" ·")[0]}</span>
                          </div>
                          <div className="text-[13px] text-slate-200">{r.title}</div>
                          {r.from && <div className="text-[11px] text-slate-400">from {r.from}</div>}
                        </button>
                      );
                    })}
                    {list.length > 20 && <div className="text-[11px] text-slate-500 text-center">+ {list.length - 20} more</div>}
                  </div>
                </div>
              );
            })}
            {shownRem.length === 0 && <div className="text-xs text-slate-500">Nothing scheduled.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
