"use client";

import { motion } from "framer-motion";
import { Badge } from "./Card";

export function PlanHero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xs uppercase tracking-[0.2em] text-yai-orange font-bold mb-4"
      >
        Confidential — Business Plan
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-yai-navy leading-[1.04] mb-5 text-balance"
      >
        AI-Native Manufacturing,
        <br />
        Built for Apparel.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl text-balance"
      >
        YAI is an AI-native MES/ERP platform purpose-built for garment factories — already live in two production facilities, replacing three legacy systems, built for a fraction of comparable spend.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-wrap gap-2 mt-6"
      >
        <Badge variant="live">2 factories live</Badge>
        <Badge variant="build">3 legacy systems replaced</Badge>
        <Badge variant="pilot">5 prospect meetings booked</Badge>
      </motion.div>
    </motion.header>
  );
}
