import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentMonthUsage, initializeMonthlyUsage } from '@/lib/usage'
import { canPerformSearch } from '@/lib/subscription'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Get or initialize usage
    let usage = await getCurrentMonthUsage(user.id)
    if (!usage) {
      usage = await initializeMonthlyUsage(user.id, profile.subscription_tier)
    }

    const canSearch = canPerformSearch(
      profile.subscription_tier,
      usage.searches_used,
      usage.searches_limit
    )

    return NextResponse.json({
      canSearch,
      searchesUsed: usage.searches_used,
      searchesLimit: usage.searches_limit,
      tier: profile.subscription_tier,
    })
  } catch (error: any) {
    console.error('Usage check error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
