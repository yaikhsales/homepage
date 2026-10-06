// CE — Cost & Efficiency hub. The real CE module's menu as columns: AIVM, Product Development, Production,
// Machine, Product Costing — 20 sub-modules, every one a screen read from the simulated factory on the M1
// (sim/view, module "ce"). Cards keep the module's own icons where it has them (/assets/icons/sub-icons),
// the newer ones use a line icon. Written with React.createElement like the other simulated screens.
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Video, BookOpen, ListOrdered, Scale, LayoutGrid, Database, CalendarDays, ClipboardList } from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import { NavCover, useScreenTop } from "../components/ScreenTop";

const h = React.createElement;

// The CE menu as Gamini's module shows it. `img` = the module's own icon file, `icon` = a line icon instead.
// Line Planning's screen is being built elsewhere; until its route is on main the card shows a 'building' tag instead of a dead link.
const HAS_LINE_PLANNING = true;  // /dashboard/ce/line-planning is live

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
      { view: "line-planning", title: "IE Production Line Plan", sub: "Construct the line layout — stations, machines and operators for the order", icon: LayoutGrid, building: !HAS_LINE_PLANNING },
      { view: "line-balancing", title: "Line Balancing", sub: "Station loads against the pitch — the bottleneck of each line", icon: Scale },
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
      { view: "machine-inventory", title: "Machine Inventory", sub: "Every machine: model, line, station, maintenance dates", icon: Database },
      { view: "machine-layout", title: "Machine Layout", sub: "Every line's machines — name, code, attachment, needle, foot, LED, downtime; machine allocation (owned, in use, at peak, rent or borrow) inside", icon: LayoutGrid },
      { view: "line-plan", title: "Mechanic Line Plan", sub: "What the next style needs on each line — machines in, machines out, rent or purchase, changeover date", icon: CalendarDays },
      { view: "machine-requirement", title: "Machine Requirement", sub: "Machine types, feet and attachments per line, the next project's new requirements and what's missing", icon: ClipboardList },
    ],
  },
  {
    title: "Product Costing",
    tone: "border-amber-500/40",
    items: [
      { view: "cpm", title: "CPM", sub: "Cost per minute — month by month, line by line, section by section", img: "cpm.png" },
      { view: "style-costing", title: "Style Costing", sub: "CM a piece from SAM × cost per minute, against FOB", img: "style-costing.png" },
      { view: "cost-centers", title: "Cost centers ,Direct/Indirect Cost", sub: "Direct and indirect cost centres and the cost per minute", img: "center-direct-indirect-cost.png" },
    ],
  },
];

const CE = ({ onBack }) => {
  const navigate = useNavigate();
  const { translateModuleTitle } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [topRef, topPad] = useScreenTop();
  const back = () => (onBack ? onBack() : navigate(-1));
  // five columns side by side whenever the content is wide enough (the PA panel open at 1440 still is);
  // two below ~900 px of content width, one below ~560 px
  const [cols, setCols] = useState(5);
  const [wide, setWide] = useState(false); // a column ≥ 240 px shows the description; narrower columns keep it on hover
  useEffect(() => {
    const el = topRef.current; if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => { const cs = getComputedStyle(el); const w = el.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0); const c = w >= 900 ? 5 : w >= 560 ? 2 : 1; setCols(c); setWide((w - 12 * (c - 1)) / c >= 240); });
    ro.observe(el);
    return () => ro.disconnect();
  }, [topRef]);

  return h(
    "div",
    { ref: topRef, style: { paddingTop: topPad }, className: "yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-8 font-sans" },
    h("style", null, "body.yai-pa-open .yai-pa-aware { padding-right: 484px; }"),
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
      { className: "grid gap-3", style: { gridTemplateColumns: cols === 5 ? "repeat(5, minmax(0, 1fr))" : cols === 2 ? "repeat(2, minmax(0, 1fr))" : "1fr" } },
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
                { key: m.view, onClick: m.building ? undefined : () => navigate("/dashboard/ce/" + m.view), disabled: !!m.building, title: m.building ? "being built — not open yet" : undefined, className: "w-full text-left flex " + (wide ? "items-center gap-2.5 " : "flex-col items-start gap-1.5 ") + "rounded-xl border border-slate-700 bg-slate-900/60 transition-colors px-2.5 py-2 " + (m.building ? "opacity-70 cursor-default" : "hover:bg-slate-700/60 hover:border-slate-500") },
                h(
                  "div",
                  { className: "w-9 h-9 flex-shrink-0 rounded-lg bg-white p-1 flex items-center justify-center" },
                  m.img ? h("img", { src: process.env.PUBLIC_URL + "/assets/icons/sub-icons/" + m.img, alt: "", className: "w-full h-full object-contain" }) : h(m.icon, { size: 20, className: "text-slate-700" })
                ),
                h("div", { className: "min-w-0 w-full", title: m.sub }, h("div", { className: "font-bold text-white text-[14px] leading-tight", style: { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", overflowWrap: "anywhere" } }, translateModuleTitle(m.title), m.building && h("span", { className: "ml-2 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300 text-[10px] font-semibold px-1.5 py-px align-middle" }, "building")), wide && h("div", { className: "text-[11px] text-slate-400 leading-tight mt-0.5", style: { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } }, m.sub))
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
