/* Seed purchase_requests in the yaikhhomepage Atlas cluster.
 *
 *   Run from yaikh-com/:
 *     node scripts/seed-purchase-requests.mjs
 *
 * Idempotent: clears `purchase_requests` then inserts a realistic
 * Cambodian garment-factory PR mix across all approval stages so the
 * Accounting PA chat agent + the "Pending PR approvals" pill have
 * actual data to surface.
 */

import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      process.env[m[1]] = v;
    }
  }
}

const uri = process.env.MONGO_URL;
if (!uri) { console.error("MONGO_URL missing"); process.exit(1); }

const now = () => new Date();

const purchaseRequests = [
  {
    prNo: "PR-2026-001",
    requester: { userId: "u_khun",    name: "Mr. Khun",    dept: "Admin" },
    items: [{ name: "Office desk", qty: 4, unitPrice: 280, currency: "USD" }],
    totalAmount: 1120, currency: "USD",
    quotations: [
      { supplier: "Sokimex Furniture",     amount: 1120, fileUrl: "/uploads/q1.pdf" },
      { supplier: "Phnom Penh Office Co.", amount: 1180, fileUrl: "/uploads/q2.pdf" },
      { supplier: "Mekong Interior",       amount: 1240, fileUrl: "/uploads/q3.pdf" },
    ],
    selectedQuote: 0,
    status: "supervisor_approved",
    approvals: [
      { level: "supervisor", userId: "u_lim", at: "2026-06-12T09:14Z", decision: "approved" },
      { level: "manager",    userId: null,    at: null, decision: null },
    ],
    description: "4× office desks for new sample-room workspace",
    date: "2026-06-12",
  },
  {
    prNo: "PR-2026-002",
    requester: { userId: "u_sopheap", name: "Ms. Sopheap", dept: "Sales" },
    items: [{ name: "Trade show booth materials", qty: 1, unitPrice: 2400, currency: "USD" }],
    totalAmount: 2400, currency: "USD",
    quotations: [
      { supplier: "Riverside Print House", amount: 2400 },
      { supplier: "TexLink Promo Co.",     amount: 2620 },
    ],
    selectedQuote: 0,
    status: "submitted",
    approvals: [{ level: "supervisor", userId: null, at: null, decision: null }],
    description: "Only 2 quotations — need a 3rd before supervisor can approve",
    date: "2026-06-14",
    sopFlag: "Missing 3rd quotation",
  },
  {
    prNo: "PR-2026-003",
    requester: { userId: "u_lim", name: "Mr. Lim", dept: "Finance" },
    items: [{ name: "Adobe Acrobat license × 5 seats", qty: 5, unitPrice: 180, currency: "USD" }],
    totalAmount: 900, currency: "USD",
    quotations: [
      { supplier: "Adobe Cambodia",  amount: 900 },
      { supplier: "Software Direct", amount: 950 },
      { supplier: "Khmer IT Supply", amount: 980 },
    ],
    selectedQuote: 0,
    status: "paid",
    approvals: [
      { level: "supervisor", userId: "u_pich",   at: "2026-06-02T08:00Z", decision: "approved" },
      { level: "manager",    userId: "u_davy",   at: "2026-06-03T10:30Z", decision: "approved" },
      { level: "finance",    userId: "u_khun",   at: "2026-06-04T14:15Z", decision: "approved" },
    ],
    description: "Annual Adobe seats renewal — paid via ABA on 2026-06-05",
    date: "2026-06-02",
  },
  {
    prNo: "PR-2026-004",
    requester: { userId: "u_sokha", name: "Mr. Sokha", dept: "Production" },
    items: [{ name: "Industrial sewing machine needles (case)", qty: 12, unitPrice: 75, currency: "USD" }],
    totalAmount: 900, currency: "USD",
    quotations: [
      { supplier: "Juki Cambodia",     amount: 900 },
      { supplier: "Brother Industrial", amount: 940 },
      { supplier: "Singer Wholesale",   amount: 990 },
    ],
    selectedQuote: 0,
    status: "manager_approved",
    approvals: [
      { level: "supervisor", userId: "u_lim",  at: "2026-06-08T07:45Z", decision: "approved" },
      { level: "manager",    userId: "u_davy", at: "2026-06-09T11:00Z", decision: "approved" },
      { level: "finance",    userId: null,     at: null, decision: null },
    ],
    description: "Production-line needle replacement, urgent",
    date: "2026-06-08",
  },
  {
    prNo: "PR-2026-005",
    requester: { userId: "u_theary", name: "Ms. Theary", dept: "HR" },
    items: [{ name: "Staff uniforms (60 pcs)", qty: 60, unitPrice: 22, currency: "USD" }],
    totalAmount: 1320, currency: "USD",
    quotations: [
      { supplier: "Yaikh in-house",        amount: 1320 },
      { supplier: "TexLink Garment Group", amount: 1380 },
      { supplier: "Cambodian Apparel",     amount: 1410 },
    ],
    selectedQuote: 0,
    status: "supervisor_approved",
    approvals: [
      { level: "supervisor", userId: "u_pich", at: "2026-06-10T15:20Z", decision: "approved" },
      { level: "manager",    userId: null,     at: null, decision: null },
    ],
    description: "New uniforms for Q3 hires + replacement for veterans",
    date: "2026-06-10",
  },
  {
    prNo: "PR-2026-006",
    requester: { userId: "u_pich", name: "Ms. Pich", dept: "Merchandising" },
    items: [{ name: "Fabric sample swatches (DHL inbound)", qty: 1, unitPrice: 480, currency: "USD" }],
    totalAmount: 480, currency: "USD",
    quotations: [
      { supplier: "Far East Textile Co.", amount: 480 },
    ],
    selectedQuote: 0,
    status: "rejected",
    approvals: [
      { level: "supervisor", userId: "u_lim", at: "2026-06-13T09:00Z", decision: "rejected", reason: "Use Bill Claim — supplier samples should go via reimbursement, not PR" },
    ],
    description: "Sample swatches from Far East Textile for upcoming H&M brief",
    date: "2026-06-13",
  },
  {
    prNo: "PR-2026-007",
    requester: { userId: "u_davy", name: "Mr. Davy", dept: "Logistics" },
    items: [{ name: "Container locks + seals (200 sets)", qty: 200, unitPrice: 8.5, currency: "USD" }],
    totalAmount: 1700, currency: "USD",
    quotations: [
      { supplier: "SokKim Logistics Supply", amount: 1700 },
      { supplier: "Khmer Marine Outfit",     amount: 1780 },
      { supplier: "Bolloré Supply Chain",    amount: 1820 },
    ],
    selectedQuote: 0,
    status: "submitted",
    approvals: [{ level: "supervisor", userId: null, at: null, decision: null }],
    description: "Restock for outbound containers Q3-Q4",
    date: "2026-06-14",
  },
  {
    prNo: "PR-2026-008",
    requester: { userId: "u_vannak", name: "Mr. Vannak", dept: "Production" },
    items: [{ name: "Polyester thread cones × 200", qty: 200, unitPrice: 6.2, currency: "USD" }],
    totalAmount: 1240, currency: "USD",
    quotations: [
      { supplier: "A&E Thread Vietnam",   amount: 1240 },
      { supplier: "Coats Thread Cambodia", amount: 1280 },
      { supplier: "Madeira Thread",        amount: 1340 },
    ],
    selectedQuote: 0,
    status: "supervisor_approved",
    approvals: [
      { level: "supervisor", userId: "u_pich", at: "2026-06-11T08:30Z", decision: "approved" },
      { level: "manager",    userId: null,     at: null, decision: null },
    ],
    description: "Thread restock for current Uniqlo run",
    date: "2026-06-11",
  },
];

async function main() {
  console.log("Connecting to Atlas…");
  const client = await new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect();
  const db = client.db("yaikh");
  const col = db.collection("purchase_requests");
  const before = await col.countDocuments();
  await col.deleteMany({});
  const r = await col.insertMany(purchaseRequests.map(pr => ({ ...pr, createdAt: now(), updatedAt: now() })));
  console.log(`  purchase_requests: cleared ${before} → inserted ${r.insertedCount}`);
  await client.close();
}

main().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
