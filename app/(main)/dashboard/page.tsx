import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HistoricalSearches from '@/components/HistoricalSearches'
import UsageMeter from '@/components/UsageMeter'
import Link from 'next/link'
import { getCurrentMonthUsage, initializeMonthlyUsage } from '@/lib/usage'
import { getSubscriptionLimits } from '@/lib/subscription'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profileData) {
    redirect('/')
  }

  const profile = profileData as Profile

  // Get or initialize usage
  let usage = await getCurrentMonthUsage(user.id)
  if (!usage) {
    usage = await initializeMonthlyUsage(user.id, profile.subscription_tier)
  }

  const limits = getSubscriptionLimits(profile.subscription_tier)

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep-green mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-700">
            Manage your property searches and view your search history.
          </p>
        </div>

        {/* Usage and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <UsageMeter
              used={usage.searches_used}
              limit={limits.searchesPerMonth}
              label="Monthly Searches"
            />
          </div>
          <div className="flex items-center">
            <Link
              href="/search"
              className="w-full bg-deep-green hover:bg-deep-green-dark text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
            >
              New Search
            </Link>
          </div>
        </div>

        {/* Subscription Status */}
        {profile.subscription_tier === 'free' && (
          <div className="bg-deep-green/10 border border-deep-green/20 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-deep-green">
                  You're on the Free plan
                </h3>
                <p className="text-sm text-gray-700 mt-1">
                  Upgrade to unlock more searches and comparables per property.
                </p>
              </div>
              <Link
                href="/pricing"
                className="ml-4 bg-deep-green hover:bg-deep-green-dark text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}

        {/* Historical Searches Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-deep-green">Your Search History</h2>
          </div>
          <HistoricalSearches />
        </div>
      </div>
    </div>
  )
}
