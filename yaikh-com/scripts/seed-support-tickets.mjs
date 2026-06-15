/* Seed support_tickets in the yaikhhomepage Atlas cluster.
 *
 *   Run from yaikh-com/:
 *     node scripts/seed-support-tickets.mjs
 *
 * Idempotent: clears `support_tickets` then re-inserts a realistic mix of
 * tickets across departments and statuses (Open, Assigned, InProgress,
 * Fixed, Closed) with multi-event timelines so the Admin PA chat agent
 * has a proper corpus to answer questions like "any AC issues today?"
 *
 * Reads MONGO_URL from .env.local.
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

const COLLECTION = "support_tickets";
const YEAR = 2026;

const T = (yyyy_mm_dd, hh_mm) => new Date(`${yyyy_mm_dd}T${hh_mm}:00+07:00`);

function build(no, base) {
  const created = base.timeline[0].dateTime;
  return {
    no: `ST-${YEAR}-${String(no).padStart(4, "0")}`,
    from: base.from,
    dept: base.dept,
    nature: base.nature,
    subject: base.subject,
    description: base.description,
    urgency: base.urgency || "Normal",
    photo: base.photo ?? null,
    status: base.status,
    assignee: base.assignee ?? null,
    date: created.toISOString().slice(0, 10),
    planDate: base.planDate ?? null,
    timeline: base.timeline,
    createdAt: created,
    updatedAt: base.timeline[base.timeline.length - 1].dateTime,
  };
}

const tickets = [
  build(1, {
    from: "YM0695 - ROUS NAL",
    dept: "Warehouse",
    nature: "6S",
    subject: "ម៉ូតូកង់បី អស់សាំង",
    description: "ម៉ូតូកង់បីដឹកក្រណាត់ទៅតុកកាត់អស់សាំង",
    urgency: "Normal",
    status: "Closed",
    assignee: "YM2250 - Prak Chanveasna",
    planDate: "2026-06-13",
    timeline: [
      { dateTime: T("2026-06-13", "07:42"), actor: "YM0695 - ROUS NAL", status: "Open", description: "Ticket created by YM0695 - ROUS NAL (Warehouse) — three-wheeler out of fuel." },
      { dateTime: T("2026-06-13", "07:55"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YM2250 - Prak Chanveasna by Admin desk." },
      { dateTime: T("2026-06-13", "08:10"), actor: "YM2250 - Prak Chanveasna", status: "InProgress", description: "Refuelling underway, 10L diesel from on-site tank." },
      { dateTime: T("2026-06-13", "08:32"), actor: "YM2250 - Prak Chanveasna", status: "Fixed", description: "Refuelled and tested. Note: tank refilled to 12L." },
      { dateTime: T("2026-06-13", "09:00"), actor: "YM0389 - CHAY PHANO", status: "Closed", description: "Closed by Admin." },
    ],
  }),
  build(2, {
    from: "YM0695 - ROUS NAL",
    dept: "Warehouse",
    nature: "Repair",
    subject: "Forklift អស់ប្រេងម៉ាស៊ុត",
    description: "Forklift អស់ប្រេងម៉ាស៊ុត — out of fuel mid-shift, blocking H&M shipment.",
    urgency: "High",
    status: "Closed",
    assignee: "YM0988 - Prak Chenda",
    planDate: "2026-06-13",
    timeline: [
      { dateTime: T("2026-06-13", "09:15"), actor: "YM0695 - ROUS NAL", status: "Open", description: "Ticket created — forklift down at WH-12K." },
      { dateTime: T("2026-06-13", "09:22"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YM0988 - Prak Chenda — plan date 2026-06-13." },
      { dateTime: T("2026-06-13", "10:05"), actor: "YM0988 - Prak Chenda", status: "InProgress", description: "Topping up diesel from main tank." },
      { dateTime: T("2026-06-13", "10:40"), actor: "YM0988 - Prak Chenda", status: "Fixed", description: "Refuelled, tested 5 lift cycles. All normal." },
      { dateTime: T("2026-06-13", "11:00"), actor: "YM0389 - CHAY PHANO", status: "Closed", description: "Closed." },
    ],
  }),
  build(3, {
    from: "YM8855 - Uth Chantha",
    dept: "GA",
    nature: "Repair",
    subject: "Repair Request - Rainwater Gutter at WH-12K",
    description: "The rainwater gutter at Warehouse 12000 is damaged and requires repair. It leaks from joints and needs immediate inspection and maintenance.",
    urgency: "High",
    status: "Assigned",
    assignee: "YMTM - Maintenance Team",
    planDate: "2026-06-16",
    timeline: [
      { dateTime: T("2026-06-14", "13:15"), actor: "YM8855 - Uth Chantha", status: "Open", description: "Ticket created by YM8855 - Uth Chantha (GA) — gutter leak at WH-12K." },
      { dateTime: T("2026-06-14", "13:45"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YMTM - Maintenance Team — plan date 2026-06-16. Awaiting weather window." },
    ],
  }),
  build(4, {
    from: "YM8855 - Uth Chantha",
    dept: "GA",
    nature: "Repair",
    subject: "Forklift ZDCC-006 & LDTC-003 (DISPOSAL)",
    description: "The forklift has no further repair value. Management has advised disposal. Please support in suspending repairs and assist with disposal steps.",
    urgency: "Low",
    status: "Open",
    assignee: null,
    timeline: [
      { dateTime: T("2026-06-14", "14:32"), actor: "YM8855 - Uth Chantha", status: "Open", description: "Ticket created — request to suspend repairs and start disposal paperwork." },
    ],
  }),
  build(5, {
    from: "YM1102 - SREY MAO",
    dept: "HR",
    nature: "Aircon",
    subject: "AC broken in meeting room B (HR floor)",
    description: "Compressor stopped at 09:14. Room is unusable for the upcoming all-hands stand-up at 14:00.",
    urgency: "Critical",
    status: "InProgress",
    assignee: "YM0988 - Prak Chenda",
    planDate: "2026-06-15",
    timeline: [
      { dateTime: T("2026-06-15", "09:18"), actor: "YM1102 - SREY MAO", status: "Open", description: "Ticket created by YM1102 - SREY MAO (HR) — AC compressor down in meeting room B." },
      { dateTime: T("2026-06-15", "09:25"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YM0988 - Prak Chenda — Critical urgency, plan date 2026-06-15." },
      { dateTime: T("2026-06-15", "10:02"), actor: "YM0988 - Prak Chenda", status: "InProgress", description: "On site, suspecting blown capacitor. Sourcing replacement from stores." },
    ],
  }),
  build(6, {
    from: "YM2231 - VANNA KHIM",
    dept: "Production",
    nature: "Electric",
    subject: "Sewing line 3 — main breaker trips intermittently",
    description: "Breaker for line 3 has tripped twice in the last hour. Production halted for ~20 min total.",
    urgency: "High",
    status: "Assigned",
    assignee: "YM0712 - SOK SOPHEAK",
    planDate: "2026-06-15",
    timeline: [
      { dateTime: T("2026-06-15", "10:11"), actor: "YM2231 - VANNA KHIM", status: "Open", description: "Ticket created — line 3 breaker trips, intermittent." },
      { dateTime: T("2026-06-15", "10:18"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YM0712 - SOK SOPHEAK (electrical)." },
    ],
  }),
  build(7, {
    from: "YM3421 - CHEA THIDA",
    dept: "GA",
    nature: "Cleaning",
    subject: "Carteen — water heater dead, no hot water for lunch",
    description: "Carteen water heater not powering on since this morning. Affects 200+ lunchtime users.",
    urgency: "High",
    status: "Fixed",
    assignee: "YM0712 - SOK SOPHEAK",
    planDate: "2026-06-14",
    timeline: [
      { dateTime: T("2026-06-14", "06:50"), actor: "YM3421 - CHEA THIDA", status: "Open", description: "Ticket created — carteen heater dead." },
      { dateTime: T("2026-06-14", "07:05"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YM0712 - SOK SOPHEAK." },
      { dateTime: T("2026-06-14", "07:30"), actor: "YM0712 - SOK SOPHEAK", status: "InProgress", description: "Element burned out, replacing with spare." },
      { dateTime: T("2026-06-14", "09:20"), actor: "YM0712 - SOK SOPHEAK", status: "Fixed", description: "New element installed. Tested 3 cycles at 70°C. Resolution: heating element swap." },
    ],
  }),
  build(8, {
    from: "YM5612 - NIN SOKHA",
    dept: "IT",
    nature: "Electric",
    subject: "Server room UPS beeping — battery warning",
    description: "UPS-2 in server room emitting continuous beep since 02:00 night shift. Mains seems fine.",
    urgency: "High",
    status: "InProgress",
    assignee: "YM4401 - CHHIT BUNNA",
    planDate: "2026-06-15",
    timeline: [
      { dateTime: T("2026-06-15", "02:08"), actor: "YM5612 - NIN SOKHA", status: "Open", description: "Ticket created — UPS-2 alarm during night shift." },
      { dateTime: T("2026-06-15", "07:45"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YM4401 - CHHIT BUNNA (IT infra)." },
      { dateTime: T("2026-06-15", "08:30"), actor: "YM4401 - CHHIT BUNNA", status: "InProgress", description: "On-site. Battery degraded, ordering replacement from supplier — ETA 24h." },
    ],
  }),
  build(9, {
    from: "YM1101 - PHALLY",
    dept: "CSR",
    nature: "Water",
    subject: "Drinking water dispenser dry on production floor 2",
    description: "Dispenser ran out at ~11:00. Need refill before afternoon shift change at 13:00.",
    urgency: "Normal",
    status: "Fixed",
    assignee: "YM3320 - TOUCH SARAY",
    planDate: "2026-06-15",
    timeline: [
      { dateTime: T("2026-06-15", "11:04"), actor: "YM1101 - PHALLY", status: "Open", description: "Ticket created — dispenser PF2 empty." },
      { dateTime: T("2026-06-15", "11:10"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YM3320 - TOUCH SARAY (cleaning team)." },
      { dateTime: T("2026-06-15", "11:25"), actor: "YM3320 - TOUCH SARAY", status: "Fixed", description: "New 20L bottle installed. Confirmed flow." },
    ],
  }),
  build(10, {
    from: "YM7710 - DARA",
    dept: "Production",
    nature: "Aircon",
    subject: "AC in cutting room intermittent — temp rising",
    description: "Cutting room AC kicking off every 15 min, room reaching 32°C. Fabric handling becoming difficult.",
    urgency: "High",
    status: "Open",
    assignee: null,
    timeline: [
      { dateTime: T("2026-06-15", "11:48"), actor: "YM7710 - DARA", status: "Open", description: "Ticket created — cutting room AC short-cycling." },
    ],
  }),
  build(11, {
    from: "YM0399 - NICK HENG",
    dept: "Admin",
    nature: "H&S",
    subject: "Emergency exit door at WH-12K won't latch closed",
    description: "Door swings free, doesn't latch. H&S risk — animals/insects entering at night.",
    urgency: "High",
    status: "Assigned",
    assignee: "YMTM - Maintenance Team",
    planDate: "2026-06-15",
    timeline: [
      { dateTime: T("2026-06-15", "08:00"), actor: "YM0399 - NICK HENG", status: "Open", description: "Ticket created — emergency exit latch failure." },
      { dateTime: T("2026-06-15", "08:14"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YMTM - Maintenance Team. Priority H&S." },
    ],
  }),
  build(12, {
    from: "YM2002 - SREY POV",
    dept: "YAI",
    nature: "Other",
    subject: "Office printer paper jam — won't clear",
    description: "Main YAI office printer jammed since 09:00. Toner LED also blinking.",
    urgency: "Low",
    status: "Closed",
    assignee: "YM4401 - CHHIT BUNNA",
    planDate: "2026-06-14",
    timeline: [
      { dateTime: T("2026-06-14", "09:12"), actor: "YM2002 - SREY POV", status: "Open", description: "Ticket created — printer jam." },
      { dateTime: T("2026-06-14", "09:30"), actor: "YM0389 - CHAY PHANO", status: "Assigned", description: "Assigned to YM4401 - CHHIT BUNNA (IT)." },
      { dateTime: T("2026-06-14", "09:50"), actor: "YM4401 - CHHIT BUNNA", status: "InProgress", description: "Clearing fuser unit, restocking paper drawer." },
      { dateTime: T("2026-06-14", "10:05"), actor: "YM4401 - CHHIT BUNNA", status: "Fixed", description: "Paper cleared, toner replaced. Test page OK." },
      { dateTime: T("2026-06-14", "10:30"), actor: "YM0389 - CHAY PHANO", status: "Closed", description: "Closed." },
    ],
  }),
];

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 8_000,
});

try {
  await client.connect();
  const db = client.db("yaikh");
  const col = db.collection(COLLECTION);

  console.log(`Clearing ${COLLECTION}…`);
  await col.deleteMany({});

  console.log(`Inserting ${tickets.length} tickets…`);
  await col.insertMany(tickets);

  console.log("\nSeeded:");
  for (const t of tickets) {
    console.log(`  ${t.no}  ${t.status.padEnd(11)}  ${t.dept.padEnd(12)} ${t.subject}`);
  }
  console.log(`\nDone. ${tickets.length} tickets in ${COLLECTION}.`);
} catch (err) {
  console.error("Seed failed:", err);
  process.exitCode = 1;
} finally {
  await client.close();
}
