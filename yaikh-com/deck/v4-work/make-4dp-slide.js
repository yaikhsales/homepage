/* Quick slide — 4DP at the centre-left, the other nine Operations modules on the
 * right, every one wired back to 4DP. Icons are the Yai app's own module avatars
 * (yaikh-dashboard/public/IMG/avatars, downscaled into img-lite/ops).
 * Run:  node make-4dp-slide.js  →  writes yai-4dp-slide.html next to it. */

const fs = require("fs");
const path = require("path");

const LITE = path.join(__dirname, "img-lite");
const uri = (p) => {
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${fs.readFileSync(p).toString("base64")}`;
};
const ic = (k) => uri(path.join(LITE, "ops", `${k}.png`));
const logo = uri(path.join(LITE, "pub", "yai-logo.jpg"));

// Right-hand column: three groups, the same order as the app's Operations menu.
const groups = [
  { h: "QA", items: [["yqms", "YQMS"], ["callout", "Call Out"]] },
  { h: "Production", items: [["fc", "FC"], ["ywip", "YWIP"], ["ce", "CE"], ["ytm", "YTM"], ["ytmshop", "YTM Shop"]] },
  { h: "Planning", items: [["ypi", "YPI"], ["mrp", "MRP"]] },
];

// Layout (px, inside the 1280×720 slide): hub circle and the 9 node rows.
const HUB = { x: 300, y: 390, r: 110 };
const COL_X = 760;           // left edge of the node column
const NODE_H = 50, GAP = 4; // one row per module
const rows = [];
let y = 100;
for (const g of groups) {
  y += 22;                   // group header
  for (const [k, t] of g.items) { rows.push({ k, t, y: y + NODE_H / 2, g: g.h }); y += NODE_H + GAP; }
  y += 6;
}

// Connectors: a smooth S-curve from the hub's right edge into each node's left edge.
const curves = rows.map((r) => {
  const x0 = HUB.x + HUB.r, y0 = HUB.y, x1 = COL_X - 2, y1 = r.y;
  const c = (x0 + x1) / 2;
  return `<path d="M${x0} ${y0} C ${c} ${y0}, ${c} ${y1}, ${x1} ${y1}"/>`;
}).join("");

const nodes = (() => {
  let out = "", i = 0;
  for (const g of groups) {
    const first = rows[i];
    out += `<div class="gh" style="top:${first.y - NODE_H / 2 - 20}px">${g.h}</div>`;
    for (const [k, t] of g.items) {
      const r = rows[i++];
      out += `<div class="node" style="top:${r.y - NODE_H / 2}px"><img src="${ic(k)}" alt=""><span>${t}</span></div>`;
    }
  }
  return out;
})();

const html = `<!doctype html>
<meta charset="utf-8">
<title>Yai — 4DP and the Operations modules</title>
<style>
:root{--navy:#0A1F47;--orange:#F37021;--gold:#FFD58A;--line:#8FA8D8}
html,body{margin:0;background:#0b1020}
.slide{position:relative;width:1280px;height:720px;margin:24px auto;background:var(--navy);color:#fff;font-family:Arial,Helvetica,sans-serif;border-radius:14px;overflow:hidden}
.eyebrow{position:absolute;left:64px;top:44px;font-size:28px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.sub{position:absolute;left:64px;top:88px;font-size:17px;color:var(--line)}
svg.wires{position:absolute;inset:0;width:1280px;height:720px}
svg.wires path{fill:none;stroke:var(--orange);stroke-width:2.5;opacity:.85}
.hub{position:absolute;left:${HUB.x - HUB.r}px;top:${HUB.y - HUB.r}px;width:${HUB.r * 2}px;height:${HUB.r * 2}px;border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 0 10px rgba(243,112,33,.25),0 0 0 22px rgba(243,112,33,.1)}
.hub img{width:180px;height:180px;object-fit:contain;display:block}
.hub b{font-size:26px;color:var(--navy);margin-top:-6px}
.hub-cap{position:absolute;left:${HUB.x - 190}px;top:${HUB.y + HUB.r + 30}px;width:380px;text-align:center;font-size:15px;line-height:1.4;color:#DCE4F5}
.hub-cap b{display:block;color:var(--gold);font-size:18px;margin-bottom:4px}
.gh{position:absolute;left:${COL_X}px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--orange)}
.node{position:absolute;left:${COL_X}px;width:420px;height:${NODE_H}px;background:#fff;border-radius:12px;display:flex;align-items:center;gap:14px;padding:0 16px;box-sizing:border-box;color:var(--navy);font-weight:700;font-size:17px}
.node img{width:44px;height:44px;object-fit:contain;display:block}
footer{position:absolute;left:64px;right:64px;bottom:22px;display:flex;justify-content:space-between;align-items:center;font-size:14px;color:var(--line)}
footer .mid{display:flex;align-items:center;gap:8px;color:var(--orange);font-weight:700}
footer .mid img{width:22px;height:22px;border-radius:50%}
@media print{@page{size:1280px 720px;margin:0}body{background:#fff}.slide{margin:0;border-radius:0}.hub{box-shadow:none;border:6px solid rgba(243,112,33,.45)}}
</style>
<section class="slide">
  <div class="eyebrow">Operations · 4DP at the centre</div>
  <div class="sub">4DP — daily production planning — feeds and is fed by every other Operations module.</div>
  <svg class="wires" viewBox="0 0 1280 720">${curves}</svg>
  <div class="hub"><img src="${ic("4dp")}" alt="4DP"></div>
  <div class="hub-cap"><b>Daily production planning</b>Orders, lines, targets and materials in one plan — the nine modules on the right read from it and write back to it.</div>
  ${nodes}
  <footer><span>www.yaikh.com</span><span class="mid"><img src="${logo}" alt="">Yai</span><span>Operations</span></footer>
</section>
<script>(function(){function fit(){var w=window.innerWidth,h=window.innerHeight,s=Math.min(w/1328,h/768,1);document.body.style.zoom=s;}fit();window.addEventListener("resize",fit);})();</script>
`;
fs.writeFileSync(path.join(__dirname, "yai-4dp-slide.html"), html);
console.log("wrote yai-4dp-slide.html", rows.length, "nodes, column ends at", Math.round(y));
