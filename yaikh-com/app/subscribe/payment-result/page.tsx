import SiteFooter from "@/components/site-footer";
import { getSubscriptionKhrPerUsd } from "@/lib/subscription-pricing";
import SubscribeClient from "../subscribe-client";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function PaymentResultPage({
  searchParams,
}: {
  searchParams: { reference?: string | string[] };
}) {
  const reference = Array.isArray(searchParams.reference)
    ? searchParams.reference[0]
    : searchParams.reference;

  return (
    <>
      <SubscribeClient
        initialPaidTran={reference || undefined}
        khrPerUsd={getSubscriptionKhrPerUsd()}
        resultOnly
      />
      <SiteFooter />
    </>
  );
}
