import { readSalaryStore } from "@/lib/salary-store";
import { SalaryEditor } from "@/components/admin/SalaryEditor";

// Always re-read the store on each request so admin saves show immediately.
export const dynamic = "force-dynamic";

export default async function AdminSalariesPage() {
  const store = await readSalaryStore();

  return (
    <div className="p-8">
      <div className="mb-6 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
          Yai · Back-end
        </div>
        <h1 className="text-3xl font-extrabold mt-1">Salary History · 2024 → today</h1>
        <p className="text-sm text-gray-600 mt-1">
          Excel-style grid. Members down the rows, months across the columns. Type the actual
          monthly amount paid to each person; blank = no payment that month. Add new members,
          extend new months as needed.
        </p>
        <p className="text-[11px] text-gray-500 mt-2 italic">
          Pre-seeded with the May–Dec 2024 data from the original Excel. Extend 2025 + 2026 as you
          confirm numbers.
        </p>
      </div>

      <SalaryEditor initial={store} />
    </div>
  );
}
