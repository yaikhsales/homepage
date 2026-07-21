"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AccordionCtx = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
  /** Pinned sections stay open regardless of which one the accordion selects. */
  pinnedIds: Set<string>;
  togglePin: (id: string) => void;
};

const Ctx = createContext<AccordionCtx | null>(null);

/**
 * Wraps the collapsible sections so only ONE is open at a time (accordion) —
 * EXCEPT any section the user has pinned, which stays open until unpinned.
 */
export function AccordionProvider({
  children,
  defaultOpenId = null,
}: {
  children: React.ReactNode;
  defaultOpenId?: string | null;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  const togglePin = (id: string) =>
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // On first load, open whichever section a bookmarked/shared URL hash
  // points at. Sidebar clicks open sections directly (see Sidebar.onJump),
  // so we don't listen to hashchange — that would fight the scroll-spy.
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (id) setOpenId(id);
  }, []);

  return (
    <Ctx.Provider value={{ openId, setOpenId, pinnedIds, togglePin }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAccordion(): AccordionCtx | null {
  return useContext(Ctx);
}
