import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchComparables } from '@/lib/rentcast'
import { getCurrentMonthUsage, initializeMonthlyUsage, incrementSearchUsage } from '@/lib/usage'
import { canPerformSearch, getComparablesLimit } from '@/lib/subscription'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type PropertySearch = Database['public']['Tables']['property_searches']['Row']
type PropertySearchInsert = Database['public']['Tables']['property_searches']['Insert']

export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

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
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const profile = profileData as Profile

    // Check usage limits
    let usage = await getCurrentMonthUsage(user.id)
    if (!usage) {
      usage = await initializeMonthlyUsage(user.id, profile.subscription_tier)
    }

    const canSearch = canPerformSearch(
      profile.subscription_tier,
      usage.searches_used,
      usage.searches_limit
    )

    if (!canSearch) {
      return NextResponse.json(
        { error: 'Monthly search limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Get comparables limit for tier
    const comparablesLimit = getComparablesLimit(profile.subscription_tier)

    // Search RentCast API
    const searchResults = await searchComparables(address, comparablesLimit)

    // Save search to database
    const insertData: PropertySearchInsert = {
      user_id: user.id,
      property_address: address,
      property_data: searchResults.property as unknown as Record<string, unknown>,
      comparables_count: searchResults.comparables.length,
      comparables_data: searchResults.comparables as unknown as Record<string, unknown>[],
    }
    
    const { data: savedSearchData, error: saveError } = await (supabase
      .from('property_searches') as any)
      .insert(insertData)
      .select()
      .single()

    if (saveError || !savedSearchData) {
      console.error('Error saving search:', saveError)
      return NextResponse.json(
        { error: 'Failed to save search' },
        { status: 500 }
      )
    }

    const savedSearch = savedSearchData as PropertySearch

    // Increment usage
    await incrementSearchUsage(user.id)

    return NextResponse.json({
      success: true,
      searchId: savedSearch.id,
      property: searchResults.property,
      comparables: searchResults.comparables,
    })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during search' },
      { status: 500 }
    )
  }
}
