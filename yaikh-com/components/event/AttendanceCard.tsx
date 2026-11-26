"use client";

/* Attendance card — shown after a sign-up and saved to the phone or laptop.
 *
 * Drawn on a canvas so it is one PNG: the person keeps it in their photos
 * and shows it at the door, where staff match the four-letter check-in code
 * against the Yai events list. Khmer sits above English, Chinese small
 * underneath, as everywhere on Yai pages.
 *
 * The save starts on its own. Some phones block a download that was not
 * started by a tap, so the card is also shown as an image (long-press to
 * save) with a Save button underneath.
 */

import { useEffect, useRef, useState } from "react";
import { evT, type EvLang } from "./strings";
import type { EventViewData } from "./EventView";

const W = 1080;
const PAD = 72;
const FONT =
  '"Inter", "Khmer Sangam MN", "Noto Sans Khmer", "Khmer OS Battambang", "PingFang SC", "Noto Sans SC", ' +
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif';
const ICON: Record<string, string> = { morning: "☕🍰", lunch: "🍽️", afternoon: "🫖" };
const CATER: Record<string, string> = { morning: "Coffee & snack", lunch: "Lunch", afternoon: "Afternoon tea" };

function dayLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const wd = d.toLocaleDateString("en-GB", { weekday: "short" });
  const mo = d.toLocaleDateString("en-GB", { month: "long" });
  return `${wd} ${d.getDate()} ${mo} ${d.getFullYear()}`;
}

/** Break text into lines that fit `max` px; Khmer has no spaces between
 * words, so a word too long for a line is broken by character. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/(\s+)/)) {
    const next = line + word;
    if (ctx.measureText(next).width <= max) { line = next; continue; }
    if (line.trim()) lines.push(line.trim());
    line = "";
    for (const ch of Array.from(word)) {
      if (ctx.measureText(line + ch).width > max && line) { lines.push(line); line = ""; }
      line += ch;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function drawCard(ev: EventViewData, name: string, code: string, day: string, link: string): Promise<HTMLCanvasElement> {
  try { await document.fonts?.ready; } catch { /* fine */ }
  const logo = await loadImage("/images/yai-logo.jpg");

  // Two passes: measure the height on a scratch canvas, then draw for real.
  const render = (ctx: CanvasRenderingContext2D, paint: boolean): number => {
    const text = (s: string, x: number, y: number, size: number, weight: number, color: string, spacing = 0) => {
      ctx.font = `${weight} ${size}px ${FONT}`;
      if (!paint) return;
      ctx.fillStyle = color;
      if (spacing && "letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${spacing}px`;
      ctx.fillText(s, x, y);
      if (spacing && "letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = "0px";
    };
    const block = (s: string, size: number, weight: number, color: string, gap: number, y: number): number => {
      ctx.font = `${weight} ${size}px ${FONT}`;
      for (const l of wrap(ctx, s, W - PAD * 2)) {
        y += size * 1.25;
        text(l, PAD, y, size, weight, color);
      }
      return y + gap;
    };

    let y = PAD;
    // Header: logo, then the card's name — Khmer over English.
    if (paint && logo) ctx.drawImage(logo, PAD, y, 96, 96);
    text("កាតចូលរួម", PAD + 120, y + 40, 34, 700, "#FDBA74");
    text("ATTENDANCE CARD", PAD + 120, y + 84, 30, 800, "#FFFFFF", 4);
    y += 96 + 40;

    if (ev.titleKm) y = block(ev.titleKm, 46, 700, "#FFFFFF", 6, y);
    y = block(ev.title, ev.titleKm ? 38 : 50, 800, "#FFFFFF", 4, y);
    if (ev.titleZh) y = block(ev.titleZh, 28, 600, "rgba(255,255,255,0.75)", 0, y);
    y += 30;

    // Details, one per line so they stay readable on a phone screen.
    const rows: string[] = [`📅  ${dayLabel(day)}`];
    if (ev.time) rows.push(`🕘  ${ev.time}`);
    if (ev.venue) rows.push(`📍  ${ev.venue}`);
    for (const c of ev.catering) rows.push(`${ICON[c] || "•"}  ${CATER[c] || c}`);
    for (const r of rows) y = block(r, 34, 500, "rgba(255,255,255,0.92)", 4, y);
    if (ev.mapUrl) y = block(`🗺️  ${ev.mapUrl.replace(/^https?:\/\//, "")}`, 26, 500, "#93C5FD", 0, y);

    // Name and the check-in code, the part the door staff look at.
    y += 40;
    if (paint) { ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(PAD, y, W - PAD * 2, 2); }
    y += 50;
    text("ឈ្មោះ · NAME", PAD, y, 26, 700, "rgba(255,255,255,0.6)");
    y = block(name, 56, 800, "#FFFFFF", 30, y + 6);

    const boxH = 230;
    if (paint) {
      ctx.fillStyle = "#F97316";
      ctx.beginPath();
      ctx.roundRect?.(PAD, y, W - PAD * 2, boxH, 28);
      if (!ctx.roundRect) ctx.rect(PAD, y, W - PAD * 2, boxH);
      ctx.fill();
    }
    text("លេខកូដចូល · CHECK-IN CODE", PAD + 40, y + 62, 28, 700, "rgba(255,255,255,0.9)");
    text(code, PAD + 40, y + 182, 120, 900, "#FFFFFF", 28);
    y += boxH + 40;

    text(link, PAD, y + 26, 26, 600, "rgba(255,255,255,0.55)");
    return y + 26 + PAD;
  };

  const scratch = document.createElement("canvas").getContext("2d")!;
  const H = Math.ceil(render(scratch, false));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#1E2A6B");
  g.addColorStop(0.6, "#2B2350");
  g.addColorStop(1, "#4A2A3A");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";
  render(ctx, true);
  return canvas;
}

export function AttendanceCard({ ev, name, code, day, lang }: {
  ev: EventViewData; name: string; code: string; day: string; lang: EvLang;
}) {
  const t = (k: Parameters<typeof evT>[1]) => evT(lang, k);
  const [url, setUrl] = useState<string | null>(null);
  const saved = useRef(false);
  const fileName = `yai-attendance-${code}.png`;

  const save = (href: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    let alive = true;
    const link = `${window.location.host}${window.location.pathname}`;
    drawCard(ev, name, code, day, link).then((canvas) => {
      if (!alive) return;
      const href = canvas.toDataURL("image/png");
      setUrl(href);
      if (!saved.current) { saved.current = true; save(href); }
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-md sm:p-6">
      <p className="text-xl font-bold text-white">{t("doneTitle")}</p>
      <p className="mt-1 text-[14px] text-white/75">{t("cardSaved")}</p>
      <p className="mt-3 text-[12px] font-semibold uppercase tracking-wider text-white/60">{t("checkIn")}</p>
      <p className="text-4xl font-black tracking-[0.3em] text-yai-orange">{code}</p>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={`${t("card")} ${code}`} className="mx-auto mt-4 w-full max-w-sm rounded-xl shadow-2xl" />
      ) : (
        <p className="mt-4 text-white/60">…</p>
      )}
      <button type="button" disabled={!url} onClick={() => url && save(url)}
        className="mt-4 rounded-full bg-yai-orange px-6 py-2.5 text-[15px] font-bold text-white shadow-lg disabled:opacity-50">
        {t("saveCard")}
      </button>
    </div>
  );
}
