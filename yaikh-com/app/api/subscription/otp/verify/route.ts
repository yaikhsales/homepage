import { NextResponse } from "next/server";
import { verifySubscriptionOtp, RequestError } from "@/lib/subscription-requests";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.SUBSCRIPTION_INVOICE_REQUESTS_ENABLED !== "true") {
    return NextResponse.json({ error: "Invoice requests are temporarily unavailable." }, { status: 503 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const result = await verifySubscriptionOtp(
      typeof body.requestId === "string" ? body.requestId : "",
      typeof body.code === "string" ? body.code : "",
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof RequestError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Could not verify the code." }, { status: 500 });
  }
}
