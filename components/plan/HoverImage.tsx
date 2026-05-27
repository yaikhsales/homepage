"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/**
 * Inline text that, on hover (or focus), shows a small image popover next to it.
 * Used to give a visual "this is what those words mean" reinforcement without
 * replacing the text or making the page heavier on first render.
 *
 * Usage:
 *   <HoverImage src="/images/generated/problem.png" alt="The chaos">
 *     paper reports and ledger books, scattered chat apps, ...
 *   </HoverImage>
 */
export function HoverImage({
  src,
  alt,
  width = 380,
  caption,
  children,
}: {
  src: string;
  alt: string;
  width?: number;
  caption?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      className="relative inline cursor-help bg-yai-blue/[0.06] hover:bg-yai-blue/[0.12] focus:bg-yai-blue/[0.12] outline-none transition-colors rounded-[2px] px-0.5 underline decoration-yai-blue/45 decoration-dotted underline-offset-[3px] hover:decoration-yai-blue focus:decoration-yai-blue"
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ width, maxWidth: "min(90vw, 460px)" }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 rounded-xl shadow-2xl border-2 border-yai-blue overflow-hidden bg-white pointer-events-none"
          >
            <span className="block relative">
              {/* small arrow pointing up to the hovered text */}
              <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-yai-blue"></span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="w-full h-auto block" />
              {caption && (
                <span className="block text-[11px] text-gray-600 italic text-center py-2 px-3 bg-yai-bg border-t border-yai-border">
                  {caption}
                </span>
              )}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
