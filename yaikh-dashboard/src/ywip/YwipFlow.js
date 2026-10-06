// YWIP — the work-in-progress monitor: one giant row, like a video wall.
//
// TOP: Gamini's own isometric floor strip (public/assets/ywip/floor-strip.png — stations 01–32 with the
// heat-seal branch under 11–15) as ONE row at a fixed height. Under every station: the headline figure and
// a stack of ORDER BUBBLES, one per activity — WHITE pending, ORANGE ongoing, GREEN done — that pulse when
// a status changes; click a bubble for its card (order, lot, qty, started, ETA, by), click a station for
// its figures and a link to the module screen. "TV wall" fits the whole row to the screen width (three
// 1920 panels side by side); on a normal screen the row auto-pans smoothly with a mini-map to jump.
// BELOW: the dashboard — WIP by station, throughput today against plan, QC pass by gate, WIP age, the
// 7-day trend, the branch split and the reconciliation checks. All SVG, no chart library.
// Data: the simulated factory on the M1, POST /api/m1/sim/view {module:"fc", view:"ywip-flow"} →
// stations[32]{…, activities[{id, order, lot, qty, unit, status, started, eta, done_at, by}]}, flows,
// checks, charts; refreshed every 30 s. Invented data — no real company or person.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, X, ExternalLink, ChevronDown, ChevronUp, Tv, Play, Pause, Gauge } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const STRIP = process.env.PUBLIC_URL + "/assets/ywip/floor-strip.png";
const IMG_W = 7680; // the strip's pixels
const IMG_H = 608;
const COL_W = 236; // one station's column in the band (strip pixels)
// Where each station's label pill sits in the strip (x = pill centre); 14 and 15 are the heat-seal branch,
// drawn lower, so their bubbles go in the band's second lane.
const PILL_X = [144, 384, 624, 864, 1104, 1344, 1584, 1824, 2064, 2355, 2688, 2979, 3312, 3552, 3792, 4082, 4416, 4656, 4896, 5136, 5376, 5616, 5856, 6096, 6336, 6576, 6816, 7056, 7296, 7536];
const PILLS = {};
[...Array(13)].forEach((_, i) => { PILLS[String(i + 1).padStart(2, "0")] = { x: PILL_X[i], y: 331, top: 50, bottom: 350, lane: 0 }; });
PILLS["14"] = { x: 3080, y: 567, top: 375, bottom: 585, lane: 1 };
PILLS["15"] = { x: 3320, y: 567, top: 375, bottom: 585, lane: 1 };
[...Array(17)].forEach((_, i) => { PILLS[String(i + 16).padStart(2, "0")] = { x: PILL_X[i + 13], y: 331, top: 50, bottom: 350, lane: 0 }; });

const TONE = { green: "border-emerald-500 text-emerald-700", amber: "border-amber-500 text-amber-700", red: "border-rose-500 text-rose-700", grey: "border-slate-300 text-slate-400" };
const DOT = { green: "bg-emerald-500", amber: "bg-amber-500", red: "bg-rose-500", grey: "bg-slate-400" };
const BUBBLE = { pending: "bg-white border-slate-300 text-slate-700", ongoing: "bg-orange-500 border-orange-600 text-white", done: "bg-emerald-500 border-emerald-600 text-white", blocked: "bg-rose-600 border-rose-700 text-white" };
// the column reads from the bottom up: white pending at the bottom, orange ongoing (and red blocked, which
// stays where it is) in the middle, green done at the top — so the top-to-bottom order is done, ongoing, pending
const ORDER = { done: 0, blocked: 1, ongoing: 1, pending: 2 };
const BUBBLE_H = 22; // one bubble row in screen pixels (the band is not scaled with the strip)
// one activity's identity across stations: the flow (the same lot travelling), else the activity, else the order
const bkey = (a) => String(a.flow_id || a.id || a.order);
const SPEEDS = [1, 10, 30];
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: 1 }) : v === null || v === undefined ? "—" : String(v));
const short = (v) => (typeof v !== "number" ? num(v) : Math.abs(v) >= 1e6 ? (v / 1e6).toFixed(1) + "M" : Math.abs(v) >= 1e4 ? Math.round(v / 1e3) + "k" : num(v));
// the figure chip's text: "5,286 rolls", "79/85 lays" (a unit like "of 85 lays today"), "88 %"
const chip = (f) => {
  if (!f) return "—";
  const unit = String(f.unit || "").split("·")[0].trim();
  const m = unit.match(/^of\s+([\d,]+)\s*(\S*)/);
  if (m) return <>{short(f.value)}<span className="font-semibold opacity-70">/{m[1]} {m[2]}</span></>;
  const word = unit.split(" ")[0].replace(/[,.]/g, "");
  return <>{short(f.value)}<span className="font-semibold opacity-70"> {word}</span></>;
};
const idle = (s) => (s.figures || []).every((f) => f.value === 0 || f.value === "—" || f.value === null) && Number(s.no) >= 20 && !(s.activities || []).length;
const PULSE_CSS = "@keyframes ywip-pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251,191,36,.9); } 50% { transform: scale(1.18); box-shadow: 0 0 0 8px rgba(251,191,36,0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251,191,36,0); } } .ywip-pulse { animation: ywip-pulse 1.4s ease-out 2; } .ywip-wall::-webkit-scrollbar { height: 8px; } .ywip-wall::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }";

/* ── the wall: one row, the strip on top, the bubble band under it ──────── */
const Wall = ({ stations, scale, onOpen, onBubble, open, changed, maxBubbles, laneH }) => {
  const byNo = Object.fromEntries(stations.map((s) => [s.no, s]));
  const W = IMG_W * scale;
  const twoLanes = !!(byNo["14"] || byNo["15"]);
  const bandH = laneH * (twoLanes ? 2 : 1) + 8;
  return (
    <div className="relative" style={{ width: W, height: IMG_H * scale + bandH, backgroundImage: `url(${STRIP})`, backgroundSize: `${W}px ${IMG_H * scale}px`, backgroundRepeat: "no-repeat", backgroundColor: "#eceeea" }}>
      {/* a faint rule between the strip and the band */}
      <div className="absolute left-0 right-0 border-t border-dashed border-slate-400/50" style={{ top: IMG_H * scale }} />
      {twoLanes && <div className="absolute left-0 right-0 border-t border-dotted border-slate-300" style={{ top: IMG_H * scale + laneH + 4 }} />}
      {Object.entries(PILLS).map(([no, p]) => {
        const s = byNo[no];
        if (!s) return null;
        const grey = idle(s);
        const tone = grey ? "grey" : s.status || "grey";
        const f = (s.figures || [])[0];
        const x = p.x * scale;
        const on = open === no;
        const acts = [...(s.activities || [])].sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9));
        // keep the column readable: the newest of each group stays, the rest folds into "+N" at the top
        const counts = { pending: 0, ongoing: 0, done: 0, blocked: 0, upcoming: 0 };
        acts.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; if (a.upcoming) counts.upcoming += 1; });
        if (s.activity_summary) Object.assign(counts, { pending: s.activity_summary.pending, ongoing: s.activity_summary.ongoing, done: s.activity_summary.done, blocked: s.activity_summary.blocked, upcoming: s.activity_summary.upcoming || 0 });
        const shown = acts.length > maxBubbles ? acts.filter((a) => a.status !== "done").slice(0, maxBubbles - 1).concat(acts.filter((a) => a.status === "done").slice(0, Math.max(1, maxBubbles - 1 - acts.filter((a) => a.status !== "done").length))).sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9)) : acts;
        const more = acts.length - shown.length;
        const bandTop = IMG_H * scale + 4 + p.lane * (laneH + 4);
        return (
          <React.Fragment key={no}>
            <button onClick={(e) => onOpen(s, e)} title={`${no} ${s.title}`} aria-label={`${no} ${s.title}`} className={`absolute rounded-xl transition-colors ${on ? "ring-2 ring-sky-400 bg-sky-400/10" : "hover:bg-sky-400/10"}`} style={{ left: x - 112 * scale, top: p.top * scale, width: 224 * scale, height: (p.bottom - p.top) * scale }} />
            <button onClick={(e) => onOpen(s, e)} className={`absolute -translate-x-1/2 whitespace-nowrap rounded-full border-2 bg-white px-2 leading-5 text-[11px] font-black shadow ${TONE[tone]} ${grey ? "opacity-70" : ""}`} style={{ left: x, top: (p.y + 22) * scale + 4 }} title={f ? `${f.label}: ${num(f.value)} ${f.unit || ""}` : s.title}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle ${DOT[tone]}`} />
              {chip(f)}
            </button>
            {/* the order column, read from the bottom up: white pending at the bottom, orange ongoing (red blocked
                stays put) in the middle, green done at the top; a bubble rises as its work goes on, then leaves
                for the bottom of the next station */}
            <div className="absolute flex flex-col items-center justify-end" style={{ left: x - (COL_W / 2) * scale, width: COL_W * scale, top: bandTop, height: laneH }}>
              {acts.length > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 mb-auto whitespace-nowrap" title={`${counts.pending} pending · ${counts.ongoing} ongoing · ${counts.done} done${counts.blocked ? " · " + counts.blocked + " blocked" : ""}`}>
                  <span className="flex items-center gap-0.5 text-emerald-700"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />{counts.done}</span>
                  <span className="flex items-center gap-0.5 text-orange-600"><span className="inline-block w-2 h-2 rounded-full bg-orange-500" />{counts.ongoing}</span>
                  <span className="flex items-center gap-0.5"><span className="inline-block w-2 h-2 rounded-full bg-white border border-slate-400" />{counts.pending}</span>
                  {counts.blocked > 0 && <span className="flex items-center gap-0.5 text-rose-700"><span className="inline-block w-2 h-2 rounded-full bg-rose-600" />{counts.blocked}</span>}
                  {more > 0 && <span className="rounded-full border border-slate-400 bg-slate-100 text-slate-600 px-1.5 leading-4 text-[10px] font-black" title={`${more} more, folded`}>+{more}</span>}
                </div>
              )}
              <div className="flex flex-col items-center gap-[3px]">
                {shown.map((a) => (
                  <button key={bkey(a)} data-flow={bkey(a)} onClick={(e) => onBubble(a, s, e)} title={`${a.order}${a.lot ? " · lot " + a.lot : ""} · ${num(a.qty)} ${a.unit || ""} · ${a.status}${a.status === "blocked" && a.issue ? " — " + a.issue.reason : ""}${a.next_station ? " → " + a.next_station : ""}`} className={`relative rounded-full border px-2 text-[10.5px] font-black shadow-sm whitespace-nowrap ${BUBBLE[a.status] || BUBBLE.pending} ${changed.has(bkey(a)) ? "ywip-pulse" : ""} ${a.status === "blocked" ? "ring-2 ring-rose-300" : ""} ${a.upcoming ? "border-dashed text-slate-500" : ""}`} style={{ lineHeight: BUBBLE_H - 4 + "px" }}>
                    {a.status === "blocked" && <span className="mr-1" aria-label="blocked">⚠</span>}{a.order}<span className="font-semibold opacity-75"> {a.upcoming ? (a.start_at || a.date || "planned") : short(a.qty)}</span>
                  </button>
                ))}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// the mini-map: the whole row small, with the window drawn on it; click to jump
const MiniMap = ({ scroller, total, width = 320 }) => {
  const [win, setWin] = useState({ l: 0, w: 1 });
  useEffect(() => {
    const el = scroller.current;
    if (!el) return undefined;
    const on = () => setWin({ l: el.scrollLeft / Math.max(el.scrollWidth, 1), w: el.clientWidth / Math.max(el.scrollWidth, 1) });
    on();
    el.addEventListener("scroll", on);
    const t = setInterval(on, 1000);
    return () => { el.removeEventListener("scroll", on); clearInterval(t); };
  }, [scroller, total]);
  const h = Math.round((width * IMG_H) / IMG_W) + 6;
  return (
    <div className="relative rounded-md border border-slate-600 overflow-hidden cursor-pointer" style={{ width, height: h, backgroundImage: `url(${STRIP})`, backgroundSize: `${width}px ${h - 6}px`, backgroundRepeat: "no-repeat", backgroundColor: "#eceeea" }} title="click to jump" onClick={(e) => { const el = scroller.current; if (!el) return; const r = e.currentTarget.getBoundingClientRect(); const f = (e.clientX - r.left) / r.width; el.scrollTo({ left: f * el.scrollWidth - el.clientWidth / 2, behavior: "smooth" }); }}>
      <div className="absolute top-0 bottom-0 border-2 border-sky-400 bg-sky-400/15 rounded-sm" style={{ left: `${win.l * 100}%`, width: `${Math.max(win.w * 100, 2)}%` }} />
    </div>
  );
};

/* ── the bubble card: one activity ──────────────────────────────────────── */
const BubbleCard = ({ a, s, at, onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const key = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  const W = 320;
  const room = window.innerWidth - (document.body.classList.contains("yai-pa-open") ? 436 : 0);
  const left = Math.max(8, Math.min(at.x - 40, room - W - 12));
  const below = at.y < window.innerHeight / 2;
  const place = below ? { top: at.y + 14 } : { bottom: window.innerHeight - at.y + 14 };
  const ctx = [["Lot", a.lot], ["Trip", a.trip], ["Line", a.line], ["Lays", a.lays], ["Plies", a.plies], ["Rolls", a.rolls], ["Cartons", a.cartons], ["Pieces", a.pcs], ["Vehicle", a.vehicle], ["Destination", a.dest]];
  const rows = [["Station", `${s.no} ${s.title}`], ["Order", a.order], ["What", a.kind], ["Qty", a.qty !== undefined ? `${num(a.qty)} ${a.unit || ""}` : undefined], ["Status", a.upcoming ? "planned" : a.status], ["Date", a.date], ["Starts", a.upcoming ? a.start_at : undefined], ["Started", a.upcoming ? undefined : a.started], ["ETA", a.eta], ["Done", a.done_at], ["By", a.by], ...ctx, ["Next", a.next_station ? `${String(a.next_station).replace(/_/g, " ")}${a.arrives_next_at ? " · arrives " + a.arrives_next_at : ""}${a.next_starts_at ? " · starts " + a.next_starts_at : ""}` : undefined]].filter(([, v]) => v !== undefined && v !== null && v !== "");
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed z-50 rounded-2xl border border-slate-600 bg-slate-800 shadow-2xl text-slate-200" style={{ left, width: W, ...place }}>
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-slate-700">
          <span className={`rounded-full border px-2 leading-5 text-[11px] font-black ${BUBBLE[a.status] || BUBBLE.pending}`}>{a.order}</span>
          <span className="text-xs text-slate-400 truncate">{s.no} {s.title}</span>
          <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-slate-700" aria-label="Close"><X size={14} /></button>
        </div>
        <div className="px-3 py-2">
          {a.status === "blocked" && <div className="mb-2 rounded-lg border border-rose-500/50 bg-rose-500/15 px-2 py-1.5 text-xs text-rose-200"><b>⚠ Stuck — {(a.issue && a.issue.reason) || "an issue is holding this activity"}</b>{a.issue && (a.issue.since || a.issue.owner) ? <div className="text-[11px] text-rose-300/80 mt-0.5">{a.issue.since ? "since " + a.issue.since : ""}{a.issue.owner ? " · " + a.issue.owner : ""}</div> : null}</div>}
          {rows.map(([k, v]) => <div key={k} className="flex items-baseline gap-2 py-0.5 border-b border-slate-700/60 last:border-b-0 text-xs"><span className="text-slate-400 w-16 flex-shrink-0">{k}</span><b className={`text-white min-w-0 ${k === "Status" ? "capitalize" : ""}`}>{String(v)}</b></div>)}
          {a.note && <div className="mt-1.5 text-[11px] text-slate-300">{a.note}</div>}
          {Array.isArray(a.timeline) && a.timeline.length > 0 && (
            <div className="mt-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Timeline</div>
              <div className="max-h-28 overflow-auto text-[11px] space-y-0.5">{a.timeline.map((t, i) => <div key={i} className="flex gap-2"><span className="text-slate-300 w-32 truncate">{String(t.station).replace(/_/g, " ")}</span><span className="text-slate-500 tabular-nums">{String(t.start || "").slice(5, 16)}{t.end ? " → " + String(t.end).slice(5, 16) : " → …"}</span></div>)}</div>
            </div>
          )}
          {s.link && <button onClick={() => navigate(s.link)} className="mt-2 inline-flex items-center gap-1 rounded-lg border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 px-2 py-1 text-xs font-bold"><ExternalLink size={12} />Open the screen</button>}
        </div>
      </div>
    </>
  );
};

/* ── the station card ───────────────────────────────────────────────────── */
const Card = ({ s, at, onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const key = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  const W = 360;
  const room = window.innerWidth - (document.body.classList.contains("yai-pa-open") ? 436 : 0);
  const left = Math.max(8, Math.min(at.x - 60, room - W - 12));
  const below = at.y < window.innerHeight / 2;
  const place = below ? { top: at.y + 14 } : { bottom: window.innerHeight - at.y + 14 };
  const grey = idle(s);
  const tone = grey ? "grey" : s.status || "grey";
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed z-50 rounded-2xl border border-slate-600 bg-slate-800 shadow-2xl text-slate-200" style={{ left, width: W, ...place }}>
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-slate-700">
          <span className="rounded-full bg-slate-700 text-white text-[11px] font-black px-2 py-0.5 tabular-nums">{s.no}</span>
          <span className="font-black text-white">{s.title}</span>
          <span className={`inline-block w-2 h-2 rounded-full ${DOT[tone]}`} title={tone} />
          <span className="text-[11px] text-slate-400">{s.kind}</span>
          <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-slate-700" aria-label="Close"><X size={14} /></button>
        </div>
        <div className="px-3 py-2">
          {(s.figures || []).map((f) => (
            <div key={f.label} className="flex items-baseline gap-2 py-1 border-b border-slate-700/60 last:border-b-0">
              <span className="text-xs text-slate-400 flex-1 min-w-0">{f.label}</span>
              <b className="text-white tabular-nums">{num(f.value)}</b>
              <span className="text-[11px] text-slate-500 whitespace-nowrap">{f.unit || ""}</span>
            </div>
          ))}
          {grey && <div className="text-[11px] text-slate-500 mt-1">Nothing here yet — the first ex-factory is 15 Oct 2026.</div>}
          {s.link && <button onClick={() => navigate(s.link)} className="mt-2 inline-flex items-center gap-1 rounded-lg border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 px-2 py-1 text-xs font-bold"><ExternalLink size={12} />Open the screen</button>}
        </div>
      </div>
    </>
  );
};

/* ── charts (SVG, no library) ───────────────────────────────────────────── */
const Panel = ({ title, sub, children, className }) => (
  <section className={`rounded-2xl border border-slate-700 bg-slate-800/40 p-3 min-w-0 ${className || ""}`}>
    <div className="flex items-baseline gap-2 mb-2"><div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{title}</div>{sub && <div className="text-[11px] text-slate-500 truncate">{sub}</div>}</div>
    {children}
  </section>
);

// vertical bars with a label under each; `tone(d)` colours a bar; `plan` draws a hollow bar behind
const Bars = ({ data, value, label, tone, plan, height = 150, fmt = short }) => {
  const max = Math.max(1, ...data.map((d) => Math.max(value(d), plan ? plan(d) || 0 : 0)));
  const n = data.length;
  const W = 1000;
  const slot = W / Math.max(n, 1);
  const bw = Math.min(slot * 0.62, 60);
  const H = height;
  const top = 18;
  const base = H - 30;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1={0} x2={W} y1={base - (base - top) * g} y2={base - (base - top) * g} stroke="#334155" strokeDasharray="3 4" />)}
      {data.map((d, i) => {
        const v = value(d);
        const p = plan ? plan(d) || 0 : 0;
        const x = i * slot + (slot - bw) / 2;
        const h = ((base - top) * v) / max;
        const ph = ((base - top) * p) / max;
        return (
          <g key={i}>
            {plan && p > 0 && <rect x={x - 3} y={base - ph} width={bw + 6} height={ph} fill="none" stroke="#94a3b8" strokeDasharray="3 3" rx={3} />}
            <rect x={x} y={base - h} width={bw} height={Math.max(h, v > 0 ? 2 : 0)} fill={tone ? tone(d) : "#38bdf8"} rx={3} />
            <text x={x + bw / 2} y={base - h - 5} textAnchor="middle" fontSize={11} fill="#e2e8f0" fontWeight={700}>{v ? fmt(v) : ""}</text>
            <text x={x + bw / 2} y={base + 14} textAnchor="middle" fontSize={10} fill="#94a3b8">{label(d)}</text>
          </g>
        );
      })}
    </svg>
  );
};

const Lines = ({ data, series, height = 170 }) => {
  const W = 1000;
  const H = height;
  const top = 14;
  const base = H - 24;
  const left = 10;
  const right = W - 10;
  const n = data.length;
  const max = Math.max(1, ...series.flatMap(([k]) => data.map((d) => Number(d[k]) || 0)));
  const X = (i) => left + ((right - left) * i) / Math.max(n - 1, 1);
  const Y = (v) => base - ((base - top) * v) / max;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      {[0.5, 1].map((g) => <line key={g} x1={left} x2={right} y1={Y(max * g)} y2={Y(max * g)} stroke="#334155" strokeDasharray="3 4" />)}
      {series.map(([k, name, colour]) => (
        <g key={k}>
          <polyline points={data.map((d, i) => `${X(i)},${Y(Number(d[k]) || 0)}`).join(" ")} fill="none" stroke={colour} strokeWidth={2.5} strokeLinejoin="round" />
          {data.map((d, i) => <circle key={i} cx={X(i)} cy={Y(Number(d[k]) || 0)} r={3} fill={colour} />)}
        </g>
      ))}
      {data.map((d, i) => <text key={i} x={X(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize={10} fill="#94a3b8">{String(d.date || "").replace(/ 20\d\d$/, "")}</text>)}
    </svg>
  );
};

const Donut = ({ parts }) => {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  let acc = 0;
  const R = 44;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" className="w-32 h-32 flex-shrink-0">
        <circle cx={60} cy={60} r={R} fill="none" stroke="#1e293b" strokeWidth={16} />
        {parts.map((p) => {
          const len = (C * p.value) / total;
          const el = <circle key={p.label} cx={60} cy={60} r={R} fill="none" stroke={p.colour} strokeWidth={16} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} transform="rotate(-90 60 60)" />;
          acc += len;
          return el;
        })}
        <text x={60} y={64} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">{short(total)}</text>
      </svg>
      <div className="text-xs space-y-1 min-w-0">
        {parts.map((p) => <div key={p.label} className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: p.colour }} /><span className="text-slate-300 flex-1 truncate">{p.label}</span><b className="text-white tabular-nums">{num(p.value)}</b><span className="text-slate-500 tabular-nums w-10 text-right">{Math.round((p.value / total) * 100)}%</span></div>)}
      </div>
    </div>
  );
};

/* ── the screen ─────────────────────────────────────────────────────────── */
const YwipFlow = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState(null); // { s, x, y }
  const [bubble, setBubble] = useState(null); // { a, s, x, y }
  const [showChecks, setShowChecks] = useState(false);
  const [wall, setWall] = useState(false); // TV-wall mode: the whole row fits the screen width
  const [pan, setPan] = useState(true); // auto-pan on a normal screen
  const [vw, setVw] = useState(window.innerWidth);
  const [changed, setChanged] = useState(() => new Set()); // bubbles whose status just changed → pulse
  const [speed, setSpeed] = useState(1); // demo speed: 1× real time, 10×, 30× (the M1 moves the activities faster)
  const t0 = useRef(null);
  const prev = useRef({});
  const scroller = useRef(null);
  const back = () => (onBack ? onBack() : navigate(-1));

  const inFlight = useRef(false);
  const load = useCallback(async () => {
    if (inFlight.current) return; // one request at a time — a tick is skipped while the last one is still answering
    inFlight.current = true;
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "fc", view: "ywip-flow", speed: speed > 1 ? speed : undefined, t0: speed > 1 ? t0.current : undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "unavailable");
      // which bubbles changed colour since the last load → pulse them for a moment
      const now = {};
      const hot = new Set();
      (j.stations || []).forEach((st) => (st.activities || []).forEach((a) => { const k = bkey(a); now[k] = a.status + "@" + st.no; if (prev.current[k] && prev.current[k] !== now[k]) hot.add(k); }));
      prev.current = now;
      if (hot.size) { setChanged(hot); setTimeout(() => setChanged(new Set()), 3200); }
      setData(j);
    } catch (e) {
      setError("YWIP data is unavailable right now. Please try again in a moment.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [speed]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    // real time: every 30 s; demo speed: every few seconds so a visitor sees the work move
    const t = setInterval(load, speed === 1 ? 30000 : speed === 10 ? 4000 : 2500);
    const fs = () => { if (!document.fullscreenElement) setWall(false); };
    document.addEventListener("fullscreenchange", fs);
    return () => { window.removeEventListener("resize", onResize); clearInterval(t); document.removeEventListener("fullscreenchange", fs); };
  }, [load, speed]);
  // auto-pan: glide the row left and right, pause while a card is open or the pointer is over it
  const hover = useRef(false);
  useEffect(() => {
    if (wall || !pan) return undefined;
    let dir = 1;
    let raf;
    let last = performance.now();
    const step = (t) => {
      const el = scroller.current;
      const dt = Math.min(50, t - last);
      last = t;
      if (el && !hover.current && !card && !bubble) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          el.scrollLeft += dir * (dt * 0.045);
          if (el.scrollLeft >= max - 1) dir = -1;
          if (el.scrollLeft <= 1) dir = 1;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [wall, pan, card, bubble]);

  const d = data || {};
  const stations = useMemo(() => (data && data.stations) || [], [data]);
  const ch = d.charts || {};
  const wip = ch.wip_by_station || [];
  const thr = ch.throughput_today || [];
  const qc = ch.qc_pass || [];
  const age = ch.wip_age || [];
  const trend = ch.trend_7d || [];
  const split = ch.branch_split || {};
  const checks = d.checks || [];
  const checksOk = checks.filter((c) => c.ok).length;
  const openCard = useCallback((s, e) => { setBubble(null); setCard({ s, x: e.clientX, y: e.clientY }); }, []);
  const closeCard = useCallback(() => setCard(null), []);
  const openBubble = useCallback((a, s, e) => { e.stopPropagation(); setCard(null); setBubble({ a, s, x: e.clientX, y: e.clientY }); }, []);
  const closeBubble = useCallback(() => setBubble(null), []);
  const live = useMemo(() => stations.filter((s) => !idle(s)).length, [stations]);
  const acts = useMemo(() => stations.reduce((n, s) => n + ((s.activities || []).length), 0), [stations]);
  const ongoing = useMemo(() => stations.reduce((n, s) => n + (s.activities || []).filter((a) => a.status === "ongoing").length, 0), [stations]);
  const blocked = useMemo(() => stations.reduce((n, s) => n + (s.activities || []).filter((a) => a.status === "blocked").length, 0), [stations]);
  // the row's scale: on the wall the whole row fits the width (3 × 1920 → 0.75); otherwise a fixed height
  const panelW = vw - (document.body.classList.contains("yai-pa-open") ? 436 : 0) - 40;
  const scale = wall ? panelW / IMG_W : 0.48;
  const maxBubbles = wall ? 8 : 6;
  const laneH = 22 + maxBubbles * (BUBBLE_H + 3) + 6; // the counts line + the bubbles
  // the travel: when a flow's bubble sits at a new station since the last render, slide it there from where it
  // was (FLIP — measure before, translate back, let the transform ease to zero); colour changes just pulse
  const rects = useRef({});
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const now = {};
    el.querySelectorAll("[data-flow]").forEach((b) => { const r = b.getBoundingClientRect(); now[b.dataset.flow] = { x: r.left + el.scrollLeft, y: r.top + window.scrollY, el: b }; });
    Object.entries(now).forEach(([k, n]) => {
      const o = rects.current[k];
      if (!o || (Math.abs(o.x - n.x) < 4 && Math.abs(o.y - n.y) < 4)) return;
      const b = n.el;
      b.style.transition = "none";
      b.style.transform = `translate(${o.x - n.x}px, ${o.y - n.y}px)`;
      b.style.zIndex = 20;
      void b.offsetWidth; // flush, then ease into place
      b.style.transition = "transform 1.6s cubic-bezier(.4,0,.2,1)";
      b.style.transform = "translate(0,0)";
      setTimeout(() => { b.style.zIndex = ""; b.style.transition = ""; }, 1800);
    });
    rects.current = Object.fromEntries(Object.entries(now).map(([k, v]) => [k, { x: v.x, y: v.y }]));
  }, [data, scale]);
  const toggleWall = () => {
    if (!wall) { const el = document.documentElement; if (el.requestFullscreen) el.requestFullscreen().catch(() => {}); setWall(true); }
    else { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {}); setWall(false); }
  };

  return (
    <div ref={topRef} style={{ paddingTop: wall ? 8 : topPad }} className={`yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans ${wall ? "ywip-is-wall" : ""}`}>
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; } ${PULSE_CSS}`}</style>
      {!wall && <NavCover />}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {!wall && <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>}
        <h1 className="text-lg font-black text-white leading-none">YWIP · Work in progress</h1>
        <span className="text-xs text-slate-400">{d.day || ""} · {stations.length} stations · {live} with work today{acts ? ` · ${acts} activities, ${ongoing} ongoing${blocked ? ", " + blocked + " stuck" : ""}` : ""} · click a station or a bubble</span>
        <div className="ml-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          {(d.summary || []).map((x) => <span key={x.label} className="whitespace-nowrap">{x.label} <b className="text-white tabular-nums text-sm">{num(x.value)}</b></span>)}
        </div>
        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs" title="demo speed — the activities move through the day this many times faster">
          <span className="px-1.5 py-1 bg-slate-800 text-slate-400 flex items-center"><Gauge size={13} /></span>
          {SPEEDS.map((x) => <button key={x} onClick={() => { const n = new Date(); t0.current = String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0"); setSpeed(x); }} className={`px-2 py-1 font-bold ${speed === x ? "bg-sky-500/30 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{x}×</button>)}
        </div>
        {!wall && <button onClick={() => setPan((v) => !v)} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold ${pan ? "bg-emerald-500/20 border-emerald-500/40 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`} title="auto-pan the row">{pan ? <Pause size={13} /> : <Play size={13} />}{pan ? "panning" : "pan"}</button>}
        <button onClick={toggleWall} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold ${wall ? "bg-sky-500/20 border-sky-500/40 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}`} title="one row across the whole wall (full screen)"><Tv size={13} />{wall ? "leave the wall" : "TV wall"}</button>
        <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}

      {/* TOP — the wall: one row */}
      <div ref={scroller} onMouseEnter={() => { hover.current = true; }} onMouseLeave={() => { hover.current = false; }} className={`ywip-wall rounded-2xl border border-slate-700 ${wall ? "overflow-hidden" : "overflow-x-auto overflow-y-hidden"}`} style={{ background: "#eceeea" }}>
        {stations.length > 0 && <Wall stations={stations} scale={scale} onOpen={openCard} onBubble={openBubble} open={card && card.s.no} changed={changed} maxBubbles={maxBubbles} laneH={laneH} />}
        {stations.length === 0 && <div className="h-40 flex items-center justify-center text-sm text-slate-500">{loading ? "Loading the floor…" : "No stations."}</div>}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 mb-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1"><span className="inline-block w-5 h-3 rounded-full bg-white border border-slate-300" />pending</span>
        <span className="flex items-center gap-1"><span className="inline-block w-5 h-3 rounded-full bg-orange-500" />ongoing</span>
        <span className="flex items-center gap-1"><span className="inline-block w-5 h-3 rounded-full bg-emerald-500" />done</span>
        <span className="flex items-center gap-1"><span className="inline-block w-5 h-3 rounded-full bg-rose-600" />⚠ stuck</span>
        <span className="flex items-center gap-1"><span className="inline-block w-5 h-3 rounded-full bg-white border border-dashed border-slate-400" />planned (date)</span>
        <span>column reads from the bottom up · bubble = one order's activity at the station · it pulses when it changes colour and slides to the next station when that lot moves on · refreshes every {speed === 1 ? "30 s" : speed === 10 ? "4 s" : "2.5 s"}{speed > 1 ? ` · demo ${speed}×` : ""}</span>
        <span className="flex items-center gap-1 ml-2"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />on track</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-500" />watch</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-rose-500" />behind</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-slate-400" />nothing yet — first ex-factory 15 Oct</span>
        {!wall && stations.length > 0 && <span className="ml-auto flex items-center gap-2">mini-map <MiniMap scroller={scroller} total={IMG_W * scale} /></span>}
      </div>

      {/* BELOW — the dashboard */}
      <div className="grid gap-3 xl:grid-cols-3">
        <Panel title="WIP by station" sub="pieces / rolls waiting at each station now · red = bottleneck" className="xl:col-span-2">
          {wip.length ? <Bars data={wip} value={(x) => x.qty || 0} label={(x) => x.no} tone={(x) => (x.bottleneck ? "#f43f5e" : Number(x.no) >= 25 ? "#475569" : "#38bdf8")} height={190} /> : <div className="text-xs text-slate-500">—</div>}
        </Panel>
        <Panel title="Branch split" sub="panels and garments by route today">
          <Donut parts={[["plain", "Plain panels", "#38bdf8"], ["decorated", "Print / embroidery", "#a78bfa"], ["heat_seal", "Heat seal", "#f59e0b"], ["wash", "Washed", "#14b8a6"], ["no_wash", "No wash", "#64748b"]].map(([k, label, colour]) => ({ label, colour, value: Number(split[k]) || 0 }))} />
        </Panel>
        <Panel title="Throughput today" sub="actual (solid) against plan (dashed)" className="xl:col-span-2">
          {thr.length ? <Bars data={thr} value={(x) => x.actual || 0} plan={(x) => x.plan} label={(x) => `${x.no} ${x.title}`.slice(0, 22)} tone={(x) => ((x.actual || 0) >= (x.plan || 0) * 0.95 ? "#34d399" : (x.actual || 0) >= (x.plan || 0) * 0.8 ? "#fbbf24" : "#f43f5e")} height={190} /> : <div className="text-xs text-slate-500">—</div>}
        </Panel>
        <Panel title="QC pass rate" sub="by inspection gate today">
          <div className="space-y-1.5">
            {qc.map((g) => (
              <div key={g.gate} className="grid items-center gap-2 text-xs" style={{ gridTemplateColumns: "5.5rem 1fr 3.2rem" }}>
                <span className="text-slate-300 capitalize truncate">{String(g.gate).replace("_", " ")}</span>
                <div className="h-2.5 rounded bg-slate-900/70 overflow-hidden"><div className={`h-full rounded ${g.pass_pct >= 99 ? "bg-emerald-400" : g.pass_pct >= 96 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${Math.min(100, g.pass_pct || 0)}%` }} /></div>
                <b className="text-white tabular-nums text-right">{num(g.pass_pct)}%</b>
              </div>
            ))}
            {qc.length === 0 && <div className="text-xs text-slate-500">—</div>}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">{qc.length ? `${short(qc.reduce((a, g) => a + (g.inspected || 0), 0))} inspected · ${short(qc.reduce((a, g) => a + ((g.inspected || 0) - (g.passed || 0)), 0))} held or rejected` : ""}</div>
        </Panel>
        <Panel title="7-day trend" sub="rolls in · pieces cut · sewn · packed · shipped" className="xl:col-span-2">
          {trend.length ? <Lines data={trend} series={[["fabric_in_rolls", "rolls in", "#38bdf8"], ["cut_pcs", "cut", "#a78bfa"], ["sewn_pcs", "sewn", "#34d399"], ["packed_pcs", "packed", "#fbbf24"], ["shipped_pcs", "shipped", "#f472b6"]]} /> : <div className="text-xs text-slate-500">—</div>}
          <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-400 mt-1">{[["rolls in", "#38bdf8"], ["pieces cut", "#a78bfa"], ["sewn", "#34d399"], ["packed", "#fbbf24"], ["shipped", "#f472b6"]].map(([l, c]) => <span key={l} className="flex items-center gap-1"><span className="inline-block w-3 h-1 rounded" style={{ background: c }} />{l}</span>)}</div>
        </Panel>
        <Panel title="WIP age" sub="average and oldest days waiting">
          {age.length ? <Bars data={age} value={(x) => x.avg_days || 0} plan={(x) => x.max_days} label={(x) => x.no} tone={(x) => ((x.max_days || 0) > 20 ? "#f43f5e" : (x.max_days || 0) > 7 ? "#fbbf24" : "#38bdf8")} height={170} fmt={(v) => num(v) + "d"} /> : <div className="text-xs text-slate-500">—</div>}
          <div className="text-[10px] text-slate-500">solid = average days · dashed = oldest</div>
        </Panel>
        <Panel title="Reconciliation checks" sub={`${checksOk} of ${checks.length} ok · every figure on the floor ties to the next station`} className="xl:col-span-3">
          <button onClick={() => setShowChecks((v) => !v)} className="inline-flex items-center gap-1 text-xs text-sky-300 hover:text-white">{showChecks ? <ChevronUp size={13} /> : <ChevronDown size={13} />}{showChecks ? "hide the checks" : "show the checks"}</button>
          {showChecks && (
            <div className="mt-2 grid gap-x-6 gap-y-1 md:grid-cols-2 text-[11px]">
              {checks.map((c) => <div key={c.no} className="flex gap-2"><span className={`mt-1 inline-block w-2 h-2 rounded-full flex-shrink-0 ${c.ok ? "bg-emerald-500" : "bg-rose-500"}`} /><span className="text-slate-300"><b className="text-white tabular-nums">{c.no}.</b> {c.check} <span className="text-slate-500">— {num(c.left)} = {num(c.right)}{c.detail ? " (" + c.detail + ")" : ""}</span></span></div>)}
            </div>
          )}
        </Panel>
      </div>
      <p className="mt-2 text-[10px] text-slate-500">{d.as_of ? `As of ${String(d.as_of).replace("T", " ").slice(0, 16)} · refreshes every 30 s · ` : ""}simulated factory — invented data, no real company or person</p>
      {card && <Card s={card.s} at={card} onClose={closeCard} />}
      {bubble && <BubbleCard a={bubble.a} s={bubble.s} at={bubble} onClose={closeBubble} />}
    </div>
  );
};

export default YwipFlow;
