/* Seed billing collections in the yaikhhomepage Atlas cluster.
 *
 *   Run from yaikh-com/:
 *     node scripts/seed-billing.mjs
 *
 * Idempotent: clears the target collections then re-inserts the
 * realistic Cambodian garment-factory test data. Safe to re-run any
 * time the UI needs a known-good baseline.
 *
 * Reads MONGO_URL from .env.local (no dotenv dep — parsed inline).
 */

import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}

const uri = process.env.MONGO_URL;
if (!uri) {
  console.error("MONGO_URL missing — set it in yaikh-com/.env.local first");
  process.exit(1);
}

const now = () => new Date();

const shippingBills = [
  { no: "SB-2026-109", category: "cargo-clearance", vendor: "Bolloré Logistics Cambodia",   ref: "CMAU-789-123",     description: "Container CMAU-789-123 clearance, Sihanoukville Port (raw fabric import)", amount: 1850.00, status: "Submitted",          date: "2026-06-13" },
  { no: "SB-2026-108", category: "worker-fees",     vendor: "Phnom Penh Casual Labour Co.", ref: "PP-LBR-0610",      description: "Unloading 3 trucks of polyester yarn — 6 workers × 1 day",                  amount:   90.00, status: "Manager Approved",   date: "2026-06-12" },
  { no: "SB-2026-107", category: "equipment",       vendor: "SokKim Equipment Rental",      ref: "MSCU-456-789",     description: "Crane fee, container MSCU-456-789 (sewing-machine import from Shanghai)",  amount:  620.00, status: "Accounting Verified",date: "2026-06-11" },
  { no: "SB-2026-106", category: "customs",         vendor: "GDT Customs (Sihanoukville)",  ref: "GDT-IMP-2026-318", description: "Import duty: polyester yarn 12T @ 7% + VAT",                                amount: 2340.00, status: "Manager Approved",   date: "2026-06-11" },
  { no: "SB-2026-105", category: "cargo-clearance", vendor: "CMA CGM Cambodia",             ref: "MAEU-001-456",     description: "Export clearance H&M shipment, 2 × 40HC container LA",                     amount: 1420.00, status: "Reimbursed",         date: "2026-06-10" },
  { no: "SB-2026-104", category: "gate-clearance",  vendor: "TexLink Factory Security",     ref: "TF-GATE-JUN",      description: "June factory gate clearance + security pass for 28 truck movements",       amount:  120.00, status: "Reimbursed",         date: "2026-06-08" },
  { no: "SB-2026-103", category: "equipment",       vendor: "SokKim Equipment Rental",      ref: "FORK-MAY26",       description: "Forklift hire — 40 container moves in May (raw + finished)",                amount:  480.00, status: "Reimbursed",         date: "2026-06-06" },
  { no: "SB-2026-102", category: "customs",         vendor: "GDT Customs (Phnom Penh)",     ref: "GDT-EXP-2026-291", description: "Export documentation fees — Uniqlo shipment SHA-JAPAN",                     amount:  185.00, status: "Submitted",          date: "2026-06-13" },
].map((b) => ({ ...b, createdAt: now(), updatedAt: now() }));

const billClaims = [
  { no: "BC-2026-019", claimant: "Mr. Khun",    dept: "Admin",         category: "petrol",    description: "Petrol for fabric pickup, Phnom Penh → Kandal factory", amount: 20.00, status: "Manager Approved",    date: "2026-06-13" },
  { no: "BC-2026-018", claimant: "Ms. Sopheap", dept: "Sales",         category: "meal",      description: "Client lunch with H&M merchandiser (3 pax)",            amount: 10.00, status: "Accounting Verified", date: "2026-06-12" },
  { no: "BC-2026-017", claimant: "Mr. Lim",     dept: "Finance",       category: "transport", description: "Grab ride to GDT office for monthly VAT filing",         amount: 10.00, status: "Reimbursed",          date: "2026-06-11" },
  { no: "BC-2026-016", claimant: "Mr. Sokha",   dept: "Admin",         category: "coffee",    description: "Office coffee run, 3-staff strategy meeting",            amount:  5.00, status: "Submitted",           date: "2026-06-13" },
  { no: "BC-2026-015", claimant: "Ms. Pich",    dept: "Merchandising", category: "courier",   description: "Sample courier DHL → Bangkok (Uniqlo)",                  amount: 35.00, status: "Manager Approved",    date: "2026-06-10" },
  { no: "BC-2026-014", claimant: "Mr. Davy",    dept: "Logistics",     category: "parking",   description: "GDT parking, 3 visits for export licence renewal",        amount:  9.00, status: "Reimbursed",          date: "2026-06-09" },
  { no: "BC-2026-013", claimant: "Ms. Theary",  dept: "HR",            category: "meal",      description: "2 lunches with new sewing-line candidates",               amount: 10.00, status: "Submitted",           date: "2026-06-13" },
  { no: "BC-2026-012", claimant: "Mr. Vannak",  dept: "Production",    category: "transport", description: "Tuk-tuk to spare-parts shop, urgent needle replacement",  amount:  4.00, status: "Reimbursed",          date: "2026-06-08" },
].map((c) => ({ ...c, createdAt: now(), updatedAt: now() }));

const salaryBills = [
  {
    no: "SAL-2026-05-25", period: "2026-05-25", cycle: "2nd half (25th)",
    headcount: 487, gross: 142850.00, nssf: 4720.00, tax: 11460.00, net: 126670.00,
    status: "Paid", paidVia: "ABA Bulk Transfer", date: "2026-05-25",
    note: "Sewing operators + supervisors + QA inspectors, May 16–31",
  },
  {
    no: "SAL-2026-06-10", period: "2026-06-10", cycle: "1st half (10th)",
    headcount: 489, gross: 138200.00, nssf: 4680.00, tax: 11090.00, net: 122430.00,
    status: "Paid", paidVia: "ABA Bulk Transfer", date: "2026-06-10",
    note: "Sewing operators + supervisors + QA inspectors, June 1–15",
  },
  {
    no: "SAL-2026-06-25", period: "2026-06-25", cycle: "2nd half (25th)",
    headcount: 491, gross: 141600.00, nssf: 4710.00, tax: 11350.00, net: 125540.00,
    status: "Accounting Review", paidVia: null, date: "2026-06-13",
    note: "HR submitted; 3 staff flagged: variance > 20% (overtime spike)",
  },
  {
    no: "ALW-2026-06-NSSF", period: "2026-06", cycle: "Allowance · NSSF employer",
    headcount: 491, gross: 0, nssf: 9820.00, tax: 0, net: 9820.00,
    status: "Submitted", paidVia: null, date: "2026-06-13",
    note: "Employer NSSF contribution, June",
  },
  {
    no: "ALW-2026-06-PERMIT", period: "2026-06", cycle: "Allowance · Foreign worker permit",
    headcount: 12, gross: 0, nssf: 0, tax: 0, net: 360.00,
    status: "Submitted", paidVia: null, date: "2026-06-13",
    note: "Foreign-worker permit fee renewal × 12 (MoLVT)",
  },
  {
    no: "ALW-2026-06-OT", period: "2026-06", cycle: "Allowance · Overtime",
    headcount: 76, gross: 9180.00, nssf: 0, tax: 460.00, net: 8720.00,
    status: "Accounting Verified", paidVia: null, date: "2026-06-12",
    note: "Overtime allowance, 76 operators × avg 18hr week",
  },
].map((s) => ({ ...s, createdAt: now(), updatedAt: now() }));

async function main() {
  console.log("Connecting to Atlas…");
  const client = await new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  }).connect();

  const db = client.db("yaikh");

  for (const [name, docs] of [
    ["shipping_bills", shippingBills],
    ["bill_claims", billClaims],
    ["salary_bills", salaryBills],
  ]) {
    const col = db.collection(name);
    const before = await col.countDocuments();
    await col.deleteMany({});
    const r = await col.insertMany(docs);
    console.log(`  ${name}: cleared ${before} → inserted ${r.insertedCount}`);
  }

  await client.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
