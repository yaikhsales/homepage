/**
 * Client-side landscape PDF + PPTX export for the SlideShow component.
 * Both libraries are loaded on demand so they don't bloat the /plan bundle
 * for readers who never hit the download buttons.
 *
 * Slides render as A4-landscape / 13.33"×7.5" (LAYOUT_WIDE) pages:
 *   - Navy gradient background with an accent-tinted radial glow
 *   - Big centred label (the slide "number")
 *   - Optional caption below
 *   - Deck title in the top-left corner + page counter bottom-right
 */

import type { Slide } from "@/components/plan/SlideShow";

const NAVY_A = "#0A1F47";
const NAVY_B = "#1E4DAA";
const DEFAULT_ACCENTS = ["#1E4DAA", "#F37021", "#0A3327", "#6D4FB6", "#10B981", "#B91C1C"];

function pickAccent(slide: Slide, idx: number): string {
  return slide.accent ?? DEFAULT_ACCENTS[idx % DEFAULT_ACCENTS.length];
}

/** Slugify a title into a safe filename stem. */
function fileStem(title: string): string {
  return (title || "slideshow").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "slideshow";
}

/* ─────────── PDF (landscape A4) ─────────── */

export async function exportPdf(slides: Slide[], deckTitle: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  // A4 landscape: 297mm × 210mm
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;

  slides.forEach((slide, i) => {
    if (i > 0) doc.addPage("a4", "landscape");
    const accent = pickAccent(slide, i);

    // Navy gradient — jsPDF doesn't do real gradients, so we approximate
    // with the base solid + an offset accent glow rectangle.
    doc.setFillColor(NAVY_A);
    doc.rect(0, 0, W, H, "F");
    doc.setFillColor(NAVY_B);
    doc.rect(0, 0, W, H, "F");
    // Accent tint patch in the top-left, mimicking the on-screen radial glow.
    doc.setFillColor(accent);
    doc.setGState(new (doc as unknown as { GState: new (o: object) => object }).GState({ opacity: 0.28 }));
    doc.circle(80, 70, 90, "F");
    doc.setGState(new (doc as unknown as { GState: new (o: object) => object }).GState({ opacity: 1 }));

    // Deck title — top-left, small caps
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(deckTitle.toUpperCase(), 12, 12);

    // Big label — centred
    doc.setTextColor(accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(220);
    // Vertically centre by eyeballing the ascender — jsPDF's y baselines
    // measure from top of the text box.
    const labelText = String(slide.label ?? "");
    const midY = slide.caption ? H / 2 - 5 : H / 2 + 25;
    doc.text(labelText, W / 2, midY, { align: "center", baseline: "middle" });

    // Caption — below the big label
    if (slide.caption) {
      doc.setTextColor(230, 240, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.text(slide.caption, W / 2, H / 2 + 40, { align: "center", baseline: "middle", maxWidth: 220 });
    }

    // Counter — bottom-right
    doc.setTextColor(170, 190, 220);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${i + 1} / ${slides.length}`, W - 12, H - 8, { align: "right" });
  });

  doc.save(`${fileStem(deckTitle)}.pdf`);
}

/* ─────────── PPTX (LAYOUT_WIDE landscape) ─────────── */

export async function exportPptx(slides: Slide[], deckTitle: string): Promise<void> {
  // pptxgenjs pulls in node:fs / node:https from its Node code path even
  // though it declares them false in the `browser` field — Next.js's
  // client bundle handles this via a webpack.resolve.fallback in
  // next.config.js. See that file for the mapping.
  const mod = await import("pptxgenjs");
  const Pptxgen = (mod as unknown as { default?: unknown }).default ?? mod;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pres = new (Pptxgen as any)();
  pres.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"

  slides.forEach((slide, i) => {
    const s = pres.addSlide();
    const accent = pickAccent(slide, i).replace(/^#/, "");
    s.background = { color: NAVY_A.slice(1) };

    // Accent glow — a soft-edged rounded rectangle in the top-left corner.
    s.addShape(pres.ShapeType.roundRect ?? "roundRect", {
      x: 0, y: 0, w: 6.5, h: 5,
      fill: { color: accent, transparency: 72 },
      line: { type: "none" },
      rectRadius: 0.5,
    });

    // Deck title — top-left
    s.addText(deckTitle.toUpperCase(), {
      x: 0.4, y: 0.35, w: 12.5, h: 0.35,
      fontFace: "Arial", fontSize: 10, bold: true,
      color: "FFFFFF", charSpacing: 3, margin: 0,
    });

    // Big label — centred
    const labelText = String(slide.label ?? "");
    s.addText(labelText, {
      x: 0.5, y: slide.caption ? 1.8 : 2.4, w: 12.33, h: slide.caption ? 3.2 : 3.6,
      fontFace: "Arial", fontSize: 260, bold: true,
      color: accent, align: "center", valign: "middle", margin: 0,
    });

    // Caption — below
    if (slide.caption) {
      s.addText(slide.caption, {
        x: 1, y: 5.4, w: 11.33, h: 0.9,
        fontFace: "Arial", fontSize: 20, bold: false,
        color: "E6F0FF", align: "center", valign: "top", margin: 0,
      });
    }

    // Counter — bottom-right
    s.addText(`${i + 1} / ${slides.length}`, {
      x: 11, y: 7.05, w: 2, h: 0.3,
      fontFace: "Arial", fontSize: 10,
      color: "AABDDC", align: "right", margin: 0,
    });
  });

  await pres.writeFile({ fileName: `${fileStem(deckTitle)}.pptx` });
}
