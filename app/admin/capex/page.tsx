import { readExpensesStore } from "@/lib/expenses-store";
import { ExpensesEditor } from "@/components/admin/ExpensesEditor";

export default async function AdminCapexPage() {
  const store = await readExpensesStore();
  return (
    <div className="p-8">
      <div className="mb-6 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
          Yai · Back-end
        </div>
        <h1 className="text-3xl font-extrabold mt-1">Capex / Equipment + Expenses</h1>
        <p className="text-sm text-gray-600 mt-1">
          Excel-style grid. Line items down the rows, months across the columns. Type the actual
          monthly amount paid for each item; blank = no payment that month. Each line item is colored
          by its category — Computers, Furniture, Dev equipment, Admin Shop, Ai Fees, Villa Rent,
          Petty Cash + Sales Promotion.
        </p>
      </div>
      <ExpensesEditor initial={store} />
    </div>
  );
}
