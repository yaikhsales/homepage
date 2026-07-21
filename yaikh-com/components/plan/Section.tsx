"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccordion } from "./Accordion";

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
  const [localOpen, setLocalOpen] = useState(collapsible ? defaultOpen : true);
  const acc = useAccordion();

  // When an AccordionProvider is present, sections coordinate so only one is
  // open at a time; otherwise each keeps its own local state.
  const controlled = collapsible && acc !== null;
  const pinned = controlled && acc!.pinnedIds.has(id);
  // Open if the accordion selected it OR the user pinned it open.
  const open = !collapsible ? true : controlled ? acc!.openId === id || pinned : localOpen;
  const toggle = () =>
    controlled ? acc!.setOpenId(acc!.openId === id ? null : id) : setLocalOpen((v) => !v);

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`${collapsible ? "mb-2" : "mb-24"} scroll-mt-8 ${className}`}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-gray-400 font-bold mb-2">
        {kicker}
      </p>

      {collapsible ? (
        <div
          className={`w-full flex items-center justify-between gap-3 group ${open ? "mb-5" : "mb-0"} rounded-xl border bg-white px-5 sm:px-6 py-4 shadow-sm transition-all ${
            open || pinned ? "border-yai-blue/40" : "border-yai-border hover:border-yai-blue/40 hover:shadow-md"
          }`}
        >
          {/* Title toggles the section */}
          <button type="button" onClick={toggle} aria-expanded={open} className="flex-1 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-yai-navy tracking-tight group-hover:text-yai-blue transition-colors">
              {title}
            </h2>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {/* Pin — keep this section open regardless of the accordion */}
            {(open || pinned) && controlled && (
              <button
                type="button"
                onClick={() => acc!.togglePin(id)}
                aria-pressed={pinned}
                title={pinned ? "Unpin — allow it to close" : "Pin open — keep it open"}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  pinned ? "bg-yai-orange text-white" : "bg-slate-100 text-slate-500 hover:bg-yai-orange/15 hover:text-yai-orange"
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 17v5" />
                  <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                </svg>
              </button>
            )}
            {/* Chevron toggle */}
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label={open ? "Collapse" : "Expand"}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                open ? "bg-yai-blue text-white" : "bg-slate-100 text-yai-blue group-hover:bg-yai-blue/10"
              }`}
            >
              <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
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
