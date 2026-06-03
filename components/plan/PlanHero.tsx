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
      {/* Made in Cambodia · ASEAN — promoted to the very top */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mb-5 flex flex-wrap items-center gap-6"
      >
        <MadeInCambodia variant="light" size="lg" />

        <span className="hidden sm:inline-block w-px h-10 bg-gray-300" aria-hidden />

        <span className="inline-flex items-center gap-3">
          <img
            src="/images/generated/asean-logo-with-flags.png"
            alt="ASEAN — Cambodia and 9 fellow member states"
            className="w-16 h-16 object-contain opacity-90"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
              Built for
            </span>
            <span className="text-base sm:text-lg font-extrabold tracking-[0.22em] uppercase text-yai-navy/80">
              ASEAN
            </span>
          </span>
        </span>
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
