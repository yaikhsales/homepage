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
  const router = useRouter();

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
      <div className="lg:hidden sticky top-0 z-30 bg-yai-navy text-white px-4 py-3 flex items-center justify-between shadow no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yai-orange flex items-center justify-center font-extrabold">
            Y
          </div>
          <span className="font-bold">YAI Plan</span>
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
            className="lg:hidden fixed inset-0 bg-black/50 z-40 no-print"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: open ? 0 : typeof window !== "undefined" && window.innerWidth < 1024 ? "-100%" : 0,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        className="sidebar w-72 bg-yai-navy text-white min-h-screen lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto sidebar-scroll no-print fixed lg:relative inset-y-0 left-0 z-50 lg:translate-x-0"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-yai-orange flex items-center justify-center shadow-orange-glow font-extrabold text-lg">
              Y
            </div>
            <div>
              <div className="font-extrabold text-lg leading-tight">YAI</div>
              <div className="text-xs text-white/60">Texlink Technologies</div>
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">
            Business Plan
          </p>
          <p className="text-xs text-white/70 mt-1">
            Viewer: <span className="font-medium">{viewer}</span>
          </p>
        </div>

        <nav className="py-4 px-3 space-y-0.5 text-sm">
          {items.map((it, i) => {
            const isActive = it.id === active;
            return (
              <a
                key={it.id}
                href={`#${it.id}`}
                onClick={onJump(it.id)}
                className={`relative block py-2 pl-4 pr-2 rounded transition-all duration-200 ${
                  isActive
                    ? "text-white font-semibold bg-yai-orange/10"
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
                <span className="text-yai-orange font-bold mr-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {it.label}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
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
