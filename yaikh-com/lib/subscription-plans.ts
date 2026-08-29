export const CLOUD_PLAN_NAMES = [
  "Cloud · Starter",
  "Cloud · Growth",
  "Cloud · Enterprise",
] as const;

export type CloudPlanName = (typeof CLOUD_PLAN_NAMES)[number];

export const CLOUD_PLAN_AMOUNTS: Record<CloudPlanName, number> = {
  "Cloud · Starter": 120,
  "Cloud · Growth": 750,
  "Cloud · Enterprise": 1200,
};

export function isCloudPlan(plan: string): plan is CloudPlanName {
  return CLOUD_PLAN_NAMES.includes(plan as CloudPlanName);
}

export const ADVANCED_PLAN_NAMES = [
  "Ai Server",
  "Agentic",
  "Big Ai Brain",
] as const;

export type AdvancedPlanName = (typeof ADVANCED_PLAN_NAMES)[number];

export const ADVANCED_PLAN_AMOUNTS: Record<AdvancedPlanName, number> = {
  "Ai Server": 2500,
  Agentic: 5000,
  "Big Ai Brain": 5000,
};

export function isAdvancedPlan(plan: string): plan is AdvancedPlanName {
  return ADVANCED_PLAN_NAMES.includes(plan as AdvancedPlanName);
}
