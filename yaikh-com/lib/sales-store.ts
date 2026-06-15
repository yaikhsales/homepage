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
  /** Forecast / target revenue $ for the month — what we expect to book */
  planned?: number;
  /** Booked / closed revenue $ for the month — actuals */
  actual?: number;
  /** Active customer / user count that month (optional, supports per-stream KPI tracking) */
  customers?: number;
  /** Optional public-visible note */
  note?: string;
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

// Sales starts JUN 2026 — the month the platform opens its gates commercially.
// (Salaries start May 2024 — that grid is historical. Sales is forward-looking.)
const START_YEAR = 2026;
const START_MONTH = 6;
// How many months past the current real-world month to surface up-front.
// 18 = a year-and-a-half runway visible without "+ Next month" clicks.
const FORWARD_RUNWAY_MONTHS = 18;

function defaultMonths(): string[] {
  const now = new Date();
  // Show at least START → today + 18 forward (capped at 36 months from start).
  const endY = now.getFullYear();
  const endM = now.getMonth() + 1; // 1-12
  const out: string[] = [];
  let y = START_YEAR;
  let m = START_MONTH;
  let added = 0;
  const minForward = endM + FORWARD_RUNWAY_MONTHS - 12 * (endY - START_YEAR);
  // Generate from start until either (a) we've reached today + runway, or (b) cap of 36 months.
  while (added < 36 && (y < endY || (y === endY && m <= endM) || added < minForward + 12 * (endY - START_YEAR))) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    added++;
    m++;
    if (m > 12) { m = 1; y++; }
  }
  // Always ensure at least 24 months of forward visibility from START
  while (added < 24) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    added++;
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return out;
}

function buildMonths(stored?: string[]): string[] {
  const base = defaultMonths();
  if (!stored?.length) return base;
  const merged = new Set([...base, ...stored.filter((m) => /^\d{4}-\d{2}$/.test(m))]);
  return Array.from(merged).sort();
}

/** Seed — the 6 planned packages + 3 uncertain e-com streams.
 * All monthly cells empty until admin posts actuals. */
export const SEED_SALES_STORE: SalesStore = {
  updatedAt: null,
  updatedBy: null,
  months: ["2026-06"],
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

    // ─── STEP 4 UNLOCKS — Administrative + Operation tool stacks ───
    {
      id: "admin-tools",
      name: "Administrative Tools",
      category: "addon",
      certainty: "planned",
      unitPrice: 5000,
      unitLabel: "$5,000 / yr",
      tierLabel: "Activated after Ai Server · admin module stack",
      detail: "Administrative module set activated after the Ai Server hardware purchase — PR, HR, Pay, Org, LMS, Ai CCTV. The admin core for the whole factory.",
      monthly: {},
    },
    {
      id: "ops-tools",
      name: "Operation Tools",
      category: "addon",
      certainty: "planned",
      unitPrice: 10000,
      unitLabel: "$10,000 / yr",
      tierLabel: "Activated after Ai Server · ops module stack",
      detail: "Operation module set activated after the Ai Server hardware purchase — YPM, YQMS, YPI, YTM, MRP. The operations engine that runs the floor in real time.",
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
      unitLabel: "Take-rate · variable / user",
      tierLabel: "Planned reach: 100,000 garment workers",
      detail: "Workers buy/sell to each other inside the Yai app. User-count target is planned (100K workers). Revenue per user is variable — depends on transaction volume × take-rate.",
      monthly: {},
    },
    {
      id: "ecom-service-market",
      name: "Service Provider Marketplace",
      category: "ecom",
      certainty: "uncertain",
      unitPrice: 0,
      unitLabel: "Take-rate + listing · variable / provider",
      tierLabel: "Planned reach: ~1,000 service providers",
      detail: "Factories book legal, logistics, maintenance services via Yai. Provider-count target is planned (~1,000). Revenue per provider is variable — booking take-rate + listing fees.",
      monthly: {},
    },
    {
      id: "ecom-factory-supply",
      name: "Factory Supply Marketplace",
      category: "ecom",
      certainty: "uncertain",
      unitPrice: 0,
      unitLabel: "Wholesale margin · variable / SKU",
      tierLabel: "Planned reach: 100 curated SKUs · target $100K GMV / month",
      detail: "Yai-curated wholesale catalogue (thread, packaging, PPE) sold to factories. SKU count + GMV target are planned. Revenue per order is variable — wholesale margin × order volume.",
      monthly: {},
    },
  ],
};

import { readAdminDoc, writeAdminDoc } from "@/lib/admin-mongo";

const SECTION = "sales-income";

/** Merge a stored SalesStore against the in-code SEED.
 * SEED metadata (price, labels, detail) flows through as source of truth;
 * the user's saved monthly cells are preserved per stream id.
 */
function mergeWithSeed(parsed: SalesStore): SalesStore {
  const saved = parsed.streams ?? [];
  const savedById = new Map(saved.map((s) => [s.id, s]));
  const merged = SEED_SALES_STORE.streams.map((seed) => {
    const prev = savedById.get(seed.id);
    return { ...seed, monthly: prev?.monthly ?? seed.monthly };
  });
  const seedIds = new Set(SEED_SALES_STORE.streams.map((s) => s.id));
  const extra = saved.filter((s) => !seedIds.has(s.id));
  return {
    updatedAt: parsed.updatedAt ?? null,
    updatedBy: parsed.updatedBy ?? null,
    months: buildMonths(parsed.months),
    streams: [...merged, ...extra],
  };
}

export async function readSalesStore(): Promise<SalesStore> {
  // Primary: Mongo (survives Railway redeploys)
  const fromMongo = await readAdminDoc<SalesStore>(SECTION);
  if (fromMongo) return mergeWithSeed(fromMongo);

  // Fallback: data/sales-income.json on disk (committed to git as the seeded baseline)
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text) as SalesStore;
    return mergeWithSeed(parsed);
  } catch {
    // Last resort: in-code SEED defaults.
    return {
      ...SEED_SALES_STORE,
      months: buildMonths(SEED_SALES_STORE.months),
    };
  }
}

export async function writeSalesStore(store: SalesStore): Promise<void> {
  // Primary: Mongo. Survives every redeploy.
  await writeAdminDoc(SECTION, store as unknown as Record<string, unknown>);

  // Secondary: write a fs snapshot too. Cheap insurance — local-dev visibility
  // and a recoverable backup if the Mongo cluster ever has a bad day.
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("[sales-store] fs snapshot failed (Mongo write succeeded):", err instanceof Error ? err.message : err);
  }
}
