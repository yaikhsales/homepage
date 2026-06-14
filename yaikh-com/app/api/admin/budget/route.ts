import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/admin";
import { readStore, writeStore, type ActualsLine } from "@/lib/budget-store";

export const runtime = "nodejs";

function getAdmin(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return verifyAdminCookie(value);
}

// GET — public read (viewers see updated actuals)
export async function GET() {
  const store = await readStore();
  return NextResponse.json(store);
}

// POST — admin-only write
export async function POST(req: Request) {
  const admin = getAdmin(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Not authorised" }, { status: 401 });
  }

  let body: { actuals?: ActualsLine } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  if (!body.actuals) {
    return NextResponse.json({ ok: false, error: "Missing actuals" }, { status: 400 });
  }

  // Coerce + length-check (12-month arrays).
  const fix = (arr: unknown): (number | null)[] => {
    const out: (number | null)[] = (Array.isArray(arr) ? arr : []).slice(0, 12).map((v: unknown) => {
      if (v === null || v === undefined || v === "") return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : n;
    });
    while (out.length < 12) out.push(null);
    return out;
  };
  const fixStr = (arr: unknown): (string | null)[] => {
    const out: (string | null)[] = (Array.isArray(arr) ? arr : []).slice(0, 12).map((v: unknown) =>
      v === null || v === undefined ? null : String(v)
    );
    while (out.length < 12) out.push(null);
    return out;
  };

  const next = {
    updatedAt: new Date().toISOString(),
    updatedBy: admin,
    actuals: {
      expense: fix(body.actuals.expense),
      income:  fix(body.actuals.income),
      notes:   fixStr(body.actuals.notes),
    },
  };

  await writeStore(next);
  console.log(`[YAI ADMIN] Budget updated by "${admin}" at ${next.updatedAt}`);
  return NextResponse.json({ ok: true, store: next });
}
