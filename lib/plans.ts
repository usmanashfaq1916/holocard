export type PlanTier = "FREE" | "PRO" | "BUSINESS";

export interface PlanConfig {
  name: string;
  maxCards: number;
  maxStorage: string;
  premiumTemplates: boolean;
  aiFeatures: boolean;
  prioritySupport: boolean;
}

export const PLANS: Record<PlanTier, PlanConfig> = {
  FREE: {
    name: "Free",
    maxCards: 1,
    maxStorage: "100MB",
    premiumTemplates: false,
    aiFeatures: false,
    prioritySupport: false,
  },
  PRO: {
    name: "Pro",
    maxCards: 5,
    maxStorage: "5GB",
    premiumTemplates: true,
    aiFeatures: true,
    prioritySupport: false,
  },
  BUSINESS: {
    name: "Business",
    maxCards: -1, // unlimited
    maxStorage: "50GB",
    premiumTemplates: true,
    aiFeatures: true,
    prioritySupport: true,
  },
};

export function canCreateCard(currentCount: number, plan: PlanTier): boolean {
  const config = PLANS[plan];
  if (config.maxCards === -1) return true;
  return currentCount < config.maxCards;
}

export function canUsePremiumTemplates(plan: PlanTier): boolean {
  return PLANS[plan].premiumTemplates;
}
