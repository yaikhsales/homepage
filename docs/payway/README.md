# ABA PayWay Integration

Payments on the Yai marketing site (`yaikh-com`, Next.js 14 App Router). Customers
subscribe and pay in KHR via **ABA PayWay KHQR**; admins manage
transactions and refunds from a back-office console. All payment context is mirrored
into a **MongoDB ledger** so nothing is lost past ABA's 3-day transaction window.

Branch: `chetra`. Commits: `fbffdd2` (core), `a1aa860` (footer strip), `b1618b0` (admin detail + reload icon).

---

## 1. Module layout — `yaikh-com/lib/payway/`

One import surface: `import { … } from "@/lib/payway"` (barrel `index.ts`).

| File | Responsibility |
|------|----------------|
| `config.ts` | Host + endpoint paths + tunables. **No secrets.** Change a URL here, everything follows. |
| `client.ts` | Signing (HMAC-SHA512) + all ABA API calls. Server-side only — API key never leaves. |
| `guard.ts`  | `isAdmin(req)` — admin-cookie gate for merchant routes. |
| `store.ts`  | Durable Mongo ledger. Best-effort; **no-op when `MONGO_URL` unset**, errors swallowed. |
| `index.ts`  | Barrel re-export. |

**Key `client.ts` exports:** `signForPopup`, `buildPurchaseParams`, `checkTransaction`,
`generateQr`, `transactionList`, `transactionDetail`, `refund`, `paywayConfigured`,
`refundConfigured`, `PURCHASE_URL`.
**`store.ts`:** `recordPayment`, `markPayment`, `listPayments`, `getPayment`, `paymentsEnabled`.

### Signing gotchas (do NOT re-derive — live-verified)
- Purchase hash = **24 fields in exact order** (see `buildPurchaseParams`).
- `shipping="0.00"` (empty → error 10). `payment_gate=0` is **NOT** in the hash — it makes ABA 302 to the hosted checkout the popup needs.
- QR + refund each have their own hash order.
- Refund `merchant_auth` = RSA-encrypted JSON, PKCS1 **117-byte chunks**, base64.

---

## 2. Environment — `yaikh-com/.env.local` (gitignored)

Documented in `.env.example`. Secrets live **only** here.

```
PAYWAY_MERCHANT_ID=        # ABA merchant id
PAYWAY_API_KEY=            # HMAC signing key (server-side only)
PAYWAY_BASE_URL=https://checkout-sandbox.payway.com.kh   # prod: https://checkout.payway.com.kh
PAYWAY_TRANSACTION_LIFETIME_MINUTES=5  # ABA transaction + status-check ceiling
#PAYWAY_RSA_PUBLIC_KEY=    # required for refund (ABA-issued, per merchant)
MONGO_URL=                 # Atlas connection string → activates the ledger
```

Sandbox credentials mirror `ABA/payway-tester/.env`.

---

## 3. API routes — `yaikh-com/app/api/payway/`

| Route | Auth | Purpose |
|-------|------|---------|
| `POST /sign` | public | Signs a purchase for the popup; pre-generates `tran_id`, sets `continue_success_url = <origin>/subscribe?paid=<tran>`, records PENDING in ledger. |
| `POST /check` | public | Confirms the transaction with ABA. Returns `{paid, code, status}`; marks ledger APPROVED/DECLINED/CANCELLED/REFUNDED. |
| `POST /merchant/qr` | admin | Generate KHQR for collection; records ledger. |
| `POST /merchant/transactions` | admin | ABA transaction-list (≤3 days). |
| `POST /merchant/transaction` | admin | ABA transaction detail. |
| `POST /merchant/refund` | admin | Full/partial refund (needs RSA key); marks ledger REFUNDED. |
| `POST /merchant/payments` | admin | Lists the **Mongo ledger** (`{enabled, rows}`). |

---

## 4. Customer flow — `yaikh-com/app/subscribe/`

`page.tsx` (server) reads `?paid=<tran>` and passes it to `subscribe-client.tsx` so the
"Confirming…" screen renders on the **first paint** (no form flash, no hydration error).

1. Pick plan → fill company/contact/email (validated) → agree all terms.
2. Choose **ABA KHQR** → `/sign` → ABA hosted popup (`checkout2-0.js`, `AbaPayway.checkout()`).
3. Pay inside popup → ABA shows its **Success** screen → payer taps **Continues**.
4. ABA redirects to `?paid=<tran>` → **Confirming** spinner → `/check` verifies → **Thank-you** page.

**Deliberate design:**
- Success screen shows **only** after the Continue redirect (`?paid`). Poll is a nudge only — it does **not** auto-flip (that caused early "thank-you under ABA's sheet"). The manual "I've paid — verify now" button and the `visibilitychange` refocus check were both removed for the same reason.
- Money + ledger are captured server-side regardless of whether the user returns; only the visual thank-you needs the tap.
- Support email: `gamini@yaikh.com`.

### ABA onboarding requirement map

| ABA requirement | Implementation location |
|-----------------|-------------------------|
| Configurable 5-minute transaction lifetime | `.env.example` → `PAYWAY_TRANSACTION_LIFETIME_MINUTES`; parsed with a 5-minute fallback in `lib/payway/config.ts`; signed into each purchase by `app/api/payway/sign/route.ts`. |
| Wait about 3 seconds, then check every 3 seconds | `startPolling()` in `app/subscribe/subscribe-client.tsx`; the first `setInterval` call runs after 3 seconds. |
| Stop checks on `APPROVED` or lifetime expiry | `startPolling()` clears its interval when `/api/payway/check` returns `paid`, or when the signed lifetime ceiling is reached. An in-flight guard prevents overlapping status requests. |
| Keep the Mongo ledger accurate after expiry | New records store `expires_at`. The final `/api/payway/check` call changes only ABA-confirmed `PENDING` records to `EXPIRED`; the atomic update cannot overwrite a concurrent approval. Records are retained for audit. |
| Verify through Check Transaction API | Endpoint in `lib/payway/config.ts`; HMAC request in `lib/payway/client.ts`; server verification in `app/api/payway/check/route.ts`. |
| Popup checkout | `view_type="popup"` is signed by `app/api/payway/sign/route.ts`; the hidden form uses `target="aba_webservice"`, loads `checkout2-0.js`, and calls `AbaPayway.checkout()` in `app/subscribe/subscribe-client.tsx`. |
| ABA owns popup retry behavior | The site does not replace or intercept PayWay's popup. ABA may retry while the transaction is active; after the lifetime expires, the customer starts a fresh signed transaction from the ABA KHQR button. |

Primary references: [eCommerce Checkout](https://developer.payway.com.kh/ecommerce-checkout-3158159f0) and [Check Transaction](https://developer.payway.com.kh/check-transaction-14530826e0).

---

## 5. Admin console — `yaikh-com/app/admin/payments/page.tsx`

Cookie-gated (passcode `012026`). Two tabs: **Transactions & refund**, **Generate QR**.

- Loads the **ledger first** (30-day, Customer column); falls back to ABA's 3-day list when Mongo is off (`src` state).
- Stat tiles, status-filter pills, sortable Amount/Date, **pagination 20/page**, compact refresh-icon reload.
- **Detail modal** shows Amount/Status/Method/Date/Refunded **+ Paid-at + Customer & order** (Company · Contact · Email · Plan · Source). No raw JSON.
- **Refund** appears only on APPROVED rows (pending/declined have nothing captured). Full/partial, within ABA's 30-day window.

---

## 6. Why the Mongo ledger (`payments` collection)

ABA's transaction-list returns only the **last 3 days**, but refunds are allowed for **30**.
The ledger is a durable mirror holding customer context ABA never returns (company, plan,
contact, email). **ABA stays authoritative for money**; the ledger is for search/refund.
`getDb()` defaults to DB `yaikh`, collection `payments`.

---

## 7. Brand assets — `yaikh-com/public/brand/`

`aba.svg` `khqr.svg` `visa.svg` `mastercard.svg` `unionpay.svg` `jcb.svg` `aba-card.svg` `aba-khqr.svg`.
The footer **"We accept"** strip (`PaymentStrip` in `app/page.tsx`, bottom-right)
uses the ABA and KHQR assets. SVGs carry their own tiles → sit on any background, no wrapper.

---

## 8. Known gaps / TODO

- **Refund blocked** for live merchant until ABA issues that merchant's **RSA public key** (`PAYWAY_RSA_PUBLIC_KEY`). Code is correct — proven on a working sandbox merchant (got PTL58 provider-limit = auth succeeded). Cannot self-generate; ABA must provide.
- Plans in `/subscribe` are a visual stub mirroring the homepage pricing ladder — real picker is a follow-up.
- Terms text is a working draft; final MSA/Privacy links pending.

---

## 9. Run & test

```bash
cd yaikh-com && npm run dev        # port 3001
```
- Customer: `http://localhost:3001/subscribe`
- Admin: `http://localhost:3001/admin/payments` (passcode 012026)
- Mobile testing over Tailscale (App-Store Tailscale sandboxes raw ports — use `tailscale serve`):
  `tailscale serve --bg --https=10000 localhost:3001` → `https://<node>.<tailnet>.ts.net:10000/subscribe`
- Verify ledger: `paymentsEnabled()` true once `MONGO_URL` set; `/api/payway/check` with a real `tran_id` marks it paid.

Flow decks (for onboarding): `docs/payway/01_Customer_Payment_Flow.{pptx,pdf}`, `02_Admin_Payments_and_Refunds.{pptx,pdf}`.
