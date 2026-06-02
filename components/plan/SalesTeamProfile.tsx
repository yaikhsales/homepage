"use client";

/**
 * Sales team profile — populates the body of GTM Enabler bar 02
 * (Marketing & sales personnel).
 *
 * Core idea: this is NOT Microsoft / Google cloud sales work. It is mindset-shift
 * work — convincing factory middle & top management to abandon the old way and
 * step up through Digitalization → Agentic → Full Ai.
 *
 * Capability blend per hire: 60% industry experience · 30% presentation + training
 * · 10% software dev with Ai-native understanding.
 */

type Member = {
  num: string;
  role: string;
  background: string;
  color: string;
};

const TEAM: Member[] = [
  { num: "01", role: "Factory operations",   background: "Floor-level garment factory experience. Speaks the language of mid-management.", color: "#0A3327" },
  { num: "02", role: "Factory operations",   background: "Production-line & WIP-mgmt experience. Credibility with operations heads.",       color: "#0A3327" },
  { num: "03", role: "Legal · HR · Payroll", background: "Compliance, GDT, labour-law fluency. Owns the admin-modules conversation.",       color: "#1E4DAA" },
  { num: "04", role: "Web + App developer",  background: "Ai-native build experience. Demos = working software, not slides.",                color: "#6D4FB6" },
  { num: "05", role: "Web + App developer",  background: "Mobile + AIoT layer. Connects platform value to factory-floor signals.",           color: "#6D4FB6" },
];

const CAPABILITY = [
  { label: "Industry experience",          pct: 60, color: "#0A3327", note: "Knows factory pain because they've lived it." },
  { label: "Presentation + training",      pct: 30, color: "#F37021", note: "The actual job: change minds." },
  { label: "Software / Ai-native fluency", pct: 10, color: "#1E4DAA", note: "Credibility — not the centrepiece." },
];

export function SalesTeamProfile() {
  return (
    <div className="space-y-5">
      {/* What this role is NOT */}
      <div className="rounded-lg border-2 border-yai-orange/40 bg-orange-50/40 p-4">
        <div className="text-[10px] uppercase tracking-wider font-extrabold text-yai-orange mb-1">
          What this role is NOT
        </div>
        <p className="text-sm text-yai-navy leading-snug">
          This is <strong>not</strong> a Microsoft- or Google-Cloud sales role. The job is{" "}
          <strong>mindset shift</strong> — convincing factory middle &amp; top management to abandon
          the old way of working and step up through{" "}
          <span className="font-extrabold" style={{ color: "#F37021" }}>Digitalization</span> →{" "}
          <span className="font-extrabold" style={{ color: "#1E4DAA" }}>Agentic</span> → some
          functions{" "}
          <span className="font-extrabold" style={{ color: "#0A3327" }}>Full Ai</span>.
          Tech buzzwords don&rsquo;t close the deal. Knowing what the factory actually does — does.
        </p>
      </div>

      {/* Capability blend — 60 / 30 / 10 */}
      <div>
        <h5 className="font-extrabold text-yai-navy text-sm mb-2">Capability blend per hire</h5>
        <div className="space-y-1.5">
          {CAPABILITY.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <div className="w-44 text-[12px] font-semibold text-yai-navy shrink-0">
                {c.label}
              </div>
              <div className="flex-1 h-7 rounded bg-gray-100 overflow-hidden relative">
                <div
                  className="h-full flex items-center pl-2 text-[11px] font-extrabold text-white"
                  style={{ width: `${c.pct}%`, background: c.color }}
                >
                  {c.pct}%
                </div>
              </div>
              <div className="w-72 text-[11px] text-gray-600 italic shrink-0">{c.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-person team */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <h5 className="font-extrabold text-yai-navy text-sm">The 5-person sales team</h5>
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            All Claude Code certified
          </span>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {TEAM.map((m) => (
            <li
              key={m.num}
              className="rounded-lg border border-yai-border bg-white p-2.5"
              style={{ borderLeftWidth: 3, borderLeftColor: m.color }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white font-extrabold text-[10px]"
                  style={{ background: m.color }}
                >
                  {m.num}
                </span>
                <div className="text-[12px] font-extrabold text-yai-navy leading-tight">
                  {m.role}
                </div>
              </div>
              <div className="text-[11px] text-gray-600 leading-snug">{m.background}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Closing note */}
      <div className="rounded-lg bg-gray-50 border border-yai-border p-3 text-[11px] text-gray-700 leading-snug">
        <strong>Founder stays the closer.</strong> The team handles awareness, demo, follow-up and
        package conversion. Founder enters when the conversation needs strategic counterpart on the
        other side — multi-factory groups, ministries, strategic partnerships.
      </div>
    </div>
  );
}
