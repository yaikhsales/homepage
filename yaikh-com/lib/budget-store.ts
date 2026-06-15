// Server-only: budget actuals storage.
// Persists to data/budget-actuals.json. On Railway free tier the filesystem
// is ephemeral across redeploys — fine for short-lived planned-vs-actual
// updates; swap to a real DB later.

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "budget-actuals.json");

export type ActualsLine = {
  // Each entry below is a 12-element array (Jan…Dec). null means "not yet posted".
  expense:    (number | null)[];
  income:     (number | null)[];
  // Optional note posted alongside the monthly numbers.
  notes:      (string | null)[];
};

const EMPTY12 = (): (number | null)[] => [null, null, null, null, null, null, null, null, null, null, null, null];
const EMPTY12_STR = (): (string | null)[] => [null, null, null, null, null, null, null, null, null, null, null, null];

export const DEFAULT_ACTUALS: ActualsLine = {
  expense: EMPTY12(),
  income:  EMPTY12(),
  notes:   EMPTY12_STR(),
};

export type Store = {
  updatedAt: string | null;
  updatedBy: string | null;
  actuals: ActualsLine;
};

export const EMPTY_STORE: Store = {
  updatedAt: null,
  updatedBy: null,
  actuals: DEFAULT_ACTUALS,
};

import { readAdminDoc, writeAdminDoc } from "@/lib/admin-mongo";

const SECTION = "budget-actuals";

function hydrate(parsed: Partial<Store>): Store {
  const fix = (arr: (number | null)[] | undefined) => {
    const out = [...(arr || [])];
    while (out.length < 12) out.push(null);
    return out.slice(0, 12);
  };
  const fixStr = (arr: (string | null)[] | undefined) => {
    const out = [...(arr || [])];
    while (out.length < 12) out.push(null);
    return out.slice(0, 12);
  };
  return {
    updatedAt: parsed.updatedAt ?? null,
    updatedBy: parsed.updatedBy ?? null,
    actuals: {
      expense: fix(parsed.actuals?.expense),
      income:  fix(parsed.actuals?.income),
      notes:   fixStr(parsed.actuals?.notes),
    },
  };
}

export async function readStore(): Promise<Store> {
  const fromMongo = await readAdminDoc<Store>(SECTION);
  if (fromMongo) return hydrate(fromMongo);
  try {
    const text = await fs.readFile(FILE, "utf-8");
    return hydrate(JSON.parse(text) as Partial<Store>);
  } catch {
    return EMPTY_STORE;
  }
}

export async function writeStore(store: Store): Promise<void> {
  await writeAdminDoc(SECTION, store as unknown as Record<string, unknown>);
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("[budget-store] fs snapshot failed (Mongo write succeeded):", err instanceof Error ? err.message : err);
  }
}
