"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrintMode } from "@/lib/usePrintMode";

type Split = { pct: number; color: string; label: string; description?: string };
type Member = { alias: string; name: string; lead?: boolean; support?: boolean };
type Cluster = {
  num: number;
  name: string;
  sub: string[];
  bg: string;
  badge: string;
  splits?: Split[];
  members?: Member[];  // real team — portraits served from /images/team/portraits/{alias}.png
};

const CLUSTERS: Cluster[] = [
  {
    num: 1,
    name: "Texlink Sales & Admin",
    sub: ["Admin", "HR", "Sales", "Training"],
    bg: "linear-gradient(135deg, #1E4DAA, #143C8C)",
    badge: "bg-white text-yai-blue",
    splits: [
      { pct: 60, color: "#1E4DAA", label: "Garment floor",   description: "Most of the team has lived inside real factories — they build for people they used to sit next to." },
      { pct: 20, color: "#F37021", label: "SW + Ai cert",    description: "Modern-stack engineers, formally certified on Claude — the Ai layer is built by people who know how Ai actually works." },
      { pct: 20, color: "#2D9D9A", label: "Dual role",       description: "Engineers who also run pieces of the factory operation — close-to-the-floor product feedback every day." },
    ],
    members: [
      { alias: "daly",   name: "Pich Daly",        lead: true },
      { alias: "phanny", name: "Koem Phanny" },
      { alias: "khun",   name: "Sin Khun" },
      // Technical support — primary cluster is elsewhere, they assist Admin/HR
      { alias: "chhay",  name: "Chhang Mengchhay", support: true },
      { alias: "noch",   name: "Dot Sreynach",     support: true },
    ],
  },
  {
    num: 2,
    name: "Architecture",
    sub: ["HR systems", "Pay systems"],
    bg: "linear-gradient(135deg, #F37021, #D85F18)",
    badge: "bg-white text-yai-orange",
    splits: [
      { pct: 70, color: "#F37021", label: "Software dev",         description: "Core platform engineering — frameworks, APIs, data models, the structural backbone every other module builds on." },
      { pct: 30, color: "#1E4DAA", label: "AMD + NVIDIA Ai cert", description: "Certified on AMD and NVIDIA Ai stacks — the hardware-aware side of the Ai workload." },
    ],
    members: [
      { alias: "rich",    name: "Peang Sereysothirich", lead: true },
      { alias: "thida",   name: "Voun Thida" },
      { alias: "michael", name: "Van Phanith" },
      { alias: "sam",     name: "Ton Noeun" },
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
    members: [
      { alias: "virot",     name: "Van Virot", lead: true },
      { alias: "menghorng", name: "Sobon Menghorng" },
      { alias: "seangleng", name: "Chhim Seangleng" },
      { alias: "noch",      name: "Dot Sreynoch" },
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
    members: [
      { alias: "samnang", name: "Samnang Keo", lead: true },
      { alias: "chhay",   name: "Chhang Mengchhay" },
      { alias: "chetra",  name: "Yoem Chetra" },
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
    members: [
      { alias: "dilan",  name: "Dilan Lakmal", lead: true },
      { alias: "yasomi", name: "Samipath Yasomi" },
      { alias: "alen",   name: "Koem Chichhong" },
      { alias: "heang",  name: "Young Sengheang" },
      { alias: "sokhim", name: "Proeurng Sokhim" },
    ],
  },
];

const PILLAR_HEIGHT = 300; // px

export function TeamClusters() {
  const [selected, setSelected] = useState<number>(1);
  const cluster = CLUSTERS.find((c) => c.num === selected)!;
  const printing = usePrintMode();
  // In print: every cluster's detail panel is shown stacked.
  const detailsToRender: Cluster[] = printing ? CLUSTERS : [cluster];

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
                {c.members && c.members.length > 0 && (
                  <div className="flex items-center -space-x-1.5 mt-1.5">
                    {c.members.slice(0, 5).map((m) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={m.alias}
                        src={`/images/team/portraits/${m.alias}.png`}
                        alt={m.name}
                        title={m.name + (m.lead ? " · LEAD" : "")}
                        draggable={false}
                        // Push focal point up: portraits are head + shoulders, so center-center
                        // crops too much shoulder. 50% / 18% puts the face in the middle.
                        style={{ objectPosition: "50% 18%" }}
                        className={`w-[20px] h-[20px] rounded-full object-cover shadow-sm select-none ${m.lead ? "ring-2 ring-amber-300" : "ring-[1.5px] ring-white"}`}
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
                        <div className={s.pct >= 40 ? "text-[9px] italic opacity-75 mt-0.5" : "text-[8px] italic opacity-75"}>
                          {s.label.toLowerCase().includes("dev") ? "skill and experience" : s.label.toLowerCase().includes("cert") ? "skill" : "experience"}
                        </div>
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

      {/* Detail panel(s). Screen: animated single (selected). Print: all 5 stacked. */}
      <AnimatePresence mode="wait">
        {detailsToRender.map((cluster) => (
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
            <>
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

              {/* Member roster — real portraits.
                  Core members rendered first; technical-support members appear after a divider. */}
              {cluster.members && cluster.members.length > 0 && (() => {
                const core    = cluster.members.filter((m) => !m.support);
                const support = cluster.members.filter((m) => m.support);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
                    className="mt-6"
                  >
                    <h4 className="font-bold text-yai-navy text-xs uppercase tracking-wider mb-3">
                      Group {cluster.num} roster · {core.length} engineer{core.length === 1 ? "" : "s"}
                      {support.length > 0 && (
                        <span className="text-gray-400 ml-1">+ {support.length} tech support</span>
                      )}
                    </h4>
                    <div className="flex flex-wrap items-start gap-4">
                      {/* Core members — uniform 76px outer wrapper so ring widths don't shift baselines */}
                      {core.map((m) => (
                        <AvatarTile key={m.alias} m={m} />
                      ))}

                      {/* Visual divider before tech-support cluster — only if any */}
                      {support.length > 0 && (
                        <div className="flex flex-col items-center self-stretch px-2">
                          <div className="w-px flex-1 bg-yai-border" />
                          <div className="text-[8px] uppercase tracking-wider font-extrabold text-gray-400 my-1 [writing-mode:vertical-rl] rotate-180">
                            Tech support
                          </div>
                          <div className="w-px flex-1 bg-yai-border" />
                        </div>
                      )}

                      {/* Technical-support members — slightly dimmed, no LEAD badge */}
                      {support.map((m) => (
                        <AvatarTile key={`s-${m.alias}`} m={m} dimmed />
                      ))}
                    </div>
                  </motion.div>
                );
              })()}
            </>
          ) : (
            <p className="text-sm text-gray-500 italic py-4 text-center border-2 border-dashed border-yai-border rounded-lg">
              Tell me the experience mix for this cluster and I&apos;ll wire it in.
            </p>
          )}
        </motion.div>
        ))}
      </AnimatePresence>

      <p className="text-xs text-gray-400 italic mt-3 text-center">
        Tap any cluster above to see its experience mix.
      </p>
    </>
  );
}

/** Uniform-size avatar tile so leads (amber ring + offset) don't shift the baseline.
 *  Outer wrapper is always 76×76; ring lives inside so width stays constant. */
function AvatarTile({ m, dimmed = false }: { m: Member; dimmed?: boolean }) {
  return (
    <div className={`flex flex-col items-center w-[80px] ${dimmed ? "opacity-80" : ""}`}>
      <div className="relative w-[76px] h-[76px] flex items-center justify-center">
        <div
          className={`w-[64px] h-[64px] rounded-full overflow-hidden shadow-md bg-white ${
            m.lead
              ? "ring-[3px] ring-amber-400 ring-offset-2 ring-offset-white"
              : "ring-2 ring-white"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/team/portraits/${m.alias}.png`}
            alt={m.name}
            // Portraits are head + shoulders. center-center crops too much off the top
            // (cuts the head) and leaves shoulders dominant. 50% / 18% pulls the face
            // up into the visual middle of the circle.
            style={{ objectPosition: "50% 18%" }}
            className="w-full h-full object-cover"
          />
        </div>
        {m.lead && (
          <span className="absolute top-0 right-0 bg-amber-400 text-[8px] font-extrabold text-yai-navy px-1 py-0.5 rounded shadow">
            ★
          </span>
        )}
      </div>
      <div className={`text-[10px] font-bold text-center mt-1.5 leading-tight ${dimmed ? "text-gray-500" : "text-yai-navy"}`}>
        {m.name}
      </div>
      {m.lead && (
        <div className="text-[8px] uppercase tracking-wider font-extrabold text-amber-600 mt-0.5">
          Lead
        </div>
      )}
      {m.support && (
        <div className="text-[8px] uppercase tracking-wider font-extrabold text-gray-400 mt-0.5">
          Tech support
        </div>
      )}
    </div>
  );
}
