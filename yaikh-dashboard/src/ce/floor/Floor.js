// CE · the shared FLOOR layout — the one canonical version every CE lens uses (Machine Layout, Mechanic
// Line Plan, Machine Requirement, and the Production lenses: Line Balancing, Productivity, Team
// Performance, Skill Inventory, Learning Curve, Downtimes).
//
// TOP (at a glance): all 32 lines left to right as small drawings in their own shape (U-shape hanger line
// or zig-zag) with a dot per machine coloured by status — green / orange / red, flickering on a live line —
// the line's KPI chip for the lens, click to select.
// BOTTOM (the detail): the selected line enlarged in its shape — a circle per station (worker code and
// grade, operation, target / done, WIP behind, rejects, colour · size, status ring), flow arrows station to
// station, the fixtures (loading table, roving QC, end-of-line checkers, line leader, ironing, packing,
// trolleys) — click a circle for its card. Under the drawing, the lens body.
// Props: lens, label, onBack, renderDetail(detail, data) → the lens body, renderStation(station) → what a
// station circle shows under the worker (default: the operation), stationCard(station) → extra rows in
// the card, nav → chips to the sibling lenses. The geometry comes with the data (x / y in % of the floor).
// Data: POST /api/m1/sim/view {module:"ce", view:"floor", lens, line} → lines[32]{line, factory, order,
// garment, layout, layout_name, state, machines[{no,status,x,y}], kpi{text}, status, counts}, detail{…,
// stations[], fixtures[], lens extras}, picker, summary. Simulated factory — codes, no names.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, X, Search } from "lucide-react";
import { NavCover, useScreenTop } from "../../components/ScreenTop";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const clip = (t, n) => { const x = String(t || ""); return x.length > n ? x.slice(0, n - 1) + "…" : x; };
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: 1 }) : v === null || v === undefined ? "—" : String(v));
const DOT = { green: "#10b981", orange: "#f59e0b", amber: "#f59e0b", red: "#f43f5e", idle: "#64748b", grey: "#64748b" };
const RING = { green: "#34d399", orange: "#fbbf24", amber: "#fbbf24", red: "#fb7185", idle: "#94a3b8", grey: "#94a3b8" };
const CHIP = { green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", orange: "bg-amber-500/20 text-amber-300 border-amber-500/30", amber: "bg-amber-500/20 text-amber-300 border-amber-500/30", red: "bg-rose-500/20 text-rose-300 border-rose-500/30", grey: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
const FIX = { loading: "LOAD", roving_qc: "QC", eol_checker: "EOL", line_leader: "LL", ironing: "IRON", packing: "PACK", trolley: "TRL" };
const fixTag = (f) => FIX[f.kind] || FIX[String(f.kind || "").replace(/_\d+$/, "")] || String(f.kind || "").slice(0, 4).toUpperCase();
const CSS = "@keyframes floor-flick { 0%,100% { opacity: 1; } 50% { opacity: .35; } } .floor-live { animation: floor-flick 1.1s ease-in-out infinite; } .floor-band::-webkit-scrollbar { height: 6px; } .floor-band::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }";

/* ── a line in the top band: its machines as 50 px numbered dots (Gamini: "why so small, make it
   ×100%" → 50 px, same for every layout; DOT_PX). The card is sized around the dots: the scale comes from
   the closest pair of machines so no two dots touch, and the card takes whatever width and height
   the line then needs — the band scrolls sideways across the lines. ───────────────────────────── */
const CARD_W = 250, PAD = 12, DOT_PX = 50, DOT_GAP = 4;
const MiniLine = ({ l, on, onClick }) => {
  const live = /running/i.test(l.state || "");
  const ms = l.machines || [];
  const xs = ms.map((m) => m.x), ys = ms.map((m) => m.y);
  const bx0 = xs.length ? Math.min(...xs) : 0, bx1 = xs.length ? Math.max(...xs) : 10, by0 = ys.length ? Math.min(...ys) : 0, by1 = ys.length ? Math.max(...ys) : 10; // the machines' own box, no empty margin
  const bw = Math.max(bx1 - bx0, 1), bh = Math.max(by1 - by0, 1);
  // closest pair of machines in data units → the scale that puts DOT + DOT_GAP px between them
  let pitch = 1e9;
  for (let i = 0; i < ms.length; i++) for (let j = i + 1; j < ms.length; j++) { const d = Math.hypot(ms[i].x - ms[j].x, ms[i].y - ms[j].y); if (d < pitch) pitch = d; }
  const k = pitch < 1e8 ? (DOT_PX + DOT_GAP) / pitch : 4; // px per data unit
  const W = Math.max(CARD_W, Math.ceil(bw * k) + 2 * PAD + DOT_PX), H = Math.ceil(bh * k) + 2 * PAD + DOT_PX;
  const ox = (W - bw * k) / 2 - bx0 * k, oy = (H - bh * k) / 2 - by0 * k;
  const size = DOT_PX; // off-line dots the same
  return (
    <button onClick={onClick} title={`${l.line} · ${l.order || ""} ${l.garment || ""} · ${l.layout_name || l.layout} · ${l.state}${l.kpi && l.kpi.text ? " · " + l.kpi.text : ""}`} className={`flex-shrink-0 rounded-xl border p-2 text-left transition-colors ${on ? "border-sky-400 bg-sky-500/10 ring-1 ring-sky-400" : "border-slate-700 bg-slate-800/60 hover:border-slate-500"}`} style={{ width: W + 18 }}>
      <div className="flex items-center gap-1.5">
        <span className="font-black text-white text-sm">{l.line}</span>
        <span className={`inline-block w-2 h-2 rounded-full ${l.status === "red" ? "bg-rose-500" : l.status === "orange" || l.status === "amber" ? "bg-amber-400" : l.status === "green" ? "bg-emerald-400" : "bg-slate-500"}`} />
        <span className="text-[10px] text-slate-400 truncate">{l.order ? `${l.order} ${l.garment || ""}` : ""}</span>
        <span className="ml-auto text-[10px] text-slate-500 whitespace-nowrap">{live ? "live" : (l.state || "").replace("starts ", "→ ")}</span>
      </div>
      <div className="relative mt-1 rounded-lg bg-slate-900/50" style={{ width: W, height: H }}>
        {ms.map((m) => (
          <div key={m.no} className={`absolute rounded-full flex items-center justify-center font-black text-slate-950 ${live && m.status !== "green" ? "floor-live" : ""}`} style={{ left: m.x * k + ox - size / 2, top: m.y * k + oy - size / 2, width: size, height: size, background: DOT[m.status] || DOT.idle, fontSize: Math.round(size * 0.46), lineHeight: 1 }} title={`machine ${m.no} · ${m.status}`}>{m.no}</div>
        ))}
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[10px]">
        <span className="text-slate-500 truncate">{l.layout_name || l.layout}</span>
        {l.kpi && l.kpi.text && <span className={`ml-auto rounded-md border px-1.5 py-px font-bold whitespace-nowrap ${CHIP[l.status] || CHIP.grey}`} title={l.kpi.label + ": " + l.kpi.text}>{l.kpi.text}</span>}
      </div>
    </button>
  );
};

/* ── the selected line, enlarged: the same shape and order as the top card, one BOX per machine with
      everything inside — number, machine code, worker · grade, operation, the lens figure, and the reason
      when it is orange or red. The boxes are laid out from the data's positions and then pushed apart until
      none touch (a clear gap around every box), so the canvas grows rather than squeezes; off-line
      (preparation) positions sit right beside the station they feed with a short arrow. ──────────────── */
const BW = 26; // box width, in canvas units
const BH = 10; // box height
const GAP = 3; // clear space around every box
const SCALE = 2.3; // the data's % positions, stretched before the boxes are separated
const reasonOf = (s) => {
  if (s.machine_status === "DOWN") return `down ${num(s.down_min)} min${s.cause ? " · " + s.cause : ""}${s.mechanic ? " · " + s.mechanic : ""}`;
  if (s.state === "open") return "down now" + ((s.events || []).find((e) => e.status === "open") ? " · " + (s.events || []).find((e) => e.status === "open").cause : "");
  if (s.machine_status === "IDLE" || s.idle_reason) return "idle" + (s.idle_reason ? " · " + s.idle_reason : " · waiting for work");
  if (s.status === "red" || s.live === "red") return "breakdown — mechanic called";
  if (s.status === "orange" || s.live === "orange") return `${num(s.rejects)} rejects · WIP behind ${num(s.wip_behind)}`;
  return "";
};
// where every box goes: stretch the data's positions, put each off-line station beside the station it
// feeds, then separate overlapping boxes along the axis that needs the smaller push, until nothing touches
const layout = (stations) => {
  const byNo = Object.fromEntries(stations.map((s) => [s.no, s]));
  const pos = {};
  stations.forEach((s) => { pos[s.no] = { x: s.x * SCALE, y: s.y * SCALE }; });
  stations.filter((s) => s.offline && byNo[s.next]).forEach((s) => { const p = byNo[s.next]; pos[s.no] = { x: p.x * SCALE - (BW + GAP + 1), y: p.y * SCALE }; });
  const ids = stations.map((s) => s.no);
  const minDx = BW + GAP, minDy = BH + GAP;
  for (let it = 0; it < 400; it++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const a = pos[ids[i]], b = pos[ids[j]];
      const dx = b.x - a.x, dy = b.y - a.y;
      const ox = minDx - Math.abs(dx), oy = minDy - Math.abs(dy);
      if (ox <= 0 || oy <= 0) continue;
      moved = true;
      if (ox < oy) { const push = (ox / 2 + 0.05) * (dx >= 0 ? 1 : -1); a.x -= push; b.x += push; } else { const push = (oy / 2 + 0.05) * (dy >= 0 ? 1 : -1); a.y -= push; b.y += push; }
    }
    if (!moved) break;
  }
  return pos;
};
const Big = ({ d, renderStation, stationReason, onPick, picked }) => {
  const st = useMemo(() => d.stations || [], [d]);
  const pos = useMemo(() => layout(st), [st]);
  const xs = st.map((s) => pos[s.no].x), ys = st.map((s) => pos[s.no].y);
  const minX = (xs.length ? Math.min(...xs) : 0) - BW / 2 - 4;
  const maxXs = (xs.length ? Math.max(...xs) : 60) + BW / 2;
  const minY = (ys.length ? Math.min(...ys) : 0) - BH / 2 - 4;
  const maxY = (ys.length ? Math.max(...ys) : 60) + BH / 2 + 4;
  // fixtures: the loading table and the line leader's desk keep their place (stretched); the rest line up
  // in a column right of the last station
  const byNo = Object.fromEntries(st.map((s) => [s.no, s]));
  let lane = 0;
  const fx = [...(d.fixtures || [])].sort((a, b) => a.x - b.x || a.y - b.y).map((f) => (f.x * SCALE > maxXs + 4 || !/loading|line_leader|trolley|roving/.test(f.kind || "") ? { ...f, x: maxXs + 12, y: minY + 8 + 7 * lane++ } : { ...f, x: f.x * SCALE, y: f.y * SCALE }));
  const maxX = Math.max(maxXs, ...fx.map((f) => f.x + 6)) + 4;
  const live = !!d.running;
  const W = maxX - minX, H = Math.max(maxY, ...fx.map((f) => f.y + 4)) - minY;
  return (
    <svg viewBox={`${minX} ${minY} ${W} ${H}`} className="w-full" style={{ height: "auto", maxHeight: 1400 }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="floor-arrow" viewBox="0 0 6 6" refX="5.5" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill="#64748b" /></marker>
      </defs>
      {/* flow: each station to its next, box edge to box edge */}
      {st.map((s) => {
        const n = byNo[s.next];
        if (!n) return null;
        const a = pos[s.no], b = pos[n.no];
        const dx = b.x - a.x, dy = b.y - a.y;
        if (Math.abs(dx) > BW * 3 || Math.abs(dy) > BH * 4) return null; // no long diagonals across the line
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const sx = Math.abs(ux) * BW / 2 + Math.abs(uy) * BH / 2 + 0.6;
        return <line key={"f" + s.no} x1={a.x + ux * sx} y1={a.y + uy * sx} x2={b.x - ux * (sx + 0.8)} y2={b.y - uy * (sx + 0.8)} stroke={s.offline ? "#94a3b8" : "#475569"} strokeWidth={0.5} strokeDasharray={s.offline ? "1.5 1" : undefined} markerEnd="url(#floor-arrow)" />;
      })}
      {/* fixtures */}
      {fx.map((f, i) => (
        <g key={"x" + i}>
          <rect x={f.x - 5} y={f.y - 2.4} width={10} height={4.8} rx={0.9} fill="#1e293b" stroke="#475569" strokeWidth={0.35} />
          <text x={f.x} y={f.y + 0.9} textAnchor="middle" fontSize={2.3} fontWeight={700} fill="#cbd5e1">{fixTag(f)}</text>
          <title>{f.label}{f.staff ? ` · ${f.staff} (${f.staff_grade})` : ""}</title>
        </g>
      ))}
      {/* one box per machine */}
      {st.map((s) => {
        const tone = s.status || s.live || "idle";
        const on = picked === s.no;
        const fig = renderStation ? renderStation(s) : "";
        const reason = (stationReason && stationReason(s)) || reasonOf(s);
        const p = pos[s.no];
        const x0 = p.x - BW / 2, y0 = p.y - BH / 2;
        const warn = tone === "red" || tone === "orange";
        return (
          <g key={s.no} onClick={() => onPick(s)} className="cursor-pointer">
            <rect x={x0} y={y0} width={BW} height={BH} rx={1.2} fill={on ? "#172554" : s.offline ? "#111827" : "#0f172a"} stroke={RING[tone] || RING.idle} strokeWidth={warn || on ? 0.8 : 0.45} strokeDasharray={s.offline ? "1.6 1" : undefined} className={live && warn ? "floor-live" : ""} />
            <circle cx={x0 + 2.6} cy={y0 + 2.5} r={1.7} fill={DOT[tone] || DOT.idle} />
            <text x={x0 + 2.6} y={y0 + 3.1} textAnchor="middle" fontSize={1.8} fontWeight={800} fill="#0f172a">{s.no}</text>
            <text x={x0 + 5.2} y={y0 + 3.15} fontSize={1.75} fontWeight={800} fill="#fff">{clip(`${s.machine_code || ""} · ${s.worker || ""}${s.worker_grade ? " · " + s.worker_grade : ""}${s.offline ? " · off-line" : ""}`, 24)}</text>
            <text x={x0 + 1.2} y={y0 + 5.5} fontSize={1.6} fill="#cbd5e1">{clip(s.operation, 30)}</text>
            <text x={x0 + 1.2} y={y0 + 7.4} fontSize={1.5} fill="#94a3b8">{clip(typeof fig === "string" ? fig : "", 32)}</text>
            {reason ? <text x={x0 + 1.2} y={y0 + 9.2} fontSize={1.45} fontWeight={700} fill={tone === "red" ? "#fda4af" : "#fcd34d"}>{clip(reason, 34)}</text> : s.offline && s.next ? <text x={x0 + 1.2} y={y0 + 9.2} fontSize={1.4} fill="#64748b">off-line → feeds station {s.next}</text> : null}
            <title>{`${s.no} ${s.operation} · ${s.machine} (${s.machine_id}) · ${s.worker} ${s.worker_grade} · target ${num(s.target_now)} · done ${num(s.done)} · WIP behind ${num(s.wip_behind)} · rejects ${num(s.rejects)} · ${s.colour || ""} ${s.size || ""}${reason ? " · " + reason : ""}`}</title>
          </g>
        );
      })}
    </svg>
  );
};

/* ── the station card ───────────────────────────────────────────────────── */
const StationCard = ({ s, onClose, extra }) => {
  useEffect(() => {
    const key = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  const tone = s.status || s.live || "idle";
  const rows = [["Operation", s.operation], ["Machine", `${s.machine}${s.machine_id ? " · " + s.machine_id : ""}`], ["Model", s.model], ["Presser foot", s.presser_foot], ["Attachment", s.attachment], ["Needle", s.needle], ["LED", s.led_light === undefined ? undefined : s.led_light ? "on" + (s.led_reason ? " — " + s.led_reason : "") : "off"], ["Worker", s.worker ? `${s.worker} · grade ${s.worker_grade}` : undefined], ["Target / h", s.target_ph], ["Target today", s.target_today], ["Target now", s.target_now], ["Done", s.done], ["WIP behind", s.wip_behind], ["Rejects", s.rejects], ["Colour · size", [s.colour, s.size].filter(Boolean).join(" · ") || undefined], ["Machine status", s.machine_status], ["Down", s.machine_status === "DOWN" ? `${num(s.down_min)} min · ${s.cause || ""}${s.mechanic ? " · " + s.mechanic : ""}` : undefined], ["Idle", s.idle_reason || undefined], ["Next", s.next]].filter(([, v]) => v !== undefined && v !== null && v !== "");
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed z-50 left-1/2 top-24 -translate-x-1/2 w-[360px] max-h-[75vh] overflow-auto rounded-2xl border border-slate-600 bg-slate-800 shadow-2xl text-slate-200">
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-slate-700">
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: "#0f172a", boxShadow: `0 0 0 2px ${RING[tone] || RING.idle}` }}>{s.no}</span>
          <span className="font-black text-white">{s.operation}</span>
          <span className={`ml-auto inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold ${CHIP[tone] || CHIP.grey}`}>{s.machine_status || tone}</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700" aria-label="Close"><X size={14} /></button>
        </div>
        <div className="px-3 py-2">
          {rows.map(([k, v]) => <div key={k} className="flex items-baseline gap-2 py-0.5 border-b border-slate-700/60 last:border-b-0 text-xs"><span className="text-slate-400 w-24 flex-shrink-0">{k}</span><b className="text-white min-w-0">{num(v)}</b></div>)}
          {extra}
        </div>
      </div>
    </>
  );
};

/* ── the screen ─────────────────────────────────────────────────────────── */
const Floor = ({ lens, label, onBack, renderDetail, renderStation, stationReason, stationCard, nav, refresh = 60000 }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [line, setLine] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState(null);
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ce", view: "floor", lens, line: line || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "unavailable");
      setData(j);
    } catch (e) {
      setError("Floor data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [lens, line]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!refresh) return undefined; const t = setInterval(load, refresh); return () => clearInterval(t); }, [load, refresh]);
  useEffect(() => { setPicked(null); }, [line, lens]);

  const d = data || {};
  const lines = useMemo(() => (data && data.lines) || [], [data]);
  const selected = (d.detail && d.detail.line) || d.line || line || (lines[0] && lines[0].line) || "";
  const shown = useMemo(() => { const s = q.trim().toLowerCase(); return s ? lines.filter((l) => `${l.line} ${l.order} ${l.garment} ${l.factory} ${l.state}`.toLowerCase().includes(s)) : lines; }, [lines, q]);
  const det = d.detail;
  const pickedStation = picked && det ? (det.stations || []).find((s) => s.no === picked.no) || picked : null;

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 484px; } ${CSS}`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">{label}</h1>
        {nav && <div className="flex flex-wrap gap-1">{nav.map((n) => <button key={n.view} onClick={() => navigate("/dashboard/ce/" + n.view)} className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${n.lens === lens ? "bg-white text-slate-900 border-white" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"}`} title={n.sub}>{n.title}</button>)}</div>}
        <div className="ml-auto flex flex-wrap gap-x-3 text-xs text-slate-400">{(d.summary || []).map((x) => <span key={x.label} className="whitespace-nowrap">{x.label} <b className="text-white">{num(x.value)}</b></span>)}</div>
        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1"><Search size={13} className="text-slate-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Line, order…" className="bg-transparent outline-none text-xs w-28 text-white placeholder-slate-500" /></div>
        <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm flex items-center gap-2">{error}<button onClick={load} className="rounded border border-amber-400/50 px-2 py-0.5 text-xs font-bold hover:bg-amber-500/10">Retry</button></div>}

      {/* TOP — every line at a glance */}
      <div className="floor-band flex items-start gap-1.5 overflow-x-auto pb-1.5 mb-3">
        {shown.map((l) => <MiniLine key={l.line} l={l} on={l.line === selected} onClick={() => setLine(l.line)} />)}
        {shown.length === 0 && <div className="text-xs text-slate-500 py-4">{loading ? "Loading the floor…" : "No lines."}</div>}
      </div>

      {/* BOTTOM — the selected line in detail */}
      {det ? (
        <div className="grid gap-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1 text-xs text-slate-400">
              <span className="text-base font-black text-white">{det.line}</span>
              <span>{det.factory}</span>
              {det.order && <span><b className="text-white">{det.order}</b> · {det.style || det.garment}{det.colour ? " · " + det.colour : ""}</span>}
              <span>{det.layout_name || det.layout}</span>
              <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold ${CHIP[det.status] || CHIP.grey}`}>{det.state}</span>
              {det.run && <span>run {det.run}</span>}
              {det.smv !== undefined && <span>SMV <b className="text-white">{det.smv}</b></span>}
              {det.target_day !== undefined && <span>target <b className="text-white">{num(det.target_day)}</b>/day · {num(det.target_ph)}/h</span>}
              {det.running && <span>output now <b className="text-white">{num(det.output_now)}</b> / {num(det.target_now)}</span>}
              {det.defects !== undefined && <span>defects <b className="text-amber-300">{num(det.defects)}</b></span>}
              {det.operators !== undefined && <span>operators <b className="text-white">{num(det.operators)}</b>{det.headcount && det.headcount.indirect ? ` + ${Object.values(det.headcount.indirect).reduce((a, b) => a + (b || 0), 0)} indirect` : ""}</span>}
              {det.kpi && det.kpi.text && <span className={`ml-auto inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold ${CHIP[det.status] || CHIP.grey}`} title={det.kpi.label}>{det.kpi.text}</span>}
            </div>
            <Big d={det} renderStation={renderStation} stationReason={stationReason} onPick={setPicked} picked={picked && picked.no} />
            <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-500 mt-1">
              <span>one box per machine — number, machine code · worker · grade, operation, the lens figure, and why when it is amber or red · same positions as the line card above</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />on target</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-400" />defects / idle</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-rose-500" />breakdown</span>
              <span>arrows = flow to the next station · small boxes = fixtures (LOAD loading table, QC roving QC, EOL end-of-line checker, LL line leader, IRON, PACK, TRL trolley) · click a machine for its card</span>
            </div>
          </div>
          {renderDetail && renderDetail(det, d)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">{loading ? "Loading the line…" : error ? "" : "Pick a line."}</div>
      )}
      <p className="mt-2 text-[10px] text-slate-500">{d.as_of ? `As of ${String(d.as_of).replace("T", " ").slice(0, 16)} · ` : ""}simulated factory — worker and machine codes only, no real person</p>
      {pickedStation && <StationCard s={pickedStation} onClose={() => setPicked(null)} extra={stationCard ? stationCard(pickedStation, det) : null} />}
    </div>
  );
};

export default Floor;
