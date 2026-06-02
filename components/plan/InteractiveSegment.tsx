"use client";

import { useState } from "react";
import { MilestoneRoadmap, type Milestone } from "./MilestoneRoadmap";

/**
 * Generic interactive market-segment block.
 * Pattern: header → grid of topic cards → active topic's pathway below.
 * Hover (or focus / click) any topic card to switch the pathway shown.
 * Used by Gov + Inst, Small factories, E-commerce, Non-garment segments.
 */

type Status = "done" | "progress" | "planned";

export type SegmentTopic = {
  num: string;           // "01", "02", ...
  d: string;             // headline date
  t: string;             // topic title
  n: string;             // short summary visible on card
  s: Status;             // overall status
  pathway: Milestone[];  // dedicated multi-stage story shown when selected
};

interface Props {
  tag: string;
  name: string;                 // can include &amp; — rendered via dangerouslySetInnerHTML
  reachable: string;
  desc: string;
  color: string;
  bg: string;
  topics: SegmentTopic[];
}

const STATUS_ICON: Record<Status, string> = { done: "✓", progress: "◐", planned: "○" };
const STATUS_COLOR: Record<Status, string> = { done: "#10B981", progress: "#F37021", planned: "#94A3B8" };

export function InteractiveSegment({ tag, name, reachable, desc, color, bg, topics }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = topics[activeIdx];

  return (
    <div className="rounded-xl border border-yai-border bg-white">
      {/* Segment header */}
      <div className="flex items-start gap-3 p-4 border-b border-yai-border rounded-t-xl" style={{ background: bg }}>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white"
              style={{ background: color }}
            >
              {tag}
            </span>
            <h4
              className="font-extrabold text-yai-navy text-base leading-tight"
              dangerouslySetInnerHTML={{ __html: name }}
            />
          </div>
          <p className="text-xs text-gray-700 leading-snug max-w-3xl">
            {desc} <strong>Hover any topic</strong> below to see its dedicated pathway.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-gray-500">Reachable</div>
          <div className="text-lg font-extrabold tabular-nums" style={{ color }}>{reachable}</div>
        </div>
      </div>

      {/* Topic cards — hover / focus / click to switch pathway below */}
      <ul className="px-4 pt-4 pb-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((p, i) => {
          const isActive = i === activeIdx;
          return (
            <li key={p.num}>
              <button
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                onClick={() => setActiveIdx(i)}
                className={`group w-full text-left flex items-start gap-2 text-xs rounded-lg p-2.5 transition-all duration-200 cursor-pointer focus:outline-none ${
                  isActive
                    ? "shadow-lg scale-[1.02] relative z-10"
                    : "hover:bg-gray-50"
                }`}
                style={
                  isActive
                    ? { background: "#FFFFFF", border: `2px solid ${color}` }
                    : { border: "2px solid transparent" }
                }
              >
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white font-extrabold text-[12px] shrink-0"
                  style={{ background: color }}
                >
                  {p.num}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white font-bold text-[9px] shrink-0"
                      style={{ background: STATUS_COLOR[p.s] }}
                    >
                      {STATUS_ICON[p.s]}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{p.d}</span>
                  </div>
                  <div className="font-bold text-yai-navy leading-tight">{p.t}</div>
                  <div className="text-gray-600 leading-snug mt-0.5">{p.n}</div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Active topic's pathway — switches as user hovers a card above */}
      <div
        className="px-4 pt-3 pb-4 border-t-2 mt-2"
        style={{ borderColor: `${color}40`, background: `${color}08` }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-gray-500">
              Pathway for
            </div>
            <div className="text-base font-extrabold" style={{ color }}>
              {active.t}
            </div>
          </div>
          <div className="text-[10px] text-gray-500 italic">
            Hover a topic above to switch · {active.pathway.length} stage{active.pathway.length === 1 ? "" : "s"}
          </div>
        </div>

        <MilestoneRoadmap milestones={active.pathway} color={color} />
      </div>
    </div>
  );
}
