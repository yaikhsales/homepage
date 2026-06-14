"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type SubCluster = { name: string; count: string };

type Cluster = {
  key: string;
  label: string;
  count: number;          // actual customer count (for the "total reachable" total)
  share: number;          // share of pie (percent — drives slice angle, independent of count)
  countLabel: string;
  color: string;
  range: string;
  detail: string;
  subClusters?: SubCluster[];
  pipeline?: string[];
  pipelineLabel?: string;
};

const CLUSTERS: Cluster[] = [
  {
    key: "garment",
    label: "Mid-size Cambodia factories",
    count: 800,
    share: 50,
    countLabel: "~800",
    color: "#1E4DAA",
    range: "$120 → $15,000 / yr",
    detail: "Garment, bag, footwear. ~300 may stop at Digitalization, ~500 climb the full ladder to Ai.",
  },
  {
    key: "ecom",
    label: "E-commerce cluster",
    count: 600,
    share: 10,
    countLabel: "~600",
    color: "#F37021",
    range: "Mixed pricing",
    detail: "Three sub-clusters across online commerce.",
    subClusters: [
      { name: "Small sales", count: "100,000 workers" },
      { name: "Service market", count: "~1,000 providers" },
      { name: "Factory supply market", count: "TBD" },
    ],
  },
  {
    key: "small",
    label: "Small factories",
    count: 200,
    share: 10,
    countLabel: "~200",
    color: "#4CC9F0",
    range: "$750 – $1,200 / yr",
    detail: "Cloud Growth / Enterprise comfort zone. Rarely escalate to dedicated server or Ai.",
  },
  {
    key: "nongarment",
    label: "Non-garment companies",
    count: 1000,
    share: 10,
    countLabel: "~1,000",
    color: "#06D6A0",
    range: "$120 – $750 / yr",
    detail: "Various industries using the administrative modules only. Cloud Starter to Cloud Growth.",
  },
  {
    key: "gov",
    label: "Government / Institutional Collaboration",
    count: 2500,
    share: 20,
    countLabel: "GOV + INST.",
    color: "#032EA1",
    range: "Partnership-based · projected biggest",
    detail: "First meeting with the Minister of Environment ✓ — Digital Audit collaboration agreed; the minister tasked his advisor to propose Yai for the ASEAN Tech Summit presentation. Government bodies + industry institutions together — projected to be the LARGEST cluster of all.",
    pipelineLabel: "Engagements lined up",
    pipeline: [
      "Ministry of Environment ✓",
      "Labour",
      "Industry",
      "Telecom",
      "Economics",
      "Commerce",
      "Digital Government",
      "ILO Better Work",
      "GMAC",
      "TAFTAC",
      "ASEAN Tech Summit",
    ],
  },
];

export function TargetCustomersChart() {
  const [hover, setHover] = useState<string | null>(null);
  const total = CLUSTERS.reduce((s, c) => s + c.count, 0);

  // Donut geometry — donut sits in the upper portion of the canvas, badges go below
  const cx = 160;
  const cy = 210;
  const R = 140;
  const r = 80;
  const shareTotal = CLUSTERS.reduce((s, c) => s + c.share, 0);
  let cumulative = -Math.PI / 2; // start at 12 o'clock

  const segs = CLUSTERS.map((c) => {
    const angle = (c.share / shareTotal) * 2 * Math.PI;
    const start = cumulative;
    const end = start + angle;
    cumulative = end;

    const sX = cx + R * Math.cos(start);
    const sY = cy + R * Math.sin(start);
    const eX = cx + R * Math.cos(end);
    const eY = cy + R * Math.sin(end);
    const isX = cx + r * Math.cos(start);
    const isY = cy + r * Math.sin(start);
    const ieX = cx + r * Math.cos(end);
    const ieY = cy + r * Math.sin(end);

    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${sX} ${sY} A ${R} ${R} 0 ${largeArc} 1 ${eX} ${eY} L ${ieX} ${ieY} A ${r} ${r} 0 ${largeArc} 0 ${isX} ${isY} Z`;

    // Count label position — inside the slice
    const midAngle = (start + end) / 2;
    const lr = (R + r) / 2;
    const labelX = cx + lr * Math.cos(midAngle);
    const labelY = cy + lr * Math.sin(midAngle);

    // Outer arc points (for leader lines)
    const outerMidX = cx + R * Math.cos(midAngle);
    const outerMidY = cy + R * Math.sin(midAngle);

    return { ...c, path, labelX, labelY, angle, sX, sY, eX, eY, outerMidX, outerMidY };
  });

  // E-commerce slice — used to anchor leader lines from floating badges
  const ecom = segs.find((s) => s.key === "ecom");

  const govCluster = CLUSTERS.find((c) => c.key === "gov")!;
  const otherClusters = CLUSTERS.filter((c) => c.key !== "gov");

  const renderClusterCard = (c: Cluster) => (
    <div
      key={c.key}
      onMouseEnter={() => setHover(c.key)}
      onMouseLeave={() => setHover(null)}
      className={`p-2.5 rounded-lg border bg-white transition-shadow ${hover === c.key ? "shadow-md ring-1" : "border-yai-border"}`}
      style={hover === c.key ? { ["--tw-ring-color" as string]: c.color, borderColor: c.color } : undefined}
    >
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
        <span className="font-bold text-yai-navy text-sm leading-tight">{c.label}</span>
        <span className="ml-auto text-xs font-extrabold" style={{ color: c.color }}>{c.countLabel}</span>
      </div>
      <div className="text-[11px] text-gray-500 mt-1 ml-5 leading-snug">
        <span className="font-semibold text-gray-700">{c.range}</span> · {c.detail}
      </div>
      {c.subClusters && (
        <div className="flex flex-wrap gap-1 mt-1.5 ml-5">
          {c.subClusters.map((sc) => (
            <span key={sc.name} className="text-[10px] px-2 py-0.5 bg-orange-50 text-yai-orange border border-yai-orange/30 rounded-full">
              {sc.name} <span className="font-extrabold">· {sc.count}</span>
            </span>
          ))}
        </div>
      )}
      {c.pipeline && (
        <div className="mt-1.5 ml-5">
          <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: c.color }}>
            {c.pipelineLabel ?? "Pipeline"}
          </div>
          <div className="flex flex-wrap gap-1">
            {c.pipeline.map((p) => (
              <span
                key={p}
                className="text-[10px] px-2 py-0.5 rounded-full border bg-white"
                style={{ borderColor: c.color, color: c.color }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* 12-col grid — Gov featured 5/12 on left, Donut + badges 7/12 on right (more room so badges don't collide) */}
      <div className="grid lg:grid-cols-12 gap-4 items-start">
        {/* Left column (5/12): Gov featured + first 2 other clusters */}
        <div className="lg:col-span-5 space-y-3">
          {renderClusterCard(govCluster)}
          {renderClusterCard(otherClusters[0])}
          {renderClusterCard(otherClusters[1])}
        </div>

        {/* Right column (7/12): Donut + floating badges, then 2 remaining cluster cards below */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative">
          <svg viewBox="0 0 500 460" className="w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Cambodian-flag horizontal bands for the Government / Institutional slice */}
            <linearGradient id="govFlag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CE1126" />
              <stop offset="25%" stopColor="#CE1126" />
              <stop offset="30%" stopColor="#032EA1" />
              <stop offset="70%" stopColor="#032EA1" />
              <stop offset="75%" stopColor="#CE1126" />
              <stop offset="100%" stopColor="#CE1126" />
            </linearGradient>
          </defs>
          {segs.map((s) => (
            <g
              key={s.key}
              onMouseEnter={() => setHover(s.key)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer", transition: "opacity 0.2s, transform 0.2s", transformOrigin: `${cx}px ${cy}px` }}
              opacity={hover && hover !== s.key ? 0.4 : 1}
              transform={hover === s.key ? "scale(1.03)" : undefined}
            >
              <path d={s.path} fill={s.key === "gov" ? "url(#govFlag)" : s.color} stroke="#fff" strokeWidth="2" />
              {s.angle > 0.25 && (
                s.key === "gov" ? (
                  <text x={s.labelX} y={s.labelY} textAnchor="middle" fill="#fff" className="text-[11px] font-extrabold pointer-events-none">
                    <tspan x={s.labelX} dy="-6">GOV +</tspan>
                    <tspan x={s.labelX} dy="13">INST.</tspan>
                  </text>
                ) : (
                  <text x={s.labelX} y={s.labelY} textAnchor="middle" dominantBaseline="middle" fill="#fff" className="text-[12px] font-extrabold pointer-events-none">
                    {s.countLabel}
                  </text>
                )
              )}
            </g>
          ))}
          {/* Leader lines — all three fan from the slice's outer-arc midpoint (outside the slice body, doesn't cover the ~600 label) */}
          {ecom && (
            <g stroke="#F37021" strokeWidth="2" strokeDasharray="4 3" fill="none">
              <line x1={ecom.outerMidX} y1={ecom.outerMidY} x2={60} y2={400} />
              <line x1={ecom.outerMidX} y1={ecom.outerMidY} x2={250} y2={400} />
              <line x1={ecom.outerMidX} y1={ecom.outerMidY} x2={440} y2={400} />
            </g>
          )}
          {/* Center total */}
          <g transform={`translate(${cx} ${cy})`}>
            <text textAnchor="middle" y="-8" className="fill-gray-500 text-[10px] uppercase tracking-widest font-bold">Total reachable</text>
            <text textAnchor="middle" y="16" className="fill-yai-blue text-[24px] font-extrabold">~{total.toLocaleString()}</text>
            <text textAnchor="middle" y="34" className="fill-gray-400 text-[10px]">customers</text>
          </g>
        </svg>

        {/* Floating badges — spread along the top edge, left → center → right */}
        <motion.div
          className="absolute z-10 bg-white border-2 border-yai-orange rounded-lg shadow-lg px-3 py-2"
          style={{ top: `${(400 / 460) * 100}%`, left: `${(60 / 500) * 100}%`, transform: "translate(-50%, -50%)" }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-yai-orange leading-none">Small sales</div>
          <div className="text-yai-navy font-extrabold text-lg leading-none mt-1">100,000</div>
          <div className="text-[10px] font-semibold text-gray-500 leading-none mt-1">workers</div>
        </motion.div>
        <motion.div
          className="absolute z-10 bg-white border-2 border-yai-orange rounded-lg shadow-lg px-3 py-2"
          style={{ top: `${(400 / 460) * 100}%`, left: `${(250 / 500) * 100}%`, transform: "translate(-50%, -50%)" }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-yai-orange leading-none">Service market</div>
          <div className="text-yai-navy font-extrabold text-lg leading-none mt-1">~1,000</div>
          <div className="text-[10px] font-semibold text-gray-500 leading-none mt-1">to all factories</div>
        </motion.div>
        <motion.div
          className="absolute z-10 bg-white border-2 border-dashed border-yai-orange/60 rounded-lg shadow-md px-3 py-2"
          style={{ top: `${(400 / 460) * 100}%`, left: `${(440 / 500) * 100}%`, transform: "translate(-50%, -50%)" }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-yai-orange leading-none">Factory supply</div>
          <div className="text-gray-400 font-extrabold text-lg leading-none mt-1">TBD</div>
          <div className="text-[10px] font-semibold text-gray-400 leading-none mt-1">market</div>
        </motion.div>
          </div>
          {renderClusterCard(otherClusters[2])}
          {renderClusterCard(otherClusters[3])}
        </div>
      </div>
    </div>
  );
}
