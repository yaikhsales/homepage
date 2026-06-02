"use client";

import { useState } from "react";

/**
 * 2-month event calendar for the "Exhibitions & events" GTM enabler bar.
 * Shows Cambodia-relevant Ai / tech / business / networking events.
 * Navigate ± months with the arrow buttons; range bounded to 12 months ahead of today.
 *
 * Today base = 2026-06-02 (Q2 2026). User-confirmed dates are placeholders — refine later.
 */

type EventType = "ai" | "tech" | "business" | "summit" | "expo" | "networking";

type Event = {
  date: string;        // ISO "YYYY-MM-DD"
  endDate?: string;    // optional multi-day end
  name: string;
  type: EventType;
  loc: string;
  note?: string;       // short relevance note
};

const TYPE_VIS: Record<EventType, { label: string; color: string; bg: string }> = {
  ai:         { label: "Ai",         color: "#FFFFFF", bg: "#8B5CF6" },
  tech:       { label: "Tech",       color: "#FFFFFF", bg: "#1E4DAA" },
  business:   { label: "Business",   color: "#FFFFFF", bg: "#0A3327" },
  summit:     { label: "Summit",     color: "#FFFFFF", bg: "#F37021" },
  expo:       { label: "Expo",       color: "#FFFFFF", bg: "#D4A017" },
  networking: { label: "Networking", color: "#FFFFFF", bg: "#14B8A6" },
};

// Calendar — Cambodia + ASEAN + China (Beijing / Shanghai / Guangdong) Ai / tech / business / expo events.
// Through end of 2026 packed; 2027 placeholders. User refines real dates with organiser.
const EVENTS: Event[] = [
  // ─── JUNE 2026 ───
  { date: "2026-06-12", name: "Cambodia ICT Federation Roundtable", type: "tech", loc: "Phnom Penh", note: "Monthly industry-body forum." },
  { date: "2026-06-18", name: "GMAC Member Meeting", type: "business", loc: "Phnom Penh", note: "Garment association — channel to mid-size factories." },
  { date: "2026-06-25", endDate: "2026-06-27", name: "Cambodia Tech Week", type: "tech", loc: "Phnom Penh · Diamond Island", note: "Largest local tech showcase." },
  { date: "2026-06-28", endDate: "2026-06-30", name: "BEYOND Expo", type: "expo", loc: "Macau / Guangdong-region", note: "Major Asia-Pacific tech expo, China-adjacent." },

  // ─── JULY 2026 ───
  { date: "2026-07-04", endDate: "2026-07-07", name: "WAIC · World Ai Conference", type: "ai", loc: "Shanghai, China", note: "Flagship Ai event in China — must-visit." },
  { date: "2026-07-09", name: "AMCHAM Cambodia Mixer", type: "networking", loc: "Phnom Penh", note: "Monthly chamber networking." },
  { date: "2026-07-16", endDate: "2026-07-17", name: "Cambodia Ai & Cloud Summit", type: "ai", loc: "Phnom Penh · Sofitel", note: "Direct positioning — attend / speak." },
  { date: "2026-07-23", name: "EuroCham Digital Sector Committee", type: "networking", loc: "Phnom Penh", note: "EU-Cambodia digital working group." },
  { date: "2026-07-28", endDate: "2026-07-30", name: "Smart China Expo", type: "expo", loc: "Chongqing / Guangdong corridor", note: "Smart-mfg + AIoT, factory-relevant." },

  // ─── AUGUST 2026 ───
  { date: "2026-08-06", name: "ASEAN SME Digital Innovation Forum", type: "summit", loc: "Siem Reap, Cambodia", note: "ASEAN-wide SME audience." },
  { date: "2026-08-14", endDate: "2026-08-16", name: "Cambodia Garment Mfg Expo", type: "expo", loc: "Phnom Penh · Koh Pich", note: "Direct factory-owner audience." },
  { date: "2026-08-19", endDate: "2026-08-23", name: "World Robot Conference", type: "ai", loc: "Beijing, China", note: "Major robotics + AIoT showcase." },
  { date: "2026-08-27", name: "TAFTAC Member Roundtable", type: "business", loc: "Phnom Penh", note: "Footwear / travel-goods association." },

  // ─── SEPTEMBER 2026 ───
  { date: "2026-09-04", endDate: "2026-09-06", name: "ASEAN Tech Summit (Cambodia)", type: "summit", loc: "Phnom Penh · Peace Palace", note: "Minister-tasked appearance — primary stage." },
  { date: "2026-09-10", endDate: "2026-09-12", name: "Inclusion Conference (Ant Group)", type: "ai", loc: "Shanghai, China", note: "Fintech + Ai for inclusion — payment-rail angle." },
  { date: "2026-09-17", name: "GMAC + ILO Better Work Forum", type: "business", loc: "Phnom Penh", note: "Compliance + worker-voice positioning." },
  { date: "2026-09-23", endDate: "2026-09-25", name: "Singapore FinTech / SWITCH (ASEAN preview)", type: "summit", loc: "Singapore", note: "ASEAN-wide investor + tech audience." },

  // ─── OCTOBER 2026 ───
  { date: "2026-10-08", endDate: "2026-10-10", name: "Cambodia ICT Awards", type: "tech", loc: "Phnom Penh", note: "National recognition — Yai submission target." },
  { date: "2026-10-15", endDate: "2026-10-19", name: "Canton Fair (Phase 1)", type: "expo", loc: "Guangzhou, China", note: "World's largest trade fair — manufacturing buyer reach." },
  { date: "2026-10-22", name: "Phnom Penh AIoT Meetup", type: "ai", loc: "Phnom Penh · Factory PP", note: "Developer-community visibility." },
  { date: "2026-10-27", endDate: "2026-10-29", name: "Hong Kong FinTech Week", type: "summit", loc: "Hong Kong", note: "Greater Bay Area Ai + fintech, China-adjacent." },

  // ─── NOVEMBER 2026 ───
  { date: "2026-11-05", endDate: "2026-11-07", name: "Mekong Investment Forum", type: "business", loc: "Phnom Penh", note: "FDI + investment-track presence." },
  { date: "2026-11-10", endDate: "2026-11-12", name: "AICon · Ai Industry Conference", type: "ai", loc: "Beijing, China", note: "Top-tier enterprise-Ai conference." },
  { date: "2026-11-15", endDate: "2026-11-17", name: "China Hi-Tech Fair", type: "expo", loc: "Shenzhen, Guangdong", note: "China's largest tech expo — Ai + hardware." },
  { date: "2026-11-19", name: "Cambodia Smart City Summit", type: "summit", loc: "Phnom Penh · NCDD", note: "Ministry of Telecom / Digital Gov angle." },
  { date: "2026-11-25", endDate: "2026-11-27", name: "ASEAN Business & Investment Summit", type: "summit", loc: "Manila, Philippines", note: "ASEAN-wide CEO + investor audience." },

  // ─── DECEMBER 2026 ───
  { date: "2026-12-03", endDate: "2026-12-05", name: "Cambodia–Japan Business Forum", type: "business", loc: "Phnom Penh + Tokyo (hybrid)", note: "JICA partnership channel." },
  { date: "2026-12-08", endDate: "2026-12-10", name: "Slush Singapore (ASEAN edition)", type: "summit", loc: "Singapore", note: "Founder + investor focused." },
  { date: "2026-12-11", name: "Year-End Tech Founders Mixer", type: "networking", loc: "Phnom Penh · Rosewood", note: "Local startup ecosystem closing event." },
  { date: "2026-12-15", endDate: "2026-12-17", name: "ZGC Forum (Zhongguancun)", type: "ai", loc: "Beijing, China", note: "China's Silicon Valley — Ai + deep-tech." },

  // ─── 2027 PLACEHOLDERS (less dense — refine later) ───
  { date: "2027-01-15", name: "AMCHAM New-Year Business Summit", type: "summit", loc: "Phnom Penh", note: "Annual outlook + bilateral." },
  { date: "2027-01-28", endDate: "2027-01-30", name: "Cambodia Mfg & Industrial Expo", type: "expo", loc: "Phnom Penh · Koh Pich", note: "Cross-vertical." },
  { date: "2027-02-11", name: "Phnom Penh Ai Builders Day", type: "ai", loc: "Phnom Penh · Factory PP", note: "Local engineer recruitment + visibility." },
  { date: "2027-02-25", endDate: "2027-02-26", name: "ASEAN Digital Ministers Meeting", type: "summit", loc: "Phnom Penh", note: "Government-channel max leverage." },
  { date: "2027-03-12", endDate: "2027-03-14", name: "Cambodia Garment & Footwear Expo", type: "expo", loc: "Phnom Penh", note: "Footwear-led sister event." },
  { date: "2027-03-26", name: "EuroCham Cambodia Tech Forum", type: "tech", loc: "Phnom Penh", note: "EU-investor reach." },
  { date: "2027-04-09", name: "Cambodia Startup Demo Day", type: "tech", loc: "Phnom Penh · Impact Hub", note: "Yai showcase." },
  { date: "2027-04-22", endDate: "2027-04-24", name: "Mekong Tech Summit", type: "summit", loc: "Phnom Penh", note: "Multi-country audience." },
  { date: "2027-05-13", name: "GMAC AGM 2027", type: "business", loc: "Phnom Penh", note: "Member-factory AGM — Yai partnership slot." },
  { date: "2027-05-28", endDate: "2027-05-30", name: "Cambodia Tech Week 2027", type: "tech", loc: "Phnom Penh", note: "Annual flagship — booth target." },
  { date: "2027-06-10", name: "Cambodia Ai Conference 2027", type: "ai", loc: "Phnom Penh", note: "Primary local Ai stage." },
  { date: "2027-06-24", endDate: "2027-06-26", name: "ASEAN Industrial Innovation Expo", type: "expo", loc: "Phnom Penh · Diamond Island", note: "Cross-border industrial reach." },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function ymKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function formatDay(iso: string): string {
  // "2026-06-12" → "12 Jun"
  const [_, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTH_NAMES[m - 1].slice(0, 3)}`;
}

function formatRange(start: string, end?: string): string {
  if (!end) return formatDay(start);
  const [_y1, _m1, d1] = start.split("-").map(Number);
  const [_y2, m2, d2] = end.split("-").map(Number);
  if (start.slice(0, 7) === end.slice(0, 7)) {
    // same month
    return `${d1}–${d2} ${MONTH_NAMES[m2 - 1].slice(0, 3)}`;
  }
  return `${formatDay(start)} → ${formatDay(end)}`;
}

// Today base — kept as a constant so SSR / CSR render the same thing.
// Update if you want "today" to move.
const TODAY_YEAR = 2026;
const TODAY_MONTH = 5; // 0-indexed → June
const MAX_OFFSET_MONTHS = 12; // can scroll up to 12 months ahead

function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: total % 12 };
}

export function EventCalendar() {
  const [offset, setOffset] = useState(0);
  const left = addMonths(TODAY_YEAR, TODAY_MONTH, offset);
  const right = addMonths(left.year, left.month, 1);

  const eventsInMonth = (y: number, m: number) =>
    EVENTS.filter((e) => e.date.startsWith(ymKey(y, m)))
      .sort((a, b) => a.date.localeCompare(b.date));

  const canPrev = offset > 0;
  const canNext = offset < MAX_OFFSET_MONTHS;

  const monthLabel = (y: number, m: number) => `${MONTH_NAMES[m]} ${y}`;

  return (
    <div className="rounded-xl border border-yai-border bg-white overflow-hidden">
      {/* Header — month range + nav */}
      <div className="flex items-center justify-between gap-3 p-3 border-b border-yai-border bg-gray-50">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-yai-border bg-white text-yai-navy font-extrabold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 transition"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-gray-500">2-month window</div>
          <div className="text-sm font-extrabold text-yai-navy">
            {monthLabel(left.year, left.month)} – {monthLabel(right.year, right.month)}
          </div>
        </div>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setOffset((o) => Math.min(MAX_OFFSET_MONTHS, o + 1))}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-yai-border bg-white text-yai-navy font-extrabold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-50 transition"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 border-b border-yai-border text-[10px]">
        <span className="uppercase tracking-wider font-extrabold text-gray-500 mr-1">Types:</span>
        {(Object.keys(TYPE_VIS) as EventType[]).map((k) => {
          const t = TYPE_VIS[k];
          return (
            <span key={k} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: t.bg }}
              />
              <span className="text-gray-700">{t.label}</span>
            </span>
          );
        })}
      </div>

      {/* Combined 2-month grid — 3 events per row to use space tightly */}
      <div className="p-3 space-y-4">
        {[left, right].map(({ year, month }) => {
          const events = eventsInMonth(year, month);
          return (
            <div key={`${year}-${month}`}>
              <div className="flex items-baseline justify-between mb-2 border-b border-yai-border pb-1">
                <h5 className="font-extrabold text-yai-navy text-sm">
                  {monthLabel(year, month)}
                </h5>
                <span className="text-[10px] uppercase tracking-wider text-gray-400">
                  {events.length} event{events.length === 1 ? "" : "s"}
                </span>
              </div>
              {events.length === 0 ? (
                <div className="text-xs text-gray-400 italic py-3 text-center">
                  No events listed yet for this month.
                </div>
              ) : (
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {events.map((e, i) => {
                    const t = TYPE_VIS[e.type];
                    return (
                      <li
                        key={`${e.date}-${i}`}
                        className="rounded-lg border border-yai-border bg-white hover:bg-blue-50/30 transition p-2.5"
                        style={{ borderLeftWidth: 3, borderLeftColor: t.bg }}
                      >
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span
                            className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                            style={{ background: t.bg, color: t.color }}
                          >
                            {t.label}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider tabular-nums" style={{ color: t.bg }}>
                            {formatRange(e.date, e.endDate)}
                          </span>
                        </div>
                        <div className="text-[12px] font-bold text-yai-navy leading-tight break-words">{e.name}</div>
                        <div className="text-[10px] text-gray-500 italic mt-0.5">{e.loc}</div>
                        {e.note && <div className="text-[10px] text-gray-600 leading-snug mt-1">{e.note}</div>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-yai-border bg-gray-50 text-[10px] text-gray-500 text-center">
        Use the arrows to scroll up to {MAX_OFFSET_MONTHS} months ahead. Dates are placeholders —
        confirm via organiser before committing.
      </div>
    </div>
  );
}
