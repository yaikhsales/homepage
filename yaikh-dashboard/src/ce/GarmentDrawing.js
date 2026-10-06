// CE · the garment drawings for Garment Analysis — front views drawn as SVG (no stock photos), on a
// 0–100 × 0–100 box so a hotspot given as {x, y} in % lands straight on the drawing. One drawing per
// image_key: tee-round-neck, polo, hoodie-zip, trouser-jogger (anything else falls back to the tee).
import React from "react";

const h = React.createElement;
const stroke = { fill: "#1e293b", stroke: "#94a3b8", strokeWidth: 0.8, strokeLinejoin: "round" };
const line = { fill: "none", stroke: "#64748b", strokeWidth: 0.5, strokeDasharray: "1.2 1" };

// Round-neck T-shirt: body, two short sleeves, neck rib, hem and sleeve-hem stitch lines.
const Tee = () =>
  h(
  "g",
  null,
  h("path", { d: "M30 14 L13 24 L7 42 L22 46 L24 92 L76 92 L78 46 L93 42 L87 24 L70 14 Q50 24 30 14 Z", ...stroke }),
  h("path", { d: "M30 14 Q50 26 70 14 Q50 20 30 14 Z", fill: "#0f172a", stroke: "#94a3b8", strokeWidth: 0.8 }),
  h("path", { d: "M22 46 L24 44", ...line }),
  h("path", { d: "M7 42 L22 46 M93 42 L78 46", ...line }),
  h("path", { d: "M25 88 L75 88", ...line }),
  h("path", { d: "M9 40 L23 44 M91 40 L77 44", ...line }),
  h("path", { d: "M30 14 L13 24 M70 14 L87 24", ...line })
  );

// Polo: the tee plus a collar and a buttoned placket.
const Polo = () =>
  h(
  "g",
  null,
  h("path", { d: "M30 12 L13 24 L7 42 L22 46 L24 92 L76 92 L78 46 L93 42 L87 24 L70 12 L62 18 L50 32 L38 18 Z", ...stroke }),
  h("path", { d: "M38 18 L30 12 L36 26 L50 32 L64 26 L70 12 L62 18 L50 22 Z", fill: "#0f172a", stroke: "#94a3b8", strokeWidth: 0.8 }),
  h("path", { d: "M50 22 L50 44", stroke: "#94a3b8", strokeWidth: 0.8 }),
  h("circle", { cx: 50, cy: 28, r: 0.9, fill: "#94a3b8" }),
  h("circle", { cx: 50, cy: 34, r: 0.9, fill: "#94a3b8" }),
  h("circle", { cx: 50, cy: 40, r: 0.9, fill: "#94a3b8" }),
  h("path", { d: "M7 42 L22 46 M93 42 L78 46 M25 88 L75 88", ...line })
  );

// Zip hoodie: long sleeves, a hood, a centre zip and a kangaroo pocket.
const Hoodie = () =>
  h(
  "g",
  null,
  h("path", { d: "M34 12 Q50 2 66 12 Q72 20 64 24 L50 20 L36 24 Q28 20 34 12 Z", ...stroke }),
  h("path", { d: "M34 14 L12 24 L4 70 L18 72 L22 92 L78 92 L82 72 L96 70 L88 24 L66 14 Q50 24 34 14 Z", ...stroke }),
  h("path", { d: "M50 22 L50 92", stroke: "#94a3b8", strokeWidth: 1 }),
  h("path", { d: "M49 26 L51 26 M49 32 L51 32 M49 38 L51 38 M49 44 L51 44 M49 50 L51 50 M49 56 L51 56 M49 62 L51 62 M49 68 L51 68 M49 74 L51 74 M49 80 L51 80 M49 86 L51 86", stroke: "#cbd5e1", strokeWidth: 0.5 }),
  h("path", { d: "M28 66 L46 66 L46 88 L24 88 Z M72 66 L54 66 L54 88 L76 88 Z", ...line }),
  h("path", { d: "M22 86 L78 86 M4 68 L18 70 M96 68 L82 70", ...line }),
  h("path", { d: "M12 24 L22 46 M88 24 L78 46", ...line })
  );

// Jogger trousers: waistband with drawcord, two legs, side pockets, ribbed cuffs.
const Jogger = () =>
  h(
  "g",
  null,
  h("path", { d: "M22 10 L78 10 L84 54 L74 94 L56 94 L50 50 L44 94 L26 94 L16 54 Z", ...stroke }),
  h("path", { d: "M22 10 L78 10 L78 16 L22 16 Z", fill: "#0f172a", stroke: "#94a3b8", strokeWidth: 0.8 }),
  h("path", { d: "M46 16 Q50 22 54 16", fill: "none", stroke: "#cbd5e1", strokeWidth: 0.6 }),
  h("path", { d: "M26 20 L30 36 M74 20 L70 36", ...line }),
  h("path", { d: "M26 88 L44 88 M56 88 L74 88", ...line }),
  h("path", { d: "M20 54 L50 50 L80 54", ...line })
  );

const DRAW = { "tee-round-neck": Tee, polo: Polo, "hoodie-zip": Hoodie, "trouser-jogger": Jogger };

// The drawing with its hotspots: `rows` carry {no, operation, hotspot:{x,y}}; the selected one is ringed.
const GarmentDrawing = ({ imageKey, rows = [], selected, onPick }) => {
  const Shape = DRAW[imageKey] || Tee;
  return h(
    "svg",
    { viewBox: "0 0 100 100", className: "w-full h-full", role: "img", "aria-label": imageKey || "garment" },
    h(Shape),
    rows
      .filter((r) => r.hotspot && r.hotspot.x !== undefined)
      .map((r) => {
        const on = selected === r.no;
        return h(
          "g",
          { key: r.no, onClick: () => onPick && onPick(r.no), className: "cursor-pointer" },
          on && h("circle", { cx: r.hotspot.x, cy: r.hotspot.y, r: 5, fill: "rgba(16,185,129,0.25)", stroke: "#34d399", strokeWidth: 0.6 }),
          h("circle", { cx: r.hotspot.x, cy: r.hotspot.y, r: 2.6, fill: on ? "#34d399" : r.critical === "yes" ? "#f43f5e" : "#38bdf8", stroke: "#0f172a", strokeWidth: 0.5 }),
          h("text", { x: r.hotspot.x, y: r.hotspot.y + 1.1, textAnchor: "middle", fontSize: 2.6, fontWeight: 700, fill: "#0f172a" }, r.no)
        );
      })
  );
};

export default GarmentDrawing;
