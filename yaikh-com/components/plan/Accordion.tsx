"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AccordionCtx = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const Ctx = createContext<AccordionCtx | null>(null);

/**
 * Wraps the collapsible sections so only ONE is open at a time — opening a
 * section auto-closes the previously open one (classic accordion).
 */
export function AccordionProvider({
  children,
  defaultOpenId = null,
}: {
  children: React.ReactNode;
  defaultOpenId?: string | null;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);

  // Open whichever section the URL hash points at — so clicking a sidebar
  // nav link (which sets #section-id) also expands that section, and a
  // shared/bookmarked link lands with the right one open.
  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id) setOpenId(id);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return <Ctx.Provider value={{ openId, setOpenId }}>{children}</Ctx.Provider>;
}

export function useAccordion(): AccordionCtx | null {
  return useContext(Ctx);
}
