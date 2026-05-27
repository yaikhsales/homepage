"use client";

import { motion } from "framer-motion";

const STAGES = [
  {
    num: "Stage 1",
    name: "Digital",
    blurb: "Click-based interface that replaces paper. Basic Ai assists with data entry and reporting. Low-cost entry point — immediate, tangible wins.",
    bullets: ["Paper-to-digital workflows", "Standard reports + dashboards", "Ai helper for data capture"],
  },
  {
    num: "Stage 2",
    name: "Agentic",
    blurb: "Chat-driven workflows. Ai agents own end-to-end processes — payroll runs, audit prep, compliance reports — with supervisors approving rather than building.",
    bullets: ["Conversational interface", "Autonomous workflow execution", "Trilingual chat (EN/ZH/KH)"],
    highlight: true,
  },
  {
    num: "Stage 3",
    name: "Big Rollout",
    blurb: "Dedicated infrastructure, AIoT integration, multi-site deployment, head-office consolidation. The full stack for groups operating 3+ factories.",
    bullets: ["Dedicated cloud / on-prem", "AIoT sensors + edge devices", "HQ-to-site consolidation"],
  },
];

export function StageLadder() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {STAGES.map((s, i) => (
        <motion.div
          key={s.num}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          whileHover={{ y: -4 }}
          className={`p-7 rounded-2xl bg-white relative h-full ${
            s.highlight
              ? "border-2 border-yai-blue shadow-blue-glow"
              : "border-2 border-yai-border"
          }`}
        >
          <div className="text-[11px] font-bold text-yai-blue uppercase tracking-[0.12em] mb-2">
            {s.num}
          </div>
          <h3 className="text-2xl font-extrabold text-yai-navy mb-3">{s.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{s.blurb}</p>
          <ul className="text-xs text-gray-500 space-y-1.5">
            {s.bullets.map((b) => (
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
