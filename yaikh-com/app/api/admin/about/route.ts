import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminCookie } from "@/lib/admin";
import { readAboutStore, writeAboutStore, type AboutStore } from "@/lib/about-store";

export const runtime = "nodejs";

function getAdmin(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return verifyAdminCookie(value);
}

export async function GET() {
  return NextResponse.json(await readAboutStore());
}

export async function POST(req: Request) {
  const admin = getAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "Not authorised" }, { status: 401 });

  let body: Partial<AboutStore> = {};
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 }); }

  const existing = await readAboutStore();
  const next: AboutStore = {
    updatedAt: new Date().toISOString(),
    updatedBy: admin,
    a1: {
      businessRegistration: {
        url:     String(body.a1?.businessRegistration?.url     ?? existing.a1.businessRegistration.url),
        caption: String(body.a1?.businessRegistration?.caption ?? existing.a1.businessRegistration.caption),
      },
      vatCertificate: {
        url:     String(body.a1?.vatCertificate?.url     ?? existing.a1.vatCertificate.url),
        caption: String(body.a1?.vatCertificate?.caption ?? existing.a1.vatCertificate.caption),
      },
      ictLicense: {
        url:     String(body.a1?.ictLicense?.url     ?? existing.a1.ictLicense.url),
        caption: String(body.a1?.ictLicense?.caption ?? existing.a1.ictLicense.caption),
      },
    },
    a2: {
      frontUi: {
        url:     String(body.a2?.frontUi?.url     ?? existing.a2.frontUi.url),
        caption: String(body.a2?.frontUi?.caption ?? existing.a2.frontUi.caption),
      },
      agentics: {
        url:     String(body.a2?.agentics?.url     ?? existing.a2.agentics.url),
        caption: String(body.a2?.agentics?.caption ?? existing.a2.agentics.caption),
      },
    },
    a3: {
      name:     String(body.a3?.name     ?? existing.a3.name),
      role:     String(body.a3?.role     ?? existing.a3.role),
      org:      String(body.a3?.org      ?? existing.a3.org),
      email:    String(body.a3?.email    ?? existing.a3.email),
      web:      String(body.a3?.web      ?? existing.a3.web),
      location: String(body.a3?.location ?? existing.a3.location),
    },
  };

  await writeAboutStore(next);
  return NextResponse.json({ ok: true, store: next });
}
