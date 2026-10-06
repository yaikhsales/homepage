// MRP and 4DP sub-module screens. Each screen is a server-described table read from the
// simulated factory on the M1 (POST /api/m1/sim/view → guard /sim/view), so the
// same component serves Orders, Supplier Documents, Logistics, Arrival and
// Consumption. Written with React.createElement (no JSX) so it can be
// syntax-checked with plain `node --check`.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Search, RefreshCw, ChevronLeft, ChevronRight, Maximize, Package, Anchor, Ship, Truck, Factory, Flag } from "lucide-react";
import { NavCover, useScreenTop, Figures } from "../components/ScreenTop";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const MONTHLY = new Set(["orders", "confirmation", "packing-lists", "delivery-orders", "documents", "consumption", "check", "master-plan", "unit-plan", "line-plan", "supplier-orders", "supplier-portal", "logistics"]);
const WALL = new Set(["board", "mrp-tv", "tec-tv"]); // wall screens refresh by themselves

const tone = (v) => {
  const s = String(v || "").toLowerCase();
  if (/\bfail\b|on hold|^late\b|unaccounted|under investigation/.test(s)) return "bg-rose-500/20 text-rose-300 border-rose-500/30"; // inspection / test failed, lot on hold; consumption late; branded pieces unaccounted
  if (/\bremark\b|to be destroyed/.test(s)) return "bg-amber-500/20 text-amber-300 border-amber-500/30"; // pass with remark; leftover branded items waiting to be destroyed
  if (/received|complete|correct|uploaded|^updated|filed|handed over|confirmed|ready|shipped|has room|finished|\bpass\b|^issued\b/.test(s)) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (/at sea|on the road|on the truck|in progress|today|sewing|cutting|on track|busy|running|in the lab|^issuing\b/.test(s)) return "bg-sky-500/20 text-sky-300 border-sky-500/30";
  if (/customs|pending|check|awaiting|tomorrow|prepare|not yet|waiting|full|preparation/.test(s)) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-slate-500/20 text-slate-300 border-slate-500/30";
};
const CHIP = new Set(["status", "result", "declaration", "handover", "day"]);
const fmt = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v === null || v === undefined ? "" : String(v));
const shiftMonth = (m, by) => {
  const d = new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)) - 1 + by, 1);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
};
const thisMonth = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
};

// Tracking line: the journey of one shipment as connected points (ex-factory, port of loading, sailing,
// Sihanoukville port, truck, factory). Green = passed, blue and pulsing = where it is now, grey = still to come.
const STEP_ICON = { exf: Package, pol: Anchor, sail: Ship, pod: Anchor, border: Flag, truck: Truck, fc: Factory };
const Track = ({ steps, big }) => {
  const R = big ? 15 : 11;
  return h(
    "div",
    { className: "flex items-start", style: { minWidth: steps.length * (big ? 108 : 86) } },
    steps.map((s, i) =>
      h(
        "div",
        { key: s.key, className: "flex-1 flex flex-col items-center relative" },
        i > 0 && h("div", { className: "absolute h-0.5 " + (s.done ? "bg-emerald-400" : "bg-slate-600"), style: { top: R - 1, left: "-50%", width: "100%" } }),
        h(
          "div",
          {
            className: "relative z-10 rounded-full flex items-center justify-center " + (s.now ? "bg-sky-400 text-slate-900 ring-4 ring-sky-400/30 animate-pulse" : s.done ? "bg-emerald-500 text-slate-900" : "bg-slate-700 text-slate-400 border border-slate-500"),
            style: { width: R * 2, height: R * 2 },
          },
          h(STEP_ICON[s.key] || Package, { size: R + 1 })
        ),
        h("div", { className: "mt-1 leading-tight text-center whitespace-nowrap " + (big ? "text-xs " : "text-[10px] ") + (s.now ? "text-sky-300 font-bold" : s.done ? "text-slate-300" : "text-slate-500") }, s.label),
        h("div", { className: "tabular-nums " + (big ? "text-xs " : "text-[10px] ") + (s.now ? "text-sky-300 font-bold" : s.done ? "text-slate-400" : "text-slate-500") }, s.date)
      )
    )
  );
};

// Picture of a finding (Fabric Inspection / Fabric Test): a small drawing of what the inspector photographed, chosen
// by the key the server sends. Plain shapes on a fabric swatch; "none" or an unknown key draws nothing.
const SW = { fill: "#3b4a63", stroke: "#64748b" }; // the fabric swatch in the dark theme
const swatch = (extra) => h("rect", Object.assign({ x: 1, y: 1, width: 54, height: 34, rx: 4, fill: SW.fill, stroke: SW.stroke, strokeWidth: 1 }, extra || {}));
const frame = () => swatch({ fill: "none" });
const tile = (key) => h("rect", { key, x: 1, y: 1, width: 54, height: 34, rx: 4, fill: "#1e293b", stroke: "#475569", strokeWidth: 1 }); // the dark tile behind an item drawing
const weave = () => [9, 18, 27].map((y) => h("line", { key: "w" + y, x1: 2, x2: 54, y1: y, y2: y, stroke: SW.stroke, strokeWidth: 0.6 }));
const PICTURES = {
  // a dark hole in the fabric
  hole: () => [swatch({ key: "s" }), ...weave(), h("circle", { key: "h", cx: 30, cy: 18, r: 6.5, fill: "#0b1220", stroke: "#f87171", strokeWidth: 1.2 })],
  // one thread running thick for a few inches
  slub: () => [swatch({ key: "s" }), ...weave(), h("line", { key: "t", x1: 17, x2: 39, y1: 18, y2: 18, stroke: "#fbbf24", strokeWidth: 4.5, strokeLinecap: "round" })],
  // beginning / middle / end of the roll in three slightly different shades
  "shade-end": () => [
    h("rect", { key: "a", x: 1, y: 1, width: 18, height: 34, fill: "#33415c" }),
    h("rect", { key: "b", x: 19, y: 1, width: 18, height: 34, fill: "#4a5f85" }),
    h("rect", { key: "c", x: 37, y: 1, width: 18, height: 34, fill: "#6b84b0" }),
    ...["B", "M", "E"].map((t, i) => h("text", { key: t, x: 10 + i * 18, y: 21, textAnchor: "middle", fontSize: 8, fontWeight: 700, fill: "#e2e8f0" }, t)),
    h(frame, { key: "f" }),
  ],
  // one side of the width darker than the other
  "shade-side": () => [
    h("rect", { key: "a", x: 1, y: 1, width: 54, height: 17, fill: "#33415c" }),
    h("rect", { key: "b", x: 1, y: 18, width: 54, height: 17, fill: "#6b84b0" }),
    h("line", { key: "m", x1: 1, x2: 55, y1: 18, y2: 18, stroke: "#e2e8f0", strokeWidth: 0.8, strokeDasharray: "3 2" }),
    h(frame, { key: "f" }),
  ],
  // measured width against the order: two arrows over a ruler
  width: () => [
    swatch({ key: "s" }),
    h("line", { key: "l", x1: 9, x2: 47, y1: 13, y2: 13, stroke: "#fbbf24", strokeWidth: 1.6 }),
    h("path", { key: "a1", d: "M5 13 L11 9.5 L11 16.5 Z", fill: "#fbbf24" }),
    h("path", { key: "a2", d: "M51 13 L45 9.5 L45 16.5 Z", fill: "#fbbf24" }),
    h("line", { key: "r", x1: 5, x2: 51, y1: 29, y2: 29, stroke: "#cbd5e1", strokeWidth: 1 }),
    ...[5, 10.75, 16.5, 22.25, 28, 33.75, 39.5, 45.25, 51].map((x, i) => h("line", { key: "k" + i, x1: x, x2: x, y1: i % 2 ? 26 : 23.5, y2: 29, stroke: "#cbd5e1", strokeWidth: 1 })),
  ],
  // a selvage strip that takes too much of the width
  selvage: () => [
    swatch({ key: "s" }),
    h("rect", { key: "a", x: 1.5, y: 1.5, width: 53, height: 9, fill: "#fbbf24", fillOpacity: 0.55 }),
    h("rect", { key: "b", x: 1.5, y: 25.5, width: 53, height: 9, fill: "#fbbf24", fillOpacity: 0.55 }),
    ...[7, 16, 25, 34, 43, 52].map((x) => h("circle", { key: "p" + x, cx: x - 1.5, cy: 6, r: 1, fill: "#0b1220" })),
    ...[7, 16, 25, 34, 43, 52].map((x) => h("circle", { key: "q" + x, cx: x - 1.5, cy: 30, r: 1, fill: "#0b1220" })),
    h(frame, { key: "f" }),
  ],
  // fabric test: the 18 × 18 in square before (dashed) and after washing or pressing
  shrinkage: () => [
    swatch({ key: "s" }),
    h("rect", { key: "o", x: 14, y: 4, width: 28, height: 28, fill: "none", stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 2" }),
    h("rect", { key: "i", x: 18, y: 8, width: 20, height: 20, fill: "#fbbf24", fillOpacity: 0.35, stroke: "#fbbf24", strokeWidth: 1.2 }),
  ],
  // fabric test: the round-cutter piece on the scale
  weight: () => [
    swatch({ key: "s" }),
    h("circle", { key: "c", cx: 28, cy: 15, r: 10, fill: "#6b84b0", stroke: "#e2e8f0", strokeWidth: 1 }),
    h("line", { key: "p", x1: 12, x2: 44, y1: 30, y2: 30, stroke: "#fbbf24", strokeWidth: 2.4, strokeLinecap: "round" }),
  ],
  // fabric test: the lot beside the approved standard on the grey scale
  shade: () => [
    h("rect", { key: "a", x: 1, y: 1, width: 27, height: 34, fill: "#4a5f85" }),
    h("rect", { key: "b", x: 28, y: 1, width: 27, height: 34, fill: "#7f97c2" }),
    h("line", { key: "m", x1: 28, x2: 28, y1: 1, y2: 35, stroke: "#0b1220", strokeWidth: 1.2 }),
    h(frame, { key: "f" }),
  ],
  // fabric test: colour rubbed off onto the white test cloth
  rubbing: () => [
    swatch({ key: "s" }),
    h("rect", { key: "c", x: 16, y: 6, width: 24, height: 24, rx: 2, fill: "#f1f5f9" }),
    h("ellipse", { key: "m", cx: 28, cy: 18, rx: 7, ry: 5, fill: "#4a5f85", fillOpacity: 0.75 }),
  ],
  // Consumption chart: one small drawing per item of the order (fabric, accessories, packaging), on a dark tile.
  // a roll of fabric with its loose end
  fabric: () => [
    tile("t"),
    h("rect", { key: "l", x: 13, y: 24, width: 25, height: 7, fill: "#7f97c2" }),
    h("rect", { key: "b", x: 13, y: 8, width: 27, height: 17, fill: "#6b84b0" }),
    h("ellipse", { key: "a", cx: 13, cy: 16.5, rx: 3.5, ry: 8.5, fill: "#6b84b0" }),
    h("ellipse", { key: "e", cx: 40, cy: 16.5, rx: 3.5, ry: 8.5, fill: "#4a5f85", stroke: "#cbd5e1", strokeWidth: 0.8 }),
    h("ellipse", { key: "c", cx: 40, cy: 16.5, rx: 1.2, ry: 2.8, fill: "#0b1220" }),
  ],
  // a cone of sewing thread
  thread: () => [
    tile("t"),
    h("rect", { key: "c", x: 26.5, y: 4, width: 3, height: 4, fill: "#cbd5e1" }),
    h("path", { key: "b", d: "M21 29 L35 29 L30.5 8 L25.5 8 Z", fill: "#fbbf24" }),
    ...[13, 18, 23].map((y) => h("line", { key: "w" + y, x1: 28 - (y - 3) / 4.2, x2: 28 + (y - 3) / 4.2, y1: y, y2: y + 1.5, stroke: "#b45309", strokeWidth: 0.8 })),
    h("rect", { key: "f", x: 18, y: 29, width: 20, height: 2.5, rx: 1, fill: "#cbd5e1" }),
    h("path", { key: "e", d: "M31 11 Q42 12 44 23", fill: "none", stroke: "#fbbf24", strokeWidth: 1 }),
  ],
  // a woven label, stitched at both ends
  label: () => [
    tile("t"),
    h("rect", { key: "b", x: 11, y: 10, width: 34, height: 16, rx: 1.5, fill: "#f1f5f9" }),
    h("line", { key: "s1", x1: 14, x2: 14, y1: 11.5, y2: 24.5, stroke: "#64748b", strokeWidth: 1, strokeDasharray: "2 1.5" }),
    h("line", { key: "s2", x1: 42, x2: 42, y1: 11.5, y2: 24.5, stroke: "#64748b", strokeWidth: 1, strokeDasharray: "2 1.5" }),
    h("line", { key: "a", x1: 18, x2: 38, y1: 16, y2: 16, stroke: "#334155", strokeWidth: 2.2, strokeLinecap: "round" }),
    h("line", { key: "c", x1: 21, x2: 35, y1: 21, y2: 21, stroke: "#94a3b8", strokeWidth: 1.4, strokeLinecap: "round" }),
  ],
  // a heat-seal patch (artwork pressed onto the garment)
  "heat-seal": () => [
    tile("t"),
    h("rect", { key: "b", x: 17, y: 7, width: 22, height: 22, rx: 5, fill: "#f97316", fillOpacity: 0.85, stroke: "#fdba74", strokeWidth: 1 }),
    h("path", { key: "s", d: "M28 11.5 L30 16 L34.8 16.4 L31.2 19.6 L32.3 24.3 L28 21.8 L23.7 24.3 L24.8 19.6 L21.2 16.4 L26 16 Z", fill: "#fff7ed" }),
  ],
  // a zipper: two tapes, the teeth and the slider
  zipper: () => [
    tile("t"),
    h("rect", { key: "a", x: 21, y: 3, width: 6, height: 30, fill: "#4a5f85" }),
    h("rect", { key: "b", x: 29, y: 3, width: 6, height: 30, fill: "#4a5f85" }),
    ...[5, 8, 11, 14, 17, 20, 23, 26, 29].map((y, i) => h("line", { key: "z" + y, x1: i % 2 ? 25.5 : 27, x2: i % 2 ? 29 : 30.5, y1: y, y2: y, stroke: "#cbd5e1", strokeWidth: 1.3 })),
    h("rect", { key: "s", x: 24, y: 10, width: 8, height: 6.5, rx: 1.5, fill: "#fbbf24" }),
    h("rect", { key: "p", x: 26.8, y: 16.5, width: 2.4, height: 8, rx: 1, fill: "#fbbf24" }),
  ],
  // a drawcord with its two tips
  drawcord: () => [
    tile("t"),
    h("path", { key: "c", d: "M9 13 C 17 3, 23 31, 31 19 S 43 9, 47 23", fill: "none", stroke: "#e2e8f0", strokeWidth: 2.6, strokeLinecap: "round" }),
    h("circle", { key: "a", cx: 9, cy: 13, r: 2, fill: "#fbbf24" }),
    h("circle", { key: "b", cx: 47, cy: 23, r: 2, fill: "#fbbf24" }),
  ],
  // an elastic band, ribbed, that stretches both ways
  elastic: () => [
    tile("t"),
    h("rect", { key: "b", x: 11, y: 12, width: 34, height: 12, rx: 2, fill: "#e2e8f0" }),
    ...[15, 19, 23, 27, 31, 35, 39].map((x) => h("line", { key: "r" + x, x1: x + 1, x2: x + 1, y1: 13, y2: 23, stroke: "#94a3b8", strokeWidth: 1 })),
    h("path", { key: "l", d: "M4 18 L9 14.5 L9 21.5 Z", fill: "#fbbf24" }),
    h("path", { key: "r", d: "M52 18 L47 14.5 L47 21.5 Z", fill: "#fbbf24" }),
  ],
  // an eyelet: a metal ring around a hole
  eyelet: () => [tile("t"), h("circle", { key: "r", cx: 28, cy: 18, r: 8.5, fill: "#0b1220", stroke: "#cbd5e1", strokeWidth: 4 })],
  // a cord clip (stopper) on its cord
  "cord-clip": () => [
    tile("t"),
    h("line", { key: "c", x1: 28, x2: 28, y1: 3, y2: 33, stroke: "#e2e8f0", strokeWidth: 2.2 }),
    h("rect", { key: "b", x: 19, y: 10, width: 18, height: 16, rx: 6, fill: "#94a3b8", stroke: "#e2e8f0", strokeWidth: 0.8 }),
    h("circle", { key: "h", cx: 28, cy: 18, r: 3, fill: "#0b1220" }),
  ],
  // a four-hole button
  button: () => [
    tile("t"),
    h("circle", { key: "b", cx: 28, cy: 18, r: 11, fill: "#94a3b8", stroke: "#e2e8f0", strokeWidth: 1 }),
    h("circle", { key: "i", cx: 28, cy: 18, r: 7.5, fill: "none", stroke: "#64748b", strokeWidth: 0.8 }),
    ...[[25, 15], [31, 15], [25, 21], [31, 21]].map((c) => h("circle", { key: "h" + c[0] + c[1], cx: c[0], cy: c[1], r: 1.5, fill: "#0b1220" })),
  ],
  // a moulded bra pad
  "bra-pad": () => [tile("t"), h("path", { key: "p", d: "M11 26 Q28 -3 45 26 Q28 33 11 26 Z", fill: "#f1f5f9", fillOpacity: 0.9, stroke: "#cbd5e1", strokeWidth: 1 }), h("path", { key: "s", d: "M17 23 Q28 8 39 23", fill: "none", stroke: "#94a3b8", strokeWidth: 0.8 })],
  // a clear polybag with the folded garment inside
  polybag: () => [
    tile("t"),
    h("rect", { key: "g", x: 19, y: 14, width: 18, height: 14, rx: 1.5, fill: "#6b84b0" }),
    h("rect", { key: "b", x: 14, y: 5, width: 28, height: 27, rx: 2, fill: "#7dd3fc", fillOpacity: 0.18, stroke: "#7dd3fc", strokeWidth: 1 }),
    h("line", { key: "s", x1: 14, x2: 42, y1: 9.5, y2: 9.5, stroke: "#7dd3fc", strokeWidth: 1 }),
    h("line", { key: "h", x1: 37, x2: 40, y1: 14, y2: 24, stroke: "#e0f2fe", strokeWidth: 1.2, strokeLinecap: "round" }),
  ],
  // a carton box, taped
  carton: () => [
    tile("t"),
    h("path", { key: "o", d: "M12 14 L18 7 L48 7 L42 14 Z", fill: "#c9a27e", stroke: "#7f5539", strokeWidth: 0.8 }),
    h("rect", { key: "f", x: 12, y: 14, width: 30, height: 17, fill: "#b08968", stroke: "#7f5539", strokeWidth: 0.8 }),
    h("path", { key: "s", d: "M42 14 L48 7 L48 24 L42 31 Z", fill: "#9c6f4d", stroke: "#7f5539", strokeWidth: 0.8 }),
    h("path", { key: "p", d: "M25.5 14 L31.5 7 L34.5 7 L28.5 14 L28.5 21 L25.5 21 Z", fill: "#e6ccb2" }),
  ],
  // a hang tag on its string
  hangtag: () => [
    tile("t"),
    h("path", { key: "s", d: "M28 13 Q33 3 45 6", fill: "none", stroke: "#fbbf24", strokeWidth: 1.2, strokeLinecap: "round" }),
    h("path", { key: "b", d: "M23 8 L33 8 L37 13 L37 31 L19 31 L19 13 Z", fill: "#f1f5f9" }),
    h("circle", { key: "h", cx: 28, cy: 13, r: 1.8, fill: "#1e293b" }),
    h("line", { key: "a", x1: 23, x2: 33, y1: 20, y2: 20, stroke: "#334155", strokeWidth: 1.8, strokeLinecap: "round" }),
    h("line", { key: "c", x1: 23, x2: 30, y1: 25, y2: 25, stroke: "#94a3b8", strokeWidth: 1.3, strokeLinecap: "round" }),
  ],
};
const Picture = ({ k }) => {
  const draw = PICTURES[String(k || "").toLowerCase()];
  if (!draw) return null;
  return h("svg", { width: 56, height: 36, viewBox: "0 0 56 36", role: "img", "aria-label": String(k), className: "block rounded" }, h("title", null, String(k)), draw());
};

// Light on an entry of the left-hand list, when the server sends a tone (consumption chart: green = fully updated,
// amber = not updated yet, red and pulsing = late).
const LIGHT = { green: "bg-emerald-400", amber: "bg-amber-400", red: "bg-rose-500 ring-2 ring-rose-500/40 animate-pulse" };

const MrpView = ({ onBack, module = "mrp", label = "MRP", view: fixedView }) => {
  const params = useParams();
  const view = fixedView || params.view; // a fixed route (e.g. fc/fabric-receiving) names its view; otherwise it comes from the route
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [month, setMonth] = useState(thisMonth());
  // Chosen entry of the left-hand list (a supplier, an order), when the screen has one. It is kept with the screen it
  // was chosen on, so it never leaks to another screen when the route changes.
  const scope = module + "/" + view;
  const [picked, setPicked] = useState({ scope: "", id: "" });
  const pick = picked.scope === scope ? picked.id : "";
  const [topRef, topPad] = useScreenTop();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, view, month: MONTHLY.has(view) ? month : undefined, supplier: pick || undefined, pick: pick || undefined }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
      setData(j);
    } catch (e) {
      setError(label + " data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [module, label, view, month, pick]);

  useEffect(() => {
    load();
  }, [load]);
  // The tracking board is a wall screen: refresh by itself every minute.
  useEffect(() => {
    if (!WALL.has(view)) return undefined;
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [view, load]);

  const rows = useMemo(() => {
    const all = (data && data.rows) || [];
    const s = q.trim().toLowerCase();
    return s ? all.filter((r) => Object.values(r).join(" ").toLowerCase().includes(s)) : all;
  }, [data, q]);
  const cols = (data && data.columns) || [];
  const picker = data && data.picker;
  const board = Boolean(data && data.board);
  const cell = board ? "px-4 py-3 text-base" : "px-3 py-2 text-sm";

  const subtitle = (data && data.subtitle) || "";
  const dated = /(\d{1,2} [A-Z][a-z]{2} \d{4})\s*$/.exec(subtitle); // a subtitle ending in a date (the Arrival Board): keep the date on the line

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-8 font-sans" }, // top padding clears the fixed 3-mode nav
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 436px; }"), // room for the PA panel while it is open
    h(NavCover),
    // One toolbar line: back, title, month, the key figures (wall boards keep big cards below), search, refresh, full screen.
    h(
      "div",
      { className: "flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2" },
      onBack && h("button", { onClick: onBack, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: (board ? "text-4xl" : "text-lg") + " font-black text-white leading-none whitespace-nowrap", title: subtitle || undefined }, (data && data.title) || label),
      dated && h("span", { className: (board ? "text-lg" : "text-xs") + " font-bold text-slate-400 whitespace-nowrap" }, dated[1]),
      MONTHLY.has(view) &&
        h(
          "div",
          { className: "flex items-center bg-slate-800 border border-slate-700 rounded-lg" },
          h("button", { onClick: () => setMonth(shiftMonth(month, -1)), className: "p-1 hover:bg-slate-700 rounded-lg", "aria-label": "Previous month" }, h(ChevronLeft, { size: 16 })),
          h("span", { className: "px-1.5 text-xs font-bold text-white tabular-nums" }, month),
          h("button", { onClick: () => setMonth(shiftMonth(month, 1)), className: "p-1 hover:bg-slate-700 rounded-lg", "aria-label": "Next month" }, h(ChevronRight, { size: 16 }))
        ),
      !board && h(Figures, { items: data && data.summary, fmt }),
      h(
        "div",
        { className: "flex items-center gap-1.5 ml-auto" },
        h(
          "div",
          { className: "flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1" },
          h(Search, { size: 14, className: "text-slate-500" }),
          h("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search order, supplier, status…", className: "bg-transparent outline-none text-xs w-36 text-white placeholder-slate-500" })
        ),
        h("button", { onClick: load, className: "p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700", "aria-label": "Refresh" }, h(RefreshCw, { size: 14, className: loading ? "animate-spin" : "" })),
        board &&
          h(
            "button",
            { onClick: () => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(), className: "p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700", "aria-label": "Full screen" },
            h(Maximize, { size: 14 })
          )
      )
    ),
    error && h("div", { className: "mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm" }, error),
    // Wall board (TV): the big figures stay, read from across the room.
    board &&
      h(
        "div",
        { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-3" },
        ((data && data.summary) || []).map((s) =>
          h(
            "div",
            { key: s.label, className: "rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-2" },
            h("div", { className: "text-xs uppercase tracking-wider text-slate-400" }, s.label),
            h("div", { className: "text-4xl font-black text-white tabular-nums" }, fmt(s.value))
          )
        )
      ),
    h(
      "div",
      { className: "flex gap-4 items-start" },
      picker &&
        h(
          "aside",
          { className: "w-64 flex-shrink-0 rounded-2xl border border-slate-700 bg-slate-800/60 p-2 sticky top-28 overflow-y-auto", style: { maxHeight: "calc(100vh - 8rem)", scrollbarWidth: "thin", scrollbarColor: "#475569 transparent" } }, // a long list scrolls inside itself
          h("div", { className: "px-2 pb-1 text-xs uppercase tracking-wider text-slate-400 font-bold" }, picker.label),
          picker.options.map((o) =>
            h(
              "button",
              {
                key: o.id,
                onClick: () => setPicked({ scope, id: o.id }),
                className: "w-full text-left rounded-xl px-3 py-2 mb-1 border transition-colors " + (picker.selected === o.id ? "bg-emerald-500/20 border-emerald-500/40" : "border-transparent hover:bg-slate-700/60"),
              },
              h(
                "div",
                { className: "flex items-center justify-between gap-2" },
                h(
                  "span",
                  { className: "flex items-center gap-2 text-sm font-bold text-white leading-tight" },
                  LIGHT[o.tone] && h("span", { className: "inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 " + LIGHT[o.tone], title: o.tone, "aria-label": o.tone }),
                  o.name
                ),
                h("span", { className: "text-xs font-bold tabular-nums text-emerald-300" }, fmt(o.count) + (o.of ? " / " + fmt(o.of) : ""))
              ),
              h("div", { className: "text-[11px] text-slate-400 leading-tight" }, o.sub)
            )
          )
        ),
    h(
      "div",
      { className: "flex-1 min-w-0 rounded-2xl border border-slate-700 bg-slate-800/40 overflow-x-auto" },
      h(
        "table",
        { className: "w-full border-collapse" },
        h("thead", null, h("tr", { className: "bg-slate-800 text-left" }, cols.map((c) => h("th", { key: c.key, className: cell + " font-bold text-slate-300 uppercase tracking-wider text-xs whitespace-nowrap" }, c.label)))),
        h(
          "tbody",
          null,
          rows.map((r, i) =>
            h(
              "tr",
              { key: (r.shipment || r.po || r.supplier || r.order || "") + "-" + i, className: "border-t border-slate-700/70 hover:bg-slate-700/40" },
              cols.map((c) =>
                h(
                  "td",
                  { key: c.key, className: cell + (typeof r[c.key] === "number" ? " text-right tabular-nums" : "") + (c.key === "order" ? " font-bold text-white whitespace-nowrap" : "") + (c.key === "group" ? (i === 0 || rows[i - 1].group !== r.group ? " font-bold text-white whitespace-nowrap" : " text-slate-500 whitespace-nowrap") : "") },
                  Array.isArray(r[c.key]) ? h(Track, { steps: r[c.key], big: board }) : c.key === "picture" ? h(Picture, { k: r[c.key] }) : CHIP.has(c.key) && r[c.key] ? h("span", { className: "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap " + tone(r[c.key]) }, fmt(r[c.key])) : fmt(r[c.key])
                )
              )
            )
          ),
          !loading && rows.length === 0 && h("tr", null, h("td", { colSpan: Math.max(cols.length, 1), className: "px-4 py-10 text-center text-slate-500" }, "Nothing to show."))
        )
      )
    )
    ),
    h(
      "p",
      { className: "mt-3 text-xs text-slate-500" },
      (data ? rows.length + " of " + data.total + " rows · as of " + String(data.as_of || "").replace("T", " ").slice(0, 16) + " · " : "") + "Simulated factory data — no real customer, supplier or person."
    )
  );
};

export default MrpView;
