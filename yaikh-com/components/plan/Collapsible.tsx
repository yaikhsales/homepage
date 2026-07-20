"use client";

import { useState } from "react";

/**
 * A collapsible "tab" for the /plan deck. Shows a header bar with a
 * chevron; the body stays hidden until the chevron/header is clicked.
 * Use for supplementary detail that shouldn't clutter the main section.
 *
 *   <Collapsible title="Executive Summary — full detail">
 *     ...hidden content...
 *   </Collapsible>
 */
export function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-6 rounded-xl border border-yai-border overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="flex-1">
          <span className="block font-bold text-yai-navy text-[15px] leading-tight">{title}</span>
          {subtitle && <span className="block text-xs text-gray-500 mt-0.5">{subtitle}</span>}
        </span>
        {/* chevron dropdown icon */}
        <svg
          viewBox="0 0 24 24"
          className={`w-5 h-5 text-yai-blue shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* body — hidden until expanded */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 text-[15px] leading-relaxed text-gray-700 border-t border-yai-border/60">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
