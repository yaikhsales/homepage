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

const NAV: NavItem[] = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "problem",           label: "The Problem" },
  { id: "solution",          label: "The Solution" },
  { id: "architecture",      label: "Product Architecture" },
  { id: "modules",           label: "Module List" },
  { id: "market",            label: "Market Opportunity" },
  { id: "customers",         label: "Target Customers" },
  { id: "competition",       label: "Competitive Landscape" },
  { id: "gtm",               label: "Go-to-Market" },
  { id: "funnel",            label: "Sales Funnel" },
  { id: "pricing",           label: "Pricing & Packaging" },
  { id: "partnerships",      label: "Government Partnerships" },
  { id: "traction",          label: "Traction & Pilots" },
  { id: "tech",              label: "Technology Stack" },
  { id: "team",              label: "Team" },
  { id: "financials",        label: "Financial Projections" },
  { id: "capital",           label: "Capital Efficiency" },
  { id: "milestones",        label: "12-Month Milestones" },
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
            <StatCallout value={10} label="Ai agents in production" />
            <StatCallout value={20} label="Engineers from Cambodia" />
            <StatCallout value={36} suffix=" mo" label="In development" />
            <StatCallout value={40} suffix=" yrs" label="Industry experience (technical + management)" />
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p><strong className="text-yai-navy">What it is.</strong> Garment factories today still run on paper reports, ledger books, Excel sheets, half a dozen scattered chat apps, email threads, manual signatures, and staff running floor-to-floor chasing approvals — or being chased by phone and chat. Yai consolidates all of that into one Ai-native platform, layered in three:</p>
            <ol className="ml-2 space-y-3 text-gray-700 list-none counter-reset-layer">
              <li className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-yai-blue text-white text-xs font-extrabold flex items-center justify-center mt-0.5">1</span>
                <span><strong className="text-yai-blue">Digitalization layer.</strong> Converts paper, chat, email and Excel work into one uniform digital workplace. Every approval, record, signature and conversation lives in one system.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-yai-blue text-white text-xs font-extrabold flex items-center justify-center mt-0.5">2</span>
                <span><strong className="text-yai-blue">Agentic layer.</strong> Refines those workflows with LLMs, text and voice functions, dashboards, factory-floor DTV, AIoT devices, mobile and tablet apps. Staff and workers get easier, faster, more accurate operations on every device.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-yai-orange text-white text-xs font-extrabold flex items-center justify-center mt-0.5">3</span>
                <span><strong className="text-yai-navy">Full Ai layer.</strong> Built for senior management — strategic planning, controls, growth modelling. Manage one factory, expand to a second, then a second country, on the same agentic foundation.</span>
              </li>
            </ol>
            <p className="text-sm text-gray-500 italic">Digital first, agentic next, Full Ai for scale. One platform, one factory&apos;s complete evolution.</p>
            <p><strong className="text-yai-navy">Origin.</strong> Built end-to-end in Cambodia by Texlink Technologies — a 20-engineer team with deep on-the-floor knowledge of garment manufacturing operations, backed by 40 years of combined industry experience across technical and management.</p>
            <p><strong className="text-yai-navy">Traction.</strong> 2 factories in live production for 5 years, 3 legacy systems successfully replaced, 5 prospect meetings booked in the first week of structured outreach. Weekly seminar series underway.</p>
            <p><strong className="text-yai-navy">This plan.</strong> Outlines commercialisation of the <em>Admin-tier</em> modules to mid-large factories across Cambodia and the region. Production modules (YQMS, YTM/CE, YPI, 4DP) remain group internal IP — referenced for completeness but not the subject of this commercial roll-out.</p>
          </div>

          <div className="mt-8 p-5 bg-amber-50 border-l-4 border-yai-blue rounded">
            <p className="text-sm text-gray-800"><strong className="text-yai-navy">Scope note for readers:</strong> This document covers commercialisation of <em>Admin-tier modules</em>. The Production-tier modules described in the appendix remain internal IP of the YW Group and are not part of this commercial offering.</p>
          </div>
        </Section>

        {/* 02 — Problem */}
        <Section id="problem" kicker={kicker(2, "The Problem")} title="The Problem">
          <Thesis>
            Regional garment factories run on paper and outdated software, while compliance demands grow every year. No Ai-native option exists for them.
          </Thesis>
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <h3 className="font-bold text-yai-navy text-lg mb-2">Paper-driven operations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Most Cambodian and regional factories still run worker data, attendance, payroll calculations and audit prep on paper, spreadsheets, or fragmented legacy tools.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-yai-navy text-lg mb-2">Compliance burden compounding</h3>
              <p className="text-gray-600 text-sm leading-relaxed">WRAP, BSCI, ILO, HIGG, CTPAT, GMP, GRS — buyer audit demands grow every year. Manual prep is expensive, error-prone, and slow.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-yai-navy text-lg mb-2">Fragmented systems</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Workforce, payroll, inventory, finance and audit data live in different tools — no single source of truth, no Ai-ready data layer.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-yai-navy text-lg mb-2">No Ai-native option</h3>
              <p className="text-gray-600 text-sm leading-relaxed">SAP and Oracle are priced out of reach. Odoo is generic. In-house systems are dated. There is no Ai-first product purpose-built for the apparel segment at a regional price point.</p>
            </Card>
          </div>
          <div className="mt-8 grid sm:grid-cols-4 gap-3 text-center">
            {[
              ["Cost",       "SAP/Oracle out of reach"],
              ["Complexity", "Multiple tools, no integration"],
              ["Time",       "Manual audit prep, weeks per cycle"],
              ["Readiness",  "Buyer audits at risk"],
            ].map(([k, v]) => (
              <div key={k} className="p-4 bg-white rounded-lg border border-yai-border">
                <div className="text-2xl font-extrabold text-yai-blue">{k}</div>
                <div className="text-xs text-gray-500 mt-1">{v}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 03 — Solution */}
        <Section id="solution" kicker={kicker(3, "The Solution")} title="The Solution — Yai Platform">
          <Thesis>
            One Ai-native platform replacing multiple legacy systems — built for how apparel factories actually run.
          </Thesis>
          <p className="text-gray-700 leading-relaxed mb-6">
            Yai is an agentic Ai platform purpose-built for apparel manufacturing. Instead of generic ERP modules retrofitted to garment workflows, every module starts from how the factory actually operates — workforce, compliance, payroll, audit cycles, buyer demands.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["Ai-NATIVE",       "10 Ai agents",      "Full operational coverage — each agent owns a slice of factory workflow."],
              ["TRILINGUAL",      "EN · 中文 · ខ្មែរ", "Workers, supervisors, owners — everyone uses the platform in their own language."],
              ["OMNI-PLATFORM",   "Web + Android + iOS","Floor managers on mobile, finance on desktop, owners on tablet."],
              ["INTEGRATED",      "One platform, not five","Replaces fragmented tools with a single, Ai-aware data layer."],
              ["APPAREL-SPECIFIC","Built where it runs", "Designed in Cambodia, hardened in two live factories — not a generic ERP retrofitted."],
              ["FLEXIBLE",        "Cloud or on-prem",  "Hybrid deployment — factory keeps sensitive data on site if required."],
            ].map(([k, h, b]) => (
              <Card key={k}>
                <div className="text-yai-blue font-bold text-xs tracking-wider mb-2">{k}</div>
                <h3 className="font-bold text-yai-navy mb-2">{h}</h3>
                <p className="text-sm text-gray-600">{b}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 04 — Architecture (with ChatDemo) */}
        <Section id="architecture" kicker={kicker(4, "Product Architecture")} title="The 3-Stage Ladder">
          <Thesis>
            Customers start cheap, prove value, then expand. Each stage unlocks more revenue per customer without re-implementation.
          </Thesis>
          <p className="text-gray-700 leading-relaxed mb-8">
            Factories don&apos;t buy enterprise platforms in one shot. Yai is architected so a customer can start with a low-risk digital-replacement deployment, advance to agentic workflows, and finally scale to a multi-site Big Rollout — each stage building on the same data layer.
          </p>

          <StageLadder />

          <div className="mt-10 mb-6">
            <p className="text-xs uppercase tracking-wider font-bold text-yai-blue mb-2">Stage 2 — Agentic, in action</p>
            <h3 className="text-2xl font-bold text-yai-navy mb-4">What a conversation with Yai actually looks like</h3>
            <p className="text-sm text-gray-600 mb-5 max-w-2xl">
              A real Stage-2 interaction: a supervisor asks for the payroll summary, the agent pulls the data, then prepares the WRAP audit pack on request. No clicking through 12 screens.
            </p>
          </div>
          <ChatDemo />

          <div className="mt-10 p-5 bg-yai-navy text-white rounded-lg">
            <p className="text-sm leading-relaxed">
              <strong className="text-yai-blue">Why this matters commercially:</strong> Each stage is a real revenue step. Most customers land at Stage 1, prove ROI in 90 days, and self-select into Stages 2 and 3. The ladder is the upsell engine — built into the product, not bolted on as sales theatre.
            </p>
          </div>
        </Section>

        {/* 05 — Modules */}
        <Section id="modules" kicker={kicker(5, "Admin Module List")} title="Module List">
          <Thesis>
            Five Admin modules approved for commercialisation. Production modules remain group internal IP.
          </Thesis>
          <div className="overflow-x-auto rounded-xl border border-yai-border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-yai-navy text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Module</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yai-border">
                {[
                  ["01", "Finance Agent",     "Invoicing, GL, financial reporting, tax filing prep, multi-currency.",                    "live"],
                  ["02", "Admin Agent",       "Asset monitoring, cost control, vendor management, internal approvals.",                  "live"],
                  ["03", "HR & Payroll",      "Recruitment, contracts, attendance, ABA/Wing payroll integration, statutory reporting.", "live"],
                  ["04", "Compliance",        "WRAP, BSCI, ILO, HIGG, CTPAT, GMP, GRS — audit prep automation, evidence capture.",      "pilot"],
                  ["05", "Internal Logistics","Inventory, warehouse operations, packing/shipping tracking, internal movement.",         "live"],
                ].map(([n, name, desc, status]) => (
                  <tr key={n} className="hover:bg-yai-bg">
                    <td className="px-4 py-3 font-bold text-yai-blue">{n}</td>
                    <td className="px-4 py-3 font-semibold text-yai-navy whitespace-nowrap">{name}</td>
                    <td className="px-4 py-3 text-gray-700">{desc}</td>
                    <td className="px-4 py-3"><Badge variant={status as "live" | "pilot"}>{status}</Badge></td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">Ivan / Terry</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="mt-6 bg-white border border-yai-border rounded-lg p-4 group">
            <summary className="cursor-pointer font-semibold text-yai-navy list-none flex items-center gap-2">
              <span className="text-yai-blue group-open:rotate-45 inline-block transition-transform">+</span>
              Production-tier modules (internal IP — reference only)
            </summary>
            <div className="mt-3 text-sm text-gray-600 space-y-2 pl-6">
              <p>The following Production-tier modules are operating internally within the YW Group and are <strong>not part of this commercial offering</strong>:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>YQMS</strong> — Quality Management System</li>
                <li><strong>YTM / CE</strong> — Trim Management / Cutting Edge production control</li>
                <li><strong>YPI</strong> — Production Intelligence</li>
                <li><strong>4DP</strong> — 4-Dimensional Planning</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">Commercialisation of Production modules is a separate decision and would require its own investment case.</p>
            </div>
          </details>
        </Section>

        {/* 06 — Market */}
        <Section id="market" kicker={kicker(6, "Market Opportunity")} title="Market Opportunity">
          <Thesis>
            Cambodia alone is a meaningful market. Regional expansion multiplies it by 10× — and Yai is the only Ai-native option built for these factories.
          </Thesis>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            <StatCallout value={2650} orange label="Garment factories in Cambodia" />
            <StatCallout value={400} label="Tier-A targets (500–3,000 workers)" />
            <StatCallout value={4} suffix=" countries" label="Regional expansion footprint" />
          </div>
          <h3 className="font-bold text-yai-navy text-xl mb-3">TAM build-up</h3>
          <div className="overflow-x-auto rounded-xl border border-yai-border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-yai-navy text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Market</th>
                  <th className="px-4 py-3 text-left">Factories</th>
                  <th className="px-4 py-3 text-left">Tier-A Target</th>
                  <th className="px-4 py-3 text-left">ACV (avg)</th>
                  <th className="px-4 py-3 text-left">TAM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yai-border">
                <tr><td className="px-4 py-3">Cambodia</td><td className="px-4 py-3">2,650</td><td className="px-4 py-3">200–400</td><td className="px-4 py-3 text-gray-400">$TBD</td><td className="px-4 py-3 text-gray-400">$TBD</td></tr>
                <tr><td className="px-4 py-3">Vietnam</td><td className="px-4 py-3">~6,000</td><td className="px-4 py-3">~1,000</td><td className="px-4 py-3 text-gray-400">$TBD</td><td className="px-4 py-3 text-gray-400">$TBD</td></tr>
                <tr><td className="px-4 py-3">Bangladesh</td><td className="px-4 py-3">~4,000</td><td className="px-4 py-3">~800</td><td className="px-4 py-3 text-gray-400">$TBD</td><td className="px-4 py-3 text-gray-400">$TBD</td></tr>
                <tr><td className="px-4 py-3">Myanmar</td><td className="px-4 py-3">~700</td><td className="px-4 py-3">~150</td><td className="px-4 py-3 text-gray-400">$TBD</td><td className="px-4 py-3 text-gray-400">$TBD</td></tr>
                <tr className="bg-amber-50/60 font-bold">
                  <td className="px-4 py-3">Total addressable</td>
                  <td className="px-4 py-3">~13,300</td>
                  <td className="px-4 py-3">~2,350</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3 text-yai-blue">$TBD</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600 italic">
            Realistic capture assumption: 5% of Tier-A in core markets within 5 years equals approximately 100+ paying factory customers at sustainable ACV.
          </p>
        </Section>

        {/* 07 — Customers */}
        <Section id="customers" kicker={kicker(7, "Target Customers")} title="Target Customers">
          <Thesis>
            Mid-large local/regional factories, 500–3,000 workers, digitalisation-ready. Three tiers, one focus.
          </Thesis>
          <div className="space-y-5">
            {[
              { tier: "A", color: "bg-yai-blue", title: "Tier A — Priority targets", body: "500–3,000 workers, local/regional ownership, audit-pressured, digitalisation-ready. ~200–400 factories in Cambodia.", note: "Examples (anonymised): TBD" },
              { tier: "B", color: "bg-yai-teal",   title: "Tier B — Secondary",        body: "300–500 workers, smaller buyers, less audit pressure but cost-sensitive. Suitable for Stage 1 (Digital) entry.",                note: "Approach: Self-serve onboarding, lower-touch sales motion." },
              { tier: "C", color: "bg-yai-navy",   title: "Tier C — Strategic groups", body: "Multi-factory groups (3,000+ workers per site, 3+ sites). Stage 3 Big Rollout candidates — six-figure ACV potential each.", note: "Approach: Founder-led, owner-to-owner conversations. Pilot one site, expand to group." },
            ].map((t) => (
              <Card key={t.tier}>
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-full ${t.color} text-white flex items-center justify-center font-extrabold`}>{t.tier}</div>
                  <div>
                    <h3 className="font-bold text-yai-navy text-lg mb-1">{t.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{t.body}</p>
                    <p className="text-xs text-gray-500"><strong>{t.note}</strong></p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6 p-5 bg-white rounded-lg border-l-4 border-yai-blue">
            <p className="text-sm text-gray-700"><strong className="text-yai-navy">Ideal customer profile:</strong> Owner-operator or empowered managing director, has felt the cost of a failed audit at least once, already paying for at least one legacy tool, willing to run a 90-day pilot with executive sponsorship.</p>
          </div>
        </Section>

        {/* 08 — Competition */}
        <Section id="competition" kicker={kicker(8, "Competitive Landscape")} title="Competitive Landscape">
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

        {/* 09 — GTM */}
        <Section id="gtm" kicker={kicker(9, "Go-to-Market")} title="Go-to-Market Strategy">
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

        {/* 10 — Funnel */}
        <Section id="funnel" kicker={kicker(10, "Sales Funnel")} title="Sales Funnel">
          <Thesis>
            From 2,650 factories to 5–20 paying customers in year one — concrete numbers at each stage.
          </Thesis>
          <Funnel />
          <p className="mt-6 text-sm text-gray-600 italic">
            Conservative case: 5 paying customers, year 1. Aggressive case: 20. Both ranges are sustainable given current pipeline velocity (5 meetings booked in first week of structured outreach).
          </p>
        </Section>

        {/* 11 — Pricing */}
        <Section id="pricing" kicker={kicker(11, "Pricing & Packaging")} title="Pricing & Packaging">
          <Thesis>
            Per-user tiers, optional Agentic upgrade, custom Big Rollout. Designed for the ladder, not the brochure.
          </Thesis>
          <div className="overflow-x-auto rounded-xl border border-yai-border bg-white mb-6">
            <table className="w-full text-sm">
              <thead className="bg-yai-navy text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Tier</th>
                  <th className="px-4 py-3 text-left">Users</th>
                  <th className="px-4 py-3 text-left">What&apos;s included</th>
                  <th className="px-4 py-3 text-left">Price / Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yai-border">
                <tr><td className="px-4 py-3 font-bold text-yai-navy">Starter</td><td className="px-4 py-3">Up to 100</td><td className="px-4 py-3">All Admin modules, Stage 1 (Digital), email support</td><td className="px-4 py-3 text-yai-blue font-bold">$TBD</td></tr>
                <tr><td className="px-4 py-3 font-bold text-yai-navy">Growth</td><td className="px-4 py-3">Up to 500</td><td className="px-4 py-3">Starter + priority support + custom reports</td><td className="px-4 py-3 text-yai-blue font-bold">$TBD</td></tr>
                <tr><td className="px-4 py-3 font-bold text-yai-navy">Enterprise</td><td className="px-4 py-3">1,000+</td><td className="px-4 py-3">Growth + SSO, audit log, dedicated CSM</td><td className="px-4 py-3 text-yai-blue font-bold">$TBD</td></tr>
                <tr className="bg-amber-50/60"><td className="px-4 py-3 font-bold text-yai-navy">Agentic upgrade</td><td className="px-4 py-3">Add-on</td><td className="px-4 py-3">Stage 2 — full Ai agent workflows on top of any tier</td><td className="px-4 py-3 text-yai-blue font-bold">+$TBD</td></tr>
                <tr className="bg-sky-50/60"><td className="px-4 py-3 font-bold text-yai-navy">Big Rollout</td><td className="px-4 py-3">Custom</td><td className="px-4 py-3">Stage 3 — dedicated infra, AIoT, multi-site, head-office</td><td className="px-4 py-3 text-yai-blue font-bold">From $TBD</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              ["Setup fee",           "One-time, scoped per deployment — covers configuration, training, data migration."],
              ["Ai token overages",   "Each tier includes a token allowance. Heavy usage flows to a metered overage charge."],
              ["Multi-year discounts","2-year and 3-year commitments unlock pricing locks and discount tiers."],
            ].map(([k, v]) => (
              <div key={k} className="p-4 bg-white rounded-lg border border-yai-border">
                <h4 className="font-bold text-yai-navy mb-1">{k}</h4>
                <p className="text-gray-600">{v}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 12 — Partnerships */}
        <Section id="partnerships" kicker={kicker(12, "Partnerships")} title="Government & Institutional Partnerships">
          <Thesis>
            We give the ministry a tool it doesn&apos;t have to build. They give us distribution and validation.
          </Thesis>
          <div className="space-y-5">
            {[
              { tag: "MoE",    bg: "bg-yai-navy",  title: "Ministry of Environment",         body: "Digital audit module — provided free for ministry use. In exchange: official recognition, factory referrals, co-branding on compliance dashboards. Factories pay for their side; ministry gets visibility.", status: "Initial conversations underway." },
              { tag: "ILO",    bg: "bg-yai-teal",  title: "ILO Better Work Cambodia",        body: "Integration potential — Yai compliance evidence feeds Better Work assessments. Reduces duplicate audit prep for factories enrolled in both.",                                                  status: "Exploratory." },
              { tag: "GMAC",   bg: "bg-yai-blue",title: "GMAC (Garment Manufacturers Assoc. of Cambodia)", body: "Member channel — preferential pricing for GMAC members, joint seminars, association endorsement.",                                                                                       status: "To be initiated Q1." },
              { tag: "TAFTAC", bg: "bg-gray-700",  title: "TAFTAC outreach",                 body: "Textile, Apparel, Footwear & Travel Goods Association of Cambodia — broader manufacturing reach beyond GMAC.",                                                                                  status: "Planned." },
            ].map((p) => (
              <Card key={p.tag}>
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-14 h-14 rounded-lg ${p.bg} text-white flex items-center justify-center font-bold text-xs text-center`}>{p.tag}</div>
                  <div>
                    <h3 className="font-bold text-yai-navy text-lg mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{p.body}</p>
                    <p className="text-xs text-gray-500"><strong>Status:</strong> {p.status}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6 p-5 bg-white rounded-lg border-l-4 border-yai-blue">
            <p className="text-sm text-gray-700"><strong className="text-yai-navy">Value exchange model:</strong> We give the institution capability they would otherwise have to build. They give us recognition, referrals, and distribution. No money changes hands at the institutional level — factories pay for their side.</p>
          </div>
        </Section>

        {/* 13 — Traction (with DashboardDemo) */}
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

        {/* 14 — Tech */}
        <Section id="tech" kicker={kicker(14, "Technology")} title="Technology Stack">
          <Thesis>
            Modern, modular, model-agnostic. No vendor lock-in we don&apos;t control.
          </Thesis>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              ["Backend",          "Laravel (PHP) with MongoDB. Battle-tested, well-known by regional developer pool, easy to extend and maintain."],
              ["Ai Agent Layer",   "Model-agnostic — Claude, GPT, open-source models. The agent orchestration is ours; the underlying LLM is swappable as the market evolves."],
              ["Mobile",           "Native Android and iOS apps. Worker app, supervisor app, and owner dashboard — all trilingual."],
              ["Deployment",       "Cloud-default with on-premise hybrid for factories that require data residency. Same codebase, different deployment target."],
              ["Languages",        "Full UI and Ai conversation support in English, Chinese (Simplified), and Khmer. Every workflow, report, and chat in all three."],
              ["Integrations",     "ABA Bank, Wing, payroll providers, biometric devices, RFID, BOM/PLM systems (where customer brings one)."],
            ].map(([k, v]) => (
              <Card key={k}>
                <h3 className="font-bold text-yai-navy mb-2">{k}</h3>
                <p className="text-sm text-gray-600">{v}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* 15 — Team */}
        <Section id="team" kicker={kicker(15, "Team")} title="Team">
          <Thesis>
            20 engineers in Cambodia, owner-led, factory-embedded. Adding sales and customer success next.
          </Thesis>
          <div className="space-y-5">
            <Card>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-16 h-16 rounded-full bg-yai-blue text-white flex items-center justify-center font-extrabold text-xl">GK</div>
                <div>
                  <h3 className="font-bold text-yai-navy text-lg mb-1">Gamini K — Director</h3>
                  <p className="text-sm text-gray-600">Founder, Texlink Technologies Co., Ltd. (Cambodia). Builder-operator across software, manufacturing operations, and finance. Lives on the factory floor when shipping new modules.</p>
                </div>
              </div>
            </Card>
            <Card>
              <h3 className="font-bold text-yai-navy mb-2">Engineering team — 20 developers</h3>
              <p className="text-sm text-gray-600">Cambodia-based, full-stack Laravel + MongoDB, native mobile, Ai agent specialists. Organised across Admin modules and Production modules with shared platform team.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-yai-navy mb-2">Planned hires</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <strong>1–2 sales hires</strong> with apparel industry background — first hire prioritised for Q1.</li>
                <li>• <strong>Customer success</strong> lead — to own pilot-to-production transitions.</li>
                <li>• <strong>Compliance specialist</strong> — to deepen audit module credibility with brand HQs.</li>
              </ul>
            </Card>
          </div>
        </Section>

        {/* 16 — Financials */}
        <Section id="financials" kicker={kicker(16, "Financial Projections")} title="Financial Projections">
          <Thesis>
            Profitable path inside 36 months — even on conservative customer count assumptions.
          </Thesis>
          <div className="overflow-x-auto rounded-xl border border-yai-border bg-white mb-6">
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
          <p className="text-sm text-gray-600 italic">
            <strong>Why the numbers can hold up:</strong> Engineering cost base is already in place and does not balloon with revenue. New revenue flows to gross margin minus customer success and sales hires.
          </p>
        </Section>

        {/* 17 — Capital Efficiency */}
        <Section id="capital" kicker={kicker(17, "Capital Efficiency")} title="The Capital Efficiency Story">
          <Thesis>
            Built for $360K what would cost $5M–$10M anywhere else. That advantage doesn&apos;t expire.
          </Thesis>
          <div className="bg-yai-navy text-white p-8 sm:p-10 rounded-2xl my-8">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-yai-blue tabular-nums">$360K</div>
                <div className="text-sm text-white/70 mt-2 uppercase tracking-wider">Cambodia (actual)</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white/80 tabular-nums">$5M</div>
                <div className="text-sm text-white/70 mt-2 uppercase tracking-wider">Singapore (~15×)</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white/80 tabular-nums">$10M</div>
                <div className="text-sm text-white/70 mt-2 uppercase tracking-wider">US (~28×)</div>
              </div>
            </div>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p><strong className="text-yai-navy">Why this matters now.</strong> The $360K is sunk cost — the platform exists, two factories are running on it, three legacy systems are gone. We are not asking for someone to fund $5M of build. We are commercialising what&apos;s already built.</p>
            <p><strong className="text-yai-navy">Why this matters going forward.</strong> The cost-of-engineering advantage doesn&apos;t go away. Every new module, every new feature, every new market we expand into ships at Cambodia rates. The 15–28× cost gap compounds across the entire roadmap — not just past spend.</p>
            <p><strong className="text-yai-navy">What this enables.</strong> Aggressive pricing without margin pain. Fast feature iteration relative to global competitors. Ability to under-cut SAP/Oracle/Odoo on price while out-iterating them on roadmap.</p>
          </div>
        </Section>

        {/* 18 — Milestones */}
        <Section id="milestones" kicker={kicker(18, "Milestones")} title="12-Month Milestones">
          <Thesis>
            Quarterly checkpoints, written down, accountable.
          </Thesis>
          <div className="grid md:grid-cols-2 gap-5">
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

        {/* 19 — Risks */}
        <Section id="risks" kicker={kicker(19, "Risks")} title="Risks & Mitigations">
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

        {/* 20 — Resources */}
        <Section id="resources" kicker={kicker(20, "Resources")} title="Resource Requirements">
          <Thesis>
            What&apos;s needed from the investor over the next 12 months — not a fundraise, a continuation.
          </Thesis>
          <div className="grid md:grid-cols-2 gap-5">
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

        {/* 21 — Appendix */}
        <Section id="appendix" kicker={kicker(21, "Appendix")} title="Appendix">
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
