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
          The real income streams — 6 planned packages from the pricing staircase + 3 uncertain
          e-commerce streams. Each row is collapsible (click the header to see details). Fill in
          monthly customer counts + revenue as you book deals.
        </p>
      </div>

      <SalesEditor initial={store} />
    </div>
  );
}
