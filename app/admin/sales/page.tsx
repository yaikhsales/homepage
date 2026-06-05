import { readSalesStore } from "@/lib/sales-store";
import { SalesEditor } from "@/components/admin/SalesEditor";

export default async function AdminSalesPage() {
  const store = await readSalesStore();

  return (
    <div className="p-8">
      <div className="mb-6 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
          Yai · Back-end
        </div>
        <h1 className="text-3xl font-extrabold mt-1">Sales / Income</h1>
        <p className="text-sm text-gray-600 mt-1">
          Excel-style grid starting <strong>June 2026</strong> — the month the platform opens its
          gates commercially. Streams down the rows (6 planned packages + 3 variable-rev e-commerce
          streams), months across the columns. Toggle <strong>Planned</strong> / <strong>Actual</strong>
          at the top — each cell stores both numbers so you can track forecast vs booked.
        </p>
      </div>

      <SalesEditor initial={store} />
    </div>
  );
}
