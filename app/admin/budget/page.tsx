import { readStore } from "@/lib/budget-store";
import { AdminBudgetEditor } from "@/components/admin/AdminBudgetEditor";

export default async function AdminBudgetPage() {
  const store = await readStore();

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
          Yai · Back-end
        </div>
        <h1 className="text-3xl font-extrabold mt-1">Live Budget · Planned vs Actual</h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          Type actual amounts for each month as they post from Texlink. Save publishes immediately
          to Section 13 of the public plan portal.
        </p>
      </div>

      <AdminBudgetEditor initial={store} />
    </div>
  );
}
