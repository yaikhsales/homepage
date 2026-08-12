/* YQMS-specific slide bodies for the §08.2 SlideShow. Slide 1 renders the
 * Yai module constellation (icons on the dark navy background) with the
 * YQMS-adjacent QA cluster highlighted. Slide 2 shows the YQMS agent's
 * portrait, centred and enlarged so it reads even at a distance. */

import Image from "next/image";
import type { Slide } from "./SlideShow";

const QA_CLUSTER = [
  { file: "yqms.png",  label: "YQMS",  highlight: true },
  { file: "fc.png",    label: "FC" },
  { file: "4dp.png",   label: "4DP" },
  { file: "ypi.png",   label: "YPI" },
  { file: "mrp.png",   label: "MRP" },
  { file: "call-out.png", label: "Call Out" },
];

const OPS_CLUSTER = [
  { file: "ywip.png",           label: "YWIP" },
  { file: "ce.png",             label: "CE" },
  { file: "ytm.png",            label: "YTM" },
  { file: "ytm-shop.png",       label: "YTM Shop" },
];

const ADMIN_CLUSTER = [
  { file: "accountant.png",     label: "Accountant" },
  { file: "purchase-request.png", label: "Purchase" },
  { file: "yhr.png",            label: "YHR" },
  { file: "support-ticket.png", label: "Ticket" },
  { file: "digital-audit.png",  label: "Audit" },
  { file: "shipping.png",       label: "Shipping" },
  { file: "system-analysis.png", label: "Sys Analysis" },
  { file: "management-dashboard.png", label: "Dashboard" },
];

function Tile({ file, label, highlight }: { file: string; label: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${highlight ? "scale-110" : ""}`}>
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-lg bg-white/[0.04] flex items-center justify-center overflow-hidden ${
          highlight ? "ring-2 ring-yai-orange shadow-[0_0_18px_rgba(243,112,33,0.55)]" : "ring-1 ring-white/10"
        }`}
      >
        <Image
          src={`/experience/IMG/icons/${file}`}
          alt={label}
          width={56}
          height={56}
          className="object-contain w-11 h-11 md:w-12 md:h-12"
          unoptimized
        />
      </div>
      <span className={`text-[9px] md:text-[10px] uppercase tracking-wide font-bold ${highlight ? "text-yai-orange" : "text-white/60"}`}>
        {label}
      </span>
    </div>
  );
}

function ClusterCol({ title, color, tiles }: { title: string; color: string; tiles: typeof QA_CLUSTER }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <div
        className="text-[9px] md:text-[10px] uppercase tracking-[0.22em] font-extrabold px-3 py-1 rounded text-white"
        style={{ background: color }}
      >
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {tiles.map((t) => (
          <Tile key={t.file} {...t} />
        ))}
      </div>
    </div>
  );
}

/** Slide 1 — module constellation, YQMS ringed in orange. */
function ConstellationSlide() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 md:px-10 py-6">
      <div className="text-white/80 text-[11px] md:text-xs uppercase tracking-[0.24em] font-extrabold mb-4 md:mb-6">
        My <span className="text-yai-orange">Yai</span> Task Agent — YQMS lives in the QA constellation
      </div>
      <div className="flex items-start gap-4 md:gap-8 lg:gap-10 flex-wrap justify-center">
        <ClusterCol title="Administration" color="#1E4DAA" tiles={ADMIN_CLUSTER} />
        <ClusterCol title="Operations"     color="#0A3327" tiles={OPS_CLUSTER} />
        <ClusterCol title="QA"             color="#F37021" tiles={QA_CLUSTER} />
      </div>
    </div>
  );
}

/** Slide 2 — YQMS agent portrait. */
function AgentFaceSlide() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="text-white/70 text-[11px] md:text-xs uppercase tracking-[0.24em] font-extrabold mb-4">
        Meet the YQMS agent
      </div>
      <div className="relative rounded-full overflow-hidden ring-4 ring-yai-orange/70 shadow-[0_0_40px_rgba(243,112,33,0.45)] w-[48vh] h-[48vh] max-w-[440px] max-h-[440px]">
        <Image
          src="/experience/IMG/YQMS.png"
          alt="YQMS agent"
          fill
          sizes="440px"
          className="object-cover"
          unoptimized
          priority
        />
      </div>
      <div className="mt-5 text-white text-lg md:text-2xl font-extrabold tracking-tight">
        YQMS
      </div>
      <div className="text-white/60 text-xs md:text-sm mt-1">
        Yai Quality Management System
      </div>
    </div>
  );
}

export const YQMS_SLIDES: Slide[] = [
  { label: "1", caption: "Module constellation", accent: "#F37021", content: <ConstellationSlide /> },
  { label: "2", caption: "Agent face",           accent: "#1E4DAA", content: <AgentFaceSlide /> },
  { label: "3", caption: "Slide 3 — placeholder" },
  { label: "4", caption: "Slide 4 — placeholder" },
];
