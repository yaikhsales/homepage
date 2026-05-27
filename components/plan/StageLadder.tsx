"use client";

import { motion } from "framer-motion";

const LAYERS = [
  {
    num: "Layer 1",
    name: "Digitalization",
    blurb:
      "Converts paper, chat, email and Excel work into one uniform digital workplace. The foundation everything else sits on.",
    bullets: [
      "Every approval, record, signature in one system",
      "Replaces paper, ledger books, scattered chat apps",
      "One source of truth for the whole factory",
    ],
  },
  {
    num: "Layer 2",
    name: "Agentic",
    blurb:
      "Refines workflows with LLMs, voice and text, dashboards, factory-floor DTV, AIoT, mobile and tablet apps. Staff and workers get easier, faster, more accurate operations.",
    bullets: [
      "LLM + voice + text agents own workflows",
      "Dashboards, factory-floor DTV, AIoT devices",
      "Mobile and tablet apps for every role",
    ],
    highlight: true,
  },
  {
    num: "Layer 3",
    name: "Full Ai",
    blurb:
      "The executive layer for senior management — strategic planning, controls, growth modelling. Manage one factory, expand to a second, then a second country, on the same agentic foundation.",
    bullets: [
      "Multi-site management + controls",
      "Strategic planning and growth modelling",
      "Multi-country expansion on one platform",
    ],
  },
];

export function StageLadder() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {LAYERS.map((l, i) => (
        <motion.div
          key={l.num}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          whileHover={{ y: -4 }}
          className={`p-7 rounded-2xl bg-white relative h-full ${
            l.highlight
              ? "border-2 border-yai-blue shadow-blue-glow"
              : "border-2 border-yai-border"
          }`}
        >
          <div className="text-[11px] font-bold text-yai-blue uppercase tracking-[0.12em] mb-2">
            {l.num}
          </div>
          <h3 className="text-2xl font-extrabold text-yai-navy mb-3">{l.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{l.blurb}</p>
          <ul className="text-xs text-gray-500 space-y-1.5">
            {l.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-yai-blue">▸</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
