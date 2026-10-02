import type { Metadata } from "next";
import Link from "next/link";
import { Flip } from "./Flip";

/* Yai — public case study: how Claude is used inside a working garment factory.
   Public route: /claudecasestudy. Referenced from the Claude Partner Network
   customer story nomination, so every figure here must be verifiable.

   Written to match www.ggmt.sg/claudecasestudy, which is the version CPN has
   already accepted as a public reference. Two rules carried over from that page:
   name Claude at every step rather than gesturing at it, and never claim the
   system acts without a person. Figures measured against the live system on
   29 September 2026 — 13 of 13 PA replies stamped source=claude, guard latency
   1.26-2.50s, one example line 15:24:58 pa=accounting source=claude latency=2.50s.

   DO NOT PUBLISH until Yorkmars have agreed in writing to be named. The whole
   point of this page is that the customer is named; without their consent it
   must not ship. */

const ORANGE = "#BF5730";
const ORANGE_SOFT = "#D97757";
const BLUE = "#0E4F6E";
const INK = "#111822";

const URL = "https://www.yaikh.com/claudecasestudy";
const TITLE = "How Claude runs a garment factory's assistants — Yai case study";
const DESC =
  "Yorkmars (Cambodia) Garment Mfg Co., Ltd. runs about 70 applications across its factory, with thirteen department assistants and a routing agent answering on Claude — over the factory's own records, which never leave its server.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    type: "article",
  },
};

const ClaudeMark = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path
      d="M12 1.6l2.36 6.02L20.4 5.3l-2.32 6.04 6.02 2.36-6.02 2.36 2.32 6.04-6.04-2.32L12 25.4l-2.36-6.02-6.04 2.32 2.32-6.04L0 13.3l5.92-2.36L3.6 4.9l6.04 2.32z"
      transform="translate(0,-1)"
    />
  </svg>
);

const Stat = ({ n, label }: { n: string; label: string }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
    <div className="text-2xl font-bold tracking-tight" style={{ color: BLUE }}>
      {n}
    </div>
    <div className="mt-1 text-[13px] leading-snug text-slate-600">{label}</div>
  </div>
);

const Section = ({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mt-14">
    {kicker && (
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">{kicker}</p>
    )}
    <h2 className="text-[26px] font-bold leading-tight tracking-tight" style={{ color: INK }}>
      {title}
    </h2>
    <div className="mt-4 space-y-4 text-[16.5px] leading-relaxed text-slate-700">{children}</div>
  </section>
);

const Step = ({ n, name, children }: { n: number; name: string; children: React.ReactNode }) => (
  <li className="flex gap-4 border-b border-slate-200 py-5 last:border-0">
    <span
      className="mt-[3px] flex h-7 w-7 flex-none items-center justify-center rounded-full text-[13px] font-bold text-white"
      style={{ backgroundColor: BLUE }}
    >
      {n}
    </span>
    <div>
      <p className="text-[16px] font-bold" style={{ color: INK }}>
        {name}
      </p>
      <p className="mt-1 text-[16px] leading-relaxed text-slate-700">{children}</p>
    </div>
  </li>
);

const Agent = ({ name, does }: { name: string; does: string }) => (
  <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5">
    <p className="text-[14.5px] font-bold leading-tight" style={{ color: INK }}>
      {name}
    </p>
    <p className="mt-0.5 text-[13px] leading-snug text-slate-600">{does}</p>
  </div>
);

const Group = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
    <div className="space-y-2">{children}</div>
  </div>
);

const FlowStep = ({
  n,
  who,
  title,
  body,
}: {
  n: string;
  who: "claude" | "person" | "factory";
  title: string;
  body: string;
}) => {
  const claude = who === "claude";
  const tint = claude ? ORANGE : BLUE;
  const label = claude ? "Claude" : who === "person" ? "Person" : "Factory server";
  return (
    <div
      className="relative flex-1 rounded-xl border px-4 py-4"
      style={{
        borderColor: claude ? "rgba(191,87,48,.45)" : "rgba(14,79,110,.4)",
        backgroundColor: claude ? "rgba(217,119,87,.08)" : "rgba(14,79,110,.06)",
      }}
    >
      <p
        className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: tint }}
      >
        {n} · {label}
      </p>
      <p className="mt-1.5 text-[15px] font-bold leading-snug" style={{ color: INK }}>
        {title}
      </p>
      <p className="mt-1 text-[13.5px] leading-snug text-slate-600">{body}</p>
    </div>
  );
};

const Row = ({ what, where }: { what: string; where: string }) => (
  <tr className="border-b border-slate-100 last:border-0">
    <td className="py-2.5 pr-6 align-top font-medium text-slate-800">{what}</td>
    <td className="py-2.5 align-top text-slate-600">{where}</td>
  </tr>
);

export default function ClaudeCaseStudy() {
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-[15px] font-bold tracking-tight" style={{ color: INK }}>
            Yai
          </Link>
          <span
            className="inline-flex items-center gap-[7px] rounded-full border px-[11px] py-[5px] text-[12px] font-semibold"
            style={{
              color: ORANGE,
              borderColor: "rgba(191,87,48,.55)",
              backgroundColor: "rgba(217,119,87,.12)",
            }}
          >
            <ClaudeMark size={14} />
            Powered by Claude Code
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="pt-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Case study · Yai · Yorkmars (Cambodia) Garment Mfg Co., Ltd.
          </p>
          <h1 className="mt-3 text-[38px] font-bold leading-[1.12] tracking-tight" style={{ color: INK }}>
            How Claude runs a garment factory&apos;s assistants
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-slate-600">
            Yorkmars runs about seventy applications across its factory — production, cutting, QA,
            maintenance, stores, shipping, customs, HR, payroll, admin, planning, accounting. Thirteen of
            those departments now have an assistant of their own, with a routing agent above them, and every
            one of the fourteen answers on Claude. The records they read stay on the factory&apos;s own
            server. Claude Code built the platform; Claude runs inside it.
          </p>
          <p className="mt-4 text-[14px] text-slate-500">
            A Yai deployment · developed by TexLink Technologies Co., Ltd. · Phnom Penh, Cambodia
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat n="~70" label="applications across the factory" />
          <Stat n="13+1" label="department assistants, plus Big Brain" />
          <Stat n="13/13" label="replies stamped source=claude" />
          <Stat n="km·en·zh" label="languages one assistant answers in" />
        </div>

        <Section kicker="The architecture" title="Claude sits behind every assistant">
          <p>
            Yai shows the factory thirteen department assistants and a Big Brain above them. Underneath, they
            are one engine. Every one of them is Claude, working a different part of the factory and handing
            on to the next.
          </p>
        </Section>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-[#FBFCFD] p-5 sm:p-7">
          <div className="grid gap-6 md:grid-cols-[1fr_minmax(220px,260px)_1fr] md:items-center">
            <div className="space-y-5 md:border-r md:border-dashed md:border-slate-300 md:pr-6">
              <Group label="Making the goods">
                <Agent name="Production" does="line planning, WIP by line, daily output" />
                <Agent name="QA" does="4-point and AQL 2.5 results, defect logs, audits" />
                <Agent name="MRP" does="bills of material, stock alerts, supplier orders" />
                <Agent name="CE" does="standard times, machine allocation, skills" />
                <Agent name="YTM" does="machine downtime, repair queue, spare parts" />
              </Group>
              <Group label="Planning the work">
                <Agent name="4DP" does="capacity, factory, line and sales planning" />
                <Agent name="YPI" does="trilingual tech packs and buyer approvals" />
              </Group>
            </div>

            <div
              className="order-first rounded-2xl border-2 px-5 py-6 text-center md:order-none"
              style={{ borderColor: ORANGE_SOFT, backgroundColor: "rgba(217,119,87,.07)" }}
            >
              <div className="flex justify-center" style={{ color: ORANGE }}>
                <ClaudeMark size={40} />
              </div>
              <p className="mt-2 text-[28px] font-bold tracking-tight" style={{ color: INK }}>
                Claude
              </p>
              <p className="text-[13px] font-semibold" style={{ color: ORANGE }}>
                reads · reasons · answers
              </p>
              <div className="mt-4 space-y-1.5 text-left">
                <div className="rounded-md bg-white px-3 py-2 text-[12.5px] leading-snug text-slate-700">
                  <b style={{ color: INK }}>Claude Code</b> — wrote the platform
                </div>
                <div className="rounded-md bg-white px-3 py-2 text-[12.5px] leading-snug text-slate-700">
                  <b style={{ color: INK }}>Claude Haiku 4.5</b> — answers all fourteen assistants
                </div>
                <div className="rounded-md bg-white px-3 py-2 text-[12.5px] leading-snug text-slate-700">
                  <b style={{ color: BLUE }}>The factory server</b> — holds the data, always
                </div>
              </div>
            </div>

            <div className="space-y-5 md:border-l md:border-dashed md:border-slate-300 md:pl-6">
              <Group label="Moving the goods">
                <Agent name="Shipping" does="container plans, customs clearance, delivery" />
              </Group>
              <Group label="Running the place">
                <Agent name="HR" does="payroll batches, NSSF, overtime, permits" />
                <Agent name="Admin" does="tickets, gate passes, visitors, fire and CCTV" />
                <Agent name="Accounting" does="purchase requests, bill claims, salary bills" />
                <Agent name="CSR" does="utilities, environmental audits, certificates" />
                <Agent name="Social" does="comment monitoring and reply drafting" />
              </Group>
              <Group label="Above them all">
                <Agent name="Big Brain" does="routes across departments, composes one answer" />
              </Group>
            </div>
          </div>

          <div
            className="mt-6 rounded-lg border border-dashed px-4 py-3 text-center text-[13.5px]"
            style={{ borderColor: ORANGE_SOFT, color: INK }}
          >
            <b>The rule every assistant follows:</b> Claude answers the question. A person makes the
            decision.
          </div>
        </div>

        <Section
          kicker="One question, start to finish"
          title="Where Claude works, and where the factory&rsquo;s own server does"
        >
          <p>
            Follow a single question from the floor. Orange is Claude. Blue never leaves the building.
          </p>
        </Section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <FlowStep n="1" who="person" title="Someone asks" body="In Khmer, English or Chinese, from a phone on the floor or a PC in the office." />
          <FlowStep n="2" who="factory" title="Yai picks the department" body="The question is matched to one of the thirteen assistants." />
          <FlowStep n="3" who="factory" title="The records are retrieved" body="A search across that department's records only, on the factory's own machine." />
          <FlowStep n="4" who="claude" title="Claude reads and answers" body="Claude Haiku 4.5 takes the department's identity and the retrieved facts and writes the reply." />
          <FlowStep n="5" who="factory" title="A local model stands behind" body="If Claude is unreachable or slow, a model on the same hardware answers and the reply says so." />
          <FlowStep n="6" who="person" title="A person decides" body="The assistants answer questions. They do not approve, sign or dispatch anything." />
        </div>

        <Section kicker="The problem" title="The answer existed. Finding it was the job.">
          <p>
            A garment factory is not one system. It is production, cutting, QA, maintenance, stores,
            shipping, customs, HR, payroll, admin, gate control, planning, merchandising and accounting —
            each with its own forms, its own approvals and its own people. Yorkmars digitalised all of it:
            around seventy applications, built for how this factory actually works rather than adapted from
            someone else&apos;s template.
          </p>
          <p>
            Digital records alone still need a person to read them, decide, and pass them on. What was
            yesterday&apos;s defect rate? Which line is short of thread? Is that gate pass still open? The
            answers existed — in the system, in a spreadsheet, in somebody&apos;s head — and getting one
            meant finding the person who knew.
          </p>
          <p>
            No general model can answer those questions. They are not public facts. They are one
            factory&apos;s private records, changing hourly, written and read by people working in Khmer.
            The answer had to be a model reasoning over the factory&apos;s own data, not a model asked what
            it already knew.
          </p>
        </Section>

        <Section kicker="Before and after" title="The same eight jobs, before Claude and with it">
          <p>
            Flip a card. The front is how the work was done in the factory before this platform existed. The
            back is what Claude does now.
          </p>
        </Section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Flip
            before="A supervisor wanting yesterday's line output walked to the office and asked whoever kept the book."
            after="Claude answers from the production records in a few seconds, in Khmer, from a phone on the floor."
          />
          <Flip
            before="QA results lived in inspection sheets. Anything older than this week meant going through a folder."
            after="Claude answers from the 4-point and AQL 2.5 records, and says plainly when the data does not cover the question."
          />
          <Flip
            before="A question spanning two departments meant two phone calls and a wait for both to reply."
            after="Big Brain asks each department's assistant and composes one answer from what they return."
          />
          <Flip
            before="Staff who read Khmer had to work through systems and documents written in English."
            after="One assistant answers in Khmer, English or Chinese — the same assistant, whichever language the question arrives in."
          />
          <Flip
            before="Machine downtime was known by the maintenance team and nobody else until the weekly meeting."
            after="Claude answers from the maintenance records on request, so the question does not have to wait for a meeting."
          />
          <Flip
            before="A purchase request moved between desks, and finding out where it had stopped meant asking along the chain."
            after="Claude answers from the approval chain the request has actually passed, module by module."
          />
          <Flip
            before="New staff learned which module did what by asking colleagues for their first few months."
            after="Each assistant explains its own department, its modules and what it can and cannot do."
          />
          <Flip
            before="Answers were as current as the last person to update the spreadsheet, and nobody could tell how stale they were."
            after="Claude answers from the retrieved records, and says so when a figure is reference material rather than a live reading."
          />
        </div>

        <Section kicker="What Claude does" title="From the question to the answer, step by step">
          <p>
            Every assistant in Yai — Production, QA, MRP, CE, YTM, 4DP, YPI, Shipping, HR, Admin,
            Accounting, CSR, Social and Big Brain — is Claude, working on one part of the factory.
          </p>
          <p>
            Claude is not a label on this product. Here is the whole run, in the order the work actually
            happens.
          </p>
        </Section>

        <ol className="mt-6 rounded-2xl border border-slate-200 bg-white px-6">
          <Step n={1} name="Claude answers as the department, not as a chatbot">
            Each assistant is given its own identity, its own modules and its own approval chains, so the QA
            assistant answers as QA and the accounting assistant answers as accounting. The reply comes back
            in the first person, short, in the language the question was asked in.
          </Step>
          <Step n={2} name="Claude reads only that department's records">
            The retrieval is scoped to the asking department before Claude ever sees it. The QA assistant
            cannot answer from payroll, and payroll cannot answer from QA.
          </Step>
          <Step n={3} name="Claude works in Khmer, English and Chinese">
            The same assistant answers in whichever of the three the question arrives in, so the person on
            the line and the buyer&apos;s merchandiser both get an answer in their own language, from the
            same records.
          </Step>
          <Step n={4} name="Claude says when it does not know">
            Where the records do not cover a question, the assistant says so plainly instead of producing a
            plausible number. Figures that are reference material rather than live readings are described as
            such.
          </Step>
          <Step n={5} name="Big Brain routes across departments">
            A question that touches several departments goes to Big Brain, which works out which assistants
            are relevant, gathers what each returns, and composes one answer rather than three.
          </Step>
          <Step n={6} name="Every reply says which model produced it">
            Each answer carries the name of the model that wrote it. On 29 September 2026, thirteen of
            thirteen department assistants returned <code>source=claude</code>, with no fallbacks. The claim
            on this page is checkable rather than asserted.
          </Step>
          <Step n={7} name="A local model stands behind Claude">
            If Claude cannot be reached, or takes longer than fifteen seconds, a model running on the
            factory&apos;s own hardware answers instead and the reply is stamped accordingly. The floor is
            never left waiting, and nobody has to guess which model spoke.
          </Step>
          <Step n={8} name="Claude Code built the rest of the factory">
            The seventy applications the assistants sit on top of — the forms, the approvals, the modules —
            were written with Claude Code. That is the part that made the rest possible.
          </Step>
        </ol>

        <Section kicker="How much Claude" title="Claude is not a feature here. It is the engine.">
          <p>
            Every one of the fourteen assistants answers on{" "}
            <strong>Claude Haiku 4.5</strong>. There is no department in the factory whose assistant runs on
            something else, and no path where a question reaches a person without Claude having read the
            records first.
          </p>
          <p>Measured against the live system on 29 September 2026:</p>
          <table className="w-full text-[15.5px]">
            <tbody>
              <Row what="Model answering every assistant" where="claude-haiku-4-5" />
              <Row what="Replies stamped source=claude" where="13 of 13, zero fallbacks" />
              <Row what="Reasoning time at the factory gateway" where="1.26 – 2.50 seconds" />
              <Row what="End to end, browser to browser" where="about 4 seconds" />
              <Row what="Factory records sent to any third party" where="none" />
            </tbody>
          </table>
          <p className="rounded-xl border-l-4 bg-white px-5 py-4 text-slate-800" style={{ borderColor: ORANGE_SOFT }}>
            One line from the gateway log, for a single question asked from the public site:{" "}
            <code className="font-mono text-[14px]">
              15:24:58 pa=accounting source=claude latency=2.50s
            </code>
          </p>
        </Section>

        <Section kicker="How it was built" title="Claude Code wrote seventy applications">
          <p>
            Seventy applications across every department of a working factory is normally the output of a
            large software team over several years. Yai was built by TexLink Technologies with Claude Code,
            and that is the honest reason a factory in Cambodia has this at all.
          </p>
          <p>
            The second step was the larger one. Digital records still need a person to read them and act. So
            the applications are becoming agentic: a request routes itself to the right approver, a shortage
            raises its own flag, a document reads itself instead of waiting to be typed in. Some are now
            fully AI — you ask in Khmer and the application answers from the factory&apos;s own records.
          </p>
          <p>
            That progression, from paper to digital to agentic, is what Claude Code made affordable. No
            vendor was ever going to build seventy Cambodia-specific factory applications, and no factory was
            ever going to fund a team to do it from scratch.
          </p>
        </Section>

        <Section kicker="The line we do not cross" title="Claude answers the question. A person decides.">
          <p>
            The assistants answer questions from the factory&apos;s records. They do not approve a purchase
            request, sign off an inspection, release a shipment or pay a bill. Where a decision belongs to a
            person, the assistant gives that person what they need and stops.
          </p>
          <p className="rounded-xl border-l-4 bg-white px-5 py-4 text-slate-800" style={{ borderColor: ORANGE_SOFT }}>
            The factory&apos;s records stay on the factory&apos;s own server. Only the slice of data needed
            to answer a question is used, and nothing is retained outside the building.
          </p>
          <p>
            Where the records cannot answer a question, the assistant says so rather than filling the gap.
            An assistant that invents a defect rate is worse than one that admits it does not have today&apos;s
            figure.
          </p>
        </Section>

        <Section kicker="Who is who" title="The parties">
          <p>
            <strong>Yorkmars (Cambodia) Garment Mfg Co., Ltd.</strong> is the garment factory this deployment
            belongs to. <strong>Yai</strong> is the manufacturing platform it runs on.{" "}
            <strong>TexLink Technologies Co., Ltd.</strong> is the Cambodian software house that builds Yai,
            and is a Claude partner.
          </p>
          <p className="text-[15px] text-slate-600">
            The factory commissions the work and its data remains its own. Nothing on this page identifies a
            buyer, a price, a production figure or an individual.
          </p>
        </Section>

        <div className="mt-16 rounded-2xl border border-slate-200 bg-white px-7 py-7">
          <h2 className="text-[20px] font-bold tracking-tight" style={{ color: INK }}>
            Yai
          </h2>
          <p className="mt-2 text-[16px] text-slate-600">
            Manufacturing intelligence for garment factories — about seventy applications across every
            department, with an AI assistant on each. Claude behind all of them, and the factory&apos;s data
            on the factory&apos;s own server.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/experience"
              className="rounded-lg px-4 py-2 text-[15px] font-semibold text-white"
              style={{ backgroundColor: BLUE }}
            >
              See the assistants
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-[15px] font-semibold text-slate-700"
            >
              yaikh.com
            </Link>
          </div>
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-[13px] leading-relaxed text-slate-500">
          Claude, Claude Code and Anthropic are trademarks of Anthropic PBC. This page is published by
          TexLink Technologies Co., Ltd. and describes its own use of Claude; it is not an Anthropic
          publication.
        </footer>
      </main>
    </div>
  );
}
