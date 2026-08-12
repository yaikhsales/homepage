/* YQMS-specific slide bodies for the §08.2 SlideShow.
 * Slide 1 mirrors the full "My Yai Task Agent" dashboard from /experience —
 * every module icon in three columns (Administration · Management ·
 * Operations), with the YQMS tile ringed in orange so it visibly "lives"
 * in the QA constellation.
 * Slide 2 shows the YQMS agent portrait, big and centred. */

import Image from "next/image";
import type { Slide } from "./SlideShow";

type Tile = { file: string; label: string; highlight?: boolean };

/* Ordered to match the user's live task-agent dashboard, column by column.
 * `highlight: true` marks the tile that gets the orange ring on slide 1. */

const ADMINISTRATION: Tile[] = [
  { file: "accountant.png",         label: "Accountant" },
  { file: "purchase-request.png",   label: "Purchase" },
  { file: "yhr.png",                label: "YHR" },
  { file: "support-ticket.png",     label: "Ticket" },
  { file: "digital-audit.png",      label: "Audit" },
  { file: "shipping.png",           label: "Shipping" },
  { file: "e-government.png",       label: "E-GOV" },
  { file: "iews.png",               label: "IEWS" },
  { file: "bill-claim.png",         label: "Bill Claim" },
  { file: "org-chart.png",          label: "Org Chart" },
  { file: "y-shop.png",             label: "Y Shop" },
  { file: "energy.png",             label: "Energy" },
  { file: "salary-bill.png",        label: "Salary Bill" },
  { file: "training.png",           label: "Training" },
  { file: "gate-pass.png",          label: "Gate Pass" },
  { file: "air.png",                label: "Air" },
  { file: "shipping-bill.png",      label: "Ship Bill" },
  { file: "temp-worker.png",        label: "Temp Worker" },
  { file: "meeting-room.png",       label: "Meeting" },
  { file: "water.png",              label: "Water" },
  { file: "speak-up.png",           label: "Speak Up" },
  { file: "car-booking.png",        label: "Car Booking" },
  { file: "waste.png",              label: "Waste" },
  { file: "fire-alarm.png",         label: "Fire Alarm" },
  { file: "chemical.png",           label: "Chemical" },
  { file: "cctv.png",               label: "CCTV" },
];

const MANAGEMENT: Tile[] = [
  { file: "management-dashboard.png", label: "Dashboard" },
  { file: "system-analysis.png",      label: "Sys Analysis" },
  { file: "sop.png",                  label: "SOP" },
];

const OPERATIONS: Tile[] = [
  { file: "yqms.png",       label: "YQMS", highlight: true },
  { file: "call-out.png",   label: "Call Out" },
  { file: "fc.png",         label: "FC" },
  { file: "4dp.png",        label: "4DP" },
  { file: "ypi.png",        label: "YPI" },
  { file: "mrp.png",        label: "MRP" },
  { file: "ywip.png",       label: "YWIP" },
  { file: "ce.png",         label: "CE" },
  { file: "ytm.png",        label: "YTM" },
  { file: "ytm-shop.png",   label: "YTM Shop" },
];

function TileIcon({ file, label, highlight }: Tile) {
  return (
    <div className={`flex flex-col items-center gap-1 ${highlight ? "scale-110" : ""}`}>
      <div
        className={`w-10 h-10 md:w-11 md:h-11 rounded-md bg-white/[0.04] flex items-center justify-center overflow-hidden ${
          highlight
            ? "ring-2 ring-yai-orange shadow-[0_0_18px_rgba(243,112,33,0.55)]"
            : "ring-1 ring-white/10"
        }`}
      >
        <Image
          src={`/experience/IMG/icons/${file}`}
          alt={label}
          width={40}
          height={40}
          className="object-contain w-8 h-8"
          unoptimized
        />
      </div>
      <span
        className={`text-[8px] md:text-[9px] uppercase tracking-wide font-bold text-center leading-tight max-w-[54px] ${
          highlight ? "text-yai-orange" : "text-white/55"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function ClusterCol({
  title,
  color,
  tiles,
  cols,
}: {
  title: string;
  color: string;
  tiles: Tile[];
  cols: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <div
        className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-extrabold px-3 py-1 rounded text-white whitespace-nowrap"
        style={{ background: color }}
      >
        {title}
      </div>
      <div
        className="grid gap-1.5 md:gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {tiles.map((t) => (
          <TileIcon key={t.file} {...t} />
        ))}
      </div>
    </div>
  );
}

/** Slide 1 — full module constellation. */
function ConstellationSlide() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 md:px-8 py-4">
      <div className="text-white/85 text-[10px] md:text-xs uppercase tracking-[0.22em] font-extrabold mb-3 md:mb-4 text-center">
        My <span className="text-yai-orange">Yai</span> Task Agent — YQMS lives in the QA constellation
      </div>
      <div className="flex items-start gap-4 md:gap-8 lg:gap-10 justify-center flex-wrap">
        <ClusterCol title="Administration" color="#1E4DAA" tiles={ADMINISTRATION} cols={4} />
        <ClusterCol title="Management"     color="#0A3327" tiles={MANAGEMENT}     cols={1} />
        <ClusterCol title="Operations"     color="#F37021" tiles={OPERATIONS}     cols={2} />
      </div>
      <div className="mt-3 md:mt-4 text-white/45 text-[9px] md:text-[10px] tracking-wider">
        {ADMINISTRATION.length + MANAGEMENT.length + OPERATIONS.length} modules · 3 clusters · 1 owner
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
