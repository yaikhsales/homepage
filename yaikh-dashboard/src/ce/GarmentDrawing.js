// CE · the garment drawing for Garment Analysis — the front flat from the shared sketches map, filled, on a
// 0–100 × 0–100 box so a hotspot given as {x, y} in % lands straight on the drawing. image_key
// (tee-round-neck, polo, hoodie-zip, trouser-jogger) or any garment text picks the sketch.
import React from "react";
import { frontOf, sketchKey } from "./sketches";

const h = React.createElement;
const KEY = { "tee-round-neck": "tee", polo: "polo", "hoodie-zip": "hoodie", "trouser-jogger": "jogger" };

// The drawing with its hotspots: `rows` carry {no, operation, hotspot:{x,y}}; the selected one is ringed.
const GarmentDrawing = ({ imageKey, rows = [], selected, onPick }) => {
  const key = KEY[imageKey] || sketchKey(imageKey);
  const shape = frontOf(key);
  return h(
    "svg",
    { viewBox: "0 0 100 100", className: "w-full h-full", role: "img", "aria-label": imageKey || "garment" },
    h("g", { fill: "#1e293b", stroke: "#94a3b8", color: "#94a3b8" }, shape()),
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
