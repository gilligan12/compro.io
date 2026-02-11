'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SubscriptionInfo {
  tier: string
  status: string
  stripeCustomerId: string | null
}

export default function SubscriptionManager() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch subscription info from API
    fetch('/api/subscription')
      .then((res) => res.json())
      .then((data) => {
        if (data.subscription) {
          setSubscription(data.subscription)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching subscription:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading subscription info...</div>
  }

  if (!subscription) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Management</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Current Plan</p>
          <p className="text-lg font-semibold text-gray-900 capitalize">
            {subscription.tier}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="text-lg font-semibold text-gray-900 capitalize">
            {subscription.status}
          </p>
        </div>

        {subscription.tier !== 'free' && (
          <div className="pt-4 border-t">
            <Link
              href="/pricing"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Manage Subscription →
            </Link>
          </div>
        )}

        {subscription.tier === 'free' && (
          <div className="pt-4 border-t">
            <Link
              href="/pricing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Upgrade Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
