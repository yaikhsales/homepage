import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/admin";
import { readSalaryStore, writeSalaryStore, type SalaryStore } from "@/lib/salary-store";

export const runtime = "nodejs";

function getAdmin(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return verifyAdminCookie(value);
}

export async function GET() {
  const store = await readSalaryStore();
  return NextResponse.json(store);
}

export async function POST(req: Request) {
  const admin = getAdmin(req);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Not authorised" }, { status: 401 });
  }

  let body: Partial<SalaryStore> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const next: SalaryStore = {
    updatedAt: new Date().toISOString(),
    updatedBy: admin,
    months: Array.isArray(body.months) ? body.months.filter((m) => typeof m === "string") : [],
    members: Array.isArray(body.members)
      ? body.members.map((m) => ({
          name: String(m?.name ?? ""),
          status: (m?.status === "resigned" || m?.status === "realigned" ? m.status : "active") as "active" | "resigned" | "realigned",
          startMonth: String(m?.startMonth ?? ""),
          endMonth: m?.endMonth ? String(m.endMonth) : null,
          monthly: (() => {
            const out: Record<string, number> = {};
            if (m?.monthly && typeof m.monthly === "object") {
              for (const [k, v] of Object.entries(m.monthly)) {
                const n = Number(v);
                if (!Number.isNaN(n) && n > 0) out[k] = n;
              }
            }
            return out;
          })(),
        }))
      : [],
  };

  await writeSalaryStore(next);
  console.log(`[YAI ADMIN] Salaries updated by "${admin}" at ${next.updatedAt} (${next.members.length} members × ${next.months.length} months)`);
  return NextResponse.json({ ok: true, store: next });
}
