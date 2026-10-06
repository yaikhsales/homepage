// CE · IE Master — the drill-down: garment type → category → operation → the operation's detail: the
// standard video, who has done it (operator codes), the best-efficiency operator, the quality defect
// history and the method improvements. Data: {"module":"ce","view":"ie-master", type, category, operation}
// on the simulated factory (M1). Compact one-line header. Written with React.createElement like MrpView.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, ChevronRight, Play, Trophy } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { Seam } from "./seams";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const GRADE = { A: "bg-emerald-500 text-slate-900", B: "bg-sky-400 text-slate-900", C: "bg-amber-400 text-slate-900" };
const num = (v, d = 2) => (v === undefined || v === null || v === "" ? "—" : typeof v === "number" ? String(Number(v.toFixed(d))) : String(v));

const Col = (title, children) => h("div", { className: "rounded-2xl border border-slate-700 bg-slate-800/40 p-2 min-w-0" }, h("div", { className: "px-2 pb-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold" }, title), children);
const Row = ({ on, onClick, children }) => h("button", { type: "button", onClick, className: "w-full text-left flex items-center gap-2 rounded-xl px-2.5 py-1.5 mb-1 border text-sm transition-colors " + (on ? "bg-emerald-500/20 border-emerald-500/40" : "border-transparent hover:bg-slate-700/60") }, children);
const Block = (title, children) => h("section", { className: "rounded-xl border border-slate-700 bg-slate-950/60 p-3" }, h("div", { className: "text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2" }, title), children);
const Table = (cols, rows, key) =>
  h(
    "div",
    { className: "overflow-auto rounded-lg border border-slate-800" },
    h(
      "table",
      { className: "w-full text-xs" },
      h("thead", { className: "bg-slate-900" }, h("tr", null, cols.map(([k, l]) => h("th", { key: k, className: "text-left font-normal text-slate-500 px-2 py-1 whitespace-nowrap" }, l)))),
      h("tbody", null, rows.map((r, i) => h("tr", { key: r[key] || i, className: "border-t border-slate-800/70 " + (r.best === "yes" ? "bg-emerald-500/10" : "") }, cols.map(([k]) => h("td", { key: k, className: "px-2 py-1 text-slate-300 whitespace-nowrap" }, r[k] === undefined || r[k] === null ? "—" : String(r[k]))))))
    )
  );

const IeMaster = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [sel, setSel] = useState({ type: "", category: "", operation: "" });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ce", view: "ie-master", type: sel.type || undefined, category: sel.category || undefined, operation: sel.operation || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
      setData(j);
    } catch (e) {
      setError("IE Master data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [sel]);
  useEffect(() => {
    load();
  }, [load]);

  const d = data || {};
  const types = d.types || [];
  const cats = d.categories || [];
  const ops = d.operations || [];
  const det = d.detail;
  const video = det && det.video;

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 484px; }"),
    h(NavCover),
    h(
      "div",
      { className: "flex flex-wrap items-center gap-2 mb-3" },
      h("button", { onClick: back, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: "text-base md:text-lg font-black text-white leading-none" }, "IE Master"),
      h("span", { className: "text-xs text-slate-400 flex items-center gap-1" }, sel.type || "garment type", h(ChevronRight, { size: 12 }), sel.category ? (cats.find((c) => c.id === sel.category) || {}).name || sel.category : "category", h(ChevronRight, { size: 12 }), det ? det.operation : "operation"),
      (d.summary || []).length > 0 && h("div", { className: "ml-auto flex flex-wrap gap-x-3 text-xs text-slate-400" }, d.summary.map((f) => h("span", { key: f.label }, f.label + " ", h("b", { className: "text-white tabular-nums" }, f.value)))),
      h("button", { onClick: load, className: "p-1.5 rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white", "aria-label": "Refresh", title: "Refresh" }, h(RefreshCw, { size: 13, className: loading ? "animate-spin" : "" }))
    ),
    error && h("div", { className: "mb-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm px-3 py-2" }, error, " ", h("button", { onClick: load, className: "rounded border border-amber-400/50 px-2 py-0.5 text-xs font-bold hover:bg-amber-500/10" }, "Retry")),
    h(
      "div",
      { className: "grid gap-3 lg:grid-cols-[11rem_12rem_minmax(0,1fr)]" },
      Col("Garment types", types.map((t) => h(Row, { key: t.id, on: sel.type === t.id, onClick: () => setSel({ type: t.id, category: "", operation: "" }) }, h("div", { className: "min-w-0" }, h("div", { className: "font-bold text-white truncate" }, t.garment || t.name), h("div", { className: "text-[11px] text-slate-400" }, t.count + " ops · SAM " + num(t.sam) + (t.videos ? " · " + t.videos + " videos" : "")))))),
      Col("Categories", sel.type ? (cats.length ? cats.map((c) => h(Row, { key: c.id, on: sel.category === c.id, onClick: () => setSel({ ...sel, category: c.id, operation: "" }) }, h("div", { className: "min-w-0" }, h("div", { className: "font-bold text-white truncate" }, c.name), h("div", { className: "text-[11px] text-slate-400" }, c.count + " ops · " + num(c.smv) + " min" + (c.critical ? " · " + c.critical + " critical" : ""))))) : h("div", { className: "px-2 py-6 text-xs text-slate-500" }, loading ? "Loading…" : "No categories.")) : h("div", { className: "px-2 py-6 text-xs text-slate-500" }, "Pick a garment type.")),
      h(
        "div",
        { className: "grid gap-3 xl:grid-cols-[16rem_minmax(0,1fr)] min-w-0" },
        Col("Operations", sel.category ? (ops.length ? ops.map((o) => h(Row, { key: o.id, on: sel.operation === o.id, onClick: () => setSel({ ...sel, operation: o.id }) }, h("span", { className: "w-6 text-[11px] text-slate-500 tabular-nums" }, o.step), h("div", { className: "min-w-0 flex-1" }, h("div", { className: "font-bold text-white truncate" }, o.operation), h("div", { className: "text-[11px] text-slate-400 truncate" }, o.machine + " · " + num(o.smv) + " min")), o.critical === "yes" && h("span", { className: "w-2 h-2 rounded-full bg-rose-500", title: "critical" }), h("span", { className: "w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center " + (GRADE[o.grade] || "bg-slate-600 text-white") }, o.grade))) : h("div", { className: "px-2 py-6 text-xs text-slate-500" }, loading ? "Loading…" : "No operations.")) : h("div", { className: "px-2 py-6 text-xs text-slate-500" }, "Pick a category.")),
        det
          ? h(
              "div",
              { className: "flex flex-col gap-3 min-w-0" },
              h("div", { className: "flex flex-wrap items-center gap-2" }, h("span", { className: "text-[11px] text-slate-500 tabular-nums" }, det.id), h("h2", { className: "text-base font-black text-white" }, det.operation), det.critical === "yes" && h("span", { className: "rounded-full border border-rose-500/40 bg-rose-500/20 text-rose-300 text-[11px] px-2" }, "critical"), h("span", { className: "w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center " + (GRADE[det.grade] || "bg-slate-600 text-white") }, det.grade), h("span", { className: "ml-auto text-xs text-slate-400" }, "SMV ", h("b", { className: "text-white tabular-nums" }, num(det.smv)), " min · stations " + (det.stations || "—"))),
              h("div", { className: "flex gap-3 items-start" }, h(Seam, { k: det.seam_image_key, code: det.code, size: 112, className: "rounded flex-shrink-0" }), h("div", { className: "flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1 text-xs" }, [["Machine", det.machine + (det.code ? " (" + det.code + ")" : "")], ["Presser foot", det.presser_foot], ["Attachment", det.attachment], ["Category", det.category]].map(([k, v]) => h("div", { key: k, className: "border-b border-slate-800 py-0.5" }, h("div", { className: "text-slate-500" }, k), h("div", { className: "text-slate-200 font-bold truncate", title: v || "" }, v || "—"))))),
              Block(
                "Standard video",
                video
                  ? h("div", { className: "grid gap-3 md:grid-cols-[14rem_minmax(0,1fr)]" }, h("div", { className: "relative aspect-video rounded-lg bg-black border border-slate-800 flex items-center justify-center text-slate-500" }, h(Play, { size: 30 }), h("span", { className: "absolute bottom-1 right-1 text-[10px] text-slate-300 bg-black/60 rounded px-1 tabular-nums" }, video.duration_text || video.duration), h("span", { className: "absolute top-1 left-1 text-[10px] text-slate-300 bg-black/60 rounded px-1" }, video.id)), h("div", { className: "text-xs text-slate-300 space-y-1 min-w-0" }, h("div", { className: "text-slate-400" }, video.poster_caption), h("div", null, (video.date || "") + " · " + (video.status || "") + " · " + (video.engineer || "")), h("div", { className: "flex flex-wrap gap-x-3 text-slate-400" }, h("span", null, "cycles ", h("b", { className: "text-white" }, video.cycles)), h("span", null, "observed ", h("b", { className: "text-white" }, num(video.observed_time_s, 2)), " s"), h("span", null, "rating ", h("b", { className: "text-white" }, video.rating_pct), "%"), h("span", null, "basic ", h("b", { className: "text-white" }, num(video.basic_time_s, 2)), " s"), h("span", null, "allowance ", h("b", { className: "text-white" }, video.allowance_pct), "%"), h("span", null, "SMV ", h("b", { className: "text-white" }, num(video.smv)), " min"), video.motion_waste_pct !== undefined && h("span", null, "motion waste ", h("b", { className: "text-white" }, video.motion_waste_pct), "%")), video.method && h("p", { className: "text-slate-300 leading-snug" }, h("span", { className: "text-slate-500" }, "method · "), video.method)))
                  : h("div", { className: "text-xs text-slate-500" }, "No standard video yet.")
              ),
              Block(
                "Who has done it" + (det.best ? "" : ""),
                h("div", null, det.best && h("div", { className: "mb-2 flex items-center gap-2 text-xs text-emerald-200" }, h(Trophy, { size: 14 }), "best efficiency ", h("b", null, det.best.name), " · " + det.best.line + " · grade " + det.best.grade + " · ", h("b", null, det.best.efficiency + "%")), (det.operators || []).length ? Table([["name", "Operator"], ["line", "Line"], ["station", "Station"], ["grade", "Grade"], ["efficiency", "Efficiency %"], ["pieces_30d", "Pieces 30d"], ["days_30d", "Days 30d"], ["last_run", "Last run"]], det.operators, "code") : h("div", { className: "text-xs text-slate-500" }, "Nobody recorded on this operation yet."))
              ),
              Block("Quality defect history", (det.defects || []).length ? Table([["date", "Date"], ["defect", "Defect"], ["qty", "Qty"], ["count_30d", "30 days"], ["line", "Line"], ["found_at", "Found at"]], det.defects) : h("div", { className: "text-xs text-slate-500" }, "No defects recorded on this operation.")),
              (det.improvements || []).length > 0 && Block("Method improvements", Table([["date", "Date"], ["change", "Change"], ["smv_before", "SMV before"], ["smv_after", "SMV after"], ["by", "By"]], det.improvements))
            )
          : h("div", { className: "rounded-2xl border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-500 min-h-[12rem] p-4 text-center" }, sel.category ? "Pick an operation to see its standard video, who has done it and the defect history." : "Garment type → category → operation.")
      )
    ),
    h("p", { className: "mt-3 text-xs text-slate-500" }, "Simulated factory data — operator codes only, no real person.")
  );
};

export default IeMaster;
