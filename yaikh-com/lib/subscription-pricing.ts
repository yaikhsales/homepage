const DEFAULT_KHR_PER_USD = 4100;
export const SUBSCRIPTION_VAT_RATE = 0.1;

const CLOUD_PLAN_USD = {
  "Cloud · Starter": 120,
  "Cloud · Growth": 750,
  "Cloud · Enterprise": 1200,
  "Ai Server": 2500,
  "Agentic": 5000,
  "Big Ai Brain": 5000,
} as const;

export function getSubscriptionKhrPerUsd() {
  const configuredRate = Number(process.env.SUBSCRIPTION_KHR_PER_USD);

  return Number.isInteger(configuredRate) && configuredRate > 0
    ? configuredRate
    : DEFAULT_KHR_PER_USD;
}

export function getCloudPlanKhrAmount(planName: string) {
  const usdAmount = CLOUD_PLAN_USD[planName as keyof typeof CLOUD_PLAN_USD];

  return usdAmount === undefined ? null : usdAmount * getSubscriptionKhrPerUsd();
}

export function getCloudPlanPaymentBreakdown(planName: string) {
  const subtotalAmount = getCloudPlanKhrAmount(planName);
  if (subtotalAmount === null) return null;

  const vatAmount = Math.round(subtotalAmount * SUBSCRIPTION_VAT_RATE);
  return {
    subtotalAmount,
    vatAmount,
    totalAmount: subtotalAmount + vatAmount,
    fixedRate: getSubscriptionKhrPerUsd(),
  };
}
