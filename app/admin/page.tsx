import Link from "next/link";
import { readStore } from "@/lib/budget-store";
import { readSalaryStore } from "@/lib/salary-store";
import { readSalesStore } from "@/lib/sales-store";
import { readExpensesStore } from "@/lib/expenses-store";

export default async function AdminDashboard() {
  const store = await readStore();
  const salaryStore = await readSalaryStore();
  const salesStore = await readSalesStore();
  const expensesStore = await readExpensesStore();
  // Exclude e-com streams — they store user counts, not dollars.
  const salesGrand = salesStore.streams.reduce<number>(
    (s, st) => st.category === "ecom"
      ? s
      : s + Object.values(st.monthly).reduce<number>((ss, c) => ss + (c.actual ?? c.planned ?? 0), 0),
    0,
  );
  const expensesGrand = expensesStore.categories.reduce<number>(
    (s, cat) => s + cat.items.reduce<number>(
      (ss, it) => ss + Object.values(it.monthly).reduce<number>((sss, m) => sss + (m.amount ?? 0), 0),
      0,
    ),
    0,
  );
  const hasActuals =
    store.actuals.expense.some((v) => v !== null) ||
    store.actuals.income.some((v) => v !== null);
  const salaryGrand = salaryStore.members.reduce<number>(
    (s, m) => s + Object.values(m.monthly).reduce<number>((ss, v) => ss + v, 0),
    0,
  );

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
          Yai · Back-end
        </div>
        <h1 className="text-3xl font-extrabold mt-1">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1 max-w-xl">
          Manual data entry portal. Each feeder below writes to a JSON store the public plan portal
          reads on every page load.
        </p>
      </div>

      {/* P&L streams — 4 individual feeders */}
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-bold">
        P&amp;L streams
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/sales"
          className="group block rounded-xl border-2 border-yai-border bg-white p-5 hover:border-yai-blue hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white font-extrabold text-lg">
              💰
            </span>
            {salesGrand > 0 ? (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ● ${salesGrand.toLocaleString(undefined, { maximumFractionDigits: 0 })} booked
              </span>
            ) : (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                {salesStore.streams.length} streams · 0 revenue
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-yai-navy">Sales / Income</h2>
          <p className="text-xs text-gray-600 leading-snug mt-1">
            6 planned packages (Cloud Starter / Growth / Enterprise / Ai Server / Agentic / Big Ai
            Brain) + 3 uncertain e-commerce streams. Each row collapsible — fill in monthly
            customers + revenue.
          </p>
        </Link>
        <Link
          href="/admin/salaries"
          className="group block rounded-xl border-2 border-yai-border bg-white p-5 hover:border-yai-blue hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yai-navy text-white font-extrabold text-lg">
              👥
            </span>
            {salaryGrand > 0 ? (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ● {salaryStore.members.length} ppl · {salaryStore.months.length} mo
              </span>
            ) : (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                empty
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-yai-navy">Salaries · 2024 → today</h2>
          <p className="text-xs text-gray-600 leading-snug mt-1">
            Excel-grid of every team member × every month they were paid. Seeded with May–Dec 2024
            real data. Months auto-extend to today.
          </p>
          {salaryGrand > 0 && (
            <div className="mt-3 text-[10px] text-gray-500">
              Grand total so far <strong className="text-yai-navy">${salaryGrand.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
            </div>
          )}
        </Link>
        <Link
          href="/admin/capex"
          className="group block rounded-xl border-2 border-yai-border bg-white p-5 hover:border-yai-blue hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yai-blue text-white font-extrabold text-lg">
              ⚙
            </span>
            {expensesGrand > 0 ? (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ● ${expensesGrand.toLocaleString(undefined, { maximumFractionDigits: 0 })} logged
              </span>
            ) : (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                {expensesStore.categories.length} categories · empty
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-yai-navy">Capex / Equipment + Expenses</h2>
          <p className="text-xs text-gray-600 leading-snug mt-1">
            All non-salary spend. 8 collapsible categories — Bonus, Computers, Furniture, Dev
            equipment, Admin Shop, Ai Fees, Villa Rent, Petty Cash + Promotion.
          </p>
        </Link>
        <FeederPlaceholder
          icon="💸"
          title="Sales Running Costs"
          desc="Marketing, travel, exhibition booths, training, swag, partner-event sponsorships."
        />
      </div>

      {/* Aggregate / reporting */}
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-bold">
        Aggregate &amp; reporting
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/budget"
          className="group block rounded-xl border-2 border-yai-border bg-white p-5 hover:border-yai-blue hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yai-blue text-white font-extrabold text-lg">
              ∑
            </span>
            {hasActuals ? (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ● Live
              </span>
            ) : (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                no actuals yet
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-yai-navy">Live Budget roll-up · 2026</h2>
          <p className="text-xs text-gray-600 leading-snug mt-1">
            Aggregate Plan vs Actual at the monthly company level — until the 4 P&amp;L stream
            editors auto-sync, you can override here for the OC view.
          </p>
          {store.updatedAt && (
            <div className="mt-3 text-[10px] text-gray-500">
              Last updated <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong>
              {" "}by <strong>{store.updatedBy ?? "—"}</strong>
            </div>
          )}
        </Link>
      </div>

      {/* Plan content feeders */}
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-bold">
        Plan content
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <FeederPlaceholder
          icon="▦"
          title="Factory Module Adoption"
          desc="Update per-factory module status (YM / CA / YY / YW / BZ / IDFL × 18 modules)."
        />
        <FeederPlaceholder
          icon="▣"
          title="Events Calendar"
          desc="Add / edit / remove curated big events. Country flag + URL + notes."
        />
        <FeederPlaceholder
          icon="▤"
          title="Partner Pathways"
          desc="Update activity status across Anthropic, Google, JICA, YC, ADB/IFC, ABA+Wing pathways."
        />
        <FeederPlaceholder
          icon="✎"
          title="OC Update Content"
          desc="Compose quarterly OC update narrative + half-year budget refresh notes."
        />
      </div>

      {/* Strategic DTV downloads */}
      <div className="mt-10 mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500 font-bold">
        Strategic DTV · downloads
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <a
          href="/downloads/yai-plan-deck.pptx"
          download="yai-strategic-dtv.pptx"
          className="group block rounded-xl border-2 border-yai-orange bg-gradient-to-br from-orange-50 to-white p-5 hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yai-orange text-white font-extrabold text-lg">
              ⬇
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-yai-orange bg-white px-2 py-0.5 rounded-full border border-yai-orange/30">
              PPTX · 1 + 17 slides
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-yai-navy">Yai Strategic DTV deck</h2>
          <p className="text-xs text-gray-600 leading-snug mt-1">
            PowerPoint version of the public Strategic DTV plan. Cover slide
            (Texlink Technologies · STRATEGIC DTV brand) + one slide per section
            (01 Executive Summary → 17 About Yai). Same images, same group colours,
            same 18-module agent grid as the website. Open in PowerPoint / Keynote,
            print to PDF for a sharable strategic-DTV book.
          </p>
          <div className="mt-3 text-[10px] text-yai-orange font-bold">
            Click to download → save as PDF in your slide app for a printable book.
          </div>
        </a>
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 opacity-60">
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 text-gray-500 font-extrabold text-lg">
              📄
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              regenerate on demand
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-yai-navy/70">Build deck from latest data</h2>
          <p className="text-xs text-gray-500 leading-snug mt-1">
            Run <code className="bg-gray-100 px-1 rounded">node scripts/build-deck.mjs</code> to rebuild the deck
            with the latest copy from <code className="bg-gray-100 px-1 rounded">public/downloads/</code>.
            Future enhancement: auto-build on each admin save.
          </p>
        </div>
      </div>

      <div className="mt-8 text-[11px] text-gray-500 leading-snug max-w-2xl">
        <strong>Architecture note:</strong> writes hit ephemeral file storage on Railway today
        (resets on redeploy). When you&rsquo;re ready to make actuals permanent, attach a Railway
        Volume to mount <code className="bg-gray-100 px-1 rounded">/data</code> across deploys, or
        swap the store layer for Postgres.
      </div>
    </div>
  );
}

function FeederPlaceholder({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 opacity-60">
      <div className="flex items-start justify-between mb-2">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 text-gray-500 font-extrabold text-lg">
          {icon}
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          coming soon
        </span>
      </div>
      <h2 className="text-lg font-extrabold text-yai-navy/70">{title}</h2>
      <p className="text-xs text-gray-500 leading-snug mt-1">{desc}</p>
    </div>
  );
}
