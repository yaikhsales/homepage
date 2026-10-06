// CE · Operation Breakdown — the saved garment analyses (date, style, order, operations, total SAM, IE);
// opening one shows its operation list as a printable sheet with a Print button. Data:
// {"module":"ce","view":"operation-breakdown"} → analyses; with id → rows + totals + analysis.
// Written with React.createElement like MrpView.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Printer, Search } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { SketchSet, garmentsOf } from "./sketches";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const num = (v, d = 2) => (v === undefined || v === null || v === "" ? "—" : typeof v === "number" ? String(Number(v.toFixed(d))) : String(v));
const PRINT = "@media print { body * { visibility: hidden !important; } .ob-sheet, .ob-sheet * { visibility: visible !important; } .ob-sheet { position: absolute; left: 0; top: 0; width: 100%; background: #fff !important; color: #000 !important; border: 0 !important; padding: 12mm !important; } .ob-sheet * { color: #000 !important; border-color: #999 !important; background: transparent !important; } .ob-noprint { display: none !important; } }";

const OperationBreakdown = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [id, setId] = useState("");
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pd, setPd] = useState([]); // the product-development stages (SAM 1 / SAM 2 / critical ops) by order
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ce", view: "operation-breakdown", id: id || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
      setData(j);
    } catch (e) {
      setError("Operation Breakdown data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ce", view: "product-development" }) })
      .then((r) => r.json())
      .then((j) => setPd((j && j.rows) || []))
      .catch(() => setPd([]));
  }, []);

  const d = data || {};
  const cols = d.analyses_columns || [["id", "Analysis"], ["date", "Date"], ["style", "Style"], ["order", "Order"], ["garment_type", "Garment"], ["ops", "Operations"], ["total_sam", "Total SAM"], ["ie_code", "IE"], ["status", "Status"]];
  const needle = q.trim().toLowerCase();
  const analyses = (d.analyses || []).filter((a) => !needle || cols.some(([k]) => String(a[k] || "").toLowerCase().includes(needle)));
  const a = d.analysis;
  const rows = id ? d.rows || [] : [];
  const t = d.totals || {};
  const stages = a ? pd.filter((r) => r.order === a.order) : [];

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 436px; } " + PRINT),
    h(NavCover),
    h(
      "div",
      { className: "flex flex-wrap items-center gap-2 mb-3 ob-noprint" },
      h("button", { onClick: back, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: "text-base md:text-lg font-black text-white leading-none" }, "Operation Breakdown"),
      h("span", { className: "text-xs text-slate-400" }, (d.analyses || []).length + " saved garment analyses"),
      h("div", { className: "ml-auto relative" }, h(Search, { size: 13, className: "absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" }), h("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search style, order, IE…", className: "rounded-md border border-slate-700 bg-slate-800 text-xs text-slate-200 pl-7 pr-2 py-1 w-48" })),
      h("button", { onClick: load, className: "p-1.5 rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white", "aria-label": "Refresh", title: "Refresh" }, h(RefreshCw, { size: 13, className: loading ? "animate-spin" : "" }))
    ),
    error && h("div", { className: "mb-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm px-3 py-2 ob-noprint" }, error),
    h(
      "div",
      { className: "grid gap-3 " + (id ? "xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : "") },
      h(
        "div",
        { className: "rounded-2xl border border-slate-700 bg-slate-800/40 p-2 ob-noprint min-w-0" },
        h("div", { className: "px-2 pb-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold" }, "Saved analyses"),
        h(
          "div",
          { className: "overflow-auto max-h-[70vh] rounded-lg" },
          h("table", { className: "w-full text-xs" }, h("thead", { className: "bg-slate-900/80 sticky top-0" }, h("tr", null, cols.map(([k, l]) => h("th", { key: k, className: "text-left font-normal text-slate-500 px-2 py-1 whitespace-nowrap" }, l)))), h("tbody", null, analyses.map((r) => h("tr", { key: r.id, onClick: () => setId(r.id), className: "border-t border-slate-800/70 cursor-pointer " + (r.id === id ? "bg-emerald-500/15" : "hover:bg-slate-700/40") }, cols.map(([k]) => h("td", { key: k, className: "px-2 py-1 whitespace-nowrap " + (k === "id" || k === "style" ? "text-white font-bold" : k === "total_sam" || k === "ops" ? "text-right tabular-nums text-slate-200" : "text-slate-300") }, k === "total_sam" ? num(r[k]) : r[k] === undefined || r[k] === null ? "—" : String(r[k]))))), analyses.length === 0 && h("tr", null, h("td", { colSpan: cols.length, className: "px-2 py-8 text-center text-slate-500" }, loading ? "Loading…" : "Nothing to show."))))
        )
      ),
      id &&
        h(
          "div",
          { className: "ob-sheet rounded-2xl border border-slate-700 bg-white text-slate-900 p-4 min-w-0" },
          h(
            "div",
            { className: "flex items-start gap-3 border-b border-slate-300 pb-2 mb-2" },
            h(
              "div",
              { className: "flex-1 min-w-0" },
              h(
                "div",
                { className: "flex flex-wrap items-start gap-2" },
            h("div", { className: "min-w-0" }, h("div", { className: "text-[11px] uppercase tracking-wider text-slate-500" }, "Operation breakdown sheet"), h("div", { className: "text-lg font-black leading-tight" }, a ? a.style : id), a && h("div", { className: "text-xs text-slate-600" }, [a.id, a.order ? "order " + a.order : "", a.garment_type, a.date, a.ie ? a.ie + " (" + a.ie_code + ")" : "", a.status].filter(Boolean).join(" · "))),
                h("button", { type: "button", onClick: () => window.print(), className: "ob-noprint ml-auto inline-flex items-center gap-1 rounded-md bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5" }, h(Printer, { size: 13 }), "Print")
              ),
              stages.length > 0 &&
                h(
                  "div",
                  { className: "flex flex-wrap gap-1.5 mt-2 text-[11px]" },
                  stages.map((r) => h(React.Fragment, { key: r.garment }, h("span", { className: "rounded-full border border-slate-300 px-2 py-0.5", title: r.sam1_status + (r.sam1_date ? " · " + r.sam1_date : "") }, (stages.length > 1 ? r.garment + " · " : "") + "SAM 1 ", h("b", null, num(r.sam1))), h("span", { className: "rounded-full border border-slate-300 px-2 py-0.5", title: r.sam2_status + (r.sam2_date ? " · " + r.sam2_date : "") }, "SAM 2 ", h("b", null, num(r.sam2))), h("span", { className: "rounded-full border border-slate-300 px-2 py-0.5", title: "critical operations" }, "critical ", h("b", null, r.critical)), r.ai_stage && h("span", { className: "rounded-full border border-slate-300 px-2 py-0.5 text-slate-600" }, r.ai_stage + " · " + r.status)))
                )
            ),
            // the sketch of the garment (both pieces of a set), printed with the sheet
            h("div", { className: "flex-shrink-0" }, h(SketchSet, { text: a ? a.garment_type || a.style : d.garment && d.garment.garment, size: garmentsOf(a ? a.garment_type || a.style : "").length > 1 ? 120 : 150 }))
          ),
          h("div", { className: "grid grid-cols-4 gap-2 text-xs mb-2" }, [["Total SAM", num(t.total_sam) + " min"], ["Operations", num(t.operations, 0)], ["Stations", num(t.stations, 0)], ["Machines", (t.machines || []).reduce((s, m) => s + (m.count || 0), 0) || "—"]].map(([k, v]) => h("div", { key: k, className: "rounded border border-slate-300 p-1.5" }, h("div", { className: "text-[10px] uppercase tracking-wider text-slate-500" }, k), h("div", { className: "font-black tabular-nums" }, v)))),
          h(
            "table",
            { className: "w-full text-xs" },
            h("thead", null, h("tr", { className: "border-b border-slate-400" }, ["#", "Operation", "Part", "Category", "Machine", "Code", "St", "Seam mm", "SAM", "Grade"].map((c, i) => h("th", { key: i, className: "text-left font-bold py-1 pr-2 whitespace-nowrap " + (i >= 6 ? "text-right" : "") }, c)))),
            h("tbody", null, rows.map((r) => h("tr", { key: r.no, className: "border-b border-slate-200 " + (r.critical === "yes" ? "font-bold" : "") }, h("td", { className: "py-0.5 pr-2 tabular-nums" }, r.no), h("td", { className: "py-0.5 pr-2" }, r.operation, r.critical === "yes" ? " *" : ""), h("td", { className: "py-0.5 pr-2" }, r.part || ""), h("td", { className: "py-0.5 pr-2" }, r.category || ""), h("td", { className: "py-0.5 pr-2" }, r.machine), h("td", { className: "py-0.5 pr-2" }, r.code || ""), h("td", { className: "py-0.5 pr-2 text-right tabular-nums" }, r.stations !== undefined ? r.stations : ""), h("td", { className: "py-0.5 pr-2 text-right tabular-nums" }, r.seam_width_mm !== undefined && r.seam_width_mm !== null ? r.seam_width_mm : ""), h("td", { className: "py-0.5 pr-2 text-right tabular-nums" }, num(r.sam)), h("td", { className: "py-0.5 text-right" }, r.grade || ""))), rows.length === 0 && h("tr", null, h("td", { colSpan: 10, className: "py-6 text-center text-slate-500" }, loading ? "Loading…" : "No operations on this analysis.")))
          ),
          (t.machines || []).length > 0 && h("div", { className: "mt-2 text-xs" }, h("b", null, "Machines: "), t.machines.map((m) => m.type + " × " + m.count + " (" + num(m.minutes) + " min)").join(" · ")),
          h("div", { className: "mt-2 text-[10px] text-slate-500" }, "* critical operation · simulated factory data — no real customer, supplier or person")
        )
    )
  );
};

export default OperationBreakdown;
