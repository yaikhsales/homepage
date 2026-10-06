// YWIP — the work-in-progress flow of the whole factory on one screen.
//
// TOP: Gamini's own isometric floor strip (public/assets/ywip/floor-strip.png — light-grey dotted floor,
// white platforms, stations 01–32 with the heat-seal branch under 11–15), shown in two rows so every
// station is on screen with no horizontal scroll: 01–16 on the first row, 17–32 on the second. Each
// station is a hotspot: a figure chip under its pill (the headline number, coloured by status) and a
// click opens its status card with every figure and a link to the module screen. Stations with nothing
// yet (packing onwards until the first ex-factory) are grey and calm.
// BELOW: the dashboard — WIP by station, throughput today against plan, QC pass by gate, WIP age,
// the 7-day trend, the branch split and the reconciliation checks. All drawn as SVG, no chart library.
// Data: the simulated factory on the M1, POST /api/m1/sim/view {module:"fc", view:"ywip-flow"} →
// stations[32], flows, checks, charts. Invented data — no real company or person.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const STRIP = process.env.PUBLIC_URL + "/assets/ywip/floor-strip.png";
const IMG_W = 7680; // the strip's pixels
const IMG_H = 608;
const SPLIT = 3680; // row 1 = 0 … 3680 (stations 01–16), row 2 = 3680 … 7680 (17–32)
const CHIP_H = 44; // room under the strip for the figure chips (in strip pixels)
// Where each station's label pill sits in the strip (x = pill centre, y = pill centre); 14 and 15 are
// the heat-seal branch on the lower row of the first half.
const PILL_X = [144, 384, 624, 864, 1104, 1344, 1584, 1824, 2064, 2355, 2688, 2979, 3312, 3552, 3792, 4082, 4416, 4656, 4896, 5136, 5376, 5616, 5856, 6096, 6336, 6576, 6816, 7056, 7296, 7536];
const PILLS = {};
[...Array(13)].forEach((_, i) => { PILLS[String(i + 1).padStart(2, "0")] = { x: PILL_X[i], y: 331, top: 50, bottom: 350 }; });
PILLS["14"] = { x: 3080, y: 567, top: 375, bottom: 585 };
PILLS["15"] = { x: 3320, y: 567, top: 375, bottom: 585 };
[...Array(17)].forEach((_, i) => { PILLS[String(i + 16).padStart(2, "0")] = { x: PILL_X[i + 13], y: 331, top: 50, bottom: 350 }; });

const TONE = { green: "border-emerald-500 text-emerald-700", amber: "border-amber-500 text-amber-700", red: "border-rose-500 text-rose-700", grey: "border-slate-300 text-slate-400" };
const DOT = { green: "bg-emerald-500", amber: "bg-amber-500", red: "bg-rose-500", grey: "bg-slate-400" };
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
const idle = (s) => (s.figures || []).every((f) => f.value === 0 || f.value === "—" || f.value === null) && Number(s.no) >= 20;

/* ── the strip with its hotspots ────────────────────────────────────────── */
const Strip = ({ stations, width, onOpen, open }) => {
  const scale = width / (IMG_W - SPLIT); // row 2 is the wider half (4000 px) → it fills the width
  const rowH = (IMG_H + CHIP_H) * scale;
  const byNo = Object.fromEntries(stations.map((s) => [s.no, s]));
  const row = (from, to) => {
    const w = (to - from) * scale;
    return (
      <div className="relative" style={{ width: w, height: rowH, backgroundImage: `url(${STRIP})`, backgroundSize: `${IMG_W * scale}px ${IMG_H * scale}px`, backgroundPosition: `${-from * scale}px 0`, backgroundRepeat: "no-repeat" }}>
        {Object.entries(PILLS).filter(([, p]) => p.x >= from && p.x < to).map(([no, p]) => {
          const s = byNo[no];
          if (!s) return null;
          const grey = idle(s);
          const tone = grey ? "grey" : s.status || "grey";
          const f = (s.figures || [])[0];
          const x = (p.x - from) * scale;
          const on = open === no;
          return (
            <React.Fragment key={no}>
              {/* the hotspot over the platform and its pill */}
              <button onClick={(e) => onOpen(s, e)} title={`${no} ${s.title}`} aria-label={`${no} ${s.title}`} className={`absolute rounded-xl transition-colors ${on ? "ring-2 ring-sky-400 bg-sky-400/10" : "hover:bg-sky-400/10"}`} style={{ left: x - 112 * scale, top: p.top * scale, width: 224 * scale, height: (p.bottom - p.top) * scale }} />
              {/* the headline figure under the pill */}
              <button onClick={(e) => onOpen(s, e)} className={`absolute -translate-x-1/2 whitespace-nowrap rounded-full border-2 bg-white px-2 leading-5 text-[11px] font-black shadow ${TONE[tone]} ${grey ? "opacity-70" : ""}`} style={{ left: x, top: (p.y + 22) * scale + 4 }} title={f ? `${f.label}: ${num(f.value)} ${f.unit || ""}` : s.title}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle ${DOT[tone]}`} />
                {chip(f)}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  };
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700" style={{ background: "#eceeea" }}>
      {row(0, SPLIT)}
      {row(SPLIT, IMG_W)}
    </div>
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
  const [showChecks, setShowChecks] = useState(false);
  const [width, setWidth] = useState(0);
  const stripRef = useCallback((el) => { if (el) setWidth(el.getBoundingClientRect().width); }, []);
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "fc", view: "ywip-flow" }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "unavailable");
      setData(j);
    } catch (e) {
      setError("YWIP data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const onResize = () => { const el = document.getElementById("ywip-strip"); if (el) setWidth(el.getBoundingClientRect().width); };
    window.addEventListener("resize", onResize);
    const t = setInterval(load, 60000);
    return () => { window.removeEventListener("resize", onResize); clearInterval(t); };
  }, [load]);

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
  const openCard = useCallback((s, e) => setCard({ s, x: e.clientX, y: e.clientY }), []);
  const closeCard = useCallback(() => setCard(null), []);
  const live = useMemo(() => stations.filter((s) => !idle(s)).length, [stations]);

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">YWIP · Work in progress</h1>
        <span className="text-xs text-slate-400">{d.day || ""} · {stations.length} stations · {live} with work today · click a station</span>
        <div className="ml-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          {(d.summary || []).map((x) => <span key={x.label} className="whitespace-nowrap">{x.label} <b className="text-white tabular-nums text-sm">{num(x.value)}</b></span>)}
        </div>
        <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}

      {/* TOP — the floor */}
      <div id="ywip-strip" ref={stripRef} className="w-full">
        {width > 0 && <Strip stations={stations} width={width} onOpen={openCard} open={card && card.s.no} />}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1 mb-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />on track</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-500" />watch</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-rose-500" />behind</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-slate-400" />nothing yet — first ex-factory 15 Oct</span>
        <span>figure = today's headline number of the station · the floor is Gamini's isometric strip</span>
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
      <p className="mt-2 text-[10px] text-slate-500">{d.as_of ? `As of ${String(d.as_of).replace("T", " ").slice(0, 16)} · refreshes every minute · ` : ""}simulated factory — invented data, no real company or person</p>
      {card && <Card s={card.s} at={card} onClose={closeCard} />}
    </div>
  );
};

export default YwipFlow;
