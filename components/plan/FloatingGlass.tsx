"use client";

import { useEffect, useRef, useState } from "react";

/* Draggable floating glass card — empty for now.
 * User clicks-and-drags anywhere on the surface to reposition it.
 * Position persists in localStorage so it stays where you parked it. */

const PANEL_W = 336;   // +20% (was 280)
const PANEL_H = 780;   // +20% (was 650)

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
        className="relative rounded-3xl overflow-hidden touch-none cursor-grab active:cursor-grabbing transition-shadow"
        style={{
          width: `${PANEL_W}px`,
          height: `${PANEL_H}px`,
          maxWidth: "calc(100vw - 40px)",
          // Much lighter blur so text behind is still legible, no white wash.
          backdropFilter: "blur(8px) saturate(160%)",
          WebkitBackdropFilter: "blur(8px) saturate(160%)",
          // Nearly invisible tint — content behind dominates the look.
          background: "rgba(255, 255, 255, 0.04)",
          // Soft outer shadow for floating elevation; subtle inner highlight only.
          boxShadow:
            "0 20px 50px -20px rgba(10,31,71,0.3), 0 2px 6px rgba(10,31,71,0.05), inset 0 1px 0 rgba(255,255,255,0.45)",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        {/* Soft specular sheen at the top — only ~15% opacity so it doesn't block content */}
        <div
          className="absolute inset-x-0 top-0 h-[20%] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
          }}
        />
        {/* Left-edge highlight */}
        <div
          className="absolute inset-y-0 left-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.2) 70%, transparent 100%)",
          }}
        />
        {/* Right-edge highlight */}
        <div
          className="absolute inset-y-0 right-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.1) 70%, transparent 100%)",
          }}
        />
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
