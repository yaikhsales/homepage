// Server-only: planned + uncertain income streams.
// Each stream is a row (e.g. "Cloud Starter $120/yr") with month-by-month
// customer counts + revenue actuals. Same shape across all streams so the
// editor + public roll-up can iterate uniformly.

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "sales-income.json");

export type StreamCategory = "cloud" | "hardware" | "addon" | "ecom";
export type StreamCertainty = "planned" | "uncertain";

export type MonthCell = {
  customers: number;   // active paying customers / users that month
  revenue: number;     // $ recognised that month
  note?: string;       // optional, public-visible note
};

export type IncomeStream = {
  id: string;
  name: string;             // "Cloud Starter"
  category: StreamCategory;
  certainty: StreamCertainty;
  unitPrice: number;        // $ per year (or per unit for one-time hardware)
  unitLabel: string;        // "$120 / yr"
  tierLabel: string;        // "5 users tier"
  detail: string;           // longer description for the expanded body
  monthly: Record<string, MonthCell>; // keyed "YYYY-MM"
};

export type SalesStore = {
  updatedAt: string | null;
  updatedBy: string | null;
  months: string[];         // auto-extended at read time
  streams: IncomeStream[];
};

const START_YEAR = 2024;
const START_MONTH = 5; // May 2024 — same anchor as salary store

function monthsUpToToday(): string[] {
  const now = new Date();
  const endYear = now.getFullYear();
  const endMonth = now.getMonth() + 1;
  const out: string[] = [];
  let y = START_YEAR;
  let m = START_MONTH;
  while (y < endYear || (y === endYear && m <= endMonth)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return out;
}

function buildMonths(stored?: string[]): string[] {
  const base = monthsUpToToday();
  if (!stored?.length) return base;
  const merged = new Set([...base, ...stored.filter((m) => /^\d{4}-\d{2}$/.test(m))]);
  return Array.from(merged).sort();
}

/** Seed — the 6 planned packages + 3 uncertain e-com streams.
 * All monthly cells empty until admin posts actuals. */
export const SEED_SALES_STORE: SalesStore = {
  updatedAt: null,
  updatedBy: null,
  months: ["2024-05"],
  streams: [
    // ─── CLOUD PACKAGES (Step 1-3 of the pricing staircase) ───
    {
      id: "cloud-starter",
      name: "Cloud Starter",
      category: "cloud",
      certainty: "planned",
      unitPrice: 120,
      unitLabel: "$120 / yr",
      tierLabel: "5 key members",
      detail: "Admin-only stack: PR, HR, Payroll, Shop, App. Entry-level price point for small factories + non-garment SMEs.",
      monthly: {},
    },
    {
      id: "cloud-growth",
      name: "Cloud Growth",
      category: "cloud",
      certainty: "planned",
      unitPrice: 750,
      unitLabel: "$750 / yr",
      tierLabel: "5 → 300 users · whole department",
      detail: "Admin + early ops modules (YPM, QMS, Digital Audit). The mid-size sweet spot.",
      monthly: {},
    },
    {
      id: "cloud-enterprise",
      name: "Cloud Enterprise",
      category: "cloud",
      certainty: "planned",
      unitPrice: 1200,
      unitLabel: "$1,200 / yr",
      tierLabel: "300 → 1,000 users · whole factory",
      detail: "Full module stack across the whole factory. Anchor-customer tier.",
      monthly: {},
    },

    // ─── HARDWARE (Step 4) ───
    {
      id: "ai-server",
      name: "Ai Server",
      category: "hardware",
      certainty: "planned",
      unitPrice: 2500,
      unitLabel: "$2,500 (one-off)",
      tierLabel: "1,000+ users · dedicated server",
      detail: "Solar-powered mini-PC server unlocks Step 4. One-time hardware purchase, then unlocks Administrative + Operation tooling.",
      monthly: {},
    },

    // ─── ADD-ONS (Step 5-6) ───
    {
      id: "agentic",
      name: "Agentic",
      category: "addon",
      certainty: "planned",
      unitPrice: 5000,
      unitLabel: "$5,000 / yr",
      tierLabel: "After ~6 months · 10 agents + 35 mini",
      detail: "Step 5 — Ai agents take over routine work alongside the ops team.",
      monthly: {},
    },
    {
      id: "big-ai-brain",
      name: "Big Ai Brain",
      category: "addon",
      certainty: "planned",
      unitPrice: 5000,
      unitLabel: "$5,000 / yr",
      tierLabel: "Boss · after ~1 year · 5 factories 1 chat",
      detail: "Step 6 — the platform talks across the boss's factories. Highest-leverage tier.",
      monthly: {},
    },

    // ─── E-COMMERCE (uncertain) ───
    {
      id: "ecom-worker-p2p",
      name: "Worker P2P Marketplace",
      category: "ecom",
      certainty: "uncertain",
      unitPrice: 0,
      unitLabel: "Take-rate based",
      tierLabel: "Target: 100,000 garment workers",
      detail: "Workers buy/sell to each other inside the Yai app. Revenue = transaction take-rate. Highly uncertain until alpha launches.",
      monthly: {},
    },
    {
      id: "ecom-service-market",
      name: "Service Provider Marketplace",
      category: "ecom",
      certainty: "uncertain",
      unitPrice: 0,
      unitLabel: "Take-rate + listing",
      tierLabel: "~1,000 service providers",
      detail: "Factories book legal, logistics, maintenance services via Yai. Take-rate per booking.",
      monthly: {},
    },
    {
      id: "ecom-factory-supply",
      name: "Factory Supply Marketplace",
      category: "ecom",
      certainty: "uncertain",
      unitPrice: 0,
      unitLabel: "Wholesale margin",
      tierLabel: "TBD · curated SKU list",
      detail: "Yai-curated wholesale catalogue (thread, packaging, PPE) sold to factories at wholesale margin. TBD pricing model.",
      monthly: {},
    },
  ],
};

export async function readSalesStore(): Promise<SalesStore> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text) as SalesStore;
    return {
      updatedAt: parsed.updatedAt ?? null,
      updatedBy: parsed.updatedBy ?? null,
      months: buildMonths(parsed.months),
      streams: parsed.streams ?? SEED_SALES_STORE.streams,
    };
  } catch {
    return {
      ...SEED_SALES_STORE,
      months: buildMonths(SEED_SALES_STORE.months),
    };
  }
}

export async function writeSalesStore(store: SalesStore): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
}
