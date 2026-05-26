"use client";

import { motion } from "framer-motion";

export function Section({
  id,
  kicker,
  title,
  children,
  className = "",
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-24 scroll-mt-8 ${className}`}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-gray-400 font-bold mb-2">
        {kicker}
      </p>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-yai-navy mb-6 tracking-tight">
        {title}
      </h2>
      {children}
    </motion.section>
  );
}
