import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/admin";
import { readSalesStore, writeSalesStore, type SalesStore } from "@/lib/sales-store";

export const runtime = "nodejs";

function getAdmin(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return verifyAdminCookie(value);
}

export async function GET() {
  const store = await readSalesStore();
  return NextResponse.json(store);
}

export async function POST(req: Request) {
  const admin = getAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "Not authorised" }, { status: 401 });

  let body: Partial<SalesStore> = {};
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 }); }

  const next: SalesStore = {
    updatedAt: new Date().toISOString(),
    updatedBy: admin,
    months: Array.isArray(body.months) ? body.months.filter((m) => typeof m === "string") : [],
    streams: Array.isArray(body.streams)
      ? body.streams.map((s) => ({
          id: String(s?.id ?? Math.random().toString(36).slice(2)),
          name: String(s?.name ?? ""),
          category: (["cloud","hardware","addon","ecom"].includes(s?.category as string) ? s!.category : "cloud") as "cloud"|"hardware"|"addon"|"ecom",
          certainty: (s?.certainty === "uncertain" ? "uncertain" : "planned") as "planned"|"uncertain",
          unitPrice: Number(s?.unitPrice ?? 0) || 0,
          unitLabel: String(s?.unitLabel ?? ""),
          tierLabel: String(s?.tierLabel ?? ""),
          detail: String(s?.detail ?? ""),
          monthly: (() => {
            const out: Record<string, { planned?: number; actual?: number; customers?: number; note?: string }> = {};
            if (s?.monthly && typeof s.monthly === "object") {
              for (const [k, v] of Object.entries(s.monthly)) {
                const obj = v as Record<string, unknown>;
                const planned = Number(obj?.planned ?? 0) || 0;
                const actual  = Number(obj?.actual  ?? 0) || 0;
                const customers = Number(obj?.customers ?? 0) || 0;
                const note = obj?.note ? String(obj.note) : undefined;
                if (planned > 0 || actual > 0 || customers > 0 || note) {
                  out[k] = {
                    ...(planned > 0 ? { planned } : {}),
                    ...(actual  > 0 ? { actual  } : {}),
                    ...(customers > 0 ? { customers } : {}),
                    ...(note ? { note } : {}),
                  };
                }
              }
            }
            return out;
          })(),
        }))
      : [],
  };

  await writeSalesStore(next);
  console.log(`[YAI ADMIN] Sales updated by "${admin}" at ${next.updatedAt} (${next.streams.length} streams × ${next.months.length} months)`);
  return NextResponse.json({ ok: true, store: next });
}
