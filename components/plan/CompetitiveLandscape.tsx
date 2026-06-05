"use client";

import { useState } from "react";

/**
 * Competitive landscape for Section 14.
 * 6 tiers of competitors + Yai's defensive moats + the "honest reality check"
 * (status quo / paper / Excel is the real opponent in 90% of sales conversations).
 */

type Competitor = {
  name: string;
  strengths: string;
  weakness: string;
  price?: string;
  region?: string;
};

type Tier = {
  key: string;
  label: string;
  short: string;
  color: string;
  bg: string;
  intro: string;
  advantage: string;
  competitors: Competitor[];
};

const TIERS: Tier[] = [
  {
    key: "ai-new",
    label: "Ai-First Newcomers (Emerging Threat)",
    short: "Ai-first newcomers",
    color: "#7C3AED",
    bg: "#EDE9FE",
    intro: "Younger Ai-augmented SaaS — most aren't apparel-specific. Watch them, don't fear them. The category that matters most to us.",
    advantage:
      "Yai is built specifically for apparel manufacturing — not retrofitting generic Ai onto manufacturing afterwards.",
    competitors: [
      { name: "Inspectorio",            strengths: "Quality + compliance SaaS, Ai-augmented", weakness: "Strong in compliance, weak in production", region: "Threat: Medium" },
      { name: "Sourcemap",              strengths: "Supply-chain transparency, Ai features",  weakness: "Different segment",                          region: "Threat: Low" },
      { name: "Foundation Ai startups", strengths: "Generic Ai-for-manufacturing plays",      weakness: "Mostly early, not apparel-specific",         region: "Threat: Medium" },
    ],
  },
  {
    key: "diy",
    label: "Internal / DIY (Hidden Competitor)",
    short: "DIY internal",
    color: "#4B5563",
    bg: "#F3F4F6",
    intro: "Large garment groups build internal IT systems. The biggest real-world competitor in Cambodia — not other vendors.",
    advantage:
      "They spend $500K–$2M building internal systems that take 3–5 years and never reach Ai parity. Yai = finished, Ai-native platform for $25K–$80K / yr. The math wins.",
    competitors: [
      { name: "Internal IT teams at large groups", strengths: "Total control, sunk-cost commitment", weakness: "$500K–$2M to build · 3–5 yr timeline · never reach Ai parity", region: "Cambodia + region" },
    ],
  },
  {
    key: "regional",
    label: "Tier 1 · Regional Players",
    short: "Regional",
    color: "#15803D",
    bg: "#DCFCE7",
    intro: "Local players in SE-Asia and China. None own the Cambodia regulatory + language moat.",
    advantage:
      "The only Ai-native, apparel-specific, trilingual platform in Cambodia. Owns the local language + local regulatory integration moat (E-Gov, E-Invoice / CamInv, GDT, ABA, Wing).",
    competitors: [
      { name: "MISA / FAST",              strengths: "Vietnam ERP brand",      weakness: "Vietnam-centric, no Ai, no Khmer",         region: "Vietnam" },
      { name: "KiotViet",                 strengths: "SE-Asia retail SaaS",    weakness: "Retail focus, not manufacturing",          region: "SE-Asia" },
      { name: "Sage (SG / HK partners)",  strengths: "SE-Asia accounting",     weakness: "Generic, accounting-focused, no MES",      region: "SE-Asia" },
      { name: "Local Cambodian ERPs",     strengths: "Local presence",         weakness: "Small scale, no Ai, no production depth",  region: "Cambodia" },
      { name: "Chinese factory ERPs (Inspur, Yonyou)", strengths: "China-scale", weakness: "Chinese-only UI, not export-friendly",   region: "China" },
    ],
  },
  {
    key: "apparel",
    label: "Tier 2 · Apparel-Specific Vertical",
    short: "Apparel-vertical",
    color: "#C2410C",
    bg: "#FFEDD5",
    intro: "The closest competitors by category. Each owns ONE module — none own the full stack.",
    advantage:
      "Integrated MES + ERP + Ai agents in one platform. They are modular point solutions; Yai is the full stack — plus AIoT, edge compute, trilingual UI none have.",
    competitors: [
      { name: "Centric PLM",                strengths: "Strong product lifecycle, brand customers", weakness: "PLM only, no MES/ERP, no Ai agents",            price: "$50K – $150K" },
      { name: "Coats Digital (FastReact + GSDCost)", strengths: "Industry-standard planning + SMV", weakness: "Modular, not integrated, no agentic Ai, expensive", price: "$40K – $120K" },
      { name: "Bluecherry (CGS)",           strengths: "Apparel-specific ERP",          weakness: "Outdated UI, no Ai, weak mobile",                          price: "$30K – $80K"  },
      { name: "A2000 / Datatex",            strengths: "Established apparel ERP",       weakness: "Legacy tech, no Ai, limited mobile",                       price: "$25K – $70K"  },
      { name: "WFX",                        strengths: "Fashion-focused, cloud",        weakness: "Generic, no production agents",                            price: "$20K – $60K"  },
    ],
  },
  {
    key: "midmarket",
    label: "Tier 3 · Generic Mid-Market ERP",
    short: "Generic mid-mkt",
    color: "#B45309",
    bg: "#FEF3C7",
    intro: "Cheap and broad — but generic. They sell a toolkit; we sell a finished factory solution.",
    advantage:
      "Out-of-the-box apparel intelligence. They sell you a toolkit; we sell a finished factory solution — no customisation tax.",
    competitors: [
      { name: "Odoo",            strengths: "Cheap, open-source, modular", weakness: "Not apparel-specific, no Ai agents, needs heavy customisation", price: "$7K – $30K"  },
      { name: "SAP Business One", strengths: "SAP brand, mid-market",       weakness: "Generic, costly implementation, no Ai",                          price: "$30K – $80K" },
      { name: "Zoho One",        strengths: "Cheap, broad suite",           weakness: "Not industrial, no MES, no apparel logic",                       price: "$5K – $20K"  },
      { name: "Acumatica",       strengths: "Cloud-native, flexible",       weakness: "Generic, requires apparel customisation",                        price: "$25K – $60K" },
    ],
  },
  {
    key: "global",
    label: "Tier 4 · Global Enterprise ERP",
    short: "Global ERP",
    color: "#B91C1C",
    bg: "#FEE2E2",
    intro: "The biggest names. Heavy, expensive, slow — designed for billion-dollar groups. Least relevant to us today.",
    advantage:
      "Ai-native from day one · apparel-specific · trilingual (Khmer / Chinese / English) · 1/5 the price · mobile-first · factory-proven.",
    competitors: [
      { name: "SAP for Apparel",        strengths: "Brand, deep features, global support",  weakness: "Expensive, slow to deploy, not Ai-native, no Khmer support", price: "$80K – $200K+" },
      { name: "Oracle NetSuite",        strengths: "Strong financials, cloud-native",       weakness: "Generic, not apparel-specific, no production depth",         price: "$50K – $150K"  },
      { name: "Microsoft Dynamics 365", strengths: "Office integration, ecosystem",         weakness: "Generic, requires heavy customisation for apparel",          price: "$40K – $120K"  },
    ],
  },
];

type Moat = { num: string; title: string; detail: string };
const MOATS: Moat[] = [
  { num: "01", title: "Cambodia regulatory integration", detail: "E-Gov · E-Invoice (CamInv) · GDT · ABA · Wing banking. None of the global players have this." },
  { num: "02", title: "Khmer language", detail: "Full UI + agentic conversation in Khmer. Massive barrier for foreign vendors." },
  { num: "03", title: "Capital efficiency", detail: "$360K total build cost gives a permanent pricing structure no Western competitor can match." },
  { num: "04", title: "Partnership stack", detail: "Anthropic + Google Cloud + JICA = international credibility no local competitor has." },
  { num: "05", title: "Edge hardware roadmap", detail: "Own-assembled solar-powered mini-PC + 5G + internal WiFi is genuinely unique. No software-only competitor can offer this." },
  { num: "06", title: "17-module breadth + Ai agentic layer", detail: "Integrated stack is hard to replicate quickly — each module reinforces the others." },
  { num: "07", title: "2 production factories live + Cambodia distribution", detail: "First-mover advantage in the local market. Real evidence, not pitch deck." },
];

const WINS = [
  { vs: "SAP / Oracle",        line: "1/5 the price · Ai-native · deployable in weeks not years" },
  { vs: "Centric / Coats",     line: "Integrated platform, not point solution · agentic Ai · trilingual" },
  { vs: "Odoo / Zoho",         line: "Built for apparel out of the box · Ai agents included · no customisation tax" },
  { vs: "Regional players",    line: "Only Ai-native trilingual option · owns Cambodia regulatory stack" },
  { vs: "DIY internal builds", line: "10× faster deployment · 1/10 the cost · modern Ai architecture" },
];

export function CompetitiveLandscape() {
  const [activeTier, setActiveTier] = useState<string>(TIERS[0].key);
  const tier = TIERS.find((t) => t.key === activeTier) ?? TIERS[0];

  return (
    <div className="space-y-6">
      {/* Honest reality-check banner — most important framing */}
      <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-500 text-white font-extrabold text-base shrink-0">
            !
          </span>
          <div className="flex-1">
            <div className="font-extrabold text-yai-navy text-sm leading-tight mb-1">
              Honest reality check — the real competitor is the status quo
            </div>
            <p className="text-[12px] text-amber-900 leading-snug">
              In 90% of Cambodian factory sales conversations, the decision is{" "}
              <strong>&ldquo;keep using paper / spreadsheets / 10-year-old legacy&rdquo;</strong>{" "}
              vs <strong>&ldquo;try something new&rdquo;</strong> — not SAP vs Yai. Win against the
              status quo first, then outmaneuver SAP regionally. The vendor matrix below matters
              for international expansion and investor narrative, not for week-1 deals on the floor.
            </p>
          </div>
        </div>
      </div>

      {/* Tier selector */}
      <div className="flex flex-wrap gap-1 border-b border-yai-border">
        {TIERS.map((t) => {
          const isActive = activeTier === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTier(t.key)}
              className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-2 transition-all ${
                isActive
                  ? "text-yai-navy border-b-2 -mb-px"
                  : "text-gray-500 hover:text-yai-navy"
              }`}
              style={isActive ? { borderBottomColor: t.color } : {}}
            >
              {t.short}
            </button>
          );
        })}
      </div>

      {/* Active tier — competitor table */}
      <div>
        <div className="rounded-lg p-3 mb-3" style={{ background: tier.bg }}>
          <div className="font-extrabold text-yai-navy text-sm">{tier.label}</div>
          <div className="text-[11px] text-gray-700 leading-snug mt-1">{tier.intro}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="text-white" style={{ background: tier.color }}>
                <th className="text-left px-2 py-1.5 font-bold uppercase tracking-wider">Competitor</th>
                <th className="text-left px-2 py-1.5 font-bold uppercase tracking-wider">Strengths</th>
                <th className="text-left px-2 py-1.5 font-bold uppercase tracking-wider">Weaknesses vs Yai</th>
                <th className="text-right px-2 py-1.5 font-bold uppercase tracking-wider w-32">{tier.competitors[0]?.price ? "Price / yr" : "Region"}</th>
              </tr>
            </thead>
            <tbody>
              {tier.competitors.map((c) => (
                <tr key={c.name} className="border-b border-yai-border hover:bg-blue-50/30">
                  <td className="px-2 py-2 font-extrabold text-yai-navy">{c.name}</td>
                  <td className="px-2 py-2 text-gray-700 leading-snug">{c.strengths}</td>
                  <td className="px-2 py-2 text-gray-700 leading-snug">{c.weakness}</td>
                  <td className="px-2 py-2 text-right font-semibold tabular-nums" style={{ color: tier.color }}>
                    {c.price ?? c.region ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="mt-3 rounded-lg p-3 border-l-4"
          style={{ background: `${tier.color}10`, borderLeftColor: tier.color }}
        >
          <div className="text-[10px] uppercase tracking-wider font-extrabold mb-1" style={{ color: tier.color }}>
            Yai advantage in this tier
          </div>
          <div className="text-[12px] text-yai-navy leading-snug">{tier.advantage}</div>
        </div>
      </div>

      {/* Where Yai wins — one-line per segment */}
      <div>
        <h5 className="font-extrabold text-yai-navy text-sm mb-2">
          Where Yai wins — one line per segment
        </h5>
        <ul className="space-y-2">
          {WINS.map((w) => (
            <li key={w.vs} className="flex items-center gap-4 text-base py-2.5 border-b border-yai-border last:border-b-0">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yai-blue text-white font-extrabold text-sm shrink-0">
                ✓
              </span>
              <span className="font-extrabold text-yai-navy text-lg w-52 shrink-0">vs {w.vs}</span>
              <span className="text-gray-700 leading-snug text-base">{w.line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Defensive moats — 7 items */}
      <div>
        <h5 className="font-extrabold text-yai-navy text-sm mb-2">
          Defensive moats — what&rsquo;s hard to copy
        </h5>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {MOATS.map((m) => (
            <li
              key={m.num}
              className="rounded-lg border border-yai-border bg-white p-3"
              style={{ borderLeftWidth: 3, borderLeftColor: "#1E4DAA" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yai-blue text-white font-extrabold text-[11px] shrink-0">
                  {m.num}
                </span>
                <div className="text-[12px] font-extrabold text-yai-navy leading-tight">{m.title}</div>
              </div>
              <div className="text-[11px] text-gray-600 leading-snug">{m.detail}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
