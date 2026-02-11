export type SubscriptionTier = 'free' | 'pro' | 'premium'

export interface SubscriptionLimits {
  searchesPerMonth: number | null // null means unlimited
  comparablesPerSearch: number
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    searchesPerMonth: 5,
    comparablesPerSearch: 5,
  },
  pro: {
    searchesPerMonth: 25,
    comparablesPerSearch: 10,
  },
  premium: {
    searchesPerMonth: null, // unlimited
    comparablesPerSearch: 15,
  },
}

export const SUBSCRIPTION_PRICES: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 20,
  premium: 50,
}
