/* POST /api/payway/merchant/payments — list payments from OUR Mongo ledger
 * (admin-only). Unlike ABA's transaction-list, this has no 3-day cap and
 * carries customer context (company, plan, email). Returns { enabled, rows }. */

import { NextResponse } from "next/server";
import { isAdmin, listPayments, paymentsEnabled, type PaymentStatus } from "@/lib/payway";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!paymentsEnabled()) return NextResponse.json({ enabled: false, rows: [] });
  const b = await req.json().catch(() => ({}));
  const rows = await listPayments({
    from: typeof b.from === "string" ? b.from : undefined,
    to: typeof b.to === "string" ? b.to : undefined,
    status: typeof b.status === "string" ? (b.status as PaymentStatus) : undefined,
  });
  return NextResponse.json({ enabled: true, rows });
}
