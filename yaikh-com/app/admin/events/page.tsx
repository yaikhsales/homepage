import { readEventsStore } from "@/lib/events-store";
import { EventsEditor } from "@/components/admin/EventsEditor";

export default async function AdminEventsPage() {
  const store = await readEventsStore();
  return (
    <div className="p-8">
      <div className="mb-6 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
          Yai · Back-end
        </div>
        <h1 className="text-3xl font-extrabold mt-1">Events &amp; Photo Albums</h1>
        <p className="text-sm text-gray-600 mt-1">
          Add an event album for each happening — Minister visits, partnership meetings, conferences,
          demos. Each entry gets a title, date, narrative, optional category, and a list of photo URLs.
          These appear on the public plan&rsquo;s Events section (formerly Appendix).
        </p>
        <p className="text-[11px] text-gray-500 mt-2 italic">
          Tip: Paste any publicly-accessible image URL (e.g. Google Drive shared link, S3, or
          /uploads/foo.jpg if uploaded to the server). Pinned albums float to the top of the public feed.
        </p>
      </div>
      <EventsEditor initial={store} />
    </div>
  );
}
