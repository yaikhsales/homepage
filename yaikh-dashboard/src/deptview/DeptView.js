// One screen for the Admin & Support departments — HR, Admin, Accounting, CSR.
//
// Every view is read from the simulated factory on the M1 (POST /api/m1/sim/view
// → guard /sim/view) and arrives in the same shape MRP/FC use:
//   { title, subtitle, summary:[{label,value}], columns:[{key,label}], rows:[…] }
// plus two extras these departments send that MrpView does not draw:
//   chart  : { type:"line", x:[…], y:[…], unit }      — e.g. HR absence trend
//   tables : [ { key, title, columns:[[key,label],…], rows:[…] } ]  — e.g. CSR
//            top consumers by area, waste totals by type, waste-water samples
//
// Nothing here reads the site's own Mongo: the public demo screens show the
// simulated factory only. Written with React.createElement (no JSX), like
// MrpView, so the two screens stay easy to compare.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, Search } from "lucide-react";
import { NavCover, useScreenTop, Figures } from "../components/ScreenTop";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

const fmt = (v) =>
  typeof v === "number" ? v.toLocaleString("en-US") : v === null || v === undefined ? "" : String(v);

// Status-ish words get a chip. Everything the simulated views use today.
const CHIP = new Set(["status", "result", "stage", "state", "outcome", "decision"]);
const TONE = [
  [/^(ok|pass|open|present|paid|approved|closed|done|complete|compliant|online|in stock)/i, "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"],
  [/^(late|short|due|pending|waiting|review|hold|partial|low)/i, "bg-amber-500/15 text-amber-300 ring-amber-500/30"],
  [/^(fail|over|absent|breach|overdue|rejected|offline|critical|out of stock)/i, "bg-rose-500/15 text-rose-300 ring-rose-500/30"],
];
const chipClass = (v) => {
  const s = String(v || "");
  const hit = TONE.find(([re]) => re.test(s));
  return "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 " + (hit ? hit[1] : "bg-slate-500/15 text-slate-300 ring-slate-500/30");
};

const Cell = ({ col, row }) => {
  const v = row[col.key];
  if (CHIP.has(col.key)) return h("td", { className: "px-3 py-2 text-sm" }, h("span", { className: chipClass(v) }, fmt(v)));
  const num = typeof v === "number";
  return h("td", { className: "px-3 py-2 text-sm " + (num ? "tabular-nums text-right text-slate-200" : "text-slate-300") }, fmt(v));
};

const Table = ({ columns, rows, empty }) =>
  h(
    "div",
    { className: "overflow-x-auto rounded-xl ring-1 ring-white/10 bg-slate-900/60" },
    h(
      "table",
      { className: "min-w-full border-collapse" },
      h(
        "thead",
        null,
        h(
          "tr",
          { className: "bg-white/5" },
          columns.map((c) =>
            h("th", { key: c.key, className: "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" }, c.label)
          )
        )
      ),
      h(
        "tbody",
        null,
        rows.length
          ? rows.map((r, i) =>
              h(
                "tr",
                { key: i, className: i % 2 ? "bg-white/[0.02]" : "" },
                columns.map((c) => h(Cell, { key: c.key, col: c, row: r }))
              )
            )
          : h("tr", null, h("td", { colSpan: columns.length, className: "px-3 py-6 text-center text-sm text-slate-500" }, empty || "Nothing to show."))
      )
    )
  );

// A small line chart drawn inline — no chart library, and it reads in both themes.
const Line = ({ chart }) => {
  const xs = (chart && chart.x) || [];
  const ys = (chart && chart.y) || [];
  if (ys.length < 2) return null;
  const W = 720;
  const H = 120;
  const pad = { l: 34, r: 8, t: 10, b: 18 };
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const px = (i) => pad.l + (i * (W - pad.l - pad.r)) / (ys.length - 1);
  const py = (v) => pad.t + (1 - (v - min) / span) * (H - pad.t - pad.b);
  const d = ys.map((v, i) => (i ? "L" : "M") + px(i).toFixed(1) + " " + py(v).toFixed(1)).join(" ");
  return h(
    "div",
    { className: "rounded-xl ring-1 ring-white/10 bg-slate-900/60 p-3" },
    h("div", { className: "mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400" }, chart.unit || "Trend"),
    h(
      "svg",
      { viewBox: `0 0 ${W} ${H}`, className: "w-full", role: "img", "aria-label": chart.unit || "trend" },
      h("path", { d, fill: "none", stroke: "#38bdf8", strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" }),
      ys.map((v, i) => h("circle", { key: i, cx: px(i), cy: py(v), r: 2.5, fill: "#38bdf8" })),
      h("text", { x: 2, y: py(max) + 4, fill: "#64748b", fontSize: 10 }, String(max)),
      h("text", { x: 2, y: py(min) + 4, fill: "#64748b", fontSize: 10 }, String(min)),
      xs.length === ys.length
        ? [0, Math.floor(xs.length / 2), xs.length - 1].map((i) =>
            h("text", { key: "x" + i, x: px(i), y: H - 4, fill: "#64748b", fontSize: 10, textAnchor: i === 0 ? "start" : i === xs.length - 1 ? "end" : "middle" }, xs[i])
          )
        : null
    )
  );
};

const DeptView = ({ onBack, module, label, view: fixedView }) => {
  const params = useParams();
  const view = fixedView || params.view;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [topRef, topPad] = useScreenTop();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, view }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
      setData(j);
    } catch (e) {
      setError(label + " data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [module, label, view]);

  useEffect(() => {
    load();
  }, [load]);

  const cols = (data && data.columns) || [];
  const rows = useMemo(() => {
    const all = (data && data.rows) || [];
    const s = q.trim().toLowerCase();
    return s ? all.filter((r) => Object.values(r).join(" ").toLowerCase().includes(s)) : all;
  }, [data, q]);

  // Secondary tables arrive with columns as [key, label] pairs.
  const extra = ((data && data.tables) || []).map((t) => ({
    key: t.key,
    title: t.title,
    columns: (t.columns || []).map(([key, lab]) => ({ key, label: lab })),
    rows: t.rows || [],
  }));

  return h(
    "div",
    { ref: topRef, className: "min-h-screen bg-slate-900 text-white", style: { paddingTop: topPad } },
    h(NavCover),
    h(
      "div",
      { className: "mx-auto max-w-[1600px] px-4 pb-10" },
      // toolbar
      h(
        "div",
        { className: "mb-3 flex flex-wrap items-center gap-3" },
        // icon-only, so the global round back-button rule in index.css applies
        h("button", { onClick: onBack, "aria-label": "Back" }, h(ArrowLeft)),
        h("h1", { className: "text-lg font-bold" }, (data && data.title) || label),
        h(Figures, { items: (data && data.summary) || [], fmt }),
        h(
          "label",
          { className: "flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 ring-1 ring-white/10" },
          h(Search, { className: "h-4 w-4 text-slate-400" }),
          h("input", {
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Search",
            className: "w-40 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none",
          })
        ),
        h(
          "button",
          { onClick: load, title: "Refresh", className: "rounded-lg bg-white/5 p-2 text-slate-300 ring-1 ring-white/10 hover:bg-white/10" },
          h(RefreshCw, { className: "h-4 w-4 " + (loading ? "animate-spin" : "") })
        )
      ),
      data && data.subtitle ? h("p", { className: "mb-3 text-sm text-slate-400" }, data.subtitle) : null,
      error ? h("div", { className: "rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300 ring-1 ring-rose-500/30" }, error) : null,
      !error && loading && !data ? h("div", { className: "px-1 py-6 text-sm text-slate-400" }, "Loading…") : null,
      !error && data
        ? h(
            "div",
            { className: "flex flex-col gap-4" },
            data.chart ? h(Line, { chart: data.chart }) : null,
            h(Table, { columns: cols, rows, empty: q ? "Nothing matches that search." : "Nothing to show." }),
            extra.map((t) =>
              h(
                "div",
                { key: t.key, className: "flex flex-col gap-2" },
                h("h2", { className: "text-sm font-semibold uppercase tracking-wide text-slate-400" }, t.title),
                h(Table, { columns: t.columns, rows: t.rows })
              )
            )
          )
        : null,
      data && data.simulated
        ? h("p", { className: "mt-4 text-xs text-slate-600" }, "Simulated factory data" + (data.as_of ? " · as of " + data.as_of : ""))
        : null
    )
  );
};

export default DeptView;
