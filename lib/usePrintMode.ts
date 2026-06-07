"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the browser is currently printing / saving as PDF.
 * Used by interactive components to render their full expanded state
 * (open accordions, all pathways, etc.) so nothing is missing from the PDF.
 *
 * Hooks into BOTH:
 *  - the `beforeprint` / `afterprint` events (fired by Chrome before paint), and
 *  - `matchMedia("print")` (fires when a programmatic print preview starts).
 */
export function usePrintMode(): boolean {
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBefore = () => setPrinting(true);
    const onAfter = () => setPrinting(false);
    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);

    const mql = window.matchMedia?.("print");
    const onMql = (e: MediaQueryListEvent) => setPrinting(e.matches);
    mql?.addEventListener?.("change", onMql);

    return () => {
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
      mql?.removeEventListener?.("change", onMql);
    };
  }, []);

  return printing;
}
