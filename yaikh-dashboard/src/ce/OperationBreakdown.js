// CE · Operation Breakdown — how to build the garment step by step: the machine, its presser foot and
// attachment, the SAM, pieces an hour and the worker grade each operation needs, with the critical
// operations flagged. One order or style at a time (the picker on the left). Data: the simulated factory
// on the M1 (sim/view ce/operation-breakdown). Written with React.createElement like MrpView.
import React from "react";
import MrpView from "../mrp/MrpView";

const h = React.createElement;
const GRADE = { A: "bg-emerald-500 text-slate-900", B: "bg-sky-400 text-slate-900", C: "bg-amber-400 text-slate-900" };

const Steps = (data, rows, loading) =>
  h(
    "div",
    { className: "rounded-2xl border border-slate-700 bg-slate-800/40 p-3" },
    rows.length === 0 && !loading && h("div", { className: "py-10 text-center text-slate-500" }, "Nothing to show."),
    h(
      "ol",
      { className: "space-y-1.5" },
      rows.map((r, i) =>
        h(
          "li",
          { key: i, className: "grid items-center gap-x-3 rounded-xl border px-3 py-2 " + (r.critical === "yes" ? "border-rose-500/40 bg-rose-500/5" : "border-slate-700 bg-slate-900/50"), style: { gridTemplateColumns: "2.2rem 1fr auto" } },
          h("div", { className: "w-8 h-8 rounded-full bg-slate-700 text-white font-black text-sm flex items-center justify-center tabular-nums" }, r.step),
          h(
            "div",
            { className: "min-w-0" },
            h(
              "div",
              { className: "flex flex-wrap items-center gap-x-2 gap-y-0.5" },
              h("span", { className: "font-bold text-white" }, r.operation),
              r.critical === "yes" && h("span", { className: "rounded-full border border-rose-500/40 bg-rose-500/20 text-rose-300 text-[11px] px-2" }, "critical — training"),
              r.garment && h("span", { className: "text-xs text-slate-500" }, r.garment)
            ),
            h(
              "div",
              { className: "text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5" },
              h("span", null, h("b", { className: "text-slate-200" }, r.machine), r.code ? " (" + r.code + ")" : ""),
              r.presser_foot && h("span", null, "foot: ", h("b", { className: "text-slate-200" }, r.presser_foot)),
              r.attachment && h("span", null, "attachment: ", h("b", { className: "text-slate-200" }, r.attachment)),
              r.stations && h("span", null, "stations " + r.stations + (r.operators ? " · " + r.operators + " operators" : ""))
            )
          ),
          h(
            "div",
            { className: "flex items-center gap-2 text-right" },
            h("div", { className: "text-xs text-slate-400 leading-tight" }, h("div", null, h("b", { className: "text-white tabular-nums text-sm" }, r.smv), " min"), r.per_hour ? h("div", null, h("b", { className: "text-slate-200 tabular-nums" }, r.per_hour), " /h") : null),
            h("div", { className: "w-9 h-9 rounded-full font-black text-sm flex items-center justify-center " + (GRADE[r.grade] || "bg-slate-600 text-white"), title: "worker grade " + r.grade }, r.grade === "newcomer" ? "N" : r.grade)
          )
        )
      )
    ),
    h("div", { className: "mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500" }, h("span", null, "grade: A green · B blue · C amber · N newcomer"), h("span", null, "red frame = critical operation, training planned"))
  );

const OperationBreakdown = ({ onBack }) => h(MrpView, { module: "ce", view: "operation-breakdown", label: "CE", onBack, renderBody: Steps });

export default OperationBreakdown;
