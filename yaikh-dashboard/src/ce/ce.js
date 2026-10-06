// CE — Cost & Efficiency hub. The real CE module's menu as columns: AIVM, Product Development, Production,
// People, Machine — 20 sub-modules, every one a screen read from the simulated factory on the M1
// (sim/view, module "ce"). Cards keep the module's own icons where it has them (/assets/icons/sub-icons),
// the newer ones use a line icon. Written with React.createElement like the other simulated screens.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Video, BookOpen, ListOrdered, Scale, LayoutGrid, Database, CalendarDays, ClipboardList } from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const h = React.createElement;

// The CE menu as Gamini's module shows it. `img` = the module's own icon file, `icon` = a line icon instead.
const GROUPS = [
  {
    title: "AIVM — AI Vision Motion Analysis",
    tone: "border-sky-500/40",
    items: [
      { view: "avma", title: "AI Vision Motion Analysis", sub: "AVMA — IE adds a video of an operation, the AI analyses the motion and gives the SMV", icon: Video },
      { view: "operation-library", title: "Operation Library", sub: "Operations by style — T-shirt, jacket, pants — with machine types, grouped by category", img: "standard-time-analysis.png" },
      { view: "ie-master", title: "IE Master", sub: "Garment type → category → operation: standard video, who has done it, best operator, defect history", icon: BookOpen },
    ],
  },
  {
    title: "Product Development",
    tone: "border-emerald-500/40",
    items: [
      { view: "pd-unit-plan", title: "Unit Plan", sub: "Each unit's orders as in the 4DP unit plan, with the IE fields: new order, analysis done, total SAM, target efficiency, operators needed", icon: CalendarDays },
      { view: "garment-analysis", title: "Garment Analysis", sub: "Build the operation list on the garment drawing — SAM, machine, seam width, totals by machine type", img: "garment-analysis.png" },
      { view: "operation-breakdown", title: "Operation Breakdown", sub: "Saved garment analyses — open one as a printable operation sheet", icon: ListOrdered },
    ],
  },
  {
    title: "Production",
    tone: "border-teal-500/40",
    items: [
      { view: "line-balancing", title: "Line Balancing", sub: "Station loads against the pitch — the bottleneck of each line", icon: Scale },
      { view: "style-costing", title: "Style Costing", sub: "CM a piece from SAM × cost per minute, against FOB", img: "style-costing.png" },
      { view: "cost-centers", title: "Cost centers ,Direct/Indirect Cost", sub: "Direct and indirect cost centres and the cost per minute", img: "center-direct-indirect-cost.png" },
      { view: "cpm", title: "CPM", sub: "Critical path of an order — floats, delays, the Master Plan factors", img: "cpm.png" },
    ],
  },
  {
    title: "People",
    tone: "border-amber-500/40",
    items: [
      { view: "productivity", title: "Cut,Sew,Pack Productivity", sub: "Cut, sew and pack against target, line by line, live today", img: "cut-sew-pack-worker-capacity.png" },
      { view: "team-performance", title: "Team Performance", sub: "Lines ranked by achievement, efficiency, DHU and downtime", img: "individual-team-production-record.png" },
      { view: "skill-inventory", title: "Skill inventory", sub: "Grades A / B / C / newcomer per line, certified critical operators", img: "skill-inventory.png" },
      { view: "learning-curve", title: "Learning Curve", sub: "Efficiency day by day on a new run, and new workers' progression", img: "Learning-curve.png" },
      { view: "downtimes", title: "Downtimes", sub: "Machine and other stoppages, causes, mechanics, minutes lost", img: "downtimes.png" },
    ],
  },
  {
    title: "Machine",
    tone: "border-violet-500/40",
    items: [
      { view: "machine-allocation", title: "Machine allocation", sub: "Owned, in use, at peak — what to rent or borrow", img: "machine-allocation.png" },
      { view: "machine-layout", title: "Machine Layout", sub: "The stations of a line in order, with foot, attachment and grade", icon: LayoutGrid },
      { view: "machine-inventory", title: "Machine Inventory", sub: "Every machine: model, line, station, maintenance dates", icon: Database },
      { view: "line-plan", title: "Line Plan", sub: "What each line runs now and next, loaded days and free days", icon: CalendarDays },
      { view: "machine-requirement", title: "Machine Requirement", sub: "Machines each order needs against the lines — rent or borrow", icon: ClipboardList },
    ],
  },
];

const CE = ({ onBack }) => {
  const navigate = useNavigate();
  const { translateModuleTitle } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [topRef, topPad] = useScreenTop();
  const back = () => (onBack ? onBack() : navigate(-1));

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 436px; }"),
    h(NavCover),
    h(
      "div",
      { className: "flex items-center gap-3 mb-3" },
      h("button", { onClick: back, className: "p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white", "aria-label": "Back" }, h(ArrowLeft, { size: 18 })),
      h("h1", { className: "text-lg font-black text-white leading-none" }, "CE · Cost & Efficiency"),
      h("span", { className: "text-xs text-slate-400" }, "20 sub-modules in five columns — every screen reads the simulated factory")
    ),
    h(
      "div",
      { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5" },
      GROUPS.map((g) =>
        h(
          "section",
          { key: g.title, className: "rounded-2xl border bg-slate-800/40 p-3 " + g.tone },
          h("div", { className: "text-xs uppercase tracking-wider text-slate-300 font-bold mb-2 px-1" }, g.title),
          h(
            "div",
            { className: "space-y-2" },
            g.items.map((m) =>
              h(
                "button",
                { key: m.view, onClick: () => navigate("/dashboard/ce/" + m.view), className: "w-full text-left flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/60 hover:border-slate-500 transition-colors px-3 py-2" },
                h(
                  "div",
                  { className: "w-12 h-12 flex-shrink-0 rounded-lg bg-white p-1.5 flex items-center justify-center" },
                  m.img ? h("img", { src: process.env.PUBLIC_URL + "/assets/icons/sub-icons/" + m.img, alt: "", className: "w-full h-full object-contain" }) : h(m.icon, { size: 26, className: "text-slate-700" })
                ),
                h("div", { className: "min-w-0" }, h("div", { className: "font-bold text-white text-sm leading-tight" }, translateModuleTitle(m.title)), h("div", { className: "text-[11px] text-slate-400 leading-tight mt-0.5" }, m.sub))
              )
            )
          )
        )
      )
    ),
    h("p", { className: "mt-3 text-xs text-slate-500" }, "Simulated factory data — no real customer, supplier or person."),
    h("button", { onClick: () => setIsBotOpen(true), className: "fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl flex items-center justify-center", "aria-label": "Ask CE bot", title: "Ask CE bot" }, h(MessageCircle, { className: "w-7 h-7" })),
    isBotOpen && h(GeneralAIAgent, { isOpen: isBotOpen, onClose: () => setIsBotOpen(false), moduleContext: "CE" })
  );
};

export default CE;
