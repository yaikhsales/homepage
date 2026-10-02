"use client";

import { useState } from "react";

const ORANGE = "#BF5730";

/* Two-sided card: the front is how the factory worked on paper, the back is
   what Claude does now. Client component only because it holds one boolean —
   keeping it out of page.tsx lets that file stay a server component and export
   metadata. */
export function Flip({ before, after }: { before: string; after: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-expanded={on}
      className="w-full text-left"
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative h-[208px] w-full transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: on ? "rotateY(180deg)" : "none" }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Before</p>
            <p className="mt-2 text-[15.5px] leading-relaxed text-slate-700">{before}</p>
          </div>
          <p className="text-[12.5px] font-semibold" style={{ color: ORANGE }}>
            Flip to see what Claude does →
          </p>
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-xl border p-5"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderColor: "rgba(191,87,48,.42)",
            backgroundColor: "rgba(217,119,87,.08)",
          }}
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: ORANGE }}>
              With Claude
            </p>
            <p className="mt-2 text-[15.5px] leading-relaxed text-slate-800">{after}</p>
          </div>
          <p className="text-[12.5px] font-semibold text-slate-500">← Flip back</p>
        </div>
      </div>
    </button>
  );
}
