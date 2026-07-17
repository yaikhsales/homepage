/* POST /api/payway/merchant/transactions — list transactions (admin-only). */

import { NextResponse } from "next/server";
import { transactionList, paywayConfigured, isAdmin } from "@/lib/payway";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!paywayConfigured()) return NextResponse.json({ error: "PayWay not configured" }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  const r = await transactionList({
    from_date: b.from_date, to_date: b.to_date,
    status: b.status, page: b.page, pagination: b.pagination,
  });
  return NextResponse.json(r);
}
