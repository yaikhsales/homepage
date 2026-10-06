// CE · AI Vision Motion Analysis (AVMA). The hub Gamini's module shows when an IE opens AVMA: three AI
// vision modules as cards (AI Motion, AI Standing, AI Feeling) with a link to the ST video library.
// Each card opens its module screen — the Station Time Study over sim/view ce/avma filtered by module_type.
// Written with React.createElement like the other simulated screens.
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Hand, PersonStanding, Smile, Video } from "lucide-react";
import StationStudy from "./StationStudy";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const h = React.createElement;

const MODULES = [
  { type: "motion", tag: "Motion & IE study", title: "AI Motion", sub: "Real-time hand tracking, 2-handed process chart & IE time study", icon: Hand, tone: "from-sky-500/30 to-sky-900/10 border-sky-500/40", ink: "text-sky-300" },
  { type: "standing", tag: "Posture & action", title: "AI Standing", sub: "Worker posture analysis, ergonomics, sitting vs standing time tracking", icon: PersonStanding, tone: "from-emerald-500/30 to-emerald-900/10 border-emerald-500/40", ink: "text-emerald-300" },
  { type: "feeling", tag: "Emotion & attention", title: "AI Feeling", sub: "Facial expression analysis, worker attention & emotion tracking", icon: Smile, tone: "from-amber-500/30 to-amber-900/10 border-amber-500/40", ink: "text-amber-300" },
];

// Illustration of a module: a framed stage with the module's line icon and a few tracking marks, so each
// card reads at a glance without a photo.
const Picture = ({ m }) =>
  h(
    "div",
    { className: "relative h-28 rounded-xl bg-gradient-to-br border overflow-hidden flex items-center justify-center " + m.tone },
    h("div", { className: "absolute inset-3 rounded-lg border border-dashed border-white/15" }),
    [0, 1, 2, 3].map((i) => h("span", { key: i, className: "absolute w-2 h-2 rounded-full bg-white/40", style: { left: 18 + i * 22 + "%", top: 22 + ((i * 37) % 50) + "%" } })),
    h(m.icon, { size: 52, className: m.ink, strokeWidth: 1.5 })
  );

const Hub = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const back = () => (onBack ? onBack() : navigate(-1));
  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 484px; }"),
    h(NavCover),
    h(
      "div",
      { className: "flex items-center gap-3 mb-4" },
      h("button", { onClick: back, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: "text-lg font-black text-white leading-none" }, "AI Vision Operation Modules"),
      h(
        "button",
        { onClick: () => navigate("/dashboard/ce/operation-library"), className: "ml-auto flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white whitespace-nowrap" },
        h(Video, { size: 14 }),
        "ST Video Library & Motion Analysis",
        h(ArrowRight, { size: 14 })
      )
    ),
    h(
      "div",
      { className: "grid gap-4 md:grid-cols-3" },
      MODULES.map((m) =>
        h(
          "button",
          { key: m.type, onClick: () => navigate("/dashboard/ce/avma/" + m.type), className: "text-left rounded-2xl border border-slate-700 bg-slate-800/40 hover:bg-slate-700/50 hover:border-slate-500 transition-colors p-4" },
          h(
            "div",
            { className: "flex items-center justify-between mb-3" },
            h("span", { className: "rounded-full border border-slate-600 bg-slate-900/60 text-[11px] px-2 py-0.5 text-slate-300" }, m.tag),
            h("span", { className: "flex items-center gap-1 text-xs font-bold " + m.ink }, "Open", h(ArrowRight, { size: 13 }))
          ),
          h(Picture, { m }),
          h("div", { className: "mt-3 font-black text-white" }, m.title),
          h("div", { className: "text-xs text-slate-400 mt-0.5 leading-snug" }, m.sub)
        )
      )
    ),
    h("p", { className: "mt-4 text-xs text-slate-500" }, "Simulated factory data — no real customer, supplier or person.")
  );
};

const Avma = ({ onBack }) => {
  const { type } = useParams();
  const m = MODULES.find((x) => x.type === type);
  if (!m) return h(Hub, { onBack });
  return h(StationStudy, { type: m.type, onBack });
};

export default Avma;
