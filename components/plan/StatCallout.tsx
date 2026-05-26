"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

export function StatCallout({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  orange = false,
  duration = 1.4,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  orange?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (latest) =>
    `${prefix}${latest.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, value, duration, motionVal]);

  return (
    <div ref={ref} className="card group">
      <motion.div
        className={`font-extrabold text-4xl sm:text-5xl leading-none tracking-tight ${
          orange ? "text-yai-blue" : "text-yai-navy"
        }`}
      >
        <motion.span>{display}</motion.span>
      </motion.div>
      <div className="text-[0.78rem] text-gray-500 uppercase tracking-wider mt-2 font-semibold">
        {label}
      </div>
    </div>
  );
}
