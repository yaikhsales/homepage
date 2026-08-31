"use client";

/* ABA PayWay — merchant payment console.
 * Required by ABA before onboarding: a UI to collect payment (QR API),
 * see the transaction list, drill into a transaction, and refund.
 * All calls go to admin-gated /api/payway/merchant/* routes; the API key
 * and signing stay server-side. */

import { useState, useRef, useCallback, useEffect } from "react";

type Tab = "transactions" | "collect";

export default function PaymentsPage() {
  const [tab, setTab] = useState<Tab>("transactions");
  return (
    <div className="p-4 sm:p-8 w-full">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">Yai · Back-end</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">ABA PayWay</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <TabBtn active={tab === "transactions"} onClick={() => setTab("transactions")}>Transactions &amp; refund</TabBtn>
        <TabBtn active={tab === "collect"} onClick={() => setTab("collect")}>Generate QR</TabBtn>
      </div>

      {tab === "transactions" ? <Transactions /> : <Collect />}

      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 14px;
          background: white;
          color: #0f2a55;
          outline: none;
          transition: border-color 150ms;
        }
        .input:focus { border-color: #f37021; }
      `}</style>
    </div>
  );
}

/* ─── Collect payment via QR API ─────────────────────────────────────── */
function Collect() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"USD" | "KHR">("KHR");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qr, setQr] = useState<{ img: string; tran: string } | null>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPoll = () => { if (pollRef.current) clearInterval(pollRef.current); pollRef.current = null; };

  // Cache the generated QR so switching tabs (which unmounts this component) or
  // reloading doesn't lose it — cleared only when the merchant clicks Clear.
  const QR_KEY = "yai-payway-qr";
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(QR_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.qr?.img) {
          setQr(d.qr); setStatus(d.status || "PENDING");
          if (d.status !== "APPROVED") pollStatus(d.qr.tran); // resume live polling
        }
      }
    } catch { /* ignore */ }
    return stopPoll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearQr = () => { stopPoll(); setQr(null); setStatus(""); sessionStorage.removeItem(QR_KEY); };
  const persist = (qrObj: { img: string; tran: string } | null, st: string) => {
    if (qrObj) sessionStorage.setItem(QR_KEY, JSON.stringify({ qr: qrObj, status: st }));
  };

  const generate = async () => {
    setErr(""); setStatus(""); setQr(null); stopPoll();
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) { setErr("Enter a valid amount."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/payway/merchant/qr", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, currency, first_name: name, email }),
      }).then((x) => x.json());
      // QR API success: status.code === 0 (number)
      const code = r?.status?.code;
      const img = r?.qrImage;
      if ((code === 0 || code === "0" || code === "00") && img) {
        const qrObj = { img, tran: r.sent_tran_id };
        setQr(qrObj); setStatus("PENDING");
        persist(qrObj, "PENDING");
        pollStatus(r.sent_tran_id);
      } else {
        setErr(r?.status?.message || r?.error || "Could not generate QR.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed.");
    } finally { setBusy(false); }
  };

  const pollStatus = (tran: string) => {
    const started = Date.now();
    pollRef.current = setInterval(async () => {
      if (Date.now() - started > 5 * 60_000) { stopPoll(); return; }
      try {
        const r = await fetch("/api/payway/check", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tran_id: tran }),
        }).then((x) => x.json());
        if (r.paid) { setStatus("APPROVED"); setQr((q) => { if (q) persist(q, "APPROVED"); return q; }); stopPoll(); }
        else if (r.status) { const s = String(r.status).toUpperCase(); setStatus(s); setQr((q) => { if (q) persist(q, s); return q; }); }
      } catch { /* keep polling */ }
    }, 3000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-yai-navy mb-4">New payment</h2>
        <label className="block mb-3">
          <span className="block text-xs font-semibold text-yai-navy/70 mb-1">Amount</span>
          <div className="flex gap-2">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal"
              className="input" style={{ flex: 1 }} placeholder="120.00" />
            <select value={currency} onChange={(e) => setCurrency(e.target.value as "USD" | "KHR")}
              className="input" style={{ width: "5.5rem", flex: "none" }}>
              <option>KHR</option><option>USD</option>
            </select>
          </div>
        </label>
        <label className="block mb-3">
          <span className="block text-xs font-semibold text-yai-navy/70 mb-1">Customer name (optional)</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Sok Pisey" />
        </label>
        <label className="block mb-4">
          <span className="block text-xs font-semibold text-yai-navy/70 mb-1">Customer email (optional)</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder="ops@company.com" />
        </label>
        <button onClick={generate} disabled={busy}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${busy ? "bg-gray-300 text-gray-500" : "bg-yai-navy text-white hover:shadow-md"}`}>
          {busy ? "Generating…" : "Generate KHQR"}
        </button>
        {err && <div className="mt-3 text-[13px] bg-red-50 border border-red-200 text-red-700 rounded-lg p-2.5">{err}</div>}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center min-h-[280px]">
        {!qr ? (
          <p className="text-sm text-gray-400 text-center">The KHQR appears here.<br />Customer scans it with any bank app.</p>
        ) : (
          <>
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gray-500">{qr.tran}</span>
              <StatusPill status={status} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr.img} alt="KHQR" className="w-56 h-56 object-contain" />
            <p className="text-[12px] text-gray-500 mt-3 text-center">Scan with ABA Mobile or any KHQR bank app.</p>
            <button onClick={clearQr}
              className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 transition">
              Clear QR
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Transactions list + detail + refund ────────────────────────────── */
interface Txn {
  tran_id: string; amount?: string | number; currency?: string; status?: string;
  date?: string; payType?: string; refunded?: string | number;
  company?: string; plan?: string; source?: string;
  contact_name?: string; email?: string; paid_at?: string;
  raw: Record<string, unknown>;
}

function Transactions() {
  const [rows, setRows] = useState<Txn[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [detail, setDetail] = useState<Txn | null>(null);
  const [checking, setChecking] = useState<string | null>(null);
  const [src, setSrc] = useState<"ledger" | "aba">("aba");
  // Default window in ICT days — a UTC "today" is yesterday for the first 7
  // hours of a Cambodian day, which would silently hide the newest payments.
  const today = ictDay(Date.now());
  const monthAgo = ictDay(Date.now() - 30 * 86400_000);
  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(today);

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      // 1) Prefer our durable Mongo ledger — no 3-day cap, has customer details.
      const m = await fetch("/api/payway/merchant/payments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: ictDayStart(from), to: ictDayEnd(to) }),
      }).then((x) => x.json());
      if (m?.enabled) {
        setSrc("ledger");
        setRows((m.rows as Record<string, unknown>[]).map(mapLedger));
        return;
      }

      // 2) Fallback: ABA live list — capped at 3 days, so clamp the window.
      setSrc("aba");
      const fromAba = ictDay(Date.now() - 2 * 86400_000);
      const r = await fetch("/api/payway/merchant/transactions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_date: `${fromAba} 00:00:00`, to_date: `${to} 23:59:59` }),
      }).then((x) => x.json());
      const code = r?.status?.code;
      if (code != null && code !== "00" && code !== 0 && code !== "0" && !r?.data) {
        setErr(r?.status?.message || r?.error || `Error ${code}`); setRows(null); return;
      }
      setRows(extractTxns(r));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed.");
    } finally { setLoading(false); }
  }, [from, to]);

  // Load on mount — the list is the landing view, no click needed.
  useEffect(() => { load(); }, [load]);

  // Re-check one transaction's live status against ABA.
  const checkOne = async (t: Txn) => {
    setChecking(t.tran_id);
    try {
      const r = await fetch("/api/payway/check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tran_id: t.tran_id }),
      }).then((x) => x.json());
      if (r.status || r.paid) {
        setRows((prev) => prev?.map((row) =>
          row.tran_id === t.tran_id ? { ...row, status: r.paid ? "APPROVED" : String(r.status ?? row.status) } : row) ?? prev);
      }
    } finally { setChecking(null); }
  };

  const expiredCount = rows?.filter((t) => String(t.status).toUpperCase() === "EXPIRED").length ?? 0;
  const [showExpired, setShowExpired] = useState(false);
  const displayedRows = (rows ?? []).filter(
    (t) => showExpired || String(t.status).toUpperCase() !== "EXPIRED",
  );
  const approved = displayedRows.filter((t) => String(t.status).toUpperCase().includes("APPROVE"));
  const collected = approved.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const pending = displayedRows.filter((t) => String(t.status).toUpperCase().includes("PEND")).length;

  // Client-side filter + sort — the range is ≤3 days so the set is small.
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: "amount" | "date"; dir: 1 | -1 }>({ key: "date", dir: -1 });
  const toggleSort = (key: "amount" | "date") =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: -1 }));
  const sortArrow = (key: "amount" | "date") => (sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : "");

  const statuses = Array.from(new Set(displayedRows.map((t) => String(t.status ?? "").toUpperCase()).filter(Boolean)));
  const ql = q.trim().toLowerCase();
  const visible = displayedRows
    .filter((t) => statusFilter === "ALL" || String(t.status).toUpperCase() === statusFilter)
    .filter((t) => !ql || [t.tran_id, t.company, t.contact_name, t.email, t.plan]
      .some((f) => String(f ?? "").toLowerCase().includes(ql)))
    .sort((a, b) => {
      const v = sort.key === "amount"
        ? (Number(a.amount) || 0) - (Number(b.amount) || 0)
        : String(a.date ?? "").localeCompare(String(b.date ?? ""));
      return v * sort.dir;
    });

  // Pagination — ledgers can hold far more than a screenful once history builds up.
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = visible.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);
  // Jump back to page 1 whenever the filtered/sorted set changes underneath us.
  useEffect(() => { setPage(1); }, [statusFilter, sort, rows, q, showExpired]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <label className="text-xs font-semibold text-yai-navy/70">From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input mt-1 block" />
        </label>
        <label className="text-xs font-semibold text-yai-navy/70">To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input mt-1 block" />
        </label>
        <label className="text-xs font-semibold text-yai-navy/70 flex-1 min-w-[220px]">Search
          <div className="relative mt-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input" style={{ paddingLeft: "2rem", paddingRight: q ? "2rem" : undefined }}
              placeholder="Transaction, customer, email, plan…" />
            {q && <button onClick={() => setQ("")} aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>}
          </div>
        </label>
        <button onClick={load} disabled={loading} title="Reload" aria-label="Reload"
          className="h-[38px] px-3 flex items-center gap-1.5 rounded-lg border border-gray-200 text-yai-navy text-xs font-semibold hover:border-yai-navy/40 hover:shadow-sm disabled:opacity-50 transition">
          <svg viewBox="0 0 24 24" className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
          Reload
        </button>
      </div>

      {rows && rows.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          <Stat label="Transactions" value={String(displayedRows.length)} />
          <Stat label="Collected" value={`៛${collected.toLocaleString()} KHR`} accent />
          <Stat label="Approved" value={String(approved.length)} />
          <Stat label="Pending" value={String(pending)} />
        </div>
      )}

      {err && <div className="text-[13px] bg-red-50 border border-red-200 text-red-700 rounded-lg p-2.5 mb-3">{err}</div>}
      {loading && !rows && <p className="text-sm text-gray-400 py-8 text-center">Loading transactions…</p>}

      {rows && rows.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {["ALL", ...statuses].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border transition ${
                statusFilter === s ? "bg-yai-navy text-white border-yai-navy" : "bg-white text-gray-500 border-gray-200 hover:border-yai-navy/40"
              }`}>
              {s === "ALL" ? `All (${displayedRows.length})` : `${s} (${displayedRows.filter((t) => String(t.status).toUpperCase() === s).length})`}
            </button>
          ))}
          {expiredCount > 0 && (
            <label className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showExpired}
                onChange={(e) => {
                  setShowExpired(e.target.checked);
                  if (!e.target.checked && statusFilter === "EXPIRED") setStatusFilter("ALL");
                }}
              />
              Show expired ({expiredCount})
            </label>
          )}
        </div>
      )}

      {rows && (rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No transactions in this range.</p>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400 border-b">
                <th className="py-2 pr-3">Transaction</th>
                {src === "ledger" && <th className="py-2 pr-3">Customer</th>}
                <th className="py-2 pr-3 cursor-pointer select-none hover:text-yai-navy" onClick={() => toggleSort("amount")}>
                  Amount{sortArrow("amount")}
                </th>
                <th className="py-2 pr-3">Method</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Refunded</th>
                <th className="py-2 pr-3 cursor-pointer select-none hover:text-yai-navy" onClick={() => toggleSort("date")}>
                  Date · ICT{sortArrow("date")}
                </th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((t) => {
                const refundable = String(t.status).toUpperCase().includes("APPROVE");
                return (
                  <tr key={t.tran_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2.5 pr-3 font-mono text-xs">{t.tran_id}</td>
                    {src === "ledger" && (
                      <td className="py-2.5 pr-3 text-xs">
                        <div className="text-yai-navy font-medium">{t.company || "—"}</div>
                        {t.plan && <div className="text-gray-400">{t.plan}</div>}
                      </td>
                    )}
                    <td className="py-2.5 pr-3 font-semibold">{t.amount != null ? `${t.amount} ${t.currency ?? ""}` : "—"}</td>
                    <td className="py-2.5 pr-3 text-xs text-gray-500">{t.payType ?? "—"}</td>
                    <td className="py-2.5 pr-3"><StatusPill status={String(t.status ?? "")} /></td>
                    <td className="py-2.5 pr-3 text-xs text-gray-500">{Number(t.refunded) > 0 ? `${t.refunded} ${t.currency ?? ""}` : "—"}</td>
                    <td className="py-2.5 pr-3 text-gray-500 text-xs whitespace-nowrap">{t.date ?? "—"}</td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <RowBtn onClick={() => setDetail(t)}>Detail</RowBtn>
                      <RowBtn onClick={() => checkOne(t)} disabled={checking === t.tran_id}>
                        {checking === t.tran_id ? "…" : "Check"}
                      </RowBtn>
                      {refundable && <RowBtn onClick={() => setDetail(t)} danger>Refund</RowBtn>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && <p className="text-sm text-gray-400 py-6 text-center">No {statusFilter.toLowerCase()} transactions.</p>}
          {visible.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-gray-400 text-xs">
                {(pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, visible.length)} of {visible.length}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageSafe <= 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-yai-navy font-semibold disabled:opacity-40 hover:border-yai-navy/40">
                  Prev
                </button>
                <span className="text-xs text-gray-500">Page {pageSafe} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageSafe >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-yai-navy font-semibold disabled:opacity-40 hover:border-yai-navy/40">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {detail && <TxnDetail txn={detail} onClose={() => setDetail(null)} onRefunded={load} />}
    </div>
  );
}

function TxnDetail({ txn, onClose, onRefunded }: { txn: Txn; onClose: () => void; onRefunded: () => void }) {
  const [refundAmt, setRefundAmt] = useState(String(txn.amount ?? ""));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const doRefund = async () => {
    if (!confirm(`Refund ${refundAmt} on ${txn.tran_id}? This cannot be undone.`)) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch("/api/payway/merchant/refund", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tran_id: txn.tran_id, refund_amount: Number(refundAmt) }),
      }).then((x) => x.json());
      const code = r?.status?.code ?? r?.status;
      const ok = code === "00" || code === 0 || r?.transaction_status === "REFUNDED";
      setMsg({ ok, text: ok ? "Refund processed." : (r?.status?.message || r?.error || "Refund failed.") });
      if (ok) onRefunded();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Request failed." });
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Transaction</div>
            <div className="font-mono text-sm font-semibold text-yai-navy">{txn.tran_id}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <Info label="Amount" value={txn.amount != null ? `${txn.amount} ${txn.currency ?? ""}` : "—"} />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Status</div>
            <StatusPill status={String(txn.status ?? "")} />
          </div>
          <Info label="Method" value={txn.payType ?? "—"} />
          <Info label="Refunded" value={Number(txn.refunded) > 0 ? `${txn.refunded} ${txn.currency ?? ""}` : "—"} />
          <Info label="Date" value={txn.date ?? "—"} />
          {txn.paid_at && <Info label="Paid at" value={txn.paid_at} />}
        </div>

        {/* Customer & order context from our ledger — so a paid-out transaction
            keeps its who/what even after ABA's 3-day list drops it. */}
        {(txn.company || txn.contact_name || txn.email || txn.plan) && (
          <div className="border-t border-gray-100 pt-4 mb-4">
            <div className="text-xs font-bold text-yai-navy mb-2">Customer & order</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {txn.company && <Info label="Company" value={txn.company} />}
              {txn.contact_name && <Info label="Contact" value={txn.contact_name} />}
              {txn.email && <Info label="Email" value={txn.email} />}
              {txn.plan && <Info label="Plan" value={txn.plan} />}
              {txn.source && <Info label="Source" value={txn.source} />}
            </div>
          </div>
        )}

        {/* Refund only exists for money actually captured — pending/declined
            transactions have nothing to refund. */}
        {String(txn.status ?? "").toUpperCase().includes("APPROVE") ? (
          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs font-bold text-yai-navy mb-2">Refund</div>
            <div className="flex gap-2">
              <input value={refundAmt} onChange={(e) => setRefundAmt(e.target.value)} inputMode="decimal"
                className="input flex-1" placeholder="Amount to refund" />
              <button onClick={doRefund} disabled={busy}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${busy ? "bg-gray-300 text-gray-500" : "bg-red-600 text-white hover:bg-red-700"}`}>
                {busy ? "Refunding…" : "Refund"}
              </button>
            </div>
            {msg && <div className={`mt-3 text-[13px] rounded-lg p-2.5 ${msg.ok ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-700"}`}>{msg.text}</div>}
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-4 text-[12px] text-gray-400">
            Refund unavailable — the customer hasn&apos;t paid this transaction.
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── helpers ────────────────────────────────────────────────────────── */
// The ledger stores UTC (as it should); Cambodia runs ICT = UTC+7, so every
// timestamp is converted for display. "sv-SE" formats as "YYYY-MM-DD HH:MM:SS",
// which keeps the column lexicographically sortable — the Date sort relies on it.
const ICT = "Asia/Phnom_Penh";
function toIct(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? String(iso) : d.toLocaleString("sv-SE", { timeZone: ICT });
}
// A calendar day the merchant picks is an ICT day — turn it into the UTC
// instant the ledger actually stores, or the window is 7 hours out.
const ictDay = (ms: number) => new Date(ms).toLocaleDateString("sv-SE", { timeZone: ICT });
const ictDayStart = (day: string) => new Date(`${day}T00:00:00+07:00`).toISOString();
const ictDayEnd = (day: string) => new Date(`${day}T23:59:59.999+07:00`).toISOString();

// Map a Mongo ledger record → table row.
function mapLedger(o: Record<string, unknown>): Txn {
  const g = (k: string) => o[k];
  return {
    tran_id: String(g("tran_id") ?? ""),
    amount: g("amount") as number,
    currency: g("currency") as string,
    status: g("status") as string,
    date: toIct(g("created_at") as string),
    payType: (g("payment_option") === "cards" ? "Card" : g("payment_option") === "abapay_khqr" ? "ABA KHQR" : (g("payment_option") as string)) || "—",
    refunded: g("refunded_amount") as number,
    company: g("company") as string,
    plan: g("plan") as string,
    source: g("source") as string,
    contact_name: g("contact_name") as string,
    email: g("email") as string,
    paid_at: toIct(g("paid_at") as string) || undefined,
    raw: o,
  };
}

// The list endpoint nests results differently across API versions — find the
// first array of transaction-like objects and normalise the common fields.
function extractTxns(r: unknown): Txn[] {
  const arr = findTxnArray(r);
  return arr.map((o) => {
    const g = (...keys: string[]) => keys.map((k) => o[k]).find((v) => v != null);
    return {
      tran_id: String(g("tran_id", "transaction_id", "order_id") ?? ""),
      amount: g("total_amount", "original_amount", "amount", "payment_amount") as string | number | undefined,
      currency: g("original_currency", "currency", "payment_currency", "ccy") as string | undefined,
      status: g("payment_status", "status", "transaction_status") as string | undefined,
      date: g("transaction_date", "date", "created_at", "payment_date") as string | undefined,
      payType: g("payment_type", "payment_option", "payment_method") as string | undefined,
      refunded: g("refund_amount", "total_refunded") as string | number | undefined,
      raw: o,
    };
  }).filter((t) => t.tran_id);
}
function findTxnArray(r: unknown): Record<string, unknown>[] {
  const seen = new Set<unknown>();
  const walk = (v: unknown): Record<string, unknown>[] | null => {
    if (!v || typeof v !== "object" || seen.has(v)) return null;
    seen.add(v);
    if (Array.isArray(v)) {
      if (v.length && typeof v[0] === "object" && v[0] &&
        Object.keys(v[0] as object).some((k) => /tran|transaction|order/i.test(k)))
        return v as Record<string, unknown>[];
      for (const el of v) { const f = walk(el); if (f) return f; }
      return null;
    }
    for (const val of Object.values(v as Record<string, unknown>)) { const f = walk(val); if (f) return f; }
    return null;
  };
  return walk(r) ?? [];
}

function StatusPill({ status }: { status: string }) {
  const s = status.toUpperCase();
  const cls = s.includes("APPROVE") || s === "00" ? "bg-green-50 text-green-700 border-green-200"
    : s.includes("REFUND") ? "bg-blue-50 text-blue-700 border-blue-200"
    : s.includes("DECLINE") || s.includes("CANCEL") || s.includes("EXPIRE") ? "bg-red-50 text-red-700 border-red-200"
    : "bg-amber-50 text-amber-700 border-amber-200";
  return <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cls}`}>{status || "—"}</span>;
}
function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border px-3.5 py-2 ${accent ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</div>
      <div className={`text-lg font-extrabold ${accent ? "text-green-700" : "text-yai-navy"}`}>{value}</div>
    </div>
  );
}

function RowBtn({ onClick, children, danger, disabled, title }: {
  onClick: () => void; children: React.ReactNode; danger?: boolean; disabled?: boolean; title?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      className={`ml-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border transition disabled:opacity-40 disabled:cursor-not-allowed ${
        danger ? "border-red-200 text-red-600 hover:bg-red-50" : "border-gray-200 text-yai-navy hover:border-yai-navy/50 hover:bg-gray-50"
      }`}>
      {children}
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</div><div className="text-yai-navy">{value}</div></div>;
}
function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition border-2 ${active ? "bg-yai-navy text-white border-yai-navy" : "bg-white text-yai-navy border-gray-200 hover:border-yai-navy/40"}`}>
      {children}
    </button>
  );
}
