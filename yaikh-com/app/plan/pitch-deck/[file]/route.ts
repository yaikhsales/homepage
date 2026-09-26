/* PDFs with a real .pdf address: /plan/pitch-deck/Price%20and%20Client.pdf
 * Phones (Safari and Chrome) decide what a link is from the URL ending — with
 * ?pdf=1 they treat it as a page, so "share" sends the link, not the file.
 * Same /private files and the same signed-cookie check as the deck route. */

import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";
import { verifySession } from "@/lib/auth";
import { PDF_BY_FILE, pdfDisposition } from "@/lib/decks";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { file: string } }) {
  const viewer = verifySession(cookies().get("yai_session")?.value);
  if (!viewer) {
    return new Response(null, { status: 302, headers: { Location: "/SDTV?redirected=1" } });
  }
  const name = PDF_BY_FILE[decodeURIComponent(params.file)];
  if (!name) return new Response("Unknown file", { status: 404 });

  const pdf = await readFile(path.join(process.cwd(), "private", name));
  return new Response(pdf, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Type": "application/pdf",
      "Content-Disposition": pdfDisposition(name, "attachment"),
    },
  });
}
