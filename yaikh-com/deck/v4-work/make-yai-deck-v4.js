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
  // EDF · Startup Investment Package 2 — a US$100,000 ask with EDF's own categories.
  "100k": { amt: "US$100,000", target: 25, round: "investment", alloc: [
    ["1 · Technology", "50%", "Higher-capacity Ai servers to train our own LLM in-house · developer-grade machines"],
    ["2 · Local supplier onboarding", "30%", "City office and training centre in Phnom Penh — neutral ground, 2–3 training rooms"],
    ["3 · Inventory", "20%", "AIoT stock ready: face-scan machines, meters, sensors — connect a factory the week it signs"],
    ["4 · Working capital", "0%", "Already covered by revenue — Yorkwell funding and client subscriptions"],
  ] },
  // 5th deck — internal, for Arnold's client conversations: title slide + agent constellation + (empty) slide 3.
  "client": { amt: "Client deck", target: null, client: true },
  // EDF essentials — 6 slides: title · solution · module prices · sales confirmed · the ask · close.
  "edf": { amt: "US$100,000", target: 25, round: "investment", edf: true, alloc: null },
};
if (process.argv[2] === "all") {
  const { execFileSync } = require("child_process");
  for (const k of Object.keys(TIERS)) execFileSync(process.execPath, [__filename], { env: { ...process.env, ASK: k }, stdio: "inherit" });
  process.exit(0);
}
const DEFAULT_ALLOC = [
  ["1 · Development hardware", "45%", "Ai development on Mac M5 / M6 · more GX10 Ai servers and GPU docks · AIoT upgrades"],
  ["2 · Events and promotion", "25%", "Events in Cambodia, Singapore and Hong Kong"],
  ["3 · City office", "15%", "City office setup in Phnom Penh"],
  ["4 · Yai's own factory", "15%", "Start planning Yai's own manufacturing facility — fully running on the Yai platform"],
];
const ASK = process.env.ASK || "3m";
const TIER = TIERS[ASK];
if (!TIER) throw new Error(`unknown ASK=${ASK}; use ${Object.keys(TIERS).join(" / ")}`);
const OUT = path.join(__dirname, ASK === "3m" ? "yai-deck-v4.html" : `yai-deck-v4-${ASK}.html`);

/* Agent constellation — sections → tabs → agent names, mirrored from
 * yaikh-dashboard/src/data/module.js (DASHBOARD_DATA). Re-sync if that changes. */
const CONSTELLATION = [
  { s: "Cloud Startup Package", c: "aistart", cols: 1, g: [[["", ["Small"], "$120"], ["", ["Medium factory"], "$750"], ["", ["1,000-worker factory"], "$1,200"]]] }, // three packages
  { s: "Ai Server", c: "aisrv", cols: 1, g: [["", ["NVIDIA", "or Huawei"], "$2,500"]] },
  { s: "Administration", c: "admin", cols: 4, g: [
    ["HR", ["YHR", "Org Chart", "Training", "Temporary Worker", "Speak Up"], "$2,000"],
    ["Billing", ["Purchase Request", "Bill Claim", "Salary Bill", "Shipping Bill"]],
    ["Admin", ["Support Ticket", "Y Shop", "Gate Pass", "Meeting Room"], "$2,000"],
    ["CSR", ["Digital Audit", "Energy", "Air", "Water", "Waste", "Chemical"], "$2,000"],
    ["Accountant", ["Accountant", "IEWS"]], // row 2
    ["Shipping", ["Shipping"]],             // under Billing
    ["", ["Car Booking", "Fire Alarm", "CCTV"]], // rest of Admin, under it
    ["E-GOV", ["E-Government"]],            // under CSR
  ] },
  { s: "Management Dashboard", c: "mgmt", cols: 1, g: [
    ["Dashboard", ["Management Dashboard", "SOP"], "On demand"],
    ["Data Scientist", ["System Analysis"]],
  ] },
  { s: "Operations", c: "ops", cols: 2, g: [
    ["QA", ["YQMS", "Call Out"], "$10,000"],
    ["Production", ["YTM", "YTM Shop"], "$5,000"],
    ["", ["FC", "YWIP", "CE"]],                               // row 2: rest of Production
    [["4DP", ["4DP"]], ["YPI", ["YPI"]], ["MRP", ["MRP"]]],   // stacked
  ] },
];

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

// Real product photos (square, 320px) in img-lite/cats/ — drop a new <name>.jpg there to swap one.
const cats = ["garments", "bags", "footwear", "toys", "furniture", "carseats", "homeware"].map((n) => ({ n, d: uri(path.join(LITE, "cats", `${n}.jpg`)) }));
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
if (TIER.edf) TIER.alloc = TIERS["100k"].alloc;
const TOTAL = TIER.client ? 8 : TIER.edf ? 8 : 15;
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
    <h1>Ai-Native Manufacturing Intelligence<br><span class="h1sub">for Soft Goods Manufacturing.</span></h1>
    <p class="tagline">70+ multi-platform apps · 14 Ai agents · AIoT sensors. All in One system — <span class="tag-w">simple enough to run your factory from your phone.</span></p>
  </div>
  <div class="title-flags">
    <div class="flaggroups">
      <div class="flaggroup"><div class="flagrow"><img src="${flag.hk}"><img src="${flag.kh}"><img src="${flag.sg}"></div><div class="flagcap">MADE IN CAMBODIA</div></div>
      <div class="flaggroup"><div class="flagrow"><img class="asean" src="${asean}"></div><div class="flagcap">ASEAN</div></div>
    </div>
  </div>
</div>
<div class="catrow">${cats.map((c) => `<figure><img src="${c.d}" alt=""><figcaption>${c.n === "carseats" ? "car seats" : c.n}</figcaption></figure>`).join("")}</div>
<div class="bigurl">www.yaikh.com</div>
<div class="title-foot">Texlink Technologies Co., Ltd. · ${TIER.round === "investment" ? "EDF · Startup Investment Package 2" : "Seed round"} · September 2026 · Confidential</div>
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
<h2 class="bang">The problem is the “market”</h2>
<p class="sub">1,700 exporters · 5,000 non-manufacturing · 6,000 small businesses — all still on paper and chat apps.<br>We start with the biggest 1,700.</p>
<div class="stat3">
  <div class="stat"><div class="num orange">1,700</div><div class="lab">export garment · footwear · bag factories</div></div>
  <div class="stat"><div class="num blue">5,000</div><div class="lab">non-manufacturing businesses</div></div>
  <div class="stat"><div class="num green">6,000</div><div class="lab">small businesses</div></div>
</div>
${cols3([
  { tag: "Land — 1,700 exporters", html: `<ul class="mk"><li>Garment · footwear · bags</li><li>100+ workers, buyer-audited</li><li>Full suite: 70+ apps, 14 agents</li></ul>` },
  { tag: "Ladder — 5,000 non-manufacturing", html: `<ul class="mk"><li>Hotels · retail · schools</li><li>YHr · admin · accounts</li><li>Nothing new to build</li></ul>` },
  { tag: "Phone-first — 6,000 small businesses", html: `<ul class="mk"><li>No IT staff, no desk</li><li>Yai Lite on a phone, in Khmer</li><li>Where the volume is</li></ul>` },
])}
<p class="foot-note">Targets drawn from: 703,642 non-manufacturing businesses (NIS Economic Census 2022) · 43,970 SMEs (MISTI 2024) · 1,682 garment factories (MISTI 2025).</p>
`, { cls: "tight" }));

/* 4 · WHY NOW */
S.push(slide("dark", "03 · Why now", `
<h2 class="oneline">It's the Ai era. <span class="gold">The challenge is head-on.</span></h2>
<p class="why-sub">Lots of Ai noise in commercial Ai — almost nothing in industrial Ai.<br>Factories don't know what they want until they see it working next door. <b>Yai is the one they'll see.</b></p>
<div class="dates">
  <div class="date"><b>2024</b><span>Private development</span><p>Built in-house, away from the market.</p></div>
  <div class="date"><b>2025</b><span>Built and tested</span><p>70+ apps and 14 Ai agents, tested in private.</p></div>
  <div class="date hot"><b>2026</b><span>Go to market</span><p>The only commercial Ai MiP in the market.</p></div>
</div>
<div class="deadlines"><span>⏱</span><b>UFLPA 2022</b><b>EU Product Passport 2027</b><b>Buyers want live data 2028</b><i>and more coming</i></div>
<div class="ready">
  <div><b>~US$200K invested</b><span>Over the last 2–3 years.</span></div>
  <div><b>Registered business</b><span>Texlink Technologies Co., Ltd. · ICT-certified.</span></div>
  <div><b>Claude · Google for Startups</b><span>Built with their technology and support.</span></div>
  <div><b>20 Ai engineers</b><span>Trained and certified in Phnom Penh.</span></div>
</div>
<p class="foot-note gold"><b>This is the time.</b> A founder and CTO with 40 years each on the floor — ready to wipe the market with the Ai mop.</p>
`, { cls: "why" }));

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
  <div class="rm-cell grow target"><b>Target</b><span>1,700 exporters · 5,000 non-manufacturing · 6,000 small businesses</span></div>
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
<h2>Raising <span class="gold">${TIER.amt}</span> ${TIER.round || "seed round"} to take Yai ${TIER.target === 100 ? "from 21 factories to a hundred" : TIER.target ? `from 21 to ${TIER.target} factories` : "beyond its first 21 factories"}.</h2>
<div class="ask">
  <table class="alloc">
    <thead><tr><th>Allocation</th><th>%</th><th>What it unlocks</th></tr></thead>
    <tbody>
      ${(TIER.alloc || DEFAULT_ALLOC).map(([what, pct, unlocks]) => `<tr><td>${esc(what)}</td><td>${esc(pct)}</td><td>${esc(unlocks)}</td></tr>`).join("")}
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
`, { cls: TIER.alloc ? "asktight" : "" }));

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
    <div><span>The ask</span><b>${TIER.amt} ${TIER.round || "seed round"}</b><em>${TIER.target ? `21 factories → ${TIER.target}` : "21 factories and growing"}</em></div>
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

/* 5th deck: keep the title slide, replace the rest */
if (TIER.client || TIER.edf) {
  const KEEP = TIER.edf ? [S[0], S[4], S[11], S[14]] : [S[0]];
  S.splice(0);
  S.push(KEEP[0]);
  n = 1;
  const sec = (x) => { const hasP = (g) => g && (Array.isArray(g[0]) ? g.some((h) => h[2]) : g[2]); const rows = []; x.g.forEach((g, k) => { const r = Math.floor(k / x.cols); rows[r] = rows[r] || hasP(g); }); return `<div class="csec ${x.c}"><div class="csec-h">${esc(x.s)}</div><div class="ctabs" style="grid-template-columns:repeat(${x.cols},1fr)">${x.g.map((g, k) => { const pr = rows[Math.floor(k / x.cols)]; const one = ([t, m, price], i = 0) => !t && price ? `<span class="cprice big">${esc(price)}</span>${m.length ? `<ul>${m.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}` : `${t ? `${price ? `<span class="cprice">${esc(price)}</span>` : pr && i === 0 ? `<span class="cprice ghost">&nbsp;</span>` : ""}<b>${esc(t)}</b>` : `${pr ? `<span class="cprice ghost">&nbsp;</span>` : ""}<b style="visibility:hidden">&nbsp;</b>`}<ul>${m.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`; return !g ? `<div class="ctab"></div>` : Array.isArray(g[0]) ? `<div class="ctab stack">${g.map((h, i) => one(h, i)).join("")}</div>` : `<div class="ctab">${one(g, 0)}</div>`; }).join("")}</div></div>`; }
  S.push(slide("dark", "Agent constellation", `
<h2>Individual module price</h2>
<div class="const">${CONSTELLATION.map(sec).join("")}</div>
`, { cls: "constslide" }));
  /* Slide 3 — sales plan: customers down the left, Sep 2026 → Dec 2027 across.
   * Customer rows are blank until Gamini gives the names. */
  const MONTHS = [["2026", ["Aug", "Sep", "Oct", "Nov", "Dec"]], ["2027", ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]]];
  const CUSTOMERS = [
    { n: "Yorkmars", note: "Admin, Production", all: "$2,000" },
    { n: "Caswell", note: "Fini Check, YTM" },
    { n: "BICNZ", sep: true, note: "Calibration equipment QR", paid: ["Aug 2026"], at: { "Aug 2026": "$120", "Aug 2027": "$120" } },
    { n: "3SGS", note: "Digital Audit", at: { "Sep 2026": "$750", "Sep 2027": "$750" } },
    { n: "3SGS+", note: "Ai Audit review", at: { "Oct 2026": "$3,000" } },
    { n: "ES Packing", note: "YHR, Gate Pass,\nCar Booking", at: { "Oct 2026": "$750", "Oct 2027": "$750" } },
    {}, {},
  ];
  const cells = MONTHS.flatMap(([y, ms]) => ms.map((m) => [m, `${m} ${y}`]));
  const RANGE = "Aug 2026 → Dec 2027";
  const planSlide = (eyebrow, heading, rows) => slide("dark", `${eyebrow} · ${RANGE}`, `
${heading ? `<h2>${heading}</h2>` : ""}
<table class="plan">
  <thead>
    <tr><th class="who" rowspan="2">Customer</th>${MONTHS.map(([y, ms]) => `<th class="yr" colspan="${ms.length}">${y}</th>`).join("")}</tr>
    <tr>${cells.map(([m]) => `<th>${m}</th>`).join("")}</tr>
  </thead>
  <tbody>
    ${rows.map((c) => `<tr${c.sep ? ` class="sep"` : ""}><td class="who${c.sub ? " sub" : ""}">${c.n ? esc(c.n) : "&nbsp;"}${c.note ? ` <span class="mnote">· ${esc(c.note).replace(/\n/g, "<br>")}</span>` : ""}</td>${(() => { let skip = 0; return cells.map(([, key]) => { if (skip > 0) { skip -= 1; return ""; } const raw = (c.at && c.at[key]) || c.all || ""; const v = typeof raw === "object" ? raw.v : raw; const span = typeof raw === "object" ? raw.span : 1; if (span > 1) skip = span - 1; const isPaid = c.paid && c.paid.includes(key); const setting = key.endsWith("2026"); const word = v && !v.startsWith("$"); return `<td${span > 1 ? ` colspan="${span}"` : ""}${!v ? "" : c.all ? ` class="flat"` : ` class="${isPaid ? "paid" : setting ? "setting" : "hit"}${word && span < 2 ? " word" : ""}"`}>${esc(v)}${!v ? "" : isPaid ? `<span class="paidtag">Paid</span>` : c.all || !setting || !v.startsWith("$") ? "" : `<span class="settag">Setting</span>`}</td>`; }).join(""); })()}</tr>`).join("")}
  </tbody>
</table>
`, { cls: "planslide" });
  S.push(planSlide("Sales confirmed", "", CUSTOMERS));
  if (TIER.edf) {
    // title · solution · prices · sales confirmed · ask · close, then renumber the footers
    const [title, solution, ask, close] = KEEP;
    const [, prices, sales] = S;
    // How it works — PC UI left, phone UI middle, AIoT photo column on the right (20%).
    const howItWorks = slide("dark", "How it works · PC, phone and AIoT sensors — all in one system", `

<div class="hiw">
  <figure class="hiw-web"><img src="${uri(path.join(LITE, "ui", "web-home.jpg"))}" alt="Yai web UI"></figure>
  <figure class="hiw-app"><div class="phone"><div class="phone-notch"></div><img src="${uri(path.join(LITE, "ui", "app-home.jpg"))}" alt="Yai app UI"></div></figure>
  <div class="hiw-aiot"><div class="hiw-aiot-h">AIoT</div><div class="hiw-grid">
    <figure><img src="${uri(path.join(__dirname, "img-about", "photo", "energy-meter.jpg"))}" alt=""><figcaption>Electricity</figcaption></figure>
    <figure><img src="${uri(path.join(__dirname, "img-about", "photo", "water-meter.jpg"))}" alt=""><figcaption>Water</figcaption></figure>
    <figure><img src="${uri(path.join(__dirname, "img-about", "photo", "air-sensor.jpg"))}" alt=""><figcaption>Humidity · temp.</figcaption></figure>
    <figure><img src="${uri(path.join(__dirname, "img-about", "photo", "wall-pad.jpg"))}" alt=""><figcaption>Waste pad</figcaption></figure>
    <figure><img src="${uri(path.join(__dirname, "img-about", "photo", "water-ions.jpg"))}" alt=""><figcaption>Water sensors</figcaption></figure>
    <figure><img src="${uri(path.join(__dirname, "img-about", "photo", "waste-kpi.jpg"))}" alt=""><figcaption>Waste KPIs</figcaption></figure>
  </div></div>
</div>
`, { cls: "hiwslide" });

    // App UI — redesign concept, drawn (not a screenshot). Yai orange + navy, flat icons, same structure.
    const ico = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    const I = {
      ticket: ico('<path d="M3 9a2 2 0 0 0 2-2V5h14v2a2 2 0 0 0 0 4v0a2 2 0 0 0 0 4v2H5v-2a2 2 0 0 0-2-2z"/><path d="M13 5v14"/>'),
      shop: ico('<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v11H3z"/><path d="M9 20v-6h6v6"/>'),
      scan: ico('<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><path d="M4 12h16"/>'),
      web: ico('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
      train: ico('<path d="M4 5h16v11H4z"/><path d="M8 21h8M12 16v5"/>'),
      gate: ico('<path d="M4 20V6M4 10h16l-1 4H4"/>'),
      hr: ico('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
      ytm: ico('<path d="M14 7l3-3 3 3-3 3z"/><path d="M4 20l9-9"/><path d="M4 20l3 0 0-3"/>'),
      needle: ico('<path d="M4 20L18 6"/><circle cx="19" cy="5" r="2"/>'),
      waste: ico('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
      car: ico('<path d="M5 16l1.5-6h11L19 16"/><path d="M3 16h18v3H3z"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>'),
      meet: ico('<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M2 20a6 6 0 0 1 12 0M10 20a6 6 0 0 1 12 0"/>'),
    };
    const tile = (k, t) => `<div class="m-tile"><span class="m-ico">${I[k]}</span><span>${t}</span></div>`;
    const row = (k, t, lock) => `<div class="m-row${lock ? " lock" : ""}"><span class="m-ico sm">${I[k]}</span><span>${t}</span>${lock ? `<i>🔒</i>` : ""}</div>`;
    const phoneMock = `<div class="phone concept"><div class="phone-notch"></div><div class="m-screen">
      <div class="m-top"><span class="m-avatar"></span><b>KA…</b><small>TL02</small><span class="m-sp"></span><span class="m-dot"></span><span class="m-dot"></span></div>
      <div class="m-today"><span>Today</span><span class="m-bar"><i></i></span><span>00:00 / 08:00</span></div>
      <div class="m-week"><span>Weekly · 14:52 hrs</span><span>6.5 days</span></div>
      <div class="m-search">Search services…</div>
      <div class="m-h">Market service</div>
      <div class="m-banner"><b>Open a shop now</b><span>Phsar · Factory Services · Wholesale</span></div>
      <div class="m-h">Our services</div>
      <div class="m-grid">${tile("ticket","TL Ticket")}${tile("shop","TL Shop")}${tile("scan","Scan")}${tile("web","Web")}${tile("train","Training")}${tile("gate","Gate Pass")}</div>
      <div class="m-h">Explorers <em>View all ›</em></div>
      <div class="m-list">${row("hr","HR")}${row("ytm","YTM")}${row("needle","Needle")}${row("waste","Waste",true)}${row("car","Booking on map")}${row("meet","Meeting room",true)}</div>
      <div class="m-nav"><span class="on">Home</span><span>Services</span><span>Chat</span><span>Profile</span></div>
    </div></div>`;
    const redesign = slide("dark", "App UI", `
<div class="rd">
  <div class="rd-phones"><div class="phone big"><div class="phone-notch"></div><div class="scr">
    <div class="hd"><span class="hd-av"></span><b>KA…</b><small>TL02</small><span class="hd-sp"></span><span class="hd-ic">🔔</span><span class="hd-ic flag">🇬🇧</span><span class="hd-ic">＋</span></div>
    <div class="hd2"><span>Today</span><span class="hd-bar"><i></i></span><span>00:00 / 08:00</span><em>·</em><span>Weekly 14:52 h</span><em>·</em><span>6.5 d</span></div>
    <div class="vid-row">
      <div class="vid"><img class="vid-bg" src="${uri(path.join(LITE, "ui", "video-worker.jpg"))}" alt="">
        <div class="vid-side"><span>♡<b>2.4k</b></span><span>💬<b>318</b></span><span>↗<b>Share</b></span></div>
        <div class="vid-meta"><b>@yaikh2025 · Ai for garment factory</b><span>Run your factory from your phone 🧵</span></div>
        <div class="vid-play">▶</div></div>
      <div class="vcol"><div class="vb"><span class="vb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l1.5-5h15L21 10"/><path d="M4 10h16v10H4z"/><path d="M9 20v-5h6v5"/><path d="M4 10c0 1.5 1.3 2.5 2.8 2.5S9.7 11.5 9.7 10c0 1.5 1.3 2.5 2.8 2.5s2.8-1 2.8-2.5c0 1.5 1.3 2.5 2.8 2.5S21 11.5 21 10"/></svg></span><small>Phsar Market</small><em>128 shops</em></div><div class="vb"><span class="vb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.1-.6-.6-2.1z"/></svg></span><small>Service Market</small><em>3 requests</em></div><div class="vb"><span class="vb-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-4 9 4-9 4z"/><path d="M3 8v9l9 4 9-4V8"/><path d="M12 12v9"/><path d="M7.5 6l9 4"/></svg></span><small>Factory Supply Market</small><em>2 orders</em></div><div class="vb hot"><span class="vb-ic yai"><img src="${logo}" alt="Yai"></span><small>My Yai</small><em>ask me</em></div></div>
    </div>
    <div class="srow">
      <div class="stile"><i class="sico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><path d="M4 12h16"/></svg></i><span>Scan</span></div>
      <div class="stile"><i class="sico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H4z"/><path d="M8 21h8M12 16v5"/><path d="M8 9h8M8 12h5"/></svg></i><span>My Learn</span></div>
      <div class="stile"><i class="sico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h6"/><circle cx="18" cy="18" r="3" fill="#F37021" stroke="none"/></svg></i><span>My Requests</span></div>
      <div class="stile"><i class="sico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-5h6v5"/><path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg></i><span>Organizations</span></div>
    </div>
    <img class="scr-bot" src="${uri(path.join(LITE, "ui", "app-services-row2.jpg"))}" alt=""><img class="scr-nav" src="${uri(path.join(LITE, "ui", "app-nav.jpg"))}" alt="">
  </div></div></div>
</div>
`, { cls: "rdslide" });
    S.splice(0, S.length, title, howItWorks, redesign, solution, prices, sales, ask, close);
    S.forEach((html, i) => { S[i] = html.replace(/id="s\d+"/, `id="s${i + 1}"`).replace(/<span>\d+ \/ \d+<\/span>/, `<span>${i + 1} / ${TOTAL}</span>`); });
  }
  if (TIER.client) S.push(planSlide("Yai / TAFTAC · YHR leaning presentation", "", [
    { n: "S.E.C. Mega Factory Co., Ltd.", at: { "Sep 2026": "Presentation" } },
    { n: "Yakjin (Cambodia) Inc", at: { "Sep 2026": "Presentation" } },
    { n: "Peouthet168", note: "from EXPO · TG", at: { "Sep 2026": "Presentation" } },
    { n: "Kangbunkym", note: "from EXPO · TG", at: { "Sep 2026": "Presentation" } },
    { n: "IejieKitchen", note: "from EXPO · TG", at: { "Sep 2026": "Presentation" } },
    {}, {},
  ]));
  if (TIER.client) S.push(planSlide("Yai / TAFTAC · YHR leaning presentation (continued)", "", [
    { n: "Sok Kieng / 李子坚 (贝德)", note: "from EXPO · TG", at: { "Sep 2026": "Presentation" } },
    { n: "Vichea Neak", note: "from EXPO · TG", at: { "Sep 2026": "Presentation" } },
    { n: "Proloeng Top", note: "from EXPO · TG", at: { "Sep 2026": "Presentation" } },
    { n: "Heng / Cool Storage & Trucking", note: "from EXPO · TG", at: { "Sep 2026": "Presentation" } },
    { n: "Sambath Ponnareay", note: "from EXPO · TG", at: { "Sep 2026": "Presentation" } },
    { n: "Hand.shippe", note: "from EXPO · WeChat", at: { "Sep 2026": "Presentation" } },
    { n: "Nicholas Ng", note: "from EXPO · WeChat", at: { "Sep 2026": "Presentation" } },
    { n: "Li Pei", note: "from EXPO · WeChat", at: { "Sep 2026": "Presentation" } },
  ]));
  if (TIER.client) S.push(planSlide("Saman · QMS leaning presentation", "", [
    { n: "Saman", note: "Consultant · 5/25" },
    { n: "Elegant Garment Co., Ltd", sub: true, at: { "Sep 2026": { v: "Finalising", span: 2 } } }, { n: "Trax Intertrade Co., Ltd.", sub: true, at: { "Oct 2026": "Finalising" } }, { n: "Factory 3", sub: true },
    { n: "Factory 4", sub: true }, { n: "Factory 5", sub: true },
    {}, {},
  ]));
  if (TIER.client) S.push(planSlide("Joel", "", [{ n: "Joel" }, {}, {}, {}, {}, {}, {}, {}]));
  if (TIER.client) S.push(planSlide("TAFTAC onsite event", "", [{}, {}, {}, {}, {}, {}, {}, {}]));
}

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
.why h2.oneline{font-size:58px;line-height:1.06;margin-bottom:14px;white-space:nowrap}.why h2.stack{font-size:56px;line-height:1.06;margin-bottom:10px;white-space:nowrap}.why-sub{font-size:26px;line-height:1.3;white-space:nowrap;color:#DCE4F5;margin:0 0 18px}.why-sub b{color:var(--orange)}.dates{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:4px solid rgba(255,255,255,.2)}.date{padding:12px 18px 0 0;position:relative}.date:before{content:"";position:absolute;top:-12px;left:0;width:20px;height:20px;border-radius:50%;background:var(--gold)}.date.hot:before{background:var(--orange)}.date b{display:block;font-size:44px;line-height:1;color:#fff}.date.hot b{color:var(--orange)}.date span{display:block;font-size:17px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin:6px 0 6px;font-weight:700}.date p{margin:0;font-size:19px;line-height:1.36;color:#DCE4F5}.ready{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:12px}.deadlines{margin:14px 0 0;font-size:27px;line-height:1.2;color:#B9C6E4;white-space:nowrap;display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid rgba(255,255,255,.14);border-bottom:1px solid rgba(255,255,255,.14);padding:10px 0}.deadlines b{color:#fff;font-weight:700}.ready div{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:14px 16px}.ready b{display:block;font-size:21px;color:#fff;margin-bottom:4px}.ready span{font-size:18px;color:#B9C6E4;line-height:1.35}.why .foot-note{font-size:22px;margin-top:14px;line-height:1.36}
.mk{margin:0;padding:0;list-style:none}.mk li{font-size:22px;line-height:1.3;padding:5px 0 5px 22px;position:relative}.mk li:before{content:"";position:absolute;left:0;top:15px;width:9px;height:9px;border-radius:50%;background:var(--orange)}
.planslide h2{font-size:34px;margin-bottom:14px}.planslide .eyebrow{margin-bottom:14px}.plan{width:100%;border-collapse:collapse;table-layout:fixed;margin-top:0}.plan th,.plan td{border:1px solid rgba(255,255,255,.16);height:44px}.plan th{font-size:17px;font-weight:700;color:var(--gold);letter-spacing:.04em;padding:4px}.plan th.yr{background:rgba(243,112,33,.22);color:#fff;font-size:19px;text-align:center}.mnote{font-size:14px;color:#fff;font-weight:400;line-height:1.25}.planslide{padding-left:40px;padding-right:40px}.plan td.who.sub{padding-left:32px;font-weight:400;color:#DCE4F5}.plan tr.sep td{border-top:4px solid var(--orange)}.plan td.flat{color:#fff;font-weight:700}.plan td.hit{background:rgba(243,112,33,.28);color:#fff;font-weight:700}.plan td.paid{background:#BBF7D0;color:#065F46;font-weight:800}.plan td.setting{background:#FED7AA;color:#9A3412;font-weight:800}.settag{display:block;font-size:10px;font-weight:800;color:#9A3412;letter-spacing:.06em;text-transform:uppercase;margin-top:5px}.paidtag{display:block;font-size:10px;font-weight:800;color:#065F46;letter-spacing:.06em;text-transform:uppercase;margin-top:5px}.plan th.who,.plan td.who{font-family:Arial,Helvetica,"Khmer MN","Khmer Sangam MN","Noto Sans Khmer",sans-serif;width:308px;text-align:left;padding-left:8px;font-size:18px;color:#fff}.plan td{background:rgba(255,255,255,.04);text-align:center;font-size:15px;color:#DCE4F5;overflow:hidden;padding:7px 2px}.plan td.word{font-size:11px;letter-spacing:0;line-height:1.15;padding:0 1px;white-space:normal;overflow-wrap:anywhere}.plan td.paid,.plan td.setting{font-size:14px;line-height:1.2;padding-top:5px;padding-bottom:5px}
.rdslide .eyebrow{margin-bottom:10px}.rd{display:flex;justify-content:flex-start;margin-left:-44px}.rd-phones{width:320px}.phone.big{height:auto;padding:12px 10px;box-sizing:border-box}.scr{width:300px;border-radius:22px;overflow:hidden;background:#f6f6f6}.scr img{display:block;width:300px;border:0;box-shadow:none;border-radius:0}
.hd{display:flex;align-items:center;gap:6px;padding:10px 12px 4px;font-family:Arial,Helvetica,sans-serif;color:#0A1F47}.hd b{font-size:13px}.hd small{font-size:9px;color:#94A3B8}.hd-sp{flex:1}.hd-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#F37021,#FFD58A)}.hd-ic{width:24px;height:24px;border-radius:50%;background:#EEECE7;display:flex;align-items:center;justify-content:center;font-size:11px}.hd-ic.flag{font-size:14px}.hd2{display:flex;align-items:center;gap:5px;padding:2px 12px 6px;font-size:8px;color:#64748B;font-family:Arial,Helvetica,sans-serif;white-space:nowrap}.hd2 em{font-style:normal;color:#CBD5E1}.hd-bar{width:54px;height:5px;border-radius:3px;background:#E8E6E1;overflow:hidden}.hd-bar i{display:block;width:0;height:100%;background:var(--orange)}.scr-bot{height:auto}.srow{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:8px 10px 0;background:#F6F5F2}.stile{background:#fff;border-radius:12px;height:66px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font:700 8.5px Arial,Helvetica,sans-serif;color:#0A1F47;box-shadow:0 1px 3px rgba(10,31,71,.06)}.stile img{width:34px;height:auto;display:block;border:0;box-shadow:none;border-radius:0}.sico{width:32px;height:32px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FF9A5C 0%,#F37021 45%,#C4501A 100%);box-shadow:0 3px 7px rgba(10,31,71,.3),inset 0 -2px 4px rgba(0,0,0,.25),inset 0 2px 3px rgba(255,255,255,.35);color:#fff;display:flex;align-items:center;justify-content:center}.sico svg{width:18px;height:18px;display:block;stroke:currentColor;fill:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))}.scr-nav{height:auto}
.vid-row{display:grid;grid-template-columns:auto 1fr;gap:6px;padding:6px 8px 4px;align-items:stretch}.vid{height:280px;width:156.7px;background:#0A1F47;border-radius:10px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}.vid-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;border:0;box-shadow:none;border-radius:0}.vid-holder{background:linear-gradient(160deg,#0A1F47,#1E4DAA);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:18px;gap:2px;color:#FFD58A;text-align:center}.vid-holder span{font-size:8px;font-weight:700}.vid-holder small{font-size:6.5px;color:#8FA8D8}.vid-side{position:absolute;right:5px;bottom:46px;display:flex;flex-direction:column;gap:7px;align-items:center;color:#fff;font-size:11px;text-shadow:0 1px 2px rgba(0,0,0,.6)}.vid-side span{display:flex;flex-direction:column;align-items:center;gap:1px;line-height:1}.vid-side b{font-size:5.5px;font-weight:700}.vid-meta{position:absolute;left:6px;right:30px;bottom:8px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.7);display:flex;flex-direction:column;gap:2px}.vid-meta b{font-size:6.5px}.vid-meta span{font-size:6px;line-height:1.25}.vid:after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.55),transparent 45%)}.vid-side,.vid-meta,.vid-play{z-index:2}.vid-play{width:32px;height:32px;font-size:14px;border-radius:50%;background:rgba(255,255,255,.85);color:var(--orange);font-size:18px;display:flex;align-items:center;justify-content:center;padding-left:3px}.vid-cap{position:absolute;bottom:6px;left:6px;right:6px;font-size:7px;color:#FFD58A;text-align:center}
.vcol{display:flex;flex-direction:column;justify-content:space-around}.vb{display:flex;flex-direction:column;align-items:center;gap:1px}.vb{gap:0}.vb .vb-ic{width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FF9A5C 0%,#F37021 45%,#C4501A 100%);box-shadow:0 3px 7px rgba(10,31,71,.35),inset 0 -2px 4px rgba(0,0,0,.25),inset 0 2px 3px rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;color:#fff}.vb .vb-ic svg{width:21px;height:21px;display:block;stroke:currentColor;fill:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))}.vb.hot .vb-ic.yai{background:none;box-shadow:0 3px 7px rgba(10,31,71,.35);border-radius:50%;overflow:hidden;padding:0}.vb.hot .vb-ic.yai img{width:100%;height:100%;object-fit:cover;display:block;border:0;box-shadow:none;border-radius:50%}.vb small{font-size:7px;font-weight:700;color:#0A1F47;margin-top:3px;white-space:nowrap}.vb em{font-style:normal;font-size:6.5px;color:#94A3B8}.rd h2{font-size:38px;margin:0 0 16px}.rd ul{margin:0;padding-left:22px;font-size:20px;line-height:1.45;color:#DCE4F5}.rd li{margin-bottom:9px}.rd li b{color:var(--gold)}.rd-note{margin:18px 0 0;font-size:16px;color:#8FA8D8}
.phone.concept{height:585px;padding:12px 10px}.m-screen{background:#F6F5F2;border-radius:22px;height:100%;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#0A1F47;font-size:11px;padding:14px 10px 0;box-sizing:border-box;display:flex;flex-direction:column;gap:7px}
.m-top{display:flex;align-items:center;gap:6px;font-size:12px}.m-top b{font-size:13px}.m-top small{color:#64748B}.m-sp{flex:1}.m-avatar{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#F37021,#FFD58A)}.m-dot{width:20px;height:20px;border-radius:50%;background:#E8E6E1}
.m-today{display:flex;align-items:center;gap:6px;font-size:10px;color:#64748B}.m-bar{flex:1;height:6px;border-radius:3px;background:#E8E6E1;overflow:hidden}.m-bar i{display:block;width:0;height:100%;background:var(--orange)}
.m-week{display:flex;justify-content:space-between;background:#fff;border-radius:8px;padding:5px 8px;font-size:10px;color:#0A1F47}
.m-search{background:#fff;border-radius:10px;padding:7px 10px;color:#94A3B8;font-size:11px}
.m-h{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#0A1F47;display:flex;justify-content:space-between;margin-top:2px}.m-h em{font-style:normal;color:var(--orange);font-weight:700;letter-spacing:0;text-transform:none}
.m-banner{background:linear-gradient(120deg,#0A1F47,#1E4DAA);color:#fff;border-radius:10px;padding:10px 10px;display:flex;flex-direction:column;gap:2px}.m-banner b{font-size:14px;color:#FFD58A}.m-banner span{font-size:9px;color:#DCE4F5}
.m-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.m-tile{background:#fff;border-radius:10px;padding:8px 4px 6px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;font-weight:700}.m-ico{width:22px;height:22px;color:var(--orange);display:inline-block}.m-ico svg{width:100%;height:100%;display:block;stroke:currentColor;fill:none}.m-ico.sm{width:16px;height:16px}
.m-list{display:grid;grid-template-columns:1fr 1fr;gap:5px}.m-row{background:#fff;border-radius:8px;padding:6px 7px;display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;position:relative}.m-row.lock{color:#94A3B8}.m-row.lock .m-ico{color:#CBD5E1}.m-row i{position:absolute;right:5px;top:4px;font-size:8px;font-style:normal}
.m-nav{margin-top:auto;background:#fff;border-radius:14px 14px 0 0;display:flex;justify-content:space-around;padding:8px 0 10px;font-size:9px;color:#64748B;font-weight:700}.m-nav .on{color:var(--orange)}
.hiwslide .eyebrow{margin-bottom:14px;letter-spacing:.1em;white-space:nowrap}.hiw{display:grid;grid-template-columns:5.4fr 2.4fr 2.9fr;gap:18px;align-items:start;margin:0 -48px}.hiw figure{margin:0}.hiw img{display:block;border-radius:10px;border:2px solid rgba(255,255,255,.18);box-shadow:0 10px 30px rgba(0,0,0,.4)}.hiw-web img{width:100%;height:585px;border-left:0;object-fit:cover;object-position:top}.hiw-app img{border-radius:22px;width:100%;height:557px;object-fit:contain;object-position:top;background:#f6f6f6}.hiw figcaption{margin-top:8px;font-size:16px;line-height:1.3;color:#DCE4F5}.hiw figcaption b{display:block;color:var(--gold);font-size:19px;margin-bottom:2px}.hiw-aiot{border:1px solid rgba(255,213,138,.35);border-right:0;border-radius:12px 0 0 12px;padding:10px 12px 12px;height:585px;display:flex;flex-direction:column;gap:6px}.hiw-aiot-h{font-size:19px;font-weight:800;color:var(--gold);letter-spacing:.12em;text-transform:uppercase}.phone{position:relative;background:#111827;border-radius:34px;padding:14px 10px;height:585px;box-sizing:border-box;box-shadow:0 14px 34px rgba(0,0,0,.5),inset 0 0 0 2px #2a3446;width:100%;margin:0 auto}.phone-notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:34%;height:14px;background:#111827;border-radius:0 0 12px 12px;z-index:2}.phone img{display:block;box-shadow:none;border:0}.hiw-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1;min-height:0}.hiw-aiot figure{margin:0;min-height:0;display:flex;flex-direction:column}.hiw-aiot figure img{flex:1;min-height:0;width:100%;object-fit:contain;background:#fff;border-radius:8px;border:1px solid rgba(255,255,255,.14)}.hiw-aiot figcaption{font-size:13px;color:#DCE4F5;margin-top:3px;text-align:center;white-space:nowrap}.hiw-aiot p{margin:0;font-size:15px;color:#8FA8D8;line-height:1.3}
.constslide h2{font-size:36px;margin-bottom:16px}.constslide{padding-left:44px;padding-right:44px}.const{display:grid;grid-template-columns:116px 108px 1fr 144px 232px;gap:12px;align-items:stretch}.crow2{display:grid;grid-template-columns:3fr 5fr;gap:14px}.csec{border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);overflow:hidden}.csec-h{display:flex;align-items:center;justify-content:center;text-align:center;height:58px;line-height:1.2;font-size:17px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:0 10px;color:#fff}.csec.admin .csec-h{background:var(--blue)}.csec.mgmt .csec-h{background:#6D28D9;letter-spacing:.02em}.csec.aisrv .csec-h{background:var(--orange)}.csec.aistart .csec-h{background:#B45309;font-size:14px;letter-spacing:.06em;line-height:1.1}.csec.ops .csec-h{background:var(--green)}.ctabs{display:grid;gap:0;align-content:start}.ctab{padding:14px 8px 16px 10px;border-top:1px solid rgba(243,112,33,.55)}.ctab b{display:block;font-size:19px;color:var(--gold);margin-bottom:6px}.ctab ul{margin:0;padding:0;list-style:none}.cprice{display:block;font-size:18px;font-weight:800;color:#fff;background:rgba(255,213,138,.14);border:1px dashed rgba(255,213,138,.55);border-radius:6px;padding:1px 8px;margin:0 0 4px;width:max-content;min-width:78px}.cprice.ghost{visibility:hidden}.cprice.big{font-size:22px;margin:4px 0 2px;min-width:0}.ctab.stack .cprice.big + ul{margin-bottom:14px}.ctab.stack ul{margin-bottom:12px}.ctab li{font-size:17px;line-height:1.5;hyphens:none;overflow-wrap:normal;color:#E6ECFA}
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
.rivalslide h2{font-size:56px;white-space:nowrap;line-height:1.1;margin-bottom:10px}.rivalslide h2 .flash{color:var(--orange)}.rivalslide .eyebrow{margin-bottom:6px}.rivalslide th{color:var(--blue);border-bottom-color:var(--line)}.rivalslide td{border-bottom-color:var(--line)}.rival td{font-size:20px;padding:10px 14px}.rival td:nth-child(1){width:22%}.rival td:nth-child(3){color:var(--orange);font-weight:700}.rival-line{font-size:21px;margin:-4px 0 0;line-height:1.38}.rival-line b{color:var(--orange)}.rival-line .nowrap{white-space:nowrap}.rival-src{font-size:17px;color:var(--gray);margin:8px 0 0}.asktight h2{font-size:38px}.asktight .alloc td{font-size:18px;padding:11px 12px;line-height:1.3}.asktight .alloc th{font-size:17px;padding:8px 12px}.asktight .milestones li{font-size:19px}.asktight .milestones p{font-size:18px}.alloc td:nth-child(2){font-weight:800;color:var(--gold)}
.milestones{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:18px 20px;font-size:21px}
.ms-head{font-size:18px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin:4px 0 8px}
.milestones ol{margin:0 0 14px 18px;padding:0;line-height:1.6}.milestones p{margin:0;line-height:1.5;color:#D6DEF5}
/* title */
.title-wrap{display:grid;grid-template-columns:auto 1fr;gap:34px;align-items:center;margin-top:70px}
.title-logo{width:200px;height:200px;border-radius:50%;object-fit:cover}
.title-text h1 .h1sub{font-size:.78em;font-weight:600;color:#fff}.title-text h1{margin:0;font-size:46px;white-space:nowrap;line-height:1.1;color:#fff}
.tagline .tag-w{color:#fff}.tagline{margin:18px 0 0;font-size:30px;line-height:1.3;color:var(--gold);font-style:italic}
.title-flags{position:absolute;top:34px;right:64px;display:flex;flex-direction:column;align-items:center}.flagrow{display:flex;gap:14px;align-items:center;justify-content:center}.flagrow img{height:46px;border-radius:4px}.flagrow .asean{height:60px;border-radius:0}
.flaggroups{display:flex;gap:26px;align-items:flex-end}.flaggroup{display:flex;flex-direction:column;align-items:center}.flagcap{margin-top:10px;font-size:17px;font-weight:700;letter-spacing:.12em;margin-right:-.12em;color:var(--gold);white-space:nowrap;text-align:center}
.catrow{display:flex;justify-content:space-between;margin:36px -24px 0}
.catrow figure{margin:0;text-align:center;width:170px}.catrow img{width:168px;height:168px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.18);box-shadow:0 6px 18px rgba(0,0,0,.35)}.catrow figcaption{margin-top:8px;font-size:21px;font-weight:700;color:#fff;text-transform:capitalize}
.bigurl{text-align:center;font-size:64px;font-weight:800;letter-spacing:.14em;color:var(--gold);margin-top:22px}
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
<title>${TIER.client ? "Yai Client Deck · Internal" : TIER.edf ? "Yai — SIPP Cohort 2" : `Yai Pitch Deck v4 · ${TIER.amt}`}</title>
<meta name="viewport" content="width=1320">
<style>${css}</style>
<div class="deck">${S.join("\n")}</div>
<script>(function(){function fit(){var z=Math.min(1,(window.innerWidth-32)/1280);document.querySelectorAll("section.slide").forEach(function(s){s.style.zoom=z;});}fit();window.addEventListener("resize",fit);window.addEventListener("beforeprint",function(){document.querySelectorAll("section.slide").forEach(function(s){s.style.zoom=1;});});window.addEventListener("afterprint",fit);})();</script>
<script>(function(){var m=location.search.match(/only=(\\d+)/);if(!m)return;var k=m[1];document.querySelectorAll('section.slide').forEach(function(s){if(s.id!=='s'+k)s.style.display='none';else{s.style.margin='0';}});document.body.style.background='#0b1020';})();</script>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`wrote ${OUT}\nslides: ${n}\nembedded image bytes: ${(bytes / 1024 / 1024).toFixed(2)} MB\nhtml bytes: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`);
