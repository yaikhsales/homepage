"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Plan summary mirrors the pricing ladder on the homepage.
 *   Stub for now — visual matches the 6-step chart at a glance; the
 *   real picker / per-step nuances come in a follow-up pass. ────── */
const PLANS = [
  { step: "Step 1", name: "Cloud · Starter",    users: "5 key members",     price: "$120",    period: "/year",       accent: "from-blue-100 to-blue-50" },
  { step: "Step 2", name: "Cloud · Growth",     users: "5 – 300 users",     price: "$750",    period: "/year",       accent: "from-blue-200 to-blue-100" },
  { step: "Step 3", name: "Cloud · Enterprise", users: "300 – 1,000 users", price: "$1,200",  period: "/year",       accent: "from-blue-300 to-blue-200" },
  { step: "Step 4", name: "Ai Server",          users: "Hardware · 1,000+ users", price: "$2,500", period: "one-time", accent: "from-indigo-200 to-indigo-100" },
  { step: "Step 5", name: "Agentic",            users: "After ~6 months",   price: "+$5,000", period: "/year · 10 agents + 35 mini", accent: "from-purple-200 to-purple-100" },
  { step: "Step 6", name: "Big Ai Brain",       users: "Boss · after ~1 year", price: "+$5,000", period: "/year · talks across 5+ factories", accent: "from-orange-200 to-orange-100" },
];

const TERMS = [
  "I confirm the company information above is accurate and I am authorised to subscribe on its behalf.",
  "Annual subscription auto-renews on the anniversary unless cancelled with 30 days written notice.",
  "Yai stores chat history, documents, and agent state in the cloud region selected at onboarding (default: Singapore).",
  "Hardware orders (Ai Server step) ship FOB Phnom Penh; on-site installation by a Yai engineer included.",
  "Refund window: 14 days from the first paid invoice for cloud tiers; hardware is non-refundable after shipment.",
  "I have read and accept the Yai Master Services Agreement and Privacy Policy.",
];

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>("Step 1");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName]     = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc]       = useState("");
  const [payMethod, setPayMethod]   = useState<"card" | "khqr">("card");
  const [agreed, setAgreed] = useState<boolean[]>(TERMS.map(() => false));
  const allAgreed = agreed.every(Boolean);

  const submit = () => {
    if (!allAgreed) { alert("Please agree to all terms first."); return; }
    if (!selectedPlan) { alert("Pick a plan."); return; }
    alert(`Subscription stub — selected ${selectedPlan}. Wiring the real backend next.`);
  };

  return (
    <main className="min-h-screen bg-yai-bg text-yai-navy">
      {/* Header bar */}
      <div className="bg-yai-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold hover:text-yai-orange transition">
            Yai
          </Link>
          <Link href="/" className="text-sm text-white/70 hover:text-yai-orange transition">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-yai-orange">Subscribe</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-yai-navy mt-2">
          Every great march starts with one step.
        </h1>
        <p className="text-base text-gray-600 mt-3 max-w-2xl">
          Pick a starting plan. You can climb a step at any time — the same engineering base carries you from
          the simplest cloud tier to the full Big Ai Brain.
        </p>
      </div>

      {/* Plan picker — compact mirror of the pricing ladder */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLANS.map((p) => {
            const active = selectedPlan === p.name;
            return (
              <button
                key={p.name}
                onClick={() => setSelectedPlan(p.name)}
                className={`text-left p-4 rounded-xl border-2 transition bg-gradient-to-br ${p.accent} ${
                  active ? "border-yai-navy shadow-lg scale-[1.02]" : "border-transparent hover:border-yai-navy/30 hover:shadow"
                }`}
              >
                <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-yai-navy/60">{p.step}</div>
                <div className="font-bold text-yai-navy mt-1">{p.name}</div>
                <div className="text-[12px] text-yai-navy/70 mt-0.5">{p.users}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-yai-navy">{p.price}</span>
                  <span className="text-[11px] text-yai-navy/60">{p.period}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Company / contact */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <h2 className="font-serif text-2xl font-semibold text-yai-navy mb-4">1. Your company</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Company name">
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input" placeholder="TexLink Technologies Co., Ltd." />
          </Field>
          <Field label="Country / entity">
            <select className="input">
              <option>Cambodia (TexLink / GK SMART)</option>
              <option>Singapore (GGMT PTE LTD)</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Primary contact name">
            <input value={contactName} onChange={(e) => setContactName(e.target.value)} className="input" placeholder="Sok Pisey" />
          </Field>
          <Field label="Contact email">
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="input" type="email" placeholder="ops@your-company.com" />
          </Field>
        </div>
      </div>

      {/* Payment */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <h2 className="font-serif text-2xl font-semibold text-yai-navy mb-4">2. Payment</h2>

        {/* Method tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setPayMethod("card")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition border-2 ${
              payMethod === "card" ? "bg-yai-navy text-white border-yai-navy" : "bg-white text-yai-navy border-gray-200 hover:border-yai-navy/40"
            }`}
          >Credit / Debit card</button>
          <button
            onClick={() => setPayMethod("khqr")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition border-2 ${
              payMethod === "khqr" ? "bg-yai-navy text-white border-yai-navy" : "bg-white text-yai-navy border-gray-200 hover:border-yai-navy/40"
            }`}
          >KHQR</button>
        </div>

        {payMethod === "card" && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 grid sm:grid-cols-2 gap-4 max-w-2xl">
            <Field label="Card number" cols={2}>
              <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="input font-mono" placeholder="1234 5678 9012 3456" maxLength={19} />
            </Field>
            <Field label="Cardholder name" cols={2}>
              <input value={cardName} onChange={(e) => setCardName(e.target.value)} className="input" placeholder="As shown on the card" />
            </Field>
            <Field label="Expiry (MM/YY)">
              <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="input font-mono" placeholder="MM/YY" maxLength={5} />
            </Field>
            <Field label="CVC">
              <input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="input font-mono" placeholder="123" maxLength={4} />
            </Field>
            <p className="sm:col-span-2 text-[11px] text-gray-500 italic">
              Payments are processed by our acquirer (Wing Bank · ABA · Stripe — final routing decided at onboarding).
              Card details are tokenised at the bank gateway and never stored by Yai.
            </p>
          </div>
        )}

        {payMethod === "khqr" && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-2xl">
            <div className="flex items-start gap-5">
              {/* KHQR placeholder — real QR generated server-side when wired */}
              <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border-2 border-slate-300 flex items-center justify-center relative">
                {/* fake QR pattern */}
                <svg viewBox="0 0 32 32" className="w-36 h-36 text-yai-navy">
                  {Array.from({ length: 32 }).flatMap((_, r) =>
                    Array.from({ length: 32 }).map((_, c) => {
                      // deterministic noisy pattern — not a real QR
                      const v = ((r * 7 + c * 13 + r * c) % 7) < 3;
                      const corner = (r < 7 && c < 7) || (r < 7 && c > 24) || (r > 24 && c < 7);
                      return v || corner ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="currentColor" /> : null;
                    })
                  )}
                </svg>
                <div className="absolute bottom-1 right-1 bg-yai-orange text-white text-[9px] px-1.5 py-0.5 rounded font-bold">KHQR</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-yai-navy">Scan to pay</div>
                <p className="text-sm text-gray-600 mt-1">
                  Open any Cambodian bank app (ABA, Wing, Acleda, Chip Mong, etc.) and scan the KHQR code to pay
                  the selected plan in KHR or USD.
                </p>
                <div className="mt-3 text-[12px] bg-amber-50 border border-amber-200 text-amber-800 rounded p-2">
                  Stub — the real QR is generated against the chosen plan + an order ID once we wire the bank acquirer.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <h2 className="font-serif text-2xl font-semibold text-yai-navy mb-4">3. Terms &amp; conditions</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-3xl">
          <p className="text-[12px] text-gray-500 italic mb-3">
            Working draft. Final MSA and Privacy Policy will be linked here before launch.
          </p>
          <ul className="space-y-2">
            {TERMS.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreed[i]}
                  onChange={() => setAgreed(prev => prev.map((v, j) => j === i ? !v : v))}
                  className="mt-1 w-4 h-4 accent-yai-orange shrink-0"
                />
                <span className="text-sm text-yai-navy/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Submit */}
      <div className="max-w-6xl mx-auto px-6 mt-8 mb-16 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Selected: <span className="font-semibold text-yai-navy">{selectedPlan || "(none)"}</span>
          {!allAgreed && <span className="ml-3 text-amber-600">· agree to all terms to continue</span>}
        </div>
        <button
          onClick={submit}
          disabled={!allAgreed || !selectedPlan}
          className={`px-6 py-3 rounded-lg text-base font-semibold transition shadow-md ${
            allAgreed && selectedPlan ? "bg-yai-orange text-white hover:shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Confirm subscription
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 14px;
          background: white;
          color: #0F2A55;
          outline: none;
          transition: border-color 150ms;
        }
        .input:focus {
          border-color: #F37021;
        }
      `}</style>
    </main>
  );
}

function Field({ label, children, cols }: { label: string; children: React.ReactNode; cols?: number }) {
  return (
    <label className={`block ${cols === 2 ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs font-semibold text-yai-navy/70 mb-1">{label}</span>
      {children}
    </label>
  );
}
