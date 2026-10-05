// 4DP workspace — topics on the left, Gantt chart on the right.
// Data: the simulated factory on the M1 (POST /api/m1/sim/view, module "4dp",
// gantt: true). Each topic returns a table plus a Gantt description:
//   { start, end, today, legend[], rows[{ label, sub, header?, bars[], markers[] }] }
// The chart is drawn with plain positioned divs — no chart library.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, LayoutDashboard, Building, ClipboardCheck, Layers, MonitorPlay,
  ChevronLeft, ChevronRight, RefreshCw, Search, Maximize, Table2,
} from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

const TOPICS = [
  { id: "master-plan", label: "Master Plan", hint: "Orders handed to each factory", icon: LayoutDashboard, monthly: true },
  { id: "unit-plan", label: "Unit Plan", hint: "Factory plan, by department", icon: Building, monthly: true, factory: "F1" },
  { id: "line-plan-ta", label: "Section Plan", hint: "One order: cutting, sewing, finishing by lot", icon: ClipboardCheck, monthly: true, factory: "F1", noAll: true, orders: true },
  { id: "line-plan", label: "Line Plan", hint: "Sewing lines — click one for live", icon: Layers, monthly: true, factory: "" },
  { id: "mrp-tv", label: "MRP TV", hint: "Deliveries on the way", icon: MonitorPlay, wall: true },
  { id: "tec-tv", label: "TEC TV", hint: "Technical readiness", icon: MonitorPlay, wall: true },
];

const BAR = {
  slate: "bg-slate-500/70 text-white",
  amber: "bg-amber-500 text-slate-900",
  emerald: "bg-emerald-500 text-slate-900",
  violet: "bg-violet-500 text-white",
  sky: "bg-sky-500 text-slate-900",
  teal: "bg-teal-400 text-slate-900",
  rose: "bg-rose-500 text-white",
  orange: "bg-orange-500 text-slate-900",
};
const DOT = {
  sky: "bg-sky-400", teal: "bg-teal-300", violet: "bg-violet-400", amber: "bg-amber-400",
  rose: "bg-rose-400", orange: "bg-orange-400", emerald: "bg-emerald-400", slate: "bg-slate-300",
};
const chip = (v) => {
  const s = String(v || "").toLowerCase();
  if (/received|complete|correct|ready|shipped|has room|finished|done/.test(s)) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (/at sea|road|truck|progress|today|sewing|cutting|on track|busy|running/.test(s)) return "bg-sky-500/20 text-sky-300 border-sky-500/30";
  if (/customs|pending|check|await|tomorrow|prepar|waiting|full/.test(s)) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-slate-500/20 text-slate-300 border-slate-500/30";
};
const CHIP_COLS = new Set(["status", "result", "day", "handover"]);

const DAY_MS = 86400000;
const toDate = (iso) => new Date(iso + "T00:00:00");
const dayDiff = (a, b) => Math.round((toDate(b) - toDate(a)) / DAY_MS);
const fmtNum = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v === null || v === undefined ? "" : String(v));
const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; };
const shiftMonth = (m, by) => { const d = new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)) - 1 + by, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; };

const LABEL_W = 250;
const ROW_H = 30;

function Gantt({ g, filter, onLine }) {
  const days = useMemo(() => {
    if (!g) return [];
    const n = dayDiff(g.start, g.end) + 1;
    const s = toDate(g.start);
    return Array.from({ length: Math.max(n, 1) }, (_, i) => new Date(s.getTime() + i * DAY_MS));
  }, [g]);
  if (!g) return null;
  const dayW = days.length <= 35 ? 30 : days.length <= 50 ? 24 : 18;
  const width = days.length * dayW;
  const todayX = dayDiff(g.start, g.today) * dayW;
  const f = (filter || "").trim().toLowerCase();
  const rows = f ? g.rows.filter((r) => r.header || `${r.label} ${r.sub} ${r.bars.map((b) => b.label).join(" ")}`.toLowerCase().includes(f)) : g.rows;
  const months = [];
  days.forEach((d, i) => {
    const key = d.toLocaleString("en-US", { month: "long", year: "numeric" });
    if (!months.length || months[months.length - 1].key !== key) months.push({ key, from: i, n: 1 });
    else months[months.length - 1].n += 1;
  });

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-auto" style={{ maxHeight: "calc(100vh - 330px)" }}>
      <div style={{ width: LABEL_W + width, minWidth: "100%" }}>
        {/* header: months + days */}
        <div className="sticky top-0 z-20 flex bg-slate-800 border-b border-slate-700">
          <div className="sticky left-0 z-30 bg-slate-800 border-r border-slate-700 flex items-end px-3 pb-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold" style={{ width: LABEL_W, minWidth: LABEL_W }}>
            {g.caption || `${rows.filter((r) => !r.header).length} rows`}
          </div>
          <div style={{ width }}>
            <div className="flex">
              {months.map((m) => (
                <div key={m.key} className="text-xs font-bold text-slate-200 px-2 py-1 border-r border-slate-700 truncate" style={{ width: m.n * dayW }}>{m.key}</div>
              ))}
            </div>
            <div className="flex">
              {days.map((d, i) => (
                <div key={i} className={`text-center text-[10px] leading-5 border-r border-slate-700/60 ${d.getDay() === 0 ? "bg-slate-700/60 text-slate-500" : "text-slate-400"} ${i * dayW === todayX ? "!bg-orange-500 !text-slate-900 font-bold" : ""}`} style={{ width: dayW }}>
                  {d.getDate()}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* rows */}
        <div className="relative">
          {todayX >= 0 && todayX <= width && (
            <div className="absolute top-0 bottom-0 z-10 pointer-events-none border-l-2 border-orange-400/80" style={{ left: LABEL_W + todayX + dayW / 2 }} />
          )}
          {rows.map((r, idx) => (
            <div key={`${r.label}-${idx}`} className={`flex border-b border-slate-700/50 ${r.header ? "bg-slate-700/50" : "hover:bg-slate-700/30"}`} style={{ height: ROW_H }}>
              <div className={`sticky left-0 z-10 border-r border-slate-700 px-3 flex items-center gap-2 overflow-hidden ${r.header ? "bg-slate-700" : "bg-slate-800"}`} style={{ width: LABEL_W, minWidth: LABEL_W }} title={`${r.label} — ${r.sub || ""}`}>
                {r.line && onLine ? (
                  <button onClick={() => onLine(r.line)} className="font-bold whitespace-nowrap text-xs text-sky-300 hover:text-white underline underline-offset-2">{r.label}</button>
                ) : (
                  <span className={`font-bold whitespace-nowrap ${r.header ? "text-emerald-300 text-sm" : "text-white text-xs"}`}>{r.label}</span>
                )}
                <span className="text-[11px] text-slate-400 truncate">{r.sub}</span>
              </div>
              <div className="relative" style={{ width, backgroundImage: "linear-gradient(to right, rgba(51,65,85,0.45) 1px, transparent 1px)", backgroundSize: `${dayW}px 100%` }}>
                {r.bars.map((b, i) => {
                  const from = Math.max(dayDiff(g.start, b.from), 0);
                  const to = Math.min(dayDiff(g.start, b.to), days.length - 1);
                  if (to < 0 || from > days.length - 1 || to < from) return null;
                  return (
                    <div key={i} title={`${b.title} · ${b.from} → ${b.to}`} className={`absolute top-1 rounded-md px-1.5 text-[10px] font-semibold leading-[22px] truncate shadow ${BAR[b.tone] || BAR.slate}`} style={{ left: from * dayW + 1, width: (to - from + 1) * dayW - 2, height: ROW_H - 8 }}>
                      {b.label}
                    </div>
                  );
                })}
                {r.markers.map((m, i) => {
                  const x = dayDiff(g.start, m.date);
                  if (x < 0 || x > days.length - 1) return null;
                  return (
                    <div key={`m${i}`} title={`${m.label} · ${m.date}`} className={`absolute rotate-45 border border-slate-900 ${DOT[m.tone] || DOT.rose} ${m.done === false ? "opacity-60" : ""}`} style={{ left: x * dayW + dayW / 2 - 5, top: ROW_H / 2 - 5, width: 10, height: 10 }} />
                  );
                })}
              </div>
            </div>
          ))}
          {rows.length === 0 && <div className="px-4 py-10 text-center text-slate-500">Nothing to show.</div>}
        </div>
      </div>
    </div>
  );
}

const FourDP = ({ onBack }) => {
  const { view: routeView } = useParams();
  const navigate = useNavigate();
  const view = TOPICS.some((t) => t.id === routeView) ? routeView : "master-plan";
  const topic = TOPICS.find((t) => t.id === view);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [month, setMonth] = useState(thisMonth());
  const [showTable, setShowTable] = useState(false);
  const [factory, setFactory] = useState(null); // null = topic default
  const [order, setOrder] = useState("");
  const fac = factory === null ? (topic.factory || "") : factory;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}/sim/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "4dp", view, gantt: true, month: topic.monthly ? month : undefined, factory: topic.factory !== undefined ? fac : undefined, order: topic.orders ? order : undefined }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "unavailable");
      setData(j);
    } catch (e) {
      setError("4DP data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [view, month, topic.monthly, topic.factory, topic.orders, fac, order]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setData(null); setOrder(""); setFactory(null); }, [view]);
  useEffect(() => {
    if (!topic.wall) return undefined;
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [topic.wall, load]);

  const tableRows = useMemo(() => {
    const all = (data && data.rows) || [];
    const s = q.trim().toLowerCase();
    return s ? all.filter((r) => Object.values(r).join(" ").toLowerCase().includes(s)) : all;
  }, [data, q]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-6 pt-28 font-sans">
      <div className="flex gap-4 items-start">
        {/* LEFT — topics */}
        <aside className="w-60 flex-shrink-0 rounded-2xl border border-slate-700 bg-slate-800/60 p-3 sticky top-28">
          <nav className="flex flex-col gap-1">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              const on = t.id === view;
              return (
                <button key={t.id} onClick={() => navigate(`/dashboard/4dp/${t.id}`)} className={`flex items-center gap-3 text-left rounded-xl px-3 py-2.5 transition-colors ${on ? "bg-emerald-500/20 border border-emerald-500/40 text-white" : "border border-transparent hover:bg-slate-700/60 text-slate-300"}`}>
                  <Icon size={18} className={on ? "text-emerald-300" : "text-slate-400"} />
                  <span>
                    <span className="block text-sm font-bold leading-tight">{t.label}</span>
                    <span className="block text-[11px] text-slate-400 leading-tight">{t.hint}</span>
                  </span>
                </button>
              );
            })}
          </nav>
          <p className="mt-3 px-1 text-[10px] text-slate-500 leading-snug">Simulated factory data — no real customer, supplier or person.</p>
        </aside>

        {/* RIGHT — Gantt */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h1 className="text-2xl font-black text-white leading-tight">{(data && data.title) || topic.label}</h1>
              <p className="text-sm text-slate-400">{(data && data.subtitle) || topic.hint}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {topic.monthly && (
                <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-1 py-1">
                  <button onClick={() => setMonth(shiftMonth(month, -1))} className="p-1.5 hover:bg-slate-700 rounded-lg" aria-label="Previous month"><ChevronLeft size={18} /></button>
                  <span className="px-2 text-sm font-bold text-white tabular-nums">{month}</span>
                  <button onClick={() => setMonth(shiftMonth(month, 1))} className="p-1.5 hover:bg-slate-700 rounded-lg" aria-label="Next month"><ChevronRight size={18} /></button>
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
                <Search size={16} className="text-slate-500" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter order, line, supplier…" className="bg-transparent outline-none text-sm w-48 text-white placeholder-slate-500" />
              </div>
              <button onClick={() => setShowTable((v) => !v)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold ${showTable ? "bg-emerald-500/20 border-emerald-500/40 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`}><Table2 size={16} />Table</button>
              <button onClick={load} className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
              <button onClick={() => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen()} className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700" aria-label="Full screen"><Maximize size={16} /></button>
            </div>
          </div>

          {error && <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm">{error}</div>}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {((data && data.summary) || []).map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-2.5">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">{s.label}</div>
                <div className="text-2xl font-black text-white tabular-nums leading-tight">{fmtNum(s.value)}</div>
              </div>
            ))}
          </div>

          {data && data.gantt && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 text-[11px] text-slate-300">
              {data.gantt.legend.map((l) => {
                const marker = l.tone === "marker" || l.tone.endsWith("-marker");
                const tone = l.tone.replace("-marker", "");
                return (
                  <span key={l.label} className="flex items-center gap-1.5">
                    {marker ? <span className={`inline-block w-2.5 h-2.5 rotate-45 ${DOT[tone] || DOT.rose}`} /> : <span className={`inline-block w-5 h-2.5 rounded ${(BAR[tone] || BAR.slate).split(" ")[0]}`} />}
                    {l.label}
                  </span>
                );
              })}
              <span className="flex items-center gap-1.5"><span className="inline-block w-0.5 h-3 bg-orange-400" />Today</span>
            </div>
          )}

          {topic.factory !== undefined && data && data.factories && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {!topic.noAll && (
                <button onClick={() => { setFactory(""); setOrder(""); }} className={`px-3 py-1.5 rounded-xl border text-sm font-semibold ${fac === "" ? "bg-emerald-500/20 border-emerald-500/40 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`}>All factories</button>
              )}
              {data.factories.map((F) => (
                <button key={F.id} onClick={() => { setFactory(F.id); setOrder(""); }} title={F.focus} className={`px-3 py-1.5 rounded-xl border text-sm font-semibold ${fac === F.id ? "bg-emerald-500/20 border-emerald-500/40 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`}>{F.name}</button>
              ))}
            </div>
          )}

          {topic.orders && data && data.orders && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
              {data.orders.map((o) => (
                <button key={o.ref} onClick={() => setOrder(o.ref)} title={`${o.style} · ${o.status}`} className={`flex-shrink-0 text-left rounded-xl border px-3 py-1.5 ${data.selected === o.ref ? "bg-sky-500/20 border-sky-400 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`}>
                  <span className="block text-sm font-bold leading-tight">{o.ref}</span>
                  <span className="block text-[10px] text-slate-400 leading-tight">{fmtNum(o.pieces)} pcs · {o.status}</span>
                </button>
              ))}
              {data.orders.length === 0 && <span className="text-sm text-slate-500">No orders for this factory in {month}.</span>}
            </div>
          )}

          {data && data.gantt && !showTable && <Gantt g={data.gantt} filter={q} onLine={(ln) => navigate(`/dashboard/4dp/line/${ln}`)} />}

          {showTable && data && (
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-auto" style={{ maxHeight: "calc(100vh - 330px)" }}>
              <table className="w-full border-collapse">
                <thead className="sticky top-0">
                  <tr className="bg-slate-800 text-left">
                    {data.columns.map((c) => <th key={c.key} className="px-3 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">{c.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((r, i) => (
                    <tr key={i} className="border-t border-slate-700/70 hover:bg-slate-700/40">
                      {data.columns.map((c) => (
                        <td key={c.key} className={`px-3 py-2 text-sm ${typeof r[c.key] === "number" ? "text-right tabular-nums" : ""} ${c.key === "order" || c.key === "line" ? "font-bold text-white whitespace-nowrap" : ""}`}>
                          {CHIP_COLS.has(c.key) && r[c.key] ? <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${chip(r[c.key])}`}>{fmtNum(r[c.key])}</span> : fmtNum(r[c.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-2 text-[11px] text-slate-500">{data ? `As of ${String(data.as_of || "").replace("T", " ").slice(0, 16)} · hover a bar or diamond for details` : loading ? "Loading…" : ""}</p>
        </main>
      </div>
    </div>
  );
};

export default FourDP;
