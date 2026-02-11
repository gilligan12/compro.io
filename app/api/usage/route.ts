import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentMonthUsage, initializeMonthlyUsage } from '@/lib/usage'
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

    // Get or initialize usage
    let usage = await getCurrentMonthUsage(user.id)
    if (!usage) {
      usage = await initializeMonthlyUsage(user.id)
    }

    return NextResponse.json({
      usage: {
        searchesUsed: usage.searches_used,
        searchesLimit: usage.searches_limit,
      },
    })
  } catch (error: any) {
    console.error('Usage fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
