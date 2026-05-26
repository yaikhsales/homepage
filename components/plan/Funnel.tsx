"use client";

import { motion } from "framer-motion";

const STEPS = [
  { label: "Universe — garment factories in Cambodia", value: "2,650", width: 100 },
  { label: "Tier-A targets (500–3,000 workers)",        value: "200–400", width: 88 },
  { label: "Intro meetings booked (5–15%)",              value: "20–60",  width: 74 },
  { label: "Advance to demo (40–60%)",                   value: "8–36",   width: 60 },
  { label: "Pilot stage",                                value: "5–20",   width: 44 },
  { label: "Close in Year 1 (10–25%)",                   value: "5–20",   width: 30, highlight: true },
];

export function Funnel() {
  return (
    <div className="space-y-2">
      {STEPS.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20, width: "0%" }}
          whileInView={{ opacity: 1, x: 0, width: `${s.width}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-center justify-between px-5 py-3 rounded-lg text-white ${
            s.highlight
              ? "bg-gradient-to-r from-yai-blue to-yai-blue-dark"
              : "bg-gradient-to-r from-yai-navy to-yai-navy-light"
          }`}
        >
          <span className="text-sm font-medium">{s.label}</span>
          <span
            className={`font-extrabold text-lg whitespace-nowrap ml-3 ${
              s.highlight ? "text-white" : "text-yai-blue"
            }`}
          >
            {s.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
