"use client";

import { useEffect, useState } from "react";
import { LanguageToggle, useLang } from "./LanguageToggle";
import { translate } from "@/lib/i18n";

/* Floating glassmorphism widget — sits top-right of the viewport.
 * Hosts the language flags + a few quick actions in a frosted-glass card.
 * Collapses to a compact pill on small screens / when user clicks the chevron. */

export function FloatingGlass() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lang = useLang();
  const t = (k: string, f?: string) => translate(lang, k, f);

  useEffect(() => setMounted(true), []);

  // SSR safety — only render on client to avoid hydration mismatch from useLang reading localStorage
  if (!mounted) return null;

  return (
    <div
      className="fixed z-40 right-4 top-4 no-print"
      // Stay clear of the mobile sidebar header (which is sticky at top on mobile)
      style={{ pointerEvents: "auto" }}
    >
      <div
        className={`transition-all duration-300 ${
          collapsed ? "w-[64px]" : "w-[240px]"
        } rounded-2xl backdrop-blur-xl bg-white/55 ring-1 ring-white/60 shadow-[0_10px_40px_-10px_rgba(10,31,71,0.35)] overflow-hidden border border-white/40`}
      >
        {/* Header strip */}
        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-white/30 to-white/10">
          {!collapsed && (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-yai-navy/80">
                Yai
              </span>
              <span className="text-[9px] uppercase tracking-wider text-yai-orange font-bold">
                plan
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand" : "Collapse"}
            className="ml-auto w-6 h-6 rounded-full bg-white/60 hover:bg-white/80 ring-1 ring-yai-navy/10 flex items-center justify-center text-yai-navy text-xs font-bold transition"
          >
            {collapsed ? "‹" : "›"}
          </button>
        </div>

        {/* Body — language flags + quick links */}
        <div className={`px-3 pb-3 pt-1.5 ${collapsed ? "hidden" : "block"}`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-[0.12em] text-yai-navy/70 font-bold">
              {t("sidebar.language")}
            </span>
            <LanguageToggle />
          </div>

          <div className="mt-3 pt-2.5 border-t border-yai-navy/10 space-y-1.5">
            <a
              href="#executive-summary"
              className="block text-[11px] text-yai-navy/85 hover:text-yai-blue font-semibold transition py-1"
            >
              ↗ {t("nav.executive")}
            </a>
            <a
              href="#team"
              className="block text-[11px] text-yai-navy/85 hover:text-yai-blue font-semibold transition py-1"
            >
              ↗ {t("nav.team")}
            </a>
            <a
              href="#capital"
              className="block text-[11px] text-yai-navy/85 hover:text-yai-blue font-semibold transition py-1"
            >
              ↗ {t("nav.capital")}
            </a>
            <a
              href="#oc-budget"
              className="block text-[11px] text-yai-navy/85 hover:text-yai-blue font-semibold transition py-1"
            >
              ↗ {t("nav.oc_budget")}
            </a>
          </div>
        </div>

        {/* Collapsed-only mini stack — just the flags */}
        {collapsed && (
          <div className="px-2 pb-2 pt-1 flex flex-col items-center gap-1.5">
            <LanguageToggle />
          </div>
        )}
      </div>
    </div>
  );
}
