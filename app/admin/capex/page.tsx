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
          Non-salary expense streams. Click a category header to see its line items + monthly grid.
          Categories match the Texlink Budget &lsquo;Expences&rsquo; layout — Bonus, Computers,
          Furniture, Dev equipment, Admin Shop, Ai Fees, Villa Rent, Petty Cash + Sales Promotion.
        </p>
      </div>
      <ExpensesEditor initial={store} />
    </div>
  );
}
