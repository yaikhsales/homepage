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

/* ─────────────────────────────────────────────────────────────────
 * SLIDE 1 — YQMS positioning slide.
 *
 * Presentation-first layout:
 *   LEFT (60%): eyebrow, big two-line headline (with "quality." accented in
 *   orange), one-line supporting sentence, three quick-read stat pills.
 *   RIGHT (40%): a small "solar system" — YQMS at centre, huge and glowing,
 *   with its Operations neighbours orbiting at half-size. A tiny 39-dot
 *   "you-are-here" mini-map in the top-right corner acknowledges the full
 *   constellation without dumping every icon on the audience.
 *
 * Everything sizes in vh/vw so the layout scales cleanly from card-size
 * to fullscreen without labels getting lost.
 * ───────────────────────────────────────────────────────────────── */

/** Small colored dot used in the corner "you are here" mini-map. */
function MiniDot({ color, ring }: { color: string; ring?: boolean }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: "0.9vh",
        height: "0.9vh",
        background: color,
        outline: ring ? "0.25vh solid #F37021" : "none",
        outlineOffset: "0.15vh",
        boxShadow: ring ? "0 0 0.8vh rgba(243,112,33,0.7)" : "none",
      }}
    />
  );
}

function MiniMap() {
  // Reproduce the three-cluster layout as coloured dots. YQMS = the ringed one.
  const admin = new Array(ADMINISTRATION.length).fill(null);
  const mgmt = new Array(MANAGEMENT.length).fill(null);
  return (
    <div className="flex items-start gap-[1.4vh] p-[1.2vh] rounded-md bg-white/[0.04] ring-1 ring-white/10">
      <div className="flex flex-col items-center gap-[0.6vh]">
        <span className="text-[1.05vh] font-bold uppercase tracking-wider text-[#7EA0E0]">Admin</span>
        <div className="grid grid-cols-4 gap-[0.5vh]">
          {admin.map((_, i) => <MiniDot key={i} color="#1E4DAA" />)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-[0.6vh]">
        <span className="text-[1.05vh] font-bold uppercase tracking-wider text-[#5FB89A]">Mgmt</span>
        <div className="grid grid-cols-1 gap-[0.5vh]">
          {mgmt.map((_, i) => <MiniDot key={i} color="#0A3327" />)}
        </div>
      </div>
      <div className="flex flex-col items-center gap-[0.6vh]">
        <span className="text-[1.05vh] font-bold uppercase tracking-wider text-yai-orange">Ops</span>
        <div className="grid grid-cols-2 gap-[0.5vh]">
          {OPERATIONS.map((t) => (
            <MiniDot key={t.file} color={t.highlight ? "#F37021" : "#0A3327"} ring={t.highlight} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** One satellite icon in the YQMS solar system. */
function Satellite({ file, label }: Tile) {
  return (
    <div className="flex flex-col items-center gap-[0.6vh]">
      <div
        className="rounded-lg bg-white/[0.05] ring-1 ring-white/10 flex items-center justify-center overflow-hidden"
        style={{ width: "6vh", height: "6vh" }}
      >
        <Image
          src={`/experience/IMG/icons/${file}`}
          alt={label}
          width={64}
          height={64}
          className="object-contain"
          style={{ width: "4.8vh", height: "4.8vh" }}
          unoptimized
        />
      </div>
      <span className="text-[1.05vh] uppercase tracking-wide font-bold text-white/55">{label}</span>
    </div>
  );
}

/** Slide 1 — YQMS positioning (rebuilt from a data-dump into a real slide). */
function ConstellationSlide() {
  const satellites = OPERATIONS.filter((t) => !t.highlight).slice(0, 5); // FC, 4DP, YPI, MRP, Call Out
  const remainingOps = OPERATIONS.filter((t) => !t.highlight).length - satellites.length;

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch">
      {/* Left — headline column */}
      <div className="flex-[1.15] flex flex-col justify-center px-[4vh] py-[3vh] gap-[2vh]">
        <div className="text-[1.4vh] uppercase tracking-[0.28em] font-extrabold text-yai-orange">
          YQMS · Positioning
        </div>
        <div>
          <div className="font-extrabold text-white leading-[1.02]" style={{ fontSize: "6.5vh" }}>
            1 of 39 agents.
          </div>
          <div className="font-extrabold leading-[1.02]" style={{ fontSize: "6.5vh" }}>
            <span className="text-white">The one that owns </span>
            <span className="text-yai-orange">quality.</span>
          </div>
        </div>
        <div className="text-white/70 max-w-[36ch]" style={{ fontSize: "2.1vh", lineHeight: 1.45 }}>
          Yai Quality Management System sits inside the Operations cluster —
          the QA specialist among 10 operational agents that keep the factory
          floor honest.
        </div>
        {/* Stat pills */}
        <div className="flex flex-wrap gap-[1.2vh] pt-[1vh]">
          {[
            { n: "39", l: "modules",  c: "#1E4DAA" },
            { n: "3",  l: "clusters", c: "#0A3327" },
            { n: "1",  l: "owner",    c: "#F37021" },
          ].map((p) => (
            <div
              key={p.l}
              className="flex items-baseline gap-[0.6vh] rounded-md px-[1.6vh] py-[0.8vh] bg-white/[0.04] ring-1 ring-white/10"
            >
              <span className="font-extrabold text-white" style={{ fontSize: "2.4vh" }}>{p.n}</span>
              <span className="uppercase tracking-wider font-bold" style={{ fontSize: "1.2vh", color: p.c === "#F37021" ? "#F37021" : "rgba(255,255,255,0.6)" }}>
                {p.l}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — solar system + mini-map */}
      <div className="flex-1 relative flex flex-col items-center justify-center pr-[3vh] pl-[2vh] py-[3vh]">
        {/* Mini-map top-right */}
        <div className="absolute top-[2vh] right-[2vh]">
          <div className="text-[1.05vh] uppercase tracking-[0.22em] font-extrabold text-white/50 mb-[0.6vh] text-right">
            You are here
          </div>
          <MiniMap />
        </div>

        {/* Cluster label */}
        <div className="text-[1.4vh] uppercase tracking-[0.24em] font-extrabold text-yai-orange mb-[2vh]">
          Operations · QA
        </div>

        {/* Big YQMS at centre */}
        <div
          className="relative rounded-full overflow-hidden ring-4 ring-yai-orange bg-white/[0.06] flex items-center justify-center"
          style={{
            width: "22vh",
            height: "22vh",
            boxShadow: "0 0 6vh rgba(243,112,33,0.45), inset 0 0 2vh rgba(243,112,33,0.15)",
          }}
        >
          <Image
            src="/experience/IMG/icons/yqms.png"
            alt="YQMS"
            width={220}
            height={220}
            className="object-contain"
            style={{ width: "16vh", height: "16vh" }}
            unoptimized
            priority
          />
        </div>
        <div className="mt-[1.4vh] text-white font-extrabold tracking-tight" style={{ fontSize: "2.6vh" }}>
          YQMS
        </div>
        <div className="text-white/55" style={{ fontSize: "1.4vh" }}>
          Yai Quality Management System
        </div>

        {/* Satellites — semicircle below */}
        <div className="mt-[2.5vh] flex items-start justify-center gap-[1.6vh] flex-wrap max-w-full">
          {satellites.map((s) => (
            <Satellite key={s.file} {...s} />
          ))}
        </div>
        {remainingOps > 0 && (
          <div className="mt-[1.4vh] text-white/40 tracking-wider" style={{ fontSize: "1.15vh" }}>
            + {remainingOps} more Operations agents
          </div>
        )}
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
