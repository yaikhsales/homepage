"use client";

import { createContext, useContext, useState } from "react";

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
  return <Ctx.Provider value={{ openId, setOpenId }}>{children}</Ctx.Provider>;
}

export function useAccordion(): AccordionCtx | null {
  return useContext(Ctx);
}
