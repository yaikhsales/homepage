/* YQMS-specific slide bodies for the §08.2 SlideShow.
 *
 * Slide 1 — the full "My Yai Task Agent" module constellation, all 39
 * icons in three columns (Administration · Management · Operations)
 * exactly like the live dashboard. YQMS in the QA column is ringed in
 * orange with a glow so it "lives" visibly in the constellation.
 * Tiles size in vh so they scale up to a readable presentation size in
 * fullscreen (icon ≈ 7vh, label ≈ 1.4vh).
 *
 * Slide 2 — the YQMS agent portrait, big and centred. */

import Image from "next/image";
import type { Slide } from "./SlideShow";

type Tile = { file: string; label: string; highlight?: boolean };

/* Ordered to match the live task-agent dashboard exactly. */
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
    <div className="flex flex-col items-center gap-[0.6vh]">
      <div
        className="rounded-lg bg-white/[0.05] flex items-center justify-center overflow-hidden"
        style={{
          width: "7vh",
          height: "7vh",
          outline: highlight ? "0.3vh solid #F37021" : "0.12vh solid rgba(255,255,255,0.12)",
          outlineOffset: highlight ? "0.2vh" : 0,
          boxShadow: highlight ? "0 0 2.5vh rgba(243,112,33,0.6), inset 0 0 1.2vh rgba(243,112,33,0.15)" : undefined,
        }}
      >
        <Image
          src={`/experience/IMG/icons/${file}`}
          alt={label}
          width={80}
          height={80}
          className="object-contain"
          style={{ width: "5.5vh", height: "5.5vh" }}
          unoptimized
        />
      </div>
      <span
        className="uppercase tracking-wide font-bold text-center leading-tight"
        style={{
          fontSize: "1.35vh",
          color: highlight ? "#F37021" : "rgba(255,255,255,0.72)",
          maxWidth: "8vh",
        }}
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
    <div className="flex flex-col items-center gap-[1.5vh]">
      <div
        className="uppercase tracking-[0.22em] font-extrabold text-white whitespace-nowrap rounded"
        style={{
          fontSize: "1.5vh",
          padding: "0.6vh 1.8vh",
          background: color,
        }}
      >
        {title}
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: "1.4vh 1.6vh",
        }}
      >
        {tiles.map((t) => (
          <TileIcon key={t.file} {...t} />
        ))}
      </div>
    </div>
  );
}

/** Slide 1 — full module constellation, sized for presentation. */
function ConstellationSlide() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-[3vh] py-[2vh]">
      <div
        className="uppercase tracking-[0.24em] font-extrabold text-center mb-[2vh]"
        style={{ fontSize: "1.6vh", color: "rgba(255,255,255,0.85)" }}
      >
        My <span className="text-yai-orange">Yai</span> Task Agent
        <span className="text-white/40"> — YQMS lives in the QA constellation</span>
      </div>
      <div className="flex items-start justify-center" style={{ gap: "4vh" }}>
        <ClusterCol title="Administration" color="#1E4DAA" tiles={ADMINISTRATION} cols={4} />
        <ClusterCol title="Management"     color="#0A3327" tiles={MANAGEMENT}     cols={1} />
        <ClusterCol title="Operations"     color="#F37021" tiles={OPERATIONS}     cols={2} />
      </div>
      <div
        className="tracking-wider text-white/45 mt-[1.8vh]"
        style={{ fontSize: "1.25vh" }}
      >
        {ADMINISTRATION.length + MANAGEMENT.length + OPERATIONS.length} modules · 3 clusters · 1 owner
      </div>
    </div>
  );
}

/** Slide 2 — YQMS agent portrait. */
function AgentFaceSlide() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className="uppercase tracking-[0.24em] font-extrabold text-white/70 mb-[2vh]"
        style={{ fontSize: "1.6vh" }}
      >
        Meet the YQMS agent
      </div>
      <div
        className="relative rounded-full overflow-hidden ring-4 ring-yai-orange/70"
        style={{
          width: "56vh",
          height: "56vh",
          maxWidth: "520px",
          maxHeight: "520px",
          boxShadow: "0 0 6vh rgba(243,112,33,0.45)",
        }}
      >
        <Image
          src="/experience/IMG/YQMS.png"
          alt="YQMS agent"
          fill
          sizes="520px"
          className="object-cover"
          unoptimized
          priority
        />
      </div>
      <div
        className="mt-[2vh] font-extrabold tracking-tight text-white"
        style={{ fontSize: "3vh" }}
      >
        YQMS
      </div>
      <div className="text-white/60" style={{ fontSize: "1.6vh" }}>
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
