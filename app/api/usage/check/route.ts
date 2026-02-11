import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentMonthUsage, initializeMonthlyUsage } from '@/lib/usage'
import { canPerformSearch } from '@/lib/subscription'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

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
    let profileData: Profile | null = null
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      profileData = existingProfile as Profile
    } else {
      // Create profile if it doesn't exist
      const { data: newProfile } = await (supabase
        .from('profiles') as any)
        .insert({
          id: user.id,
          email: user.email!,
          subscription_tier: 'free',
          subscription_status: 'active',
        })
        .select()
        .single()
      
      if (!newProfile) {
        return NextResponse.json(
          { error: 'Failed to create profile' },
          { status: 500 }
        )
      }
      
      profileData = newProfile as unknown as Profile
    }

    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const profile = profileData

    // Get or initialize usage
    let usage = await getCurrentMonthUsage(user.id)
    if (!usage) {
      usage = await initializeMonthlyUsage(user.id)
    }

    const canSearch = canPerformSearch(
      usage.searches_used,
      usage.searches_limit
    )

    return NextResponse.json({
      canSearch,
      searchesUsed: usage.searches_used,
      searchesLimit: usage.searches_limit,
    })
  } catch (error: any) {
    console.error('Usage check error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
