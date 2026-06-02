"use client";

import { motion } from "framer-motion";
import { MadeInCambodia } from "./MadeInCambodia";

export function PlanHero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20"
    >
      {/* Made in Cambodia — promoted to the very top, larger flag */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mb-5"
      >
        <MadeInCambodia variant="light" size="lg" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-yai-navy leading-[1.04] mb-4 text-balance"
      >
        Ai-Native Manufacturing
        <br />
        Intelligence Platform.
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yai-navy text-white text-[11px] font-extrabold tracking-[0.18em] uppercase">
          Ai MIP
        </span>
      </motion.div>
    </motion.header>
  );
}
