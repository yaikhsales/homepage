// CE · Production · Line Planning — construct the line layout.
//
// This is the FIRST step, before any balancing: how many workers → the work
// divided per worker → drag those workstations onto the physical line → confirm.
// No balance efficiency, no bottleneck, no load bars: that is the separate Line
// Balancing screen, which checks a line that is already running.
//
// The canvas is drawn to scale in metres from the template the IE picks
// (U-line 6.0 × 18 m, Zigzag mini line 2.4 × 18 m, Traditional long line
// 3.0 × 24 m). x_m runs west → east across the line, y_m from the loading end
// (south) to the end of line (north), so the drawing matches the floor. The
// fixed tables come with the template — loading table, the movable in-line
// roving QC, two end-of-line checkers, the line leader's desk with a computer,
// the ironing and packing tables, and the bundle trolleys beside the line.
//
// Data: POST /api/m1/sim/view {"module":"ce","view":"line-planning", order|style,
// line, workers} and {"view":"line-planning-save", …, status:"draft"|"confirmed"}.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw, Save, CheckCircle2, Lightbulb, Wand2, Ruler } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

const num = (v, d = 0) => (typeof v === "number" ? v.toFixed(d) : v == null ? "—" : String(v));

// Fixtures are tables, not machines, so they are drawn differently.
const FIXTURE_TONE = {
  loading: "bg-sky-500/20 text-sky-100 ring-sky-400/40",
  roving_qc: "bg-amber-500/20 text-amber-100 ring-amber-400/50",
  eol_checker_1: "bg-emerald-500/20 text-emerald-100 ring-emerald-400/40",
  eol_checker_2: "bg-emerald-500/20 text-emerald-100 ring-emerald-400/40",
  line_leader: "bg-violet-500/20 text-violet-100 ring-violet-400/40",
  ironing: "bg-orange-500/20 text-orange-100 ring-orange-400/40",
  packing: "bg-orange-500/20 text-orange-100 ring-orange-400/40",
  trolley: "bg-slate-500/20 text-slate-200 ring-slate-400/40",
};
const fixtureTone = (f) => FIXTURE_TONE[f.kind] || (String(f.key).startsWith("trolley") ? FIXTURE_TONE.trolley : "bg-slate-700/80 text-slate-100 ring-white/15");

const LinePlanning = ({ onBack }) => {
  const [topRef, topPad] = useScreenTop();
  const [order, setOrder] = useState("YAIAA6");
  const [line, setLine] = useState("L01");
  const [workers, setWorkers] = useState(34);
  const [templateKey, setTemplateKey] = useState("u-shape");
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState({});        // slot -> ws
  const [fixtures, setFixtures] = useState([]);
  const [dragWs, setDragWs] = useState(null);
  const [dragFix, setDragFix] = useState(null);
  const [scale, setScale] = useState(true);
  const [saved, setSaved] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setNote("");
    setSaved("");
    try {
      const r = await fetch(API + "/sim/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "ce", view: "line-planning", order: order || undefined, line: line || undefined, workers, template: templateKey }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setData(j);
      const sug = j.suggested_layout || {};
      if (sug.template && Array.isArray(j.templates) && j.templates.some((t) => t.key === sug.template)) setTemplateKey(sug.template);
      const next = {};
      (sug.placements || []).forEach((p) => {
        (p.slots && p.slots.length ? p.slots : [p.slot]).forEach((s) => { if (s != null) next[s] = p.ws; });
      });
      setPlaced(next);
      setFixtures(sug.fixtures && sug.fixtures.length ? sug.fixtures : (j.fixtures || []));
    } catch (e) {
      setData(null);
      setNote("The line-planning view did not answer — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [order, line, workers, templateKey]);

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [order, line, workers]);

  const rows = (data && data.rows) || [];
  const palette = (data && data.machine_palette) || [];
  const assignment = (data && data.assignment) || {};
  const stations = assignment.workstations || [];
  const headcount = (data && data.headcount) || {};
  const style = (data && data.style) || {};
  const templates = (data && data.templates) || [];
  const template = templates.find((t) => t.key === templateKey) || templates[0] || null;
  const dims = (template && template.dims) || { width_m: 6, length_m: 18 };
  const foot = dims.footprint_m || { width: dims.width_m + 4, length: dims.length_m + 2 };

  const slots = (template && template.slots) || [];
  const byWs = useMemo(() => Object.fromEntries(stations.map((s) => [String(s.ws), s])), [stations]);
  const byOp = useMemo(() => Object.fromEntries(rows.map((r) => [String(r.no), r])), [rows]);
  const placedWs = useMemo(() => new Set(Object.values(placed).map(String)), [placed]);
  const unplaced = stations.filter((s) => !placedWs.has(String(s.ws)));

  // metres → percent of the drawing area; the canvas is as tall as the line needs so a workstation box
  // (about 50 px) always fits between two slots (station pitch 0.9 m on the U and zigzag, 1.2 m straight)
  const px = (x) => ((x + 1.2) / foot.width) * 100;
  const py = (y) => 100 - ((y + 2.2) / foot.length) * 100;
  const pxPerM = Math.max(31, 54 / (dims.station_pitch_m || 0.9));
  const canvasH = Math.round(foot.length * pxPerM);
  const offline = (sl) => sl.x_m < 0 || sl.slot > 40;
  // a box is 150 px wide, except where slots sit side by side on the same row (the U-turn): there it is
  // as wide as the slot step, so neighbours never touch
  const boxW = (sl) => { let step = null; slots.forEach((o) => { if (o.slot === sl.slot || Math.abs(o.y_m - sl.y_m) > 0.05) return; const dx = Math.abs(o.x_m - sl.x_m); if (dx > 0 && dx < 1.6 && (step === null || dx < step)) step = dx; }); return step ? `${(step / foot.width) * 100 - 0.5}%` : 150; };

  const dropOnSlot = (slot) => {
    if (dragWs == null) return;
    setPlaced((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => { if (String(next[k]) === String(dragWs)) delete next[k]; });
      next[slot] = dragWs;
      return next;
    });
    setDragWs(null);
  };

  const fillSuggested = () => {
    const sug = (data && data.suggested_layout) || {};
    const next = {};
    (sug.placements || []).forEach((p) => {
      (p.slots && p.slots.length ? p.slots : [p.slot]).forEach((s) => { if (s != null) next[s] = p.ws; });
    });
    setPlaced(next);
  };

  const save = async (confirmIt) => {
    setSaved("");
    try {
      const r = await fetch(API + "/sim/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "ce", view: "line-planning-save",
          order, line, template: templateKey,
          placements: Object.entries(placed).map(([slot, ws]) => ({ slot: Number(slot), ws })),
          fixtures,
          status: confirmIt ? "confirmed" : "draft",
          by: "IE-02",
        }),
      });
      const j = await r.json();
      if (r.ok && j.ok) {
        setSaved(confirmIt
          ? "Confirmed — sent to the 4DP line plan and the mechanic line plan."
          : "Draft saved.");
      } else {
        setSaved((j && (j.error || j.detail)) || "Not saved.");
      }
    } catch (e) {
      setSaved("Saving is unavailable right now — the layout stays on this screen.");
    }
  };

  // the flow: in-line slots that carry a workstation, in slot order; between two of them the arrow runs
  // along the template's slot path (slot to slot) instead of one long diagonal. Off-line slots sit beside
  // the line and feed the nearest in-line slot with a short dashed arrow.
  const inline = slots.filter((sl) => !offline(sl));
  const flow = inline.filter((sl) => placed[sl.slot] != null);
  const pathBetween = (a, b) => inline.filter((sl) => sl.slot >= a.slot && sl.slot <= b.slot);
  const feeds = (sl) => { let best = null; inline.forEach((x) => { if (placed[x.slot] == null) return; const dd = Math.abs(x.y_m - sl.y_m); if (!best || dd < best.d) best = { d: dd, x }; }); return best && best.x; };

  return (
    <div ref={topRef} className="yai-pa-aware min-h-screen bg-slate-900 text-white" style={{ paddingTop: topPad }}>
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 484px; }`}</style>
      <NavCover />
      <div className="mx-auto max-w-[1800px] px-4 pb-10">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <button onClick={onBack} aria-label="Back"><ArrowLeft /></button>
          <h1 className="text-lg font-bold">IE Production Line Plan — construct the line layout</h1>
          <span className="text-xs text-slate-400">
            {style.order ? `${style.order} · ${style.style} · ${style.line || line} · SAM ${num(style.sam, 2)} min` : "pick an order"}
          </span>
          {note && <span className="text-xs text-amber-300">{note}</span>}
          <button onClick={load} title="Reload" className="ml-auto rounded-lg bg-white/5 p-2 text-slate-300 ring-1 ring-white/10 hover:bg-white/10">
            <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
          </button>
        </div>

        {/* step 1 — the question that drives everything */}
        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">Order / style</span>
            <input value={order} onChange={(e) => setOrder(e.target.value.toUpperCase())}
                   className="w-32 rounded-lg bg-slate-800 px-3 py-1.5 text-sm ring-1 ring-white/10 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">Line</span>
            <input value={line} onChange={(e) => setLine(e.target.value.toUpperCase())}
                   className="w-24 rounded-lg bg-slate-800 px-3 py-1.5 text-sm ring-1 ring-white/10 focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">How many workers?</span>
            <input type="number" min={1} value={workers}
                   onChange={(e) => setWorkers(Math.max(1, Number(e.target.value) || 1))}
                   className="w-28 rounded-lg bg-slate-800 px-3 py-1.5 text-sm tabular-nums ring-1 ring-white/10 focus:outline-none" />
          </label>
          <button onClick={load} className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold hover:bg-sky-500">
            <Wand2 className="h-4 w-4" /> Divide the work
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => save(false)} className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15">
              <Save className="h-4 w-4" /> Save draft
            </button>
            <button onClick={() => save(true)} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold hover:bg-emerald-500">
              <CheckCircle2 className="h-4 w-4" /> Confirm
            </button>
          </div>
        </div>
        {saved && <p className="mb-3 text-sm text-emerald-300">{saved}</p>}

        <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
          {/* left — what the IE picks from */}
          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-300">
                Workstations <span className="font-normal normal-case text-slate-500">— drag onto the line</span>
              </h2>
              {stations.length === 0 ? (
                <p className="text-xs text-slate-500">Enter the worker count to divide the work.</p>
              ) : (
                <ul className="flex max-h-[420px] flex-col gap-1 overflow-y-auto pr-1">
                  {stations.map((s) => {
                    const on = placedWs.has(String(s.ws));
                    return (
                      <li key={s.ws} draggable onDragStart={() => setDragWs(s.ws)}
                          className={`cursor-grab rounded-lg px-2.5 py-1.5 text-xs ring-1 ${on ? "bg-slate-800/40 text-slate-400 ring-white/5" : "bg-slate-800 ring-sky-500/30"}`}>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-bold text-sky-300">WS {s.ws}</span>
                        </div>
                        <div className="leading-tight text-slate-100">
                          {(s.ops || []).map((o) => `${o.no}. ${o.operation}`).join(" + ")}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {s.machine_name || s.machine}
                          {s.workers > 1 ? ` · ${s.workers} workers` : ""}
                          {s.skill ? ` · ${s.skill}` : ""}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-300">Operation breakdown</h2>
              {rows.length === 0 ? <p className="text-xs text-slate-500">—</p> : (
                <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto pr-1">
                  {rows.map((r) => (
                    <li key={r.no} className="rounded-lg bg-slate-800/70 px-2.5 py-1.5 text-xs ring-1 ring-white/5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-slate-100">{r.no}. {r.operation}</span>
                        <span className="tabular-nums text-slate-400">{num(r.sam, 2)} min</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {r.machine} · {r.hourly_target}/h · {r.grade}
                        {r.attachment && r.attachment !== "none" ? ` · ${r.attachment}` : ""}
                        {r.led_light ? " · LED" : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-300">Machine palette</h2>
              {palette.length === 0 ? <p className="text-xs text-slate-500">—</p> : (
                <ul className="flex flex-col gap-1">
                  {palette.map((m) => (
                    <li key={m.code + m.type} className="flex items-center justify-between gap-2 rounded-lg bg-slate-800/70 px-2.5 py-1.5 text-xs ring-1 ring-white/5">
                      <span className="truncate text-slate-200" title={m.type}>{m.code} · {m.type}</span>
                      <span className={`whitespace-nowrap tabular-nums font-bold ${m.short > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                        {m.needed} / {m.available_in_line}{m.short > 0 ? ` (+${m.short})` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>

          {/* right — the physical line */}
          <section className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {templates.map((t) => (
                <button key={t.key} onClick={() => setTemplateKey(t.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm ring-1 ${templateKey === t.key ? "bg-white text-slate-900 ring-white" : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"}`}>
                  {t.title || t.key}
                  {t.dims ? <span className="ml-1.5 text-[11px] opacity-70">{num(t.dims.width_m, 1)}×{num(t.dims.length_m, 0)} m</span> : null}
                </button>
              ))}
              <button onClick={() => setScale((v) => !v)}
                className={`ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs ring-1 ${scale ? "bg-white/15 text-white ring-white/25" : "bg-white/5 text-slate-300 ring-white/10"}`}>
                <Ruler className="h-3.5 w-3.5" /> Scale view
              </button>
              <button onClick={fillSuggested} disabled={!stations.length}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 hover:bg-white/15 disabled:opacity-40">
                Fill from the suggestion
              </button>
            </div>

            <div className="relative w-full rounded-xl bg-slate-950/70 ring-1 ring-white/10" style={{ height: canvasH }}>
              {/* grid, dimensions and the north arrow */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full">
                <defs>
                  <marker id="lp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="#22c55e" />
                  </marker>
                </defs>
                {scale && Array.from({ length: Math.ceil(foot.length / 2) + 1 }).map((_, i) => (
                  <g key={i}>
                    <line x1="0" y1={`${py(i * 2)}%`} x2="100%" y2={`${py(i * 2)}%`} stroke="#1e293b" strokeWidth="1" />
                    <text x="6" y={`${py(i * 2)}%`} dy="-3" fontSize="9" fill="#475569">{i * 2} m</text>
                  </g>
                ))}
                {flow.slice(0, -1).map((s, i) => {
                  const b = flow[i + 1];
                  const path = pathBetween(s, b);
                  return path.slice(0, -1).map((q, k) => {
                    const n = path[k + 1];
                    return <line key={`${s.slot}-${q.slot}`} x1={`${px(q.x_m)}%`} y1={`${py(q.y_m)}%`} x2={`${px(n.x_m)}%`} y2={`${py(n.y_m)}%`} stroke="#22c55e" strokeOpacity="0.7" strokeWidth="2" markerEnd={k === path.length - 2 ? "url(#lp-arrow)" : undefined} />;
                  });
                })}
                {slots.filter((sl) => offline(sl) && placed[sl.slot] != null).map((sl) => {
                  const t = feeds(sl);
                  if (!t) return null;
                  return <line key={"o" + sl.slot} x1={`${px(sl.x_m)}%`} y1={`${py(sl.y_m)}%`} x2={`${px(t.x_m)}%`} y2={`${py(t.y_m)}%`} stroke="#94a3b8" strokeDasharray="4 3" strokeWidth="1.5" markerEnd="url(#lp-arrow)" />;
                })}
                <g transform="translate(28,30)">
                  <path d="M0,16 L0,-10 M-5,-4 L0,-12 L5,-4" stroke="#94a3b8" strokeWidth="1.6" fill="none" />
                  <text x="0" y="28" fontSize="9" fill="#94a3b8" textAnchor="middle">N</text>
                </g>
                {scale && template && (
                  <text x="50%" y="16" textAnchor="middle" fontSize="10" fill="#64748b">
                    {template.title} · line {num(dims.width_m, 1)} × {num(dims.length_m, 0)} m · pitch {num(dims.station_pitch_m, 2)} m
                  </text>
                )}
              </svg>

              {/* fixtures: tables, drawn differently from machines */}
              {fixtures.map((f) => (
                <div key={f.key}
                  draggable={Boolean(f.movable)}
                  onDragStart={() => f.movable && setDragFix(f.key)}
                  onDragEnd={(e) => {
                    if (!dragFix) return;
                    const box = e.currentTarget.parentElement.getBoundingClientRect();
                    const xm = ((e.clientX - box.left) / box.width) * foot.width - 1.2;
                    const ym = (1 - (e.clientY - box.top) / box.height) * foot.length - 2.2;
                    setFixtures((prev) => prev.map((p) => (p.key === dragFix ? { ...p, x_m: Math.max(0, xm), y_m: ym } : p)));
                    setDragFix(null);
                  }}
                  title={f.movable ? "Drag to move it along the line" : f.label}
                  className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 text-[10px] font-semibold leading-tight ring-1 ${fixtureTone(f)} ${f.movable ? "cursor-grab" : ""}`}
                  style={{ left: `${px(f.x_m)}%`, top: `${py(f.y_m)}%`, width: 96 }}>
                  <span className="mb-0.5 block h-1.5 w-full rounded-[2px] bg-white/70" aria-hidden="true" />
                  {f.label}
                  {f.movable ? <span className="block text-[9px] opacity-80">movable</span> : null}
                </div>
              ))}

              {/* the slots and what is placed on them */}
              {slots.map((s) => {
                const ws = placed[s.slot];
                const st = ws != null ? byWs[String(ws)] : null;
                const first = st && (st.ops || [])[0];
                const op = first ? byOp[String(first.no)] : null;
                const firstSlotOfWs = st && slots.find((x) => placed[x.slot] === ws) === s;
                return (
                  <div key={s.slot}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dropOnSlot(s.slot)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg text-[10px] ring-1 transition-colors ${
                      st ? "z-20 bg-slate-800 ring-sky-500/60" : "bg-slate-900/60 ring-white/10"}`}
                    style={{ left: `${px(s.x_m)}%`, top: `${py(s.y_m)}%`, width: st ? boxW(s) : 30, padding: st ? 5 : 2, maxHeight: st ? Math.round(pxPerM * (dims.station_pitch_m || 0.9)) - 6 : undefined, overflow: "hidden" }}>
                    {!st ? (
                      <div className="text-center text-[9px] text-slate-600">{s.slot}</div>
                    ) : firstSlotOfWs ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-sky-300">WS {st.ws}</span>
                          <span className="tabular-nums text-slate-400">{""}</span>
                        </div>
                        <div className="truncate font-semibold leading-tight text-slate-100" title={(st.ops || []).map((o) => o.operation).join(" + ")}>
                          {(st.ops || []).map((o) => o.operation).join(" + ")}
                        </div>
                        <div className="truncate text-slate-400" title={st.machine_name || st.machine}>{st.machine}{offline(s) ? " · off-line" : ""}</div>
                        <div className="flex flex-wrap items-center gap-1 text-[9px]">
                          <span className="rounded bg-white/10 px-1 py-0.5 text-slate-200">{st.workers || 1} op</span>
                          {st.skill ? <span className="rounded bg-white/10 px-1 py-0.5 text-slate-200">{st.skill.split("—")[0].trim()}</span> : null}
                          {op && op.attachment && op.attachment !== "none"
                            ? <span className="rounded bg-amber-500/20 px-1 py-0.5 text-amber-200" title={op.attachment_detail || op.attachment}>{op.attachment}</span> : null}
                          {op && op.needle ? <span className="rounded bg-white/10 px-1 py-0.5 text-slate-300" title={op.needle}>needle</span> : null}
                          {op && op.led_light ? <Lightbulb className="h-3 w-3 text-yellow-300" title={op.led_reason || "LED light needed"} /> : null}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-[9px] text-sky-300">WS {st.ws}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {unplaced.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400">Not on the line yet:</span>
                {unplaced.map((s) => (
                  <span key={s.ws} draggable onDragStart={() => setDragWs(s.ws)}
                        className="cursor-grab rounded-full bg-slate-800 px-2.5 py-1 text-xs ring-1 ring-sky-500/30">WS {s.ws}</span>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* footer — construction facts only, no balancing */}
        <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-2xl bg-white/5 px-4 py-3 text-sm ring-1 ring-white/10">
          {[
            ["Total SAM", style.sam != null ? `${num(style.sam, 2)} min` : "—"],
            ["Workstations", stations.length || "—"],
            ["Placed", `${placedWs.size} of ${stations.length || 0}`],
            ["Sewing operators (direct)", headcount.direct ?? "—"],
            ["Indirect", headcount.indirect_total != null
              ? `${headcount.indirect_total} — roving QC, 2 checkers, line leader` : "—"],
          ].map(([k, v]) => (
            <span key={k} className="whitespace-nowrap text-slate-400">{k} <b className="ml-1 text-white tabular-nums">{v}</b></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinePlanning;
