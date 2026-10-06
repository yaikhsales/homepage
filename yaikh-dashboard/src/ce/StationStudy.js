// CE · AVMA module screen — "Station Time Study — SMV / SAM". AI Motion, AI Standing and AI Feeling all use
// this layout: a one-line header with the study controls, a dark LEFT panel (camera / upload controls and
// the video stage) and a dark RIGHT panel of stacked blocks — quality & compliance checks, the module's own
// two analysis blocks (motion breakdown + two-handed chart for Motion; posture for Standing; attention for
// Feeling), the station & SMV study with its tiles, and the recent studies. Data: the simulated factory on
// the M1, {"module":"ce","view":"avma","module_type":<motion|standing|feeling>}. Nothing here is a camera —
// the stage plays a recorded study from the video library. Written with React.createElement like MrpView.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Camera, Upload, Play, Repeat, Video, Monitor, Columns, GraduationCap, Scale, ChevronDown } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

const TITLES = { motion: "AI Motion", standing: "AI Standing", feeling: "AI Feeling" };
const CHECKS = ["Machine setup", "Measurement in spec ±0.5mm", "Labeling", "Scissors tied", "Handling method", "Thread waste", "Defect control", "Safe organized 5S"];
const num = (v, d = 2) => (v === undefined || v === null || v === "" ? "—" : typeof v === "number" ? v.toFixed(d).replace(/\.00$/, "") : String(v));
const pct = (v) => Number(String(v === undefined ? "" : v).replace("%", "")) || 0;

const Panel = (title, children, extra) => h("section", { className: "rounded-xl border border-slate-700 bg-slate-950/60 p-3" }, h("div", { className: "flex items-center justify-between mb-2" }, h("div", { className: "text-[11px] uppercase tracking-wider text-slate-400 font-bold" }, title), extra || null), children);
const Chip = (label, Icon, on) => h("span", { className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] " + (on ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200" : "border-slate-700 bg-slate-900 text-slate-300") }, Icon ? h(Icon, { size: 12 }) : null, label);
const Btn = (label, Icon) => h("button", { type: "button", className: "inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-700" }, Icon ? h(Icon, { size: 12 }) : null, label);
const Tile = (label, value, unit) => h("div", { className: "rounded-lg border border-slate-700 bg-slate-900 p-2" }, h("div", { className: "text-[10px] uppercase tracking-wider text-slate-500" }, label), h("div", { className: "font-black text-white tabular-nums text-base leading-tight" }, value, unit ? h("span", { className: "text-xs text-slate-400 font-normal" }, " " + unit) : null));
const Bar = (label, seconds, share, colour) =>
  h("div", { className: "text-xs" }, h("div", { className: "flex justify-between text-slate-300" }, h("span", null, label), h("span", { className: "tabular-nums text-slate-400" }, num(seconds, 1) + " s · " + num(share, 0) + "%")), h("div", { className: "h-2.5 rounded bg-slate-800 mt-1 overflow-hidden" }, h("div", { className: "h-full rounded " + colour, style: { width: Math.min(100, pct(share)) + "%" } })));

// Block 1 — quality & compliance checks in two columns with a status pill each.
const Quality = (checks) => {
  const list = checks && checks.length ? checks : CHECKS.map((name) => ({ name, status: "" }));
  return Panel("Quality, compliance", h("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1.5" }, list.map((c, i) => h("div", { key: i, className: "flex items-center justify-between gap-2 text-xs text-slate-300" }, h("span", { className: "truncate" }, c.name || c.check), h("span", { className: "rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap " + (/fail|no|red/i.test(c.status) ? "bg-rose-500/20 text-rose-300" : /warn|amber|check/i.test(c.status) ? "bg-amber-500/20 text-amber-300" : c.status ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400") }, c.status || "—")))));
};

// Motion — hanger (UPS) motion breakdown + the two-handed process chart.
const Motion = (d) => {
  const mb = d.motion_breakdown || {};
  const bars = Array.isArray(mb) ? mb : [{ label: "Hanger pick & return", seconds: mb.hanger_seconds, share: mb.hanger_share }, { label: "Sewing machine process", seconds: mb.sewing_seconds, share: mb.sewing_share }];
  const th = d.two_hand || {};
  const hands = Array.isArray(th) ? th : [{ hand: "L/H", idle: th.left_idle, moving: th.left_moving, symbols: th.left_symbols }, { hand: "R/H", idle: th.right_idle, moving: th.right_moving, symbols: th.right_symbols }];
  const SYM = ["O", "→", "D", "▽"];
  return [
    Panel("Hanger (UPS) motion breakdown", h("div", { className: "space-y-2" }, bars.map((b, i) => h(React.Fragment, { key: i }, Bar(b.label || b.name, b.seconds, b.share, i === 0 ? "bg-sky-400" : "bg-emerald-400"))))),
    Panel("Two-handed process chart", h("table", { className: "w-full text-xs" }, h("thead", null, h("tr", { className: "text-slate-500" }, h("th", { className: "text-left font-normal pb-1" }, "hand"), h("th", { className: "text-right font-normal pb-1" }, "idle"), h("th", { className: "text-right font-normal pb-1" }, "moving"), SYM.map((s) => h("th", { key: s, className: "text-center font-normal pb-1 w-8" }, s)))), h("tbody", null, hands.map((r, i) => h("tr", { key: i, className: "border-t border-slate-800" }, h("td", { className: "py-1 font-bold text-white" }, r.hand), h("td", { className: "py-1 text-right tabular-nums text-slate-300" }, num(r.idle, 0) + (r.idle !== undefined ? "%" : "")), h("td", { className: "py-1 text-right tabular-nums text-slate-300" }, num(r.moving, 0) + (r.moving !== undefined ? "%" : "")), SYM.map((s, k) => h("td", { key: s, className: "py-1 text-center tabular-nums text-slate-400" }, r.symbols ? num(Array.isArray(r.symbols) ? r.symbols[k] : r.symbols[s], 0) : "—"))))))),
  ];
};

// Standing — sitting vs standing, posture score, ergonomic risk.
const Standing = (d) => {
  const p = d.posture || {};
  return [
    Panel("Sitting vs standing", h("div", { className: "space-y-2" }, Bar("Sitting", p.sitting_seconds, p.sitting_share, "bg-sky-400"), Bar("Standing", p.standing_seconds, p.standing_share, "bg-emerald-400"), Bar("Bending / reaching", p.bending_seconds, p.bending_share, "bg-amber-400"))),
    Panel("Posture & ergonomics", h("div", { className: "grid grid-cols-3 gap-2" }, Tile("Posture score", num(p.posture_score, 0), "/100"), Tile("Ergonomic risk", p.ergonomic_risk || "—"), Tile("Posture changes", num(p.posture_changes, 0), "/h")), p.note && h("p", { className: "mt-2 text-xs text-slate-400" }, p.note)),
  ];
};

// Feeling — attention and fatigue by hour, aggregated for the station (no faces, no names).
const Feeling = (d) => {
  const a = d.attention || {};
  const hours = Array.isArray(a) ? a : a.by_hour || [];
  const max = Math.max(1, ...hours.map((x) => pct(x.attention)));
  return [
    Panel("Attention by hour", hours.length ? h("div", { className: "flex items-end gap-1 h-24" }, hours.map((x, i) => h("div", { key: i, className: "flex-1 flex flex-col items-center gap-1", title: x.hour + " · attention " + x.attention + "% · fatigue " + x.fatigue + "%" }, h("div", { className: "w-full rounded-t " + (pct(x.attention) < 60 ? "bg-rose-400" : pct(x.attention) < 75 ? "bg-amber-400" : "bg-emerald-400"), style: { height: Math.round((pct(x.attention) / max) * 80) + "px" } }), h("div", { className: "text-[9px] text-slate-500 tabular-nums" }, x.hour)))) : h("div", { className: "text-xs text-slate-500" }, "No hourly data yet.")),
    Panel("Attention & fatigue", h("div", { className: "grid grid-cols-3 gap-2" }, Tile("Attention", num(a.attention_avg, 0), "%"), Tile("Fatigue", num(a.fatigue_avg, 0), "%"), Tile("Alerts", num(a.alerts, 0))), h("p", { className: "mt-2 text-[11px] text-slate-500" }, "Aggregated for the station — no faces, no names.")),
  ];
};

const StationStudy = ({ type, onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("library");
  const [studyIx, setStudyIx] = useState(0);
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ce", view: "avma", module_type: type }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
      setData(j);
    } catch (e) {
      setError("AVMA data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [type]);
  useEffect(() => {
    load();
  }, [load]);

  const d = data || {};
  const studies = d.studies || d.rows || [];
  const s = studies[studyIx] || studies[0] || {};
  const library = d.video_library || [];
  const blocks = type === "standing" ? Standing(d) : type === "feeling" ? Feeling(d) : Motion(d);

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 436px; }"),
    h(NavCover),
    // header: one line
    h(
      "div",
      { className: "flex flex-wrap items-center gap-2 mb-3" },
      h("button", { onClick: back, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: "text-base md:text-lg font-black text-white leading-none" }, "Station Time Study — SMV / SAM"),
      h("span", { className: "rounded-full border border-slate-600 bg-slate-800 text-[11px] px-2 py-0.5 text-slate-300" }, TITLES[type] || type),
      h("div", { className: "ml-auto flex flex-wrap items-center gap-1.5" }, Btn((d.element_model || "Element model") + "", ChevronDown), Btn("Pop out to screen 2", Monitor), Btn("In-page split", Columns), Btn("Teach mode →", GraduationCap), h("button", { type: "button", onClick: () => navigate("/dashboard/ce/line-balancing"), className: "inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-700" }, h(Scale, { size: 12 }), "Line balance →"), h("button", { onClick: load, className: "p-1.5 rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white", "aria-label": "Refresh", title: "Refresh" }, h(RefreshCw, { size: 13, className: loading ? "animate-spin" : "" })))
    ),
    error && h("div", { className: "mb-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm px-3 py-2" }, error),
    h(
      "div",
      { className: "grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" },
      // LEFT panel
      h(
        "div",
        { className: "rounded-2xl border border-slate-700 bg-slate-950/70 p-3 flex flex-col gap-2 min-w-0" },
        h("div", { className: "flex flex-wrap items-center gap-1.5" }, h("div", { className: "inline-flex rounded-md border border-slate-700 overflow-hidden text-[11px]" }, h("button", { type: "button", onClick: () => setSource("camera"), className: "px-2 py-1 " + (source === "camera" ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400") }, h(Camera, { size: 12, className: "inline mr-1" }), "Live camera"), h("button", { type: "button", onClick: () => setSource("library"), className: "px-2 py-1 " + (source === "library" ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400") }, h(Upload, { size: 12, className: "inline mr-1" }), "Upload video")), Btn((d.camera || "Camera") + "", ChevronDown), Chip("Back cam"), Chip("Hand tracking", null, true), Chip("YAI AI", null, true), Chip("Mirror L/R"), Chip("Custom zones")),
        h("div", { className: "flex flex-wrap items-center gap-1.5" }, h("div", { className: "inline-flex rounded-md border border-slate-700 overflow-hidden text-[11px]" }, h("span", { className: "px-2 py-1 bg-slate-700 text-white" }, "Hanger (UPS) station"), h("span", { className: "px-2 py-1 bg-slate-900 text-slate-400" }, "Table (3 steps) line")), Chip("Auto IE engine", null, true), Btn("Choose file", Upload), h("button", { type: "button", className: "inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-200" }, h(Video, { size: 12 }), "Video library", h("span", { className: "rounded-full bg-sky-500/30 text-sky-200 px-1.5 text-[10px] font-bold tabular-nums" }, library.length)), Btn("Repeat", Repeat), h("button", { type: "button", className: "inline-flex items-center gap-1 rounded-md bg-emerald-500 text-slate-900 font-bold px-2.5 py-1 text-[11px]" }, h(Play, { size: 12 }), "Start capture")),
        // the stage: a recorded study from the library (placeholder frame)
        h(
          "div",
          { className: "relative aspect-video rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center" },
          s.video_poster || s.poster ? h("img", { src: s.video_poster || s.poster, alt: "", className: "absolute inset-0 w-full h-full object-cover opacity-80" }) : null,
          h("div", { className: "absolute inset-4 border border-dashed border-sky-400/40 rounded" }),
          h("div", { className: "absolute left-[22%] top-[38%] w-16 h-12 border-2 border-emerald-400/70 rounded text-[9px] text-emerald-300 px-1" }, "L/H"),
          h("div", { className: "absolute left-[58%] top-[42%] w-16 h-12 border-2 border-sky-400/70 rounded text-[9px] text-sky-300 px-1" }, "R/H"),
          h("div", { className: "relative z-10 text-center text-slate-400 text-xs" }, h(Play, { size: 36, className: "mx-auto text-slate-500 mb-1" }), s.operation ? "Recorded study · " + s.operation + (s.station ? " · " + s.station : "") : loading ? "Loading…" : "Pick a study from the video library"),
          h("div", { className: "absolute top-2 left-2 rounded bg-black/60 text-[10px] text-slate-300 px-1.5 py-0.5 tabular-nums" }, (s.duration ? s.duration : "00:00") + (s.fps ? " · " + s.fps + " fps" : ""))
        ),
        h("div", { className: "flex items-center justify-between text-[11px] text-slate-400" }, h("span", null, "Zones " + num(d.zones !== undefined ? d.zones : s.zones, 0) + " · hands detected " + num(d.hands_detected !== undefined ? d.hands_detected : s.hands_detected, 0)), h("span", { className: "text-slate-500" }, "simulated — no real camera, no real person")),
        library.length > 0 &&
          h(
            "div",
            { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-2" },
            h("div", { className: "text-[10px] uppercase tracking-wider text-slate-500 mb-1" }, "Video library"),
            h("div", { className: "flex gap-2 overflow-x-auto pb-1" }, library.map((v, i) => h("button", { key: i, type: "button", onClick: () => { const ix = studies.findIndex((x) => x.video_id === v.id || x.id === v.id); if (ix >= 0) setStudyIx(ix); }, className: "flex-shrink-0 w-32 rounded-lg border border-slate-700 bg-slate-950 p-1.5 text-left hover:border-slate-500" }, h("div", { className: "h-14 rounded bg-slate-800 flex items-center justify-center text-slate-600" }, h(Video, { size: 16 })), h("div", { className: "text-[11px] text-white truncate mt-1" }, v.title || v.operation || v.id), h("div", { className: "text-[10px] text-slate-500 tabular-nums" }, (v.duration || "") + (v.date ? " · " + v.date : "")))))
          )
      ),
      // RIGHT panel: stacked blocks
      h(
        "div",
        { className: "flex flex-col gap-3 min-w-0" },
        Quality(d.quality_checks),
        blocks,
        Panel(
          "Station & SMV study",
          h(
            "div",
            null,
            h("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2" }, [["Operation", s.operation], ["Part", s.part], ["Machine", s.machine], ["Station", s.station], ["Rating %", num(s.rating, 0)], ["Allowance %", num(s.allowance, 0)]].map(([k, v]) => h("div", { key: k, className: "flex justify-between gap-2 border-b border-slate-800 py-0.5" }, h("span", { className: "text-slate-500" }, k), h("span", { className: "text-slate-200 font-bold truncate" }, v || "—")))),
            h("div", { className: "grid grid-cols-3 gap-2" }, Tile("SMV / SAM", num(s.smv), "min"), Tile("Pieces / hour", num(s.pieces_per_hour, 0)), Tile("Cycles", num(s.cycles, 0)), Tile("Avg cycle", num(s.avg_cycle, 1), "s"), Tile("Min / max", s.min_cycle !== undefined ? num(s.min_cycle, 1) + " / " + num(s.max_cycle, 1) : "—", "s"), Tile("Consistency CV", num(s.cv, 1), "%"), Tile("Observed time", num(s.observed_time, 1), "s"), Tile("Basic time", num(s.basic_time, 1), "s"), Tile("Study", s.id || s.study_id || "—")),
            h("button", { type: "button", className: "mt-2 w-full rounded-md bg-sky-500 text-slate-900 font-bold text-xs py-1.5" }, "Review & save study")
          )
        ),
        Panel(
          "Recent studies",
          studies.length
            ? h("div", { className: "space-y-1" }, studies.slice(0, 8).map((r, i) => h("button", { key: i, type: "button", onClick: () => setStudyIx(i), className: "w-full text-left flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-xs " + (i === studyIx ? "bg-sky-500/15 border border-sky-500/40" : "border border-transparent hover:bg-slate-800") }, h("span", { className: "truncate" }, h("b", { className: "text-white" }, r.operation || r.id), h("span", { className: "text-slate-500" }, r.station ? " · " + r.station : "", r.date ? " · " + r.date : "")), h("span", { className: "tabular-nums text-slate-300 whitespace-nowrap" }, num(r.smv) + " min"))))
            : h("div", { className: "text-xs text-slate-500" }, loading ? "Loading…" : "No studies yet.")
        )
      )
    )
  );
};

export default StationStudy;
