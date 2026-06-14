// Server-only: About-Yai content (Section 17 on the public plan).
// Holds the 5 image URLs + contact text. Admin-editable via /admin/about.

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "about.json");

export type AboutStore = {
  updatedAt: string | null;
  updatedBy: string | null;
  // A1 — Company credentials (3 image URLs + captions)
  a1: {
    businessRegistration: { url: string; caption: string };
    vatCertificate:       { url: string; caption: string };
    ictLicense:           { url: string; caption: string };
  };
  // A2 — Product preview (2 image URLs)
  a2: {
    frontUi:  { url: string; caption: string };
    agentics: { url: string; caption: string };
  };
  // A3 — Contact block (was A5)
  a3: {
    name: string;
    role: string;
    org: string;
    email: string;
    web: string;
    location: string;
  };
};

export const SEED_ABOUT_STORE: AboutStore = {
  updatedAt: null,
  updatedBy: null,
  a1: {
    businessRegistration: { url: "", caption: "Business Registration" },
    vatCertificate:       { url: "", caption: "VAT Certificate" },
    ictLicense:           { url: "", caption: "ICT License" },
  },
  a2: {
    frontUi:  { url: "", caption: "Front UI" },
    agentics: { url: "", caption: "Agentics" },
  },
  a3: {
    name: "Gamini K",
    role: "Director",
    org: "Texlink Technologies Co., Ltd.",
    email: "gamini@yaikh.com",
    web: "www.yaikh.com",
    location: "Cambodia",
  },
};

export async function readAboutStore(): Promise<AboutStore> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text) as Partial<AboutStore>;
    // Merge with seed so missing fields default cleanly
    return {
      updatedAt: parsed.updatedAt ?? null,
      updatedBy: parsed.updatedBy ?? null,
      a1: { ...SEED_ABOUT_STORE.a1, ...(parsed.a1 || {}) },
      a2: { ...SEED_ABOUT_STORE.a2, ...(parsed.a2 || {}) },
      a3: { ...SEED_ABOUT_STORE.a3, ...(parsed.a3 || {}) },
    };
  } catch {
    return { ...SEED_ABOUT_STORE };
  }
}

export async function writeAboutStore(store: AboutStore): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
}
