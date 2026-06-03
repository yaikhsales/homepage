// Server-only: factory × module adoption-matrix overrides.
// Stores per-cell status posted by the admin. The public matrix component
// merges these overrides on top of seeded defaults.

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "factory-adoption.json");

export type FactoryStatus = "full" | "impl" | "hold" | "planned" | "na";

export type FactoryOverrides = Record<string, Record<string, FactoryStatus>>;
// shape: { moduleName: { factoryCode: status } }

export type FactoryStore = {
  updatedAt: string | null;
  updatedBy: string | null;
  overrides: FactoryOverrides;
};

export const EMPTY_FACTORY_STORE: FactoryStore = {
  updatedAt: null,
  updatedBy: null,
  overrides: {},
};

export async function readFactoryStore(): Promise<FactoryStore> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text) as FactoryStore;
    return {
      updatedAt: parsed.updatedAt ?? null,
      updatedBy: parsed.updatedBy ?? null,
      overrides: parsed.overrides ?? {},
    };
  } catch {
    return EMPTY_FACTORY_STORE;
  }
}

export async function writeFactoryStore(store: FactoryStore): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
}
