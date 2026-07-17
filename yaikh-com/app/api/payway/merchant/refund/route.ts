/* POST /api/payway/merchant/refund — full/partial refund (admin-only).
 * Requires PAYWAY_RSA_PUBLIC_KEY (merchant_auth). */

import { NextResponse } from "next/server";
import { refund, paywayConfigured, refundConfigured, isAdmin, markPayment } from "@/lib/payway";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!paywayConfigured()) return NextResponse.json({ error: "PayWay not configured" }, { status: 503 });
  if (!refundConfigured()) return NextResponse.json({ error: "Refund not configured (missing RSA key)" }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  const amount = Number(b.refund_amount);
  if (!b.tran_id) return NextResponse.json({ error: "Missing tran_id" }, { status: 400 });
  if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: "Invalid refund amount" }, { status: 400 });
  const res = await refund(b.tran_id, amount);
  const code = res?.status?.code ?? res?.status;
  if (code === "00" || code === 0 || res?.transaction_status === "REFUNDED") {
    await markPayment(b.tran_id, { status: "REFUNDED", refunded_amount: Number(res?.total_refunded ?? amount) });
  }
  return NextResponse.json(res);
}
