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
type Country = "kh" | "cn" | "hk" | "mo" | "sg" | "ph" | "jp" | "id" | "th" | "vn" | "my";

type Event = {
  date: string;        // ISO "YYYY-MM-DD"
  endDate?: string;    // optional multi-day end
  name: string;
  type: EventType;
  country: Country;
  loc: string;
  note?: string;       // short relevance note
  url?: string;        // optional official event URL — renders as clickable link
};

const COUNTRY_FLAG: Record<Country, string> = {
  kh: "🇰🇭",
  cn: "🇨🇳",
  hk: "🇭🇰",
  mo: "🇲🇴",
  sg: "🇸🇬",
  ph: "🇵🇭",
  jp: "🇯🇵",
  id: "🇮🇩",
  th: "🇹🇭",
  vn: "🇻🇳",
  my: "🇲🇾",
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
  { date: "2026-06-03", endDate: "2026-06-05", name: "Asia Tech x Singapore (ATxSG)", type: "tech", country: "sg", loc: "Singapore · Capella Sentosa", note: "Premier ASEAN tech summit — IMDA-anchored.", url: "https://asiatechxsg.com" },
  { date: "2026-06-12", name: "Cambodia ICT & Digital Forum (CamIDF)", type: "tech", country: "kh", loc: "Phnom Penh", note: "Multi-stakeholder platform — digital gov, biz, citizenship.", url: "https://www.camidf.com" },
  { date: "2026-06-17", endDate: "2026-06-19", name: "Vietnam International Tech Expo", type: "tech", country: "vn", loc: "Hanoi · NCC", note: "Vietnam's flagship ICT expo.", url: "https://www.vietnamtechexpo.com" },
  { date: "2026-06-18", name: "GMAC Member Meeting", type: "business", country: "kh", loc: "Phnom Penh", note: "Garment association — channel to mid-size factories.", url: "https://www.gmac-cambodia.org" },
  { date: "2026-06-25", endDate: "2026-06-26", name: "CamTech Summit", type: "tech", country: "kh", loc: "Phnom Penh · Koh Pich", note: "CAFT-organised flagship — fintech, digital banking, regional tech.", url: "https://camtechsummit.com" },

  // ─── JULY 2026 ───
  { date: "2026-07-04", endDate: "2026-07-07", name: "WAIC · World Ai Conference", type: "ai", country: "cn", loc: "Shanghai, China", note: "Flagship Ai event in China — must-visit.", url: "https://www.worldaic.com.cn" },
  { date: "2026-07-08", endDate: "2026-07-10", name: "Singapore Ai Week (SGAIW)", type: "ai", country: "sg", loc: "Singapore · Marina Bay Sands", note: "AI Singapore flagship — region's top Ai conference.", url: "https://aisingapore.org/singapore-ai-week" },
  { date: "2026-07-09", name: "AMCHAM Cambodia Mixer", type: "networking", country: "kh", loc: "Phnom Penh", note: "Monthly chamber networking.", url: "https://www.amchamcambodia.net" },
  { date: "2026-07-14", endDate: "2026-07-15", name: "MyAI Conference (Malaysia AI)", type: "ai", country: "my", loc: "Kuala Lumpur · KLCC", note: "Malaysia's national-level Ai gathering.", url: "https://www.malaysia-ai.org" },
  { date: "2026-07-16", endDate: "2026-07-17", name: "Cambodia Ai & Cloud Summit", type: "ai", country: "kh", loc: "Phnom Penh · Sofitel", note: "Direct positioning — attend / speak." },
  { date: "2026-07-23", name: "EuroCham Digital & Tech Committee Afterwork", type: "networking", country: "kh", loc: "Phnom Penh", note: "Recurring EuroCham Cambodia event — regulatory + tech development.", url: "https://www.eurocham-cambodia.org" },
  { date: "2026-07-28", endDate: "2026-07-30", name: "Smart China Expo", type: "expo", country: "cn", loc: "Chongqing / Guangdong corridor", note: "Smart-mfg + AIoT, factory-relevant.", url: "http://www.smartchinaexpo.com" },

  // ─── AUGUST 2026 ───
  { date: "2026-08-06", name: "ASEAN SME Digital Innovation Forum", type: "summit", country: "kh", loc: "Siem Reap, Cambodia", note: "ASEAN-wide SME audience." },
  { date: "2026-08-12", endDate: "2026-08-14", name: "Vietnam ICT Summit", type: "summit", country: "vn", loc: "Hanoi · Melia", note: "Government-anchored ICT direction-setter.", url: "https://vietnamictsummit.vn" },
  { date: "2026-08-14", endDate: "2026-08-16", name: "Cambodia Garment Mfg Expo", type: "expo", country: "kh", loc: "Phnom Penh · Koh Pich", note: "Direct factory-owner audience.", url: "https://www.cambodiamanufacturingexpo.com" },
  { date: "2026-08-19", endDate: "2026-08-23", name: "World Robot Conference", type: "ai", country: "cn", loc: "Beijing, China", note: "Major robotics + AIoT showcase.", url: "http://www.worldrobotconference.com" },
  { date: "2026-08-26", endDate: "2026-08-28", name: "Malaysia Tech Month / KL Converge", type: "tech", country: "my", loc: "Kuala Lumpur · KLCC", note: "MDEC-anchored, ASEAN-wide draw.", url: "https://mdec.my" },
  { date: "2026-08-27", name: "TAFTAC Member Roundtable", type: "business", country: "kh", loc: "Phnom Penh", note: "Footwear / travel-goods association.", url: "https://www.taftac.org.kh" },

  // ─── SEPTEMBER 2026 ───
  { date: "2026-09-02", endDate: "2026-09-04", name: "Saigon Tech Summit", type: "tech", country: "vn", loc: "Ho Chi Minh City", note: "Vietnam's largest tech-investor stage." },
  { date: "2026-09-04", endDate: "2026-09-06", name: "ASEAN Tech Summit (Cambodia)", type: "summit", country: "kh", loc: "Phnom Penh · Peace Palace", note: "Minister-tasked appearance — primary stage." },
  { date: "2026-09-10", endDate: "2026-09-12", name: "Inclusion Conference (Ant Group)", type: "ai", country: "cn", loc: "Shanghai, China", note: "Fintech + Ai for inclusion — payment-rail angle.", url: "https://www.inclusionconf.com" },
  { date: "2026-09-15", endDate: "2026-09-17", name: "SuperReturn Asia", type: "business", country: "sg", loc: "Singapore", note: "Top PE / VC summit in Asia — fundraising leverage.", url: "https://informaconnect.com/superreturn-asia" },
  { date: "2026-09-17", name: "GMAC + ILO Better Work Forum", type: "business", country: "kh", loc: "Phnom Penh", note: "Compliance + worker-voice positioning.", url: "https://betterwork.org/where-we-work/cambodia" },
  { date: "2026-09-23", endDate: "2026-09-25", name: "Singapore FinTech Festival / SWITCH", type: "summit", country: "sg", loc: "Singapore · Expo & MBS", note: "ASEAN-wide investor + tech audience.", url: "https://www.fintechfestival.sg" },

  // ─── OCTOBER 2026 ───
  { date: "2026-10-08", endDate: "2026-10-10", name: "Cambodia ICT Awards", type: "tech", country: "kh", loc: "Phnom Penh", note: "National recognition — Yai submission target.", url: "https://www.ictawards.org.kh" },
  { date: "2026-10-13", endDate: "2026-10-15", name: "Tech in Asia Conference Singapore", type: "tech", country: "sg", loc: "Singapore", note: "Regional founder + investor conference.", url: "https://www.techinasia.com/conference" },
  { date: "2026-10-15", endDate: "2026-10-19", name: "Canton Fair (Phase 1)", type: "expo", country: "cn", loc: "Guangzhou, China", note: "World's largest trade fair — manufacturing buyer reach.", url: "https://www.cantonfair.org.cn" },
  { date: "2026-10-20", endDate: "2026-10-22", name: "Vietnam Manufacturing Expo", type: "expo", country: "vn", loc: "Hanoi · ICE Hanoi", note: "Industrial / factory-owner reach in Vietnam.", url: "https://www.vietnammanufacturingexpo.com" },
  { date: "2026-10-17", endDate: "2026-10-18", name: "Cambodia ICT Camp", type: "tech", country: "kh", loc: "Phnom Penh", note: "Bi-annual collaborative camp — cybersecurity, Ai, open data.", url: "https://www.facebook.com/CambodiaICTCamp" },
  { date: "2026-10-22", name: "Phnom Penh AIoT Meetup", type: "ai", country: "kh", loc: "Phnom Penh · Factory PP", note: "Developer-community visibility.", url: "https://factory.fm" },
  { date: "2026-10-27", endDate: "2026-10-29", name: "Hong Kong FinTech Week", type: "summit", country: "hk", loc: "Hong Kong", note: "Greater Bay Area Ai + fintech, China-adjacent.", url: "https://www.fintechweek.hk" },

  // ─── NOVEMBER 2026 ───
  { date: "2026-11-05", endDate: "2026-11-07", name: "Mekong Investment Forum", type: "business", country: "kh", loc: "Phnom Penh", note: "FDI + investment-track presence." },
  { date: "2026-11-10", endDate: "2026-11-12", name: "AICon · Ai Industry Conference", type: "ai", country: "cn", loc: "Beijing, China", note: "Top-tier enterprise-Ai conference.", url: "https://aicon.infoq.cn" },
  { date: "2026-11-12", endDate: "2026-11-14", name: "Malaysia Ai Summit", type: "ai", country: "my", loc: "Kuala Lumpur", note: "Malaysia's enterprise-Ai stage." },
  { date: "2026-11-15", endDate: "2026-11-17", name: "China Hi-Tech Fair", type: "expo", country: "cn", loc: "Shenzhen, Guangdong", note: "China's largest tech expo — Ai + hardware.", url: "http://www.chtf.com" },
  { date: "2026-11-13", name: "National STI Day (MISTI)", type: "tech", country: "kh", loc: "Phnom Penh · Koh Pich Convention Centre", note: "MISTI ministry-hosted · ~200 booths · startups + SMEs + Industry 4.0.", url: "https://misti.gov.kh" },
  { date: "2026-11-19", name: "Cambodia Smart City Summit", type: "summit", country: "kh", loc: "Phnom Penh · NCDD", note: "Ministry of Telecom / Digital Gov angle." },
  { date: "2026-11-21", name: "Cambodia Tech Forum", type: "tech", country: "kh", loc: "Phnom Penh", note: "Annual networking + exhibition for digital pros, founders, devs.", url: "https://www.startupcambodia.gov.kh" },
  { date: "2026-11-25", endDate: "2026-11-27", name: "ASEAN Business & Investment Summit", type: "summit", country: "ph", loc: "Manila, Philippines", note: "ASEAN-wide CEO + investor audience.", url: "https://www.asean-bac.org" },

  // ─── DECEMBER 2026 ───
  { date: "2026-12-02", endDate: "2026-12-04", name: "Vietnam Web Summit / Tech Founders Forum", type: "tech", country: "vn", loc: "Ho Chi Minh City", note: "Founder-community Vietnam edition." },
  { date: "2026-12-03", endDate: "2026-12-05", name: "Cambodia–Japan Business Forum", type: "business", country: "kh", loc: "Phnom Penh + Tokyo (hybrid)", note: "JICA partnership channel.", url: "https://www.jica.go.jp/cambodia" },
  { date: "2026-12-08", endDate: "2026-12-10", name: "Slush Singapore (ASEAN edition)", type: "summit", country: "sg", loc: "Singapore", note: "Founder + investor focused.", url: "https://www.slush.org" },
  { date: "2026-12-11", name: "Year-End Tech Founders Mixer", type: "networking", country: "kh", loc: "Phnom Penh · Rosewood", note: "Local startup ecosystem closing event." },
  { date: "2026-12-15", endDate: "2026-12-17", name: "ZGC Forum (Zhongguancun)", type: "ai", country: "cn", loc: "Beijing, China", note: "China's Silicon Valley — Ai + deep-tech.", url: "https://www.zgcforum.com" },

  // ─── 2027 PLACEHOLDERS (less dense — refine later) ───
  { date: "2027-01-15", name: "AMCHAM New-Year Business Summit", type: "summit", country: "kh", loc: "Phnom Penh", note: "Annual outlook + bilateral." },
  { date: "2027-01-28", endDate: "2027-01-30", name: "Cambodia Mfg & Industrial Expo", type: "expo", country: "kh", loc: "Phnom Penh · Koh Pich", note: "Cross-vertical." },
  { date: "2027-02-11", name: "Phnom Penh Ai Builders Day", type: "ai", country: "kh", loc: "Phnom Penh · Factory PP", note: "Local engineer recruitment + visibility." },
  { date: "2027-02-25", endDate: "2027-02-26", name: "ASEAN Digital Ministers Meeting", type: "summit", country: "kh", loc: "Phnom Penh", note: "Government-channel max leverage." },
  { date: "2027-03-12", endDate: "2027-03-14", name: "Cambodia Garment & Footwear Expo", type: "expo", country: "kh", loc: "Phnom Penh", note: "Footwear-led sister event." },
  { date: "2027-03-26", name: "EuroCham Cambodia Tech Forum", type: "tech", country: "kh", loc: "Phnom Penh", note: "EU-investor reach." },
  { date: "2027-04-09", name: "Cambodia Startup Demo Day", type: "tech", country: "kh", loc: "Phnom Penh · Impact Hub", note: "Yai showcase." },
  { date: "2027-04-22", endDate: "2027-04-24", name: "Mekong Tech Summit", type: "summit", country: "kh", loc: "Phnom Penh", note: "Multi-country audience." },
    { date: "2027-05-13", name: "GMAC AGM 2027", type: "business", country: "kh", loc: "Phnom Penh", note: "Member-factory AGM — Yai partnership slot." },
  { date: "2027-05-26", endDate: "2027-05-29", name: "BEYOND Expo 2027", type: "expo", country: "mo", loc: "Macao · The Venetian Macao Cotai Expo", note: "Asia-Pacific tech expo — 'Empowering Asia' theme. Annual.", url: "https://www.beyondexpo.com" },
  { date: "2027-06-24", endDate: "2027-06-25", name: "CamTech Summit 2027", type: "tech", country: "kh", loc: "Phnom Penh · Koh Pich", note: "Annual CAFT flagship — fintech + regional tech.", url: "https://camtechsummit.com" },
  { date: "2027-06-10", name: "Cambodia Ai Conference 2027", type: "ai", country: "kh", loc: "Phnom Penh", note: "Primary local Ai stage." },
  { date: "2027-06-24", endDate: "2027-06-26", name: "ASEAN Industrial Innovation Expo", type: "expo", country: "kh", loc: "Phnom Penh · Diamond Island", note: "Cross-border industrial reach." },
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
                        <div className="text-[12px] font-bold leading-tight break-words">
                          <span className="mr-1 text-[14px] leading-none align-middle" aria-label={e.country}>{COUNTRY_FLAG[e.country]}</span>
                          {e.url ? (
                            <a
                              href={e.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yai-blue hover:underline inline-flex items-baseline gap-1"
                            >
                              {e.name}
                              <span className="text-[10px] opacity-60" aria-hidden>↗</span>
                            </a>
                          ) : (
                            <span className="text-yai-navy">{e.name}</span>
                          )}
                        </div>
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
