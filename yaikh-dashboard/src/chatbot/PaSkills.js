// The department PA's four skills, fed by the M1: POST /api/m1/pa/skills
// {pa}. Red-bubble ALERTS on top (replacing the old fixed chips + counts),
// REMINDERS under them, then FORECASTS as text or a small chart. Free-form
// questions still go through the normal ask box (/api/ai-chat/<pa>).
// Shared by every department PA; an empty department shows a calm state.
import React, { useCallback, useEffect, useState } from "react";
import { RefreshCw, CheckCircle2, Bell, CalendarDays, TrendingUp, TrendingDown, Minus } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

export const usePaSkills = (pa) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    if (!pa) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/pa/skills`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pa }) });
      const j = await r.json();
      setData(r.ok && j && j.ok ? j : null);
    } catch (e) { setData(null); }
    finally { setLoading(false); }
  }, [pa]);
  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, [load]);
  const act = useCallback(async (taskId, action) => {
    try {
      await fetch(`${API}/pa/skills`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pa, task_id: taskId, action, by: "boss" }) });
    } catch (e) { /* refetch shows the truth either way */ }
    load();
  }, [pa, load]);
  return [data, loading, load, act];
};

const REMIND_ICON = { meeting: "📅", training: "🎓", question: "❓", deadline: "⏰" };
const Trend = ({ t }) => (t === "up" ? <TrendingUp size={12} className="text-emerald-500" /> : t === "down" ? <TrendingDown size={12} className="text-rose-500" /> : t === "flat" ? <Minus size={12} className="text-gray-400" /> : null);

const MiniChart = ({ chart }) => {
  if (!chart || !Array.isArray(chart.y) || chart.y.length === 0) return null;
  const W = 220, H = 48, n = chart.y.length;
  const max = Math.max(...chart.y, 0.0001);
  const bw = W / n;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[240px] mt-1">
      {chart.type === "line" ? (
        <polyline fill="none" stroke="#059669" strokeWidth="2" points={chart.y.map((v, i) => `${i * bw + bw / 2},${H - 4 - (v / max) * (H - 10)}`).join(" ")} />
      ) : (
        chart.y.map((v, i) => <rect key={i} x={i * bw + 1.5} y={H - 4 - (v / max) * (H - 10)} width={bw - 3} height={(v / max) * (H - 10)} rx={1.5} fill="#059669" opacity={0.85} />)
      )}
    </svg>
  );
};

const PaSkills = ({ data, loading, onRefresh, onOpenLink, onTaskAction }) => {
  const [showAll, setShowAll] = useState(false);
  if (!data) return null;
  const alerts = [...(data.alerts || [])].sort((a, b) => (a.severity === "red" ? -1 : 1) - (b.severity === "red" ? -1 : 1));
  const shown = showAll ? alerts.slice(0, 20) : alerts.slice(0, 6);
  const reminders = (data.reminders || []).slice(0, 5);
  const forecasts = (data.forecasts || []).slice(0, 4);
  const tasks = (data.tasks || []).slice(0, 12);
  const empty = tasks.length === 0 && alerts.length === 0 && reminders.length === 0 && forecasts.length === 0;
  const go = (link) => { if (link && onOpenLink) onOpenLink(link); };

  return (
    <div className="mt-3 space-y-3 text-left">
      <div className="flex items-center gap-2">
        <span className="relative inline-flex">
          <Bell size={15} className="text-gray-500" />
          {data.badge > 0 && <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black leading-4 text-center">{data.badge}</span>}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500 flex-1">Watching your department{data.simulated ? " · simulated" : ""}</span>
        <button onClick={onRefresh} className="p-1 rounded hover:bg-black/10" title="Refresh"><RefreshCw size={12} className={loading ? "animate-spin text-gray-500" : "text-gray-500"} /></button>
      </div>

      {empty && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-xs text-emerald-700">
          <CheckCircle2 size={15} /> Nothing needs attention right now — all clear.
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Tasks &amp; approvals{data.approvals_count != null && <span className="rounded-full bg-rose-600 text-white px-1.5 leading-4 text-[9px] font-black">{data.approvals_count}</span>}</div>
          {tasks.map((tk) => (
            <div key={tk.id} className="rounded-lg px-2.5 py-2 bg-white border border-gray-200 text-[11px] leading-snug">
              <div className="flex items-start gap-2">
                <span className={`mt-1 inline-block w-2 h-2 rounded-full flex-shrink-0 ${tk.priority === "high" ? "bg-rose-500 animate-pulse" : "bg-sky-400"}`} />
                <span className="flex-1 text-gray-800 font-semibold">{tk.title}</span>
                {tk.ref && <button onClick={() => go(tk.link)} className="flex-shrink-0 rounded bg-gray-100 border border-gray-200 text-[9px] font-bold px-1.5 leading-4 hover:bg-gray-200">{tk.ref}</button>}
              </div>
              <div className="pl-4 text-[10px] text-gray-500 mt-0.5">
                {tk.from && <>from {tk.from} · </>}{tk.since && <>since {tk.since} · </>}{tk.due && <>due {tk.due}</>}
                {tk.blocks && <div className="text-amber-700">blocks {tk.blocks}</div>}
              </div>
              {Array.isArray(tk.actions) && tk.actions.length > 0 && onTaskAction && (
                <div className="pl-4 mt-1 flex gap-1.5">
                  {tk.actions.includes("approve") && <button onClick={() => onTaskAction(tk.id, "approve")} className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5">Approve</button>}
                  {tk.actions.includes("reject") && <button onClick={() => onTaskAction(tk.id, "reject")} className="rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2.5 py-0.5">Reject</button>}
                  {tk.actions.includes("done") && <button onClick={() => onTaskAction(tk.id, "done")} className="rounded-md bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold px-2.5 py-0.5">Done</button>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {shown.length > 0 && (
        <div className="space-y-1">
          {shown.map((a) => (
            <button key={a.id} onClick={() => go(a.link)} className={`w-full text-left flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[11px] leading-snug border ${a.severity === "red" ? "bg-rose-50 border-rose-200 hover:bg-rose-100" : "bg-amber-50 border-amber-200 hover:bg-amber-100"}`}>
              <span className={`mt-1 inline-block w-2 h-2 rounded-full flex-shrink-0 ${a.severity === "red" ? "bg-rose-500 animate-pulse" : "bg-amber-400"}`} />
              <span className="flex-1 text-gray-800">{a.label}</span>
              {a.count > 1 && <span className="flex-shrink-0 rounded-full bg-white/80 border border-gray-200 text-[9px] font-bold px-1.5 leading-4">{a.count}</span>}
            </button>
          ))}
          {alerts.length > 6 && (
            <button onClick={() => setShowAll(!showAll)} className="text-[10px] font-bold text-gray-500 hover:text-gray-700 px-2">{showAll ? "show less" : `+${alerts.length - 6} more`}</button>
          )}
        </div>
      )}

      {reminders.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-gray-400"><CalendarDays size={11} /> Reminders</div>
          {reminders.map((r) => (
            <button key={r.id} onClick={() => go(r.link)} className="w-full text-left flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[11px] leading-snug bg-sky-50 border border-sky-200 hover:bg-sky-100">
              <span className="flex-shrink-0">{REMIND_ICON[r.type] || "🔔"}</span>
              <span className="flex-1 text-gray-800">{r.title}</span>
              <span className="flex-shrink-0 text-[10px] text-gray-500 whitespace-nowrap">{r.when}{r.time ? ` · ${r.time}` : ""}</span>
            </button>
          ))}
        </div>
      )}

      {forecasts.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-gray-400"><TrendingUp size={11} /> Forecast</div>
          {forecasts.map((f) => (
            <button key={f.id} onClick={() => go(f.link)} className="w-full text-left rounded-lg px-2.5 py-1.5 bg-white/70 border border-gray-200 hover:bg-white">
              <div className="flex items-baseline gap-1.5 text-[11px]">
                {f.value != null && <span className="font-black text-gray-800">{typeof f.value === "number" ? f.value.toLocaleString() : f.value}{f.unit ? ` ${f.unit}` : ""}</span>}
                <Trend t={f.trend} />
                <span className="text-gray-600 flex-1 leading-snug">{f.text}</span>
              </div>
              <MiniChart chart={f.chart} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaSkills;
