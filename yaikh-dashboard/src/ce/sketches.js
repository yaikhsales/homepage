// Garment sketches — technical flats, front and back, drawn here as SVG (nothing downloaded). One shared
// map keyed by garment type: tee, polo, hoodie, jogger, shorts, bra, leggings, fashion-top, generic.
// `sketchKey(text)` maps the data's garment / garment_type / image_key / style strings to a key
// (case-insensitive); `garmentsOf(text)` returns every piece of a set ("hoodie jacket + jogger pants").
// Every shape sits in a 0–100 × 0–100 box, stroke-only in currentColor, so the same drawing works on
// the dark screens, on the white printable sheet, and under Garment Analysis' hotspots.
// Written with React.createElement like the other simulated screens.
import React, { useEffect } from "react";
import { X } from "lucide-react";

const h = React.createElement;
const W = { strokeWidth: 1, strokeLinejoin: "round", strokeLinecap: "round" };
const D = { strokeWidth: 0.45, strokeDasharray: "1.3 1" }; // stitch / detail lines
const P = (d, extra) => h("path", { d, ...W, ...(extra || {}) });
const S = (d) => h("path", { d, ...D }); // a stitch line

// ---- fronts ---------------------------------------------------------------------------------------------
const teeFront = () => [P("M30 14 L13 24 L7 42 L22 46 L24 92 L76 92 L78 46 L93 42 L87 24 L70 14 Q50 24 30 14 Z"), P("M30 14 Q50 26 70 14 Q50 20 30 14 Z"), S("M7 42 L22 46 M93 42 L78 46"), S("M25 88 L75 88"), S("M9 40 L23 44 M91 40 L77 44"), S("M30 14 L13 24 M70 14 L87 24"), S("M22 46 L24 90 M78 46 L76 90")];
const teeBack = () => [P("M30 14 L13 24 L7 42 L22 46 L24 92 L76 92 L78 46 L93 42 L87 24 L70 14 Q50 20 30 14 Z"), P("M30 14 Q50 19 70 14 Q50 16 30 14 Z"), S("M7 42 L22 46 M93 42 L78 46"), S("M25 88 L75 88"), S("M44 20 H56 V26 H44 Z"), S("M22 46 L24 90 M78 46 L76 90")];
const poloFront = () => [P("M30 12 L13 24 L7 42 L22 46 L24 92 L76 92 L78 46 L93 42 L87 24 L70 12 L62 18 L50 32 L38 18 Z"), P("M38 18 L30 12 L36 26 L50 32 L64 26 L70 12 L62 18 L50 22 Z"), P("M50 22 L50 44", { strokeWidth: 0.7 }), h("circle", { cx: 50, cy: 28, r: 0.9 }), h("circle", { cx: 50, cy: 34, r: 0.9 }), h("circle", { cx: 50, cy: 40, r: 0.9 }), S("M7 42 L22 46 M93 42 L78 46 M25 88 L75 88")];
const poloBack = () => [P("M30 12 L13 24 L7 42 L22 46 L24 92 L76 92 L78 46 L93 42 L87 24 L70 12 Q50 18 30 12 Z"), P("M32 10 Q50 4 68 10 Q50 20 32 10 Z"), S("M7 42 L22 46 M93 42 L78 46 M25 88 L75 88"), S("M44 20 H56 V26 H44 Z")];
const hoodieFront = () => [P("M34 12 Q50 2 66 12 Q72 20 64 24 L50 20 L36 24 Q28 20 34 12 Z"), S("M36 14 Q50 5 64 14"), h("circle", { cx: 44, cy: 21, r: 0.9 }), h("circle", { cx: 56, cy: 21, r: 0.9 }), P("M44 22 L41 34 M56 22 L59 34", { strokeWidth: 0.6 }), P("M34 14 L12 24 L4 70 L18 72 L22 92 L78 92 L82 72 L96 70 L88 24 L66 14 Q50 24 34 14 Z"), P("M50 22 L50 92", { strokeWidth: 1 }), S("M49 26 L51 26 M49 32 L51 32 M49 38 L51 38 M49 44 L51 44 M49 50 L51 50 M49 56 L51 56 M49 62 L51 62 M49 68 L51 68 M49 74 L51 74 M49 80 L51 80 M49 86 L51 86"), P("M50 30 L50 36 L52 36 L52 32 Z", { strokeWidth: 0.6 }), S("M28 66 L46 66 L46 88 L24 88 Z M72 66 L54 66 L54 88 L76 88 Z"), P("M22 86 L78 86"), S("M22 89 L78 89"), P("M4 66 L18 68 M96 66 L82 68"), S("M4 69 L18 71 M96 69 L82 71"), S("M12 24 L22 46 M88 24 L78 46"), S("M22 46 L24 86 M78 46 L76 86")];
const hoodieBack = () => [P("M32 14 Q50 0 68 14 Q74 22 66 26 Q50 22 34 26 Q26 22 32 14 Z"), S("M50 2 L50 24"), P("M34 16 L12 24 L4 70 L18 72 L22 92 L78 92 L82 72 L96 70 L88 24 L66 16 Q50 26 34 16 Z"), P("M22 86 L78 86"), S("M22 89 L78 89"), P("M4 66 L18 68 M96 66 L82 68"), S("M4 69 L18 71 M96 69 L82 71"), S("M12 24 L22 46 M88 24 L78 46"), S("M22 46 L24 86 M78 46 L76 86")];
const joggerFront = () => [P("M22 10 L78 10 L84 54 L74 94 L56 94 L50 50 L44 94 L26 94 L16 54 Z"), P("M22 16 L78 16"), S("M22 12 L78 12 M22 14 L78 14"), h("circle", { cx: 47, cy: 13, r: 0.8 }), h("circle", { cx: 53, cy: 13, r: 0.8 }), P("M47 14 Q44 24 45 30 M53 14 Q56 24 55 30", { strokeWidth: 0.6 }), P("M44 30 L46 30 M54 30 L56 30", { strokeWidth: 0.9 }), S("M26 20 L30 36 M74 20 L70 36"), P("M26 88 L44 88 M56 88 L74 88"), S("M27 91 L43 91 M57 91 L73 91"), S("M22 16 L16 54 L26 90 M78 16 L84 54 L74 90"), S("M50 16 L50 30")];
const joggerBack = () => [P("M22 10 L78 10 L84 54 L74 94 L56 94 L50 50 L44 94 L26 94 L16 54 Z"), P("M22 16 L78 16"), S("M22 12 L78 12 M22 14 L78 14"), P("M26 88 L44 88 M56 88 L74 88"), S("M27 91 L43 91 M57 91 L73 91"), S("M50 16 L50 50"), S("M22 16 L16 54 L26 90 M78 16 L84 54 L74 90"), P("M58 24 H74 V26 H58 Z"), S("M59 26 V36 H73 V26")];
const shortsFront = () => [P("M22 14 L78 14 L84 50 L74 66 L56 66 L50 46 L44 66 L26 66 L16 50 Z"), P("M22 20 L78 20"), S("M22 16 L78 16 M22 18 L78 18"), h("circle", { cx: 47, cy: 17, r: 0.8 }), h("circle", { cx: 53, cy: 17, r: 0.8 }), P("M47 18 Q44 26 45 32 M53 18 Q56 26 55 32", { strokeWidth: 0.6 }), S("M26 24 L30 38 M74 24 L70 38"), S("M26 63 L44 63 M56 63 L74 63"), S("M22 20 L16 50 L26 64 M78 20 L84 50 L74 64"), S("M50 20 L50 34")];
const shortsBack = () => [P("M22 14 L78 14 L84 50 L74 66 L56 66 L50 46 L44 66 L26 66 L16 50 Z"), P("M22 20 L78 20"), S("M22 16 L78 16 M22 18 L78 18"), S("M26 63 L44 63 M56 63 L74 63"), S("M50 20 L50 46"), S("M22 20 L16 50 L26 64 M78 20 L84 50 L74 64"), P("M58 26 H74 V28 H58 Z"), S("M59 28 V38 H73 V28")];
const braFront = () => [P("M30 10 L24 40 Q22 58 30 62 L70 62 Q78 58 76 40 L70 10 L62 10 Q50 34 38 10 Z"), P("M26 54 H74", { strokeWidth: 0.7 }), S("M26 58 H74"), S("M50 34 L50 54"), S("M30 10 L24 40 M70 10 L76 40")];
const braBack = () => [P("M30 10 L24 40 Q22 58 30 62 L70 62 Q78 58 76 40 L70 10 L62 10 L56 30 L50 36 L44 30 L38 10 Z"), P("M38 10 L50 36 L62 10", { strokeWidth: 0.7 }), P("M26 54 H74", { strokeWidth: 0.7 }), S("M26 58 H74"), S("M30 10 L24 40 M70 10 L76 40")];
const leggingsFront = () => [P("M28 8 L72 8 L76 50 L68 96 L56 96 L50 40 L44 96 L32 96 L24 50 Z"), P("M28 14 L72 14"), S("M28 10 L72 10 M28 12 L72 12"), S("M50 14 L50 40"), S("M33 93 L43 93 M57 93 L67 93"), S("M28 14 L24 50 L32 94 M72 14 L76 50 L68 94")];
const leggingsBack = () => [P("M28 8 L72 8 L76 50 L68 96 L56 96 L50 40 L44 96 L32 96 L24 50 Z"), P("M28 14 L72 14"), S("M28 10 L72 10 M28 12 L72 12"), S("M50 14 L50 40"), S("M28 14 Q50 26 72 14"), S("M33 93 L43 93 M57 93 L67 93"), S("M28 14 L24 50 L32 94 M72 14 L76 50 L68 94")];
const topFront = () => [P("M32 12 L16 22 L10 40 L24 44 L22 60 L26 92 L74 92 L78 60 L76 44 L90 40 L84 22 L68 12 Q50 28 32 12 Z"), P("M32 12 Q50 30 68 12 Q50 22 32 12 Z"), S("M10 40 L24 44 M90 40 L76 44"), S("M28 88 L72 88"), S("M34 46 Q36 60 32 72 M66 46 Q64 60 68 72")];
const topBack = () => [P("M32 12 L16 22 L10 40 L24 44 L22 60 L26 92 L74 92 L78 60 L76 44 L90 40 L84 22 L68 12 Q50 20 32 12 Z"), P("M32 12 Q50 17 68 12 Q50 15 32 12 Z"), S("M10 40 L24 44 M90 40 L76 44"), S("M28 88 L72 88"), S("M50 16 L50 40")];
const genericFront = () => [P("M30 14 L14 24 L10 44 L24 46 L26 92 L74 92 L76 46 L90 44 L86 24 L70 14 Q50 22 30 14 Z"), S("M10 44 L24 46 M90 44 L76 46 M28 88 L72 88"), h("text", { x: 50, y: 60, textAnchor: "middle", fontSize: 7, fill: "currentColor", stroke: "none", opacity: 0.6 }, "garment")];
const genericBack = () => [P("M30 14 L14 24 L10 44 L24 46 L26 92 L74 92 L76 46 L90 44 L86 24 L70 14 Q50 18 30 14 Z"), S("M10 44 L24 46 M90 44 L76 46 M28 88 L72 88")];

const SKETCHES = {
  tee: { name: "round-neck T-shirt", front: teeFront, back: teeBack },
  polo: { name: "polo shirt", front: poloFront, back: poloBack },
  hoodie: { name: "hoodie jacket (front zip)", front: hoodieFront, back: hoodieBack },
  jogger: { name: "jogger pants", front: joggerFront, back: joggerBack },
  shorts: { name: "shorts", front: shortsFront, back: shortsBack },
  bra: { name: "yoga bra top", front: braFront, back: braBack },
  leggings: { name: "leggings", front: leggingsFront, back: leggingsBack },
  "fashion-top": { name: "women's fashion top", front: topFront, back: topBack },
  generic: { name: "garment", front: genericFront, back: genericBack },
};
export const SKETCH_KEYS = Object.keys(SKETCHES);

// One piece of text → one key. Checks the specific words first (bra before top, jogger before pants…).
export const sketchKey = (text) => {
  const t = String(text || "").toLowerCase();
  if (!t) return "generic";
  if (/tee-round-neck|t-shirt|tee\b|tshirt/.test(t)) return "tee";
  if (/polo/.test(t)) return "polo";
  if (/hoodie|hood|zip jacket|sweat ?jacket/.test(t)) return "hoodie";
  if (/bra\b|bra top|sports bra/.test(t)) return "bra";
  if (/legging/.test(t)) return "leggings";
  if (/short/.test(t)) return "shorts";
  if (/jogger|jogging pant|trouser|pants|sweatpant/.test(t)) return "jogger";
  if (/fashion top|blouse|women.s top|top\b/.test(t)) return "fashion-top";
  if (/jacket/.test(t)) return "hoodie";
  return "generic";
};

// Every piece of a set, in order: "Zip hoodie jacket + jogger pants set" → ["hoodie", "jogger"];
// "hoodie jacket, jogger pants" → the same; "Round-neck T-shirt" → ["tee"].
export const garmentsOf = (text) => {
  const t = String(text || "").replace(/\(|\)/g, " ");
  const parts = t.split(/\s*(?:\+|,|&|\/| and )\s*/).map((p) => p.trim()).filter(Boolean);
  const keys = [];
  parts.forEach((p) => {
    const k = sketchKey(p);
    if (k !== "generic" && !keys.includes(k)) keys.push(k);
  });
  if (!keys.length) keys.push(sketchKey(t));
  return keys;
};

export const sketchName = (k) => (SKETCHES[k] || SKETCHES.generic).name;

// The front (and back) of one piece, at a given width. `k` is a key; `text` is any garment string instead.
// Stroke-only in currentColor: set the colour on the parent (text-slate-300 on screen, black in print).
// Tech-pack flat: thin black line on a white card (card: false draws in currentColor on whatever is behind),
// front and back side by side, FRONT / BACK under each. `callouts` = [{no, x, y}] numbered circles on the
// front at construction points (Garment Analysis' hotspots fit as they are).
export const Sketch = ({ k, text, size = 120, back = true, label = true, card = true, callouts, className }) => {
  const key = k && SKETCHES[k] ? k : sketchKey(text);
  const s = SKETCHES[key] || SKETCHES.generic;
  const vw = back ? 210 : 100;
  const vh = label ? 112 : 100;
  return h(
    "svg",
    { viewBox: `-3 -3 ${vw + 6} ${vh + 4}`, width: size, height: Math.round((size * (vh + 4)) / (vw + 6)), className: (card ? "rounded-md bg-white text-slate-900 " : "") + (className || ""), role: "img", "aria-label": s.name + (back ? " front and back" : " front"), fill: "none", stroke: "currentColor" },
    h("title", null, s.name),
    h("g", null, s.front()),
    back && h("g", { transform: "translate(110,0)" }, s.back()),
    (callouts || []).map((c) => h("g", { key: c.no }, h("circle", { cx: c.x, cy: c.y, r: 3.2, fill: "white", strokeWidth: 0.6 }), h("text", { x: c.x, y: c.y + 1.2, textAnchor: "middle", fontSize: 3.4, fontWeight: 700, fill: "currentColor", stroke: "none" }, c.no))),
    label && h("text", { x: 50, y: 109, textAnchor: "middle", fontSize: 6, letterSpacing: 1, fill: "currentColor", stroke: "none", opacity: 0.8 }, "FRONT"),
    label && back && h("text", { x: 160, y: 109, textAnchor: "middle", fontSize: 6, letterSpacing: 1, fill: "currentColor", stroke: "none", opacity: 0.8 }, "BACK")
  );
};

// Every piece of a set side by side (a set shows both pieces).
export const SketchSet = ({ text, size = 120, back = true, card = true, className }) => {
  const keys = garmentsOf(text);
  return h("div", { className: "flex flex-wrap gap-2 items-start " + (className || "") }, keys.map((k) => h("div", { key: k, className: "flex flex-col items-center" }, h(Sketch, { k, size, back, card }), keys.length > 1 && h("div", { className: "text-[10px] opacity-70 mt-0.5" }, sketchName(k)))));
};

// The front shape of a key, for Garment Analysis' drawing (which adds its own fill and hotspots).
export const frontOf = (k) => (SKETCHES[k] || SKETCHES.generic).front;

// Small pop-over opened from an eye icon next to an order: the sketch with style, garment and qty.
// pop = { x, y, order, style, garment, qty }. Written to sit clear of the department PA panel.
export const SketchPop = ({ pop, onClose }) => {
  useEffect(() => {
    const key = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  const keys = garmentsOf(pop.garment || pop.style);
  const Wd = Math.min(keys.length > 1 ? 520 : 320, window.innerWidth - 24);
  const room = window.innerWidth - (document.body.classList.contains("yai-pa-open") ? 436 : 0);
  const left = Math.max(8, Math.min(pop.x - 40, room - Wd - 12));
  const below = pop.y < window.innerHeight / 2;
  const place = below ? { top: pop.y + 14 } : { bottom: window.innerHeight - pop.y + 14 };
  return h(
    React.Fragment,
    null,
    h("div", { className: "fixed inset-0 z-40", onClick: onClose }),
    h(
      "div",
      { className: "fixed z-50 rounded-2xl border border-slate-600 bg-slate-800 shadow-2xl text-slate-200", style: { left, width: Wd, ...place } },
      h(
        "div",
        { className: "flex items-center gap-2 px-3 pt-2.5 pb-2 border-b border-slate-700" },
        pop.order && h("span", { className: "font-black text-white whitespace-nowrap" }, pop.order),
        h("span", { className: "text-xs text-slate-300 truncate" }, pop.style || pop.garment || ""),
        h("button", { onClick: onClose, className: "ml-auto p-1 rounded-lg hover:bg-slate-700", "aria-label": "Close" }, h(X, { size: 14 }))
      ),
      h(
        "div",
        { className: "px-3 py-2" },
        h("div", { className: "flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400 mb-1" }, pop.garment && h("span", null, "garment ", h("b", { className: "text-white" }, pop.garment)), pop.qty !== undefined && pop.qty !== null && pop.qty !== "" && h("span", null, "qty ", h("b", { className: "text-white tabular-nums" }, typeof pop.qty === "number" ? pop.qty.toLocaleString("en-US") : pop.qty)), pop.extra && h("span", null, pop.extra)),
        h(SketchSet, { text: pop.garment || pop.style, size: keys.length > 1 ? 230 : 280 }),
        h("div", { className: "text-[10px] text-slate-500 mt-1" }, "technical flat — garment type only, not the exact style")
      )
    )
  );
};

export default SKETCHES;
