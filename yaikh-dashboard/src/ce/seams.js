// Seam diagrams for Garment Analysis, the Operation Library and IE Master — drawn here as SVG in the
// textbook style (nothing downloaded): a fabric cross-section on top (the plies as layer lines, the
// needle thread through them) and the stitch-face view below, labelled with the ISO 4915 stitch number.
// Keyed by the data's seam_image_key. `seamFor(code)` gives the usual key for a machine code when a row
// carries none. Written with React.createElement like the other simulated screens.
import React from "react";

const h = React.createElement;
const W = 96;
const H = 64;
const ply = { fill: "none", stroke: "#cbd5e1", strokeWidth: 1.4, strokeLinecap: "round" };
const thread = { fill: "none", stroke: "#38bdf8", strokeWidth: 1.1, strokeLinecap: "round" };
const loop = { fill: "none", stroke: "#34d399", strokeWidth: 1.1, strokeLinecap: "round" };
const face = { fill: "none", stroke: "#38bdf8", strokeWidth: 1.2, strokeLinecap: "round" };
const faceB = { fill: "none", stroke: "#34d399", strokeWidth: 1.2, strokeLinecap: "round" };
const edge = { fill: "none", stroke: "#64748b", strokeWidth: 0.8, strokeDasharray: "2 2" };

// Common frame: the two drawing bands and the label.
const frame = (label, name, section, faceView) =>
  h(
    "g",
    null,
    h("rect", { x: 0.5, y: 0.5, width: W - 1, height: H - 1, rx: 4, fill: "#0f172a", stroke: "#334155" }),
    h("g", { transform: "translate(6,6)" }, section),
    h("line", { x1: 6, y1: 32, x2: W - 6, y2: 32, stroke: "#1e293b" }),
    h("g", { transform: "translate(6,36)" }, faceView),
    h("text", { x: W - 4, y: H - 4, textAnchor: "end", fontSize: 7, fontWeight: 700, fill: "#e2e8f0" }, label),
    h("text", { x: 4, y: H - 4, fontSize: 5.5, fill: "#94a3b8" }, name)
  );

// cross-section pieces ------------------------------------------------------------------------------
// two plies lying flat, superimposed (SSa), seam allowance to the right
const plies2 = (x0 = 0, x1 = 84) => h("g", null, h("path", { d: `M${x0} 8 H${x1}`, ...ply }), h("path", { d: `M${x0} 14 H${x1}`, ...ply }));
// a plain lockstitch through both plies: needle thread up, bobbin thread under
const needle = (x) => h("g", null, h("path", { d: `M${x} 2 V20`, ...thread }), h("path", { d: `M${x - 3} 2 H${x + 3}`, ...thread }), h("path", { d: `M${x - 3} 20 H${x + 3}`, ...loop }));
// overlock: the edge cut, loopers wrapping the edge
const overlockSection = (needles) =>
  h("g", null, plies2(0, 60), h("path", { d: "M60 4 V18", ...edge }), needles.map((x) => needle(x)), h("path", { d: "M52 2 Q66 2 66 11 Q66 20 52 20", ...loop }), h("path", { d: "M56 5 Q62 11 56 17", ...loop }));
// flat seam / coverstitch: plies butted or lapped, top cover thread and under loops
const coverSection = (lapped) =>
  h("g", null, lapped ? h("g", null, h("path", { d: "M0 8 H50", ...ply }), h("path", { d: "M0 14 H50", ...ply }), h("path", { d: "M34 11 H84", ...ply }), h("path", { d: "M34 17 H84", ...ply })) : plies2(), [30, 42, 54].map((x) => needle(x)), h("path", { d: "M26 1 Q42 -3 58 1", ...loop }), h("path", { d: "M26 21 Q42 25 58 21", ...loop }));
// hem: the raw edge turned under once
const hemSection = () => h("g", null, h("path", { d: "M0 8 H84", ...ply }), h("path", { d: "M84 8 Q90 11 84 14 H30", ...ply }), needle(40), needle(52), h("path", { d: "M36 21 Q46 25 56 21", ...loop }));
// binding: a tape folded over the raw edge (BSa)
const bindSection = () => h("g", null, plies2(0, 58), h("path", { d: "M50 4 H66 Q72 11 66 18 H50", ...ply, stroke: "#f59e0b" }), needle(56), h("path", { d: "M52 21 Q58 25 64 21", ...loop }));
// bartack: dense zig-zag block through the plies
const bartackSection = () => h("g", null, plies2(), h("path", { d: "M30 2 L34 20 L38 2 L42 20 L46 2 L50 20 L54 2 L58 20", ...thread }));
// chainstitch: one needle, looper chain under
const chainSection = () => h("g", null, plies2(), needle(42), h("path", { d: "M30 21 Q36 25 42 21 Q48 25 54 21", ...loop }));

// stitch-face pieces (seen from the top) ---------------------------------------------------------
const seamLine = (y) => h("path", { d: `M0 ${y} H84`, ...edge });
const straight = (y, dash = "4 2.5") => h("path", { d: `M0 ${y} H84`, ...face, strokeDasharray: dash });
const zig = (y, amp, step) => {
  let d = `M0 ${y}`;
  for (let x = step, up = true; x <= 84; x += step, up = !up) d += ` L${x} ${up ? y - amp : y + amp}`;
  return h("path", { d, ...faceB });
};
const chain = (y) => h("path", { d: "M0 " + y + " " + Array.from({ length: 14 }, (_, i) => `a3 2 0 1 1 6 0`).join(" "), ...faceB });

const SEAMS = {
  "seam-snls-301": { name: "lockstitch · plain seam SSa", draw: () => frame("301", "SNLS plain seam", h("g", null, plies2(), needle(42)), h("g", null, seamLine(4), straight(10), h("text", { x: 0, y: 20, fontSize: 5, fill: "#64748b" }, "1 needle · bobbin under"))) },
  "seam-ol-514": { name: "4-thread overlock · edge-neatened SSa", draw: () => frame("514", "4-thread overlock", overlockSection([38, 46]), h("g", null, seamLine(4), straight(8, "3 2"), straight(12, "3 2"), zig(16, 3, 4), h("text", { x: 0, y: 24, fontSize: 5, fill: "#64748b" }, "2 needles · 2 loopers"))) },
  "seam-ol-516": { name: "5-thread safety stitch · 401 + 504", draw: () => frame("516", "5-thread safety", overlockSection([30, 46]), h("g", null, seamLine(4), straight(8, "3 2"), chain(12), zig(18, 3, 4), h("text", { x: 0, y: 25, fontSize: 5, fill: "#64748b" }, "chain + 3-thread edge"))) },
  "seam-fl-406": { name: "flatlock / coverstitch · flat seam FSa", draw: () => frame("406", "flatlock flat seam", coverSection(true), h("g", null, straight(6, "3 2"), straight(11, "3 2"), zig(16, 2.5, 3), h("text", { x: 0, y: 24, fontSize: 5, fill: "#64748b" }, "2 needles · cover thread"))) },
  "seam-cs-602": { name: "coverstitch hem · 602", draw: () => frame("602", "coverstitch hem", hemSection(), h("g", null, straight(6, "3 2"), straight(11, "3 2"), zig(16, 3, 3), h("text", { x: 0, y: 24, fontSize: 5, fill: "#64748b" }, "2 needles · top cover"))) },
  "seam-cs-401": { name: "two-thread chainstitch · 401", draw: () => frame("401", "chainstitch", chainSection(), h("g", null, seamLine(4), straight(9), chain(15), h("text", { x: 0, y: 24, fontSize: 5, fill: "#64748b" }, "1 needle · looper chain"))) },
  "seam-bartack": { name: "bartack · zig-zag block 304", draw: () => frame("304", "bartack", bartackSection(), h("g", null, seamLine(4), h("rect", { x: 30, y: 7, width: 26, height: 10, rx: 1, fill: "#0f172a", stroke: "#38bdf8", strokeWidth: 0.8 }), h("path", { d: "M32 8 L34 16 L36 8 L38 16 L40 8 L42 16 L44 8 L46 16 L48 8 L50 16 L52 8 L54 16", ...face, strokeWidth: 0.8 }), h("text", { x: 0, y: 24, fontSize: 5, fill: "#64748b" }, "42 stitches · 1 cm"))) },
  "seam-bind-605": { name: "binding / tape BSa · 605", draw: () => frame("605", "binding (tape)", bindSection(), h("g", null, h("path", { d: "M0 6 H84", ...ply, stroke: "#f59e0b" }), h("path", { d: "M0 16 H84", ...ply, stroke: "#f59e0b" }), straight(9, "3 2"), straight(13, "3 2"), h("text", { x: 0, y: 24, fontSize: 5, fill: "#64748b" }, "tape over the edge · 3 needles"))) },
};

export const SEAM_KEYS = Object.keys(SEAMS);

// The usual seam of a machine code, for rows without a seam_image_key.
export const seamFor = (code) => {
  const c = String(code || "").toUpperCase();
  if (/BT|BAR/.test(c)) return "seam-bartack";
  if (/OL5|516|SAFETY/.test(c)) return "seam-ol-516";
  if (/OL|OVER|514|504/.test(c)) return "seam-ol-514";
  if (/FL|406|407/.test(c)) return "seam-fl-406";
  if (/CS|COVER|602|605/.test(c)) return "seam-cs-602";
  if (/BIND|TAPE/.test(c)) return "seam-bind-605";
  if (/CH|401/.test(c)) return "seam-cs-401";
  if (/SN|LS|DN|301/.test(c)) return "seam-snls-301";
  return "";
};

// <Seam k="seam-ol-514" size={64} /> — the diagram at a given width (64 px in rows, bigger in a detail panel).
export const Seam = ({ k, code, size = 64, className }) => {
  const key = (k && SEAMS[k] && k) || seamFor(code);
  const s = SEAMS[key];
  if (!s) return null;
  return h("svg", { viewBox: `0 0 ${W} ${H}`, width: size, height: Math.round((size * H) / W), className: className || "rounded", role: "img", "aria-label": s.name }, h("title", null, s.name), s.draw());
};

export const seamName = (k) => (SEAMS[k] ? SEAMS[k].name : "");

export default SEAMS;
