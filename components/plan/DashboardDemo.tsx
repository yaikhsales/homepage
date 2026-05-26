"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.4,
  trigger,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  trigger: boolean;
}) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (latest) =>
    `${prefix}${latest.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`
  );
  useEffect(() => {
    if (!trigger) return;
    const ctl = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return ctl.stop;
  }, [trigger, value, duration, mv]);
  return <motion.span>{display}</motion.span>;
}

// Sparkline data — fake trend (factory output last 14 days)
const TREND = [42, 45, 41, 48, 52, 49, 55, 58, 56, 62, 64, 61, 68, 72];

function Sparkline({ trigger }: { trigger: boolean }) {
  const max = Math.max(...TREND);
  const min = Math.min(...TREND);
  const range = max - min || 1;
  const W = 280;
  const H = 70;
  const stepX = W / (TREND.length - 1);
  const pts = TREND.map((v, i) => {
    const x = i * stepX;
    const y = H - ((v - min) / range) * (H - 10) - 5;
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${path} L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F37021" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F37021" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#spark-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: trigger ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#F37021"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: trigger ? 1 : 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {trigger &&
        pts.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={i === pts.length - 1 ? 3.5 : 0}
            fill="#F37021"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, duration: 0.3 }}
          />
        ))}
    </svg>
  );
}

const ACTIVITY = [
  { time: "09:42", text: "Compliance — WRAP evidence pack auto-updated (Line 3)" },
  { time: "09:31", text: "Payroll — March run posted to ABA, 2,184 workers paid" },
  { time: "09:18", text: "HR — 7 new contracts e-signed via Khmer mobile app" },
  { time: "09:02", text: "Finance — VAT filing draft prepared (March)" },
  { time: "08:47", text: "Logistics — Inbound shipment SH-2918 reconciled" },
];

export function DashboardDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setActivityIndex(0);
    const t = setInterval(() => {
      setActivityIndex((i) => Math.min(i + 1, ACTIVITY.length));
    }, 600);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div ref={ref} className="rounded-2xl bg-white border border-yai-border shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-yai-border bg-yai-bg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-yai-blue flex items-center justify-center text-white font-bold text-xs">
            Y
          </div>
          <div className="text-yai-navy font-semibold text-sm">Admin Dashboard — Factory A</div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      <div className="p-5 sm:p-6 grid lg:grid-cols-3 gap-5">
        {/* Stat tiles */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-4 rounded-xl border border-yai-border"
          >
            <div className="text-[10.5px] uppercase tracking-wider font-bold text-gray-500 mb-1">
              Workers active today
            </div>
            <div className="text-3xl font-extrabold text-yai-navy tabular-nums">
              <AnimatedNumber value={2184} trigger={inView} />
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">+38 vs avg</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 rounded-xl border border-yai-border"
          >
            <div className="text-[10.5px] uppercase tracking-wider font-bold text-gray-500 mb-1">
              Audit readiness
            </div>
            <div className="text-3xl font-extrabold text-yai-blue tabular-nums">
              <AnimatedNumber value={92} suffix="%" trigger={inView} />
            </div>
            <div className="text-[11px] text-gray-500 font-semibold mt-1">WRAP, BSCI, ILO</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-4 rounded-xl border border-yai-border"
          >
            <div className="text-[10.5px] uppercase tracking-wider font-bold text-gray-500 mb-1">
              Payroll this period
            </div>
            <div className="text-3xl font-extrabold text-yai-navy tabular-nums">
              <AnimatedNumber value={1.42} prefix="$" suffix="M" decimals={2} trigger={inView} />
            </div>
            <div className="text-[11px] text-gray-500 font-semibold mt-1">ABA + Wing posted</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-4 rounded-xl border border-yai-border"
          >
            <div className="text-[10.5px] uppercase tracking-wider font-bold text-gray-500 mb-1">
              Exceptions flagged
            </div>
            <div className="text-3xl font-extrabold text-yai-navy tabular-nums">
              <AnimatedNumber value={3} trigger={inView} />
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">All resolved</div>
          </motion.div>

          {/* Sparkline tile spans both columns */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-2 p-4 rounded-xl border border-yai-border"
          >
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <div className="text-[10.5px] uppercase tracking-wider font-bold text-gray-500">
                  Output index — last 14 days
                </div>
                <div className="text-2xl font-extrabold text-yai-navy tabular-nums">
                  <AnimatedNumber value={72} trigger={inView} />
                </div>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">▲ 14%</div>
            </div>
            <Sparkline trigger={inView} />
          </motion.div>
        </div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 12 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-xl border border-yai-border p-4 bg-yai-bg/40"
        >
          <div className="text-[10.5px] uppercase tracking-wider font-bold text-gray-500 mb-3 flex items-center justify-between">
            <span>Agent activity</span>
            <span className="text-yai-blue">Live</span>
          </div>
          <div className="space-y-2">
            {ACTIVITY.slice(0, activityIndex).map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="flex gap-2 text-[12px] leading-relaxed"
              >
                <span className="text-gray-400 font-mono tabular-nums shrink-0">{a.time}</span>
                <span className="text-gray-700">{a.text}</span>
              </motion.div>
            ))}
            {activityIndex === 0 && (
              <div className="text-[12px] text-gray-400 italic">Waiting for events…</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
