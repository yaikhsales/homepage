// CE · AVMA module screen — "Station Time Study — SMV / SAM". AI Motion, AI Standing and AI Feeling all use
// this layout: a one-line header with the study controls, a dark LEFT panel (camera / upload controls and
// the video stage) and a dark RIGHT panel of stacked blocks — quality & compliance checks, the module's own
// two analysis blocks (motion breakdown + two-handed chart for Motion; posture for Standing; attention for
// Feeling), the station & SMV study with its tiles, and the recent studies. Data: the simulated factory on
// the M1, {"module":"ce","view":"avma","module_type":<motion|standing|feeling>, pick}. Nothing here is a
// camera — the stage plays a recorded study from the video library (posters are null, so a placeholder
// frame). Written with React.createElement like MrpView.
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Camera, Upload, Play, Repeat, Video, Monitor, Columns, GraduationCap, Scale, ChevronDown } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const h = React.createElement;
const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");

const TITLES = { motion: "AI Motion", standing: "AI Standing", feeling: "AI Feeling" };
const num = (v, d = 2) => (v === undefined || v === null || v === "" ? "—" : typeof v === "number" ? String(Number(v.toFixed(d))) : String(v));
const mmss = (s) => (s === undefined || s === null ? "00:00" : Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0"));

const Panel = (title, children, extra) => h("section", { className: "rounded-xl border border-slate-700 bg-slate-950/60 p-3" }, h("div", { className: "flex items-center justify-between mb-2" }, h("div", { className: "text-[11px] uppercase tracking-wider text-slate-400 font-bold" }, title), extra || null), children);
const Chip = (label, Icon, on) => h("span", { className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] " + (on ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200" : "border-slate-700 bg-slate-900 text-slate-300") }, Icon ? h(Icon, { size: 12 }) : null, label);
const Btn = (label, Icon, onClick) => h("button", { type: "button", onClick, className: "inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-700" }, Icon ? h(Icon, { size: 12 }) : null, label);
const Tile = (label, value, unit) => h("div", { className: "rounded-lg border border-slate-700 bg-slate-900 p-2" }, h("div", { className: "text-[10px] uppercase tracking-wider text-slate-500" }, label), h("div", { className: "font-black text-white tabular-nums text-base leading-tight" }, value, unit ? h("span", { className: "text-xs text-slate-400 font-normal" }, " " + unit) : null));
const Bar = (label, right, share, colour) => h("div", { className: "text-xs" }, h("div", { className: "flex justify-between text-slate-300" }, h("span", null, label), h("span", { className: "tabular-nums text-slate-400" }, right)), h("div", { className: "h-2.5 rounded bg-slate-800 mt-1 overflow-hidden" }, h("div", { className: "h-full rounded " + colour, style: { width: Math.min(100, Number(share) || 0) + "%" } })));

// Block 1 — quality & compliance: the eight checks of the study in two columns, a status pill each.
const Quality = (checks) =>
  Panel(
    "Quality, compliance",
    checks && checks.length
      ? h("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1.5" }, checks.map((c, i) => h("div", { key: i, className: "flex items-center justify-between gap-2 text-xs text-slate-300", title: c.status_text || "" }, h("span", { className: "truncate" }, c.label), h("span", { className: "rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap " + (c.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300") }, c.ok ? "OK" : "check"))))
      : h("div", { className: "text-xs text-slate-500" }, "No checks on this study.")
  );

// Motion — hanger / table motion breakdown + the two-handed process chart.
const Motion = (s) => {
  const mb = s.motion_breakdown || [];
  const th = s.two_hand || {};
  const hands = [["L/H", th.left || {}], ["R/H", th.right || {}]];
  const els = th.elements || [];
  return [
    Panel((/hanger/i.test(s.setup || "") ? "Hanger (UPS)" : "Table") + " motion breakdown", mb.length ? h("div", { className: "space-y-2" }, mb.map((b, i) => h(React.Fragment, { key: i }, Bar(b.step, num(b.s, 1) + " s · " + num(b.pct, 0) + "%", b.pct, i === 0 ? "bg-sky-400" : "bg-emerald-400")))) : h("div", { className: "text-xs text-slate-500" }, "No breakdown on this study."), s.motion_waste_pct !== undefined && h("span", { className: "text-[11px] text-slate-400" }, "motion waste " + s.motion_waste_pct + "%")),
    Panel(
      "Two-handed process chart",
      h(
        "div",
        null,
        h("table", { className: "w-full text-xs mb-2" }, h("thead", null, h("tr", { className: "text-slate-500" }, h("th", { className: "text-left font-normal pb-1" }, "hand"), h("th", { className: "text-right font-normal pb-1" }, "idle"), h("th", { className: "text-right font-normal pb-1" }, "moving"))), h("tbody", null, hands.map(([hand, r]) => h("tr", { key: hand, className: "border-t border-slate-800" }, h("td", { className: "py-1 font-bold text-white" }, hand), h("td", { className: "py-1 text-right tabular-nums text-slate-300" }, num(r.idle_s, 1) + " s · " + num(r.idle_pct, 0) + "%"), h("td", { className: "py-1 text-right tabular-nums text-slate-300" }, num(r.moving_s, 1) + " s · " + num(r.moving_pct, 0) + "%"))))),
        els.length > 0 &&
          h(
            "div",
            { className: "max-h-40 overflow-auto rounded-lg border border-slate-800" },
            h("table", { className: "w-full text-[11px]" }, h("thead", { className: "sticky top-0 bg-slate-950" }, h("tr", { className: "text-slate-500" }, h("th", { className: "text-left font-normal px-1.5 py-1 w-5" }, "#"), h("th", { className: "text-left font-normal px-1.5 py-1" }, "left hand"), h("th", { className: "text-center font-normal px-1 py-1 w-6" }, ""), h("th", { className: "text-left font-normal px-1.5 py-1" }, "right hand"), h("th", { className: "text-center font-normal px-1 py-1 w-6" }, ""), h("th", { className: "text-right font-normal px-1.5 py-1" }, "s"))), h("tbody", null, els.map((e, i) => h("tr", { key: i, className: "border-t border-slate-800/70" }, h("td", { className: "px-1.5 py-0.5 text-slate-500 tabular-nums" }, e.no), h("td", { className: "px-1.5 py-0.5 text-slate-300" }, e.left), h("td", { className: "px-1 py-0.5 text-center text-sky-300 font-bold" }, e.left_symbol), h("td", { className: "px-1.5 py-0.5 text-slate-300" }, e.right), h("td", { className: "px-1 py-0.5 text-center text-emerald-300 font-bold" }, e.right_symbol), h("td", { className: "px-1.5 py-0.5 text-right tabular-nums text-slate-400" }, num(e.seconds, 2))))))
          ),
        h("div", { className: "mt-1 text-[10px] text-slate-500" }, "O operation · → transport · D delay · ▽ hold")
      )
    ),
  ];
};

// Standing — sitting vs standing, posture score, ergonomic risk.
const Standing = (s) => {
  const p = s.posture || {};
  return [
    Panel("Sitting vs standing", h("div", { className: "space-y-2" }, Bar("Sitting", num(p.sitting_min, 0) + " min · " + num(p.sitting_pct, 0) + "%", p.sitting_pct, "bg-sky-400"), Bar("Standing", num(p.standing_min, 0) + " min · " + num(p.standing_pct, 0) + "%", p.standing_pct, "bg-emerald-400")), h("div", { className: "text-[11px] text-slate-400" }, "observed " + num(p.observed_min, 0) + " min")),
    Panel("Posture & ergonomics", h("div", null, h("div", { className: "grid grid-cols-3 gap-2" }, Tile("Posture score", num(p.score, 0), "/100"), Tile("Ergonomic risk", p.risk || "—"), Tile("Bends / reaches", num(p.bends_per_hour, 0) + " / " + num(p.reaches_per_hour, 0), "per h")), p.issue && h("p", { className: "mt-2 text-xs text-slate-300" }, p.issue, p.recommendation ? h("span", { className: "text-slate-500" }, " — " + p.recommendation) : null))),
  ];
};

// Feeling — attention and fatigue by hour band, aggregated for the line (no faces, no names).
const Feeling = (s) => {
  const a = s.attention || {};
  const bands = a.by_hour || [];
  return [
    Panel(
      "Attention by hour band",
      bands.length
        ? h("div", { className: "space-y-1.5" }, bands.map((b, i) => h("div", { key: i, className: "grid items-center gap-2 text-xs", style: { gridTemplateColumns: "6rem 1fr 3rem 3rem" } }, h("span", { className: "text-slate-400 tabular-nums" }, b.band), h("div", { className: "h-2.5 rounded bg-slate-800 overflow-hidden" }, h("div", { className: "h-full rounded " + (b.attention_pct < 70 ? "bg-rose-400" : b.attention_pct < 78 ? "bg-amber-400" : "bg-emerald-400"), style: { width: b.attention_pct + "%" } })), h("span", { className: "text-right tabular-nums text-white font-bold" }, b.attention_pct + "%"), h("span", { className: "text-right tabular-nums text-slate-500", title: "fatigue index" }, "f " + b.fatigue_index))), h("div", { className: "text-[10px] text-slate-500" }, "attention % · f = fatigue index" + (a.lowest_band ? " · lowest band " + a.lowest_band : "")))
        : h("div", { className: "text-xs text-slate-500" }, "No hourly data on this line."),
    ),
    Panel("Attention, fatigue & mood", h("div", null, h("div", { className: "grid grid-cols-3 gap-2" }, Tile("Attention", num(a.attention_pct, 0), "%"), Tile("Fatigue index", num(a.fatigue_index, 0)), Tile("Distractions", num(a.distraction_events, 0))), a.mood && h("div", { className: "mt-2 flex h-2.5 rounded overflow-hidden", title: "mood: positive / neutral / tense" }, h("div", { className: "bg-emerald-400", style: { width: a.mood.positive_pct + "%" } }), h("div", { className: "bg-slate-500", style: { width: a.mood.neutral_pct + "%" } }), h("div", { className: "bg-rose-400", style: { width: a.mood.tense_pct + "%" } })), a.mood && h("div", { className: "mt-1 text-[10px] text-slate-500" }, "mood · positive " + a.mood.positive_pct + "% · neutral " + a.mood.neutral_pct + "% · tense " + a.mood.tense_pct + "%"), (a.alerts || []).length > 0 && h("div", { className: "mt-2 text-xs text-amber-300" }, a.alerts.length + " attention alert" + (a.alerts.length > 1 ? "s" : "") + " — supervisor check-in at " + a.alerts.map((x) => "station " + x.station + " (" + x.band + ")").join(", ")), h("p", { className: "mt-2 text-[11px] text-slate-500" }, s.note || "Aggregated per line and hour band — no faces, no names."))),
  ];
};

const StationStudy = ({ type, onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("library");
  const [pick, setPick] = useState("");
  const [studyId, setStudyId] = useState("");
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(API + "/sim/view", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ce", view: "avma", module_type: type, pick: pick || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || j.detail || "unavailable");
      setData(j);
    } catch (e) {
      setError("AVMA data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [type, pick]);
  useEffect(() => {
    load();
  }, [load]);

  const d = data || {};
  const studies = d.studies || [];
  const s = studies.find((x) => x.id === studyId) || studies[0] || {};
  const library = d.video_library || [];
  const picker = d.picker;
  const blocks = type === "standing" ? Standing(s) : type === "feeling" ? Feeling(s) : Motion(s);
  const isFeeling = type === "feeling";

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 436px; }"),
    h(NavCover),
    h(
      "div",
      { className: "flex flex-wrap items-center gap-2 mb-3" },
      h("button", { onClick: back, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: "text-base md:text-lg font-black text-white leading-none" }, "Station Time Study — SMV / SAM"),
      h("span", { className: "rounded-full border border-slate-600 bg-slate-800 text-[11px] px-2 py-0.5 text-slate-300" }, TITLES[type] || type),
      picker && h("select", { value: pick || picker.selected || "", onChange: (e) => { setPick(e.target.value); setStudyId(""); }, className: "rounded-md border border-slate-700 bg-slate-800 text-[11px] text-slate-200 px-2 py-1 max-w-[12rem]", "aria-label": picker.label }, h("option", { value: "" }, picker.label), picker.options.map((o) => h("option", { key: o.id, value: o.id }, o.name))),
      h("div", { className: "ml-auto flex flex-wrap items-center gap-1.5" }, Btn("Element model", ChevronDown), Btn("Pop out to screen 2", Monitor), Btn("In-page split", Columns), Btn("Teach mode →", GraduationCap), Btn("Line balance →", Scale, () => navigate("/dashboard/ce/line-balancing")), h("button", { onClick: load, className: "p-1.5 rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white", "aria-label": "Refresh", title: "Refresh" }, h(RefreshCw, { size: 13, className: loading ? "animate-spin" : "" })))
    ),
    error && h("div", { className: "mb-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm px-3 py-2" }, error),
    h(
      "div",
      { className: "grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" },
      // LEFT panel
      h(
        "div",
        { className: "rounded-2xl border border-slate-700 bg-slate-950/70 p-3 flex flex-col gap-2 min-w-0" },
        h("div", { className: "flex flex-wrap items-center gap-1.5" }, h("div", { className: "inline-flex rounded-md border border-slate-700 overflow-hidden text-[11px]" }, h("button", { type: "button", onClick: () => setSource("camera"), className: "px-2 py-1 " + (source === "camera" ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400") }, h(Camera, { size: 12, className: "inline mr-1" }), "Live camera"), h("button", { type: "button", onClick: () => setSource("library"), className: "px-2 py-1 " + (source === "library" ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400") }, h(Upload, { size: 12, className: "inline mr-1" }), "Upload video")), Btn("Camera", ChevronDown), Chip("Back cam"), Chip("Hand tracking", null, !isFeeling), Chip("YAI AI", null, true), Chip("Mirror L/R"), Chip("Custom zones")),
        h("div", { className: "flex flex-wrap items-center gap-1.5" }, h("div", { className: "inline-flex rounded-md border border-slate-700 overflow-hidden text-[11px]" }, h("span", { className: "px-2 py-1 " + (/hanger/i.test(s.setup || "") ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400") }, "Hanger (UPS) station"), h("span", { className: "px-2 py-1 " + (/table/i.test(s.setup || "") ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400") }, "Table (3 steps) line")), Chip("Auto IE engine", null, true), Btn("Choose file", Upload), h("button", { type: "button", className: "inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-200" }, h(Video, { size: 12 }), "Video library", h("span", { className: "rounded-full bg-sky-500/30 text-sky-200 px-1.5 text-[10px] font-bold tabular-nums" }, library.length)), Btn("Repeat", Repeat), h("button", { type: "button", className: "inline-flex items-center gap-1 rounded-md bg-emerald-500 text-slate-900 font-bold px-2.5 py-1 text-[11px]" }, h(Play, { size: 12 }), "Start capture")),
        // the stage: a recorded study (placeholder frame — posters are not stored)
        h(
          "div",
          { className: "relative aspect-video rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center" },
          h("div", { className: "absolute inset-4 border border-dashed border-sky-400/40 rounded" }),
          !isFeeling && h("div", { className: "absolute left-[22%] top-[38%] w-16 h-12 border-2 border-emerald-400/70 rounded text-[9px] text-emerald-300 px-1" }, "L/H"),
          !isFeeling && h("div", { className: "absolute left-[58%] top-[42%] w-16 h-12 border-2 border-sky-400/70 rounded text-[9px] text-sky-300 px-1" }, "R/H"),
          h("div", { className: "relative z-10 text-center text-slate-400 text-xs px-4" }, h(Play, { size: 36, className: "mx-auto text-slate-500 mb-1" }), s.id ? "Recorded study " + s.id + " · " + (s.operation || "") + (s.line ? " · " + s.line + (s.station ? " station " + s.station : "") : "") : loading ? "Loading…" : "Pick a study from the video library"),
          h("div", { className: "absolute top-2 left-2 rounded bg-black/60 text-[10px] text-slate-300 px-1.5 py-0.5 tabular-nums" }, mmss(s.duration_s) + (s.date ? " · " + s.date : "")),
          s.finding && h("div", { className: "absolute bottom-2 left-2 right-2 rounded bg-black/60 text-[10px] text-emerald-200 px-1.5 py-0.5 truncate" }, s.finding)
        ),
        h("div", { className: "flex items-center justify-between text-[11px] text-slate-400" }, h("span", null, isFeeling ? "people in frame " + num(s.people, 0) : "zones " + (s.two_hand ? 2 : "—") + " · hands detected " + (s.two_hand ? 2 : "—")), h("span", { className: "text-slate-500" }, "simulated — no real camera, no real person")),
        library.length > 0 &&
          h(
            "div",
            { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-2" },
            h("div", { className: "text-[10px] uppercase tracking-wider text-slate-500 mb-1" }, "Video library"),
            h("div", { className: "flex gap-2 overflow-x-auto pb-1" }, library.map((v, i) => { const st = studies.find((x) => x.video_id === v.id); return h("button", { key: i, type: "button", onClick: () => st && setStudyId(st.id), className: "flex-shrink-0 w-32 rounded-lg border p-1.5 text-left hover:border-slate-500 " + (st && st.id === s.id ? "border-sky-500/60 bg-sky-500/10" : "border-slate-700 bg-slate-950") }, h("div", { className: "h-14 rounded bg-slate-800 flex items-center justify-center text-slate-600 relative" }, h(Video, { size: 16 }), h("span", { className: "absolute bottom-1 right-1 text-[9px] text-slate-400 tabular-nums" }, mmss(v.duration_s))), h("div", { className: "text-[11px] text-white truncate mt-1" }, v.operation), h("div", { className: "text-[10px] text-slate-500 truncate" }, v.garment_type + " · " + v.line + (v.studied ? " · studied" : " · not studied"))); }))
          )
      ),
      // RIGHT panel: stacked blocks
      h(
        "div",
        { className: "flex flex-col gap-3 min-w-0" },
        Quality(s.quality_checks),
        blocks,
        Panel(
          "Station & SMV study",
          h(
            "div",
            null,
            h("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2" }, [["Operation", s.operation], ["Part", s.part], ["Machine", s.machine], ["Station", s.line ? s.line + (s.station ? " · " + s.station : "") : s.station], ["Rating %", num(s.rating_pct, 0)], ["Allowance %", num(s.allowance_pct, 0)]].map(([k, v]) => h("div", { key: k, className: "flex justify-between gap-2 border-b border-slate-800 py-0.5" }, h("span", { className: "text-slate-500" }, k), h("span", { className: "text-slate-200 font-bold truncate" }, v || "—")))),
            h("div", { className: "grid grid-cols-3 gap-2" }, Tile("SMV / SAM", num(s.smv_min), "min"), Tile("Pieces / hour", num(s.pcs_per_hour, 0)), Tile("Cycles", num(s.cycles, 0)), Tile("Avg cycle", num(s.avg_cycle_s, 2), "s"), Tile("Min / max", s.min_s !== undefined ? num(s.min_s, 1) + " / " + num(s.max_s, 1) : "—", "s"), Tile("Consistency CV", num(s.cv_pct, 1), "%"), Tile("Observed time", num(s.observed_time_s, 2), "s"), Tile("Basic time", num(s.basic_time_s, 2), "s"), Tile("Study", s.id || "—")),
            s.allowances && h("div", { className: "mt-1 text-[10px] text-slate-500" }, "allowances · personal " + s.allowances.personal + "% · fatigue " + s.allowances.fatigue + "% · delay " + s.allowances.delay + "%"),
            h("button", { type: "button", className: "mt-2 w-full rounded-md bg-sky-500 text-slate-900 font-bold text-xs py-1.5" }, "Review & save study")
          )
        ),
        Panel(
          "Recent studies",
          studies.length
            ? h("div", { className: "space-y-1 max-h-72 overflow-auto" }, studies.slice(0, 12).map((r) => h("button", { key: r.id, type: "button", onClick: () => setStudyId(r.id), className: "w-full text-left flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-xs border " + (r.id === s.id ? "bg-sky-500/15 border-sky-500/40" : "border-transparent hover:bg-slate-800") }, h("span", { className: "truncate" }, h("b", { className: "text-white" }, r.operation), h("span", { className: "text-slate-500" }, " · " + r.line + (r.station ? " st " + r.station : "") + " · " + r.date)), h("span", { className: "tabular-nums text-slate-300 whitespace-nowrap" }, isFeeling ? num(r.attention && r.attention.attention_pct, 0) + "%" : type === "standing" ? num(r.posture && r.posture.score, 0) + "/100" : num(r.smv_min) + " min"))))
            : h("div", { className: "text-xs text-slate-500" }, loading ? "Loading…" : "No studies yet.")
        )
      )
    )
  );
};

export default StationStudy;
