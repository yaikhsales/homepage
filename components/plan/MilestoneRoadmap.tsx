"use client";

/* Graphical milestone roadmap — ascending diagonal ribbon with rainbow gradient.
 * Each milestone = a colored circle with a number, alternating cards above/below
 * connected via dashed lines. Inspired by the classic "creative timeline" template
 * (yellow→red→orange→teal→blue→pink→purple progression). */

export type Activity = {
  week?: 1 | 2 | 3 | 4 | 5;                 // 1–5 = week of the month; omit if not week-specific
  title: string;
  note?: string;
  status?: "done" | "progress" | "planned";
};

export type Milestone = {
  d: string;                                // date label, e.g. "Q2 2026" or "Jun 2026"
  t: string;                                // milestone title (or month title when monthLabel is set)
  s: "done" | "progress" | "planned";
  n?: string;                               // short description (not shown in card; reserved)
  sub?: string[];                           // optional numbered sub-items (e.g. factory names)
  monthLabel?: string;                      // e.g. "06-26" — overrides the sequential pin number with a month code
  activities?: Activity[];                  // optional multi-activity breakdown (weekly bullets in the card)
};

interface Props {
  milestones: Milestone[];
  color: string;        // accent / segment colour (used for card borders + dashed lines)
  bgColor?: string;     // optional background tint
}

const STATUS = {
  done:     { icon: "✓", bg: "#10B981" },
  progress: { icon: "◐", bg: "#F37021" },
  planned:  { icon: "○", bg: "#94A3B8" },
};

// Vibrant rainbow palette — circle colours cycle through this
const RAINBOW = [
  "#FBBF24", // yellow
  "#EF4444", // red
  "#F97316", // orange
  "#14B8A6", // teal
  "#3B82F6", // blue
  "#EC4899", // pink
  "#8B5CF6", // purple
  "#10B981", // green
];

export function MilestoneRoadmap({ milestones, color, bgColor }: Props) {
  const N = milestones.length;

  // Viewbox geometry — ascending diagonal.
  // LEFT_PAD / RIGHT_PAD ≥ cardW/2 + safety, otherwise the first/last cards clip the viewBox.
  const VB_W = 1200;
  const VB_H = 480;
  const LEFT_PAD = 130;
  const RIGHT_PAD = 130;
  const TOP_PAD = 240;          // top of leftmost circle (path ENDS here on the right)
  const BOTTOM_PAD = 240;       // baseline for leftmost circle
  // Path ascends from bottom-left to top-right
  const xStart = LEFT_PAD;
  const yStart = VB_H - BOTTOM_PAD;
  const xEnd   = VB_W - RIGHT_PAD;
  const yEnd   = TOP_PAD - 40;
  const usable = xEnd - xStart;
  const step = N > 1 ? usable / (N - 1) : 0;
  const xAt = (i: number) => xStart + i * step;
  const yAt = (i: number) => {
    if (N <= 1) return (yStart + yEnd) / 2;
    return yStart + ((yEnd - yStart) * i) / (N - 1);
  };

  const PIN_R = 30;
  const cardW = Math.max(150, Math.min(230, step - 12));
  // Card grows if any milestone has sub-items OR multi-week activities
  const hasSubs = milestones.some((m) => m.sub && m.sub.length > 0);
  const hasActs = milestones.some((m) => m.activities && m.activities.length > 0);
  const cardH = hasActs ? 200 : hasSubs ? 180 : 120;
  // Anyone using monthLabel? → pin font drops slightly to fit "06-26" cleanly
  const hasMonthLabels = milestones.some((m) => !!m.monthLabel);

  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ background: bgColor || "transparent" }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full">
        <defs>
          <linearGradient id="ribbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FBBF24" stopOpacity="0.4" />
            <stop offset="20%"  stopColor="#EF4444" stopOpacity="0.4" />
            <stop offset="40%"  stopColor="#F97316" stopOpacity="0.4" />
            <stop offset="60%"  stopColor="#14B8A6" stopOpacity="0.4" />
            <stop offset="80%"  stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Ribbon path — wide soft band ascending diagonally */}
        <path
          d={`M ${xStart - 20} ${yStart + 35}
              L ${xEnd + 20} ${yEnd + 35}
              L ${xEnd + 20} ${yEnd - 35}
              L ${xStart - 20} ${yStart - 35} Z`}
          fill="url(#ribbonGrad)"
        />

        {/* Milestone pins + cards */}
        {milestones.map((m, i) => {
          const x = xAt(i);
          const y = yAt(i);
          const above = i % 2 === 0;          // alternate: even=above, odd=below
          const cardY = above ? y - cardH - 60 : y + 60;
          const cardX = x - cardW / 2;
          const lineY1 = above ? y - PIN_R : y + PIN_R;
          const lineY2 = above ? cardY + cardH : cardY;
          const ringColor = RAINBOW[i % RAINBOW.length];
          const st = STATUS[m.s];

          return (
            <g key={i}>
              {/* Dashed connector line from pin to card */}
              <line
                x1={x} y1={lineY1}
                x2={x} y2={lineY2}
                stroke={ringColor}
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Card with dashed coloured border — larger fonts now that we have room */}
              <foreignObject x={cardX} y={cardY} width={cardW} height={cardH}>
                <div
                  className="w-full h-full rounded-lg bg-white px-3 py-2.5 flex flex-col gap-1 overflow-hidden"
                  style={{
                    border: `2px dashed ${ringColor}`,
                  }}
                >
                  <div className="text-[13px] uppercase tracking-wider font-extrabold" style={{ color: ringColor }}>
                    {m.d}
                  </div>
                  <div className="text-[14px] font-extrabold text-yai-navy leading-snug break-words">{m.t}</div>
                  {/* Activities — weekly breakdown of multiple things happening this month */}
                  {m.activities && m.activities.length > 0 && (
                    <ul className="mt-1 flex flex-col gap-0.5 text-[11px] leading-snug">
                      {m.activities.map((a, j) => {
                        const aStatus = a.status ?? m.s;
                        const stMark = aStatus === "done" ? "✓" : aStatus === "progress" ? "◐" : "○";
                        const stColor = aStatus === "done" ? "#10B981" : aStatus === "progress" ? "#F37021" : "#94A3B8";
                        return (
                          <li key={j} className="flex items-start gap-1.5">
                            {a.week ? (
                              <span
                                className="inline-flex items-center justify-center text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.5 rounded text-white shrink-0 mt-0.5"
                                style={{ background: ringColor }}
                              >
                                W{a.week}
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center justify-center w-4 h-4 rounded-full font-bold text-[10px] shrink-0 mt-0.5"
                                style={{ color: stColor }}
                              >
                                {stMark}
                              </span>
                            )}
                            <span className="break-words text-yai-navy font-semibold">{a.title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {m.sub && m.sub.length > 0 && (
                    <ol className="mt-1 flex flex-col gap-0.5 text-[12px] leading-snug">
                      {m.sub.map((s, j) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <span
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white font-bold text-[9px] shrink-0 mt-0.5"
                            style={{ background: ringColor }}
                          >
                            {j + 1}
                          </span>
                          <span className={`break-words ${s ? "text-yai-navy font-semibold" : "text-gray-300 italic"}`}>
                            {s || "—"}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </foreignObject>

              {/* Pin circle — vibrant ring colour */}
              <circle cx={x} cy={y} r={PIN_R + 4} fill="#FFFFFF" />
              <circle cx={x} cy={y} r={PIN_R} fill={ringColor} />
              {/* Pin label — either monthLabel ("06-26") or sequential number ("01") */}
              <text
                x={x}
                y={y + 2}
                fontSize={m.monthLabel ? "16" : "22"}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#FFFFFF"
                fontWeight="900"
              >
                {m.monthLabel ?? String(i + 1).padStart(2, "0")}
              </text>

              {/* Status badge on circle edge */}
              <circle cx={x + PIN_R - 4} cy={y - PIN_R + 4} r={9} fill="#FFFFFF" stroke={st.bg} strokeWidth="2" />
              <text
                x={x + PIN_R - 4}
                y={y - PIN_R + 6}
                fontSize="12"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={st.bg}
                fontWeight="900"
              >
                {st.icon}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
