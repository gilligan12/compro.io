import { SubscriptionTier, SUBSCRIPTION_TIERS } from '@/types/subscription'

export function getSubscriptionLimits(tier: SubscriptionTier) {
  return SUBSCRIPTION_TIERS[tier]
}

export function canPerformSearch(
  tier: SubscriptionTier,
  searchesUsed: number,
  searchesLimit: number | null
): boolean {
  const limits = getSubscriptionLimits(tier)
  
  if (limits.searchesPerMonth === null || searchesLimit === null) {
    // Premium tier - unlimited searches
    return true
  }
  
  return searchesUsed < searchesLimit
}

export function getComparablesLimit(tier: SubscriptionTier): number {
  return getSubscriptionLimits(tier).comparablesPerSearch
}
