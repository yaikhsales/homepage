"use client";

import { motion } from "framer-motion";

type Layer = {
  num: string;
  name: string;
  subtitle: string;
  blurb: string;
  bullets: string[];
  variant: "before" | "platform" | "highlight";
};

const LAYERS: Layer[] = [
  {
    num: "Layer 1",
    name: "Traditional Factory Work",
    subtitle: "Disconnected & manual — what we replace",
    blurb:
      "The starting point most garment factories are stuck in. Yai doesn't deliver this layer — it replaces it.",
    bullets: [
      "Paper reports & ledger books, manual signatures",
      "Scattered chat apps, calls and pushes by chat",
      "Staff running floor-to-floor chasing approvals",
      "&ldquo;Where is the approval?&rdquo;, files sent by chat",
    ],
    variant: "before",
  },
  {
    num: "Layer 2",
    name: "Digitalization",
    subtitle: "Centralised data",
    blurb:
      "Excel dashboards and digital records flow into one database. The foundation for everything above.",
    bullets: [
      "Digital records, one source of truth",
      "Barcode &amp; QR scanners, AIoT sensors",
      "Mobile apps &amp; tablets for floor staff",
      "Initial workflow streamlining",
    ],
    variant: "platform",
  },
  {
    num: "Layer 3",
    name: "Agentic",
    subtitle: "LLM-powered intelligent agents",
    blurb:
      "Workflows refined by Ai agents. Voice, text, dashboards and digital-twin visualisation on every device.",
    bullets: [
      "Voice-to-workflow processing",
      "Text instructions interpreted by LLM",
      "Intuitive dashboards &amp; DTV (Digital Twin)",
      "Real-time Ai guidance for staff",
      "Geolocation &amp; logistics optimisation",
    ],
    variant: "highlight",
  },
  {
    num: "Layer 4",
    name: "Full Ai",
    subtitle: "Strategic management &amp; growth",
    blurb:
      "The executive layer. Senior management decisions, multi-factory control, expansion to new countries.",
    bullets: [
      "Higher-level management decision-making",
      "Strategic planning with Ai insights",
      "Multi-factory management",
      "Predictive business growth",
      "Business expansion &amp; global growth",
    ],
    variant: "platform",
  },
];

function cardClasses(v: Layer["variant"]) {
  switch (v) {
    case "before":
      return "border-2 border-dashed border-gray-300 bg-gray-50";
    case "highlight":
      return "border-2 border-yai-blue shadow-blue-glow bg-white";
    default:
      return "border-2 border-yai-border bg-white";
  }
}

function badgeClasses(v: Layer["variant"]) {
  switch (v) {
    case "before":
      return "text-gray-500";
    default:
      return "text-yai-blue";
  }
}

function titleClasses(v: Layer["variant"]) {
  switch (v) {
    case "before":
      return "text-gray-600";
    default:
      return "text-yai-navy";
  }
}

export function StageLadder() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {LAYERS.map((l, i) => (
        <motion.div
          key={l.num}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, delay: i * 0.12 }}
          whileHover={l.variant === "before" ? undefined : { y: -4 }}
          className={`p-6 rounded-2xl relative h-full ${cardClasses(l.variant)}`}
        >
          <div className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-1 ${badgeClasses(l.variant)}`}>
            {l.num}
          </div>
          <h3 className={`text-xl font-extrabold mb-1 ${titleClasses(l.variant)}`}>
            {l.name}
          </h3>
          <p className="text-[11px] text-gray-500 italic mb-3" dangerouslySetInnerHTML={{ __html: l.subtitle }} />
          <p className={`text-sm leading-relaxed mb-3 ${l.variant === "before" ? "text-gray-500" : "text-gray-600"}`}>
            {l.blurb}
          </p>
          <ul className="text-xs text-gray-500 space-y-1.5">
            {l.bullets.map((b, j) => (
              <li key={j} className="flex gap-2">
                <span className={l.variant === "before" ? "text-gray-400" : "text-yai-blue"}>▸</span>
                <span dangerouslySetInnerHTML={{ __html: b }} />
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
