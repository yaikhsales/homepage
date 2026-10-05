// MRP and 4DP sub-module screens. Each screen is a server-described table read from the
// simulated factory on the M1 (POST /api/m1/sim/view → guard /sim/view), so the
// same component serves Orders, Supplier Documents, Logistics, Arrival and
// Consumption. Written with React.createElement (no JSX) so it can be
// syntax-checked with plain `node --check`.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Search, RefreshCw, ChevronLeft, ChevronRight, Maximize } from "lucide-react";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const MONTHLY = new Set(["orders", "confirmation", "packing-lists", "delivery-orders", "documents", "consumption", "check", "master-plan", "unit-plan", "line-plan"]);
const WALL = new Set(["board", "mrp-tv", "tec-tv"]); // wall screens refresh by themselves

const tone = (v) => {
  const s = String(v || "").toLowerCase();
  if (/received|complete|correct|uploaded|filed|handed over|confirmed|ready|shipped|has room|finished/.test(s)) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (/at sea|on the road|on the truck|in progress|today|sewing|cutting|on track|busy|running/.test(s)) return "bg-sky-500/20 text-sky-300 border-sky-500/30";
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

const MrpView = ({ onBack, module = "mrp", label = "MRP" }) => {
  const { view } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [month, setMonth] = useState(thisMonth());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, view, month: MONTHLY.has(view) ? month : undefined }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
      setData(j);
    } catch (e) {
      setError(label + " data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [module, label, view, month]);

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
  const board = Boolean(data && data.board);
  const cell = board ? "px-4 py-3 text-base" : "px-3 py-2 text-sm";

  return h(
    "div",
    { className: "min-h-screen bg-slate-900 text-slate-200 px-4 md:px-8 pb-8 pt-28 font-sans" }, // pt-28 clears the fixed 3-mode nav
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
      { className: "rounded-2xl border border-slate-700 bg-slate-800/40 overflow-x-auto" },
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
              { key: (r.shipment || r.document || r.order || "") + "-" + i, className: "border-t border-slate-700/70 hover:bg-slate-700/40" },
              cols.map((c) =>
                h(
                  "td",
                  { key: c.key, className: cell + (typeof r[c.key] === "number" ? " text-right tabular-nums" : "") + (c.key === "order" ? " font-bold text-white whitespace-nowrap" : "") },
                  CHIP.has(c.key) && r[c.key] ? h("span", { className: "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap " + tone(r[c.key]) }, fmt(r[c.key])) : fmt(r[c.key])
                )
              )
            )
          ),
          !loading && rows.length === 0 && h("tr", null, h("td", { colSpan: Math.max(cols.length, 1), className: "px-4 py-10 text-center text-slate-500" }, "Nothing to show."))
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
