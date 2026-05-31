"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Split = { pct: number; color: string; label: string; description?: string };
type Cluster = {
  num: number;
  name: string;
  sub: string[];
  bg: string;
  badge: string;
  splits?: Split[];
  avatars?: number[]; // agent-N image indices — shown as mini face row inside the circle
};

const CLUSTERS: Cluster[] = [
  {
    num: 1,
    name: "Texlink Admin",
    sub: ["Admin", "HR", "Sales", "Training"],
    bg: "linear-gradient(135deg, #1E4DAA, #143C8C)",
    badge: "bg-white text-yai-blue",
    splits: [
      { pct: 60, color: "#1E4DAA", label: "Garment floor",   description: "Most of the team has lived inside real factories — they build for people they used to sit next to." },
      { pct: 20, color: "#F37021", label: "SW + Ai cert",    description: "Modern-stack engineers, formally certified on Claude — the Ai layer is built by people who know how Ai actually works." },
      { pct: 20, color: "#2D9D9A", label: "Dual role",       description: "Engineers who also run pieces of the factory operation — close-to-the-floor product feedback every day." },
    ],
    // 5 key members — 3 male (1, 3, 8) + 2 female (6 short-bob, 9 long hair)
    avatars: [1, 3, 8, 6, 9],
  },
  {
    num: 2,
    name: "Architecture",
    sub: ["HR systems", "Pay systems"],
    bg: "linear-gradient(135deg, #F37021, #D85F18)",
    badge: "bg-white text-yai-orange",
    splits: [
      { pct: 60, color: "#F37021", label: "Software dev",         description: "Core platform engineering — frameworks, APIs, data models, the structural backbone every other module builds on." },
      { pct: 30, color: "#1E4DAA", label: "AMD + NVIDIA Ai cert", description: "Certified on AMD and NVIDIA Ai stacks — the hardware-aware side of the Ai workload." },
    ],
  },
  {
    num: 3,
    name: "Neural Net + Finance",
    sub: ["Financial", "Administration"],
    bg: "linear-gradient(135deg, #0A3327, #1A5742)",
    badge: "bg-amber-400 text-[#0A3327]",
    splits: [
      { pct: 70, color: "#0A3327", label: "Software dev",   description: "Building the Ai neural-network layer and the financial modules — model-aware engineering at the core of the platform." },
      { pct: 30, color: "#1E4DAA", label: "NVIDIA Ai cert", description: "Certified on the NVIDIA Ai stack — tuned for the training and inference workloads behind Yai's neural-network layer." },
    ],
  },
  {
    num: 4,
    name: "Mobile Apps",
    sub: ["Android", "iOS", "Worker apps"],
    bg: "linear-gradient(135deg, #4FB6B2, #2D9D9A)",
    badge: "bg-white text-[#2D9D9A]",
    splits: [
      { pct: 60, color: "#2D9D9A", label: "Mobile app dev",        description: "Native Android and iOS engineering — worker, supervisor and owner apps built to run on the factory floor in real conditions." },
      { pct: 20, color: "#6D4FB6", label: "AIoT + Robotics net.",  description: "Connecting sensors, machines and AGV / robotic carts to the platform — the AIoT and on-floor robotics networking layer." },
      { pct: 20, color: "#D4A017", label: "Qualcomm Ai cert",     description: "Certified on the Qualcomm Ai stack — on-device Ai inference for mobile and edge workloads, tuned for Snapdragon hardware." },
    ],
  },
  {
    num: 5,
    name: "Operations Systems",
    sub: ["Production", "QA", "MRP", "YPI", "YTM"],
    bg: "linear-gradient(135deg, #0A1F47, #143C8C)",
    badge: "bg-white text-yai-navy",
    splits: [
      { pct: 80, color: "#0A1F47", label: "Software dev",   description: "Production, QA, MRP, YPI and YTM modules — the operations engine that runs the factory floor in real time." },
      { pct: 20, color: "#1E4DAA", label: "NVIDIA Ai cert", description: "Certified on the NVIDIA Ai stack — Ai-driven production planning, defect detection and inference at the edge." },
    ],
  },
];

const PILLAR_HEIGHT = 300; // px

export function TeamClusters() {
  const [selected, setSelected] = useState<number>(1);
  const cluster = CLUSTERS.find((c) => c.num === selected)!;

  return (
    <>
      {/* Row of 5 cluster pillars — clickable selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-6 justify-items-center">
        {CLUSTERS.map((c) => {
          const isActive = selected === c.num;
          return (
            <button
              key={c.num}
              onClick={() => setSelected(c.num)}
              className={`flex flex-col items-center w-full max-w-[140px] focus:outline-none transition-transform ${isActive ? "scale-[1.04]" : "hover:scale-[1.02] opacity-90 hover:opacity-100"}`}
            >
              {/* Round on top */}
              <div
                className={`w-[110px] h-[110px] rounded-full shadow-lg flex flex-col items-center justify-center text-white text-center p-3 relative z-10 transition-shadow ${isActive ? "ring-4 ring-amber-300 ring-offset-2" : ""}`}
                style={{ background: c.bg }}
              >
                <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${c.badge}`}>
                  Group {c.num}
                </span>
                <div className="font-extrabold text-[12px] leading-tight mt-1.5 px-1">{c.name}</div>
                {c.avatars && c.avatars.length > 0 && (
                  <div className="flex items-center -space-x-1.5 mt-1.5">
                    {c.avatars.map((n) => (
                      <img
                        key={n}
                        src={`/images/generated/agent-${n}.png?v=3`}
                        alt=""
                        draggable={false}
                        className="w-[18px] h-[18px] rounded-full ring-[1.5px] ring-white object-cover shadow-sm select-none"
                      />
                    ))}
                  </div>
                )}
                <div className="text-[8px] mt-1 opacity-85 leading-tight px-1">{c.sub.join(" · ")}</div>
              </div>

              {/* Pillar */}
              <div className="w-[88px] rounded-b-2xl overflow-hidden shadow-lg -mt-4 border border-white">
                {c.splits ? (
                  (() => {
                    const total = c.splits.reduce((s, x) => s + x.pct, 0);
                    return c.splits.map((s, i) => (
                      <div
                        key={i}
                        className="text-white flex flex-col items-center justify-center px-2 text-center"
                        style={{ background: s.color, height: `${(s.pct / total) * PILLAR_HEIGHT}px` }}
                      >
                        <div className={s.pct >= 40 ? "text-3xl font-extrabold leading-none" : "text-xl font-extrabold leading-none"}>{s.pct}%</div>
                        <div className={s.pct >= 40 ? "text-[10px] font-bold mt-1.5 leading-tight" : "text-[9px] font-bold mt-1 leading-tight"}>{s.label}</div>
                      </div>
                    ));
                  })()
                ) : (
                  <div
                    className="bg-gray-100 text-gray-400 flex flex-col items-center justify-center px-2 text-center border-2 border-dashed border-gray-300"
                    style={{ height: `${PILLAR_HEIGHT}px` }}
                  >
                    <div className="text-xl font-extrabold leading-none">TBD</div>
                    <div className="text-[9px] mt-2 leading-tight">tell me the mix</div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Animated single detail panel for the selected cluster */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cluster.num}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-8"
        >
          <h4 className="font-bold text-yai-navy text-sm mb-3">
            Group {cluster.num} · {cluster.name} — experience mix detail
          </h4>
          {cluster.splits ? (
            <div className="grid sm:grid-cols-3 gap-3">
              {cluster.splits.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + i * 0.08, ease: "easeOut" }}
                  className="rounded-lg overflow-hidden border border-yai-border bg-white shadow-sm"
                >
                  <div className="text-white font-extrabold text-2xl px-4 py-2.5" style={{ background: s.color }}>
                    {s.pct}% <span className="text-xs font-bold opacity-90 ml-1">· {s.label}</span>
                  </div>
                  {s.description && (
                    <p className="text-xs text-gray-600 leading-snug p-3">{s.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic py-4 text-center border-2 border-dashed border-yai-border rounded-lg">
              Tell me the experience mix for this cluster and I&apos;ll wire it in.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="text-xs text-gray-400 italic mt-3 text-center">
        Tap any cluster above to see its experience mix.
      </p>
    </>
  );
}
