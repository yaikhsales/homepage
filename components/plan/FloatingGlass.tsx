"use client";

import { useEffect, useRef, useState } from "react";

/* Draggable floating glass card — empty for now.
 * User clicks-and-drags anywhere on the surface to reposition it.
 * Position persists in localStorage so it stays where you parked it. */

const PANEL_W = 280;
const PANEL_H = 650;

export function FloatingGlass() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: 30, y: 80 });
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  // Restore saved position on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("yai-glass-pos");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (typeof p.x === "number" && typeof p.y === "number") {
          setPos(clamp(p.x, p.y));
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Persist position
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("yai-glass-pos", JSON.stringify(pos));
  }, [pos, mounted]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Don't start drag if user is interacting with form/buttons inside the panel
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, textarea, select")) return;

    e.preventDefault();
    dragRef.current = {
      dragging: true,
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    setPos(clamp(e.clientX - dragRef.current.offsetX, e.clientY - dragRef.current.offsetY));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current.dragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed z-40 no-print select-none"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="rounded-2xl backdrop-blur-xl bg-white/55 ring-1 ring-white/60 border border-white/40 shadow-[0_10px_40px_-10px_rgba(10,31,71,0.35)] touch-none cursor-grab active:cursor-grabbing transition-shadow hover:shadow-[0_15px_50px_-10px_rgba(10,31,71,0.45)]"
        style={{ width: `${PANEL_W}px`, height: `${PANEL_H}px`, maxWidth: "calc(100vw - 40px)" }}
      >
        {/* empty body — drag from anywhere on the surface */}
      </div>
    </div>
  );
}

function clamp(x: number, y: number) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  // Allow the panel to slide partly off-screen, but keep at least 60px visible
  return {
    x: Math.max(-(PANEL_W - 80), Math.min(vw - 80, x)),
    y: Math.max(0, Math.min(vh - 80, y)),
  };
}
