import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PlanInquiry = {
  email?: string;
  plan?: string;
  options?: string[];
  status?: string;
  createdAt?: Date | string;
};

const formatSubmittedAt = (value: PlanInquiry["createdAt"]) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Phnom_Penh",
  }).format(date);
};

export default async function AdminPlanInquiriesPage() {
  const inquiries = await (await getDb())
    .collection<PlanInquiry>("plan_interest_requests")
    .find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
            Yai · Back-end
          </div>
          <h1 className="text-3xl font-extrabold mt-1">Plan inquiries</h1>
          <p className="text-sm text-gray-600 mt-1">
            Contact requests submitted from Steps 4–6 on the homepage.
          </p>
        </div>
        <div className="rounded-lg border border-yai-border bg-white px-4 py-2 text-sm text-gray-600">
          <strong className="text-xl text-yai-navy">{inquiries.length}</strong> request{inquiries.length === 1 ? "" : "s"}
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-yai-border bg-white p-10 text-center text-sm text-gray-500">
          No plan inquiries yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-yai-border bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-yai-border bg-gray-50 text-[10px] uppercase tracking-[0.12em] text-gray-500">
              <tr>
                <th className="px-5 py-3 font-bold">Submitted · ICT</th>
                <th className="px-5 py-3 font-bold">Official email</th>
                <th className="px-5 py-3 font-bold">Plan</th>
                <th className="px-5 py-3 font-bold">Options</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yai-border">
              {inquiries.map((inquiry) => {
                const email = inquiry.email?.trim() || "—";
                return (
                  <tr key={inquiry._id.toString()} className="hover:bg-gray-50/70">
                    <td className="px-5 py-4 whitespace-nowrap text-gray-600">{formatSubmittedAt(inquiry.createdAt)}</td>
                    <td className="px-5 py-4 font-semibold text-yai-navy">{email}</td>
                    <td className="px-5 py-4 font-semibold text-yai-navy">{inquiry.plan || "—"}</td>
                    <td className="px-5 py-4 text-gray-600">{inquiry.options?.length ? inquiry.options.join(", ") : "None"}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-700">
                        {inquiry.status || "new"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {email !== "—" && (
                        <a href={`mailto:${email}?subject=${encodeURIComponent(`Yai ${inquiry.plan || "plan"} inquiry`)}`} className="inline-flex rounded-lg bg-yai-blue px-3 py-2 text-xs font-bold text-white transition hover:brightness-110">
                          Reply
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
