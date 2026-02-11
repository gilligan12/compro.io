import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchComparables } from '@/lib/rentcast'
import { getCurrentMonthUsage, initializeMonthlyUsage, incrementSearchUsage, getComparablesLimit } from '@/lib/usage'
import { canPerformSearch } from '@/lib/subscription'
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

    // Check usage limits
    let usage = await getCurrentMonthUsage(user.id)
    if (!usage) {
      usage = await initializeMonthlyUsage(user.id)
    }

    const canSearch = canPerformSearch(
      usage.searches_used,
      usage.searches_limit
    )

    if (!canSearch) {
      return NextResponse.json(
        { error: 'Monthly search limit reached. You have used all 5 free searches this month.' },
        { status: 403 }
      )
    }

    // Get comparables limit
    const comparablesLimit = getComparablesLimit()

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
