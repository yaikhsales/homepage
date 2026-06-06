import { readAboutStore } from "@/lib/about-store";
import { AboutEditor } from "@/components/admin/AboutEditor";

// Always re-read the store on each request so admin saves show immediately.
export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const store = await readAboutStore();
  return (
    <div className="p-8">
      <div className="mb-6 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.2em] text-yai-orange font-bold">
          Yai · Back-end
        </div>
        <h1 className="text-3xl font-extrabold mt-1">About Yai · Section 17</h1>
        <p className="text-sm text-gray-600 mt-1">
          Update the credentials + product-preview images + contact block shown on the public
          plan&rsquo;s About section (Section 17, formerly &ldquo;Appendix&rdquo;).
        </p>
        <p className="text-[11px] text-gray-500 mt-2 italic">
          Tip: Paste any publicly-accessible image URL (Google Drive share, S3, Imgur, or
          /uploads/your-image.jpg if you&rsquo;ve uploaded it to the server). The captions appear
          underneath each image on the public plan.
        </p>
      </div>
      <AboutEditor initial={store} />
    </div>
  );
}
