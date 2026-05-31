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
  { id: "financials",        label: "Financials & Milestones" },
  { id: "gtm",               label: "Go-to-Market" },
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
          <h3 className="font-bold text-yai-navy text-xl mb-1">How the $360K bought 16 module families</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">
            One chart, every module. The spend curve at the top is what we&rsquo;ve actually paid in Cambodia engineering rates — peaking at ~20 engineers / ~$12K&nbsp;a&nbsp;month. Each row below is a real module: orange = Digitalization built, blue = Agentic layer on top, dark green = Full Ai. Every step right of <strong>TODAY</strong> is value added on the same fixed engineering base.
          </p>
          <RoadmapTimeline mode="spend" />

          {/* Worked example — one module, value across the 3 layers */}
          <h3 className="font-bold text-yai-navy text-xl mb-2 mt-10">Worked example · the Purchasing System</h3>
          <p className="text-sm text-gray-600 mb-5 max-w-3xl">
            One concrete module — built once for ~$4K of salary. Its <strong>capability</strong> (and therefore its value) keeps multiplying as the Ai layers stack on top, without new build cost.
          </p>
          <div className="grid lg:grid-cols-3 gap-3">
            {/* Layer 1 — Digitalization */}
            <div className="rounded-xl border-2 border-yai-orange/40 p-5" style={{ background: "linear-gradient(to bottom, #FFF1E0, #FFFFFF)" }}>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] bg-yai-orange text-white px-2 py-0.5 rounded inline-block">Layer 1 · Digitalization · TODAY</div>
              <h4 className="font-extrabold text-yai-navy text-lg mt-2 leading-tight">Web + Android + iOS purchasing system</h4>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">One-time cost in</div>
                <div className="text-3xl font-extrabold text-yai-orange tabular-nums leading-none mt-1">~$4,050</div>
                <div className="text-[11px] text-gray-500 mt-1">2 devs × 1.5 mo @ $1,200/mo  +  mobile dev @ $450 one-off</div>
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">What was built</div>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  <li>• Web purchase requests + inventory control</li>
                  <li>• Click-to-approve workflow for Accounting</li>
                  <li>• Y Shop function (internal procurement)</li>
                  <li>• Native Android &amp; iOS apps — published</li>
                </ul>
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Replaces</div>
                <p className="text-xs text-gray-600">Paper PR forms, manual signature chase, scattered Excel inventory.</p>
              </div>
            </div>

            {/* Layer 2 — Agentic */}
            <div className="rounded-xl border-2 border-yai-blue/40 p-5 text-white" style={{ background: "linear-gradient(to bottom, #1E4DAA, #2A5DC4)" }}>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] bg-white text-yai-blue px-2 py-0.5 rounded inline-block">Layer 2 · Agentic · ~6 MONTHS IN</div>
              <h4 className="font-extrabold text-lg mt-2 leading-tight">Ai agent on top of the same system</h4>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300">Marginal cost added</div>
                <div className="text-3xl font-extrabold text-amber-300 tabular-nums leading-none mt-1">~$0</div>
                <div className="text-[11px] text-white/75 mt-1">The agent layer is platform-wide — already built once for every module.</div>
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300 mb-1">What it now does</div>
                <ul className="text-xs text-white/95 space-y-0.5">
                  <li>• Suggests POs from usage patterns</li>
                  <li>• Predicts reorders before stock-out</li>
                  <li>• Auto-validates supplier quotes</li>
                  <li>• Voice + chat — &ldquo;order 200m cotton, Khmer&rdquo;</li>
                </ul>
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300 mb-1">Value jump</div>
                <p className="text-xs text-white/85">Same dev cost as before. Output multiplied — purchasing now thinks for itself.</p>
              </div>
            </div>

            {/* Layer 3 — Full Ai */}
            <div className="rounded-xl border-2 border-[#0E3B2E] p-5 text-white" style={{ background: "linear-gradient(to bottom, #0A3327, #1A5742)" }}>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] bg-amber-400 text-[#0A3327] px-2 py-0.5 rounded inline-block">Layer 3 · Full Ai · YEAR 1+</div>
              <h4 className="font-extrabold text-lg mt-2 leading-tight">Hands-free Ai purchasing</h4>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300">Marginal cost added</div>
                <div className="text-3xl font-extrabold text-amber-300 tabular-nums leading-none mt-1">~$0</div>
                <div className="text-[11px] text-white/75 mt-1">A year of clean data + the agent layer above. No new build, no new spend.</div>
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300 mb-1">Now runs itself</div>
                <ul className="text-xs text-white/95 space-y-0.5">
                  <li>• Forecasts demand · orders ahead</li>
                  <li>• Cross-checks 12+ suppliers automatically</li>
                  <li>• Negotiates within rules</li>
                  <li>• Owner just signs off the exceptions</li>
                </ul>
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300 mb-1">Value compound</div>
                <p className="text-xs text-white/85">The $4K built once → autonomous procurement at full Ai. Multiply across every module on the platform.</p>
              </div>
            </div>
          </div>

        </Section>

        {/* 11 — Financials & Milestones */}
        <Section id="financials" kicker={kicker(11, "Financials & Milestones")} title="Financials & 12-Month Milestones">
          <Thesis>
            Profitable path inside 36 months — quarterly milestones laid out on the same timeline.
          </Thesis>

          {/* Forward-looking roadmap — same chart, revenue curve + Year-1 quarterly milestones overlaid */}
          <h3 className="font-bold text-yai-navy text-xl mb-1">The roadmap, forward — every module climbs, revenue follows</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">
            Same timeline as Capital Efficiency, now read forward. The green curve at the top is the revenue trajectory across the Year-1 quarterly milestones (yellow tags). Engineering cost base stays flat — new revenue flows straight to gross margin minus customer success and sales hires.
          </p>
          <RoadmapTimeline mode="revenue" />

          {/* Financial milestone table — three checkpoints */}
          <div className="overflow-x-auto rounded-xl border border-yai-border bg-white mt-8 mb-6">
            <table className="w-full text-sm">
              <thead className="bg-yai-navy text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Metric</th>
                  <th className="px-4 py-3 text-left">Month 12</th>
                  <th className="px-4 py-3 text-left">Month 24</th>
                  <th className="px-4 py-3 text-left">Month 36</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yai-border">
                <tr><td className="px-4 py-3 font-semibold text-yai-navy">Paying customers</td><td className="px-4 py-3">5–15</td><td className="px-4 py-3">25–50</td><td className="px-4 py-3">60–100</td></tr>
                <tr><td className="px-4 py-3 font-semibold text-yai-navy">Revenue mix</td><td className="px-4 py-3 text-sm text-gray-600 italic" colSpan={3}>Weighted toward Starter and Growth in Y1; mix shifts to Enterprise + Agentic in Y2–Y3.</td></tr>
                <tr><td className="px-4 py-3 font-semibold text-yai-navy">ARR (est. range)</td><td className="px-4 py-3 text-gray-400">$TBD</td><td className="px-4 py-3 text-gray-400">$TBD</td><td className="px-4 py-3 text-gray-400">$TBD</td></tr>
                <tr><td className="px-4 py-3 font-semibold text-yai-navy">Cost base</td><td className="px-4 py-3 text-gray-400">$TBD</td><td className="px-4 py-3 text-gray-400">$TBD</td><td className="px-4 py-3 text-gray-400">$TBD</td></tr>
                <tr className="bg-amber-50/60 font-bold">
                  <td className="px-4 py-3">Net</td>
                  <td className="px-4 py-3 text-gray-600">Investment phase</td>
                  <td className="px-4 py-3 text-gray-600">Break-even</td>
                  <td className="px-4 py-3 text-yai-blue">Positive</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-yai-navy text-xl mt-10 mb-3">12-Month Milestones</h3>
          <p className="text-sm text-gray-600 mb-4">Quarterly checkpoints, written down, accountable — pinned to the timeline above.</p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { q: "Q1", title: "Foundation",   items: ["First 3–5 paid contracts closed", "Sales hire onboarded", "Seminar series at full weekly cadence", "Ministry of Environment partnership term sheet"] },
              { q: "Q2", title: "Validation",   items: ["10+ paying customers", "Ministry partnership signed", "First Stage 2 (Agentic) upgrade sold", "Initial regional conversation"] },
              { q: "Q3", title: "Expansion",    items: ["20+ customers", "Regional pilot in conversation", "Customer success function operating", "$TBD revenue milestone"] },
              { q: "Q4", title: "Scale",        items: ["30+ customers", "First Big Rollout (Stage 3) pilot scoped", "Production module commercialisation case ready for investor review", "Year-2 plan locked"] },
            ].map((m) => (
              <Card key={m.q}>
                <div className="text-yai-blue font-bold text-sm mb-2">{m.q}</div>
                <h3 className="font-bold text-yai-navy text-lg mb-2">{m.title}</h3>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  {m.items.map((it) => <li key={it}>• {it}</li>)}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        {/* 12 — GTM */}
        <Section id="gtm" kicker={kicker(12, "Go-to-Market")} title="Go-to-Market Strategy">
          <Thesis>
            Three parallel channels — direct sales, government/institutional, and bottom-up worker adoption — reinforcing each other.
          </Thesis>
          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { num: "CHANNEL 1", title: "Direct sales", bullets: ["Weekly seminar series — owner-targeted, 30–50 attendees", "4-stage funnel: meet → demo → pilot → contract", "Founder-led for Tier A/C; sales hire takes over once pattern lands", "Reference selling — first 2 live factories speak to peers"] },
              { num: "CHANNEL 2", title: "Government & institutional", bullets: ["Ministry of Environment — digital audit module", "ILO Better Work Cambodia — integration potential", "GMAC partnership — member factory channel", "TAFTAC outreach — Cambodia's primary garment association"] },
              { num: "CHANNEL 3", title: "Bottom-up adoption", bullets: ["Free worker mobile app — payslip, attendance, time-off", "Workers ask managers for it, creating organic pressure", "When factory signs up, worker base is already trained", "Differentiated from any top-down ERP roll-out"] },
            ].map((c) => (
              <Card key={c.num}>
                <div className="text-yai-blue text-xs font-bold tracking-wider mb-2">{c.num}</div>
                <h3 className="font-bold text-yai-navy text-lg mb-2">{c.title}</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  {c.bullets.map((b) => <li key={b}>• {b}</li>)}
                </ul>
              </Card>
            ))}
          </div>
          <div className="mt-8 p-5 bg-yai-navy text-white rounded-lg">
            <p className="text-sm leading-relaxed">
              <strong className="text-yai-blue">Why three channels:</strong> Direct sales gives us revenue. Government partnerships give us air cover and free distribution. Bottom-up gives us product-market fit signal and pre-trained users on every floor. Each channel makes the other two cheaper.
            </p>
          </div>
        </Section>

        {/* 13 — Funnel */}
        <Section id="funnel" kicker={kicker(13, "Sales Funnel")} title="Sales Funnel">
          <Thesis>
            From 2,650 factories to 5–20 paying customers in year one — concrete numbers at each stage.
          </Thesis>
          <Funnel />
          <p className="mt-6 text-sm text-gray-600 italic">
            Conservative case: 5 paying customers, year 1. Aggressive case: 20. Both ranges are sustainable given current pipeline velocity (5 meetings booked in first week of structured outreach).
          </p>
        </Section>

        {/* 14 — Traction (with DashboardDemo) */}
        <Section id="traction" kicker={kicker(14, "Traction")} title="Traction & Pilots">
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
        <Section id="competition" kicker={kicker(15, "Competitive Landscape")} title="Competitive Landscape">
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
        <Section id="risks" kicker={kicker(16, "Risks")} title="Risks & Mitigations">
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
        <Section id="resources" kicker={kicker(17, "Resources")} title="Resource Requirements">
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
        <Section id="appendix" kicker={kicker(18, "Appendix")} title="Appendix">
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
