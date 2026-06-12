"use client";

import { useState, type ReactNode } from "react";

/**
 * Collapsible "enabler" bar — same visual pattern as the segment bars below.
 * Header is always visible, body expands on click. Body is `children`, so caller
 * provides whatever content (text, lists, cards, sub-roadmap, etc.).
 *
 * Used by the GTM foundation row (Exhibitions / Marketing / Clear steps) at the
 * top of Section 11.
 */

interface Props {
  id?: string;           // optional DOM id — anchor target for in-page links
  num: string;           // "01", "02", ...
  tag: string;           // short uppercase chip text e.g. "OFFLINE"
  title: string;         // bar title
  desc: string;          // one-line summary (always visible)
  color: string;         // accent / chip background
  bg: string;            // bar background tint
  badge?: string;        // right-side stat / label (like REACHABLE)
  badgeLabel?: string;   // small uppercase label above badge (default: "STATUS")
  children?: ReactNode;  // body content shown when expanded
}

export function GtmEnablerBar({
  id,
  num,
  tag,
  title,
  desc,
  color,
  bg,
  badge,
  badgeLabel = "Status",
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id={id} className={`rounded-xl border border-yai-border bg-white scroll-mt-8 ${isOpen ? "" : "shadow-sm"}`}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        className={`w-full flex items-start gap-3 p-4 text-left rounded-t-xl transition-colors ${isOpen ? "border-b border-yai-border" : "rounded-b-xl"}`}
        style={{ background: bg }}
      >
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-extrabold shrink-0"
          style={{ background: color }}
        >
          {num}
        </span>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1 flex-wrap">
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white"
              style={{ background: color }}
            >
              {tag}
            </span>
            <h4 className="font-extrabold text-yai-navy text-base leading-tight">{title}</h4>
          </div>
          <p className="text-xs text-gray-700 leading-snug max-w-3xl">{desc}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {badge && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">{badgeLabel}</div>
              <div className="text-lg font-extrabold tabular-nums text-right" style={{ color }}>
                {badge}
              </div>
            </div>
          )}
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-sm"
            style={{ background: color }}
          >
            {isOpen ? "Hide detail" : "Detail"}
            <span className="text-[10px] leading-none">{isOpen ? "▲" : "▼"}</span>
          </span>
        </div>
      </button>

      {!isOpen ? null : (
        <div className="px-4 pt-4 pb-4">
          {children ?? (
            <div className="rounded-lg border border-dashed border-yai-border bg-gray-50 p-6 text-center">
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">
                Content to be added
              </div>
              <div className="text-xs text-gray-500">
                You&rsquo;ll tell me what goes inside this bar — vendors list, calendar, hire plan,
                funnel steps, whatever fits.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
