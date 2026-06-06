import { readSalesStore } from "@/lib/sales-store";
import { SalesEditor } from "@/components/admin/SalesEditor";

// Always re-read the store on each request so admin saves show immediately.
export const dynamic = "force-dynamic";

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
          Excel-style grid starting <strong>June 2026</strong>. Streams down the rows (6 planned
          packages + 3 variable-rev e-commerce streams), months across the columns.
        </p>
        <p className="text-xs text-gray-500 mt-2 leading-snug">
          <strong>Each arrow-click = +1 client.</strong> The cell shows the $ revenue
          (clients × unit price) and a small grey count below — that count flows into the SDTV
          dashboard later. Toggle <strong>Planned</strong> / <strong>Actual</strong> to switch
          between forecast and booked figures (each cell stores both).
        </p>
      </div>

      <SalesEditor initial={store} />
    </div>
  );
}
