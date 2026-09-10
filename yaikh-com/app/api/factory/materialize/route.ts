/* POST /api/factory/materialize
 *
 * Cold-start: takes an owner's answers (workers, lines, product, certs,
 * buyers, warehouse) and materialises a demo factory in Mongo:
 *   - Stores config in `factory_config`
 *   - Wipes + reseeds `pa_tasks` scaled proportionally to worker count
 *
 * Called by the Big Brain onboarding flow on the dashboard the very
 * first time an owner opens Big Brain. Idempotent — running it again
 * re-materialises with new inputs.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { PILLS_BY_PA } from "@/lib/pa-pills";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  visitor?: string;
  workers?: number;
  lines?: number;
  product?: string;
  hasWarehouse?: boolean;
  certifications?: string[];
  buyers?: string[];
};

// 4 static + 9 dynamic PAs — full pill list for scaling pa_tasks.
const ALL_PILLS: Record<string, string[]> = {
  accounting: ["Purchase Request", "Bill Claim", "Salary Bill", "Shipping Bill", "IEWS", "Accountant"],
  hr:         ["Attendance today", "Open leave requests", "Training schedule", "Org chart updates", "Temp worker requests", "Speak Up"],
  admin:      ["Open support tickets", "Meeting room bookings", "Gate passes today", "Y Shop orders", "Visitors today"],
  csr:        ["Air temperature today", "Water usage log", "Energy consumption", "Compliance audits", "Environmental alerts"],
  ...PILLS_BY_PA,
};

const ORIGIN_MAP: Record<string, string[]> = {
  accounting: ["mrp","ytm","admin","hr","production","qa","shipping","csr","social","4dp","ypi","ce"],
  hr:         ["production","admin","4dp","ce","worker"],
  admin:      ["worker","hr","mrp","ytm","csr","gm"],
  csr:        ["admin","qa","hr","buyer","auditor"],
  shipping:   ["mrp","ce","ytm","buyer"],
  mrp:        ["4dp","production","qa","supplier"],
  qa:         ["production","buyer","mrp","shipping"],
  production: ["mrp","qa","ytm","ce"],
  ce:         ["production","hr","ytm","4dp"],
  ytm:        ["production","qa","admin"],
  "4dp":      ["buyer","mrp","production","ce"],
  ypi:        ["production","qa","ce","hr"],
  social:     ["buyer","public","csr","management"],
};

const SAMPLE_REQUESTERS = [
  "Sopheara Meas","Vichetr Kim","Sreymom Chan","Rithy Ly",
  "Vichea Ly","Pisey Meas","Chanthou Sokha","Bunthorn Chea",
  "Sopheara Nou","Sokun Prak","Vichetr Ung","Chantha Meng",
];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const cnum = () => `${pick(["ABCD","TCLU","MSKU","MSCU","GESU"])}${rand(1000000,9999999)}`;
const dayName = (daysFromNow: number) =>
  new Date(Date.now() + daysFromNow * 86400_000).toISOString().slice(0, 10);

function summaryFor(pa: string, pill: string, workers: number, lines: number, product: string): string {
  const line = pick(["A","B","C","D"].slice(0, Math.max(1, lines)));
  const scale = workers >= 1000 ? "" : workers >= 300 ? "" : " (small run)";
  const map: Record<string, () => string> = {
    "Container plan":         () => `${rand(1,3)} container${rand(1,3)>1?"s":""} delayed by ${rand(2,6)} days — ETA slip to ${dayName(rand(3,12))}. Buyer needs new ETD.`,
    "Customs clearance":      () => `Container ${cnum()} held at ${pick(["SHV","LM17"])} customs — ${pick(["HS-code query","fumigation cert missing","duty payment pending"])}.`,
    "Delivery schedule":      () => `PO-${rand(2026,2027)}-${rand(30,80)} finishing lags plan by ${rand(2,7)} days.`,
    "Inventory levels":       () => `Fabric lot ${cnum()} on Line ${line} short ${rand(30,200)} m — Cutting will run out in ${rand(1,3)} days.`,
    "Material plan":          () => `New PO ${rand(20,80)}k pcs ${product} needs BOM sign-off — 4DP delivered tech-pack ${rand(1,4)} days ago.`,
    "BOM review":             () => `Style YTM-${pick(["P","T","J"])}-${rand(100,199)} BOM revised by buyer — trim substitution needs MRP approval.`,
    "Stock alerts":           () => `${pick(["Overlock loopers","Needle bars","Timing belts","Zip 15cm nickel"])} below reorder point — only ${rand(2,5)} left.`,
    "Supplier orders":        () => `PO to ${pick(["China Silk Mill","VN Trim House","Long An Dye Co"])} — quote US$${rand(2,25)*1000}, awaiting 3-quote comparison.`,
    "Reorder points":         () => `${rand(3,7)} SKUs breached reorder point this week — auto-PRs generated, awaiting Accounting approval.`,
    "Recent defect inspections": () => `Inline round on Sewing-${line} — ${rand(4,18)} defects flagged, top cause: ${pick(["skipped stitches","broken needles","label misalign"])}.`,
    "Customer complaints":       () => pick([
      `Complaint YAI-2026-${rand(80,120)} from ${pick(["BuyerCo","TargetCo","EU-Direct"])} on Line ${line} — ${pick(["colour bleeding","measurement off","seam burst"])}. 4M analysis submitted ${rand(6,14)} days ago but line hasn't improved. Boss opinion needed.`,
      `${pick(["BuyerCo","TargetCo","EU-Direct"])} raised ${rand(2,4)} complaints in 2 weeks — same operator on Line ${line} involved. HR looped but no action yet. Escalate?`,
      `Third-party inspection at buyer's DC found ${rand(3,9)} defects per carton on last shipment — buyer requesting root-cause report + rework plan by ${dayName(rand(2,5))}.`,
    ]),
    "Open call-outs":            () => pick([
      `Line ${line} supervisor called out on trim colour mismatch — QA + MRP looped, waiting on your authorisation to return the lot to supplier.`,
      `Call Out on Sewing-${line}: broken needle not recovered on style YTM-P-${rand(100,199)}, ${rand(40,120)} pcs quarantined. Need decision to rework or scrap.`,
      `Cutting called out: fabric shade band outside buyer tolerance on 3 rolls — buyer approval or lot rejection needs your call.`,
    ]),
    "Third-party audits":        () => `${pick(["SGS","Intertek","TUV"])} audit scheduled ${dayName(rand(3,20))} — checklist ${rand(60,95)}% complete.`,
    "Quality reports":           () => `${pick(["Weekly defect summary","PSA holds report","4M closure log"])} due to management by ${dayName(rand(1,3))}.`,
    "Today's production plan":   () => `Line ${line} plan today: ${rand(200, Math.max(300, Math.floor(workers/lines/1.5)))} pcs of PO-${rand(30,80)} — currently at ${rand(30,90)}% by mid-shift.`,
    "WIP by line":               () => `WIP total ${rand(Math.floor(workers*15), Math.floor(workers*22))} pcs — Line ${line} highest.`,
    "Cutting throughput":        () => `Cutting output ${rand(Math.floor(workers*3.5), Math.floor(workers*4.6))} pcs today${scale}.`,
    "Finishing throughput":      () => `Finishing output matches sewing draw within ${rand(1,5)}%.`,
    "Production status":         () => `PO-2026-${rand(30,80)} at ${rand(30,90)}% complete, ETD ${dayName(rand(7,25))}.`,
    "Standard time updates":     () => `Style YTM-${pick(["P","T","J"])}-${rand(100,199)} — SMV revision after 3-cycle time-study, awaiting Production sign-off.`,
    "Productivity by line":      () => `Line ${line} productivity ${rand(65,88)}% — below 80% trigger, line-balance review needed.`,
    "Machine allocation":        () => `Next week plan needs ${rand(2,6)} more ${pick(["button-hole","bar-tack","overlock"])} machines on Line ${line}.`,
    "Skill inventory":           () => `${rand(3,9)} operators promoted to Level ${rand(3,5)} this month — skill matrix update pending.`,
    "Cost center summary":       () => `CC-${pick(["1001","1002","1003","2000","3000"])} cost per garment variance ${rand(2,9)}% vs standard.`,
    "Machine downtime":          () => pick([
      `Compressor down ${rand(3,8)} hrs — spare part quote US$${rand(3,6)}k needs your sign-off (over 3-quote threshold, whole air line is affected).`,
      `Machine M-${pick(["A","B","C"])}${rand(1,90).toString().padStart(3,"0")} down ${rand(15,180)} min today — cause: ${pick(["needle-bar","motor overheat","timing belt","PLC error"])}, YTM working on it.`,
      `Boiler tripped this morning — ${rand(1,3)} hrs to steam back up; buyer's ETD not affected but 2nd incident this month, YTM asking for capex review.`,
    ]),
    "Repair queue":              () => `${rand(3,9)} machines in repair queue — oldest ticket ${rand(1,4)} days open.`,
    "Maintenance schedule":      () => `PM due ${dayName(rand(1,7))} on ${rand(4,12)} machines.`,
    "Late maintenance alerts":   () => `Machine M-${pick(["A","B","C"])}${rand(1,90).toString().padStart(3,"0")} PM overdue by ${rand(3,10)} days.`,
    "Spare parts stock":         () => `${pick(["Overlock loopers","Needle bars","Timing belts","Motor brushes"])} below min stock (${rand(1,3)} left).`,
    "Sample approvals":          () => `Sample for style YTM-${pick(["P","T","J"])}-${rand(100,199)} awaiting buyer approval — sent ${rand(1,5)} days ago.`,
    "Pattern review queue":      () => `${rand(2,5)} patterns in review — buyer needs pocket-placement revision.`,
    "Spec sheets":               () => `Tech-pack for PO-2026-${rand(30,80)} needs ${pick(["measurement","construction","care label"])} revision.`,
    "Trim approvals":            () => `${pick(["Button","Zipper","Hangtag","Label"])} approval on style YTM-${pick(["P","T","J"])}-${rand(100,199)} — swatch sent ${rand(1,4)} days ago.`,
    "Design roadmap":            () => `FW-2026-27 roadmap: ${rand(6,14)} styles in pattern, ${rand(3,8)} in sample.`,
    "Open Kaizen projects":      () => `Kaizen KZN-2026-${rand(10,30)} on ${pick(["Line B changeover","Cutting layout","Finishing flow"])} — ${rand(30,80)}% complete.`,
    "SOP review queue":          () => `SOP-${pick(["QA","YTM","HR","PROD"])}-${rand(1,30).toString().padStart(3,"0")} due for annual review.`,
    "Latest tech-packs":         () => `${rand(2,6)} tech-packs updated by 4DP this week — awaiting translation to Khmer + Chinese before floor rollout.`,
    "Measurement sheets":        () => `Style YTM-${pick(["P","T","J"])}-${rand(100,199)} measurement sheet published — pending QC and Line ${pick(["A","B","C"])} supervisor sign-off on iPads.`,
    "Trim cards":                () => `Trim card for ${pick(["polo","yoga set","hoodie","legging"])} ${pick(["button","zipper","label","hangtag"])} loaded — ${rand(3,12)} operators still need briefing on shop-floor TV.`,
    "Packing instructions":      () => `Packing method for PO-${rand(2026,2027)}-${rand(30,80)} published in 3 languages — finishing supervisor to confirm carton spec.`,
    "Sample-stage notes":        () => `Sample-stage remarks on style YTM-${pick(["P","T","J"])}-${rand(100,199)} (${pick(["pocket placement","seam construction","fit at hip","fabric hand-feel"])}) — QC needs to brief line before production start.`,
    "Production-meeting comments":() => `Weekly production meeting notes uploaded — ${rand(3,9)} action points assigned across Cutting, Sewing-${pick(["A","B","C"])}, Finishing.`,
    "Efficiency audits":         () => `Efficiency audit on Line ${line} scheduled ${dayName(rand(3,15))} — checklist ${rand(0,60)}% prepped.`,
    "Process optimization":      () => `${pick(["Button-hole parallel setup","Cutting layout change","Trim kit pre-assembly"])} pilot showed ${rand(4,12)}% efficiency gain.`,
    "Improvement KPIs":          () => `${pick(["Energy per garment","Water per garment","Defect rate","OTIF"])} tracking ${pick(["above","below"])} target this week.`,
    "TikTok comments":           () => `${rand(5,25)} unreplied comments on ${pick(["team-dance clip","factory tour","new-line reveal"])} post.`,
    "Facebook comments":         () => `${rand(3,15)} unreplied comments — ${rand(1,3)} are ${pick(["quality complaint","buyer enquiry","recruitment interest"])}.`,
    "YouTube comments":          () => `${rand(2,12)} comments on latest sample-room-tour video.`,
    "Instagram comments":        () => `${rand(4,18)} unreplied comments on visual posts.`,
    "LinkedIn comments":         () => `${rand(2,8)} unreplied comments on latest ${pick(["WRAP certification","GRS milestone","factory-expansion"])} post.`,
    "Purchase Request":       () => pick([
      `New boiler quote US$${rand(15,28)*1000} from ${pick(["SteamTech Cambodia","VN Boilers","Long An Industrial"])} — CE + YTM validated the spec, need your call on brand vs price.`,
      `Fabric PR US$${rand(40,80)}k for ${pick(["BuyerCo","TargetCo"])} Nov delivery — MRP flagged a supplier change, your opinion needed.`,
      `Compressor spare-part quote US$${rand(3,8)}k — over the 3-quote threshold, need boss sign-off (${pick(["Line B","Line A"])} down until it's replaced).`,
      `Capex PR: ${rand(6,18)} new sewing machines US$${rand(20,60)}k — CE says needed for Q1 capacity, awaiting your decision.`,
      `Office supplies PR for ${pick(["Q4","month-end"])} US$${rand(200,900)} — routine, ready to sign.`,
    ]),
    "Bill Claim":             () => `Bill claim US$${rand(20,400)} for ${pick(["taxi","staff meal","training","printing"])} — awaiting reimbursement.`,
    "Salary Bill":            () => `Payroll run ${dayName(rand(2,15))} — ${workers} employees, total US$${(workers*rand(180,260)).toLocaleString()}.`,
    "Shipping Bill":          () => `Freight invoice from ${pick(["MSC","OOCL","YM","CMA"])} US$${rand(600,3800)} — customs cleared, awaiting payment.`,
    "IEWS":                   () => `${rand(3,12)} e-invoices to reconcile with MEF GDDE portal today.`,
    "Accountant":             () => `Bank reconciliation — ${rand(2,8)} unmatched transactions on ABA statement.`,
    "Attendance today":       () => `${rand(Math.floor(workers*0.02), Math.floor(workers*0.06))} absentees this morning — CCTV feed live.`,
    "Open leave requests":    () => `${rand(3,12)} leave requests pending approval — ${pick(["Line A","Line B","Cutting"])} supervisor to sign.`,
    "Training schedule":      () => `WRAP refresher for ${rand(20,80)} operators scheduled ${dayName(rand(3,10))}.`,
    "Org chart updates":      () => `${rand(1,4)} promotions + ${rand(1,3)} transfers pending Org Chart sync.`,
    "Temp worker requests":   () => `Production Head requests ${rand(10,40)} temp workers for peak week ${dayName(rand(5,15))}.`,
    "Speak Up":               () => pick([
      `${rand(3,5)} workers filed an anonymised grievance about Line ${line} supervisor last week — HR investigation report ready for your review.`,
      `Complaint about canteen food quality — ${rand(6,15)} workers signed a joint Speak Up. HR proposes ${pick(["change caterer","subsidy review","tasting panel"])} — needs your call.`,
      `Anonymous wage-dispute Speak Up — HR + Compliance believe it's a valid Art-104 claim; response due in ${rand(3,10)} days.`,
    ]),
    "Open support tickets":   () => `${rand(3,15)} tickets open — top categories: ${pick(["AC","water","gate","lighting"])}.`,
    "Meeting room bookings":  () => `${rand(1,4)} booking clashes today for ${pick(["Room 1","Room 2","Board Room"])}.`,
    "Gate passes today":      () => `${rand(4,18)} pending gate passes — ${pick(["contractor visit","supplier delivery","staff outing"])}.`,
    "Y Shop orders":          () => `${rand(2,10)} Y Shop requests awaiting stock — ${pick(["A4 paper","marker pens","gloves","toner"])}.`,
    "Visitors today":         () => `${rand(1,6)} visitors expected — ${pick(["buyer inspection","supplier meeting","audit team"])}.`,
    "Air temperature today":  () => `Line ${line} ambient ${rand(28,34)}°C — ${pick(["above target","within target","AC service due"])}.`,
    "Water usage log":        () => `Today ${rand(80, 200)*Math.max(1,Math.floor(workers/100))} m³ — ${pick(["on trend","above trend","below trend"])}.`,
    "Energy consumption":     () => `Today ${rand(400, 900)*Math.max(1,Math.floor(workers/100))} kWh — grid ${rand(70,95)}%, solar ${rand(5,30)}%.`,
    "Compliance audits":      () => `${pick(["WRAP","BSCI","HIGG","SEDEX","GRS"])} audit prep ${rand(50,95)}% — ${rand(2,8)} items outstanding.`,
    "Environmental alerts":   () => pick([
      `Effluent pH out of range at discharge point — retest scheduled ${dayName(rand(1,3))}. If second fail, MoE reporting kicks in; CSR asks for your call.`,
      `Chemical spill drill missed for ${rand(2,4)} months — WRAP finding likely if buyer walks in. CSR + Admin ready to run, needs your green-light.`,
      `Boiler emissions above limit ${rand(2,4)} times this month — CSR flagging for capex conversation with YTM.`,
    ]),
  };
  return (map[pill] || (() => `${pill} — item raised ${rand(1,8)} days ago, awaiting ${pa} action.`))();
}


export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const workers = Math.max(50, Math.min(10_000, body.workers ?? 1000));
    const lines = Math.max(1, Math.min(20, body.lines ?? Math.max(1, Math.round(workers / 300))));
    const product = (body.product || "polos").toString().slice(0, 60);
    const hasWarehouse = body.hasWarehouse ?? true;
    const certifications = (body.certifications || ["WRAP","BSCI","HIGG"]).slice(0, 20);
    const buyers = (body.buyers || ["BuyerCo","TargetCo"]).slice(0, 20);
    const visitor = (body.visitor || "Visitor").toString().slice(0, 80);

    const db = await getDb();

    // 1. Persist config
    const configDoc = {
      visitor,
      workers,
      lines,
      product,
      hasWarehouse,
      certifications,
      buyers,
      materialised_at: new Date(),
    };
    await db.collection("factory_config").updateOne(
      { visitor },
      { $set: configDoc },
      { upsert: true },
    );

    // 2. Rebuild pa_tasks scaled to workforce
    const scale = workers / 1000; // 1000 workers = baseline

    const col = db.collection("pa_tasks");
    await col.deleteMany({ "meta.source": { $in: ["seed_pa_tasks_v1", "materialize_v1"] } });

    const docs: Record<string, unknown>[] = [];
    const now = Date.now();

    for (const [pa, pills] of Object.entries(ALL_PILLS)) {
      // Every PA gets 2 GUARANTEED burning items — high age, in_progress
      // status, so Yai always has something meaty to bring to the boss
      // for every department. Distributed across the PA's pills.
      for (let b = 0; b < 2; b++) {
        const pill = pills[b % pills.length];
        const ageDays = rand(6, 14); // burning = old enough to hurt
        const created_at = new Date(now - ageDays * 86400_000);
        const deadline = new Date(created_at.getTime() + rand(3, 7) * 86400_000);
        docs.push({
          pa,
          pill,
          item_id: `${pa.toUpperCase()}-${pill.slice(0, 3).replace(/\s/g, "").toUpperCase()}-BURN${b + 1}`,
          origin_pa: pick(ORIGIN_MAP[pa] || ["hr"]),
          requester: pick(SAMPLE_REQUESTERS),
          status: "in_progress",
          priority: "burning",
          summary: summaryFor(pa, pill, workers, lines, product),
          created_at,
          deadline,
          meta: { source: "materialize_v1", visitor, workers, burning: true },
        });
      }

      // Then the regular scale-based volume on top.
      for (const pill of pills) {
        const baseCount = rand(2, 6);
        const scaled = Math.max(1, Math.round(baseCount * Math.max(0.4, scale)));
        for (let i = 0; i < scaled; i++) {
          const ageDays = rand(0, 8);
          const created_at = new Date(now - ageDays * 86400_000);
          const deadline = new Date(created_at.getTime() + rand(3, 14) * 86400_000);
          docs.push({
            pa,
            pill,
            item_id: `${pa.toUpperCase()}-${pill.slice(0, 3).replace(/\s/g, "").toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
            origin_pa: pick(ORIGIN_MAP[pa] || ["hr"]),
            requester: pick(SAMPLE_REQUESTERS),
            status: Math.random() < 0.15 ? "in_progress" : "pending",
            priority: "normal",
            summary: summaryFor(pa, pill, workers, lines, product),
            created_at,
            deadline,
            meta: { source: "materialize_v1", visitor, workers },
          });
        }
      }
    }

    let insertedCount = 0;
    if (docs.length) {
      const res = await col.insertMany(docs);
      insertedCount = res.insertedCount;
    }

    return NextResponse.json({
      ok: true,
      config: configDoc,
      tasksSeeded: insertedCount,
      pillsCovered: Object.values(ALL_PILLS).reduce((a, b) => a + b.length, 0),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
