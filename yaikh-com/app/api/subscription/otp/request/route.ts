import { NextResponse } from "next/server";
import { isRequestError, requestSubscriptionOtp } from "@/lib/subscription-requests";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.SUBSCRIPTION_INVOICE_REQUESTS_ENABLED !== "true") {
    return NextResponse.json({ error: "Invoice requests are temporarily unavailable." }, { status: 503 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
    const result = await requestSubscriptionOtp({
      planName: typeof body.planName === "string" ? body.planName : "",
      companyName: typeof body.companyName === "string" ? body.companyName : "",
      country: typeof body.country === "string" ? body.country : "",
      contactName: typeof body.contactName === "string" ? body.contactName : "",
      contactEmail: typeof body.contactEmail === "string" ? body.contactEmail : "",
      agreed: body.agreed === true,
    }, ip);
    return NextResponse.json(result);
  } catch (error) {
    if (isRequestError(error)) {
      const diagnostic = process.env.NODE_ENV !== "production" && error.diagnostic
        ? { diagnostic: error.diagnostic }
        : {};
      return NextResponse.json({ error: error.message, ...diagnostic }, { status: error.status });
    }
    return NextResponse.json({ error: "Could not start email verification." }, { status: 500 });
  }
}
