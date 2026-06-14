import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/admin";
import { readExpensesStore, writeExpensesStore, type ExpensesStore } from "@/lib/expenses-store";

export const runtime = "nodejs";

function getAdmin(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return verifyAdminCookie(value);
}

export async function GET() {
  const store = await readExpensesStore();
  return NextResponse.json(store);
}

export async function POST(req: Request) {
  const admin = getAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "Not authorised" }, { status: 401 });

  let body: Partial<ExpensesStore> = {};
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 }); }

  const next: ExpensesStore = {
    updatedAt: new Date().toISOString(),
    updatedBy: admin,
    months: Array.isArray(body.months) ? body.months.filter((m) => typeof m === "string") : [],
    categories: Array.isArray(body.categories)
      ? body.categories.map((c) => ({
          id: String(c?.id ?? Math.random().toString(36).slice(2)),
          name: String(c?.name ?? ""),
          detail: String(c?.detail ?? ""),
          color: String(c?.color ?? "#1E4DAA"),
          items: Array.isArray(c?.items)
            ? c.items.map((it) => ({
                id: String(it?.id ?? Math.random().toString(36).slice(2)),
                name: String(it?.name ?? ""),
                unitPrice: it?.unitPrice ? Number(it.unitPrice) || 0 : undefined,
                unitLabel: it?.unitLabel ? String(it.unitLabel) : undefined,
                frequency: (it?.frequency === "recurring" ? "recurring" : "one-off") as "one-off" | "recurring",
                monthly: (() => {
                  const out: Record<string, { amount: number; qty?: number; note?: string }> = {};
                  if (it?.monthly && typeof it.monthly === "object") {
                    for (const [k, v] of Object.entries(it.monthly)) {
                      const obj = v as Record<string, unknown>;
                      const amount = Number(obj?.amount ?? 0) || 0;
                      const qty    = obj?.qty ? Number(obj.qty) || 0 : undefined;
                      if (amount > 0 || qty || obj?.note) {
                        out[k] = {
                          amount,
                          ...(qty ? { qty } : {}),
                          ...(obj?.note ? { note: String(obj.note) } : {}),
                        };
                      }
                    }
                  }
                  return out;
                })(),
              }))
            : [],
        }))
      : [],
  };

  await writeExpensesStore(next);
  console.log(`[YAI ADMIN] Expenses updated by "${admin}" at ${next.updatedAt} (${next.categories.length} categories)`);
  return NextResponse.json({ ok: true, store: next });
}
