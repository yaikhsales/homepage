// FC · Warehouse Location Plan — the rack space the containers MRP reports will need, day by day for the
// next 14 days, against the cages that come free as lots are issued to cutting. Read from the simulated
// factory on the M1 (POST /api/m1/sim/view {module:"fc", view:"location-plan"}). A day strip shows free
// cages after arrivals against cages needed; click a day for its containers; the table below is the plan
// itself. Written with React.createElement (no JSX), like MrpView, so `node --check` can parse it.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw, Ship, Truck, Plane, Package } from "lucide-react";
import { NavCover, useScreenTop, Figures } from "../components/ScreenTop";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const fmt = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v === null || v === undefined ? "" : String(v));
const MODE_ICON = { sea: Ship, truck: Truck, air: Plane };
// Bar and chip colours follow the server's tone: green = enough room, amber = tight, red = shortfall.
const BAR = { green: "bg-emerald-400", amber: "bg-amber-400", red: "bg-rose-500" };
const CHIP = {
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  red: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const LocationPlan = ({ onBack }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState(""); // the day whose arrivals are open
  const [topRef, topPad] = useScreenTop();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "fc", view: "location-plan" }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
      setData(j);
    } catch (e) {
      setError("Location plan data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const rows = (data && data.rows) || [];
  const cols = (data && data.columns) || [];
  const stock = (data && data.stock_cages) || 0;
  // The strip is scaled to the biggest figure on it, so a shortfall day still fits.
  const top = useMemo(() => Math.max(1, ...rows.map((r) => Math.max(r.free_start || 0, r.free_after || 0, r.cages_needed || 0))), [rows]);
  const open = rows.find((r) => r.day === day);
  const anyShort = rows.some((r) => r.shortfall > 0);

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 436px; }"),
    h(NavCover),
    h(
      "div",
      { className: "flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2" },
      onBack && h("button", { onClick: onBack, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: "text-lg font-black text-white leading-none whitespace-nowrap", title: (data && data.subtitle) || undefined }, (data && data.title) || "Warehouse Location Plan"),
      h(Figures, { items: data && data.summary, fmt, tone: (x) => (/short/i.test(x.label) && Number(x.value) > 0 ? "text-rose-300" : undefined) }),
      h("button", { onClick: load, className: "ml-auto p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700", "aria-label": "Refresh" }, h(RefreshCw, { size: 14, className: loading ? "animate-spin" : "" }))
    ),
    error && h("div", { className: "mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm" }, error),
    // The verdict line: made automatically from MRP's arrivals, and whether anything has to be done before they land.
    data &&
      h(
        "div",
        { className: "mb-3 rounded-xl border px-3 py-2 text-sm " + (anyShort ? CHIP.red : CHIP.green) },
        anyShort
          ? "Rack space runs short on " + rows.filter((r) => r.shortfall > 0).map((r) => r.day).join(", ") + " — add the extra cages or move stock before those containers arrive."
          : "Enough rack space for every container in the next 14 days — tightest day " + (data.tightest || "") + " with " + fmt(data.min_free) + " of " + fmt(stock) + " stock cages free."
      ),
    // Day strip: one column per day — free cages after arrivals (bar) against cages needed (marker), click to open the day.
    rows.length > 0 &&
      h(
        "div",
        { className: "mb-3 rounded-2xl border border-slate-700 bg-slate-800/40 px-3 pt-2 pb-1 overflow-x-auto" },
        h(
          "div",
          { className: "flex items-end gap-1", style: { minWidth: rows.length * 50 } },
          rows.map((r) =>
            h(
              "button",
              { key: r.day, onClick: () => setDay(day === r.day ? "" : r.day), className: "flex-1 min-w-[46px] text-center group", title: r.day + " · " + r.action },
              h("div", { className: "text-[11px] tabular-nums text-slate-300 font-bold" }, fmt(r.free_after)),
              h(
                "div",
                { className: "relative h-24 flex items-end justify-center" },
                h("div", { className: "w-7 rounded-t-md " + (BAR[r.tone] || BAR.green) + (day === r.day ? " ring-2 ring-white" : " group-hover:opacity-90"), style: { height: Math.max(2, Math.round((r.free_after / top) * 96)) + "px" } }),
                r.cages_needed > 0 && h("div", { className: "absolute left-1/2 -translate-x-1/2 w-9 border-t-2 border-dashed border-sky-300", style: { bottom: Math.round((r.cages_needed / top) * 96) + "px" }, title: fmt(r.cages_needed) + " cages needed" })
              ),
              h("div", { className: "text-[11px] text-slate-400 leading-tight mt-1" }, r.weekday || "", h("br"), r.day.slice(0, 6)),
              h("div", { className: "text-[10px] text-slate-500 tabular-nums" }, r.containers ? r.containers + " cont." : "—")
            )
          )
        ),
        h("div", { className: "flex gap-4 text-[11px] text-slate-500 mt-1 px-1" }, h("span", null, "bar = free cages after that day's arrivals"), h("span", null, "dashed line = cages those arrivals need"), h("span", null, "red = shortfall"))
      ),
    // The chosen day's containers.
    open &&
      h(
        "div",
        { className: "mb-3 rounded-2xl border border-slate-700 bg-slate-800/60 p-3" },
        h("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 text-sm" }, h("b", { className: "text-white" }, open.day), h("span", { className: "text-slate-400" }, fmt(open.containers) + " containers · " + fmt(open.rolls) + " rolls · " + fmt(open.lots) + " lots · " + fmt(open.cages_needed) + " cages needed · " + fmt(open.cages_freed) + " freed by issuing"), h("span", { className: "inline-block rounded-full border px-2 py-0.5 text-xs " + (CHIP[open.tone] || CHIP.green) }, open.action)),
        (open.arrivals || []).length === 0
          ? h("div", { className: "text-sm text-slate-500" }, "No containers reported for this day.")
          : h(
              "div",
              { className: "grid gap-2 md:grid-cols-2 xl:grid-cols-3" },
              open.arrivals.map((a) =>
                h(
                  "div",
                  { key: a.container, className: "flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2" },
                  h(MODE_ICON[a.mode] || Package, { size: 18, className: "text-sky-300 flex-shrink-0" }),
                  h(
                    "div",
                    { className: "min-w-0" },
                    h("div", { className: "text-sm font-bold text-white truncate" }, a.container, h("span", { className: "text-slate-400 font-normal" }, " · " + a.order)),
                    h("div", { className: "text-xs text-slate-400 truncate" }, fmt(a.rolls) + " rolls · " + Math.ceil((a.rolls || 0) / ((data && data.rolls_per_cage) || 20)) + " cages · " + (a.from || "") + (a.mode ? " by " + a.mode : "") + (a.supplier ? " · " + a.supplier : ""))
                  )
                )
              )
            )
      ),
    // The plan table, as the server describes it.
    h(
      "div",
      { className: "rounded-2xl border border-slate-700 bg-slate-800/40 overflow-x-auto" },
      h(
        "table",
        { className: "w-full border-collapse" },
        h("thead", null, h("tr", { className: "bg-slate-800 text-left" }, cols.map((c) => h("th", { key: c.key, className: "px-3 py-2 text-sm font-bold text-slate-300 uppercase tracking-wider text-xs whitespace-nowrap" }, c.label)))),
        h(
          "tbody",
          null,
          rows.map((r) =>
            h(
              "tr",
              { key: r.day, onClick: () => setDay(day === r.day ? "" : r.day), className: "border-t border-slate-700/70 hover:bg-slate-700/40 cursor-pointer" + (day === r.day ? " bg-slate-700/40" : "") },
              cols.map((c) =>
                h(
                  "td",
                  { key: c.key, className: "px-3 py-2 text-sm" + (typeof r[c.key] === "number" ? " text-right tabular-nums" : "") + (c.key === "day" ? " font-bold text-white whitespace-nowrap" : "") + (c.key === "shortfall" && r.shortfall > 0 ? " text-rose-300 font-bold" : "") },
                  c.key === "action" ? h("span", { className: "inline-block rounded-full border px-2 py-0.5 text-xs whitespace-nowrap " + (CHIP[r.tone] || CHIP.green) }, r.action) : c.key === "day" ? r.day + (r.weekday ? " · " + r.weekday : "") : fmt(r[c.key])
                )
              )
            )
          ),
          !loading && rows.length === 0 && h("tr", null, h("td", { colSpan: Math.max(cols.length, 1), className: "px-4 py-10 text-center text-slate-500" }, "Nothing to show."))
        )
      )
    ),
    h("p", { className: "mt-3 text-xs text-slate-500" }, (data ? "Each lot takes rolls ÷ " + fmt(data.rolls_per_cage) + " cages, rounded up; a cage is free again the day after its last issue to cutting · " + fmt(stock) + " stock cages (A01–A28) of " + fmt(data.total_cages) + " · as of " + String(data.as_of || "").replace("T", " ").slice(0, 16) + " · " : "") + "Simulated factory data — no real customer, supplier or person.")
  );
};

export default LocationPlan;
