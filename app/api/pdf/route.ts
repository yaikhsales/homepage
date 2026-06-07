/**
 * Server-side PDF generation.
 *
 * Boots headless Chromium, copies the caller's session cookie onto a fresh
 * browser tab, navigates to /plan?print=1, and returns the PDF stream.
 * No more fighting browser print preview — the output is deterministic and
 * identical for every viewer.
 *
 * Auth: the caller must already have a valid yai_session cookie. We mirror
 * the cookie onto the headless tab so it sees the same authenticated view.
 *
 * Local dev: falls back to the user's system Chrome via process.env.CHROME_PATH
 * or common Windows install paths. Production (Railway): uses
 * @sparticuz/chromium's bundled Linux Chromium.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/auth";

// node runtime — puppeteer-core spawns a process; Edge runtime can't.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function getBrowser() {
  if (process.env.NODE_ENV === "production") {
    // Railway / Linux production — bundled chromium binary.
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754 }, // ~A4 at 150dpi
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  // Local dev — use system Chrome / Edge.
  const puppeteer = await import("puppeteer-core");
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean) as string[];
  return puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1240, height: 1754 },
    executablePath: candidates[0],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function GET(req: NextRequest) {
  // Auth check — same as the plan page itself.
  const session = cookies().get(COOKIE_NAME)?.value;
  const viewer = verifySession(session);
  if (!viewer) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }

  // Build the origin URL the headless browser should hit. We always go to
  // localhost when possible (avoids needing public DNS resolution and any
  // CDN cache); fall back to the public host if PORT isn't known.
  const host = headers().get("host") ?? "localhost:3000";
  const proto = headers().get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    // Mirror the caller's session cookie so the headless tab loads
    // /plan as the same authenticated user. Domain must be the host
    // without the protocol/port for puppeteer's cookie API.
    const cookieDomain = host.replace(/:\d+$/, "");
    await page.setCookie({
      name: COOKIE_NAME,
      value: session!,
      domain: cookieDomain,
      path: "/",
      httpOnly: false,
      secure: proto === "https",
    });

    // Print mode — both via media emulation AND via ?print=1 (the
    // usePrintMode hook checks both, so this is belt-and-braces).
    await page.emulateMediaType("print");

    await page.goto(`${origin}/plan?print=1`, {
      waitUntil: "networkidle0",
      timeout: 45_000,
    });

    // Give framer-motion / lazy components a moment to settle into their
    // print-mode expanded state.
    await new Promise((r) => setTimeout(r, 800));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="font-family: Inter, system-ui, sans-serif; font-size: 8pt; color: #1E4DAA;
                    width: 100%; padding: 0 12mm; text-align: center; letter-spacing: 0.04em;">
          Yai &middot; Strategic DTV &middot;
          <a href="https://www.yaikh.com" style="color:#1E4DAA; text-decoration:none; font-weight:700;">www.yaikh.com</a>
          &middot; page <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>`,
      margin: { top: "12mm", right: "10mm", bottom: "18mm", left: "10mm" },
    });

    await page.close();
    return new NextResponse(pdf as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="yai-strategic-dtv.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/pdf] failure", err);
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { error: "pdf-generation-failed", detail: message },
      { status: 500 }
    );
  } finally {
    try { await browser?.close(); } catch {}
  }
}
