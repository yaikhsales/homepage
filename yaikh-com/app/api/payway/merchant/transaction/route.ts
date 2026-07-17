/* POST /api/payway/merchant/transaction — transaction detail (admin-only). */

import { NextResponse } from "next/server";
import { transactionDetail, paywayConfigured, isAdmin } from "@/lib/payway";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!paywayConfigured()) return NextResponse.json({ error: "PayWay not configured" }, { status: 503 });
  const { tran_id } = await req.json().catch(() => ({}));
  if (!tran_id) return NextResponse.json({ error: "Missing tran_id" }, { status: 400 });
  return NextResponse.json(await transactionDetail(tran_id));
}
