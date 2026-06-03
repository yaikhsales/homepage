import Link from "next/link";
import { readStore } from "@/lib/budget-store";

export default async function AdminDashboard() {
  const store = await readStore();
  const hasActuals =
    store.actuals.expense.some((v) => v !== null) ||
    store.actuals.income.some((v) => v !== null);

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

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Live Budget */}
        <Link
          href="/admin/budget"
          className="group block rounded-xl border-2 border-yai-border bg-white p-5 hover:border-yai-blue hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yai-blue text-white font-extrabold text-lg">
              $
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
          <h2 className="text-lg font-extrabold text-yai-navy">Live Budget · Planned vs Actual</h2>
          <p className="text-xs text-gray-600 leading-snug mt-1">
            12-month editable Plan vs Actual for expense + income + optional notes. Save publishes
            instantly to Section 13 of the live plan.
          </p>
          {store.updatedAt && (
            <div className="mt-3 text-[10px] text-gray-500">
              Last updated <strong className="text-yai-navy">{new Date(store.updatedAt).toLocaleString()}</strong>
              {" "}by <strong>{store.updatedBy ?? "—"}</strong>
            </div>
          )}
        </Link>

        {/* Future feeders */}
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
