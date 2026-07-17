/* Server wrapper: reads ?paid=<tran> so the client renders the "Confirming…"
 * screen on the very first paint (SSR + client agree — no form flash, no
 * hydration mismatch) when ABA redirects back after the payer taps Continue. */
import SubscribeClient from "./subscribe-client";

export default function SubscribePage({
  searchParams,
}: {
  searchParams: { paid?: string | string[] };
}) {
  const paid = Array.isArray(searchParams.paid) ? searchParams.paid[0] : searchParams.paid;
  return <SubscribeClient initialPaidTran={paid || undefined} />;
}
