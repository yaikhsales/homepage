import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_PLANS = new Set(["Ai Server", "Agentic", "Big Ai Brain"]);
const ALLOWED_OPTIONS = new Set(["Administrative", "Operation"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const plan = typeof body?.plan === "string" ? body.plan.trim() : "";
    const options = Array.isArray(body?.options)
      ? [...new Set(body.options.filter((value: unknown): value is string => typeof value === "string" && ALLOWED_OPTIONS.has(value)))]
      : [];

    if (body?.website) return NextResponse.json({ ok: true });
    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return NextResponse.json({ ok: false, error: "Enter a valid official company email." }, { status: 400 });
    }
    if (!ALLOWED_PLANS.has(plan)) {
      return NextResponse.json({ ok: false, error: "Select a valid plan." }, { status: 400 });
    }

    const collection = (await getDb()).collection("plan_interest_requests");
    const recentDuplicate = await collection.findOne({
      email,
      plan,
      options,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (!recentDuplicate) {
      await collection.insertOne({
        email,
        plan,
        options,
        source: "homepage-pricing",
        status: "new",
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to save plan interest", error);
    return NextResponse.json({ ok: false, error: "Unable to save your request. Please try again." }, { status: 500 });
  }
}
