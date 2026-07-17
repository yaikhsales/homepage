/* POST /api/payway/check — server-side verification of a purchase.
 * The browser popup's "success" event is NOT proof of payment; the
 * subscribe page must gate its success state on this. Returns
 * { paid, code, status } where code 0 = APPROVED. */

import { NextResponse } from "next/server";
import { checkTransaction, paywayConfigured, markPayment } from "@/lib/payway";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!paywayConfigured()) {
    return NextResponse.json({ error: "PayWay not configured" }, { status: 503 });
  }
  const { tran_id } = (await req.json().catch(() => ({}))) as { tran_id?: string };
  if (!tran_id) {
    return NextResponse.json({ error: "Missing tran_id" }, { status: 400 });
  }
  const res = await checkTransaction(tran_id);
  const data = (res && typeof res === "object" && res.data) || {};
  const code = data.payment_status_code;
  const paid = code === 0;

  // Keep our ledger in sync with the live ABA status.
  if (paid) await markPayment(tran_id, { paid: true });
  else if (typeof data.payment_status === "string" && /DECLIN|CANCEL|REFUND/i.test(data.payment_status)) {
    const s = data.payment_status.toUpperCase();
    await markPayment(tran_id, { status: s.includes("REFUND") ? "REFUNDED" : s.includes("CANCEL") ? "CANCELLED" : "DECLINED" });
  }

  return NextResponse.json({
    paid,
    code: code ?? null,
    status: data.payment_status ?? null,
    raw_status: res?.status ?? null,
  });
}
