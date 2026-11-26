/* GET /api/events/<id>/qr — the event's QR code as an SVG.
 *
 * Public, because the thing it encodes is a public URL and the image ends
 * up on printed handouts and adverts. SVG rather than PNG so it stays sharp
 * at poster size and can be dropped straight into a design tool.
 *
 * Generated here rather than through a QR web service: the event URL would
 * otherwise be handed to a third party on every render, and printing would
 * depend on someone else's uptime.
 */
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import QRCode from "qrcode";

export const runtime = "nodejs";

function originOf(request: Request): string {
  const url = new URL(request.url);
  // Behind Cloudflare and Railway the forwarded headers carry the hostname
  // the visitor actually used; url.host is the internal one.
  const host = request.headers.get("x-forwarded-host") || url.host;
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!ObjectId.isValid(params.id)) {
    return new NextResponse("Unknown event", { status: 404 });
  }

  const target = `${originOf(request)}/e/${params.id}`;

  try {
    const svg = await QRCode.toString(target, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      color: { dark: "#0d1b3e", light: "#ffffff" },
    });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        // The URL for an event id never changes, so this is safe to hold.
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    return new NextResponse(err instanceof Error ? err.message : "QR failed", { status: 500 });
  }
}
