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

  // On first load, open whichever section a bookmarked/shared URL hash
  // points at. Sidebar clicks open sections directly (see Sidebar.onJump),
  // so we don't listen to hashchange — that would fight the scroll-spy.
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (id) setOpenId(id);
  }, []);

  return <Ctx.Provider value={{ openId, setOpenId }}>{children}</Ctx.Provider>;
}

export function useAccordion(): AccordionCtx | null {
  return useContext(Ctx);
}
