const FREE_SEARCHES_LIMIT = 5

export function canPerformSearch(
  searchesUsed: number,
  searchesLimit: number
): boolean {
  return searchesUsed < searchesLimit
}

export function getSubscriptionLimits() {
  return {
    searchesPerMonth: FREE_SEARCHES_LIMIT,
    comparablesPerSearch: 5,
  }
}
