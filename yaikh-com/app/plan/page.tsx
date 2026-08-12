import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { readSalaryStore } from "@/lib/salary-store";
import { readExpensesStore } from "@/lib/expenses-store";
import { readAboutStore } from "@/lib/about-store";

// Always render fresh — the plan reads live admin data (Sales / Salaries / Capex /
// About) from disk on every request. Without this, Next.js caches the render at
// build time and the public page never reflects admin saves.
export const dynamic = "force-dynamic";
import { Sidebar, type NavItem } from "@/components/plan/Sidebar";
import { Section } from "@/components/plan/Section";
import { AccordionProvider } from "@/components/plan/Accordion";
import { Thesis } from "@/components/plan/Thesis";
import { StatCallout } from "@/components/plan/StatCallout";
import { Card, Badge } from "@/components/plan/Card";
import { PlanHero } from "@/components/plan/PlanHero";
import { StageLadder } from "@/components/plan/StageLadder";
import { ChatDemo } from "@/components/plan/ChatDemo";
import { DashboardDemo } from "@/components/plan/DashboardDemo";
import { HoverImage } from "@/components/plan/HoverImage";
import { PlatformOrbs } from "@/components/plan/PlatformOrbs";
import { PricingStaircase } from "@/components/plan/PricingStaircase";
import { TargetCustomersChart } from "@/components/plan/TargetCustomersChart";
import { TechStackLayers } from "@/components/plan/TechStackLayers";
import { TeamClusters } from "@/components/plan/TeamClusters";
import { TeamOrgChart } from "@/components/plan/TeamOrgChart";
import { RoadmapTimeline } from "@/components/plan/RoadmapTimeline";
import { MilestoneRoadmap } from "@/components/plan/MilestoneRoadmap";
import { BigTechSegment } from "@/components/plan/BigTechSegment";
import { FactoryModuleMatrix } from "@/components/plan/FactoryModuleMatrix";
import { GtmEnablerBar } from "@/components/plan/GtmEnablerBar";
import { EventCalendar } from "@/components/plan/EventCalendar";
import { SalesTeamProfile } from "@/components/plan/SalesTeamProfile";
import { SalesProcessFlow } from "@/components/plan/SalesProcessFlow";
import { CompetitiveLandscape } from "@/components/plan/CompetitiveLandscape";
import { LiveBudgetSummary } from "@/components/plan/LiveBudgetSummary";
import { MidSizeSegment } from "@/components/plan/MidSizeSegment";
import { InteractiveSegment } from "@/components/plan/InteractiveSegment";
import { FloatingGlass } from "@/components/plan/FloatingGlass";
import { BodyTranslator } from "@/components/plan/BodyTranslator";
import { PrintCover } from "@/components/plan/PrintCover";
import { PrintEndPage } from "@/components/plan/PrintEndPage";

const NAV: NavItem[] = [
  { id: "executive-summary", label: "Executive Summary",     labelKey: "nav.executive" },
  { id: "problem",           label: "The Problem",            labelKey: "nav.problem" },
  { id: "solution",          label: "The Solution",           labelKey: "nav.solution" },
  { id: "architecture",      label: "Product Architecture",   labelKey: "nav.architecture" },
  { id: "tech",              label: "Technology Stack",       labelKey: "nav.tech" },
  { id: "modules",           label: "Agents & Skills",        labelKey: "nav.modules" },
  { id: "pricing",           label: "Pricing & Packaging",    labelKey: "nav.pricing" },
  {
    id: "customers",
    label: "Target Customers",
    labelKey: "nav.customers",
    children: [
      { id: "customer-digital-audit",   label: "Digital Audit" },
      { id: "customer-yqms",            label: "YQMS" },
      { id: "customer-cost-efficiency", label: "Cost and Efficiency" },
      { id: "customer-yahr",            label: "YAHR" },
    ],
  },
  { id: "gtm",               label: "Go-to-Market Milestones", labelKey: "nav.gtm" },
  { id: "team",              label: "Team",                   labelKey: "nav.team" },
  { id: "oc-budget",         label: "OC & Live Budget Update", labelKey: "nav.oc_budget" },
  { id: "capital",           label: "Capital Efficiency",     labelKey: "nav.capital" },
  { id: "traction",          label: "Traction & Pilots",      labelKey: "nav.traction" },
  { id: "competition",       label: "Competitive Landscape",  labelKey: "nav.competition" },
  { id: "risks",             label: "Risks & Mitigations",    labelKey: "nav.risks" },
  { id: "resources",         label: "Resource Requirements",  labelKey: "nav.resources" },
  { id: "appendix",          label: "About Yai",              labelKey: "nav.appendix" },
];

const kicker = (n: number, label: string) =>
  `${String(n).padStart(2, "0")} / ${label}`;

/* RoadmapTimeline expects 13 quarter columns: Q2'24 → Q2'27 (Q2'24 is where real
 * salary data starts — Rich + Virot + Dilan paid May+Jun 2024).
 * Forecast formula for quarters past TODAY (Q2'26): each row's last-2-actual-quarters average.
 * Headcount = members with any non-zero monthly cell in that quarter. */
const CHART_QUARTERS = [
  { y: 2024, q: 2, months: ["2024-04", "2024-05", "2024-06"] },
  { y: 2024, q: 3, months: ["2024-07", "2024-08", "2024-09"] },
  { y: 2024, q: 4, months: ["2024-10", "2024-11", "2024-12"] },
  { y: 2025, q: 1, months: ["2025-01", "2025-02", "2025-03"] },
  { y: 2025, q: 2, months: ["2025-04", "2025-05", "2025-06"] },
  { y: 2025, q: 3, months: ["2025-07", "2025-08", "2025-09"] },
  { y: 2025, q: 4, months: ["2025-10", "2025-11", "2025-12"] },
  { y: 2026, q: 1, months: ["2026-01", "2026-02", "2026-03"] },
  { y: 2026, q: 2, months: ["2026-04", "2026-05", "2026-06"] },
  { y: 2026, q: 3, months: ["2026-07", "2026-08", "2026-09"] },
  { y: 2026, q: 4, months: ["2026-10", "2026-11", "2026-12"] },
  { y: 2027, q: 1, months: ["2027-01", "2027-02", "2027-03"] },
  { y: 2027, q: 2, months: ["2027-04", "2027-05", "2027-06"] },
];
const TODAY_INDEX = 8; // Q2'26 = 0-based index 8 in the 13-quarter array

async function computeRoadmapData() {
  const [salaries, expenses] = await Promise.all([readSalaryStore(), readExpensesStore()]);
  // Per-quarter salary sum (active members only, matches /admin/salaries quarterly view)
  const salaryByQ: number[] = CHART_QUARTERS.map((q) =>
    salaries.members
      .filter((m) => m.status === "active")
      .reduce<number>((s, m) => s + q.months.reduce<number>((ss, ym) => ss + (m.monthly[ym] ?? 0), 0), 0)
  );
  // Per-row forecast (avg of last 2 non-zero actuals) — only used for forecast quarters
  const memberForecasts: number[] = salaries.members
    .filter((m) => m.status === "active")
    .map((m) => {
      const actuals: number[] = [];
      for (let qi = 0; qi <= TODAY_INDEX; qi++) {
        const s = CHART_QUARTERS[qi].months.reduce<number>((ss, ym) => ss + (m.monthly[ym] ?? 0), 0);
        if (s > 0) actuals.push(s);
      }
      const last2 = actuals.slice(-2);
      return last2.length ? last2.reduce((a, b) => a + b, 0) / last2.length : 0;
    });
  const forecastQuarter = memberForecasts.reduce((a, b) => a + b, 0);
  // Fill forecast quarters where no actual data exists
  for (let qi = TODAY_INDEX + 1; qi < CHART_QUARTERS.length; qi++) {
    if (salaryByQ[qi] === 0) salaryByQ[qi] = forecastQuarter;
  }
  // Per-quarter expense sum (all categories × all items)
  const expenseByQ: number[] = CHART_QUARTERS.map((q) =>
    expenses.categories.reduce<number>(
      (s, c) =>
        s +
        c.items.reduce<number>(
          (ss, it) => ss + q.months.reduce<number>((sss, ym) => sss + (it.monthly[ym]?.amount ?? 0), 0),
          0
        ),
      0
    )
  );
  // Combined spend in $K
  const quarterlySpendK = salaryByQ.map((s, i) => Math.round((s + expenseByQ[i]) / 1000));
  // Headcount per quarter = members with any non-zero cell that quarter
  const headcount: number[] = CHART_QUARTERS.map((q) =>
    salaries.members.filter(
      (m) => m.status === "active" && q.months.some((ym) => (m.monthly[ym] ?? 0) > 0)
    ).length
  );
  // Pad forecast headcount with the current quarter's count if zero
  const lastHC = headcount[TODAY_INDEX] || Math.max(...headcount);
  for (let qi = TODAY_INDEX + 1; qi < headcount.length; qi++) {
    if (headcount[qi] === 0) headcount[qi] = lastHC;
  }
  return { quarterlySpendK, headcount };
}

export default async function PlanPage() {
  const session = cookies().get("yai_session")?.value;
  const viewer = verifySession(session);
  if (!viewer) redirect("/");

  const roadmap = await computeRoadmapData();
  const about = await readAboutStore();

  return (
    <>
      {/* Print-only cover — outside <main> so it can fill its own page
       *  without inheriting main's max-width + flex constraints. */}
      <PrintCover />
    <AccordionProvider>
    <div className="flex bg-yai-bg min-h-screen">
      <Sidebar items={NAV} viewer={viewer} />

      <FloatingGlass />

      <main className="flex-1 max-w-4xl px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
        <BodyTranslator />
        <PlanHero />

        {/* 01 — Executive Summary */}
        <Section id="executive-summary" kicker={kicker(1, "Executive Summary")} title="Executive Summary" collapsible>
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
        <Section id="problem" kicker={kicker(2, "The Problem")} title="The Sandwich" collapsible>
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
        <Section id="solution" kicker={kicker(3, "The Solution")} title="The Solution — An Ai Platform that Saves Jobs" collapsible>
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
        <Section id="architecture" kicker={kicker(4, "Architecture")} title="From Paper to Full Ai — Three Yai Layers" collapsible>
          <Thesis>
            Adopt one layer at a time — each builds on the one below, nothing gets ripped out.
          </Thesis>

          <StageLadder />
        </Section>

        {/* 05 — Tech */}
        <Section id="tech" kicker={kicker(5, "Technology")} title="Technology Stack" collapsible>
          <Thesis>
            Different layer, different stack. Cloud SaaS at Layer 1, model-agnostic LLM agents at Layer 2, own-compute on solar at Layer 3 — each tuned for its job, none locked in.
          </Thesis>
          <TechStackLayers />
        </Section>

        {/* 06 — Modules */}
        <Section id="modules" kicker={kicker(6, "Agents & Skills")} title="The Agents & Their Skills" collapsible>
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

        {/* 07 — Pricing */}
        <Section id="pricing" kicker={kicker(7, "Pricing & Packaging")} title="Pricing & Packaging" collapsible>
          <Thesis>
            All great marches start with one step. That step is $120 a year — five key members stepping up to digitalization. Simple tasks lead all the way to Full Ai in one year. Who would have thought this was possible?
          </Thesis>

          <PricingStaircase />
        </Section>

        {/* 08 — Customers */}
        <Section id="customers" kicker={kicker(8, "Target Customers")} title="Target Customers" collapsible>
          <Thesis>
            Five customer clusters across Cambodia — each climbs a different segment of the Yai ladder, from $120 admin modules to multi-factory Ai.
          </Thesis>
          <TargetCustomersChart />
        </Section>

        {/* 08.1 — 08.4 · Per-cluster deep dives, empty for now. */}
        <Section id="customer-digital-audit"   kicker={kicker(8, "Target Customers · 08.1")} title="Digital Audit" collapsible>
          <p className="text-sm text-gray-500 italic">Content coming.</p>
        </Section>
        <Section id="customer-yqms"            kicker={kicker(8, "Target Customers · 08.2")} title="YQMS" collapsible>
          <p className="text-sm text-gray-500 italic">Content coming.</p>
        </Section>
        <Section id="customer-cost-efficiency" kicker={kicker(8, "Target Customers · 08.3")} title="Cost and Efficiency" collapsible>
          <p className="text-sm text-gray-500 italic">Content coming.</p>
        </Section>
        <Section id="customer-yahr"            kicker={kicker(8, "Target Customers · 08.4")} title="YAHR" collapsible>
          <p className="text-sm text-gray-500 italic">Content coming.</p>
        </Section>

        {/* 09 — Go-to-Market Milestones (merged: was 11 Financials + 12 GTM) */}
        <Section id="gtm" kicker={kicker(9, "Go-to-Market Milestones")} title="Go-to-Market Milestones" collapsible>
          {/* GTM foundation — 3 things needed before / alongside the per-segment milestones */}
          <h3 className="font-bold text-yai-navy text-xl mb-3">GTM foundation — what makes the milestones possible</h3>
          <p className="text-sm text-gray-600 mb-5 max-w-3xl">
            Three enablers sit underneath every segment milestone below. Without these, even a good
            segment plan stalls.
          </p>
          <div className="space-y-3 mb-10">
            <GtmEnablerBar
              num="01"
              tag="OFFLINE"
              title="Exhibitions &amp; Events (Offline)"
              desc="Cambodia is still a relationship-first market. Owner-trust gets built face-to-face — trade shows, GMAC / TAFTAC events, ministry summits. Yai needs a physical presence where decision-makers gather, not just an online funnel."
              color="#1E4DAA"
              bg="#E8EEF8"
              badge="Trade shows · summits"
              badgeLabel="Channel"
            >
              <EventCalendar />
            </GtmEnablerBar>
            <GtmEnablerBar
              num="02"
              tag="TEAM"
              title="Marketing &amp; Sales Personnel"
              desc="5 sales people · 60% factory-industry experience · 30% presentation + training · 10% software / Ai-native. Mindset-shift work: convincing factory mid + top mgmt to step up through Digitalization → Agentic → Full Ai. All Claude Code 101 certified."
              color="#1E4DAA"
              bg="#E8EEF8"
              badge="5 hired · CC 101"
              badgeLabel="Team"
            >
              <SalesTeamProfile />
            </GtmEnablerBar>
            <GtmEnablerBar
              id="sales-approaches"
              num="03"
              tag="PROCESS"
              title="Sales approaches"
              desc="Primary funnel: printed invitation → weekly 15-20 min online demo → on-site in-person presentation → package commitment ($120 / $750 / $1,000+). Parallel channels: government top-down, app user growth (2.5K → 100K), word of mouth, non-garment expansion."
              color="#1E4DAA"
              bg="#E8EEF8"
              badge="4-step + 5 channels"
              badgeLabel="Funnel"
            >
              <SalesProcessFlow />
            </GtmEnablerBar>
          </div>

          {/* Go-to-Market — per-segment approach with milestones */}
          <h3 className="font-bold text-yai-navy text-xl mt-10 mb-3">Go-to-Market — approach &amp; milestones per segment</h3>
          <p className="text-sm text-gray-600 mb-5">
            Each market segment has its own approach and its own progress. ✓ = done · ◐ = in progress · ○ = planned.
          </p>

          <div className="space-y-5">
            {/* Big-tech segment is interactive — hover a partner card to switch its pathway below */}
            <BigTechSegment />

            {/* Mid-size segment is interactive — cohorts of 3 factories, hover any factory for its pathway */}
            <MidSizeSegment />

            {/* 3. GOVERNMENT + INSTITUTIONAL — interactive */}
            <InteractiveSegment
              tag="GOV + INST."
              name="Government &amp; Institutional"
              reachable="~800"
              color="#1E4DAA"
              bg="#E8EEF8"
              desc="Partnership-based · projected biggest cluster. Ministries + industry bodies together."
              topics={[
                {
                  num: "01", d: "Q4 2025", t: "Minister of Environment", s: "done",
                  n: "Digital Audit collaboration agreed in principle.",
                  pathway: [
                    { d: "Q3 2025", t: "01 · Introduction via mutual contact",   s: "done",     n: "Initial briefing on Digital Audit concept." },
                    { d: "Q4 2025", t: "02 · Direct meeting with Minister",      s: "done",     n: "Pitch delivered, principle of collaboration agreed." },
                    { d: "Q1 2026", t: "03 · Joint scope-of-work document",      s: "progress", n: "Ministry team + Yai aligning audit fields." },
                    { d: "Q2 2026", t: "04 · Pilot Digital Audit programme",     s: "planned",  n: "First 10 factories audited under the scheme." },
                    { d: "Q3 2026", t: "05 · Joint public launch",               s: "planned",  n: "Press event + co-branded landing page." },
                    { d: "Q4 2026", t: "06 · National rollout to 100 factories", s: "planned",  n: "Scale-up across Cambodia." },
                  ],
                },
                {
                  num: "02", d: "Q1 2026", t: "ASEAN Tech Summit pitch", s: "progress",
                  n: "Minister tasked his advisor to propose Yai for the summit.",
                  pathway: [
                    { d: "Q4 2025", t: "01 · Advisor brief on Yai platform",   s: "done",     n: "One-pager + demo video shared." },
                    { d: "Q1 2026", t: "02 · Deck + booth design draft",       s: "progress", n: "Working with advisor's team." },
                    { d: "Q1 2026", t: "03 · Demo scenario locked",            s: "planned",  n: "Live floor demo from Yorkmars pilot data." },
                    { d: "Q2 2026", t: "04 · Speaking slot confirmed",         s: "planned",  n: "Founder on-stage 15-min slot." },
                    { d: "Q2 2026", t: "05 · Summit appearance + booth",       s: "planned",  n: "Lead capture from international delegates." },
                    { d: "Q3 2026", t: "06 · Post-summit press + follow-ups",  s: "planned",  n: "Convert summit leads → pilots." },
                  ],
                },
                {
                  num: "03", d: "Q2 2026", t: "Ministry of Labour", s: "planned",
                  n: "Worker-side compliance + LMS angle.",
                  pathway: [
                    { d: "Q1 2026", t: "01 · Research labour-data needs",        s: "planned", n: "Map LMS gaps and reporting pain." },
                    { d: "Q2 2026", t: "02 · Initial meeting via GMAC intro",    s: "planned", n: "Position Yai worker-app as compliance feed." },
                    { d: "Q3 2026", t: "03 · 5-factory pilot proposal",          s: "planned", n: "Worker-side payslip + LMS API." },
                    { d: "Q4 2026", t: "04 · Pilot deployed",                    s: "planned", n: "Compliance dashboard for Ministry." },
                  ],
                },
                {
                  num: "04", d: "Q2 2026", t: "Ministry of Industry", s: "planned",
                  n: "Industrial-zone digitalization pitch.",
                  pathway: [
                    { d: "Q1 2026", t: "01 · SEZ-digitalization brief drafted",  s: "planned", n: "Targeted at Bavet + PPSEZ." },
                    { d: "Q2 2026", t: "02 · Initial meeting + demo",            s: "planned", n: "MoI senior officials." },
                    { d: "Q3 2026", t: "03 · SEZ-pilot MoU",                     s: "planned", n: "Subsidised platform for SEZ tenants." },
                    { d: "Q4 2026", t: "04 · First SEZ rollout",                 s: "planned", n: "10 factories live inside one SEZ." },
                  ],
                },
                {
                  num: "05", d: "Q3 2026", t: "Ministry of Telecom / Digital Gov", s: "planned",
                  n: "E-Gov SSO infrastructure angle.",
                  pathway: [
                    { d: "Q2 2026", t: "01 · E-Gov SSO integration brief",       s: "planned", n: "Yai logs in via national digital identity." },
                    { d: "Q3 2026", t: "02 · Technical alignment meeting",       s: "planned", n: "OAuth / OIDC spec walkthrough." },
                    { d: "Q4 2026", t: "03 · Sandbox SSO connection",            s: "planned", n: "Yai becomes a recognised relying party." },
                    { d: "Q1 2027", t: "04 · Production SSO live",               s: "planned", n: "Citizens log in to Yai with national ID." },
                  ],
                },
                {
                  num: "06", d: "Q3 2026", t: "ILO Better Work", s: "planned",
                  n: "Worker-voice + compliance data feed.",
                  pathway: [
                    { d: "Q2 2026", t: "01 · Better Work team intro",            s: "planned", n: "Via existing GMAC + IFC contacts." },
                    { d: "Q3 2026", t: "02 · Data-spec alignment",               s: "planned", n: "Worker-voice signals + compliance KPIs." },
                    { d: "Q4 2026", t: "03 · Pilot in 3 Better Work factories",  s: "planned", n: "Anonymous voice channel inside worker app." },
                    { d: "Q2 2027", t: "04 · Programme-wide rollout",            s: "planned", n: "All Better Work Cambodia factories." },
                  ],
                },
                {
                  num: "07", d: "Q3 2026", t: "GMAC partnership", s: "planned",
                  n: "Member-factory channel — primary garment association.",
                  pathway: [
                    { d: "Q2 2026", t: "01 · Board-meeting pitch slot",          s: "planned", n: "Member-benefit framing." },
                    { d: "Q3 2026", t: "02 · MoU draft circulated",              s: "planned", n: "Member-pricing terms negotiated." },
                    { d: "Q3 2026", t: "03 · MoU signed",                        s: "planned", n: "Yai endorsed as preferred digital platform." },
                    { d: "Q4 2026", t: "04 · Member newsletter feature",         s: "planned", n: "Drive inbound from member factories." },
                    { d: "Q1 2027", t: "05 · 20 GMAC members signed up",         s: "planned", n: "Channel-driven pipeline locked." },
                  ],
                },
                {
                  num: "08", d: "Q4 2026", t: "TAFTAC outreach", s: "planned",
                  n: "Footwear + travel-goods association — sister to GMAC.",
                  pathway: [
                    { d: "Q3 2026", t: "01 · Initial introduction",              s: "planned", n: "Via shared GMAC contacts." },
                    { d: "Q4 2026", t: "02 · Joint member-training event",       s: "planned", n: "Yai demo to footwear members." },
                    { d: "Q1 2027", t: "03 · Co-branded landing page",           s: "planned", n: "Member-discount funnel." },
                    { d: "Q2 2027", t: "04 · First 10 TAFTAC members live",      s: "planned", n: "Footwear-vertical case studies." },
                  ],
                },
                {
                  num: "09", d: "Q4 2026", t: "Ministry of Economy / Commerce", s: "planned",
                  n: "Investment + export angle.",
                  pathway: [
                    { d: "Q3 2026", t: "01 · Investment-promotion deck",         s: "planned", n: "Yai as digital infrastructure for FDI factories." },
                    { d: "Q4 2026", t: "02 · First meeting",                     s: "planned", n: "MoC export-readiness team." },
                    { d: "Q1 2027", t: "03 · Export-readiness pilot",            s: "planned", n: "Yai integrated into MoC's export-cert flow." },
                    { d: "Q2 2027", t: "04 · Trade-mission inclusion",           s: "planned", n: "Yai on Cambodia tech-trade delegations." },
                  ],
                },
              ]}
            />

            {/* 4. SMALL FACTORIES — interactive */}
            <InteractiveSegment
              tag="SMALL FACTORIES"
              name="Small factories"
              reachable="~200"
              color="#2D9D9A"
              bg="#E0F2F1"
              desc="$120 – $1,200 / yr · Cloud Starter / Growth comfort zone. Rarely escalate to dedicated server or full Ai."
              topics={[
                {
                  num: "01", d: "Q3 2026", t: "Cloud Starter packaging", s: "planned",
                  n: "$120/yr SKU, Khmer-only signup flow.",
                  pathway: [
                    { d: "Q2 2026", t: "01 · SKU + pricing finalised",        s: "planned", n: "$120/yr, admin-only bundle." },
                    { d: "Q2 2026", t: "02 · Khmer signup flow built",        s: "planned", n: "No English fallback — Khmer-first." },
                    { d: "Q3 2026", t: "03 · Khmer onboarding videos",        s: "planned", n: "10-min video per module." },
                    { d: "Q3 2026", t: "04 · Public launch",                  s: "planned", n: "Promo via seminar series + Telegram." },
                  ],
                },
                {
                  num: "02", d: "Q3 2026", t: "Self-serve onboarding", s: "planned",
                  n: "Owner can sign up without a sales call.",
                  pathway: [
                    { d: "Q2 2026", t: "01 · Signup-flow UX design",          s: "planned", n: "Owner-led, no-sales-call path." },
                    { d: "Q3 2026", t: "02 · In-app guided tour",             s: "planned", n: "First-login walkthrough." },
                    { d: "Q3 2026", t: "03 · Auto-provision first modules",   s: "planned", n: "PR + HR + Accounting auto-enabled." },
                    { d: "Q4 2026", t: "04 · First 100 self-serve owners",    s: "planned", n: "Onboarding without human touch." },
                  ],
                },
                {
                  num: "03", d: "Q4 2026", t: "First 30 Starter customers", s: "planned",
                  n: "Mostly admin modules only.",
                  pathway: [
                    { d: "Q3 2026", t: "01 · Seminar-attendee conversion",    s: "planned", n: "5-10 from weekly seminar." },
                    { d: "Q4 2026", t: "02 · Mid-size owner referrals",       s: "planned", n: "Word-of-mouth from anchor accounts." },
                    { d: "Q4 2026", t: "03 · First 30 paying customers",      s: "planned", n: "Cloud Starter revenue line live." },
                    { d: "Q1 2027", t: "04 · Cohort retention analysis",      s: "planned", n: "90-day retention measured." },
                  ],
                },
                {
                  num: "04", d: "Q1 2027", t: "Upgrade path to Growth", s: "planned",
                  n: "10–20% expected to step up.",
                  pathway: [
                    { d: "Q4 2026", t: "01 · In-app upgrade prompts",         s: "planned", n: "Surface ops modules to Starter users." },
                    { d: "Q1 2027", t: "02 · Free trial of Growth modules",   s: "planned", n: "14-day Growth tier sampler." },
                    { d: "Q1 2027", t: "03 · First 5 Starter→Growth upgrades", s: "planned", n: "Validate the upgrade funnel." },
                    { d: "Q2 2027", t: "04 · 10-20% conversion sustained",    s: "planned", n: "Funnel matures." },
                  ],
                },
              ]}
            />

            {/* 5. E-COMMERCE — interactive */}
            <InteractiveSegment
              tag="E-COM"
              name="E-commerce cluster — Worker P2P + Marketplaces"
              reachable="~600 + 100K worker GMV"
              color="#F37021"
              bg="#FFF1E0"
              desc="Mixed pricing across three sub-clusters of online commerce — Worker P2P, Service Providers, Factory Supply."
              topics={[
                {
                  num: "01", d: "Q3 2026", t: "Worker P2P marketplace alpha", s: "planned",
                  n: "Targeting 100,000 garment workers.",
                  pathway: [
                    { d: "Q2 2026", t: "01 · Worker-app marketplace UX",       s: "planned", n: "Listing + buy + chat flows." },
                    { d: "Q3 2026", t: "02 · Internal alpha testing",          s: "planned", n: "100 staff + Yorkmars workers." },
                    { d: "Q3 2026", t: "03 · First 1,000 worker sellers",      s: "planned", n: "Seed the supply side." },
                    { d: "Q4 2026", t: "04 · Public alpha launch",             s: "planned", n: "Open to all worker-app users." },
                  ],
                },
                {
                  num: "02", d: "Q1 2026", t: "ABA + Wing payment rails", s: "progress",
                  n: "Cambodia's two dominant wallets.",
                  pathway: [
                    { d: "Q4 2025", t: "01 · ABA payroll API integration",     s: "done",     n: "Direct disbursement live." },
                    { d: "Q4 2025", t: "02 · Wing wallet integration",         s: "done",     n: "Worker mobile-money receive live." },
                    { d: "Q2 2026", t: "03 · Worker-app payslip surface",      s: "progress", n: "Workers see payment land in-app." },
                    { d: "Q3 2026", t: "04 · P2P transfers between workers",   s: "planned",  n: "Worker-to-worker money movement." },
                    { d: "Q4 2026", t: "05 · Marketplace settlement layer",    s: "planned",  n: "Buy / sell settles via ABA / Wing." },
                  ],
                },
                {
                  num: "03", d: "Q4 2026", t: "Service-provider marketplace", s: "planned",
                  n: "~1,000 service providers to factories.",
                  pathway: [
                    { d: "Q3 2026", t: "01 · Provider directory built",        s: "planned", n: "Categorised: maintenance, legal, logistics, training." },
                    { d: "Q4 2026", t: "02 · First 100 providers onboarded",   s: "planned", n: "Seeded from existing factory vendors." },
                    { d: "Q4 2026", t: "03 · Booking + payment flow",          s: "planned", n: "Factory books, escrow-style payment." },
                    { d: "Q1 2027", t: "04 · Public launch",                   s: "planned", n: "Open to all factory users." },
                  ],
                },
                {
                  num: "04", d: "Q1 2027", t: "5,000 active worker sellers", s: "planned",
                  n: "Daily-active inside Yai app.",
                  pathway: [
                    { d: "Q4 2026", t: "01 · Worker-incentive programme",      s: "planned", n: "Bonus credits for first listing." },
                    { d: "Q1 2027", t: "02 · Listing tooling — photo + price", s: "planned", n: "Phone-camera listing in 60 sec." },
                    { d: "Q1 2027", t: "03 · First 1,000 active sellers",      s: "planned", n: "Activity defined: 1+ sale / month." },
                    { d: "Q2 2027", t: "04 · 5,000 active sellers",            s: "planned", n: "Marketplace flywheel turning." },
                  ],
                },
                {
                  num: "05", d: "Q1 2027", t: "Factory supply marketplace", s: "planned",
                  n: "Yai-curated 100 SKUs at wholesale.",
                  pathway: [
                    { d: "Q4 2026", t: "01 · SKU curation — 100 items",        s: "planned", n: "Thread, needles, packaging, PPE." },
                    { d: "Q1 2027", t: "02 · Wholesale pricing locked",        s: "planned", n: "Yai negotiates supplier terms." },
                    { d: "Q1 2027", t: "03 · First 10 factories ordering",     s: "planned", n: "Anchor demand." },
                    { d: "Q2 2027", t: "04 · Public beta",                     s: "planned", n: "Open to all factory accounts." },
                  ],
                },
                {
                  num: "06", d: "Q2 2027", t: "$100K wholesale GMV month", s: "planned",
                  n: "Factory Supply line at revenue.",
                  pathway: [
                    { d: "Q1 2027", t: "01 · $10K month",                      s: "planned", n: "First proof of demand." },
                    { d: "Q1 2027", t: "02 · $50K month",                      s: "planned", n: "Repeat ordering established." },
                    { d: "Q2 2027", t: "03 · $100K month",                     s: "planned", n: "Factory Supply at revenue." },
                    { d: "Q3 2027", t: "04 · $250K month",                     s: "planned", n: "Material revenue line." },
                  ],
                },
              ]}
            />

            {/* 6. NON-GARMENT — interactive */}
            <InteractiveSegment
              tag="NON-GARMENT"
              name="Non-garment companies"
              reachable="~1,000"
              color="#6D4FB6"
              bg="#EDE9F5"
              desc="$120 – $750 / yr · Various industries (hospitality, food, logistics, services) using the admin modules only. Cloud Starter to Cloud Growth."
              topics={[
                {
                  num: "01", d: "Q4 2026", t: "Admin modules unbundled SKU", s: "planned",
                  n: "PR / HR / Accounting only — no operations.",
                  pathway: [
                    { d: "Q3 2026", t: "01 · SKU spec finalised",             s: "planned", n: "Admin-only bundle without ops modules." },
                    { d: "Q4 2026", t: "02 · Pricing tier set",               s: "planned", n: "$120 / $300 / $750 per year tiers." },
                    { d: "Q4 2026", t: "03 · Marketing site updated",         s: "planned", n: "Non-garment landing page + use cases." },
                    { d: "Q1 2027", t: "04 · Public launch",                  s: "planned", n: "Open signup for any industry." },
                  ],
                },
                {
                  num: "02", d: "Q1 2027", t: "Hospitality vertical pilot", s: "planned",
                  n: "Hotel / restaurant chain.",
                  pathway: [
                    { d: "Q4 2026", t: "01 · First hotel partner identified", s: "planned", n: "Boutique chain — 3 properties." },
                    { d: "Q1 2027", t: "02 · Hospitality-specific config",    s: "planned", n: "Shift-based payroll + tip handling." },
                    { d: "Q1 2027", t: "03 · 3-property pilot live",          s: "planned", n: "PR + HR + Accounting across all sites." },
                    { d: "Q2 2027", t: "04 · Case study published",           s: "planned", n: "Hospitality reference customer." },
                  ],
                },
                {
                  num: "03", d: "Q1 2027", t: "Food production vertical", s: "planned",
                  n: "Adjacent to garment AIoT story.",
                  pathway: [
                    { d: "Q4 2026", t: "01 · Adjacent food-factory contact",  s: "planned", n: "Snack / bottled-water producer." },
                    { d: "Q1 2027", t: "02 · AIoT shared-pattern brief",      s: "planned", n: "Reuse machine-control patterns from garment." },
                    { d: "Q1 2027", t: "03 · Pilot deployment",               s: "planned", n: "Production-line telemetry + admin stack." },
                    { d: "Q2 2027", t: "04 · Cross-industry case study",      s: "planned", n: "Platform-versatility proof." },
                  ],
                },
                {
                  num: "04", d: "Q2 2027", t: "Cross-vertical case study", s: "planned",
                  n: "Proof of platform versatility.",
                  pathway: [
                    { d: "Q1 2027", t: "01 · Data collection across pilots",  s: "planned", n: "Hospitality + food + logistics." },
                    { d: "Q1 2027", t: "02 · Story structure",                s: "planned", n: "One platform · many industries." },
                    { d: "Q2 2027", t: "03 · Case study published",           s: "planned", n: "Investor + partner-grade content." },
                    { d: "Q2 2027", t: "04 · PR campaign",                    s: "planned", n: "Trade press + LinkedIn distribution." },
                  ],
                },
              ]}
            />

          </div>

        </Section>


        {/* 10 — Team */}
        <Section id="team" kicker={kicker(10, "Team")} title="Team" collapsible>
          <Thesis>
            20 engineers across 5 specialised clusters — owner-led, factory-embedded. Adding sales and customer success next.
          </Thesis>

          {/* Organisation chart — real faces, Founder/Director down to each team */}
          <h3 className="font-bold text-yai-navy text-xl mb-1">Organisation chart</h3>
          <p className="text-sm text-gray-600 mb-4">Owner-led leadership, five teams — every face is a real Cambodia-based engineer.</p>
          <div className="mb-12 overflow-x-auto">
            <TeamOrgChart />
          </div>

          {/* 5 cluster circles (interactive — tap to see each group's experience mix) */}
          <h3 className="font-bold text-yai-navy text-xl mb-1">Engineering — 5 clusters · 20 engineers</h3>
          <p className="text-sm text-gray-600 mb-4">Cambodia-based. Each cluster owns its slice of the platform end-to-end.</p>
          <TeamClusters />
        </Section>

        {/* 11 — OC & Live Budget Update */}
        <Section id="oc-budget" kicker={kicker(11, "OC & Budget")} title="OC & Live Budget Update" collapsible>
          {/* The three OC cards (Quarterly / Half-year / Purchase apps) used to
              sit here. Removed — both topics are now Q&A items linking back to
              this section, and the cadence detail lives in the conversation. */}

          {/* Sales / Expenses / Budget — auto-aggregates the admin Sales + Salary + Expenses stores.
              The id is the anchor target for the Q&A panel's 'Sales plan' link. */}
          <div id="sales-expenses-budget" className="mt-8 scroll-mt-8">
            <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
              <h3 className="font-extrabold text-yai-navy text-xl">Sales Expenses and Budget</h3>
              <span className="text-[10px] uppercase tracking-wider text-gray-500">
                Sourced from admin · Sales · Salaries · Expenses
              </span>
            </div>
            <LiveBudgetSummary />
          </div>
        </Section>

        {/* 12 — Capital Efficiency */}
        <Section id="capital" kicker={kicker(12, "Capital Efficiency")} title="The Capital Efficiency Story" collapsible>
          <Thesis>
            Built for ~$205K to date and ~$370K through 2027 — what would cost $5M–$10M anywhere else. And the same small dollar in compounds upward — at every Ai layer, the value multiplies.
          </Thesis>

          {/* Roadmap timeline — past spend curve + every module climbing the 3 Ai layers */}
          <h3 id="capital-investment" className="font-bold text-yai-navy text-xl mb-1 scroll-mt-8">How ~$205K built 17 module families</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">
            One chart, every module. The spend curve at the top is what we&rsquo;ve <strong>actually paid</strong> in Cambodia engineering salaries — team grew from 3 engineers in May 2024 (Rich, Virot, Dilan) to <strong>22 by May 2026</strong>, with monthly burn now ~$14K and bonuses on top. Each row below is a real module: orange = Digitalization built, blue = Agentic layer on top, dark green = Full Ai. Every step right of <strong>TODAY</strong> is value added on the same engineering base.
          </p>
          <RoadmapTimeline mode="spend" quarterlySpendK={roadmap.quarterlySpendK} headcount={roadmap.headcount} />

        </Section>

        {/* 13 — Traction */}
        <Section id="traction" kicker={kicker(13, "Traction")} title="Traction & Pilots" collapsible>
          <FactoryModuleMatrix />
        </Section>


        <Section id="competition" kicker={kicker(14, "Competitive Landscape")} title="Competitive Landscape" collapsible>
          <Thesis>
            6 tiers of competitors mapped, with prices and weaknesses — but in 90% of Cambodian
            sales conversations the real opponent is paper, spreadsheets, and 10-year-old legacy.
            Win the status quo first; outmaneuver SAP regionally.
          </Thesis>
          <CompetitiveLandscape />
        </Section>

        {/* 15 — Risks */}
        <Section id="risks" kicker={kicker(15, "Risks")} title="Risks & Mitigations" collapsible>
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

        {/* 16 — Resources */}
        <Section id="resources" kicker={kicker(16, "Resources")} title="Resource Requirements" collapsible>
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

        {/* 17 — About Yai */}
        <Section id="appendix" kicker={kicker(17, "About Yai")} title="About Yai" collapsible>
          <Thesis>
            Credentials, product preview, and contact. Image slots are admin-managed from{" "}
            <code className="text-xs bg-gray-100 px-1 rounded">/admin/about</code>.
          </Thesis>

          {/* A1 · Company credentials — 3 slots */}
          <h3 className="font-bold text-yai-navy text-xl mb-3 mt-6">A1. Company credentials</h3>
          <p className="text-sm text-gray-600 mb-4">
            Public-facing proof of legitimacy — Cambodian business registration, VAT certificate, ICT licence.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <CredentialCard slot={about.a1.businessRegistration} fallbackLabel="Business Registration" />
            <CredentialCard slot={about.a1.vatCertificate}       fallbackLabel="VAT Certificate" />
            <CredentialCard slot={about.a1.ictLicense}           fallbackLabel="ICT License" />
          </div>

          {/* A2 · Product preview — 2 slots */}
          <h3 className="font-bold text-yai-navy text-xl mb-3">A2. Product preview</h3>
          <p className="text-sm text-gray-600 mb-4">
            What Yai looks like in production — the worker-facing front UI + the agentic chat layer.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <CredentialCard slot={about.a2.frontUi}  fallbackLabel="Front UI" />
            <CredentialCard slot={about.a2.agentics} fallbackLabel="Agentics" />
          </div>

          {/* A3 · Contact — was A5 */}
          <h3 className="font-bold text-yai-navy text-xl mb-3 mt-8">A3. Contact</h3>
          <Card className="bg-yai-navy border-yai-navy text-white">
            <p className="text-sm leading-relaxed">
              <strong className="text-yai-blue">{about.a3.name}</strong><br />
              {about.a3.role}, {about.a3.org}<br />
              {about.a3.email && (<>Email: <a href={`mailto:${about.a3.email}`} className="underline text-yai-blue">{about.a3.email}</a><br /></>)}
              {about.a3.web && (<>Web: <a href={about.a3.web.startsWith("http") ? about.a3.web : `https://${about.a3.web}`} className="underline text-yai-blue">{about.a3.web}</a><br /></>)}
              {about.a3.location && <span className="text-white/60">{about.a3.location}</span>}
            </p>
          </Card>
        </Section>

        {/* Footer (screen only) */}
        <footer className="mt-20 pt-10 border-t border-yai-border text-center text-sm text-gray-500 no-print">
          <p>Confidential — Yai / Texlink Technologies Co., Ltd.</p>
          <p className="mt-1">By accessing this page you agree not to share its contents without permission.</p>
        </footer>

      </main>
    </div>
    </AccordionProvider>
      {/* Print-only end page — outside main, owns the last sheet. */}
      <PrintEndPage about={about} />
    </>
  );
}

/** Section 17 image-slot card — renders the admin-uploaded image if a URL exists,
 *  otherwise shows a soft placeholder so the layout doesn't collapse. */
function CredentialCard({ slot, fallbackLabel }: { slot: { url: string; caption: string }; fallbackLabel: string }) {
  return (
    <div className="rounded-xl border border-yai-border bg-white overflow-hidden shadow-sm">
      <div className="aspect-[3/2] bg-gray-50 flex items-center justify-center overflow-hidden">
        {slot.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slot.url} alt={slot.caption || fallbackLabel} className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-gray-400 text-xs italic px-4">
            <div className="text-[10px] uppercase tracking-wider font-bold mb-1">{fallbackLabel}</div>
            Upload from /admin/about
          </div>
        )}
      </div>
      {(slot.caption || !slot.url) && (
        <div className="px-3 py-2 text-[11px] text-gray-600 font-semibold text-center border-t border-yai-border">
          {slot.caption || fallbackLabel}
        </div>
      )}
    </div>
  );
}
