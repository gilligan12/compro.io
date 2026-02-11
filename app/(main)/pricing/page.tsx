'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PricingCard from '@/components/PricingCard'
import { SUBSCRIPTION_PRICES } from '@/types/subscription'

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to create checkout session')
        setLoading(null)
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('An error occurred. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name="Free"
            price={SUBSCRIPTION_PRICES.free}
            searches={5}
            comparables={5}
            features={[
              '5 property searches per month',
              '5 comparables per search',
              'Search history tracking',
            ]}
            onSelect={() => router.push('/')}
            loading={false}
          />

          <PricingCard
            name="Pro"
            price={SUBSCRIPTION_PRICES.pro}
            searches={25}
            comparables={10}
            features={[
              '25 property searches per month',
              '10 comparables per search',
              'Search history tracking',
              'Priority support',
            ]}
            onSelect={() => {
              const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
              if (priceId) handleSubscribe(priceId)
            }}
            loading={loading === (process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'pro')}
            highlighted
          />

          <PricingCard
            name="Premium"
            price={SUBSCRIPTION_PRICES.premium}
            searches={null}
            comparables={15}
            features={[
              'Unlimited property searches',
              '15 comparables per search',
              'Search history tracking',
              'Priority support',
              'Advanced analytics',
            ]}
            onSelect={() => {
              const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
              if (priceId) handleSubscribe(priceId)
            }}
            loading={loading === (process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'premium')}
          />
        </div>
      </div>
    </div>
  )
}
