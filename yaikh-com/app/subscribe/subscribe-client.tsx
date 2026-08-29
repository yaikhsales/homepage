"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import MobileNav from "@/components/mobile-nav";

/* AbaPayway is a top-level const inside checkout.prod.js (NOT on window) —
 * referenced as a bare global identifier. */
declare const AbaPayway: { checkout: () => void } | undefined;

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

/* "$1,200" / "+$5,000" → 1200 / 5000. */
const parsePrice = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0;
const formatKhr = (amount: number) => `៛${Math.round(amount).toLocaleString("en-US")}`;

type PayState = "idle" | "opening" | "waiting" | "paid" | "failed" | "verifying";
type InvoiceState = "idle" | "requesting" | "code" | "verifying" | "requested";
type ReceiptState = { status: "posted" | "mock" | "processing" | "pending" | "disabled"; number?: string; url?: string } | null;

const DRAFT_KEY = "yai-subscribe-draft";
const COUNTRIES = ["Cambodia (TexLink / GK SMART)", "Singapore (GGMT PTE LTD)", "Other"];

export default function SubscribeClient({
  initialPaidTran,
  khrPerUsd,
}: {
  initialPaidTran?: string;
  khrPerUsd: number;
}) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(PLANS[0].name);
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [agreed, setAgreed] = useState<boolean[]>(TERMS.map(() => false));
  // Server passes ?paid=<tran> in, so SSR and client agree on the first paint —
  // the "Confirming…" screen shows immediately, no form flash, no hydration error.
  const [payState, setPayState] = useState<PayState>(initialPaidTran ? "verifying" : "idle");
  const [payMsg, setPayMsg] = useState("");
  const [invoiceState, setInvoiceState] = useState<InvoiceState>("idle");
  const [otpRequestId, setOtpRequestId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [receipt, setReceipt] = useState<ReceiptState>(null);
  const [toastDismissing, setToastDismissing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tranIdRef = useRef<string>("");
  const toastDismissTimerRef = useRef<number | null>(null);
  const toastStartXRef = useRef(0);
  const allAgreed = agreed.every(Boolean);

  const dismissToast = useCallback(() => {
    setToastDismissing(true);
    if (toastDismissTimerRef.current) window.clearTimeout(toastDismissTimerRef.current);
    toastDismissTimerRef.current = window.setTimeout(() => {
      setPayMsg("");
      setToastDismissing(false);
      toastDismissTimerRef.current = null;
    }, 280);
  }, []);

  useEffect(() => {
    if (payState !== "failed" || !payMsg) return;
    setToastDismissing(false);
    const dismissTimer = window.setTimeout(dismissToast, 2500);
    return () => {
      window.clearTimeout(dismissTimer);
      if (toastDismissTimerRef.current) window.clearTimeout(toastDismissTimerRef.current);
    };
  }, [dismissToast, payState, payMsg]);

  // Persist the form (company + T&C) so cancelling the ABA popup — which can
  // reload the page — never wipes what the user entered. sessionStorage:
  // survives reload, clears when the tab closes.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const requestedPlan = new URLSearchParams(window.location.search).get("plan");
      const raw = sessionStorage.getItem(DRAFT_KEY);
      const d = raw ? JSON.parse(raw) : null;
      if (d?.selectedPlan && !PLANS.some((p) => p.name === requestedPlan)) setSelectedPlan(d.selectedPlan);
      if (PLANS.some((p) => p.name === requestedPlan)) setSelectedPlan(requestedPlan);
      if (typeof d?.companyName === "string") setCompanyName(d.companyName);
      if (typeof d?.country === "string") setCountry(d.country);
      if (typeof d?.contactName === "string") setContactName(d.contactName);
      if (typeof d?.contactEmail === "string") setContactEmail(d.contactEmail);
      if (Array.isArray(d?.agreed) && d.agreed.length === TERMS.length) setAgreed(d.agreed);
    } catch { /* ignore malformed draft */ }
    setHydrated(true); // flips only after the restored state has committed
  }, []);
  useEffect(() => {
    if (!hydrated) return; // don't save until the draft has been loaded back
    if (payState === "paid" || invoiceState === "requested") { sessionStorage.removeItem(DRAFT_KEY); return; }
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
      selectedPlan, companyName, country, contactName, contactEmail, agreed,
    }));
  }, [hydrated, selectedPlan, companyName, country, contactName, contactEmail, agreed, payState, invoiceState]);

  const plan = PLANS.find((p) => p.name === selectedPlan) || null;
  const amount = plan ? parsePrice(plan.price) : 0;
  const khrAmount = amount * khrPerUsd;
  // The invoice/OTP flow remains in source for the later EcoBoard release.
  // This production release routes every plan through ABA checkout.
  const isInvoicePlan = false;
  const vatKhrAmount = Math.round(khrAmount * 0.1);
  const totalKhrAmount = khrAmount + vatKhrAmount;
  const busy = payState === "opening" || payState === "waiting" || invoiceState === "requesting" || invoiceState === "verifying";

  // ABA "Continue" click redirects here with ?paid=<tran>. Verify it server-side
  // (browser redirect is not proof) before showing the success screen.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tran = params.get("paid");
    if (!tran) return;
    tranIdRef.current = tran;
    (async () => {
      try {
        const r = await fetch("/api/payway/check", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tran_id: tran }),
        }).then((x) => x.json());
        if (r.paid) { setReceipt(r.receipt || null); setPayState("paid"); }
        else { setPayState("failed"); setPayMsg(`Payment not confirmed (status: ${r.status ?? "pending"}).`); }
      } catch { setPayState("failed"); setPayMsg("Could not verify payment."); }
      // strip the query param so a refresh doesn't re-trigger
      window.history.replaceState({}, "", "/subscribe");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll server-side check-transaction just to nudge the payer — we do NOT flip
  // to the success screen here. That only happens when they click "Continue" in
  // ABA's own window, which redirects to /subscribe?paid=<tran> (handled on mount).
  const startPolling = (tranId: string, lifetimeMinutes = 5) => {
    if (pollRef.current) clearInterval(pollRef.current);
    const started = Date.now();
    const pollCeilingMs = lifetimeMinutes * 60_000;
    let checkInFlight = false;
    pollRef.current = setInterval(async () => {
      if (checkInFlight) return;
      const lifetimeExpired = Date.now() - started >= pollCeilingMs;
      checkInFlight = true;
      try {
        const r = await fetch("/api/payway/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tran_id: tranId }),
        }).then((x) => x.json());
        if (r.paid) {
          clearInterval(pollRef.current!);
          // Confirmed paid, but do NOT flip to our success screen here — ABA's own
          // success sheet ("Continues" button) may still be open in-page. We only
          // advance on: (a) the Continue redirect ?paid=<tran>, or (b) the refocus
          // check, which fires only when the payer left to the ABA app and returned.
          setPayMsg("Payment received — tap Continue to finish.");
        } else if (lifetimeExpired) {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setPayState("failed");
          setPayMsg(`This payment session expired after ${lifetimeMinutes} minutes. Please start again.`);
        }
      } catch {
        if (lifetimeExpired) {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setPayState("failed");
          setPayMsg("The payment session ended, but its final status could not be verified. Please check the merchant portal.");
        }
      }
      finally { checkInFlight = false; }
    }, 3000);
  };

  const fail = (msg: string, anchor: string) => {
    setPayState("failed"); setPayMsg(msg);
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const validateSubscription = () => {
    if (!plan || amount <= 0) { fail("Pick a plan above first.", "plans"); return false; }
    if (!companyName.trim()) { fail("Enter your company name.", "company"); return false; }
    if (!contactName.trim()) { fail("Enter a primary contact name.", "company"); return false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail.trim())) { fail("Enter a valid contact email.", "company"); return false; }
    if (!allAgreed) { fail("Please agree to all terms below before continuing.", "terms"); return false; }
    return true;
  };

  const requestInvoiceOtp = async () => {
    if (!validateSubscription() || !plan) return;
    setInvoiceState("requesting"); setPayMsg("");
    try {
      const response = await fetch("/api/subscription/otp/request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: plan.name, companyName, country, contactName, contactEmail, agreed: allAgreed }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send a verification code.");
      setOtpRequestId(data.requestId); setOtpCode(""); setInvoiceState("code");
    } catch (error) {
      setInvoiceState("idle"); fail(error instanceof Error ? error.message : "Could not send a verification code.", "payment");
    }
  };

  const verifyInvoiceOtp = async () => {
    if (!otpRequestId || !/^\d{6}$/.test(otpCode)) return fail("Enter the six-digit code we emailed you.", "payment");
    setInvoiceState("verifying"); setPayMsg("");
    try {
      const response = await fetch("/api/subscription/otp/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: otpRequestId, code: otpCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create the invoice request.");
      setInvoiceNumber(data.invoiceNumber || ""); setInvoiceState("requested");
    } catch (error) {
      setInvoiceState("code"); fail(error instanceof Error ? error.message : "Could not verify the code.", "payment");
    }
  };

  const payWithAba = async (payment_option: "" | "abapay_khqr" | "cards" = "") => {
    if (!plan || !validateSubscription()) return;
    setPayState("opening"); setPayMsg("");
    try {
      const signed = await fetch("/api/payway/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactEmail, payment_option,
          plan: plan.name, company: companyName, country, contact_name: contactName,
        }),
      }).then((r) => r.json());
      if (!signed?.params?.hash) throw new Error(signed?.error || "sign failed");

      // Fill the hidden ABA form with the signed params.
      const form = formRef.current!;
      form.action = signed.action;
      form.replaceChildren();
      for (const [k, v] of Object.entries(signed.params as Record<string, string>)) {
        const inp = document.createElement("input");
        inp.type = "hidden"; inp.name = k; inp.value = v;
        form.appendChild(inp);
      }
      tranIdRef.current = signed.params.tran_id;

      if (typeof AbaPayway === "undefined") throw new Error("ABA checkout script not loaded — retry in a moment");
      AbaPayway.checkout();
      setPayState("waiting");
      const lifetimeMinutes = Number.parseInt(signed.params.lifetime || "5", 10);
      startPolling(
        signed.params.tran_id,
        Number.isFinite(lifetimeMinutes) && lifetimeMinutes > 0 ? lifetimeMinutes : 5,
      );
    } catch (e) {
      setPayState("failed");
      setPayMsg(e instanceof Error ? e.message : "Payment could not be started");
    }
  };

  // ABA just redirected back with ?paid — show a confirming screen while the
  // server-side check runs, so the subscription form never flashes.
  if (payState === "verifying") return <VerifyingPayment />;

  // Full-screen confirmation once the payment is verified paid.
  if (payState === "paid") {
    return (
      <PaymentSuccess
        plan={plan?.name ?? null}
        amount={amount}
        khrAmount={khrAmount}
        vatKhrAmount={vatKhrAmount}
        totalKhrAmount={totalKhrAmount}
        company={companyName}
        tranId={tranIdRef.current}
        receipt={receipt}
      />
    );
  }

  if (invoiceState === "requested") {
    return <InvoiceRequestSuccess plan={plan?.name ?? null} email={contactEmail} invoiceNumber={invoiceNumber} />;
  }

  return (
    <main className="min-h-screen bg-yai-bg text-yai-navy">
      {payState === "failed" && payMsg && (
        <button
          type="button"
          role="alert"
          onClick={dismissToast}
          onTouchStart={(event) => { toastStartXRef.current = event.touches[0]?.clientX ?? 0; }}
          onTouchEnd={(event) => {
            const endX = event.changedTouches[0]?.clientX ?? toastStartXRef.current;
            if (Math.abs(endX - toastStartXRef.current) > 48) dismissToast();
          }}
          aria-label={`Dismiss notification: ${payMsg}`}
          className={`fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-800 shadow-lg shadow-red-950/10 transition-[transform,opacity] duration-300 ease-out touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${toastDismissing ? "translate-x-[calc(100%+1rem)] opacity-0" : "translate-x-0 opacity-100"}`}
        >
          <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">!</span>
          <p className="flex-1 leading-5">{payMsg}</p>
        </button>
      )}
      {/* Mobile nav */}
      <MobileNav hideLogin={false} />

      {/* Desktop header bar */}
      <div className="hidden lg:block bg-yai-navy text-white fixed top-0 inset-x-0 z-40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold hover:text-yai-orange transition">
            Yai
          </Link>
          <div className="flex items-center gap-8 text-sm">
            <Link href="/" className="text-white/70 hover:text-yai-orange transition">← Back to home</Link>
            <a href="https://main.yaikh.com/login" className="px-4 py-2 rounded-full bg-yai-orange text-white hover:bg-yai-orange/90 transition text-xs font-bold">LOGIN</a>
          </div>
        </div>
      </div>

      {/* Spacer for desktop nav */}
      <div className="hidden lg:block h-16" />

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
      <div id="plans" className="max-w-6xl mx-auto px-6 mt-8 scroll-mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLANS.map((p) => {
            const active = selectedPlan === p.name;
            const baseKhrAmount = parsePrice(p.price) * khrPerUsd;
            return (
              <button
                key={p.name}
                onClick={() => { setSelectedPlan(p.name); setInvoiceState("idle"); setOtpRequestId(""); setOtpCode(""); }}
                className={`text-left p-4 rounded-xl border-2 transition bg-gradient-to-br ${p.accent} ${
                  active ? "border-yai-navy shadow-lg scale-[1.02]" : "border-transparent hover:border-yai-navy/30 hover:shadow"
                }`}
              >
                <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-yai-navy/60">{p.step}</div>
                <div className="font-bold text-yai-navy mt-1">{p.name}</div>
                <div className="text-[12px] text-yai-navy/70 mt-0.5">{p.users}</div>
                <div className="mt-3">
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-yai-navy">
                        {formatKhr(baseKhrAmount)}
                      </span>
                      <span className="text-[11px] text-yai-navy/60">{p.period}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-yai-navy/55">{p.price} USD {p.period}</p>
                  </>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Company / contact */}
      <div id="company" className="max-w-6xl mx-auto px-6 mt-10 scroll-mt-6">
        <h2 className="font-serif text-2xl font-semibold text-yai-navy mb-4">1. Your company</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Company name">
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input" placeholder="TexLink Technologies Co., Ltd." />
          </Field>
          <Field label="Country / entity">
            <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
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

      {/* Payment — ABA PayWay hosted checkout (card · KHQR · ABA Mobile) */}
      <div id="payment" className="max-w-6xl mx-auto px-6 mt-10 scroll-mt-6">
        <h2 className="font-serif text-2xl font-semibold text-yai-navy mb-4">2. Payment</h2>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 max-w-md shadow-sm">
          {/* header */}
          <div className="pb-4 border-b border-gray-100">
            <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-gray-400">Choose way to pay</div>
          <div className="font-semibold text-yai-navy mt-0.5">
            {plan ? (
              <>
                <span>{plan.name} · {formatKhr(totalKhrAmount)}</span>
                <span className="mt-0.5 block text-[11px] font-normal text-yai-navy/55">
                  {`${formatKhr(khrAmount)} + 10% VAT · fixed at ៛${khrPerUsd.toLocaleString()} / USD`}
                </span>
              </>
            ) : "Select a plan above"}
          </div>
          </div>

          {isInvoicePlan ? (
            <div className="mt-4">
              {invoiceState === "code" || invoiceState === "verifying" ? (
                <div className="space-y-3">
                  <p className="text-sm leading-5 text-gray-600">We sent a six-digit verification code to <span className="font-semibold text-yai-navy">{contactEmail}</span>. Verify it before we send your invoice request to our team.</p>
                  <input aria-label="Verification code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="input tracking-[0.3em] text-center font-semibold" placeholder="000000" />
                  <div className="flex gap-3">
                    <button type="button" onClick={verifyInvoiceOtp} disabled={busy} className="flex-1 rounded-xl bg-yai-navy px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-50">{invoiceState === "verifying" ? "Verifying…" : "Verify & request invoice"}</button>
                    <button type="button" onClick={requestInvoiceOtp} disabled={busy} className="rounded-xl border border-yai-navy/20 px-4 py-3 text-sm font-semibold text-yai-navy transition hover:bg-yai-navy/5 disabled:opacity-50">Resend</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm leading-5 text-gray-600">This advanced plan is invoiced by our team. Verify your email first; we will send the invoice and arrange payment with you.</p>
                  <button type="button" onClick={requestInvoiceOtp} disabled={busy} className="w-full rounded-xl bg-yai-navy px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-50">{invoiceState === "requesting" ? "Sending code…" : "Continue"}</button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-yai-navy/10 bg-yai-navy/[0.03] p-3 text-[12px] text-yai-navy">
                <div className="font-semibold uppercase tracking-[0.12em] text-[10px] text-yai-navy/60">VAT receipt preview</div>
                <div className="mt-2 flex justify-between"><span>Subscription subtotal</span><span>{formatKhr(khrAmount)}</span></div>
                <div className="mt-1 flex justify-between"><span>VAT (10%)</span><span>{formatKhr(vatKhrAmount)}</span></div>
                <div className="mt-2 flex justify-between border-t border-yai-navy/10 pt-2 font-bold"><span>Total due</span><span>{formatKhr(totalKhrAmount)}</span></div>
              </div>
              <PayMethodRow onClick={() => payWithAba("abapay_khqr")} disabled={busy} title="ABA KHQR" subtitle="Scan to pay with any banking app" icon={<KhqrMark />} />
            </div>
          )}

          {payState !== "failed" && payMsg && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-800">{payMsg}</div>
          )}
        </div>
      </div>
      {!isInvoicePlan && <>
        <form ref={formRef} method="POST" target="aba_webservice" id="aba_merchant_request" style={{ display: "none" }} />
        <Script src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="afterInteractive" />
        <Script src="https://checkout.payway.com.kh/plugins/checkout2-0.js" strategy="afterInteractive" />
      </>}

      {/* Terms */}
      <div id="terms" className="max-w-6xl mx-auto px-6 mt-10 scroll-mt-6">
        <h2 className="font-serif text-2xl font-semibold text-yai-navy mb-4">3. Terms &amp; conditions</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-3xl">
          <p className="text-[12px] text-gray-500 italic mb-3">
            Working draft. Final MSA and Privacy Policy will be linked here before launch.
          </p>
          <ul className="space-y-2">
            {TERMS.map((t, i) => {
              const isMasterAgreement = i === TERMS.length - 1;
              return (
                <li
                  key={i}
                  className={isMasterAgreement ? "mt-4 border-t border-yai-navy/15 pt-4" : ""}
                >
                  <label className="flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={isMasterAgreement ? allAgreed : agreed[i]}
                      onChange={() => {
                        if (isMasterAgreement) {
                          setAgreed(prev => prev.every(Boolean) ? prev.map(() => false) : prev.map(() => true));
                          return;
                        }
                        setAgreed(prev => prev.map((v, j) => j === i ? !v : v));
                      }}
                      className="mt-1 h-4 w-4 shrink-0 accent-yai-orange"
                    />
                    <span className={isMasterAgreement ? "text-sm font-medium text-yai-navy" : "text-sm text-yai-navy/90"}>
                      {t}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Summary */}
      <div className="max-w-6xl mx-auto px-6 mt-8 mb-16 text-sm text-gray-600">
        Selected: <span className="font-semibold text-yai-navy">{selectedPlan || "(none)"}</span>
          {plan && (
            <span className="ml-2 text-yai-navy">
              · {formatKhr(totalKhrAmount)}
              <span className="ml-1 text-xs text-yai-navy/55">(includes 10% VAT)</span>
              <span className="ml-1 text-xs text-yai-navy/55">(${amount.toLocaleString()} USD)</span>
            </span>
          )}
        {!allAgreed && <span className="ml-3 text-amber-600">· agree to all terms, then pay above</span>}
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

/* Shown after ABA's "Continues" redirect while we confirm the payment
 * server-side — prevents the subscription form from flashing back first. */
function VerifyingPayment() {
  return (
    <main className="min-h-screen bg-yai-bg text-yai-navy flex flex-col">
      <MobileNav hideLogin={true} />
      <div className="hidden lg:block bg-yai-navy text-white fixed top-0 inset-x-0 z-40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-serif text-2xl font-semibold">Yai</span>
        </div>
      </div>
      <div className="hidden lg:block h-16" />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full border-[3px] border-yai-navy/15 border-t-yai-orange animate-spin" />
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-yai-orange">Confirming payment</p>
          <p className="mt-2 text-gray-600">Hold on a moment — we&apos;re verifying your transaction.</p>
        </div>
      </div>
    </main>
  );
}

function InvoiceRequestSuccess({
  plan, email, invoiceNumber,
}: {
  plan: string | null; email: string; invoiceNumber: string;
}) {
  return (
    <main className="min-h-screen bg-yai-bg text-yai-navy flex flex-col">
      <MobileNav hideLogin={false} />
      <div className="hidden lg:block bg-yai-navy text-white fixed top-0 inset-x-0 z-40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold hover:text-yai-orange transition">Yai</Link>
          <Link href="/" className="text-sm text-white/70 hover:text-yai-orange transition">← Back to home</Link>
        </div>
      </div>
      <div className="hidden lg:block h-16" />
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-yai-orange">Email verified</p>
          <h1 className="font-serif text-3xl font-semibold text-yai-navy mt-2">Invoice request received.</h1>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Our commerce team has received your {plan || "cloud subscription"} request. We will send the invoice and payment instructions to {email || "your contact email"}.
          </p>
          {invoiceNumber && <p className="mt-5 text-sm text-gray-500">Invoice reference: <span className="font-semibold text-yai-navy">{invoiceNumber}</span></p>}
        </div>
      </div>
    </main>
  );
}

/* Professional post-payment confirmation screen. */
function PaymentSuccess({
  plan, amount, khrAmount, vatKhrAmount, totalKhrAmount, company, tranId, receipt,
}: {
  plan: string | null; amount: number; khrAmount: number; vatKhrAmount: number; totalKhrAmount: number;
  company: string; tranId: string; receipt: ReceiptState;
}) {
  return (
    <main className="min-h-screen bg-yai-bg text-yai-navy flex flex-col">
      <MobileNav hideLogin={false} />
      <div className="hidden lg:block bg-yai-navy text-white fixed top-0 inset-x-0 z-40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold hover:text-yai-orange transition">Yai</Link>
          <Link href="/" className="text-sm text-white/70 hover:text-yai-orange transition">← Back to home</Link>
        </div>
      </div>
      <div className="hidden lg:block h-16" />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-10 text-center">
          {/* check mark */}
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-yai-orange">Payment received</p>
          <h1 className="font-serif text-3xl font-semibold text-yai-navy mt-2">Thank you{company ? `, ${company}` : ""}.</h1>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Your payment has been confirmed. Our team will prepare your onboarding and workspace.
          </p>

          {/* summary */}
          <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left text-sm divide-y divide-gray-100">
            {plan && <Row label="Plan" value={plan} />}
          <Row label="Subscription subtotal" value={`${formatKhr(khrAmount)}`} />
          <Row label="VAT (10%)" value={`${formatKhr(vatKhrAmount)}`} />
          <Row label="Amount paid" value={`${formatKhr(totalKhrAmount)}`} />
          {tranId && <Row label="Reference" value={tranId} mono />}
          </div>

          <p className="text-[12px] text-gray-400 mt-5">
            Keep your reference number for your records. Contact <a href="mailto:gamini@yaikh.com" className="text-yai-navy underline">gamini@yaikh.com</a> if you need help.
          </p>

          <Link href="/" className="inline-block mt-6 px-6 py-3 rounded-lg text-sm font-semibold bg-yai-navy text-white hover:shadow-md transition">
            Return to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 first:pt-0 last:pb-0 gap-4">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold text-yai-navy text-right ${mono ? "font-mono text-[13px]" : ""}`}>{value}</span>
    </div>
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

/* A single payment-method row, styled to match ABA PayWay's official
 * "Choose way to pay" chooser: icon · title/subtitle · chevron. */
function PayMethodRow({
  onClick, disabled, title, subtitle, icon,
}: {
  onClick: () => void; disabled?: boolean;
  title: string; subtitle: React.ReactNode; icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-3.5 text-left p-3.5 rounded-xl border border-gray-200 bg-white
                 hover:border-yai-navy hover:shadow-md transition disabled:opacity-50 disabled:cursor-wait
                 focus:outline-none focus:ring-2 focus:ring-yai-navy/30 group"
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-yai-navy text-[15px] leading-tight">{title}</span>
        {/* ABA guideline: description text grey #697386, 4px below title */}
        <span className="block text-xs text-[#697386] mt-1">{subtitle}</span>
      </span>
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-300 group-hover:text-yai-navy transition shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ABA KHQR mark — official SVG exported from ABA's Merchant Integration Guideline Figma. */
function KhqrMark() {
  return <img src="/brand/aba-khqr.svg" alt="ABA KHQR" className="w-12 h-12 rounded-lg" />;
}

/* Teal card icon — official SVG from ABA's Figma, sized to match KHQR square. */
function CardMark() {
  return <img src="/brand/aba-card.svg" alt="Card" className="w-12 h-12 rounded-lg" />;
}

/* Accepted card networks — official brand SVGs from ABA's Figma. */
function CardBrands() {
  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <img src="/brand/visa.svg" alt="Visa" className="h-[14px] w-auto rounded-[2px]" />
      <img src="/brand/mastercard.svg" alt="Mastercard" className="h-[14px] w-auto rounded-[2px]" />
      <img src="/brand/unionpay.svg" alt="UnionPay" className="h-[14px] w-auto rounded-[2px] border border-gray-100" />
      <img src="/brand/jcb.svg" alt="JCB" className="h-[14px] w-auto rounded-[2px] border border-gray-100" />
    </span>
  );
}
