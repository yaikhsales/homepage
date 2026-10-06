// CE · Line Balancing — one sewing line's stations as load bars against the pitch time: the bottleneck
// stands out in red, under-loaded stations in amber, balanced ones in green; the live light of each
// station comes from the line. One line at a time (the picker). Data: sim/view ce/line-balancing.
// Written with React.createElement like MrpView.
import React from "react";
import MrpView from "../mrp/MrpView";

const h = React.createElement;
const pct = (v) => Number(String(v || "").replace("%", "")) || 0;
const LIVE = { green: "bg-emerald-400", orange: "bg-amber-400", red: "bg-rose-500" };
const GRADE = { A: "text-emerald-300", B: "text-sky-300", C: "text-amber-300" };

const Bars = (data, rows, loading) => {
  const max = Math.max(100, ...rows.map((r) => pct(r.load)));
  const top = rows.reduce((b, r) => (pct(r.load) > pct(b && b.load) ? r : b), null);
  return h(
    "div",
    { className: "rounded-2xl border border-slate-700 bg-slate-800/40 p-3" },
    rows.length === 0 && !loading && h("div", { className: "py-10 text-center text-slate-500" }, "Nothing to show."),
    top &&
      h(
        "div",
        { className: "mb-2 text-sm text-slate-300" },
        "Bottleneck: ",
        h("b", { className: "text-rose-300" }, "station " + top.no + " " + top.operation + " " + top.load),
        data && data.balance_efficiency !== undefined ? " · balance " + data.balance_efficiency + "%" : "",
        rows[0] && rows[0].pitch ? " · pitch " + rows[0].pitch + " min" : ""
      ),
    h(
      "div",
      { className: "space-y-1" },
      rows.map((r, i) => {
        const l = pct(r.load);
        const colour = l >= 110 ? "bg-rose-500" : l < 85 ? "bg-amber-400" : "bg-emerald-400";
        return h(
          "div",
          { key: i, className: "grid items-center gap-x-2 text-xs", style: { gridTemplateColumns: "1.6rem 11rem 1fr 3.2rem 5rem" } },
          h("div", { className: "text-slate-500 tabular-nums text-right" }, r.no),
          h("div", { className: "truncate" }, h("span", { className: "text-white font-bold" }, r.operation), h("span", { className: "text-slate-500" }, " · " + r.machine_id), r.grade ? h("span", { className: "ml-1 font-bold " + (GRADE[r.grade] || "text-slate-400") }, r.grade) : null),
          h(
            "div",
            { className: "relative h-5 rounded bg-slate-900/70 overflow-hidden" },
            h("div", { className: "absolute inset-y-0 left-0 rounded " + colour, style: { width: Math.round((l / max) * 100) + "%" } }),
            h("div", { className: "absolute inset-y-0 border-l-2 border-dashed border-white/70", style: { left: Math.round((100 / max) * 100) + "%" }, title: "pitch = 100%" })
          ),
          h("div", { className: "tabular-nums text-right font-bold " + (l >= 110 ? "text-rose-300" : l < 85 ? "text-amber-300" : "text-emerald-300") }, r.load),
          h("div", { className: "flex items-center gap-1.5 text-slate-400 whitespace-nowrap" }, h("span", { className: "inline-block w-2.5 h-2.5 rounded-full " + (LIVE[r.live] || "bg-slate-600"), title: "live: " + (r.live || "—") }), h("span", { className: "tabular-nums" }, r.capacity ? r.capacity + "/h" : ""))
        );
      })
    ),
    h("div", { className: "mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500" }, h("span", null, "bar = station load against the pitch (dashed line = 100%)"), h("span", null, "red ≥ 110% bottleneck · amber < 85% under-loaded"), h("span", null, "dot = live state of the station"))
  );
};

const LineBalancing = ({ onBack }) => h(MrpView, { module: "ce", view: "line-balancing", label: "CE", onBack, renderBody: Bars });

export default LineBalancing;
