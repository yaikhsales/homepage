// CE · Garment Analysis — build the operation list on the garment. LEFT: the operations (no, operation,
// SAM, machine, seam width, seam thumbnail), added from the Operation Library by drag or "+ add".
// RIGHT: the garment drawn as SVG; clicking a row rings its spot on the drawing, clicking a spot selects
// the row. Below: totals — total SAM, machines by type with count and minutes. Data:
// {"module":"ce","view":"garment-analysis", style} and the library from {"view":"operation-library", pick}.
// Written with React.createElement like MrpView.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Plus, Trash2, GripVertical } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import GarmentDrawing from "./GarmentDrawing";
import { Seam, seamName } from "./seams";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const num = (v, d = 2) => (v === undefined || v === null || v === "" ? "—" : typeof v === "number" ? String(Number(v.toFixed(d))) : String(v));
const post = async (body) => {
  const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
  return j;
};

const GarmentAnalysis = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [style, setStyle] = useState("tee-round-neck");
  const [data, setData] = useState(null);
  const [library, setLibrary] = useState([]);
  const [added, setAdded] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const j = await post({ module: "ce", view: "garment-analysis", style });
      setData(j);
      setAdded([]);
      setSelected(null);
      try {
        const lib = await post({ module: "ce", view: "operation-library", pick: j.garment && j.garment.garment });
        setLibrary(lib.rows || []);
      } catch (e) {
        setLibrary([]);
      }
    } catch (e) {
      setError("Garment Analysis data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [style]);
  useEffect(() => {
    load();
  }, [load]);

  const d = data || {};
  const base = useMemo(() => (data && data.rows) || [], [data]);
  const rows = useMemo(() => base.concat(added.map((a, i) => ({ ...a, no: base.length + i + 1, added: true }))), [base, added]);
  const t = d.totals || {};
  const addedSam = added.reduce((s, a) => s + (Number(a.sam) || 0), 0);
  const totalSam = (Number(t.total_sam) || 0) + addedSam;
  const addFromLibrary = (op) => setAdded((a) => a.concat([{ operation: op.operation, machine: op.machine, code: op.code, sam: Number(op.smv !== undefined ? op.smv : op.sam) || 0, seam_width_mm: op.seam_width_mm, category: op.category, hotspot: { x: 50, y: 60 }, grade: op.grade }]));
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const op = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (op && op.operation) addFromLibrary(op);
    } catch (err) {
      /* not an operation */
    }
  };

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 436px; }"),
    h(NavCover),
    h(
      "div",
      { className: "flex flex-wrap items-center gap-2 mb-3" },
      h("button", { onClick: back, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: "text-base md:text-lg font-black text-white leading-none" }, "Garment Analysis"),
      h("select", { value: style, onChange: (e) => setStyle(e.target.value), className: "rounded-md border border-slate-700 bg-slate-800 text-xs text-slate-200 px-2 py-1", "aria-label": "Style" }, (d.styles || [{ id: "tee-round-neck", name: "round neck t-shirt" }]).map((s) => h("option", { key: s.id, value: s.id }, s.name + (s.sam ? " · SAM " + s.sam : "")))),
      d.garment && h("span", { className: "text-xs text-slate-400" }, d.garment.garment + (d.garment.order ? " · " + d.garment.order : "")),
      h("div", { className: "ml-auto flex flex-wrap gap-x-3 text-xs text-slate-400" }, h("span", null, "Total SAM ", h("b", { className: "text-white tabular-nums" }, num(totalSam))), h("span", null, "Operations ", h("b", { className: "text-white tabular-nums" }, rows.length)), h("span", null, "Stations ", h("b", { className: "text-white tabular-nums" }, num(t.stations, 0)))),
      h("button", { onClick: load, className: "p-1.5 rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white", "aria-label": "Refresh", title: "Refresh" }, h(RefreshCw, { size: 13, className: loading ? "animate-spin" : "" }))
    ),
    error && h("div", { className: "mb-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm px-3 py-2" }, error),
    h(
      "div",
      { className: "grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" },
      // LEFT — the operation list (drop target) and the library
      h(
        "div",
        { className: "flex flex-col gap-3 min-w-0" },
        h(
          "div",
          { onDragOver: (e) => { e.preventDefault(); setDragOver(true); }, onDragLeave: () => setDragOver(false), onDrop, className: "rounded-2xl border bg-slate-800/40 p-2 transition-colors " + (dragOver ? "border-emerald-400 bg-emerald-500/10" : "border-slate-700") },
          h("div", { className: "px-2 pb-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold flex justify-between" }, h("span", null, "Operations"), h("span", { className: "normal-case font-normal text-slate-500" }, "drag from the library or + add")),
          h(
            "div",
            { className: "overflow-auto rounded-lg" },
            h(
              "table",
              { className: "w-full text-xs" },
              h("thead", { className: "bg-slate-900/80" }, h("tr", null, ["#", "Operation", "SAM", "Machine", "Seam mm", "Seam", ""].map((c, i) => h("th", { key: i, className: "text-left font-normal text-slate-500 px-2 py-1 whitespace-nowrap " + (i === 2 || i === 4 ? "text-right" : "") }, c)))),
              h(
                "tbody",
                null,
                rows.map((r) =>
                  h(
                    "tr",
                    { key: r.no, onClick: () => setSelected(r.no), className: "border-t border-slate-800/70 cursor-pointer " + (selected === r.no ? "bg-emerald-500/15" : r.added ? "bg-sky-500/5 hover:bg-slate-700/40" : "hover:bg-slate-700/40") },
                    h("td", { className: "px-2 py-1 tabular-nums text-slate-500" }, r.no),
                    h("td", { className: "px-2 py-1 text-white font-bold whitespace-nowrap" }, r.operation, r.critical === "yes" && h("span", { className: "ml-1 w-1.5 h-1.5 inline-block rounded-full bg-rose-500 align-middle", title: "critical" }), r.part && h("span", { className: "ml-1 text-slate-500 font-normal" }, r.part)),
                    h("td", { className: "px-2 py-1 text-right tabular-nums text-slate-200" }, num(r.sam)),
                    h("td", { className: "px-2 py-1 text-slate-300 whitespace-nowrap" }, r.machine, r.code && h("span", { className: "text-slate-500" }, " " + r.code), r.stations ? h("span", { className: "text-slate-500" }, " · " + r.stations + " st") : null),
                    h("td", { className: "px-2 py-1 text-right tabular-nums text-slate-300" }, r.seam_width_mm !== undefined && r.seam_width_mm !== null ? r.seam_width_mm : "—"),
                    h("td", { className: "px-2 py-1" }, h(Seam, { k: r.seam_image_key, code: r.code, size: 64 })),
                    h("td", { className: "px-1 py-1 text-right" }, r.added && h("button", { type: "button", onClick: (e) => { e.stopPropagation(); setAdded((a) => a.filter((x, i) => base.length + i + 1 !== r.no)); }, className: "text-slate-500 hover:text-rose-300", "aria-label": "Remove" }, h(Trash2, { size: 12 })))
                  )
                ),
                rows.length === 0 && h("tr", null, h("td", { colSpan: 7, className: "px-2 py-8 text-center text-slate-500" }, loading ? "Loading…" : "Nothing to show."))
              )
            )
          )
        ),
        h(
          "div",
          { className: "rounded-2xl border border-slate-700 bg-slate-800/40 p-2" },
          h("div", { className: "px-2 pb-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold" }, "Operation Library" + (library.length ? " · " + library.length : "")),
          library.length
            ? h("div", { className: "max-h-56 overflow-auto space-y-1" }, library.map((op, i) => h("div", { key: op.id || i, draggable: true, onDragStart: (e) => e.dataTransfer.setData("text/plain", JSON.stringify(op)), className: "flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/50 px-2 py-1 text-xs cursor-grab active:cursor-grabbing" }, h(GripVertical, { size: 12, className: "text-slate-600" }), h("div", { className: "min-w-0 flex-1 truncate" }, h("b", { className: "text-white" }, op.operation), h("span", { className: "text-slate-500" }, " · " + (op.machine || "") + (op.category ? " · " + op.category : ""))), h("span", { className: "tabular-nums text-slate-300" }, num(op.smv !== undefined ? op.smv : op.sam)), h("button", { type: "button", onClick: () => addFromLibrary(op), className: "inline-flex items-center gap-0.5 rounded-md border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 px-1.5 py-0.5 text-[11px]" }, h(Plus, { size: 11 }), "add"))))
            : h("div", { className: "px-2 py-4 text-xs text-slate-500" }, loading ? "Loading…" : "The library has nothing for this garment.")
        )
      ),
      // RIGHT — the drawing and the totals
      h(
        "div",
        { className: "flex flex-col gap-3 min-w-0" },
        h(
          "div",
          { className: "rounded-2xl border border-slate-700 bg-slate-950/70 p-3" },
          h("div", { className: "flex items-center justify-between mb-1" }, h("div", { className: "text-[11px] uppercase tracking-wider text-slate-400 font-bold" }, "Front view" + (d.garment ? " · " + d.garment.type : "")), selected && h("div", { className: "text-xs text-emerald-300" }, "#" + selected + " " + ((rows.find((r) => r.no === selected) || {}).operation || ""))),
          h("div", { className: "aspect-square max-h-[28rem] mx-auto" }, h(GarmentDrawing, { imageKey: d.garment && d.garment.image_key, rows, selected, onPick: setSelected })),
          h("div", { className: "text-[10px] text-slate-500 text-center" }, "blue = operation spot · red = critical · green ring = selected"),
          selected && (() => { const r = rows.find((x) => x.no === selected) || {}; return h("div", { className: "mt-2 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-2" }, h(Seam, { k: r.seam_image_key, code: r.code, size: 128 }), h("div", { className: "text-xs text-slate-300 min-w-0" }, h("div", { className: "font-bold text-white" }, r.operation), h("div", { className: "text-slate-400" }, (r.machine || "") + (r.seam_width_mm ? " · seam " + r.seam_width_mm + " mm" : "")), h("div", { className: "text-slate-500" }, seamName(r.seam_image_key) || "seam by machine type"))); })()
        ),
        h(
          "div",
          { className: "rounded-2xl border border-slate-700 bg-slate-950/70 p-3" },
          h("div", { className: "text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2" }, "Totals"),
          h("div", { className: "grid grid-cols-3 gap-2 mb-2" }, [["Total SAM", num(totalSam), "min"], ["Single needle", num(t.single_needle_min), "min"], ["Overlock", num(t.overlock_min), "min"], ["Flatlock", num(t.flatlock_min), "min"], ["Bartack", num(t.bartack_min), "min"], ["Manual", num(t.manual_min), "min"]].map(([k, v, u]) => h("div", { key: k, className: "rounded-lg border border-slate-700 bg-slate-900 p-2" }, h("div", { className: "text-[10px] uppercase tracking-wider text-slate-500" }, k), h("div", { className: "font-black text-white tabular-nums" }, v, h("span", { className: "text-xs text-slate-400 font-normal" }, " " + u))))),
          (t.machines || []).length > 0 && h("table", { className: "w-full text-xs" }, h("thead", null, h("tr", { className: "text-slate-500" }, h("th", { className: "text-left font-normal py-0.5" }, "Machines allocated"), h("th", { className: "text-right font-normal py-0.5" }, "count"), h("th", { className: "text-right font-normal py-0.5" }, "minutes"))), h("tbody", null, t.machines.map((m) => h("tr", { key: m.type, className: "border-t border-slate-800/70" }, h("td", { className: "py-0.5 text-slate-200" }, m.type), h("td", { className: "py-0.5 text-right tabular-nums text-white font-bold" }, m.count), h("td", { className: "py-0.5 text-right tabular-nums text-slate-300" }, num(m.minutes)))))),
          added.length > 0 && h("div", { className: "mt-2 text-[11px] text-sky-300" }, added.length + " operation" + (added.length > 1 ? "s" : "") + " added here (+" + num(addedSam) + " min) — not saved")
        )
      )
    ),
    h("p", { className: "mt-3 text-xs text-slate-500" }, "Simulated factory data — no real customer, supplier or person.")
  );
};

export default GarmentAnalysis;
