"use client";

/**
 * Reusable slideshow for the §08 sub-clusters (Digital Audit / YQMS / Cost
 * and Efficiency / YHR). Placeholder slides show big numbers (1–N) until
 * real content lands.
 *
 * Controls:
 *   ← / →  arrow keys       (when focused or fullscreen)
 *   ← / →  on-screen buttons (always visible)
 *   swipe                    (touch or mouse drag)
 *   click centre             (advance by one — mimics phone slideshow tap)
 *   fullscreen button        (top-right; ESC exits)
 *   dot pagination           (bottom; click a dot to jump)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { exportPdf, exportPptx } from "@/lib/slideshow-export";

export type Slide = {
  /** Big label (e.g. "1", "2" for placeholder decks). */
  label: string;
  /** Optional caption shown under the label. */
  caption?: string;
  /** Optional accent color for the slide background gradient. */
  accent?: string;
};

const DEFAULT_ACCENTS = ["#1E4DAA", "#F37021", "#0A3327", "#6D4FB6", "#10B981", "#B91C1C"];

export function SlideShow({
  slides,
  title,
  className = "",
}: {
  slides: Slide[];
  /** Section title, echoed in the fullscreen header for context. */
  title: string;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0); // +1 = forward, -1 = backward
  const [isFull, setIsFull] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; t: number } | null>(null);

  const total = slides.length;
  const goTo = useCallback(
    (next: number, direction: number) => {
      setDir(direction);
      setIdx((next + total) % total);
    },
    [total],
  );
  const prev = useCallback(() => goTo(idx - 1, -1), [idx, goTo]);
  const next = useCallback(() => goTo(idx + 1, +1), [idx, goTo]);

  // Keyboard — arrow left/right when the slideshow is focused or fullscreen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const active = document.activeElement;
      const inside = containerRef.current.contains(active) || isFull;
      if (!inside) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, isFull]);

  // Sync internal `isFull` with the browser's fullscreen state so ESC (or an
  // out-of-band exit) doesn't leave the UI stuck in fullscreen mode.
  // Listen for both the standard event and the -webkit variant Safari fires.
  useEffect(() => {
    // Handle both standard + webkit-prefixed Safari APIs.
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
    };
    const sync = () => setIsFull(!!(doc.fullscreenElement ?? doc.webkitFullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const toggleFull = () => {
    const el = containerRef.current as (HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    }) | null;
    if (!el) return;
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };
    const alreadyFull = !!(doc.fullscreenElement ?? doc.webkitFullscreenElement);
    try {
      if (alreadyFull) {
        const p = doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen?.();
        (p as Promise<void> | undefined)?.catch?.((err) => {
          console.warn("[SlideShow] exitFullscreen failed:", err);
        });
      } else {
        const req = el.requestFullscreen ?? el.webkitRequestFullscreen;
        if (!req) {
          console.warn("[SlideShow] Fullscreen API not supported");
          return;
        }
        const p = req.call(el);
        (p as Promise<void> | undefined)?.catch?.((err) => {
          console.warn("[SlideShow] requestFullscreen failed:", err);
        });
      }
    } catch (err) {
      console.warn("[SlideShow] fullscreen toggle threw:", err);
    }
  };

  // Swipe / drag — pointer events cover touch, pen, and mouse-drag.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    touchStart.current = { x: e.clientX, t: Date.now() };
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dt = Date.now() - start.t;
    // Threshold: 40px, or fast flick (>0.6px/ms).
    if (Math.abs(dx) > 40 || Math.abs(dx) / Math.max(1, dt) > 0.6) {
      if (dx < 0) next();
      else prev();
    }
  };

  const s = slides[idx];
  const accent = s.accent ?? DEFAULT_ACCENTS[idx % DEFAULT_ACCENTS.length];

  const [dl, setDl] = useState<null | "pdf" | "pptx">(null);
  const download = async (kind: "pdf" | "pptx") => {
    if (dl) return;
    setDl(kind);
    try {
      if (kind === "pdf") await exportPdf(slides, title);
      else await exportPptx(slides, title);
    } catch (err) {
      console.warn(`[SlideShow] ${kind} export failed:`, err);
    } finally {
      setDl(null);
    }
  };

  return (
    <div className={className}>
    <div
      ref={containerRef}
      tabIndex={0}
      className={`relative rounded-xl overflow-hidden border border-yai-border bg-yai-navy select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-yai-orange ${
        isFull ? "w-screen h-screen rounded-none border-0" : ""
      }`}
      style={isFull ? undefined : { aspectRatio: "16 / 9" }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Slide surface — click centre to advance (does not overlap buttons). */}
      <button
        type="button"
        onClick={next}
        aria-label={`Next slide (${idx + 1} of ${total})`}
        className="absolute inset-0 w-full h-full text-white focus:outline-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${accent}55 0%, transparent 60%), linear-gradient(135deg, #0A1F47 0%, #1E4DAA 100%)`,
        }}
      >
        {/* Slide body — `key={idx}` gives every slide its own DOM node, so the
         *  fade-in CSS animation restarts on each change and stale content
         *  can't linger. No framer-motion / AnimatePresence involvement here
         *  because those caused the label to stop updating under rapid clicks.
         */}
        <div
          key={idx}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 slideshow-slide-fade"
        >
          <div
            className="font-extrabold leading-none tabular-nums"
            style={{ color: accent, fontSize: isFull ? "min(45vh, 30vw)" : "min(28vh, 20vw)" }}
          >
            {s.label}
          </div>
          {s.caption && (
            <div className="text-white/85 text-lg md:text-xl font-semibold text-center px-6 max-w-3xl">
              {s.caption}
            </div>
          )}
        </div>
      </button>

      {/* Top-left: section title (for fullscreen context) */}
      <div className="pointer-events-none absolute top-4 left-4 text-white/70 text-xs uppercase tracking-[0.22em] font-bold">
        {title}
      </div>

      {/* Top-right: fullscreen toggle */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggleFull(); }}
        aria-label={isFull ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {isFull ? (
            <>
              <path d="M9 4H5v4" /><path d="M15 4h4v4" /><path d="M9 20H5v-4" /><path d="M15 20h4v-4" />
            </>
          ) : (
            <>
              <path d="M4 9V5h4" /><path d="M20 9V5h-4" /><path d="M4 15v4h4" /><path d="M20 15v4h-4" />
            </>
          )}
        </svg>
      </button>

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>

      {/* Dot pagination + counter */}
      <div className="absolute bottom-4 inset-x-0 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(i, i > idx ? +1 : -1); }}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === idx}
              className="inline-flex items-center justify-center h-8 px-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-yai-orange rounded-md"
            >
              <span
                className="block h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 40 : 10,
                  background: i === idx ? accent : "rgba(255,255,255,0.35)",
                }}
              />
            </button>
          ))}
        </div>
        <div className="text-white/50 text-[11px] font-semibold tracking-wider">
          {idx + 1} / {total}
        </div>
      </div>
    </div>

    {/* Download row — landscape PDF + landscape PPTX. Hidden in fullscreen
     *  because there's nothing to click when the browser has taken over the
     *  viewport. Also hidden on paper since printing a slideshow already
     *  captures the content. */}
    {!isFull && (
      <div className="mt-3 flex justify-end gap-2 no-print">
        <button
          type="button"
          onClick={() => download("pdf")}
          disabled={dl !== null}
          className="inline-flex items-center gap-1.5 rounded-md border border-yai-border bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-yai-navy hover:border-yai-blue hover:text-yai-blue transition-colors disabled:opacity-50"
          aria-label={`Download ${title} as landscape PDF`}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
          {dl === "pdf" ? "Preparing…" : "PDF"}
        </button>
        <button
          type="button"
          onClick={() => download("pptx")}
          disabled={dl !== null}
          className="inline-flex items-center gap-1.5 rounded-md border border-yai-border bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-yai-navy hover:border-yai-orange hover:text-yai-orange transition-colors disabled:opacity-50"
          aria-label={`Download ${title} as landscape PowerPoint`}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
          {dl === "pptx" ? "Preparing…" : "PPTX"}
        </button>
      </div>
    )}
    </div>
  );
}
