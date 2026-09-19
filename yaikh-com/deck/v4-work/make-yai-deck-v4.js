/* Yai Pitch Deck v4 — 15-slide investor arc, self-contained HTML.
 * Palette / logo / assets carried over from deck/make-pitch-deck-v3.js.
 * Structure follows the classic pre-seed arc: Title → Problem → Market →
 * Why Now → Solution → Value Prop → Moat → 3× Stakeholder → Traction →
 * Roadmap → Landscape → Business Model → Financial Path → Ask → Team → Close.
 * Run:  node make-yai-deck-v4.js  →  writes yai-deck-v4.html next to it. */

const fs = require("fs");
const path = require("path");

// Downscaled copies (screenshot 1280px, logos 400px, agent icons 256px) — the
// originals total 32 MB and blow the 16 MB artifact cap.
const LITE = path.join(__dirname, "img-lite");
const IMG = LITE;
const AG = path.join(LITE, "agents");
const PUB = path.join(LITE, "pub");
/* Four raise sizes from one source. `node make-yai-deck-v4.js all` builds every tier;
 * a single tier: ASK=1m node make-yai-deck-v4.js. 3m keeps the original file name.
 * Only $3M has a confirmed factory target (21 → 100); the others stay target-free
 * until Gamini gives their numbers — allocation % and other milestones are shared. */
const TIERS = {
  "0.5m": { amt: "US$0.5M", target: null },
  "1m":   { amt: "US$1M",   target: null },
  "2m":   { amt: "US$2M",   target: null },
  "3m":   { amt: "US$3M",   target: 100 },
};
if (process.argv[2] === "all") {
  const { execFileSync } = require("child_process");
  for (const k of Object.keys(TIERS)) execFileSync(process.execPath, [__filename], { env: { ...process.env, ASK: k }, stdio: "inherit" });
  process.exit(0);
}
const ASK = process.env.ASK || "3m";
const TIER = TIERS[ASK];
if (!TIER) throw new Error(`unknown ASK=${ASK}; use ${Object.keys(TIERS).join(" / ")}`);
const OUT = path.join(__dirname, ASK === "3m" ? "yai-deck-v4.html" : `yai-deck-v4-${ASK}.html`);

let bytes = 0;
function uri(p) {
  const buf = fs.readFileSync(p);
  bytes += buf.length;
  const ext = path.extname(p).slice(1).toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "svg" ? "image/svg+xml" : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}
const logo = uri(path.join(PUB, "yai-logo.jpg"));
const asean = uri(path.join(PUB, "asean-logo-with-flags.png"));
const flag = { hk: uri(path.join(IMG, "hk-flag.png")), kh: uri(path.join(IMG, "kh-flag.png")), sg: uri(path.join(IMG, "sg-flag.png")) };
const shot = uri(path.join(IMG, "our-agents-shot.png"));
const expShot = uri(path.join(IMG, "experience-tiles.png"));
const icon = (n) => uri(path.join(IMG, `icon-${n}.png`));
const cust = (n) => uri(path.join(IMG, `customer-${n}.png`));
const part = (n) => uri(path.join(IMG, `partner-${n}.png`));
const ag = (n) => uri(path.join(AG, `${n}.png`));
const arch = (n) => uri(path.join(IMG, `arch-${n}.png`));

const cats = ["garments", "bags", "footwear", "toys", "furniture", "carseats", "homeware"].map((n) => ({ n, d: uri(path.join(LITE, "cat3d", `${n}.png`)) }));
const customers = [
  { n: "Yorkwell Asia", d: part("yorkwell"), what: "21 factories in transformation", bold: "All 14 agents in play", noName: true },
  { n: "3SGS", d: cust("3sgs"), what: "Compliance and ESG AIoT data", bold: "Revolutionising the way compliance audits are done" },
  { n: "BICNZ", d: cust("bicnz"), what: "Calibration technologies and certification", bold: "Never worry about expiring equipment calibrations" },
  { n: "Caswell Cambodia", d: cust("caswell"), what: "Quality and machines in transformation" },
  { n: "ES Packing", d: cust("espacking"), what: "YHR in transformation" },
];
const partners = [
  { n: "Anthropic · Claude", d: part("anthropic-claude") },
  { n: "Google for Startups", html: `<div class="gfs"><div class="gword"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></div><div class="gsub">for Startups</div></div>` },
  { n: "Ministry of Economy and Finance", d: part("mef") },
  { n: "GK SMART", d: part("gksmart") },
  { n: "TAFTAC", d: part("taftac") },
  { n: "CambodiaTrade", d: part("ctrade-stack") },
  { n: "Yorkwell Asia", d: part("yorkwell") },
  { n: "SBC Cambodia", d: part("sbc") },
  { n: "Enterprise Singapore", d: part("esg") },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* ---------- slide shell ---------- */
let n = 0;
const TOTAL = 15;
function slide(kind, eyebrow, body, opts = {}) {
  n += 1;
  const light = kind === "light";
  return `
<section class="slide ${light ? "light" : "dark"} ${opts.cls || ""}" id="s${n}">
  ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ""}
  ${body}
  ${opts.noFooter ? "" : `<footer class="sig"><span>www.yaikh.com</span><span class="sig-mid"><img src="${logo}" alt=""><b>Yai</b></span><span>${n} / ${TOTAL}</span></footer>`}
</section>`;
}
const cols3 = (items, cls = "") => `<div class="cols3 ${cls}">${items.map((i) => `
  <div class="col">
    ${i.img ? `<div class="colimg">${i.img}</div>` : ""}
    <div class="coltag">${i.tagHtml || esc(i.tag)}</div>
    <div class="coltext">${i.html || esc(i.text)}</div>
  </div>`).join("")}</div>`;
const agentRow = (names) => `<div class="agrow">${names.map((x) => `<img src="${ag(x)}" alt="">`).join("")}</div>`;


// Platform marks (simple-icons SVG paths), recoloured inline.
const osIcon = (file, color) => fs.readFileSync(path.join(LITE, "os", file), "utf8")
  .replace(/<title>.*?<\/title>/, "").replace("<svg ", `<svg fill="${color}" width="34" height="34" `);
const PLATFORMS = [
  { f: "windows.svg", c: "#00A4EF", n: "Windows" },
  { f: "android.svg", c: "#3DDC84", n: "Android" },
  { f: "apple.svg",   c: "#FFFFFF", n: "iOS" },
  { f: "huawei.svg",  c: "#FF4B4B", n: "Huawei" },
  { f: "honor.svg",   c: "#FFFFFF", n: "Honor" },
  { img: "lorawan-full.svg", n: "LoRaWAN" },
  { img: "tuya-logo.png", n: "Tuya" },
];
const platformRow = () => `<div class="platforms">${PLATFORMS.map((p) => p.img
  ? `<div class="plat"><img class="badge" src="${uri(path.join(LITE, "os", p.img))}" alt="${p.n}"><span>${p.n}</span></div>`
  : `<div class="plat">${osIcon(p.f, p.c)}<span>${p.n}</span></div>`).join("")}</div>`;

const S = [];

/* 1 · TITLE */
S.push(slide("dark", "", `
<div class="title-wrap">
  <img class="title-logo" src="${logo}" alt="Yai">
  <div class="title-text">
    <h1>Ai-Native Manufacturing<br>Intelligence for Soft Goods.</h1>
    <p class="tagline">70+ multi-platform apps · 14 Ai agents · AIoT. One system — simple enough to run your factory from your phone.</p>
  </div>
  <div class="title-flags">
    <div class="flagrow"><img src="${flag.hk}"><img src="${flag.kh}"><img src="${flag.sg}"><img class="asean" src="${asean}"></div>
    <div class="flagcap">MADE IN CAMBODIA · ASEAN</div>
  </div>
</div>
<div class="catrow">${cats.map((c) => `<figure><img src="${c.d}" alt=""><figcaption>${c.n === "carseats" ? "car seats" : c.n}</figcaption></figure>`).join("")}</div>
<div class="bigurl">www.yaikh.com</div>
<div class="title-foot">Texlink Technologies Co., Ltd. · Seed round · September 2026 · Confidential</div>
`, { noFooter: true }));

/* 2 · PROBLEM */
S.push(slide("dark", "01 · The problem", `
<h2 class="bang"><i>Almost every “factory” still runs<br><span>on paper and chat apps.</span></i></h2>
<div class="callout gold">
  <div class="callout-head">ERP exists only on office PCs and monitors</div>
  <div class="tick">✓ The ERP sits on a desk in the office — it books the ledger after the month closes, and scores compliance after the audit.</div>
  <div class="cross">✗ Nobody built the layer where the daily work starts — where workers, managers, the corporate office and the customers work together on one platform. Today that layer is e-mail, WhatsApp, WeChat and Telegram.</div>
</div>
${cols3([
  { tag: "1 · The brands", text: "Buyers are adopting Ai-native platforms for sales, distribution and sustainability — and the factory answers with an Excel sheet e-mailed on Friday. No live data, no plug-in, no order." },
  { tag: "2 · The government", text: "Government is digitalising fast — taxation, employment, customs documentation, sustainability compliance, environmental data. It wants real data, fast, and penalises late. The factory still files by hand." },
  { tag: "3 · The society", text: "The country is converting into a digital economy and the public is adopting a digital way of living — while the factory still works the 1980s way: ledger books and chat apps nobody can search." },
  { tag: "4 · ASEAN challenge", tagHtml: `<span class="tagrow">4 · ASEAN challenge <img src="${asean}" alt="ASEAN"></span>`, text: "Vietnam, Thailand, Indonesia, the Philippines — even China — want to win the soft-goods industry back with Ai-native technology. A Cambodian factory that stays analogue loses the order to the neighbour that didn't." },
], "four")}
`, { cls: "prob" }));

/* 3 · MARKET */
S.push(slide("light", "02 · The market opportunity", `
<h2 class="bang">The problem is the market.</h2>
<p class="sub">1,700 exporters · 5,000 businesses · 6,000 small factories — all still on paper and chat apps.<br>We start with the biggest 1,700.</p>
<div class="stat3">
  <div class="stat"><div class="num orange">1,700</div><div class="lab">export garment · footwear · bag factories</div></div>
  <div class="stat"><div class="num blue">5,000</div><div class="lab">non-manufacturing businesses</div></div>
  <div class="stat"><div class="num green">6,000</div><div class="lab">small factories</div></div>
</div>
${cols3([
  { tag: "Land — the 1,700 exporters", text: "Garment, footwear and travel-goods factories, 100+ workers each, buyer-audited and already paying for compliance. Yai's home ground: 14 agents, 70+ apps, the full department suite from day one." },
  { tag: "Ladder — 5,000 non-manufacturing", text: "Hotels, restaurants, retail, schools, hospitals and offices run the same departments — HR, admin, purchasing, accounts, compliance. Same agents, no factory floor needed. No new product to build." },
  { tag: "Phone-first — 6,000 small factories", text: "Workshops and sub-contractors with no IT staff and no desk. No dashboard, just the chat: Yai Lite from a phone, one agent at a time, in Khmer. The tail is where the volume is." },
])}
<p class="foot-note">Targets drawn from: 703,642 non-manufacturing businesses (NIS Economic Census 2022) · 43,970 SMEs (MISTI 2024) · 1,682 garment factories (MISTI 2025).</p>
`, { cls: "tight" }));

/* 4 · WHY NOW */
S.push(slide("dark", "03 · Why now", `
<h2 class="stack"><span>Brands are going Ai-native. Government is going digital.</span><span class="gold">The country — and ASEAN — cannot stay in the 1980s.</span></h2>
<p class="sub">Our mission: bridging the gap between Ai-driven brands, digital-first government initiatives, and ASEAN's rapid transformation into a fully digital ecosystem.</p>
${cols3([
  { tag: "1 · The brands", text: "Buyers are re-tooling for Ai-native design and distribution, and sustainability now has a date — EU Digital Product Passport 2027, US UFLPA traceability, Higg live scoring. No live data, no vendor slot." },
  { tag: "2 · The government", text: "Cambodia's digitalisation is under way — GDT e-filing, customs, environment returns, labour data — submitted digitally, on time, or penalised. Compliance now means being digital." },
  { tag: "3 · The society", text: "Workers live on phones, ministries run portals, buyers audit online. A factory on ledger books is a 1980s factory inside a 2026 supply chain." },
  { tag: "4 · ASEAN challenge", tagHtml: `<span class="tagrow">4 · ASEAN challenge <img src="${asean}" alt="ASEAN"></span>`, text: "Vietnam, Thailand, Indonesia, the Philippines — even China — are using Ai-native technology to take the soft-goods industry back. Modernise now, or be modernised out of the order book." },
], "four")}
<p class="foot-note gold"><b>This is the time.</b> The factory that installs Ai in 2026 has two years of trained data when the buyer requires it in 2028. The one that starts in 2028 starts from zero.</p>
`, { cls: "prob" }));

/* 5 · SOLUTION (merged: solution + what we deliver + moat) */
S.push(slide("dark", "04 · The solution", `
${platformRow()}
<h2 class="stack"><span>Ai-Native Apps · Ai Agentic Support ·</span><span>Ai Big Brain for Management · AIoT for Transparency.</span></h2>
<div class="shotwrap exp sol"><img class="shot" src="${expShot}" alt="Yai experience — My Task Agent"></div>
<div class="loop mini">
  <div class="node owner"><b>1 · AI-NATIVE APPS</b><span>70+ apps handle the daily tasks</span></div>
  <div class="arrow">→</div>
  <div class="node pas"><b>2 · AI AGENTS</b><span>14 agents support each department</span></div>
  <div class="arrow">→</div>
  <div class="node brain"><b>3 · AI BIG BRAIN</b><span>for management · 3 matters a day</span></div>
  <div class="arrow">→</div>
  <div class="node workers"><b>4 · AIoT FEEDS</b><span>transparency · sensors · CCTV</span></div>
</div>
<p class="foot-note gold"><b>Yai owns the floor</b> — ERPs own the ledger, Yai owns where the day's work starts. Every answer feeds the factory's own memory.</p>
`, { cls: "sol" }));

/* 6 · WHO IT SERVES (merged: owner + manager + worker, plus supervisor / buyer / government) */
S.push(slide("light", "05 · Who it serves", `
<h2>One system. Six people. Everyone on the same page.</h2>
${cols3([
  { tag: "1 · Worker", text: "Ai motion and workplace analysis guides material, machine and safety — and smooth, effortless motions. All admin support on their phone, any time — even their pay account." },
  { tag: "2 · Supervisor", text: "No more hunting through books or stressing over numbers — Ai planning takes the stress off the floor. Your own data feed: just ask on phone, pad or TV, there at a glance." },
  { tag: "3 · Manager", text: "No more Excel, Word, e-mails and meetings — still chasing the information production and sales need. Fear no more: the entire Ai management capability in your hand, on your screen." },
  { tag: "4 · Owner", text: "Tired of chasing managers? Ai Big Brain knows everything — your own internal ChatGPT, Claude or Gemini. Out of public chats and Excel: your business intelligence, secured on your desk." },
  { tag: "5 · Buyer", text: "A brand's Ai platform is pointless if its manufacturers aren't ready. Yai integration closes that gap — live quality, capacity and sustainability data straight from the floor." },
  { tag: "6 · Government", text: "Compliance, tax, labour relations, customs and control, industry relations — backed by AIoT data feeds. 70+ apps in your hand and Ai agents in action keep every ministry\'s data ready." },
], "six")}
`, { cls: "who" }));

/* 11 · TRACTION */
S.push(slide("dark", "06 · Traction to date", `
<h2>Five years live. Five factories. Zero paid acquisition.</h2>
<div class="stat3 on-dark">
  <div class="stat"><div class="num gold">70+</div><div class="lab">apps in production</div></div>
  <div class="stat"><div class="num gold">14</div><div class="lab">Ai agents in action</div></div>
  <div class="stat"><div class="num gold">$1,200</div><div class="lab">Ai transformation starts · per year</div></div>
</div>
<div class="logos light-tiles">${customers.map((c) => `<figure><img src="${c.d}" alt=""><figcaption>${c.noName ? "" : `<b>${esc(c.n)}</b>`}<span>${esc(c.what)}</span>${c.bold ? `<strong class="tilebold">${esc(c.bold)}</strong>` : ""}</figcaption></figure>`).join("")}</div>
<p class="foot-note gold">Anthropic Partner Network · Google for Startups · JICA-aligned · Cambodia ICT-certified · 20 engineers in Phnom Penh.</p>
`, { cls: "trac" }));

/* 12 · ROADMAP — two stories on one timeline: product + expansion */
S.push(slide("light", "07 · Product roadmap", `
<h2>Two stories, one timeline: what we build — and who runs on it.</h2>
<div class="rm">
  <div class="rm-corner"></div>
  <div class="rm-year">2024</div><div class="rm-year">2025</div><div class="rm-year now">2026</div><div class="rm-year">2027</div>

  <div class="rm-lab prod">Product</div>
  <div class="rm-cell prod"><b>Administrative apps</b><span>The start-up: admin, HR, accounts, purchasing on one platform</span></div>
  <div class="rm-cell prod"><b>Production apps + AIoT</b><span>From mid-year: quality, machines, planning — sensors, meters and CCTV feeding in</span></div>
  <div class="rm-cell prod now"><b>Ai Agentic layer</b><span>14 agents on top of the apps · Big Brain for management</span></div>
  <div class="rm-cell prod"><b>Drones · Robotics · AAIoT</b><span>Advanced AIoT — drones and robots watch while others sleep</span></div>

  <div class="rm-lab grow">Expansion</div>
  <div class="rm-cell grow"><b class="big">1</b><span>factory</span></div>
  <div class="rm-cell grow"><b class="big">15</b><span>factories</span></div>
  <div class="rm-cell grow now"><b class="big">21+</b><span>factories + non-garment companies — ES Packing · 3SGS · BICNZ</span></div>
  <div class="rm-cell grow target"><b>Target</b><span>1,700 exporters · 5,000 non-manufacturing · 6,000 small factories</span></div>
</div>
`, { cls: "rmslide" }));

/* 13 · LANDSCAPE */
S.push(slide("dark", "08 · The current landscape", `
<h2>Who it's for — and where the gap is.</h2>
<table class="land">
  <thead><tr><th></th><th>What they built</th><th>What they missed</th><th>The gap Yai fills</th></tr></thead>
  <tbody>
    <tr><td><b>ERPs — global and local</b></td><td>One app, a few functions — impossible to integrate.</td><td>No industry experience — they don't understand the real issues of soft goods.</td><td>Built from 80 years inside the industry: Arnold (founder) and Gamini (CTO) — see the team.</td></tr>
    <tr><td><b>Excel · Word · E‑mail · WhatsApp</b><span class="scary">⚠ Bye bye business intelligence</span></td><td>Free, familiar — and now every app is Ai-integrated.</td><td>Ai-integrated means your business data goes out in public. Public Ai platforms are hungry for proprietary data.</td><td>Yai data stays right on your desk — on a GX10, well secured.</td></tr>
    <tr><td><b>Worldly · ITS · BV · SGS · ILO · BSCI · WRAP</b></td><td>Platforms to upload data and report.</td><td>Just reporting — they don't guide or help the factory on the topic itself.</td><td>Yai guides the factory every day — live floor data, and the report writes itself.</td></tr>
  </tbody>
</table>
`));

/* 14 · BUSINESS MODEL */
S.push(slide("light", "09 · Business model", `
<h2>A ladder, not a licence. Every dollar spent at step one still works at step six.</h2>
${cols3([
  { tag: "This is how it starts", html: `<div class="price">$120 → $1,200<span>/ yr</span></div><p class="intro">Cloud — small business to large factory.</p><ul class="tiers"><li><b>Starter</b><span>5 seats</span></li><li><b>Growth</b><span>300 users</span></li><li><b>Enterprise</b><span>1,000 users</span></li></ul>` },
  { tag: "Then it escalates to Ai agents", html: `<div class="price">$2,500 → $15,000</div><p class="intro">Everything activated, right in front of you.</p><ul class="tiers"><li><b>Ai server</b><span>looks mini · on your desk</span></li><li><b>Ai agents</b><span>real task officers</span></li><li><b>Big Brain</b><span>the big boss knows all</span></li></ul>` },
  { tag: "Then corporate level", html: `<div class="price">$5,000 → $15,000</div><p class="intro">Corporate — multi-continent, multi-market.</p><ul class="tiers"><li><b>Drones · Robots</b><span>they watch while others sleep</span></li><li><b>AAIoT</b><span>Advanced AIoT</span></li></ul>` },
], "greencards")}
`, { cls: "bm" }));

/* 15 · FINANCIAL PATH — the same three steps as the business model, on a timeline */
S.push(slide("light", "10 · Path to the targets", `
<h2>The same three steps — on a timeline.</h2>
<div class="proof"><b>Proof:</b> 21 factories started on cloud apps in May 2026 — the first of them move up to Ai agents in Q1 2027. <b>Step 1 → step 2 in about 9 months.</b></div>
<div class="path">
  ${[
    { tag: "This is how it starts", when: "2024–2026", arr: "~$100K", who: "21+ factories + non-garment", note: "Cloud apps · Starter → Enterprise", h: 45, c: "#94A3B8" },
    { tag: "Then it escalates to Ai agents", when: "2027–2028", arr: "~$0.5M", who: "100 factories", note: "Ai server · 14 agents · Big Brain", h: 100, c: "#1E4DAA" },
    { tag: "Then corporate level", when: "2028–2030", arr: "~$3M", who: "500 factories + ASEAN", note: "Multi-continent · drones · robots · AAIoT", h: 175, c: "#F37021" },
  ].map((x) => `<div class="pcol">
    <div class="ptag">${x.tag}</div>
    <div class="pbarwrap"><div class="parr">${x.arr}<span> ARR</span></div><div class="pbar" style="height:${x.h}px;background:${x.c}"></div></div>
    <div class="pwhen">${x.when}</div>
    <div class="pwho">${x.who}</div>
    <div class="pnote">${x.note}</div>
  </div>`).join("")}
</div>
<p class="foot-note">Illustrative recurring revenue. How we get there: TAFTAC, SBC and CambodiaTrade member events in Cambodia; Enterprise Singapore for the region — introductions, not cold outreach.</p>
`, { cls: "pathslide" }));

/* 16 · THE ASK */
S.push(slide("dark", "11 · The ask", `
<h2>Raising <span class="gold">${TIER.amt}</span> seed round to take Yai ${TIER.target ? "from 21 factories to a hundred" : "beyond its first 21 factories"}.</h2>
<div class="ask">
  <table class="alloc">
    <thead><tr><th>Allocation</th><th>%</th><th>What it unlocks</th></tr></thead>
    <tbody>
      <tr><td>1 · Development hardware</td><td>45%</td><td>Ai development on Mac M5 / M6 · more GX10 Ai servers and GPU docks · AIoT upgrades</td></tr>
      <tr><td>2 · Events and promotion</td><td>25%</td><td>Events in Cambodia, Singapore and Hong Kong</td></tr>
      <tr><td>3 · City office</td><td>15%</td><td>City office setup in Phnom Penh</td></tr>
      <tr><td>4 · Yai's own factory</td><td>15%</td><td>Start planning Yai's own manufacturing facility — fully running on the Yai platform</td></tr>
    </tbody>
  </table>
  <div class="milestones">
    <div class="ms-head">Four milestones</div>
    <ol>
      <li>${TIER.target ? `${TIER.target} paying factories in Cambodia` : "More paying factories in Cambodia"}</li>
      <li>Anthropic Partner Network confirmed</li>
      <li>Layer 3 live at five factories</li>
      <li>Series A by Q4 2028</li>
    </ol>
    <div class="ms-head">Beyond cash</div>
    <p>Strategic build partners · shared space and events in new markets · data-centre and GPU alliances. Each opens a faster lane without changing how the platform is built.</p>
  </div>
</div>
`));

/* 12b · SERIOUS COMPETITOR — Adidas's own manufacturing intelligence stack (sourced, see footnote) */
S.push(slide("light", "12 · Our serious competitor", `
<h2>Adidas built its own MiP <span class="flash">(half-baked)</span>.</h2>
<p class="rival-line">Built for Adidas only — sell it, and Nike and Under Armour copy it and the edge is gone.<br><span class="nowrap">It moves material from mills → factories → shipment → shop racks; it doesn't run the factory floor.</span><br><b>No AIoT · no Ai PAs · no Big Brain. Yai has all three.</b></p>
<table class="land rival">
  <thead><tr><th>Adidas MiP — the stack</th><th>What it does for Adidas</th><th>Where Yai is different</th></tr></thead>
  <tbody>
    <tr><td><b>AWS + SAP data lake</b></td><td>Adidas ERP and data lake in the cloud — analytics built 40× faster.</td><td>Runs in the factory — on a GX10 on the owner's desk. Data stays home.</td></tr>
    <tr><td><b>o9 Solutions</b></td><td>Ai demand planning, allocation and replenishment for Adidas stores.</td><td>Plans the floor itself — line plan, master plan, capacity, live.</td></tr>
    <tr><td><b>TrusTrace</b></td><td>Material traceability — 500 factories, 10,000 material suppliers.</td><td>One factory, every brand — the same floor data feeds each buyer.</td></tr>
    <tr><td><b>project44</b></td><td>Ai visibility of shipments in transit (2026).</td><td>Sees it before it ships — cutting, sewing, QC, packing.</td></tr>
  </tbody>
</table>
<p class="rival-src">Sources: adidas / AWS (2021) · o9 Solutions · TrusTrace · project44 (2026)</p>
`, { cls: "rivalslide" }));

/* 17 · TEAM + PARTNERS */
S.push(slide("light", "13 · Team and partners", `
<h2 class="stack"><span>40 years on the factory floor.</span><span style="color:var(--orange)">20 Cambodian engineers in Phnom Penh.</span></h2>
<div class="logos partners">${partners.map((p) => `<figure class="${p.dark ? "darkbg" : ""}">${p.html || `<img src="${p.d}" alt="${esc(p.n)}">`}</figure>`).join("")}</div>
${cols3([
  { tag: "Founder · Arnold", tagHtml: `<span class="facerow"><img src="${uri(path.join(LITE, "team-arnold.png"))}" alt="Arnold"><span>Founder<br><b>Arnold</b></span></span>`, text: "Founder and management consultant. Engineer with 40 years of factory management." },
  { tag: "CTO · Gamini", tagHtml: `<span class="facerow"><img src="${uri(path.join(LITE, "team-gamini.png"))}" alt="Gamini"><span>CTO<br><b>Gamini</b></span></span>`, text: "40 years in the industry — director of technology, industrial engineering and CSR manager. GSD licence holder, master's degree." },
  { tag: "20 Cambodian engineers", text: "Certified in Ai integration, based in Phnom Penh. Texlink Technologies Co., Ltd., ICT-certified." },
  { tag: "Strategic partner", text: "Yorkwell Asia — 21 factories in transformation, and the route to the brand offices in Hong Kong." },
], "four")}
`, { cls: "team" }));

/* 14 · CLOSE */
S.push(slide("dark", "", `
<div class="close">
  <img class="close-logo" src="${logo}" alt="Yai">
  <h1>The only Commercial Ai MiP<br><span class="sub-h">for the Soft Goods industry.</span></h1>
  <p class="gold big">40 years of industry experience · 20 Ai engineers<br>Built with Claude, Google and NVIDIA technology.</p>
  <div class="close-row">
    <div><span>The ask</span><b>${TIER.amt} seed round</b><em>${TIER.target ? `21 factories → ${TIER.target}` : "21 factories and growing"}</em></div>
    <div><span>See it live</span><b>yaikh.com/experience</b><em>70+ apps · 14 Ai agents</em></div>
    <div class="talk">
      <span>Talk to us</span>
      <div class="talk-body">
        <figure class="qr"><img src="${uri(path.join(LITE, "gamini-telegram-qr.png"))}" alt="Telegram QR"><figcaption>Scan · Telegram</figcaption></figure>
        <div class="talk-lines">
          <b class="pp">Arnold · Founder</b>
          <b class="pp">Gamini · CTO</b>
          <p class="mail">gamini@yaikh.com</p>
          <p><i>WhatsApp</i> +855 92 973 194</p>
          <p><i>Telegram</i> +65 8556 5977</p>
          <p><i>WeChat</i> +86 178 7617 4767</p>
        </div>
      </div>
    </div>
  </div>
  <p class="close-foot">www.yaikh.com · Texlink Technologies Co., Ltd. · Phnom Penh · September 2026 · Confidential</p>
</div>
`, { noFooter: true }));

/* ---------- page ---------- */
const css = `
:root{--navy:#0A1F47;--blue:#1E4DAA;--orange:#F37021;--green:#10B981;--dgreen:#0A3327;--ink:#1E293B;--gray:#64748B;--line:#E2E8F0;--card:#F8FAFC;--gold:#FFD58A;--cream:#F7F5EF;--mint:#ECFDF5;--mintline:#A7F3D0}
*{box-sizing:border-box}
body{margin:0;background:#0b1020;font-family:Arial,Helvetica,sans-serif;color:var(--ink)}
.slide{position:relative;width:1280px;height:720px;margin:24px auto;padding:44px 64px 60px;border-radius:14px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.35)}
.slide.dark{background:var(--navy);color:#fff}
.slide.light{background:var(--cream);color:var(--ink)}
.eyebrow{font-size:28px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--orange);margin-bottom:14px}
.dark .eyebrow{color:var(--gold)}
h2{margin:0 0 10px;font-size:44px;line-height:1.12;letter-spacing:-.01em;color:var(--navy)}
.dark h2{color:#fff}
h2.stack span{display:block}
.sub{margin:0 0 24px;font-size:24px;font-style:italic;color:var(--gray)}
.dark .sub{color:#B8C4E6}
.gold{color:var(--gold)!important}
.orange{color:var(--orange)}.blue{color:var(--blue)}.green{color:var(--green)}
.cols3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:22px}
.col{background:#fff;border:1px solid var(--line);border-radius:12px;padding:24px 24px 22px}
.dark .col{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.14)}
.greencards .col{background:var(--mint);border-color:var(--mintline)}
.coltag{font-size:18px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--dgreen);margin-bottom:8px}
.dark .coltag{color:var(--gold)}
.coltext{font-size:22px;line-height:1.4}
.quotes .coltext{font-style:italic;font-size:23px}
.colimg{margin-bottom:10px}
.agrow{display:flex;gap:10px;flex-wrap:wrap}.agrow img{width:72px;height:72px;border-radius:10px;background:#fff;object-fit:contain;border:1px solid var(--line)}
.callout{border-radius:10px;padding:16px 18px;margin:14px 0 6px;background:rgba(255,213,138,.10);border:1px solid rgba(255,213,138,.45)}
.callout-head{font-size:18px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.tick,.cross{font-size:22px;line-height:1.5}.cross{color:#FFB4A2;font-weight:700}
.stat3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin:12px 0 16px}
.stat{background:#fff;border:1px solid var(--line);border-radius:12px;padding:24px;text-align:center}
.on-dark .stat{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.14)}
.num{font-size:76px;font-weight:800;line-height:1;letter-spacing:-.02em}
.lab{font-size:18px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gray);margin-top:8px}
.on-dark .lab{color:#B8C4E6}
.prob h2.bang{font-size:74px;line-height:1.02;letter-spacing:-.02em;margin:0 0 12px}.prob .callout-head{margin-bottom:4px}.prob .callout{padding:12px 20px!important}.prob .tick,.prob .cross{font-size:18.5px!important;line-height:1.38!important}.prob .cols3{margin-top:12px!important}.prob .four .col{padding:12px 14px 10px!important}.prob .coltext{font-size:17.5px!important;line-height:1.36}.prob .coltag{margin-bottom:4px}.prob .callout{padding:16px 22px;margin-top:4px}.prob .tick,.prob .cross{font-size:20.5px;line-height:1.45}.prob .cols3{margin-top:20px;gap:22px}.prob .col{padding:20px 22px}.prob .coltext{font-size:18.5px}.tagrow{display:flex;align-items:center;gap:10px}.tagrow img{height:40px}.cols3.four{grid-template-columns:repeat(4,1fr);gap:16px}.prob .four .col{padding:16px 16px 14px}
.tight h2{font-size:40px}.tight h2.bang{font-size:74px;line-height:1.02;letter-spacing:-.02em;margin:0 0 8px}.tight .callout{padding:14px 18px}.tight .tick,.tight .cross{font-size:19px}.tight .sub{font-size:21px;margin-bottom:10px}.tight .coltext{font-size:18.5px}.tight .col{padding:16px 18px 14px}.tight .cols3{margin-top:14px;gap:18px}.tight .stat{padding:8px 12px}.tight .num{font-size:56px}.tight .foot-note{font-size:17px;margin-top:10px}
.foot-note{font-size:20px;color:var(--gray);margin:20px 0 0;font-style:italic}
.dark .foot-note{color:#B8C4E6}
.pill{display:inline-block;margin:8px 0 18px;padding:14px 22px;border-radius:999px;background:rgba(255,213,138,.14);border:1px solid rgba(255,213,138,.5);font-size:20px}
.loop{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;align-items:center;gap:14px;margin:18px 0 24px}
.node{border-radius:14px;padding:26px 16px;text-align:center;border:2px solid;background:rgba(255,255,255,.05)}
.node b{display:block;font-size:22px;letter-spacing:.12em}.node span{display:block;font-size:19px;color:#B8C4E6;margin-top:8px}
.node.owner{border-color:var(--orange)}.node.brain{border-color:var(--green)}.node.pas{border-color:var(--blue)}.node.workers{border-color:var(--gold)}
.arrow{font-size:40px;color:var(--gold);text-align:center}
.agstrip{margin-top:20px;display:flex;flex-direction:column;align-items:flex-start;gap:10px}.agstrip .agrow{gap:8px;flex-wrap:nowrap}.agstrip .agrow img{width:54px;height:54px}.agstrip-cap{font-size:18px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);white-space:nowrap}
.lockin{font-size:21px;line-height:1.5;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.45);border-radius:12px;padding:20px 22px}
.shotwrap{margin-top:12px;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:#0B1121;max-height:340px}
.rm{display:grid;grid-template-columns:150px repeat(4,1fr);gap:14px;margin-top:24px;align-items:stretch}
.rm-year{font-size:26px;font-weight:800;color:var(--navy);text-align:center;padding:6px 0;border-bottom:4px solid var(--blue)}
.rm-year.now{color:var(--orange);border-bottom-color:var(--orange)}
.rm-lab{display:flex;align-items:center;font-size:18px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.rm-lab.prod{color:var(--blue)}.rm-lab.grow{color:var(--dgreen)}
.rm-cell{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 18px;min-height:170px}
.rm-cell.prod{border-top:6px solid var(--blue)}.rm-cell.grow{border-top:6px solid var(--green)}
.rm-cell.now{background:#FFF7ED;border-color:#FDBA74}.rm-cell.prod.now,.rm-cell.grow.now{border-top-color:var(--orange)}
.rm-cell.target{background:var(--mint);border-style:dashed}
.rm-cell b{display:block;font-size:22px;color:var(--navy);line-height:1.2;margin-bottom:8px}
.rm-cell b.big{font-size:54px;color:var(--dgreen);line-height:1}
.rm-cell span{display:block;font-size:18px;line-height:1.4;color:var(--ink)}
.bm .cols3{margin-top:26px;grid-template-columns:repeat(3,minmax(0,1fr))}.bm .coltag{letter-spacing:.02em;white-space:nowrap;font-size:17px}.bm .col{padding:28px 28px;min-height:420px}.bm .price{font-size:33px;margin-bottom:12px;white-space:nowrap}.bm .coltext{font-size:23px;line-height:1.42}
.gfs{text-align:center;line-height:1}.gword{font-size:40px;font-weight:700;letter-spacing:-.01em}.gsub{font-size:17px;color:#5F6368;margin-top:4px;font-weight:600}
.team .cols3{margin-top:14px}.team .col{padding:16px 18px}.team .coltext{font-size:18.5px;line-height:1.36}
.facerow{display:flex;align-items:center;gap:12px}.facerow img{width:96px;height:96px;border-radius:50%;object-fit:cover;object-position:50% 20%;border:3px solid var(--orange);flex-shrink:0}.facerow img[alt=Arnold]{object-position:50% 45%}.facerow b{font-size:22px;letter-spacing:.02em;color:var(--navy)}
.logos.partners{margin:18px 0 6px;gap:12px}.logos.partners figure{min-height:150px;padding:10px}.logos.partners img{max-height:104px}
.bm .intro{margin:0 0 4px;min-height:2.84em}.bm .tiers li{flex-direction:column;align-items:flex-start;gap:1px;padding:7px 0;font-size:19px}.bm .tiers li span{font-size:17.5px}
.proof{margin:6px 0 4px;padding:12px 18px;border-radius:10px;background:#FFF7ED;border:1px solid #FDBA74;font-size:19px;color:var(--ink)}.proof b{color:var(--orange)}
.path{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:18px}
.pcol{background:var(--mint);border:1px solid #A7F3D0;border-radius:12px;padding:18px 22px;display:flex;flex-direction:column}
.ptag{font-size:17px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--dgreen);white-space:nowrap}
.pbarwrap{height:236px;display:flex;flex-direction:column;justify-content:flex-end;margin:10px 0 12px;border-bottom:2px solid #CBD5E1}
.parr{font-size:38px;font-weight:800;color:var(--navy);margin-bottom:8px}.parr span{font-size:18px;color:var(--gray)}
.pbar{border-radius:8px 8px 0 0;width:100%}
.pwhen{font-size:24px;font-weight:800;color:var(--navy)}
.pwho{font-size:19px;color:var(--ink);margin-top:2px}.pnote{font-size:17px;color:var(--gray);margin-top:4px}
.pathslide .foot-note{font-size:16px;margin-top:10px}
.tiers{list-style:none;margin:16px 0 0;padding:0}.tiers li{display:flex;justify-content:space-between;padding:9px 0;border-top:1px solid rgba(10,51,39,.15);font-size:20px}.tiers li b{color:var(--navy)}.tiers li span{color:var(--gray)}
.cols3.six{grid-template-columns:repeat(3,1fr);gap:18px;margin-top:18px}.who .col{padding:18px 20px;border-top:6px solid var(--orange)}.who .coltext{font-size:19.5px;line-height:1.36}.who .coltag{font-size:19px}
.platforms{position:absolute;top:30px;right:64px;display:flex;gap:18px;align-items:flex-end}.plat{display:flex;flex-direction:column;align-items:center;gap:4px}.plat .badge{height:34px;width:auto;background:#fff;border-radius:6px;padding:3px 6px;box-sizing:content-box}.plat span{font-size:14px;font-weight:700;letter-spacing:.06em;color:#B8C4E6}
.sol h2{font-size:38px}.sol .shotwrap.exp{max-height:312px}.sol .shotwrap.exp .shot{height:312px}.loop.mini{margin:16px 0 4px;gap:12px}.loop.mini .node{padding:12px 12px}.loop.mini .node b{font-size:19px}.loop.mini .node span{font-size:17px;margin-top:4px}.loop.mini .arrow{font-size:32px}.sol .foot-note{margin-top:12px}
.shotwrap.exp{max-height:460px;background:#0A1F47}.shotwrap.exp .shot{height:460px;object-fit:cover;object-position:top}
.shot{display:block;width:100%;height:340px;object-fit:cover;object-position:top}
.logos{display:flex;gap:14px;justify-content:space-between;margin-top:14px}
.logos figure{margin:0;flex:1;background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:96px}
.logos figure.darkbg{background:var(--navy)}
.logos img{max-width:100%;max-height:52px;object-fit:contain}
.logos figcaption{margin-top:8px;font-size:17px;color:var(--gray)}.logos figcaption b{display:block;color:var(--navy);font-size:19px}
.dark .logos figcaption{color:#B8C4E6}.dark .logos figcaption b{color:#fff}
.trac .logos{margin-top:22px}.trac .logos figure{min-height:210px;padding:16px 10px}.trac .logos figure{justify-content:flex-start}.trac .logos img{height:100px;max-height:100px;width:100%;object-fit:contain;margin-bottom:6px}.trac .logos figcaption b{font-size:20px}.trac .logos figcaption{font-size:18px}
.tilebold{display:block;margin-top:6px;color:var(--navy);font-weight:800;font-size:17px;line-height:1.25}
.dark .logos.light-tiles figcaption{color:var(--gray)}.dark .logos.light-tiles figcaption b{color:var(--navy)}
.partners figure{min-height:70px;padding:10px}.partners img{max-height:40px}
.timeline{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-top:22px}
.tl{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px 16px;min-height:400px;border-top:5px solid var(--blue)}
.tl.now{border-top-color:var(--orange);background:#FFF7ED}
.tl-when{font-size:18px;font-weight:700;letter-spacing:.14em;color:var(--gray)}
.tl-what{font-size:25px;font-weight:800;color:var(--navy);margin:10px 0 10px;line-height:1.15}
.tl-desc{font-size:20px;line-height:1.45}
table{width:100%;border-collapse:collapse;margin-top:18px;font-size:21px}
th{text-align:left;font-size:18px;letter-spacing:.14em;text-transform:uppercase;padding:10px 12px;color:var(--gold);border-bottom:1px solid rgba(255,255,255,.2)}
td{padding:12px;border-bottom:1px solid rgba(255,255,255,.12);vertical-align:top;line-height:1.4}
.dark td{color:#E6ECFA}.dark td:first-child{color:#fff;font-weight:800}
.land .scary{display:block;margin-top:10px;color:#FF5A5A;font-weight:800;font-style:italic;font-size:19px;letter-spacing:.02em;text-shadow:0 0 12px rgba(255,60,60,.45)}
.land td{font-size:22px;padding:18px 14px;line-height:1.32}.land th{padding:12px 14px}.land td:nth-child(4){color:var(--gold);font-weight:700}
.price{font-size:36px;font-weight:800;color:var(--navy);margin-bottom:8px}.price span{font-size:20px;font-weight:600;color:var(--gray)}
.ask{display:grid;grid-template-columns:1.35fr 1fr;gap:20px;margin-top:10px}
.rivalslide h2{font-size:56px;white-space:nowrap;line-height:1.1;margin-bottom:10px}.rivalslide h2 .flash{color:var(--orange)}.rivalslide .eyebrow{margin-bottom:6px}.rivalslide th{color:var(--blue);border-bottom-color:var(--line)}.rivalslide td{border-bottom-color:var(--line)}.rival td{font-size:20px;padding:10px 14px}.rival td:nth-child(1){width:22%}.rival td:nth-child(3){color:var(--orange);font-weight:700}.rival-line{font-size:21px;margin:-4px 0 0;line-height:1.38}.rival-line b{color:var(--orange)}.rival-line .nowrap{white-space:nowrap}.rival-src{font-size:17px;color:var(--gray);margin:8px 0 0}.alloc td:nth-child(2){font-weight:800;color:var(--gold)}
.milestones{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:18px 20px;font-size:21px}
.ms-head{font-size:18px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin:4px 0 8px}
.milestones ol{margin:0 0 14px 18px;padding:0;line-height:1.6}.milestones p{margin:0;line-height:1.5;color:#D6DEF5}
/* title */
.title-wrap{display:grid;grid-template-columns:auto 1fr;gap:34px;align-items:center;margin-top:118px}
.title-logo{width:200px;height:200px;border-radius:50%;object-fit:cover}
.title-text h1{margin:0;font-size:46px;white-space:nowrap;line-height:1.1;color:#fff}
.tagline{margin:18px 0 0;font-size:30px;line-height:1.3;color:var(--gold);font-style:italic}
.title-flags{position:absolute;top:34px;right:64px;display:flex;flex-direction:column;align-items:center}.flagrow{display:flex;gap:14px;align-items:center;justify-content:center}.flagrow img{height:46px;border-radius:4px}.flagrow .asean{height:60px;border-radius:0}
.flagcap{margin-top:10px;font-size:17px;font-weight:700;letter-spacing:.12em;margin-right:-.12em;color:var(--gold);white-space:nowrap;text-align:center}
.catrow{display:flex;justify-content:space-between;margin-top:56px}
.catrow figure{margin:0;text-align:center;width:150px}.catrow img{width:96px;height:96px}.catrow figcaption{margin-top:8px;font-size:21px;font-weight:700;color:#fff;text-transform:capitalize}
.bigurl{text-align:center;font-size:64px;font-weight:800;letter-spacing:.14em;color:var(--gold);margin-top:48px}
.title-foot{position:absolute;left:64px;right:64px;bottom:26px;font-size:17px;color:#8FA8D8}
/* close */
.close{text-align:center;margin-top:0}.close-logo{width:110px;height:110px;border-radius:50%;object-fit:cover}
.close h1 .sub-h{font-size:44px}.close h1{font-size:56px;line-height:1.12;margin:12px 0 8px;color:#fff}.big{font-size:32px;line-height:1.4;margin:0}
.close-row{display:flex;gap:24px;justify-content:center;margin:40px auto 0;max-width:1080px}.close-row>div{flex:1;border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:18px 16px;display:flex;flex-direction:column;gap:6px}.close-row>div>span{font-size:17px;letter-spacing:.08em;text-transform:uppercase;color:#8FA8D8}.close-row b{font-size:26px;color:#fff}.close-row b.pp{font-size:24px}.close-row{align-items:stretch;margin-top:30px;max-width:1150px}.close-row .talk{flex:2.1;text-align:left}.close-row .talk>span{text-align:center}.talk-body{display:flex;gap:18px;align-items:center}.qr{margin:0;text-align:center}.qr img{width:150px;height:150px;border-radius:10px;display:block}.qr figcaption{font-size:17px;color:#8FA8D8;margin-top:4px}.talk-lines{display:flex;flex-direction:column;gap:3px}.talk-lines p{margin:0;font-size:19px;color:#fff}.talk-lines p.mail{color:var(--gold);margin-top:4px}.talk-lines i{font-style:normal;color:#8FA8D8;display:inline-block;width:98px}.close-row>div:not(.talk){justify-content:center}.close-row em{font-style:normal;font-size:19px;color:var(--gold,#F5C26B)}.close-foot{position:absolute;left:64px;right:64px;bottom:26px;font-size:17px;color:#8FA8D8;margin:0}
/* footer signature */
.sig{position:absolute;left:64px;right:64px;bottom:20px;display:flex;justify-content:space-between;align-items:center;font-size:17px;letter-spacing:.08em;color:var(--gray)}
.dark .sig{color:#8FA8D8}
.sig-mid{display:flex;align-items:center;gap:8px}.sig-mid img{width:22px;height:22px;border-radius:50%}.sig-mid b{color:var(--orange);letter-spacing:.12em}
@media print{@page{size:1280px 720px;margin:0}body{background:#fff}.slide{margin:0;border-radius:0;box-shadow:none;page-break-after:always;break-after:page}}
`;

const html = `<meta charset="utf-8">
<title>Yai Pitch Deck v4 · ${TIER.amt}</title>
<meta name="viewport" content="width=1320">
<style>${css}</style>
<div class="deck">${S.join("\n")}</div>
<script>(function(){function fit(){var z=Math.min(1,(window.innerWidth-32)/1280);document.querySelectorAll("section.slide").forEach(function(s){s.style.zoom=z;});}fit();window.addEventListener("resize",fit);window.addEventListener("beforeprint",function(){document.querySelectorAll("section.slide").forEach(function(s){s.style.zoom=1;});});window.addEventListener("afterprint",fit);})();</script>
<script>(function(){var m=location.search.match(/only=(\\d+)/);if(!m)return;var k=m[1];document.querySelectorAll('section.slide').forEach(function(s){if(s.id!=='s'+k)s.style.display='none';else{s.style.margin='0';}});document.body.style.background='#0b1020';})();</script>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`wrote ${OUT}\nslides: ${n}\nembedded image bytes: ${(bytes / 1024 / 1024).toFixed(2)} MB\nhtml bytes: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`);
