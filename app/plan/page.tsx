import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/plan/Sidebar";
import { Section } from "@/components/plan/Section";
import { Thesis } from "@/components/plan/Thesis";
import { StatCallout } from "@/components/plan/StatCallout";
import { Card, Badge } from "@/components/plan/Card";
import { PlanHero } from "@/components/plan/PlanHero";
import { StageLadder } from "@/components/plan/StageLadder";
import { Funnel } from "@/components/plan/Funnel";
import { ChatDemo } from "@/components/plan/ChatDemo";
import { DashboardDemo } from "@/components/plan/DashboardDemo";
import { HoverImage } from "@/components/plan/HoverImage";
import { PlatformOrbs } from "@/components/plan/PlatformOrbs";
import { PricingStaircase } from "@/components/plan/PricingStaircase";
import { TargetCustomersChart } from "@/components/plan/TargetCustomersChart";
import { TechStackLayers } from "@/components/plan/TechStackLayers";
import { TeamClusters } from "@/components/plan/TeamClusters";
import { RoadmapTimeline } from "@/components/plan/RoadmapTimeline";
import { MilestoneRoadmap } from "@/components/plan/MilestoneRoadmap";
import { BigTechSegment } from "@/components/plan/BigTechSegment";

const NAV: NavItem[] = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "problem",           label: "The Problem" },
  { id: "solution",          label: "The Solution" },
  { id: "architecture",      label: "Product Architecture" },
  { id: "modules",           label: "Agents & Skills" },
  { id: "pricing",           label: "Pricing & Packaging" },
  { id: "customers",         label: "Target Customers" },
  { id: "tech",              label: "Technology Stack" },
  { id: "team",              label: "Team" },
  { id: "capital",           label: "Capital Efficiency" },
  { id: "gtm",               label: "Go-to-Market Milestones" },
  { id: "funnel",            label: "Sales Funnel" },
  { id: "traction",          label: "Traction & Pilots" },
  { id: "competition",       label: "Competitive Landscape" },
  { id: "risks",             label: "Risks & Mitigations" },
  { id: "resources",         label: "Resource Requirements" },
  { id: "appendix",          label: "Appendix" },
];

const kicker = (n: number, label: string) =>
  `${String(n).padStart(2, "0")} / ${label}`;

export default function PlanPage() {
  const session = cookies().get("yai_session")?.value;
  const viewer = verifySession(session);
  if (!viewer) redirect("/");

  return (
    <div className="flex bg-yai-bg min-h-screen">
      <Sidebar items={NAV} viewer={viewer} />

      <main className="flex-1 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
        <PlanHero />

        {/* 01 — Executive Summary */}
        <Section id="executive-summary" kicker={kicker(1, "Executive Summary")} title="Executive Summary">
          <Thesis>
            Factory-tested for 5 years inside live production facilities — Ai MIP is opening its gates to the industry for the first time.
          </Thesis>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCallout value={10} label="Ai agents stand ready" />
            <StatCallout value={20} label="Engineers from Cambodia" flagIcon="/images/cambodia-flag.svg" />
            <StatCallout value={36} suffix=" mo" label="In development" />
            <StatCallout value={40} suffix=" yrs" label="Industry experience (technical + management)" />
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p><strong className="text-yai-navy">What it is.</strong> Yai is <strong className="text-yai-blue">Ai MIP</strong> — Agentic Manufacturing Intelligence. A three-layer platform that modernises your production unit from a whole-paper-based operation into executive Ai. The chaos most factories live in today — <HoverImage src="/images/generated/problem.png" alt="The paper-and-chaos reality Yai replaces" caption="Today's chaos — what Yai replaces.">paper reports and ledger books, scattered chat apps, manual signatures, staff running floor-to-floor chasing approvals, calls and pushes by chat</HoverImage> — is what Yai replaces. The three layers Yai delivers, stacked on top:</p>
            <ol className="ml-2 space-y-3 text-gray-700 list-none">
              <li className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-yai-blue text-white text-xs font-extrabold flex items-center justify-center mt-0.5">1</span>
                <HoverImage
                  src="/images/generated/layer-digitalization.png"
                  alt="Digitalization layer — centralised data flowing in from scanners, sensors, tablets and dashboards"
                  caption="Layer 1: one database, all factory data — scanners, AIoT sensors, mobile apps, tablets."
                >
                  <strong className="text-yai-blue">Digitalization layer</strong> <em className="text-gray-500">(centralised data).</em> Excel dashboards and digital records flow into one database. Barcode &amp; QR scanners, AIoT sensors, mobile apps and tablets — initial workflow streamlining, one source of truth.
                </HoverImage>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-yai-blue text-white text-xs font-extrabold flex items-center justify-center mt-0.5">2</span>
                <HoverImage
                  src="/images/generated/layer-agentic.png"
                  alt="Agentic layer — LLM-powered agents, voice and chat workflows, DTV digital twin, real-time floor guidance"
                  caption="Layer 2: Ai agents own workflows. Voice, chat, DTV, real-time guidance, geo &amp; logistics."
                >
                  <strong className="text-yai-blue">Agentic layer</strong> <em className="text-gray-500">(LLM-powered intelligent agents).</em> Voice-to-workflow processing, text instructions interpreted by LLM, geolocation &amp; logistics optimisation, intuitive dashboards and DTV (Digital Twin Visualisation), real-time Ai guidance for staff — agents refining workflows.
                </HoverImage>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-yai-orange text-white text-xs font-extrabold flex items-center justify-center mt-0.5">3</span>
                <HoverImage
                  src="/images/generated/layer-full-ai.png"
                  alt="Full Ai layer — executive command centre, multi-country expansion, predictive growth"
                  caption="Layer 3: executive command. Multi-factory, multi-country, predictive growth, strategic Ai."
                >
                  <strong className="text-yai-navy">Full Ai layer</strong> <em className="text-gray-500">(strategic management &amp; growth).</em> Higher-level management decision-making, strategic planning with Ai insights, predictive business growth, multi-factory management, business expansion and global growth.
                </HoverImage>
              </li>
            </ol>
          </div>
        </Section>

        {/* 02 — Problem */}
        <Section id="problem" kicker={kicker(2, "The Problem")} title="The Sandwich">
          {/* TOP ROW — Brand + Government */}
          <div className="grid md:grid-cols-2 gap-3 items-start">
            <Card noPadding className="overflow-hidden">
              <div className="px-4 py-2.5">
                <span className="text-yai-blue font-bold text-[10px] tracking-[0.12em] uppercase">Corner 1 &middot; Brand</span>
                <h3 className="font-bold text-yai-navy text-[15px] leading-tight">The brand is upgrading</h3>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/generated/brand-ceo.png" alt="Brand CEO to her board: integrate or be left behind, don't be Nokia." className="w-full h-auto block" />
            </Card>

            <Card noPadding className="overflow-hidden">
              <div className="px-4 py-2.5">
                <span className="text-yai-blue font-bold text-[10px] tracking-[0.12em] uppercase">Corner 2 &middot; Government</span>
                <h3 className="font-bold text-yai-navy text-[15px] leading-tight">The government is mandating</h3>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/generated/government-meeting.png" alt="Ministry of Environment: worker data, EMR reports, tax filings — digital and on time, or penalties." className="w-full h-auto block" />
            </Card>
          </div>

          {/* CENTER — The Owner (sandwiched) */}
          <div className="my-3 flex justify-center">
            <div className="w-full md:w-[calc(50%-0.375rem)]">
              <Card noPadding className="overflow-hidden border-yai-orange shadow-xl">
                <div className="px-4 py-2.5">
                  <span className="text-yai-orange font-bold text-[10px] tracking-[0.12em] uppercase">The Owner &middot; Sandwiched</span>
                  <h3 className="font-bold text-yai-navy text-[15px] leading-tight">Caught in the middle &mdash; ~20 systems, $2M sunk, zero integration</h3>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/generated/boss-meets-yai.png" alt="The factory boss tells the Yai team: nearly 20 systems, $2M spent, none working together." className="w-full h-auto block" />
              </Card>
            </div>
          </div>

          {/* BOTTOM ROW — Management + Staff & Workers */}
          <div className="grid md:grid-cols-2 gap-3 items-start">
            <Card noPadding className="overflow-hidden">
              <div className="px-4 py-2.5">
                <span className="text-yai-blue font-bold text-[10px] tracking-[0.12em] uppercase">Corner 3 &middot; Management</span>
                <h3 className="font-bold text-yai-navy text-[15px] leading-tight">Management hitting the wall</h3>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/generated/management-wall.png" alt="GM overwhelmed by paper and Excel ('there is no way'); Sales on a buyer call ('the buyer won't accept our answer')." className="w-full h-auto block" />
            </Card>

            <Card noPadding className="overflow-hidden">
              <div className="px-4 py-2.5">
                <span className="text-yai-blue font-bold text-[10px] tracking-[0.12em] uppercase">Corner 4 &middot; Staff &amp; Workers</span>
                <h3 className="font-bold text-yai-navy text-[15px] leading-tight">Workers don&apos;t resist change</h3>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/generated/workers-asking-why.png" alt="Workers: software in Chinese not Khmer, every issue means a trip to HR, the same form daily — they've heard another factory uses phones." className="w-full h-auto block" />
            </Card>
          </div>

        </Section>

        {/* 03 — Solution */}
        <Section id="solution" kicker={kicker(3, "The Solution")} title="The Solution — An Ai platform that saves jobs">
          <Thesis>
            One fully integrated platform, left to right — built to upgrade itself as the business progresses.
          </Thesis>
          <div className="space-y-4">
            {[
              {
                tag: "Answers Corner 1 · Brand",
                problem: "“Integrate or we route the order elsewhere — don’t be Nokia.”",
                title: "Buyer-endorsed — don’t reinvent the wheel",
                body: "Brands have already seen Yai and what it does. Their word to suppliers: “We’ve seen Yai — just do it. No need to reinvent the wheel.” You’re not pitching an unknown system; you’re plugging into the integration path buyers already recognise.",
                image: "/images/generated/brand-solution.png?v=3",
                imageAlt: "The same brand boardroom now running on Yai — a room full of seated executives on tablets, a 360° live-meeting camera, a data-rich Manufacturing Intelligence dashboard; the chairwoman: 'Yai covered everything — saved everyone's job.'",
              },
              {
                tag: "Answers Corner 2 · Government",
                problem: "“Worker data, EMR reports, tax filings — digital, on time, or penalties.”",
                title: "Compliance on autopilot",
                body: "Worker records, EMR/environmental reports, and tax filings stay digital by default and submit on time. Penalties avoided; the factory is always audit-ready, not scrambling 24 hours before.",
                image: "/images/generated/government-solution.png?v=3",
                imageAlt: "The Ministry of Environment meeting now on Yai — green-and-white uniforms, a live environment dashboard, officials and factory staff on tablets; the official: 'Such a clear information flow — proud our Cambodian youth built this.'",
              },
              {
                tag: "Answers The Owner · Sandwiched",
                problem: "“~20 systems. $2M sunk. None of them talk to each other.”",
                title: "One platform, not twenty",
                body: "Yai replaces the graveyard of half-baked systems with a single integrated platform — left to right — that upgrades itself as the business grows. It never becomes system #21.",
                highlight: true,
                image: "/images/generated/owner-solution.png?v=2",
                imageAlt: "Mr Chang and his team on a Yai video call with the buyer chairwoman, a world-map expansion graphic on screen. She: 'Ready to expand, Mr Chang?' He: 'I waited so long for one system this simple — yes, ready to open the next factory.'",
              },
              {
                tag: "Answers Corner 3 · Management",
                problem: "“There is no way — the buyer won’t accept our answer.”",
                title: "Management gets its time back",
                body: "Live dashboards replace sprawling spreadsheets; approvals flow through the system instead of floor-to-floor. Sales answers buyers with real-time data, instantly — the ceiling is gone.",
                image: "/images/generated/management-solution.png?v=4",
                imageAlt: "Split screen: manager approving on garment-line screens, 'It's all real-time now' (left); technician configuring a sewing machine via a Yai tablet (right).",
              },
              {
                tag: "Answers Corner 4 · Staff & Workers",
                problem: "“It’s all in Chinese, every issue goes to HR, the same form every day.”",
                title: "Built for the floor",
                body: "Khmer voice, phone-first, no HR detour, no daily paper form. The phone-based way of working the floor team has already been asking for — in their own language.",
                image: "/images/generated/workers-solution.png?v=4",
                imageAlt: "Busy bright floor: operators at machines with mounted screens, supervisors on tablets, andon traffic-lights for defect status, and a driverless cart carrying garment bundles. The four workers' complaints all resolved: Khmer UI, agent-to-HR, no forms, phones for everyone.",
              },
            ].map((s) => (
              <Card key={s.tag} noPadding className={`overflow-hidden ${s.highlight ? "border-yai-orange" : ""}`}>
                <div className="px-4 pt-4 pb-3">
                  <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-gray-400 mb-1">{s.tag}</div>
                  <h3 className={`font-bold text-lg leading-tight ${s.highlight ? "text-yai-orange" : "text-yai-blue"}`}>{s.title}</h3>
                </div>
                {s.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={s.image} alt={s.imageAlt} className="w-full h-auto block" />
                )}
              </Card>
            ))}
          </div>
        </Section>

        {/* 04 — Architecture (with ChatDemo) */}
        <Section id="architecture" kicker={kicker(4, "Architecture")} title="From Paper to Full Ai — Three Yai Layers">
          <Thesis>
            Adopt one layer at a time — each builds on the one below, nothing gets ripped out.
          </Thesis>

          <StageLadder />
        </Section>

        {/* 05 — Modules */}
        <Section id="modules" kicker={kicker(5, "Agents & Skills")} title="The Agents & Their Skills">
          <Thesis>
            The full platform, laid out exactly like the live dashboard — Administration, Management, Operations. Every module is an Ai agent. Tap one to hear what it does.
          </Thesis>

          <PlatformOrbs />

          <div className="mt-12 mb-6">
            <p className="text-xs uppercase tracking-wider font-bold text-yai-blue mb-2">Agents in action</p>
            <h3 className="text-2xl font-bold text-yai-navy mb-4">What a conversation with Yai actually looks like</h3>
            <p className="text-sm text-gray-600 mb-5 max-w-2xl">
              A real interaction: a supervisor asks the Finance agent for the payroll summary, it pulls the data, then prepares the WRAP audit pack on request. No clicking through 12 screens.
            </p>
          </div>
          <ChatDemo />
        </Section>

        {/* 06 — Pricing */}
        <Section id="pricing" kicker={kicker(6, "Pricing & Packaging")} title="Pricing & Packaging">
          <Thesis>
            All great marches start with one step. That step is $120 a year — five key members stepping up to digitalization. Simple tasks lead all the way to Full Ai in one year. Who would have thought this was possible?
          </Thesis>

          <PricingStaircase />
        </Section>

        {/* 07 — Customers */}
        <Section id="customers" kicker={kicker(7, "Target Customers")} title="Target Customers">
          <Thesis>
            Five customer clusters across Cambodia — each climbs a different segment of the Yai ladder, from $120 admin modules to multi-factory Ai.
          </Thesis>
          <TargetCustomersChart />
        </Section>

        {/* 08 — Tech */}
        <Section id="tech" kicker={kicker(8, "Technology")} title="Technology Stack">
          <Thesis>
            Different layer, different stack. Cloud SaaS at Layer 1, model-agnostic LLM agents at Layer 2, own-compute on solar at Layer 3 — each tuned for its job, none locked in.
          </Thesis>
          <TechStackLayers />
        </Section>

        {/* 09 — Team */}
        <Section id="team" kicker={kicker(9, "Team")} title="Team">
          <Thesis>
            20 engineers across 5 specialised clusters — owner-led, factory-embedded. Adding sales and customer success next.
          </Thesis>

          {/* 5 cluster circles (interactive — tap to see each group's experience mix) */}
          <h3 className="font-bold text-yai-navy text-xl mb-1">Engineering — 5 clusters · 20 engineers</h3>
          <p className="text-sm text-gray-600 mb-4">Cambodia-based. Each cluster owns its slice of the platform end-to-end.</p>
          <TeamClusters />
        </Section>

        {/* 10 — Capital Efficiency */}
        <Section id="capital" kicker={kicker(10, "Capital Efficiency")} title="The Capital Efficiency Story">
          <Thesis>
            Built for $360K what would cost $5M–$10M anywhere else. And the same small dollar in compounds upward — at every Ai layer, the value multiplies.
          </Thesis>

          {/* Roadmap timeline — past spend curve + every module climbing the 3 Ai layers */}
          <h3 className="font-bold text-yai-navy text-xl mb-1">How ~$165K built 17 module families</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">
            One chart, every module. The spend curve at the top is what we&rsquo;ve actually paid in Cambodia engineering salaries — team grew from 2 engineers in June 2024 to 20 by early 2026, peaking at ~$12K a month. Each row below is a real module: orange = Digitalization built, blue = Agentic layer on top, dark green = Full Ai. Every step right of <strong>TODAY</strong> is value added on the same fixed engineering base.
          </p>
          <RoadmapTimeline mode="spend" />

        </Section>

        {/* 11 — Go-to-Market Milestones (merged: was 11 Financials + 12 GTM) */}
        <Section id="gtm" kicker={kicker(11, "Go-to-Market Milestones")} title="Go-to-Market Milestones">
          {/* Go-to-Market — per-segment approach with milestones */}
          <h3 className="font-bold text-yai-navy text-xl mt-10 mb-3">Go-to-Market — approach &amp; milestones per segment</h3>
          <p className="text-sm text-gray-600 mb-5">
            Each market segment has its own approach and its own progress. ✓ = done · ◐ = in progress · ○ = planned.
          </p>

          <div className="space-y-5">
            {/* Big-tech segment is interactive — hover a partner card to switch its pathway below */}
            <BigTechSegment />

            {[
              // 2. FACTORIES — Mid-size Cambodia
              {
                tag: "MID-SIZE",
                name: "Mid-size Cambodia factories",
                reachable: "~800",
                color: "#0A3327",
                bg: "#E8F0EC",
                desc: "$120 → $15,000 / yr · Garment, bag, footwear. ~300 may stop at Digitalization, ~500 climb the full ladder to Ai.",
                milestones: [
                  { d: "Q2 2026", t: "3 factories live",                s: "done",     n: "Pilot factories proving the platform on the floor.", sub: ["Yorkmars Cambodia", "Caswell Cambodia", "Yorksky China"] },
                  { d: "Q2 2026", t: "Weekly seminar series launch",   s: "progress", n: "Owner-targeted, 30–50 attendees / week.", sub: ["", "", ""] },
                  { d: "Q2 2026", t: "5 paid contracts closed",         s: "planned",  n: "Cloud Growth tier." },
                  { d: "Q3 2026", t: "Sales hire onboarded",            s: "planned",  n: "Founder-led handover after the pattern lands." },
                  { d: "Q4 2026", t: "15 paying customers",             s: "planned",  n: "Mix of Growth + first Enterprise tier." },
                  { d: "Q1 2027", t: "Reference selling program",       s: "planned",  n: "First 2 live factories speak to peers." },
                  { d: "Q2 2027", t: "30+ customers · Stage-3 pilot",   s: "planned",  n: "Full Ai pilot scoped on best factory." },
                ],
              },
              // 3. GOVERNMENT
              {
                tag: "GOV + INST.",
                name: "Government &amp; Institutional",
                reachable: "~800",
                color: "#1E4DAA",
                bg: "#E8EEF8",
                desc: "Partnership-based · projected biggest cluster. Ministries + industry bodies together.",
                milestones: [
                  { d: "Q4 2025", t: "Minister of Environment meeting", s: "done", n: "Digital Audit collaboration agreed in principle." },
                  { d: "Q1 2026", t: "ASEAN Tech Summit pitch prep",   s: "progress", n: "Minister tasked his advisor to propose Yai for the summit." },
                  { d: "Q2 2026", t: "Ministry of Labour outreach",     s: "planned",  n: "Worker-side compliance + LMS angle." },
                  { d: "Q2 2026", t: "Ministry of Industry outreach",   s: "planned",  n: "Industrial-zone digitalization pitch." },
                  { d: "Q3 2026", t: "Ministry of Telecom / Digital Gov", s: "planned", n: "E-Gov SSO infrastructure angle." },
                  { d: "Q3 2026", t: "ILO Better Work integration",     s: "planned",  n: "Worker-voice + compliance data feed." },
                  { d: "Q3 2026", t: "GMAC partnership formalized",     s: "planned",  n: "Member-factory channel." },
                  { d: "Q4 2026", t: "TAFTAC outreach",                 s: "planned",  n: "Primary garment association." },
                  { d: "Q4 2026", t: "Ministry of Economy / Commerce",  s: "planned",  n: "Investment + export angle." },
                ],
              },
              // 4. OTHERS — Small factories
              {
                tag: "SMALL FACTORIES",
                name: "Small factories",
                reachable: "~200",
                color: "#2D9D9A",
                bg: "#E0F2F1",
                desc: "$750 – $1,200 / yr · Cloud Growth / Enterprise comfort zone. Rarely escalate to dedicated server or Ai.",
                milestones: [
                  { d: "Q3 2026", t: "Cloud Starter packaging",          s: "planned", n: "$120/yr SKU, Khmer-only signup flow." },
                  { d: "Q3 2026", t: "Self-serve onboarding",            s: "planned", n: "Owner can sign up without a sales call." },
                  { d: "Q4 2026", t: "First 30 Starter customers",       s: "planned", n: "Mostly admin modules only." },
                  { d: "Q1 2027", t: "Upgrade path to Growth",           s: "planned", n: "10–20% expected to step up." },
                ],
              },
              // 5. OTHERS — E-commerce
              {
                tag: "E-COM",
                name: "E-commerce cluster — Worker P2P + Marketplaces",
                reachable: "~600 + 100K worker GMV",
                color: "#F37021",
                bg: "#FFF1E0",
                desc: "Mixed pricing across three sub-clusters of online commerce.",
                milestones: [
                  { d: "Q3 2026", t: "Worker P2P marketplace alpha",        s: "planned",  n: "Targeting 100,000 garment workers." },
                  { d: "Q3 2026", t: "ABA + Wing payment rails integrated", s: "progress", n: "Cambodia's two dominant wallets." },
                  { d: "Q4 2026", t: "Service-provider marketplace launch", s: "planned",  n: "~1,000 service providers to factories." },
                  { d: "Q1 2027", t: "First 5,000 active worker sellers",   s: "planned",  n: "Daily-active inside Yai app." },
                  { d: "Q1 2027", t: "Factory supply marketplace beta",     s: "planned",  n: "Yai-curated 100 SKUs at wholesale." },
                  { d: "Q2 2027", t: "First $100K wholesale GMV month",     s: "planned",  n: "Factory Supply line at revenue." },
                ],
              },
              // 6. OTHERS — Non-garment
              {
                tag: "NON-GARMENT",
                name: "Non-garment companies",
                reachable: "~1,000",
                color: "#6D4FB6",
                bg: "#EDE9F5",
                desc: "$120 – $750 / yr · Various industries (hospitality, food, logistics, services) using the admin modules only. Cloud Starter to Cloud Growth.",
                milestones: [
                  { d: "Q4 2026", t: "Admin modules unbundled SKU",      s: "planned", n: "PR / HR / Accounting only — no operations." },
                  { d: "Q1 2027", t: "Hospitality vertical pilot",       s: "planned", n: "Hotel / restaurant chain." },
                  { d: "Q1 2027", t: "Food production vertical pilot",   s: "planned", n: "Adjacent to garment AIoT story." },
                  { d: "Q2 2027", t: "Cross-vertical case study",        s: "planned", n: "Proof of platform versatility." },
                ],
              },
            ].map((seg) => (
              <div key={seg.tag} className="rounded-xl border border-yai-border bg-white">
                {/* Segment header */}
                <div className="flex items-start gap-3 p-4 border-b border-yai-border rounded-t-xl" style={{ background: seg.bg }}>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                        style={{ background: seg.color }}
                      >
                        {seg.tag}
                      </span>
                      <h4 className="font-extrabold text-yai-navy text-base leading-tight" dangerouslySetInnerHTML={{ __html: seg.name }} />
                    </div>
                    <p className="text-xs text-gray-700 leading-snug max-w-3xl">{seg.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500">Reachable</div>
                    <div className="text-lg font-extrabold tabular-nums" style={{ color: seg.color }}>{seg.reachable}</div>
                  </div>
                </div>
                {/* Graphical roadmap at the top */}
                <div className="p-4 pb-2">
                  <MilestoneRoadmap milestones={seg.milestones as never} color={seg.color} />
                </div>

                {/* Milestone detail list — no hover image, no overlap, just clean text */}
                <ul className="px-4 pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-yai-border pt-4">
                  {seg.milestones.map((m: { d: string; t: string; s: string; n?: string; sub?: string[] }, i: number) => {
                    const statusIcon = m.s === "done" ? "✓" : m.s === "progress" ? "◐" : "○";
                    const statusColor = m.s === "done" ? "#10B981" : m.s === "progress" ? "#F37021" : "#94A3B8";
                    return (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white font-extrabold text-[12px] shrink-0"
                          style={{ background: seg.color }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white font-bold text-[9px] shrink-0"
                              style={{ background: statusColor }}
                              title={m.s}
                            >
                              {statusIcon}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{m.d}</span>
                          </div>
                          <div className="font-bold text-yai-navy leading-tight">{m.t}</div>
                          {m.n && <div className="text-gray-600 leading-snug mt-0.5">{m.n}</div>}
                          {m.sub && m.sub.length > 0 && (
                            <ol className="mt-1.5 flex flex-col gap-1">
                              {m.sub.map((s: string, j: number) => (
                                <li key={j} className="flex items-start gap-1.5 text-[11px]">
                                  <span
                                    className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white font-bold text-[9px] shrink-0 mt-0.5"
                                    style={{ background: seg.color }}
                                  >
                                    {j + 1}
                                  </span>
                                  <span className={s ? "text-yai-navy font-semibold" : "text-gray-300 italic"}>
                                    {s || "— to be filled —"}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

        </Section>

        {/* 13 — Funnel */}
        <Section id="funnel" kicker={kicker(12, "Sales Funnel")} title="Sales Funnel">
          <Thesis>
            From 2,650 factories to 5–20 paying customers in year one — concrete numbers at each stage.
          </Thesis>
          <Funnel />
          <p className="mt-6 text-sm text-gray-600 italic">
            Conservative case: 5 paying customers, year 1. Aggressive case: 20. Both ranges are sustainable given current pipeline velocity (5 meetings booked in first week of structured outreach).
          </p>
        </Section>

        {/* 14 — Traction (with DashboardDemo) */}
        <Section id="traction" kicker={kicker(13, "Traction")} title="Traction & Pilots">
          <Thesis>
            This is not a slide-deck startup. Real factories, real workers, real audits — already running on Yai.
          </Thesis>
          <div className="grid sm:grid-cols-4 gap-5 mb-8">
            <StatCallout value={2} orange label="Factories in live production" />
            <StatCallout value={3} orange label="Legacy systems replaced" />
            <StatCallout value={5} orange label="Prospect meetings (week 1)" />
            <StatCallout value={1} suffix="/wk" orange label="Seminar cadence" />
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider font-bold text-yai-blue mb-2">Live dashboard — pilot factory</p>
            <h3 className="text-2xl font-bold text-yai-navy mb-4">What the operating system looks like in production</h3>
            <p className="text-sm text-gray-600 mb-5 max-w-2xl">
              A snapshot from one of the two pilot factories. Workers active today, payroll posted, audit readiness, exception flags, live agent activity feed. This isn&apos;t a mockup — the same numbers our pilot owners see every morning.
            </p>
          </div>
          <DashboardDemo />

          <div className="space-y-4 mt-8">
            <Card>
              <h3 className="font-bold text-yai-navy mb-2">Production pilots — 2 factories live</h3>
              <p className="text-sm text-gray-600">Two factories within the YW Group are running Yai in production, providing continuous fine-tuning signal. Workforce data, compliance evidence, payroll, and admin workflows are all live. Real audits have been run against real evidence captured by Yai.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-yai-navy mb-2">Legacy replacement — 3 systems retired</h3>
              <p className="text-sm text-gray-600">Yai has successfully replaced 3 separate legacy tools across the pilot factories — proving migration competence, not just greenfield capability.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-yai-navy mb-2">Pipeline — 5 prospect meetings in week 1</h3>
              <p className="text-sm text-gray-600">First week of structured outreach yielded 5 prospect meetings with mid-large Cambodian factories. Weekly seminar series is the standing top-of-funnel mechanism.</p>
            </Card>
          </div>
        </Section>

        {/* 15 — Competition */}
        <Section id="competition" kicker={kicker(14, "Competitive Landscape")} title="Competitive Landscape">
          <Thesis>
            No competitor combines Ai-native, apparel-specific, and regionally-priced. Yai is the only one in that quadrant.
          </Thesis>
          <div className="overflow-x-auto rounded-xl border border-yai-border bg-white mb-6">
            <table className="w-full text-sm">
              <thead className="bg-yai-navy text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Player</th>
                  <th className="px-4 py-3 text-left">Strengths</th>
                  <th className="px-4 py-3 text-left">Weaknesses for this segment</th>
                  <th className="px-4 py-3 text-left">Price band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yai-border">
                <tr>
                  <td className="px-4 py-3 font-semibold text-yai-navy">SAP / Oracle</td>
                  <td className="px-4 py-3">Enterprise-grade, audited, mature</td>
                  <td className="px-4 py-3">Too expensive, multi-year implementation, not apparel-specific, not Ai-native</td>
                  <td className="px-4 py-3 whitespace-nowrap">$$$$$ (100k+/yr)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-yai-navy">Odoo</td>
                  <td className="px-4 py-3">Modular, lower cost, open ecosystem</td>
                  <td className="px-4 py-3">Generic ERP, not apparel-tuned, retrofit Ai at best, integrator-dependent</td>
                  <td className="px-4 py-3 whitespace-nowrap">$$$ (20–50k/yr)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-yai-navy">Legacy / in-house</td>
                  <td className="px-4 py-3">Already paid for, factory floor knows it</td>
                  <td className="px-4 py-3">Stale tech, no Ai, vendor risk, can&apos;t keep up with audit demands</td>
                  <td className="px-4 py-3 whitespace-nowrap">$ (sunk + maint.)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-yai-navy">Niche apparel tools</td>
                  <td className="px-4 py-3">Industry-specific in narrow slices</td>
                  <td className="px-4 py-3">Point solutions, not integrated, no Ai agents, no trilingual stack</td>
                  <td className="px-4 py-3 whitespace-nowrap">$$ (per module)</td>
                </tr>
                <tr className="bg-amber-50/60">
                  <td className="px-4 py-3 font-bold text-yai-blue">Yai</td>
                  <td className="px-4 py-3 font-semibold">Ai-native, apparel-specific, trilingual, regional pricing, factory-proven</td>
                  <td className="px-4 py-3">Young brand, regional sales presence still being built</td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold">$$ (segment-fit)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="font-bold text-yai-navy text-xl mb-3">Positioning statement</h3>
          <p className="text-gray-700 leading-relaxed bg-white p-5 rounded-lg border border-yai-border">
            For Cambodian and regional garment factories that need to modernise without absorbing enterprise-software cost or complexity, <strong>Yai is the Ai-native operating system</strong> that — unlike SAP/Oracle (priced out), Odoo (generic), and legacy tools (stale) — was built specifically for how apparel factories actually run, in the languages they actually use.
          </p>
        </Section>

        {/* 18 — Risks */}
        <Section id="risks" kicker={kicker(15, "Risks")} title="Risks & Mitigations">
          <Thesis>
            Honest about where this could go wrong — and what&apos;s in place against each.
          </Thesis>
          <div className="space-y-4">
            {[
              ["Market adoption risk",    "Factories may move slower than projected; budgets are tight, IT change-resistant.", "Three parallel channels (direct, government, bottom-up). Low-cost Stage 1 entry. Reference customers already live."],
              ["Ai cost economics",       "LLM API costs eat margin; token usage scales unpredictably.",                        "Model-agnostic architecture — switch providers as economics shift. Caching, prompt optimisation, and tier-based token allowances. Self-hosted model option for high-volume customers."],
              ["Competitive response",    "SAP, Oracle, or Odoo launch regionally-priced apparel SKUs.",                        "Cost-of-engineering advantage (15–28×). Trilingual + apparel-specific positioning is structural, not feature-based. Established government partnerships create switching cost."],
              ["Investor scope timing",   "Decisions on commercialising production modules slip, delaying revenue.",            "Admin-tier commercialisation is independently viable. Production-tier is upside, not dependency."],
              ["Talent retention",        "Senior engineers poached as Yai&apos;s reputation grows.",                            "Equity participation for key engineers. Strong founder relationships. Cambodia-based team — limited local competition for Ai-native talent at this depth."],
            ].map(([title, risk, mit]) => (
              <Card key={title}>
                <h3 className="font-bold text-yai-navy mb-1">{title}</h3>
                <p className="text-sm text-gray-600 mb-1" dangerouslySetInnerHTML={{ __html: `<strong>Risk:</strong> ${risk}` }} />
                <p className="text-sm text-gray-600"><strong>Mitigation:</strong> {mit}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 19 — Resources */}
        <Section id="resources" kicker={kicker(16, "Resources")} title="Resource Requirements">
          <Thesis>
            What&apos;s needed from the investor over the next 12 months — not a fundraise, a continuation.
          </Thesis>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              ["1. Continuation of current funding rate",  "No step-up in capital required. Maintain current monthly run rate to keep the engineering team intact through the commercialisation phase."],
              ["2. Sales hire budget approval",            "$TBD / year fully loaded for 1–2 apparel-industry sales hires. Specific candidates and economic case to be tabled separately."],
              ["3. Strategic introductions",               "Ministry contacts, brand HQ relationships (Adidas, Levi's, H&M, Uniqlo etc.), buyer compliance teams. Warm introductions short-circuit months of cold outreach."],
              ["4. Ministry partnership sign-off",         "Authority to finalise terms with Ministry of Environment on the digital audit module — non-revenue at ministry level, revenue-generating at factory level."],
              ["5. Expansion conversation in Q3–Q4",       "Based on Q1–Q3 results, structured conversation on (a) regional expansion velocity, (b) production module commercialisation, (c) follow-on investment if warranted."],
              ["6. Brand permission for case studies",     "Approval to use the live pilot factories as named case studies (or carefully anonymised) for sales reference and seminar content."],
            ].map(([k, v]) => (
              <Card key={k}>
                <h3 className="font-bold text-yai-navy mb-2">{k}</h3>
                <p className="text-sm text-gray-600">{v}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 20 — Appendix */}
        <Section id="appendix" kicker={kicker(17, "Appendix")} title="Appendix">
          <Thesis>
            Supporting material — demos, diagrams, references, and contact.
          </Thesis>

          <h3 className="font-bold text-yai-navy text-xl mb-3 mt-6">A1. Demo screenshots</h3>
          <p className="text-sm text-gray-600 mb-4">Live interactive demos are embedded throughout this plan — see Sections 04 (chat agent) and 13 (admin dashboard). Static screenshots below for offline reference.</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Card className="text-center">
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm mb-3">
                [Web dashboard screenshot]<br /><span className="text-xs">public/images/demo-dashboard.png</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">Stage 1 — Admin dashboard</p>
            </Card>
            <Card className="text-center">
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm mb-3">
                [Mobile agentic interface]<br /><span className="text-xs">public/images/demo-mobile.png</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">Stage 2 — Mobile agentic chat</p>
            </Card>
          </div>

          <h3 className="font-bold text-yai-navy text-xl mb-3">A2. Architecture diagrams</h3>
          <Card className="text-center mb-8">
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
              [System architecture diagram]<br /><span className="text-xs">public/images/architecture.png</span>
            </div>
          </Card>

          <h3 className="font-bold text-yai-navy text-xl mb-3">A3. Pilot factory references</h3>
          <details className="bg-white border border-yai-border rounded-lg p-4 mb-2 group">
            <summary className="cursor-pointer font-semibold text-yai-navy list-none">
              <span className="text-yai-blue group-open:rotate-45 inline-block transition-transform mr-2">+</span>
              Pilot factory A (anonymised)
            </summary>
            <div className="mt-3 text-sm text-gray-600 pl-6">
              <p><strong>Size:</strong> TBD workers • <strong>Location:</strong> Cambodia • <strong>Yai modules:</strong> Admin, HR/Payroll, Compliance, Logistics</p>
              <p className="mt-2">Live since TBD. Replaced TBD. Reference call available on request via Gamini K.</p>
            </div>
          </details>
          <details className="bg-white border border-yai-border rounded-lg p-4 mb-6 group">
            <summary className="cursor-pointer font-semibold text-yai-navy list-none">
              <span className="text-yai-blue group-open:rotate-45 inline-block transition-transform mr-2">+</span>
              Pilot factory B (anonymised)
            </summary>
            <div className="mt-3 text-sm text-gray-600 pl-6">
              <p><strong>Size:</strong> TBD • <strong>Modules:</strong> Admin, Finance, HR/Payroll. Reference call available on request.</p>
            </div>
          </details>

          <h3 className="font-bold text-yai-navy text-xl mb-3 mt-8">A4. Founder bio</h3>
          <Card className="mb-8">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-yai-navy">Gamini K</strong> — Director, Texlink Technologies Co., Ltd. (Cambodia). [TODO: 3–5 lines of bio — background, prior ventures, why this product exists]
            </p>
          </Card>

          <h3 className="font-bold text-yai-navy text-xl mb-3">A5. Contact</h3>
          <Card className="bg-yai-navy border-yai-navy text-white">
            <p className="text-sm leading-relaxed">
              <strong className="text-yai-blue">Gamini K</strong><br />
              Director, Texlink Technologies Co., Ltd.<br />
              Email: <a href="mailto:gamini@yaikh.com" className="underline text-yai-blue">gamini@yaikh.com</a><br />
              Web: <a href="https://www.yaikh.com" className="underline text-yai-blue">www.yaikh.com</a><br />
              <span className="text-white/60">Cambodia</span>
            </p>
          </Card>
        </Section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-yai-border text-center text-sm text-gray-500 no-print">
          <p>Confidential — Yai / Texlink Technologies Co., Ltd.</p>
          <p className="mt-1">By accessing this page you agree not to share its contents without permission.</p>
        </footer>
      </main>
    </div>
  );
}
