"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function Section({
  id,
  kicker,
  title,
  children,
  className = "",
  collapsible = false,
  defaultOpen = false,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  /** When true, the whole section body hides under the title; a chevron
   *  next to the title toggles it. */
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(collapsible ? defaultOpen : true);

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

      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center gap-3 text-left group mb-6"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-yai-navy tracking-tight group-hover:text-yai-blue transition-colors">
            {title}
          </h2>
          <svg
            viewBox="0 0 24 24"
            className={`w-7 h-7 text-yai-blue shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      ) : (
        <h2 className="text-3xl sm:text-4xl font-extrabold text-yai-navy mb-6 tracking-tight">
          {title}
        </h2>
      )}

      {collapsible ? (
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      ) : (
        children
      )}
    </motion.section>
  );
}
