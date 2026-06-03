// Server-only: non-salary expenses store.
// Structure: main category → list of line items → per-month $ entry.
// Matches the "Expences" layout from the TEXLINK Budget 2024-2026 sheet.

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "expenses.json");

export type Frequency = "one-off" | "recurring";

export type LineItem = {
  id: string;
  name: string;
  unitPrice?: number;
  unitLabel?: string;       // "per unit · 17 units" etc.
  frequency: Frequency;
  monthly: Record<string, { amount: number; qty?: number; note?: string }>;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  detail: string;
  color: string;
  items: LineItem[];
};

export type ExpensesStore = {
  updatedAt: string | null;
  updatedBy: string | null;
  months: string[];
  categories: ExpenseCategory[];
};

const START_YEAR = 2024;
const START_MONTH = 5;

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

/** Seed — the 7 main expense categories from the Excel, with their line items. */
export const SEED_EXPENSES_STORE: ExpensesStore = {
  updatedAt: null,
  updatedBy: null,
  months: ["2024-05"],
  categories: [
    {
      id: "bonus",
      name: "Bonus",
      detail: "Event-driven team bonuses (annual, project milestones, year-end).",
      color: "#10B981",
      items: [
        { id: "bonus-pool", name: "Bonus pool",  frequency: "one-off", monthly: {} },
      ],
    },
    {
      id: "computers",
      name: "Computers",
      detail: "Compute hardware — workstations, servers, peripherals.",
      color: "#1E4DAA",
      items: [
        { id: "mini-pc",       name: "Mini PC set",                                unitPrice: 550, unitLabel: "$550 / unit · 17 units planned", frequency: "one-off", monthly: {} },
        { id: "laptop",        name: "Laptop",                                     unitPrice: 450, unitLabel: "$450 / unit · 5 units planned",  frequency: "one-off", monthly: {} },
        { id: "tv",            name: "TV (Meeting room)",                          unitPrice: 400, unitLabel: "$400 / unit · 2 units",         frequency: "one-off", monthly: {} },
        { id: "server-ai-llm", name: "Server-class PC · Ai Server (own LLM)",      unitPrice: 600, unitLabel: "$600 / unit · 2 units",         frequency: "one-off", monthly: {} },
        { id: "printer",       name: "Printer / Scanner",                          unitPrice: 350, unitLabel: "$350 / unit · 2 units",         frequency: "one-off", monthly: {} },
      ],
    },
    {
      id: "furniture",
      name: "Furniture",
      detail: "Office furniture for the Phnom Penh team.",
      color: "#6D4FB6",
      items: [
        { id: "chair",     name: "High-back chair", unitPrice:  45, unitLabel: "$45 / unit · 25 units",  frequency: "one-off", monthly: {} },
        { id: "table-m",   name: "M-size table",    unitPrice: 150, unitLabel: "$150 / unit · 7 units", frequency: "one-off", monthly: {} },
      ],
    },
    {
      id: "dev-equipment",
      name: "Development equipment",
      detail: "AIoT + edge-hardware kit for platform development.",
      color: "#0A3327",
      items: [
        { id: "ecart",       name: "E-cart framework",       unitPrice: 2500, unitLabel: "$2,500 · 1 unit",       frequency: "one-off", monthly: {} },
        { id: "ai-face-cam", name: "Ai face-ID Camera",      unitPrice:  175, unitLabel: "$175 / unit · 4 units", frequency: "one-off", monthly: {} },
        { id: "wifi-eq",     name: "Wi-Fi Equipment",        unitPrice:  450, unitLabel: "$450 / unit · 4 units", frequency: "one-off", monthly: {} },
        { id: "net-eq",      name: "Networking Equipment",   unitPrice:  450, unitLabel: "$450 / unit · 2 units", frequency: "one-off", monthly: {} },
        { id: "iot-temp",    name: "IoT Temperature Sensor", unitPrice:  250, unitLabel: "$250 · set",            frequency: "one-off", monthly: {} },
        { id: "electric",    name: "Electric Meter",         unitPrice:  400, unitLabel: "$400 · set",            frequency: "one-off", monthly: {} },
      ],
    },
    {
      id: "admin-shop",
      name: "Admin Shop / Office Supplies",
      detail: "Consumables for the office.",
      color: "#D4A017",
      items: [
        { id: "office-acc",  name: "Office accessories", unitPrice: 250, unitLabel: "$250 · 5 sets",  frequency: "recurring", monthly: {} },
        { id: "whiteboard",  name: "White board + pens", unitPrice: 250, unitLabel: "$250 · set",     frequency: "one-off",   monthly: {} },
        { id: "a4-paper",    name: "A4 Paper",           unitPrice: 100, unitLabel: "$100 · 1 box",   frequency: "recurring", monthly: {} },
      ],
    },
    {
      id: "ai-fees",
      name: "Ai Fees",
      detail: "Anthropic / Google Cloud / OpenAI API + token-usage fees.",
      color: "#8B5CF6",
      items: [
        { id: "ai-monthly", name: "Monthly Ai usage", frequency: "recurring", monthly: {} },
      ],
    },
    {
      id: "villa-rent",
      name: "Villa Rent + Utilities",
      detail: "Office rent + internet + electricity in Phnom Penh.",
      color: "#F37021",
      items: [
        { id: "rent",     name: "Villa rent",       frequency: "recurring", monthly: {} },
        { id: "internet", name: "Internet + 5G",    frequency: "recurring", monthly: {} },
        { id: "electric", name: "Electricity bill", frequency: "recurring", monthly: {} },
      ],
    },
    {
      id: "petty-cash",
      name: "Petty Cash + Sales Promotion",
      detail: "Local-spend buffer + outreach materials (printed invites, swag, taxi reimbursements).",
      color: "#EF4444",
      items: [
        { id: "petty",     name: "Petty cash",                 frequency: "recurring", monthly: {} },
        { id: "promotion", name: "Sales promotion expenses",   frequency: "recurring", monthly: {} },
      ],
    },
  ],
};

export async function readExpensesStore(): Promise<ExpensesStore> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text) as ExpensesStore;
    return {
      updatedAt: parsed.updatedAt ?? null,
      updatedBy: parsed.updatedBy ?? null,
      months: buildMonths(parsed.months),
      categories: parsed.categories ?? SEED_EXPENSES_STORE.categories,
    };
  } catch {
    return {
      ...SEED_EXPENSES_STORE,
      months: buildMonths(SEED_EXPENSES_STORE.months),
    };
  }
}

export async function writeExpensesStore(store: ExpensesStore): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
}
