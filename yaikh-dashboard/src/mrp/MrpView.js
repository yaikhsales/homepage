// MRP and 4DP sub-module screens. Each screen is a server-described table read from the
// simulated factory on the M1 (POST /api/m1/sim/view → guard /sim/view), so the
// same component serves Orders, Supplier Documents, Logistics, Arrival and
// Consumption. Written with React.createElement (no JSX) so it can be
// syntax-checked with plain `node --check`.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Search, RefreshCw, ChevronLeft, ChevronRight, Maximize, Package, Anchor, Ship, Truck, Factory, Flag } from "lucide-react";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const MONTHLY = new Set(["orders", "confirmation", "packing-lists", "delivery-orders", "documents", "consumption", "check", "master-plan", "unit-plan", "line-plan", "supplier-orders", "supplier-portal", "logistics"]);
const WALL = new Set(["board", "mrp-tv", "tec-tv"]); // wall screens refresh by themselves

const tone = (v) => {
  const s = String(v || "").toLowerCase();
  if (/\bfail\b|on hold/.test(s)) return "bg-rose-500/20 text-rose-300 border-rose-500/30"; // inspection / test failed, lot on hold
  if (/\bremark\b/.test(s)) return "bg-amber-500/20 text-amber-300 border-amber-500/30"; // pass with remark
  if (/received|complete|correct|uploaded|filed|handed over|confirmed|ready|shipped|has room|finished|\bpass\b/.test(s)) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (/at sea|on the road|on the truck|in progress|today|sewing|cutting|on track|busy|running|in the lab/.test(s)) return "bg-sky-500/20 text-sky-300 border-sky-500/30";
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
};
const Picture = ({ k }) => {
  const draw = PICTURES[String(k || "").toLowerCase()];
  if (!draw) return null;
  return h("svg", { width: 56, height: 36, viewBox: "0 0 56 36", role: "img", "aria-label": String(k), className: "block rounded" }, h("title", null, String(k)), draw());
};

const MrpView = ({ onBack, module = "mrp", label = "MRP", view: fixedView }) => {
  const params = useParams();
  const view = fixedView || params.view; // a fixed route (e.g. fc/fabric-receiving) names its view; otherwise it comes from the route
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [month, setMonth] = useState(thisMonth());
  const [pick, setPick] = useState(""); // chosen entry of the left-hand list (supplier), when the screen has one

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, view, month: MONTHLY.has(view) ? month : undefined, supplier: pick || undefined }),
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

  return h(
    "div",
    { className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-8 pb-8 pt-28 font-sans" }, // pt-28 clears the fixed 3-mode nav
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 436px; }"), // room for the PA panel while it is open
    h(
      "div",
      { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6" },
      h(
        "div",
        { className: "flex items-center gap-4" },
        h("button", { onClick: onBack, className: "p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 24 })),
        h(
          "div",
          null,
          h("div", { className: "text-xs uppercase tracking-widest text-emerald-400 font-bold" }, label + " · simulated factory"),
          h("h1", { className: board ? "text-4xl font-black text-white" : "text-2xl font-black text-white" }, (data && data.title) || label),
          h("p", { className: "text-sm text-slate-400" }, (data && data.subtitle) || "")
        )
      ),
      h(
        "div",
        { className: "flex items-center gap-2 flex-wrap" },
        MONTHLY.has(view) &&
          h(
            "div",
            { className: "flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-1 py-1" },
            h("button", { onClick: () => setMonth(shiftMonth(month, -1)), className: "p-1.5 hover:bg-slate-700 rounded-lg", "aria-label": "Previous month" }, h(ChevronLeft, { size: 18 })),
            h("span", { className: "px-2 text-sm font-bold text-white tabular-nums" }, month),
            h("button", { onClick: () => setMonth(shiftMonth(month, 1)), className: "p-1.5 hover:bg-slate-700 rounded-lg", "aria-label": "Next month" }, h(ChevronRight, { size: 18 }))
          ),
        h(
          "div",
          { className: "flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2" },
          h(Search, { size: 16, className: "text-slate-500" }),
          h("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search order, supplier, status…", className: "bg-transparent outline-none text-sm w-56 text-white placeholder-slate-500" })
        ),
        h("button", { onClick: load, className: "p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700", "aria-label": "Refresh" }, h(RefreshCw, { size: 16, className: loading ? "animate-spin" : "" })),
        board &&
          h(
            "button",
            { onClick: () => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(), className: "p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700", "aria-label": "Full screen" },
            h(Maximize, { size: 16 })
          )
      )
    ),
    error && h("div", { className: "mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm" }, error),
    h(
      "div",
      { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" },
      ((data && data.summary) || []).map((s) =>
        h(
          "div",
          { key: s.label, className: "rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3" },
          h("div", { className: "text-xs uppercase tracking-wider text-slate-400" }, s.label),
          h("div", { className: (board ? "text-4xl" : "text-2xl") + " font-black text-white tabular-nums" }, fmt(s.value))
        )
      )
    ),
    h(
      "div",
      { className: "flex gap-4 items-start" },
      picker &&
        h(
          "aside",
          { className: "w-64 flex-shrink-0 rounded-2xl border border-slate-700 bg-slate-800/60 p-2 sticky top-28" },
          h("div", { className: "px-2 pb-1 text-xs uppercase tracking-wider text-slate-400 font-bold" }, picker.label),
          picker.options.map((o) =>
            h(
              "button",
              {
                key: o.id,
                onClick: () => setPick(o.id),
                className: "w-full text-left rounded-xl px-3 py-2 mb-1 border transition-colors " + (picker.selected === o.id ? "bg-emerald-500/20 border-emerald-500/40" : "border-transparent hover:bg-slate-700/60"),
              },
              h("div", { className: "flex items-center justify-between gap-2" }, h("span", { className: "text-sm font-bold text-white leading-tight" }, o.name), h("span", { className: "text-xs font-bold tabular-nums text-emerald-300" }, fmt(o.count))),
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
                  { key: c.key, className: cell + (typeof r[c.key] === "number" ? " text-right tabular-nums" : "") + (c.key === "order" ? " font-bold text-white whitespace-nowrap" : "") },
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
