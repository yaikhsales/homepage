#!/usr/bin/env node
/**
 * Generate section hero images via Google "Nano Banana" (Gemini 2.5 Flash Image).
 *
 * Usage:
 *   1. Add GOOGLE_API_KEY=<your_key> to .env.local
 *   2. node scripts/generate-images.mjs              # generates everything
 *      node scripts/generate-images.mjs hero problem  # generates specific slugs only
 *      node scripts/generate-images.mjs --force       # regenerate even if file exists
 *
 * Output: public/images/generated/<slug>.png
 *
 * Brand notes baked into every prompt:
 *  - Royal blue (#1E4DAA) + white palette
 *  - Cambodian garment-factory context where appropriate
 *  - Editorial / investor-deck quality, no stock-photo feel
 *  - 16:9 framing
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, "..");

// Load .env.local if present (no dotenv dep — minimal hand-roll)
async function loadDotEnv() {
  const envPath = path.join(ROOT, ".env.local");
  try {
    const text = await fs.readFile(envPath, "utf-8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let value = m[2];
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[m[1]] === undefined) process.env[m[1]] = value;
    }
  } catch {
    /* .env.local not present — that's fine if env vars are already set */
  }
}

const STYLE_SUFFIX =
  " Editorial illustration style, deep royal-blue (#1E4DAA) and white palette with subtle navy and teal accents, soft cinematic lighting, clean modern feel, 16:9 wide framing, no text or logos, no watermarks, investor-presentation quality.";

const PROMPTS = [
  {
    slug: "hero",
    prompt:
      "A wide, aspirational editorial illustration of a modern Cambodian garment factory transformed by Ai — workers at sewing machines using tablets and AR overlays, soft holographic data streams floating between stations, a single executive overlooking the floor from a glass mezzanine, sunlight through large windows, a sense of order and quiet intelligence." +
      STYLE_SUFFIX,
  },
  {
    slug: "problem",
    prompt:
      "A wide editorial isometric illustration of GARMENT-FACTORY operational chaos inside a busy Cambodian factory just before a buyer audit. This is NOT a generic office — every detail must be specific to apparel manufacturing operations. ALL of the following happening simultaneously across the factory:" +
      // Sewing floor chaos
      " * a sewing floor with rows of sewing operators at industrial sewing machines (Juki / Brother), but everything around them is chaos:" +
      " a line supervisor running between lines clutching a paper BUNDLE TALLY SHEET;" +
      " bundle tickets, defect tags and repair flags pinned to garments and hanging from threads everywhere;" +
      " a large whiteboard scrawled with chalk production targets, SAM (Standard Allowed Minutes) calculations, and line balancing notes;" +
      " a time-keeper carrying a thick paper attendance register with many missing signatures;" +
      " workers pinning hand-written OT (overtime) slips onto a crowded corkboard;" +
      " hourly production tally sheets pinned crooked at every sewing line;" +
      // Cutting room
      " * a CUTTING ROOM area visible in one corner: long cutting tables with re-printed marker plans stacked, an industrial engineer recalculating SAM on a calculator beside a binder of patterns, fabric shade-band charts pinned to the wall, paper fabric inspection logs scattered;" +
      // QC station
      " * a QC INSPECTION TABLE with QC inspectors in white coats holding clipboards full of paper defect tags, hand-writing reject reports, AQL (Acceptable Quality Level) reference posters on the wall;" +
      // Compliance binders (audit panic)
      " * a compliance officer hauling a tall tower of binders labelled WRAP, BSCI, ILO, HIGG, GMP — because a buyer audit is in 24 hours;" +
      " * a buyer's QA representative standing in a doorway with a paper audit checklist, looking sceptical;" +
      " * PPE checklist clipboards leaning against a wall;" +
      // Office chaos
      " * in a glass-partition OFFICE area visible alongside the floor: a stressed merchandiser on speakerphone holding a paper buyer sample, FOUR phones on her desk each showing a DIFFERENT chat-app icon (WhatsApp, WeChat, Line, Telegram) with notification overlays — every buyer is in a different chat group;" +
      " a production planner staring at an Excel spreadsheet on a monitor that clearly does not match the floor reality;" +
      " a manager at a desk signing a tall stack of paper documents one by one;" +
      " a worker waiting outside a closed manager's door with a frustrated thought bubble 'WHERE IS THE APPROVAL?';" +
      // Finishing & packing
      " * a finishing line with garments on hangers and packers labelling cartons by hand, pack-list spreadsheets printed and stapled to cartons;" +
      // General overwhelm cues
      " * an overflowing printer, papers falling on the floor, a wall clock showing late hours with a stress aura, one exhausted operator slumped at her machine, fluorescent lights buzzing. " +
      "Render from a wide isometric/bird's-eye angle so the entire garment-factory ecosystem is visible — sewing floor, cutting room, QC, finishing/packing, glass-partition office — all in one frame. Use a clearly Cambodian / SEA garment-factory context (typical SEA operator demographics, factory layout, fabric and apparel everywhere). The visual density should feel IMMEDIATELY overwhelming — THIS is the operational chaos that Ai MIP eliminates. Royal-blue (#1E4DAA) and white palette with subtle navy and teal accents, slightly harsher fluorescent lighting to amplify the chaos, clean modern editorial illustration style, 16:9 wide framing, no logos on the artwork (binder labels and thought-bubble text are fine), investor-presentation quality. Communicate the cost: lost INFORMATION, lost EFFICIENCY, no SUSTAINABILITY.",
  },
  {
    slug: "solution",
    prompt:
      "An editorial illustration of one unified Ai-native platform consolidating multiple legacy systems — a central glowing royal-blue interface in the middle, with paper, Excel grids, scattered chat bubbles, and old terminals dissolving into clean digital records flowing toward it. Garment-factory icons (sewing machines, fabric rolls) visible in the periphery." +
      STYLE_SUFFIX,
  },
  {
    slug: "architecture",
    prompt:
      "A clean editorial diagram-style illustration of a three-layer architecture stacked vertically — bottom layer 'Digitalization' (database icons, mobile devices, tablets), middle highlighted layer 'Agentic' (an Ai brain with voice and chat tendrils touching dashboards), top layer 'Full Ai' (a globe with growth charts and a stylized executive silhouette). Beneath the stack, a dashed-line 'before' panel shows paper and chat chaos being absorbed upward." +
      STYLE_SUFFIX,
  },
  {
    slug: "market",
    prompt:
      "An editorial map illustration of South-East Asia with garment-factory pins clustered in Cambodia, Vietnam, Bangladesh, and Myanmar — the Cambodia cluster glowing royal blue as the origin point, soft tendrils radiating outward to the other countries. A subtle data-flow aesthetic in the background." +
      STYLE_SUFFIX,
  },
  {
    slug: "gtm",
    prompt:
      "An editorial illustration of three reinforcing go-to-market channels meeting at a central platform — left: a founder presenting to factory owners at a seminar; middle: a handshake between a government minister and a tech founder over a digital tablet; right: garment-factory workers on their phones using a Yai worker app. The three streams converge in the centre into a single glowing royal-blue node." +
      STYLE_SUFFIX,
  },
  {
    slug: "traction",
    prompt:
      "A grounded editorial illustration of an actual Cambodian garment factory in live production — workers operating sewing machines while floor supervisors use tablets, a wall-mounted dashboard glowing with live production metrics, a manager and an owner reviewing the dashboard in the foreground. Real, working, alive — not aspirational, currently happening." +
      STYLE_SUFFIX,
  },
  {
    slug: "capital",
    prompt:
      "A striking editorial illustration of capital efficiency — a small stack of $360K representing Cambodia engineering on the left, set against towering stacks of $5M (Singapore) and $10M (US) on the right, scaled visibly. A tiny Cambodian-flag detail under the small stack. Conveys disciplined, undervalued strength rather than smug comparison." +
      STYLE_SUFFIX,
  },
  {
    slug: "workers-asking-why",
    prompt:
      "A cinematic editorial illustration of a real Cambodian garment factory floor — the sewing line — captured at a moment when a group of long-serving Cambodian workers and floor supervisors are gathered together sharing the REAL friction they live with every day. Royal-blue (#1E4DAA) and white palette, 16:9 widescreen, premium editorial illustration style." +
      // Subjects
      " FOUR Cambodian factory workers (40s-60s, three women and one man — seamstresses, finisher, floor supervisor) standing in a loose group near a sewing station. Weathered hands, neat work shirts, aprons, scarves/head-coverings on the older women. Expressions are EARNEST and matter-of-fact — they are not hostile or confused, they are simply naming the things that don't work and the thing they've heard works elsewhere. One of them holds a paper form she has to fill in every day. Another holds her smartphone, gesturing at it." +
      // Speech bubbles — concrete friction
      " Above the group, FOUR comic-style speech bubbles in clean readable bold sans-serif text, each emerging from a different worker:" +
      " bubble 1: 'IT'S ALL IN CHINESE — NOT KHMER.'" +
      " bubble 2: 'EVERY TIME I HAVE TO GO TO HR.'" +
      " bubble 3: 'I WRITE THE SAME FORM EVERY DAY.'" +
      " bubble 4: 'I HEARD ANOTHER FACTORY USES THE PHONE NOW.'" +
      " The speech bubbles are white with thin royal-blue borders, sharp readable text, well-spaced around the group, not overlapping." +
      // Background context
      " Background: rows of sewing machines stretching back into the factory, fabric rolls stacked, garments on hangers, a paper HR form pinned to a corkboard with Chinese characters on it (subtle, just enough to read the language cue), soft natural light through high factory windows." +
      // Mood
      " Mood: HONEST and grounded — not bewildered, not resistant. These workers want the change; they just want it in their own language, without the HR detour, without writing the same form every day, like the phone-based system they've heard works at another factory. They're describing real pain, calmly. Warm cinematic lighting, premium investor-deck quality, no real brand logos.",
  },
  {
    slug: "boss-meets-yai",
    prompt:
      "A cinematic editorial illustration of a meeting room inside a Cambodian garment factory's office, royal-blue (#1E4DAA) and white palette, 16:9 widescreen, premium investor-deck quality." +
      // Setting
      " A modern conference room with a polished oval table. A glass partition wall in the background reveals the actual garment factory floor with sewing lines and operators. A large wall display dominates one side of the room." +
      // Factory side (boss + 2 managers)
      " On the LEFT side of the table — the FACTORY: the boss (a Hong Kong Chinese factory owner, 55-60, light-blue business shirt, glasses, slightly worn-down but honest expression), seated and leaning forward, one arm gesturing toward the wall display behind him; two top managers next to him (Hong Kong Chinese, 45-50, business attire — one in shirt-and-tie, one in polo — attentive, slightly resigned)." +
      // Yai side (3 team members)
      " On the RIGHT side of the table — the YAI TEAM (three people): a Sri Lankan man, mid-30s, short black hair, silver-framed round eyeglasses, light beard, in a royal-blue business-casual shirt, taking notes; a Cambodian man, age 26, short hair, neat business-casual, attentive with hands folded on the table; a Cambodian woman, 20s, short hair, business-casual, taking notes on a tablet." +
      // Wall display: graveyard of failed software
      " The wall display behind the boss shows a GRAVEYARD of failed software — a 5-by-4 grid of anonymous ERP / MES / HR / payroll system tiles, each labelled with a red status: 'OFFLINE', 'NO UPDATE 2 YEARS', 'DISCONTINUED', 'PARTIAL DEPLOYMENT', 'ABANDONED'. A prominent header above the grid reads: 'NEARLY 20 SYSTEMS · $2M SPENT · 0% INTEGRATED'." +
      // Speech bubble
      " A large prominent comic-style SPEECH BUBBLE emerges from the boss toward the upper area of the frame. Inside the bubble in bold sans-serif text, perfectly readable on multiple clean lines, exactly these words appear:" +
      " 'Look Yai — it's not that we haven't tried. Nearly 20 systems. All draining cost. None working together. They don't even update anymore.'" +
      " The speech bubble is white with a thin royal-blue border, large enough to be the visual anchor; text sharp and centred." +
      // Mood
      " Lighting: warm interior, soft cinematic. Mood: honest, candid, slightly weary. The boss is being vulnerable, not aggressive. The Yai team is listening attentively with no smugness — they understand. The room atmosphere says 'finally, someone who gets it.' No real software brand logos anywhere — all logo tiles on the wall display are abstract/generic.",
  },
  {
    slug: "management-wall",
    prompt:
      "A split-screen editorial illustration, 16:9 widescreen, royal-blue (#1E4DAA) and white palette, with a clean vertical divider running down the middle of the frame splitting it into two equal halves." +
      // LEFT HALF
      " LEFT HALF — A Hong Kong Chinese general manager (man, 50s, light-blue business shirt, glasses) at his desk in a Cambodia-based garment factory office, visibly overwhelmed. On his desk: a tall stack of paper reports and ring-binders piled high, a desk calculator, and TWO computer monitors completely filled with sprawling Excel spreadsheets — endless rows and columns, colour-coded cells, dozens of tabs open at the bottom, conditional-formatted heat-maps. His head is propped on one hand, the other hand gesturing helplessly at the screens. A large prominent comic-style SPEECH BUBBLE emerges with the words in bold sans-serif text, clearly readable: 'THERE IS NO WAY.'" +
      // RIGHT HALF
      " RIGHT HALF — A Hong Kong Chinese sales manager (man, 40s, white shirt with tie, slightly more polished) at his own desk in an adjacent office, holding a tablet that shows buyer purchase orders and email threads. On his laptop screen behind him: a video-call window with a Western buyer's QA representative visible. The sales manager looks concerned, brow furrowed, leaning forward. A prominent comic-style SPEECH BUBBLE from him reads in bold sans-serif text, clearly readable: 'I don't think the buyer will accept our answer.'" +
      // Connection
      " Both characters are clearly in the same factory building — through glass partitions in the background you can faintly see Cambodian garment workers on the sewing floor far behind them. Both speech bubbles are white with thin royal-blue borders, text sharp and centred." +
      " Lighting: cool office fluorescent on the left (slightly stressed feel), warmer afternoon light on the right (international-call mood). Premium editorial illustration style, no real brand logos, investor-presentation quality. Mood: defeated, overwhelmed — the moment internal management realises the gap between buyer expectations and their current paper/Excel reality is unbridgeable.",
  },
  {
    slug: "government-meeting",
    prompt:
      "A cinematic editorial illustration of a formal compliance meeting in a Cambodian government office, royal-blue and white palette." +
      " On one side of a polished conference table: THREE government officials in formal khaki-and-olive Cambodian Ministry of Environment uniforms with rank insignia and ministry shoulder patches; the senior official (mid-50s, weathered, authoritative) stands gesturing firmly at a tablet, the other two seated reviewing folders." +
      " On the other side: FOUR garment-factory representatives in business attire (a Cambodian factory owner in a polo shirt, an HR manager, a compliance officer holding a binder, a young assistant) — attentive, slightly tense, taking notes." +
      " Behind the officials on a large wall display: a glowing compliance dashboard headed 'DIGITAL COMPLIANCE — MANDATORY'; visible checklist items include 'WORKER INFORMATION', 'EMR (ENVIRONMENTAL MONITORING REPORT) DATA', 'TAX FILINGS', 'LABOUR REPORTS' — some rows tagged green 'FILED', others red 'OVERDUE — PENALTY PENDING'." +
      " On the wall behind: a Cambodian flag, a framed national emblem, an Angkor-Wat silhouette visible through a tall window." +
      " A large prominent comic-style SPEECH BUBBLE emerges from the senior official toward the upper area of the frame. Inside the bubble in bold sans-serif text that must be perfectly readable, exactly these words appear on multiple clean lines:" +
      " 'All factories must comply. Worker data, EMR reports, tax filings — submitted digitally, on time. Late or missing data means PENALTIES. The paper era is over.'" +
      " The speech bubble is white with a thin royal-blue border; the text is sharp and centred." +
      " Lighting: formal, slightly cool, official-government feel. Editorial illustration style matching investor-presentation quality, 16:9 widescreen, no real political logos other than generic Cambodian-government insignia. Mood: serious, official, non-negotiable — this is the government drawing a line.",
  },
  {
    slug: "brand-ceo",
    prompt:
      "A cinematic editorial illustration of a corporate boardroom inside a global fashion-brand headquarters. A sharp, commanding female CEO in her mid-50s, in a tailored navy-blue suit, stands at the head of a polished oval conference table. 8-10 diverse board executives in business attire are seated around the table, attentive, several leaning forward, two taking notes. Behind the CEO a large wall display glows with the headline 'Ai-NATIVE SUPPLIER INTEGRATION' and supply-chain network graphics. Floor-to-ceiling windows reveal a dusk city skyline behind her." +
      " A large prominent comic-style SPEECH BUBBLE emerges from the CEO toward the upper right of the frame. Inside the speech bubble, in CLEAN bold sans-serif text that must be perfectly readable and well-formatted on multiple lines, exactly these words appear:" +
      " 'Tell every team, every supplier — go agentic NOW. No more Excel, no more emails. The factories that integrate win the orders. We don't want to end up like Nokia.'" +
      " Make the speech bubble white with a thin royal-blue border, large enough to be the visual anchor; the text inside must be sharp, readable, and centred. Royal-blue (#1E4DAA) and white palette in the boardroom design with warm cinematic lighting from the windows. Premium editorial illustration style, 16:9 widescreen, no real brand logos, investor-presentation quality. The mood is urgent but controlled — this is the brand's CEO telling her board the industry is pivoting and laggards die.",
  },
  {
    slug: "four-pressures",
    prompt:
      "A wide editorial illustration of a Cambodian garment-factory owner SANDWICHED in the centre, squeezed by four forces converging from four corners. Visual style: clean editorial, royal-blue (#1E4DAA) and white palette, dramatic but tasteful, 16:9 framing, investor-presentation quality." +
      // Centre figure
      " * CENTRE: a Cambodian factory owner in his late 50s, polo shirt and dress trousers, glasses, looking visibly stressed and slightly overwhelmed, hands half-raised in a 'how do I do this?' gesture. He stands on a glowing royal-blue platform labelled 'YAI BRIDGE' supporting him from below." +
      // Four corners with arrows pointing INWARD at the owner
      " * TOP-LEFT corner (BRAND): a sharp global apparel-brand executive in a tailored suit holding a glowing tablet that shows an Ai dashboard; a small sign reading 'INTEGRATE OR WE ROUTE THE ORDER'; subtle skyline silhouettes of brand HQs (anonymous, no real logos) in the background; a thick royal-blue arrow points from this corner toward the owner." +
      " * TOP-RIGHT corner (GOVERNMENT): a Cambodian / SEA government official in formal attire holding a digital tablet that glows with the words 'DIGITAL COMPLIANCE — MANDATORY'; an Angkor-Wat-style government building silhouette in the background; a small Cambodian flag visible; a thick royal-blue arrow points from this corner toward the owner." +
      " * BOTTOM-LEFT corner (HALF-BAKED SOFTWARE — the owner's past): a pile of discarded ERP / MES software boxes and laptops, several screens frozen on installation errors, dashboards half-implemented, sticky-note labels reading 'TRIED', 'FAILED', 'HALF-BAKED'; broken cables; a graveyard of past attempts; an arrow of regret pointing toward the owner." +
      " * BOTTOM-RIGHT corner (MANAGEMENT & WORKERS): a group of 4-5 older Cambodian factory managers and floor workers (50s-60s, weathered hands, work shirts and aprons, gentle but concerned faces), arms crossed; three thought bubbles floating above them: 'WHY NOW?', 'WE WERE FINE FOR 100 YEARS', 'WHO IS AI AGENT?'; a thick royal-blue arrow points from this corner toward the owner." +
      // Yai as the foundation
      " The owner's feet rest on a glowing royal-blue platform; subtle text on the platform reads 'YAI — THE BRIDGE'. Light radiates outward from the platform pushing back against the four pressure arrows. " +
      "Use a clear 4-quadrant composition with the owner at the dead centre; each corner clearly labelled in small editorial typography (BRAND / GOVERNMENT / HALF-BAKED SOFTWARE / MANAGEMENT & WORKERS). Royal-blue and white palette with warm orange accents only on the YAI BRIDGE platform glow. Dramatic cinematic lighting. Communicate: four pressures converging, Yai is the bridge that absorbs them all. No major brand logos anywhere.",
  },
  {
    slug: "layer-digitalization",
    prompt:
      "A wide editorial isometric illustration of the YAI Digitalization Layer inside a modern Cambodian garment factory. Theme: ONE source of truth captured from EVERY garment-industry workflow. NO robots, NO humanoid Ai. Real Cambodian human workers everywhere, calm and focused. ALL of these visible:" +
      " * a single large glowing royal-blue cylindrical database in the centre — the single source of truth for the whole factory;" +
      " * clean arrows of digital data flowing INTO the database from real garment-industry stations: cutting-room workers scanning fabric rolls with handheld scanners; sewing-floor workers tapping bundle tickets on tablets; QC inspectors logging defects on tablets at an inspection line; finishing-line workers scanning QR codes on finished garments; packing-station operator scanning cartons before shipping;" +
      " * AIoT sensors mounted on sewing machines streaming live readings (SPI, uptime) up to the database;" +
      " * a biometric attendance device at the entrance streaming HR/payroll data in;" +
      " * a compliance officer logging audit evidence (WRAP / BSCI / ILO) into a tablet, also flowing in;" +
      " * on the right side: a wall of dashboards converting old Excel grids into clean digital records;" +
      " * on the left side: stacks of paper documents and ledger books visibly dissolving into pixels and flowing toward the database — the digitisation moment;" +
      " * a sustainability KPI tile in one corner showing 'paper saved', 'CO2 reduced', 'traceability score' — green and rising;" +
      " * floor managers walking the floor with tablets, not stuck at desks. " +
      "Background context: a real working garment factory with sewing stations, fabric rolls, cutting tables, finishing lines, packing stations. Humans are the operators, Ai is the data layer behind them. Royal-blue (#1E4DAA) and white palette with subtle navy and teal accents, soft cinematic lighting, clean modern editorial illustration style, 16:9 wide framing, no text or logos beyond dashboard labels integrated into the scene, investor-presentation quality. Communicate INFORMATION + EFFICIENCY + SUSTAINABILITY — not automation.",
  },
  {
    slug: "layer-agentic",
    prompt:
      "A wide editorial isometric illustration of the YAI Agentic Layer in a Cambodian garment factory. CRITICAL: NO robots, NO humanoid Ai figures, NO robotic characters of any kind. Ai is an ambient intelligence layer that AMPLIFIES the human workers; it is not embodied as a character. Every action centres on a real human worker or supervisor using a better tool. ALL of these visible at once:" +
      " * a line supervisor at her station speaking into a tablet — her voice rendered as a visible waveform turning into structured task cards (voice-to-workflow processing);" +
      " * another supervisor typing in plain language into a chat-style command bar on a wall-mounted screen; a translucent LLM overlay interprets it and dispatches actions to the right dashboards (text-to-workflow);" +
      " * a sewing-line operator wearing lightweight AR glasses — a real-time overlay on the garment in front of her highlights target SPI (stitches per inch), the next operation, and an Ai-flagged QC point;" +
      " * a wall-mounted DTV (Digital Twin Visualisation) — a glowing 3D rendering of the active factory floor showing live line balancing, machine status, and a predicted bottleneck highlighted on one specific line;" +
      " * compliance dashboards on screens showing WRAP / BSCI / ILO audit-readiness percentages climbing steadily;" +
      " * a logistics view in one corner: real-time fabric arrivals from suppliers and finished-garment shipment tracking with map pins (geolocation &amp; logistics optimisation);" +
      " * floor managers reviewing intuitive dashboards on tablets while moving through the floor, not stuck at desks;" +
      " * subtle floating chat-bubble overlays where the Ai has answered a supervisor's question, but the chat bubble belongs to the human supervisor, NOT a robot;" +
      " * sustainability cue: a small panel showing reduced waste, fewer rejects, lower energy per garment. " +
      "Background context: the real garment factory humming along — rows of sewing machines with HUMAN operators, fabric rolls, finished garments on hangers, cutting tables. The whole scene is calm and organised — the deliberate OPPOSITE of the chaos image. Royal-blue (#1E4DAA) and white palette with strong glowing-blue Ai accents (data streams, hologram glow), soft cinematic lighting, clean modern editorial illustration style, 16:9 wide framing, no text or logos beyond integrated dashboard labels, investor-presentation quality. Communicate INFORMATION + EFFICIENCY + SUSTAINABILITY — humans empowered, never replaced.",
  },
  {
    slug: "layer-full-ai",
    prompt:
      "A wide editorial illustration of the YAI Full Ai Layer — the executive command layer for a Cambodian garment group. CRITICAL: the Ai is the intelligent dashboard / interface itself — NO humanoid Ai characters, NO robots, NO ghostly Ai silhouettes. Real human executives are in charge; the Ai is the data, the screens, the insights behind them. ALL of these visible:" +
      " * a Cambodian factory owner standing centre-stage in front of a massive curved interactive command screen;" +
      " * the screen displays a glowing world map: Cambodia as home base, factory pins lit up in Vietnam, Bangladesh, Myanmar; multi-country expansion routes drawn as glowing arcs;" +
      " * predictive growth charts (revenue, capacity, order-book) trending upward across wall panels;" +
      " * sustainability dashboards prominently displayed: kg-CO2-per-garment, litres-water-per-kg-fabric, compliance scores (WRAP, ESG, GRS, HIGG) — all on-target and green;" +
      " * multi-factory consolidated metrics tiled across the display: three live factory-floor preview windows showing real sewing lines, real garment workers, real production data;" +
      " * a board of secondary Cambodian and regional executives at a sleek conference table consulting the same dashboards on their tablets;" +
      " * a small text panel on the side displaying an Ai-generated strategic recommendation in plain text (just text on the screen, no robot, no character);" +
      " * a holographic 3D globe rotating in the corner with thin trade-route lines connecting Asian textile hubs;" +
      " * subtle Cambodian cultural cues — an Angkor Wat silhouette through a window in the distance, refined modern decor with Khmer accents;" +
      " * through a glass wall in the background: a real working garment factory floor humming along with sewing stations, fabric rolls, finished garments. " +
      "Deep navy + royal-blue palette with warm gold strategic accents, dramatic cinematic lighting, clean modern editorial illustration style, 16:9 wide framing, no text on the artwork beyond integrated dashboard labels that are part of the scene, investor-presentation quality. Communicate INFORMATION + STRATEGIC CONTROL + SUSTAINABLE GROWTH — humans in command, Ai as the intelligence layer.",
  },
  {
    slug: "team",
    prompt:
      "An editorial group illustration of a 20-person Cambodian software engineering team in a relaxed but focused workspace — diverse, mostly Cambodian, in their late twenties to forties, working on laptops with garment-factory inspired references on the walls (fabric swatches, factory blueprints, a wall display showing Ai workflows). The founder Gamini at the centre table reviewing code on a laptop." +
      STYLE_SUFFIX,
  },
];

const HELP = `Usage:
  node scripts/generate-images.mjs                  Generate every image not already on disk
  node scripts/generate-images.mjs hero problem     Generate only the listed slugs
  node scripts/generate-images.mjs --force          Regenerate everything (overwrite existing)
  node scripts/generate-images.mjs --list           Print available slugs and exit
  node scripts/generate-images.mjs --help           Show this help

Available slugs: ${PROMPTS.map(p => p.slug).join(", ")}
`;

async function main() {
  await loadDotEnv();

  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return;
  }
  if (args.includes("--list")) {
    for (const p of PROMPTS) console.log(`  ${p.slug.padEnd(15)} ${p.prompt.slice(0, 80)}...`);
    return;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("[ERROR] GOOGLE_API_KEY missing. Add it to .env.local or export it before running.");
    process.exit(1);
  }

  const force = args.includes("--force");
  const slugFilter = args.filter(a => !a.startsWith("--"));
  const tasks = slugFilter.length
    ? PROMPTS.filter(p => slugFilter.includes(p.slug))
    : PROMPTS;

  if (!tasks.length) {
    console.error(`[ERROR] No matching slugs found. Available: ${PROMPTS.map(p => p.slug).join(", ")}`);
    process.exit(1);
  }

  const outDir = path.join(ROOT, "public", "images", "generated");
  await fs.mkdir(outDir, { recursive: true });

  // Available image models from v1beta: nano-banana-pro-preview, gemini-2.5-flash-image,
  // gemini-3.1-flash-image-preview, gemini-3-pro-image-preview
  const model = process.env.GEMINI_IMAGE_MODEL || "nano-banana-pro-preview";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let okCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const { slug, prompt } of tasks) {
    const outPath = path.join(outDir, `${slug}.png`);
    if (!force) {
      try {
        await fs.access(outPath);
        console.log(`[skip] ${slug} (already exists — use --force to regenerate)`);
        skipCount++;
        continue;
      } catch { /* doesn't exist, proceed */ }
    }

    process.stdout.write(`[gen ] ${slug} ... `);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE"] },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.log(`HTTP ${res.status}`);
        console.error(`        ${errText.slice(0, 400)}`);
        failCount++;
        continue;
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const imgPart = parts.find(p => p.inlineData || p.inline_data);
      if (!imgPart) {
        console.log("no image in response");
        console.error(`        response: ${JSON.stringify(data).slice(0, 400)}`);
        failCount++;
        continue;
      }

      const inlineData = imgPart.inlineData ?? imgPart.inline_data;
      const buf = Buffer.from(inlineData.data, "base64");
      await fs.writeFile(outPath, buf);
      const kb = (buf.length / 1024).toFixed(0);
      console.log(`OK (${kb} KB)`);
      okCount++;

      // Light pacing to avoid rate-limit hiccups on free tier
      await new Promise(r => setTimeout(r, 1200));
    } catch (e) {
      console.log(`error`);
      console.error(`        ${e.message}`);
      failCount++;
    }
  }

  console.log("");
  console.log(`Done. generated=${okCount}  skipped=${skipCount}  failed=${failCount}`);
  console.log(`Output: public/images/generated/`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
