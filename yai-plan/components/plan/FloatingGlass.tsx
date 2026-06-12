"use client";

import { useEffect, useRef, useState } from "react";

/* Q&A floating glass panel — draggable by the header, resizable from the
 * bottom-right corner. Items area scrolls internally so all questions are
 * accessible regardless of panel height. */

const DEFAULT_W = 260;
const DEFAULT_H = 560;
const MIN_W = 200;
const MIN_H = 200;
const MAX_W = 720;
const MAX_H = 1200;
const POS_KEY  = "yai-glass-v2-pos";
const SIZE_KEY = "yai-glass-v2-size";

const QA_ITEMS: Array<{ n: number; text: string; anchor?: string; note?: string }> = [
  { n: 1, text: "Sales plan covering at least the next six to twelve months",                          anchor: "sales-expenses-budget" },
  { n: 2, text: "How we plan to market the Texlink platform",                                          anchor: "customers" },
  { n: 3, text: "Exhibitions and events (offline)",                                                    anchor: "gtm" },
  { n: 4, text: "Core Applications retain for YW",                                                     note: "for discussion" },
  { n: 5, text: "A complete list of all Admin modules, together with their current acceptance status", anchor: "traction" },
  { n: 6, text: "A phased approach to starting the business",                                          anchor: "pricing" },
  { n: 7, text: "A quarterly OC update",                                                               anchor: "oc-budget" },
  { n: 8, text: "A half-year budget update, together with any purchase applications",                  anchor: "oc-budget" },
  { n: 9, text: "Investment being of the YW Group",                                                    anchor: "capital-investment", note: "documentation for capital investment" },
];

export function FloatingGlass() {
  const [mounted, setMounted] = useState(false);
  // Position is measured from top-left of viewport so the panel can be
  // dragged anywhere — including over by the blue sidebar on the left.
  const [pos, setPos] = useState({ x: 0, y: 24 });
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const dragRef = useRef<{ kind: "move" | "resize" | null; ox: number; oy: number; sw: number; sh: number }>({
    kind: null, ox: 0, oy: 0, sw: 0, sh: 0,
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    // Initial position — right side, with a fallback for the saved value.
    const defaultX = Math.max(0, window.innerWidth - DEFAULT_W - 24);
    let nextPos = { x: defaultX, y: 24 };
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.x === "number" && typeof p.y === "number") nextPos = p;
      }
    } catch {}
    setPos(clampPos(nextPos.x, nextPos.y, size.w, size.h));

    try {
      const raw = localStorage.getItem(SIZE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.w === "number" && typeof s.h === "number") {
          setSize({
            w: clamp(s.w, MIN_W, Math.min(MAX_W, window.innerWidth - 16)),
            h: clamp(s.h, MIN_H, Math.min(MAX_H, window.innerHeight - 16)),
          });
        }
      }
    } catch {}
    // Stale cleanup from earlier prototypes
    try {
      localStorage.removeItem("yai-glass-pos");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist position + size whenever they change (post-mount).
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(POS_KEY,  JSON.stringify(pos));  } catch {}
    try { localStorage.setItem(SIZE_KEY, JSON.stringify(size)); } catch {}
  }, [mounted, pos, size]);

  // ── drag (move) + resize handlers ────────────────────────────────────────
  const onMoveStart = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Don't start dragging when the user is clicking a Q&A link or button.
    if (target.closest("a, button, input, textarea, select")) return;
    e.preventDefault();
    dragRef.current = {
      kind: "move",
      ox: e.clientX - pos.x,
      oy: e.clientY - pos.y,
      sw: size.w, sh: size.h,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      kind: "resize",
      ox: e.clientX,
      oy: e.clientY,
      sw: size.w, sh: size.h,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.kind) return;
    if (d.kind === "move") {
      setPos(clampPos(e.clientX - d.ox, e.clientY - d.oy, size.w, size.h));
    } else if (d.kind === "resize") {
      const w = clamp(d.sw + (e.clientX - d.ox), MIN_W, Math.min(MAX_W, window.innerWidth  - pos.x - 8));
      const h = clamp(d.sh + (e.clientY - d.oy), MIN_H, Math.min(MAX_H, window.innerHeight - pos.y - 8));
      setSize({ w, h });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = { kind: null, ox: 0, oy: 0, sw: 0, sh: 0 };
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed z-40 no-print select-none"
      style={{ top: `${pos.y}px`, left: `${pos.x}px` }}
    >
      <div
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative rounded-3xl overflow-hidden touch-none flex flex-col"
        style={{
          width: `${size.w}px`,
          height: `${size.h}px`,
          backdropFilter: "blur(8px) saturate(160%)",
          WebkitBackdropFilter: "blur(8px) saturate(160%)",
          background: "rgba(255, 255, 255, 0.06)",
          boxShadow: "0 20px 50px -20px rgba(10,31,71,0.3), 0 2px 6px rgba(10,31,71,0.05), inset 0 1px 0 rgba(255,255,255,0.45)",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        {/* Edge highlights */}
        <div className="absolute inset-x-0 top-0 h-[20%] pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)" }} />
        <div className="absolute inset-y-0 left-0 w-px pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.2) 70%, transparent 100%)" }} />
        <div className="absolute inset-y-0 right-0 w-px pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.1) 70%, transparent 100%)" }} />

        {/* Header — drag handle */}
        <div
          onPointerDown={onMoveStart}
          className="relative cursor-grab active:cursor-grabbing pt-3 pb-2 px-4 shrink-0"
          title="Drag to move"
        >
          {/* drag indicator dots */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-50">
            <span className="w-1 h-1 rounded-full bg-yai-navy/60" />
            <span className="w-1 h-1 rounded-full bg-yai-navy/60" />
            <span className="w-1 h-1 rounded-full bg-yai-navy/60" />
          </div>
          <h2 className="text-yai-navy/85 font-extrabold tracking-[0.18em] text-base sm:text-lg text-center mt-2">
            Q&amp;A
          </h2>
        </div>

        {/* Items — scrollable so every question is reachable regardless of size */}
        <div className="flex-1 overflow-y-auto px-4 pt-1 pb-4 space-y-2.5 sidebar-scroll">
          {QA_ITEMS.map((q) =>
            q.anchor ? (
              <a
                key={q.n}
                href={`#${q.anchor}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(q.anchor!);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", `#${q.anchor}`);
                  }
                }}
                className="block rounded-xl border border-white/45 bg-white/60 backdrop-blur-sm px-3 py-2.5 text-yai-navy hover:bg-white/85 hover:border-yai-blue/40 hover:shadow-md transition group"
              >
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yai-blue text-white text-[10px] font-extrabold shrink-0 mt-0.5">
                    {q.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11.5px] leading-snug font-semibold group-hover:text-yai-blue transition">
                      {q.text}
                    </span>
                    {q.note && (
                      <div className="text-[9.5px] uppercase tracking-[0.15em] italic text-yai-orange/80 mt-0.5">
                        {q.note}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ) : (
              <div
                key={q.n}
                className="rounded-xl border border-dashed border-yai-navy/25 bg-white/35 backdrop-blur-sm px-3 py-2.5 text-yai-navy/70"
                title="No link attached — to be discussed"
              >
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-yai-navy/40 text-white text-[10px] font-extrabold shrink-0 mt-0.5">
                    {q.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11.5px] leading-snug font-semibold">{q.text}</div>
                    {q.note && (
                      <div className="text-[9.5px] uppercase tracking-[0.15em] italic text-yai-orange/80 mt-0.5">
                        {q.note}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Resize handle — bottom-right corner */}
        <div
          onPointerDown={onResizeStart}
          title="Drag to resize"
          className="absolute bottom-1 right-1 w-5 h-5 cursor-nwse-resize flex items-end justify-end p-0.5 text-yai-navy/40 hover:text-yai-navy/70 transition"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
            <circle cx="14" cy="14" r="1" />
            <circle cx="14" cy="10" r="1" />
            <circle cx="10" cy="14" r="1" />
            <circle cx="14" cy="6"  r="1" />
            <circle cx="10" cy="10" r="1" />
            <circle cx="6"  cy="14" r="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function clampPos(x: number, y: number, w: number, h: number) {
  if (typeof window === "undefined") return { x, y };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: clamp(x, -(w - 80), vw - 80),
    y: clamp(y, 0, Math.max(0, vh - 80)),
  };
}
