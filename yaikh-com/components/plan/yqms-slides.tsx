/* YQMS-specific slide bodies for the §08.2 SlideShow.
 *
 * Slide 1 mirrors the live "My Yai Task Agent" dashboard, sub-groups and
 * all: three top-level clusters (Administration · Management · Operations)
 * spread edge-to-edge; each cluster carries its sub-group headers
 * (Accountant · Billing · HR · ADMIN · CSR · Shipping · E-GOV, etc.) with
 * the icons stacked under them. YQMS is ringed in orange with a glow so
 * it visibly "lives" in the QA constellation.
 *
 * Slide 2 — the YQMS agent portrait, big and centred. */

import Image from "next/image";
import type { Slide } from "./SlideShow";

type Tile = { file: string; label: string; highlight?: boolean };
type SubGroup = { name: string; tiles: Tile[] };

/* Sub-groups mirror the live dashboard exactly. */

const ADMINISTRATION: SubGroup[] = [
  { name: "Accountant", tiles: [
    { file: "accountant.png",     label: "Accountant" },
    { file: "iews.png",           label: "IEWS" },
    { file: "salary-bill.png",    label: "Salary Bill" },
    { file: "shipping-bill.png",  label: "Ship Bill" },
    { file: "speak-up.png",       label: "Speak Up" },
    { file: "fire-alarm.png",     label: "Fire Alarm" },
    { file: "cctv.png",           label: "CCTV" },
  ]},
  { name: "Billing", tiles: [
    { file: "purchase-request.png", label: "Purchase" },
    { file: "bill-claim.png",       label: "Bill Claim" },
    { file: "training.png",         label: "Training" },
    { file: "temp-worker.png",      label: "Temp Worker" },
    { file: "car-booking.png",      label: "Car Booking" },
    { file: "chemical.png",         label: "Chemical" },
  ]},
  { name: "HR", tiles: [
    { file: "yhr.png",          label: "YHR" },
    { file: "org-chart.png",    label: "Org Chart" },
    { file: "gate-pass.png",    label: "Gate Pass" },
    { file: "meeting-room.png", label: "Meeting" },
  ]},
  { name: "Admin", tiles: [
    { file: "support-ticket.png", label: "Ticket" },
    { file: "y-shop.png",         label: "Y Shop" },
    { file: "air.png",            label: "Air" },
    { file: "water.png",          label: "Water" },
    { file: "waste.png",          label: "Waste" },
  ]},
  { name: "CSR", tiles: [
    { file: "digital-audit.png", label: "Audit" },
    { file: "energy.png",        label: "Energy" },
  ]},
  { name: "Shipping", tiles: [
    { file: "shipping.png", label: "Shipping" },
  ]},
  { name: "E-GOV", tiles: [
    { file: "e-government.png", label: "E-GOV" },
  ]},
];

const MANAGEMENT: SubGroup[] = [
  { name: "Dashboard", tiles: [
    { file: "management-dashboard.png", label: "Dashboard" },
    { file: "sop.png",                  label: "SOP" },
  ]},
  { name: "Data Scientist", tiles: [
    { file: "system-analysis.png", label: "Sys Analysis" },
  ]},
];

const OPERATIONS: SubGroup[] = [
  { name: "QA", tiles: [
    { file: "yqms.png",     label: "YQMS", highlight: true },
    { file: "call-out.png", label: "Call Out" },
  ]},
  { name: "Production", tiles: [
    { file: "fc.png",   label: "FC" },
    { file: "ywip.png", label: "YWIP" },
    { file: "ce.png",   label: "CE" },
    { file: "ytm.png",  label: "YTM" },
    { file: "ytm-shop.png", label: "YTM Shop" },
  ]},
  { name: "4DP", tiles: [{ file: "4dp.png", label: "4DP" }] },
  { name: "YPI", tiles: [{ file: "ypi.png", label: "YPI" }] },
  { name: "MRP", tiles: [{ file: "mrp.png", label: "MRP" }] },
];

function totalTiles(groups: SubGroup[]): number {
  return groups.reduce((s, g) => s + g.tiles.length, 0);
}

function TileIcon({ file, label, highlight }: Tile) {
  return (
    <div className="flex flex-col items-center gap-[0.5cqh]">
      <div
        className="rounded-lg bg-white/[0.05] flex items-center justify-center overflow-hidden"
        style={{
          width: "8cqh",
          height: "8cqh",
          outline: highlight ? "0.35cqh solid #F37021" : "0.12cqh solid rgba(255,255,255,0.12)",
          outlineOffset: highlight ? "0.25cqh" : 0,
          boxShadow: highlight
            ? "0 0 3cqh rgba(243,112,33,0.65), inset 0 0 1.4cqh rgba(243,112,33,0.18)"
            : undefined,
        }}
      >
        <Image
          src={`/experience/IMG/icons/${file}`}
          alt={label}
          width={96}
          height={96}
          className="object-contain"
          style={{ width: "6.5cqh", height: "6.5cqh" }}
          unoptimized
        />
      </div>
      <span
        className="uppercase tracking-wide font-bold text-center leading-tight"
        style={{
          fontSize: "1.3cqh",
          color: highlight ? "#F37021" : "rgba(255,255,255,0.72)",
          maxWidth: "9cqh",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SubGroupCol({ group, subColor }: { group: SubGroup; subColor: string }) {
  return (
    <div className="flex flex-col items-center gap-[1cqh]">
      <div
        className="uppercase tracking-[0.16em] font-extrabold text-center whitespace-nowrap rounded"
        style={{
          fontSize: "1.15cqh",
          padding: "0.35cqh 0.9cqh",
          color: subColor,
          background: "rgba(255,255,255,0.05)",
          border: `0.1cqh solid ${subColor}55`,
        }}
      >
        {group.name}
      </div>
      <div className="flex flex-col items-center gap-[1cqh]">
        {group.tiles.map((t) => (
          <TileIcon key={t.file} {...t} />
        ))}
      </div>
    </div>
  );
}

function ClusterBlock({
  title,
  headerBg,
  subColor,
  groups,
  flex,
}: {
  title: string;
  headerBg: string;
  subColor: string;
  groups: SubGroup[];
  flex: number;
}) {
  return (
    <div
      className="flex flex-col items-center gap-[1.5cqh]"
      style={{ flex, minWidth: 0 }}
    >
      <div
        className="uppercase tracking-[0.22em] font-extrabold text-white whitespace-nowrap rounded"
        style={{
          fontSize: "1.6cqh",
          padding: "0.65cqh 2cqh",
          background: headerBg,
        }}
      >
        {title}
      </div>
      <div
        className="flex items-start justify-center"
        style={{ gap: "1.8cqh", flexWrap: "wrap" }}
      >
        {groups.map((g) => (
          <SubGroupCol key={g.name} group={g} subColor={subColor} />
        ))}
      </div>
    </div>
  );
}

/** Slide 1 — full task-agent constellation, spread edge-to-edge. */
function ConstellationSlide() {
  const total = totalTiles(ADMINISTRATION) + totalTiles(MANAGEMENT) + totalTiles(OPERATIONS);
  return (
    <div className="w-full h-full flex flex-col items-stretch px-[3cqh] py-[2cqh]">
      <div
        className="uppercase tracking-[0.24em] font-extrabold text-center mb-[1.5cqh]"
        style={{ fontSize: "1.6cqh", color: "rgba(255,255,255,0.9)" }}
      >
        My <span className="text-yai-orange">Yai</span> Task Agent
        <span className="text-white/40"> — YQMS lives in the QA constellation</span>
      </div>
      <div
        className="flex-1 flex items-start justify-between"
        style={{ gap: "3cqh" }}
      >
        <ClusterBlock
          title="Administration" headerBg="#1E4DAA" subColor="#7EA0E0"
          groups={ADMINISTRATION}
          flex={totalTiles(ADMINISTRATION)}
        />
        <ClusterBlock
          title="Management" headerBg="#0A3327" subColor="#5FB89A"
          groups={MANAGEMENT}
          flex={Math.max(2, totalTiles(MANAGEMENT))}
        />
        <ClusterBlock
          title="Operations" headerBg="#F37021" subColor="#F5B189"
          groups={OPERATIONS}
          flex={totalTiles(OPERATIONS)}
        />
      </div>
      <div
        className="tracking-wider text-white/50 mt-[1cqh] text-center"
        style={{ fontSize: "1.2cqh" }}
      >
        {total} modules · {ADMINISTRATION.length + MANAGEMENT.length + OPERATIONS.length} sub-groups · 3 clusters · 1 owner
      </div>
    </div>
  );
}

/** Slide 2 — YQMS agent portrait. */
function AgentFaceSlide() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className="uppercase tracking-[0.24em] font-extrabold text-white/70 mb-[2cqh]"
        style={{ fontSize: "1.6cqh" }}
      >
        Meet the YQMS agent
      </div>
      <div
        className="relative rounded-full overflow-hidden ring-4 ring-yai-orange/70"
        style={{
          width: "56cqh",
          height: "56cqh",
          maxWidth: "520px",
          maxHeight: "520px",
          boxShadow: "0 0 6cqh rgba(243,112,33,0.45)",
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
        className="mt-[2cqh] font-extrabold tracking-tight text-white"
        style={{ fontSize: "3cqh" }}
      >
        YQMS
      </div>
      <div className="text-white/60" style={{ fontSize: "1.6cqh" }}>
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
