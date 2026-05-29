"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export type NavItem = { id: string; label: string };

export function Sidebar({
  items,
  viewer,
}: {
  items: NavItem[];
  viewer: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  // Default true so SSR + first client render agree (sidebar visible, x:0) — avoids hydration mismatch.
  // Updated after mount via matchMedia; also reacts to resize.
  const [isDesktop, setIsDesktop] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scroll-spy
  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
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
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
    setOpen(false);
  };

  const onLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const onPrint = () => window.print();

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

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop || open ? 0 : "-100%",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        className="sidebar w-72 bg-yai-navy text-white min-h-screen md:sticky md:top-0 md:max-h-screen md:overflow-y-auto sidebar-scroll no-print fixed md:relative inset-y-0 left-0 z-50 md:translate-x-0"
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
              <div className="text-sm text-white font-semibold truncate">Texlink Technologies</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-yai-orange/90 font-bold mt-1">Strategic DTV</div>
            </div>
          </div>
        </div>

        <nav className="py-3 px-3 space-y-0.5 text-sm">
          {items.map((it, i) => {
            const isActive = it.id === active;
            return (
              <a
                key={it.id}
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
                <span className="text-yai-blue font-bold mr-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {it.label}
              </a>
            );
          })}
        </nav>

        {/* Signature block */}
        <div className="px-5 pt-4 pb-2 border-t border-white/10 text-white/80">
          <div className="text-[13px] font-semibold text-white leading-tight">Gamini K</div>
          <div className="text-[10.5px] uppercase tracking-[0.12em] text-white/55 mt-0.5">Director</div>
          <div className="text-[11px] font-semibold text-white/85 mt-2 leading-tight">
            TEXLINK TECHNOLOGIES CO., LTD.
          </div>
          <div className="text-[10.5px] text-white/55 leading-snug mt-1">
            Apparel, Footwear, Bags, Softgoods<br />Manufacturing Intelligence Solutions
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={onPrint}
            className="w-full text-xs bg-white/10 hover:bg-white/20 text-white py-2 rounded transition"
          >
            Download as PDF
          </button>
          <button
            onClick={onLogout}
            className="w-full text-xs text-white/60 hover:text-white py-1 transition"
          >
            Sign out
          </button>
        </div>
      </motion.aside>
    </>
  );
}
