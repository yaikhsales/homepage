"use client";

import { motion } from "framer-motion";

export function Thesis({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-yai-blue font-extrabold text-xl sm:text-2xl lg:text-[1.6rem] leading-snug tracking-tight mb-8 text-balance"
    >
      {children}
    </motion.p>
  );
}
