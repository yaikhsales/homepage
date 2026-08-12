"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AdminPanel } from "./AdminPanel";
import { LanguageToggle, useLang } from "./LanguageToggle";
import { translate } from "@/lib/i18n";
import { useAccordion } from "./Accordion";

export type NavItem = {
  id: string;
  label: string;
  labelKey?: string;
  /** Optional sub-items, rendered indented under the parent (e.g. 08.1, 08.2). */
  children?: Array<{ id: string; label: string; labelKey?: string }>;
};

export function Sidebar({
  items,
  viewer,
}: {
  items: NavItem[];
  viewer: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const acc = useAccordion();
  // Default true so SSR + first client render agree (sidebar visible, x:0) — avoids hydration mismatch.
  // Updated after mount via matchMedia; also reacts to resize.
  const [isDesktop, setIsDesktop] = useState(true);
  // Desktop-only collapse — when true, sidebar shrinks to 0 width and a
  // floating tab on the far left reopens it. Persisted in localStorage.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("yai-sidebar-collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem("yai-sidebar-collapsed", next ? "1" : "0"); } catch {}
      // Broadcast so FloatingGlass (or anything else) can react.
      try {
        window.dispatchEvent(new CustomEvent("yai-sidebar-collapsed", { detail: next }));
      } catch {}
      return next;
    });
  };
  const router = useRouter();
  const lang = useLang();
  const t = (key: string, fallback?: string) => translate(lang, key, fallback);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scroll-spy — includes children so 08.1/08.2 highlight when in view.
  useEffect(() => {
    const ids = items.flatMap((it) => [it.id, ...(it.children?.map((c) => c.id) ?? [])]);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        }
        if (best?.target.id) setActive(best.target.id);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.2, 0.5, 0.8, 1],
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  const onJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    // Open the section in the accordion, then scroll to it.
    acc?.setOpenId(id);
    setActive(id);
    // Let the section expand before scrolling so we land on the right spot.
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    });
    setOpen(false);
  };

  const onLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  // PDF download removed for now — server-side Puppeteer generation lives
  // in app/api/pdf/route.ts and will be wired back up later.

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-30 bg-yai-navy text-white px-4 py-3 flex items-center justify-between shadow no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yai-blue flex items-center justify-center font-extrabold">
            Y
          </div>
          <span className="font-bold">Yai Plan</span>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-3 py-1.5 rounded border border-white/20 text-sm"
          aria-label="Open menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40 no-print"
          />
        )}
      </AnimatePresence>

      {/* Floating reopen tab — visible only when collapsed on desktop. */}
      {collapsed && isDesktop && (
        <button
          onClick={toggleCollapsed}
          aria-label="Open sidebar"
          className="hidden md:flex no-print fixed left-0 top-1/2 -translate-y-1/2 z-50 items-center justify-center w-6 h-20 rounded-r-lg bg-yai-navy text-white/80 hover:text-white shadow-lg border-y border-r border-white/15"
          title="Open menu"
        >
          <span className="text-lg leading-none">›</span>
        </button>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop || open ? 0 : "-100%",
          width: collapsed && isDesktop ? 0 : 288, // 18rem = 288px = w-72
        }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        style={{ overflow: collapsed && isDesktop ? "hidden" : undefined }}
        className="sidebar bg-yai-navy text-white min-h-screen md:sticky md:top-0 md:max-h-screen md:overflow-y-auto sidebar-scroll no-print fixed md:relative inset-y-0 left-0 z-50 md:translate-x-0 shrink-0"
      >
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/yai-logo.jpg"
              alt="Yai"
              className="h-14 w-14 rounded-lg object-cover shadow-lg ring-1 ring-white/20 shrink-0"
            />
            <div className="flex-1 min-w-0 leading-tight">
              <div className="text-sm text-white font-semibold">{t("sidebar.company")}</div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="text-[10px] uppercase tracking-[0.15em] text-yai-orange/90 font-bold">{t("sidebar.tagline")}</div>
                <LanguageToggle />
              </div>
            </div>
          </div>
          {/* Collapse button — desktop only, full-width row under the flags
              so the company name doesn't get squeezed. */}
          <button
            onClick={toggleCollapsed}
            aria-label="Hide sidebar"
            className="hidden md:flex w-full mt-3 items-center justify-center gap-1.5 py-1.5 rounded text-white/55 hover:text-white hover:bg-white/10 transition text-[10px] uppercase tracking-[0.18em] font-bold"
            title="Hide menu"
          >
            <span className="text-base leading-none">‹</span>
            <span>Hide menu</span>
          </button>
        </div>

        <nav className="py-3 px-3 space-y-0.5 text-sm">
          {items.map((it, i) => {
            const isActive = it.id === active;
            const num = String(i + 1).padStart(2, "0");
            const childActive = !!it.children?.some((c) => c.id === active);
            const showChildren = !!it.children && (isActive || childActive);
            return (
              <div key={it.id}>
                <a
                  href={`#${it.id}`}
                  onClick={onJump(it.id)}
                  className={`relative block py-2 pl-4 pr-2 rounded transition-all duration-200 ${
                    isActive
                      ? "text-white font-semibold bg-yai-blue/10"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-marker"
                      className="absolute left-0 top-1 bottom-1 w-[3px] bg-yai-orange rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="text-yai-blue font-bold mr-2">{num}</span>
                  {it.labelKey ? t(it.labelKey, it.label) : it.label}
                </a>
                {showChildren && (
                  <div className="mt-0.5 mb-1.5 space-y-0.5">
                    {it.children!.map((c, ci) => {
                      const cActive = c.id === active;
                      return (
                        <a
                          key={c.id}
                          href={`#${c.id}`}
                          onClick={onJump(c.id)}
                          className={`block py-1.5 pl-10 pr-2 rounded text-[13px] transition-all duration-200 ${
                            cActive
                              ? "text-white font-semibold bg-yai-blue/15"
                              : "text-white/50 hover:text-white/90"
                          }`}
                        >
                          <span className="text-yai-orange/80 font-bold mr-2">
                            {num}.{ci + 1}
                          </span>
                          {c.labelKey ? t(c.labelKey, c.label) : c.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Signature block + admin settings wheel */}
        <div className="relative px-5 pt-4 pb-2 border-t border-white/10 text-white/80">
          <AdminPanel />
          <div className="text-[13px] font-semibold text-white leading-tight">Gamini K</div>
          <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/55 mt-0.5">{t("sidebar.director")}</div>
          <div className="text-[11px] font-semibold text-white/85 mt-2 leading-tight">
            {t("sidebar.company_full")}
          </div>
          <div className="text-[10.5px] text-white/55 leading-snug mt-1">
            {t("sidebar.industry")}<br />{t("sidebar.industry_sub")}
          </div>
        </div>

        {/* Action buttons — PDF download removed for now; will revisit later */}
        <div className="px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={onLogout}
            className="w-full text-xs text-white/60 hover:text-white py-1 transition"
          >
            {t("sidebar.sign_out")}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
