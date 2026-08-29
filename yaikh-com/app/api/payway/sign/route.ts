/* POST /api/payway/sign — signs an ABA PayWay purchase for the hosted-checkout
 * popup. Returns { action, params } the browser drops into the hidden form.
 * The API key stays server-side. */

import { NextResponse } from "next/server";
import {
  PAYWAY_TRANSACTION_LIFETIME_MINUTES,
  signForPopup,
  paywayConfigured,
  type PurchaseInput,
  recordPayment,
} from "@/lib/payway";
import { getCloudPlanPaymentBreakdown } from "@/lib/subscription-pricing";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!paywayConfigured()) {
    return NextResponse.json({ error: "PayWay not configured" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as Partial<PurchaseInput> & Record<string, unknown>;
  const plan = typeof body.plan === "string" ? body.plan : "";
  const pricing = getCloudPlanPaymentBreakdown(plan);
  if (pricing === null) {
    return NextResponse.json({ error: "Choose a subscription plan to pay by ABA." }, { status: 400 });
  }
  // "" = ABA popup shows its method chooser; "abapay_khqr" / "cards" pre-select one.
  const opt = body.payment_option;
  const payment_option = opt === "abapay_khqr" || opt === "cards" ? opt : "";

  // Pre-generate the tran_id so we can point ABA's "Continue" button back to us.
  // ABA redirects the top window to continue_success_url ONLY when the payer
  // clicks Continue on its own success screen — so our success page never shows early.
  const tran_id = "T" + Date.now();
  const origin = req.headers.get("origin") || new URL(req.url).origin;
  const continue_success_url = `${origin}/subscribe?paid=${tran_id}`;
  const currency = "KHR";
  const signed = signForPopup({
    tran_id,
    amount: pricing.totalAmount.toFixed(2),
    currency,
    firstname: typeof body.contact_name === "string" ? body.contact_name : body.firstname,
    email: body.email,
    payment_option,
    lifetime: PAYWAY_TRANSACTION_LIFETIME_MINUTES,
    view_type: "popup",
    continue_success_url,
  });

  // Durable record so we can find/refund this beyond ABA's 3-day list window.
  await recordPayment({
    tran_id, amount: pricing.totalAmount, currency, payment_option, source: "subscribe",
    subtotal_amount: pricing.subtotalAmount,
    vat_amount: pricing.vatAmount,
    is_fixed_rate: true,
    fixed_rate: pricing.fixedRate,
    receipt_status: "PENDING",
    plan: plan || undefined,
    company: typeof body.company === "string" ? body.company : undefined,
    country: typeof body.country === "string" ? body.country : undefined,
    contact_name: typeof body.contact_name === "string" ? body.contact_name : undefined,
    email: typeof body.email === "string" ? body.email : undefined,
  });

  return NextResponse.json(signed);
}
