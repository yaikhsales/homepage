"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePrintMode } from "@/lib/usePrintMode";

type Mod = { n: string; soon?: boolean; confirmed?: boolean; desc: string };
type Cat = { name: string; mods: Mod[] };
type Band = { id: string; name: string; color: string; cats: Cat[] };

const BANDS: Band[] = [
  {
    id: "admin",
    name: "Administration",
    color: "#1E4DAA",
    cats: [
      {
        name: "Accountant",
        mods: [
          { n: "Accountant", desc: "I run the whole accounting function — income, expenses, invoicing, taxes and the company's books — and keep every ledger reconciled in real time." },
          { n: "IEWS", desc: "I handle e-invoicing — issuing and validating invoices through CamInv / the GDT e-invoice system so every invoice is compliant and traceable." },
        ],
      },
      {
        name: "Billing",
        mods: [
          { n: "Purchase Request", desc: "I handle purchase requests — from raising to approval routing and PO creation." },
          { n: "Bill Claim", desc: "I process expense and bill claims — submission, approval and reimbursement straight back to the claimant." },
        ],
      },
      {
        name: "HR",
        mods: [
          { n: "YHR", desc: "I'm the HR core — employee records, contracts, leave and the full worker lifecycle in one place." },
          { n: "Org Chart", confirmed: true, desc: "I keep the company's structure live — every role, reporting line and headcount — and hold all the structural records you need for compliance. The moment someone joins or resigns, the chart updates itself in real time." },
          { n: "Salary Bill", confirmed: true, desc: "I run payroll end to end — wages, overtime and deductions — then pay everyone out straight to their ABA or WING account. Each person sees every payment and payslip detail right inside the Yai app." },
          { n: "Training", desc: "I plan and track training — schedules, attendance and the skills record for every worker." },
          { n: "Temporary Worker", desc: "I manage temporary-worker requests — raising, approving and tracking short-term labour on the floor." },
          { n: "Speak Up", desc: "I'm the anonymous grievance channel — workers raise concerns safely and I route them to the right people." },
        ],
      },
      {
        name: "Admin",
        mods: [
          { n: "Support Ticket", desc: "I take internal support requests — log, assign and track every ticket to resolution." },
          { n: "Y Shop", desc: "I run the internal shop — staff purchases, stock and orders." },
          { n: "Gate Pass", desc: "I issue and verify gate passes — people and goods in and out, logged and authorised." },
          { n: "Meeting Room", desc: "I manage meeting-room bookings — availability, scheduling and conflicts." },
          { n: "Car Booking", desc: "I handle company-car bookings — requests, allocation and the schedule." },
          { n: "Fire Alarm", desc: "I monitor the fire-alarm and life-safety systems across the whole site." },
          { n: "CCTV", desc: "I connect to the CCTV system — live and recorded camera access for security." },
        ],
      },
      {
        name: "CSR",
        mods: [
          { n: "Digital Audit", desc: "I run digital compliance audits — WRAP, BSCI, HIGG and ILO evidence collected and scored automatically." },
          { n: "Energy", desc: "I track energy use — kWh, efficiency and renewable share across the factory." },
          { n: "Air", desc: "I monitor air emissions — AQI, CO2 and air-quality data for compliance." },
          { n: "Water", desc: "I monitor water — usage and effluent/wastewater levels for environmental reporting." },
          { n: "Waste", desc: "I track waste — solid waste, recycling rates and disposal records." },
          { n: "Chemical", desc: "I manage chemical inventory and MRSL / ZDHC compliance." },
        ],
      },
      { name: "Shipping", mods: [{ n: "Shipping", confirmed: true, desc: "I handle freight both ways — importing raw materials and machines, and exporting finished goods by FCL and LCL — tracking every container, customs step and delivery end to end." }] },
      { name: "E-Gov", mods: [{ n: "E-Government", confirmed: true, desc: "I connect directly to every government portal — the Tax portal, the Customs portal, and each ministry's compliance portal. I also run the communication channel with each government body, handling official PR and correspondence and keeping the systems updated with every new announcement." }] },
    ],
  },
  {
    id: "mgmt",
    name: "Management",
    color: "#0A1F47",
    cats: [
      {
        name: "Dashboard",
        mods: [
          { n: "Management Dashboard", confirmed: true, desc: "I'm the GM's data keeper. Every number in the company runs through me — production, sales, finance, HR, compliance — so the General Manager's single screen knows literally everything, live." },
          { n: "SOP", confirmed: true, desc: "I'm the process police. Every standard operating procedure lives with me — searchable, versioned and always current — and nobody here does anything without going through my process first." },
        ],
      },
      {
        name: "Noticeable",
        mods: [
          { n: "System Analysis", confirmed: true, desc: "I run the algorithms for top management. When the chat agent can't give you the answer, I take over — I trace exactly where it went wrong, work out what happened, and fix it." },
        ],
      },
    ],
  },
  {
    id: "ops",
    name: "Operations",
    color: "#F37021",
    cats: [
      {
        name: "QA",
        mods: [
          { n: "YQMS", desc: "I'm quality management — inline and final QC, defects, AQL and corrective actions." },
          { n: "Call Out", desc: "I escalate quality issues — flagging defects and calling out the right people the moment something needs attention." },
        ],
      },
      {
        name: "Production",
        mods: [
          { n: "FC", desc: "I run floor control — line balancing, output and live production status." },
          { n: "YWIP", confirmed: true, desc: "I'm all about quantities — from your fabric rolls, to the cut panels, to the finished goods, to the cartons ready to export. Ask me how many, anywhere in the flow." },
          { n: "CE", desc: "I handle costing & efficiency — SAM, line efficiency and cost per garment." },
          { n: "YTM", desc: "I manage time & motion — SAM studies, method and capacity planning." },
          { n: "YTM Shop", desc: "I'm the shop-floor time view — operation breakdowns right at the station." },
        ],
      },
      { name: "4DP", mods: [{ n: "4DP", desc: "I'm the production plan — scheduling orders across lines day by day." }] },
      { name: "YPi", mods: [{ n: "YPI", desc: "I deliver garment technical specs in Khmer — construction, measurements and machine settings on the floor." }] },
      { name: "MRP", mods: [{ n: "MRP", desc: "I run material requirements planning — fabric and trims, what's needed and when." }] },
    ],
  },
];

// one unique face per module — assigned by order across the whole platform (1..N)
const AVATAR_BY_NAME = new Map<string, number>();
BANDS.flatMap((b) => b.cats)
  .flatMap((c) => c.mods)
  .forEach((m, i) => AVATAR_BY_NAME.set(m.n, i + 1));
const avatarOf = (name: string) => AVATAR_BY_NAME.get(name) ?? 1;

type Selected = { mod: Mod; cat: string; band: Band } | null;

export function PlatformOrbs() {
  const [sel, setSel] = useState<Selected>(null);
  const printing = usePrintMode();

  return (
    <div>
      {/* all three bands in one line — scrolls horizontally like the live dashboard */}
      <div className="overflow-x-auto pb-3 -mx-1 px-1">
        <div className="flex gap-2 min-w-max md:min-w-0 items-start">
          {BANDS.map((band) => (
            <div key={band.id} className="shrink-0">
              {/* band header — spans this band's columns */}
              <div
                className="text-white text-[9px] font-bold uppercase tracking-[0.12em] text-center py-1 px-2 rounded-md"
                style={{ background: band.color }}
              >
                {band.name}
              </div>

              {/* category columns — round floating agents, no white boxes */}
              <div className="flex gap-0.5 mt-1.5 items-start">
                {band.cats.map((cat) => (
                  <div key={cat.name} className="w-[56px] shrink-0">
                    <div className="text-[8px] font-bold uppercase tracking-wide text-yai-navy text-center pb-0.5 mb-1.5 border-b border-yai-border/70 leading-tight">
                      {cat.name}
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      {cat.mods.map((m, i) => {
                        const isOpen = sel?.mod === m;
                        return (
                          <motion.button
                            key={m.n}
                            onClick={() => setSel(isOpen ? null : { mod: m, cat: cat.name, band })}
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.94 }}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 3 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                            className="flex flex-col items-center gap-0.5 focus:outline-none w-full"
                          >
                            <img
                              src={`/images/generated/agent-${avatarOf(m.n)}.png?v=3`}
                              alt=""
                              draggable={false}
                              className="w-10 h-10 rounded-full object-cover shadow-md select-none"
                              style={{
                                opacity: m.soon ? 0.5 : 1,
                                filter: m.soon ? "grayscale(1)" : "none",
                                boxShadow: isOpen
                                  ? `0 0 0 3px #fff, 0 0 0 5px ${band.color}`
                                  : "0 2px 6px rgba(10,31,71,0.18)",
                              }}
                            />
                            <span className="text-[9px] font-semibold text-yai-navy text-center leading-tight">{m.n}</span>
                            {m.soon && <span className="text-[7px] uppercase tracking-wider text-gray-400 -mt-0.5">soon</span>}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print-only module catalogue — every agent + description.
       *  On screen, descriptions hide behind the tap-to-open modal; in print
       *  we expand them all so the PDF carries the full module reference. */}
      {printing && (
        <div className="mt-6 space-y-4 break-inside-auto">
          {BANDS.map((band) => (
            <div key={band.id} className="rounded-lg overflow-hidden border" style={{ borderColor: band.color }}>
              <div className="text-white text-xs font-extrabold uppercase tracking-wider px-3 py-2" style={{ background: band.color }}>
                {band.name}
              </div>
              <div className="p-3 space-y-2">
                {band.cats.map((cat) => (
                  <div key={cat.name}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-yai-navy/70 mb-1">
                      {cat.name}
                    </div>
                    <ul className="space-y-1">
                      {cat.mods.map((m) => (
                        <li key={m.n} className="text-[11px] leading-snug">
                          <span className="font-extrabold text-yai-navy">{m.n}</span>
                          {m.soon && <span className="text-[9px] uppercase tracking-wider text-gray-400 ml-1">soon</span>}
                          <span className="text-gray-700"> — {m.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* agent detail modal */}
      <AnimatePresence>
        {sel && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSel(null)}
          >
            <div className="absolute inset-0 bg-yai-navy/45 backdrop-blur-sm" />
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5" style={{ background: sel.band.color }} />
              <button
                onClick={() => setSel(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg leading-none"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="p-6 flex gap-4 items-start">
                <img
                  src={`/images/generated/agent-${avatarOf(sel.mod.n)}.png?v=3`}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg shrink-0"
                  style={{ filter: sel.mod.soon ? "grayscale(1)" : "none" }}
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: sel.band.color }}>
                    {sel.band.name} · {sel.cat}
                  </div>
                  <h3 className="font-extrabold text-yai-navy text-xl leading-tight mt-0.5">
                    {sel.mod.n}
                    {sel.mod.soon && <span className="ml-2 text-[10px] uppercase tracking-wider text-gray-400 align-middle">coming soon</span>}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-2">&ldquo;{sel.mod.desc}&rdquo;</p>
                  {!sel.mod.confirmed && (
                    <p className="text-[10px] text-gray-300 mt-3 italic">Draft — tell me this agent&apos;s real role and I&apos;ll update it.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
