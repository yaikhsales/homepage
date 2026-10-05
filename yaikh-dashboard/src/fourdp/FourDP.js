// 4DP workspace — topics on the left, Gantt chart on the right.
// Data: the simulated factory on the M1 (POST /api/m1/sim/view, module "4dp",
// gantt: true). Each topic returns a table plus a Gantt description:
//   { start, end, today, legend[], rows[{ label, sub, header?, bars[], markers[] }] }
// The chart is drawn with plain positioned divs — no chart library.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LayoutDashboard, Building, ClipboardCheck, Layers, MonitorPlay,
  ChevronLeft, ChevronRight, RefreshCw, Search, Maximize, Table2, X,
} from "lucide-react";
import LineDiagram, { withSteps } from "./LineDiagram";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

const TOPICS = [
  { id: "master-plan", label: "Master Plan", hint: "Orders handed to each factory", icon: LayoutDashboard, monthly: true, factory: "" },
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

const LABEL_W = 210;
const ROW_H = 26;

// A legend entry matches a bar by tone, and a milestone by "<tone>-marker" (or "marker" for the rose arrival/ex-factory diamond).
const barOn = (picked, tone) => picked.size === 0 || picked.has(tone);
const markOn = (picked, tone) => picked.size === 0 || picked.has(`${tone}-marker`) || (tone === "rose" && picked.has("marker"));

// Order status feed: three bubbles on each Master Plan bar (MRP, YPI, CE). The light on a bubble is the
// department's overall state for that order; clicking it opens the detail feed.
const GROUPS = [["mrp", "MRP"], ["ypi", "YPI"], ["ce", "CE"]];
const LIGHT = { green: "bg-emerald-400", amber: "bg-amber-400", red: "bg-rose-500", idle: "bg-slate-500", na: "bg-slate-700" };
const LIGHT_TEXT = { green: "text-emerald-300", amber: "text-amber-300", red: "text-rose-300", idle: "text-slate-400", na: "text-slate-500" };

// Mini sewing line: opened from an order bar on the Line Plan. Every order has its own layout (zig-zag line
// or U-shape hanger line, a few machines off-line); LineDiagram draws it.
function LinePop({ pop, onClose, onOpen }) {
  const [d, setD] = useState(null);
  const [failed, setFailed] = useState(false);
  const { line, order, garment } = pop.run;
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "4dp", view: "line-live", line, order, garment }) });
        const j = await r.json();
        if (!r.ok || !j.ok) throw new Error("unavailable");
        if (live) { setD(j); setFailed(false); }
      } catch (e) {
        if (live) setFailed(true);
      }
    };
    load();
    const t = setInterval(load, 20000);
    const key = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => { live = false; clearInterval(t); window.removeEventListener("keydown", key); };
  }, [line, order, garment, onClose]);
  const room = window.innerWidth - (document.body.classList.contains("yai-pa-open") ? 436 : 0);
  const W = Math.min(760, room - 24);
  const left = Math.max(8, Math.min(pop.x - 120, room - W - 12));
  const below = pop.y < window.innerHeight / 2;
  const place = below ? { top: pop.y + 14, maxHeight: window.innerHeight - pop.y - 24 } : { bottom: window.innerHeight - pop.y + 14, maxHeight: pop.y - 24 };
  const st = (d && d.stations) || [];
  const bad = withSteps(st).filter((x) => x.status === "red" || x.status === "orange");
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed z-50 rounded-2xl border border-slate-600 bg-slate-800 shadow-2xl text-slate-200 overflow-y-auto" style={{ left, width: W, ...place }}>
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-slate-700">
          <span className="font-black text-white whitespace-nowrap">{line} · {order}</span>
          <span className="text-[11px] text-slate-400 truncate">{garment}{d ? ` · ${fmtNum(d.pieces)} pcs · ${d.run}` : ""}</span>
          <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-slate-700" aria-label="Close"><X size={14} /></button>
        </div>
        {failed && !d && <div className="py-8 text-center text-sm text-amber-200">Line data is unavailable right now.</div>}
        {!d && !failed && <div className="py-8 text-center text-sm text-slate-500">Loading…</div>}
        {d && (
          <div className="px-3 py-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mb-2">
              <span className={`rounded-full px-2 py-0.5 font-bold ${d.running ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-300"}`}>{d.state_text}</span>
              {d.layout_name && <span className="rounded-full px-2 py-0.5 font-bold bg-sky-500/20 text-sky-300">{d.layout_name} · {d.offline_machines} off-line</span>}
              {d.running && <span>Output <b className="text-white text-sm tabular-nums">{fmtNum(d.output_now)}</b> / {fmtNum(d.target_now)}</span>}
              {d.running && <span>Efficiency <b className="text-white text-sm">{d.efficiency}</b></span>}
              {d.running && <span>Defects <b className="text-amber-300 text-sm tabular-nums">{d.defects}</b></span>}
              {d.running && <span>Down <b className="text-rose-300 text-sm tabular-nums">{d.machines_down}</b></span>}
              {!d.running && <span>{d.operators} machines · target {fmtNum(d.target_day)} a day</span>}
            </div>
            <LineDiagram stations={st} layout={d.layout} size="mini" />
            {bad.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                {bad.map((x) => (
                  <span key={x.no} className="flex items-center gap-1.5 text-[11px]">
                    <span className={`inline-block w-2 h-2 rounded-full ${x.status === "red" ? "bg-rose-500 animate-pulse" : "bg-amber-400"}`} />
                    <b className="text-white">Step {x.step} {x.op}{x.offline ? " (off-line)" : ""}</b> <span className={x.status === "red" ? "text-rose-300" : "text-amber-300"}>{x.note}</span>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />on target</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />defects</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />breakdown</span>
              <span>number = operation step</span>
              <button onClick={() => onOpen(line)} className="ml-auto rounded-lg border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 px-2 py-0.5 text-[11px] font-bold">Open full live line ›</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function StatusPop({ pop, onTab, onClose }) {
  useEffect(() => {
    const key = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  const W = 430;
  // Stay clear of the department PA panel on the right while it is open.
  const room = window.innerWidth - (document.body.classList.contains("yai-pa-open") ? 436 : 0);
  const left = Math.max(8, Math.min(pop.x - 40, room - W - 12));
  // Open below the bubble in the top half of the screen, above it in the bottom half, so the feed is never cut off.
  const below = pop.y < window.innerHeight / 2;
  const place = below ? { top: pop.y + 14, maxHeight: window.innerHeight - pop.y - 24 } : { bottom: window.innerHeight - pop.y + 14, maxHeight: pop.y - 24 };
  const d = pop.data;
  const grp = d && d.groups[pop.group];
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed z-50 rounded-2xl border border-slate-600 bg-slate-800 shadow-2xl text-slate-200 overflow-y-auto" style={{ left, width: W, ...place }}>
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-slate-700">
          <span className="font-black text-white">{pop.ref}</span>
          {d && <span className="text-[11px] text-slate-400 truncate">{fmtNum(d.pieces)} pcs · {d.factory} · cutting {d.cutting}</span>}
          {d && d.start_delay > 0 && <span className="rounded-full bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 whitespace-nowrap">possible delay {d.start_delay} {d.start_delay === 1 ? "day" : "days"}</span>}
          <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-slate-700" aria-label="Close"><X size={14} /></button>
        </div>
        <div className="flex gap-1 px-3 pt-2">
          {GROUPS.map(([k, name]) => (
            <button key={k} onClick={() => onTab(k)} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${pop.group === k ? "bg-white/10 border-white/50 text-white" : "border-slate-600 text-slate-300 hover:bg-slate-700"}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${LIGHT[(d && d.groups[k].tone) || (pop.st && pop.st[k]) || "idle"]}`} />{name}
            </button>
          ))}
          {grp && <span className="ml-auto self-center text-[11px] text-slate-400 truncate">{grp.title.split("— ")[1]}</span>}
        </div>
        <div className="px-3 py-2">
          {pop.error && <div className="py-6 text-center text-sm text-amber-200">Status is unavailable right now.</div>}
          {!d && !pop.error && <div className="py-6 text-center text-sm text-slate-500">Loading…</div>}
          {grp && grp.rows.map((r) => (
            <div key={r.item} className={`flex items-start gap-2 py-1.5 border-b border-slate-700/60 last:border-b-0 ${r.tone === "red" ? "bg-rose-500/10 -mx-3 px-3" : ""}`}>
              <span className={`mt-1 inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${LIGHT[r.tone] || LIGHT.idle}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-white whitespace-nowrap">{r.item}</span>
                  <span className={`text-[11px] font-semibold min-w-0 leading-tight ${LIGHT_TEXT[r.tone] || LIGHT_TEXT.idle}`}>{r.status}</span>
                  <span className="ml-auto text-xs font-bold tabular-nums text-slate-200 whitespace-nowrap">{r.date}</span>
                </div>
                {r.impact && <div className="text-xs font-bold text-rose-300 leading-snug">{r.impact}</div>}
                {r.detail && <div className="text-[11px] text-slate-400 leading-snug">{r.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const hasProblem = (b) => !!b.st && GROUPS.some(([k]) => b.st[k] === "red");

function Gantt({ g, filter, onLine, picked, onStatus, onlyProblems, corner, onRun }) {
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
    <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-auto" style={{ maxHeight: "calc(100vh - 205px)" }}>
      <div style={{ width: LABEL_W + width, minWidth: "100%" }}>
        {/* header: months + days */}
        <div className="sticky top-0 z-20 flex bg-slate-800 border-b border-slate-700">
          <div className="sticky left-0 z-30 bg-slate-800 border-r border-slate-700 flex flex-col justify-center gap-0.5 px-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold overflow-hidden" style={{ width: LABEL_W, minWidth: LABEL_W }}>
            {corner}
            {(!corner || (g.caption || "").trim()) && <span className="truncate">{g.caption || `${rows.filter((r) => !r.header).length} rows`}</span>}
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
                  const barW = (to - from + 1) * dayW - 2;
                  const bubbles = b.st && b.ref && onStatus && barW >= 44;
                  return (
                    <div key={i} title={`${b.title} · ${b.from} → ${b.to}`} onClick={b.run && onRun ? (e) => onRun(b.run, e) : undefined} className={`absolute top-1 rounded-md text-[10px] font-semibold leading-[18px] shadow transition-opacity flex items-center overflow-hidden ${b.run && onRun ? "cursor-pointer hover:brightness-110 hover:ring-1 hover:ring-white/70" : ""} ${BAR[b.tone] || BAR.slate} ${barOn(picked, b.tone) && !(onlyProblems && !hasProblem(b)) ? "" : "opacity-10"}`} style={{ left: from * dayW + 1, width: barW, height: ROW_H - 8 }}>
                      <span className="truncate px-1.5 flex-1 min-w-0">{b.label}</span>
                      {bubbles && b.st.delay > 0 && barW >= 150 && <span className="flex-shrink-0 mr-1 rounded bg-rose-600 text-white text-[9px] font-black leading-[14px] px-1" title={`Possible delay: ${b.st.delay} days`}>+{b.st.delay}d</span>}
                      {bubbles && (
                        <span className="flex items-center gap-0.5 pr-0.5 flex-shrink-0">
                          {GROUPS.map(([k, name]) => (
                            <button key={k} onClick={(e) => { e.stopPropagation(); onStatus(b, k, e); }} title={`${name} status — ${b.ref}`} className={`flex items-center gap-1 rounded-full text-white text-[9px] font-bold leading-[14px] px-1.5 ${b.st[k] === "red" ? "bg-rose-950 ring-1 ring-rose-400 hover:bg-black" : "bg-slate-900/90 hover:bg-black"}`}>
                              <span className={`inline-block rounded-full ${b.st[k] === "red" ? "w-2 h-2 bg-red-500 animate-pulse" : `w-1.5 h-1.5 ${LIGHT[b.st[k]] || LIGHT.idle}`}`} />
                              {barW >= 190 ? name : barW >= 110 ? name[0] : null}
                            </button>
                          ))}
                        </span>
                      )}
                    </div>
                  );
                })}
                {r.markers.map((m, i) => {
                  const x = dayDiff(g.start, m.date);
                  if (x < 0 || x > days.length - 1) return null;
                  return (
                    <div key={`m${i}`} title={`${m.label} · ${m.date}`} className={`absolute rotate-45 border border-slate-900 transition-opacity ${DOT[m.tone] || DOT.rose} ${!markOn(picked, m.tone) ? "opacity-10" : m.done === false ? "opacity-60" : ""}`} style={{ left: x * dayW + dayW / 2 - 5, top: ROW_H / 2 - 5, width: 10, height: 10 }} />
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

const FourDP = () => {
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
  const [picked, setPicked] = useState(() => new Set()); // legend entries ticked: show only these, fade the rest
  const togglePick = (tone) => setPicked((old) => { const n = new Set(old); if (n.has(tone)) n.delete(tone); else n.add(tone); return n; });
  // The factory picked stays picked from one topic to the next. A topic that needs one factory falls back to its own.
  const fac = factory === null || (factory === "" && topic.noAll) ? (topic.factory || "") : factory;
  const factoryPick = topic.factory !== undefined && data && data.factories ? (
    <select value={fac} onChange={(e) => { setFactory(e.target.value); setOrder(""); }} aria-label="Factory" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm font-bold normal-case tracking-normal text-emerald-300 outline-none cursor-pointer hover:border-emerald-400">
      {!topic.noAll && <option value="">All factories</option>}
      {data.factories.map((F) => <option key={F.id} value={F.id}>{F.name} — {F.focus}</option>)}
    </select>
  ) : null;
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [pop, setPop] = useState(null); // order status feed opened from a bar bubble
  const openStatus = useCallback(async (bar, group, e) => {
    setPop({ ref: bar.ref, st: bar.st, group, x: e.clientX, y: e.clientY, data: null });
    try {
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "4dp", view: "order-status", order: bar.ref }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setPop((p) => (p && p.ref === bar.ref ? { ...p, data: j } : p));
    } catch (err) {
      setPop((p) => (p && p.ref === bar.ref ? { ...p, error: true } : p));
    }
  }, []);
  const closePop = useCallback(() => setPop(null), []);
  const [linePop, setLinePop] = useState(null); // mini sewing line opened from a Line Plan bar
  const closeLinePop = useCallback(() => setLinePop(null), []);

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
  useEffect(() => { setData(null); setOrder(""); setPicked(new Set()); setPop(null); setLinePop(null); setOnlyProblems(false); }, [view]);
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
    <div className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 pb-3 pt-28 font-sans">
      {/* Leave room for the department PA panel while it is open (body.yai-pa-open is set by the PA mount). */}
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <div className="flex gap-3 items-start">
        {/* LEFT — topics */}
        <aside className="w-40 flex-shrink-0 rounded-xl border border-slate-700 bg-slate-800/60 p-1.5 sticky top-28">
          <nav className="flex flex-col gap-1">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              const on = t.id === view;
              return (
                <button key={t.id} onClick={() => navigate(`/dashboard/4dp/${t.id}`)} title={t.hint} className={`flex items-center gap-2 text-left rounded-lg px-2 py-2 transition-colors ${on ? "bg-emerald-500/20 border border-emerald-500/40 text-white" : "border border-transparent hover:bg-slate-700/60 text-slate-300"}`}>
                  <Icon size={16} className={`flex-shrink-0 ${on ? "text-emerald-300" : "text-slate-400"}`} />
                  <span className="text-sm font-bold leading-tight">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT — Gantt */}
        <main className="flex-1 min-w-0">
          {/* One compact toolbar: factory tabs + figures on the left, controls on the right.
              The space belongs to the plan, not to statistics. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1.5">
            <h1 className="text-lg font-black text-white leading-none whitespace-nowrap">{topic.label}</h1>
            {showTable && factoryPick && <div className="w-56">{factoryPick}</div>}
            <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-slate-400">
              {((data && data.summary) || []).map((x) => (x.label === "Problems" ? (
                <button key={x.label} onClick={() => setOnlyProblems((v) => !v)} title="Click to show only the orders with a problem; click again to release" className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-0.5 ${onlyProblems ? "bg-rose-600 border-rose-400 text-white" : "border-rose-500/50 text-rose-300 hover:bg-rose-500/10"}`}>
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />{x.label} <b className="tabular-nums text-sm">{fmtNum(x.value)}</b>
                </button>
              ) : (
                <span key={x.label} className="whitespace-nowrap">{x.label} <b className="text-white tabular-nums text-sm">{fmtNum(x.value)}</b></span>
              )))}
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              {topic.monthly && (
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg">
                  <button onClick={() => setMonth(shiftMonth(month, -1))} className="p-1 hover:bg-slate-700 rounded-lg" aria-label="Previous month"><ChevronLeft size={16} /></button>
                  <span className="px-1.5 text-xs font-bold text-white tabular-nums">{month}</span>
                  <button onClick={() => setMonth(shiftMonth(month, 1))} className="p-1 hover:bg-slate-700 rounded-lg" aria-label="Next month"><ChevronRight size={16} /></button>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                <Search size={14} className="text-slate-500" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" className="bg-transparent outline-none text-xs w-28 text-white placeholder-slate-500" />
              </div>
              <button onClick={() => setShowTable((v) => !v)} className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold ${showTable ? "bg-emerald-500/20 border-emerald-500/40 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`}><Table2 size={14} />Table</button>
              <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
              <button onClick={() => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen()} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Full screen"><Maximize size={14} /></button>
            </div>
          </div>

          {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}

          {data && data.gantt && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1.5 text-[11px] text-slate-400">
              {data.gantt.legend.map((l) => {
                const marker = l.tone === "marker" || l.tone.endsWith("-marker");
                const tone = l.tone.replace("-marker", "");
                const on = picked.has(l.tone);
                return (
                  <button key={l.label} onClick={() => togglePick(l.tone)} title="Click to show only this; click again to release" className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 border transition-colors ${on ? "border-white/60 bg-white/10 text-white" : picked.size ? "border-transparent opacity-40 hover:opacity-80" : "border-transparent hover:bg-slate-800"}`}>
                    {marker ? <span className={`inline-block w-2 h-2 rotate-45 ${DOT[tone] || DOT.rose}`} /> : <span className={`inline-block w-4 h-2 rounded ${(BAR[tone] || BAR.slate).split(" ")[0]}`} />}
                    {l.label}
                  </button>
                );
              })}
              {picked.size > 0 && <button onClick={() => setPicked(new Set())} className="rounded-md px-1.5 py-0.5 border border-slate-600 text-slate-300 hover:bg-slate-800">Show all</button>}
              <span className="flex items-center gap-1"><span className="inline-block w-0.5 h-3 bg-orange-400" />Today</span>
              {data.subtitle && topic.orders && <span className="text-slate-300 truncate">· {data.subtitle}</span>}
            </div>
          )}

          {topic.orders && data && data.orders && (
            <div className="flex gap-1 overflow-x-auto pb-1 mb-1.5">
              {data.orders.map((o) => (
                <button key={o.ref} onClick={() => setOrder(o.ref)} title={`${o.style} · ${o.status}`} className={`flex-shrink-0 rounded-lg border px-2 py-1 text-xs font-bold whitespace-nowrap ${data.selected === o.ref ? "bg-sky-500/20 border-sky-400 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`}>
                  {o.ref} <span className="font-normal text-[10px] text-slate-400">{fmtNum(o.pieces)} · {o.status}</span>
                </button>
              ))}
              {data.orders.length === 0 && <span className="text-sm text-slate-500">No orders for this factory in {month}.</span>}
            </div>
          )}

          {data && data.gantt && !showTable && <Gantt g={data.gantt} filter={q} picked={picked} corner={factoryPick} onlyProblems={onlyProblems} onStatus={openStatus} onRun={(run, e) => setLinePop({ run, x: e.clientX, y: e.clientY })} onLine={(ln) => navigate(`/dashboard/4dp/line/${ln}`)} />}

          {showTable && data && (
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-auto" style={{ maxHeight: "calc(100vh - 205px)" }}>
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

          {linePop && <LinePop pop={linePop} onClose={closeLinePop} onOpen={(ln) => navigate(`/dashboard/4dp/line/${ln}?order=${encodeURIComponent(linePop.run.order)}&garment=${encodeURIComponent(linePop.run.garment)}`)} />}
          {pop && <StatusPop pop={pop} onTab={(k) => setPop((p) => ({ ...p, group: k }))} onClose={closePop} />}

          <p className="mt-1 text-[10px] text-slate-500">{data ? `As of ${String(data.as_of || "").replace("T", " ").slice(0, 16)} · hover a bar or diamond for details · click MRP / YPI / CE on a bar for that order's status · simulated factory data` : loading ? "Loading…" : ""}</p>
        </main>
      </div>
    </div>
  );
};

export default FourDP;
