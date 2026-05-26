"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type CardProps = HTMLMotionProps<"div"> & {
  hover?: boolean;
  fillFromScroll?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className = "", hover = true, ...rest },
  ref
) {
  return (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -3, boxShadow: "0 14px 36px -12px rgba(10,37,64,0.18)" } : undefined}
      transition={{ duration: 0.2 }}
      className={`bg-white border border-yai-border rounded-xl p-6 transition-colors hover:border-yai-blue/30 ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

export function Badge({
  variant = "default",
  children,
}: {
  variant?: "live" | "pilot" | "build" | "default";
  children: React.ReactNode;
}) {
  const styles = {
    live:    "bg-emerald-50 text-emerald-700",
    pilot:   "bg-amber-50 text-amber-700",
    build:   "bg-indigo-50 text-indigo-700",
    default: "bg-gray-100 text-gray-600",
  } as const;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
