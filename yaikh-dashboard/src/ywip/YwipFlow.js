// YWIP — the work-in-progress flow as an isometric infographic.
//
// Part 1 (fabric store → cutting, fabric relaxing). Everything is drawn here as
// SVG on a true 30° isometric projection: iso(x, y, z) maps a point in factory
// space to the screen, box() extrudes a block with three shades, and every
// station is built from those primitives — no stock art, no downloaded image.
// Figures are neutral: no faces, no names, no logos.
//
// Each station is clickable and opens a small status card filled from the
// simulated factory on the M1 (POST /api/m1/sim/view, module "fc"); stations
// with no data yet say so rather than inventing numbers.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

/* ── isometric helpers ────────────────────────────────────────────────── */
const COS30 = Math.cos(Math.PI / 6); // 0.866
const SIN30 = 0.5;
const iso = (x, y, z = 0) => [(x - y) * COS30, (x + y) * SIN30 - z];
const pts = (list) => list.map(([x, y, z]) => iso(x, y, z).join(",")).join(" ");

// An extruded block: top face, left face, right face.
const Box = ({ x = 0, y = 0, z = 0, w = 10, d = 10, h = 6, top = "#60a5fa", left = "#1d4ed8", right = "#2563eb", o = 1 }) => (
  <g opacity={o}>
    <polygon points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={top} />
    <polygon points={pts([[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]])} fill={right} />
    <polygon points={pts([[x, y, z + h], [x, y + d, z + h], [x, y + d, z], [x, y, z]])} fill={left} />
  </g>
);

// A fabric roll: a cylinder lying along the x axis, drawn with two end caps
// and a body, in the colours fabric actually comes in.
const FABRIC = ["#1e3a8a", "#7f1d1d", "#64748b", "#f8fafc", "#0f766e"];
const Roll = ({ x, y, z, len = 16, r = 2.6, tone = "#f8fafc" }) => {
  const [ax, ay] = iso(x, y + r, z + r);
  const [bx, by] = iso(x + len, y + r, z + r);
  const half = r * 0.95;
  return (
    <g>
      {/* body */}
      <polygon points={`${ax},${ay - half} ${bx},${by - half} ${bx},${by + half} ${ax},${ay + half}`} fill={tone} />
      {/* end caps: the lighter one faces us */}
      <ellipse cx={bx} cy={by} rx={r * 0.55} ry={r} fill={tone} stroke="rgba(15,23,42,0.45)" strokeWidth="0.3" />
      <ellipse cx={bx} cy={by} rx={r * 0.3} ry={r * 0.55} fill="rgba(15,23,42,0.35)" />
      <ellipse cx={ax} cy={ay} rx={r * 0.55} ry={r} fill="rgba(15,23,42,0.35)" />
    </g>
  );
};

// Stack of accessory cartons.
// Fabric rolls on a rack — referenced by the Fabric Store and FC scenes.
// (The site white-paged when this was used undefined; keep it defined
// above the STATIONS array, which evaluates at module load.)
const FabricRack = ({ x = 0, y = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={22} height={10} rx={1} fill="#334155" stroke="#475569" strokeWidth={0.5} />
    {[2, 9, 16].map((rx) => (
      <ellipse key={rx} cx={rx + 2.5} cy={5} rx={2.4} ry={3.4} fill="#6b84b0" stroke="#cbd5e1" strokeWidth={0.5} />
    ))}
  </g>
);

const BoxRack = ({ x = 0, y = 0, rows = 3 }) => (
  <g>
    {Array.from({ length: rows }).map((_, i) => (
      <g key={i}>
        <Box x={x} y={y} z={i * 7} w={18} d={8} h={1} top="#334155" left="#1e293b" right="#273549" />
        <Box x={x + 1.5} y={y + 1} z={i * 7 + 1} w={6.5} d={6} h={5} top="#fcd34d" left="#b45309" right="#d97706" />
        <Box x={x + 9.5} y={y + 1} z={i * 7 + 1} w={6.5} d={6} h={5} top="#fde68a" left="#b45309" right="#d97706" />
      </g>
    ))}
  </g>
);

// Neutral worker: a clear standing figure in a coloured shirt. No face, no logo.
const Worker = ({ x = 0, y = 0, z = 0, shirt = "#38bdf8" }) => {
  const [hx, hy] = iso(x, y, z + 17);
  return (
    <g>
      {/* legs */}
      <Box x={x - 1.8} y={y - 1.4} z={z} w={1.6} d={2.8} h={8} top="#0f172a" left="#020617" right="#0b1220" />
      <Box x={x + 0.3} y={y - 1.4} z={z} w={1.6} d={2.8} h={8} top="#0f172a" left="#020617" right="#0b1220" />
      {/* body */}
      <Box x={x - 2.4} y={y - 2} z={z + 8} w={4.8} d={4} h={6} top={shirt} left="#0c4a6e" right="#0369a1" />
      {/* arms */}
      <Box x={x - 3.6} y={y - 1.4} z={z + 9} w={1.2} d={2.6} h={4.5} top={shirt} left="#0c4a6e" right="#0369a1" />
      <Box x={x + 2.4} y={y - 1.4} z={z + 9} w={1.2} d={2.6} h={4.5} top={shirt} left="#0c4a6e" right="#0369a1" />
      {/* head */}
      <circle cx={hx} cy={hy} r={3} fill="#f8fafc" />
      <circle cx={hx} cy={hy - 1.4} r={2.6} fill="#e2e8f0" />
    </g>
  );
};

/* ── the stations ─────────────────────────────────────────────────────── */
const InspectionMachine = ({ x = 0, y = 0 }) => (
  <g>
    <Box x={x} y={y} z={0} w={22} d={10} h={5} top="#475569" left="#1e293b" right="#334155" />
    {/* light table */}
    <polygon points={pts([[x + 2, y + 1, 5.2], [x + 20, y + 1, 5.2], [x + 20, y + 9, 5.2], [x + 2, y + 9, 5.2]])} fill="#bae6fd" opacity="0.95" />
    {/* roll feeding in, cloth running over the table */}
    <Roll x={x + 1} y={y + 2} z={5.4} len={4} r={3} />
    <polygon points={pts([[x + 5, y + 2, 5.4], [x + 19, y + 2, 5.4], [x + 19, y + 8, 5.4], [x + 5, y + 8, 5.4]])} fill="#e2e8f0" opacity="0.8" />
    <Box x={x + 20} y={y} z={5} w={2} d={10} h={9} top="#64748b" left="#1e293b" right="#334155" />
    <Worker x={x + 12} y={y + 14} />
  </g>
);

const InspectionTable = ({ x = 0, y = 0 }) => (
  <g>
    <Box x={x} y={y} z={4} w={18} d={10} h={1} top="#cbd5e1" left="#64748b" right="#94a3b8" />
    <Box x={x + 1} y={y + 1} z={0} w={1.5} d={1.5} h={4} top="#475569" left="#1e293b" right="#334155" />
    <Box x={x + 15} y={y + 7} z={0} w={1.5} d={1.5} h={4} top="#475569" left="#1e293b" right="#334155" />
    <Box x={x + 3} y={y + 2} z={5} w={5} d={4} h={3} top="#fcd34d" left="#b45309" right="#d97706" />
    <Box x={x + 10} y={y + 3} z={5} w={4} d={3} h={2} top="#fde68a" left="#b45309" right="#d97706" />
    <Worker x={x + 9} y={y + 15} shirt="#34d399" />
  </g>
);

const TukTuk = ({ x = 0, y = 0 }) => (
  <g>
    {/* cargo bed with side walls, carrying rolls and a carton */}
    <Box x={x} y={y} z={3} w={20} d={12} h={2} top="#1d4ed8" left="#172554" right="#1e3a8a" />
    <Box x={x} y={y} z={5} w={20} d={1} h={4} top="#2563eb" left="#172554" right="#1e3a8a" />
    <Box x={x} y={y + 11} z={5} w={20} d={1} h={4} top="#2563eb" left="#172554" right="#1e3a8a" />
    <Roll x={x + 2} y={y + 2} z={5} len={15} r={2.4} tone="#1e3a8a" />
    <Roll x={x + 2} y={y + 6.5} z={5} len={15} r={2.4} tone="#7f1d1d" />
    <Box x={x + 6} y={y + 3} z={10} w={6} d={5} h={4} top="#fcd34d" left="#b45309" right="#d97706" />
    {/* cab + roof */}
    <Box x={x + 20} y={y + 2} z={3} w={7} d={8} h={10} top="#3b82f6" left="#172554" right="#1e3a8a" />
    <Box x={x + 19} y={y + 1} z={13} w={9} d={10} h={1} top="#60a5fa" left="#1e3a8a" right="#2563eb" />
    {/* three wheels: two at the back, one at the front */}
    {[[x + 3, y + 0.5], [x + 3, y + 11.5], [x + 25, y + 6]].map(([wx, wy], i) => {
      const [cx, cy] = iso(wx, wy, 2.4);
      return (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={3.2} ry={2} fill="#0f172a" stroke="#475569" strokeWidth="0.6" />
          <ellipse cx={cx} cy={cy} rx={1.2} ry={0.8} fill="#64748b" />
        </g>
      );
    })}
  </g>
);

const RelaxMachine = ({ x = 0, y = 0 }) => (
  <g>
    {/* relaxing machine: roll in, cloth falling in folds onto the tray */}
    <Box x={x} y={y} z={0} w={12} d={10} h={12} top="#475569" left="#1e293b" right="#334155" />
    <Roll x={x + 1} y={y + 2} z={12} len={10} r={3} />
    <polygon points={pts([[x + 12, y + 2, 10], [x + 24, y + 2, 2.4], [x + 24, y + 8, 2.4], [x + 12, y + 8, 10]])} fill="#e2e8f0" opacity="0.85" />
    {/* two flat trays of relaxed fabric */}
    <Box x={x + 22} y={y} z={0} w={16} d={11} h={2} top="#94a3b8" left="#475569" right="#64748b" />
    <Box x={x + 23} y={y + 1} z={2} w={14} d={9} h={1.6} top="#f1f5f9" left="#94a3b8" right="#cbd5e1" />
    <Box x={x + 22} y={y + 13} z={0} w={16} d={11} h={2} top="#94a3b8" left="#475569" right="#64748b" />
    <Box x={x + 23} y={y + 14} z={2} w={14} d={9} h={1.6} top="#e2e8f0" left="#94a3b8" right="#cbd5e1" />
  </g>
);

/* ── station list: where each one sits, what it draws, what data it opens ─ */
const STATIONS = [
  { key: "fabric-store", label: "Fabric store", at: [120, 120], view: "fabric-receiving",
    note: "Received fabric on the racks.", draw: (
      <g><FabricRack x={0} y={0} /><FabricRack x={0} y={13} /></g> ) },
  { key: "fabric-inspection", label: "Fabric inspection", at: [420, 110], view: "fabric-inspection",
    note: "Four-point inspection on the light table.", draw: <InspectionMachine x={0} y={0} /> },
  { key: "accessory-store", label: "Accessory store", at: [700, 120], view: "accessories-receiving",
    note: "Trims and accessories on the racks.", draw: <BoxRack x={0} y={0} /> },
  { key: "accessory-inspection", label: "Accessory inspection", at: [960, 110], view: "accessories-inspection",
    note: "Lot check against the trim card.", draw: <InspectionTable x={0} y={0} /> },
  { key: "ready", label: "Ready to deliver", at: [960, 450], view: "fabric-issuing",
    note: "Inspected fabric and trims waiting on the racks.", draw: (
      <g><FabricRack x={0} y={0} /><FabricRack x={0} y={13} /><BoxRack x={26} y={4} rows={2} /><BoxRack x={26} y={17} rows={2} /></g> ) },
  { key: "delivery", label: "Delivery to cutting", at: [580, 470], view: "material-delivery",
    note: "Material moves to the cutting section by tuk-tuk.", draw: <TukTuk x={0} y={0} /> },
  { key: "relaxing", label: "Cutting · fabric relaxing", at: [150, 450], view: "fabric-relaxing",
    note: "First operation in cutting: fabric relaxed, then laid in trays.", draw: <RelaxMachine x={0} y={0} /> },
];

// Connector order through the flow.
// Ring: along the top left→right, down the right-hand side, back along the
// bottom right→left. Nothing crosses the YWIP title in the middle.
const LINKS = [["fabric-store", "fabric-inspection"], ["fabric-inspection", "accessory-store"],
  ["accessory-store", "accessory-inspection"], ["accessory-inspection", "ready"],
  ["ready", "delivery"], ["delivery", "relaxing"]];

const YwipFlow = ({ onBack }) => {
  const [topRef, topPad] = useScreenTop();
  const [open, setOpen] = useState(null);     // station key
  const [card, setCard] = useState(null);     // { title, summary }
  const [loading, setLoading] = useState(false);

  const byKey = useMemo(() => Object.fromEntries(STATIONS.map((s) => [s.key, s])), []);

  const openStation = useCallback(async (s) => {
    setOpen(s.key);
    setCard(null);
    if (!s.view) return;
    setLoading(true);
    try {
      const r = await fetch(API + "/sim/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "fc", view: s.view }),
      });
      const j = await r.json();
      if (j && j.ok) setCard({ title: j.title, summary: j.summary || [], rows: (j.rows || []).length });
    } catch (e) {
      setCard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const station = open ? byKey[open] : null;

  return (
    <div ref={topRef} className="min-h-screen bg-[#0b1b3a] text-white" style={{ paddingTop: topPad }}>
      <NavCover />
      <div className="mx-auto max-w-[1600px] px-4 pb-10">
        <div className="mb-2 flex items-center gap-3">
          <button onClick={onBack} aria-label="Back"><ArrowLeft /></button>
          <h1 className="text-lg font-bold">YWIP — work in progress, fabric store to cutting</h1>
          <span className="text-xs text-slate-400">Click a station for its status</span>
        </div>

        <svg viewBox="0 0 1180 640" className="w-full rounded-2xl ring-1 ring-white/10" style={{ background: "#0b1b3a" }}>
          <defs>
            <radialGradient id="ywip-glow" cx="50%" cy="48%" r="60%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0b1b3a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="1180" height="640" fill="#0b1b3a" />
          <rect x="0" y="0" width="1180" height="640" fill="url(#ywip-glow)" />
          {[150, 230, 310, 390, 470].map((r) => (
            <circle key={r} cx="590" cy="310" r={r} fill="none" stroke="#3b82f6" strokeOpacity="0.14" strokeWidth="1" />
          ))}

          {/* the extruded centre title */}
          <g transform="translate(590,300)">
            <text textAnchor="middle" y="6" fontSize="62" fontWeight="900" fill="#1e40af" transform="translate(6,10)">YWIP</text>
            <text textAnchor="middle" y="6" fontSize="62" fontWeight="900" fill="#2563eb" transform="translate(3,5)">YWIP</text>
            <text textAnchor="middle" y="6" fontSize="62" fontWeight="900" fill="#dbeafe">YWIP</text>
            <text textAnchor="middle" y="26" fontSize="11" letterSpacing="4" fill="#93c5fd">WORK IN PROGRESS</text>
          </g>

          {/* connectors: thin white lines with a dot at each end */}
          {LINKS.map(([a, b]) => {
            const [ax, ay] = byKey[a].at;
            const [bx, by] = byKey[b].at;
            return (
              <g key={a + b}>
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#e2e8f0" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="1 0" />
                <circle cx={ax} cy={ay} r="3" fill="#e2e8f0" />
                <circle cx={bx} cy={by} r="3" fill="#e2e8f0" />
              </g>
            );
          })}

          {/* the stations */}
          {STATIONS.map((s, i) => (
            <g key={s.key} transform={`translate(${s.at[0]},${s.at[1]})`} className="cursor-pointer"
               onClick={() => openStation(s)} role="button" aria-label={s.label}>
              <g transform="scale(4) translate(0,-16)">{s.draw}</g>
              <text x="0" y="104" textAnchor="middle" fontSize="11" letterSpacing="2.2" fill="#e2e8f0" style={{ textTransform: "uppercase" }}>
                {String(i + 1).padStart(2, "0")} · {s.label.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>

        {/* status card */}
        {station && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(null)}>
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-5 ring-1 ring-white/15" onClick={(e) => e.stopPropagation()}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <h2 className="text-base font-bold">{station.label}</h2>
                <button onClick={() => setOpen(null)} className="rounded-lg p-1 text-slate-400 hover:bg-white/10"><X className="h-4 w-4" /></button>
              </div>
              <p className="mb-3 text-sm text-slate-400">{station.note}</p>
              {!station.view && <p className="text-sm text-amber-300">No live figures for this station yet — placeholder until the M1 publishes a view for it.</p>}
              {station.view && loading && <p className="text-sm text-slate-400">Loading…</p>}
              {station.view && !loading && !card && <p className="text-sm text-rose-300">That status is unavailable right now.</p>}
              {card && (
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold text-slate-200">{card.title}</div>
                  <dl className="grid grid-cols-2 gap-2">
                    {card.summary.slice(0, 6).map((s) => (
                      <div key={s.label} className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                        <dt className="text-[11px] uppercase tracking-wide text-slate-400">{s.label}</dt>
                        <dd className="text-sm font-bold tabular-nums">{typeof s.value === "number" ? s.value.toLocaleString("en-US") : s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-xs text-slate-500">{card.rows} rows on the full screen · simulated factory</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YwipFlow;
