"use client";

/* Empty floating glass card — for visual review only.
 * No fixed positioning, no pinning, no content inside.
 * Sits inline at the top of the main content with a glassmorphism look. */

export function FloatingGlass() {
  return (
    <div className="my-4 no-print">
      <div
        className="rounded-2xl backdrop-blur-xl bg-white/55 ring-1 ring-white/60 border border-white/40 shadow-[0_10px_40px_-10px_rgba(10,31,71,0.35)]"
        style={{
          width: "280px",
          height: "650px",
          maxWidth: "100%",
        }}
      >
        {/* empty — just the glass surface so you can judge the look */}
      </div>
    </div>
  );
}
