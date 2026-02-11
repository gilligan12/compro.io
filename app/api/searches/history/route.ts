import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const { data: searches, error } = await supabase
      .from('property_searches')
      .select('id, property_address, comparables_count, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching search history:', error)
      return NextResponse.json(
        { error: 'Failed to fetch search history' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      searches: searches || [],
    })
  } catch (error: any) {
    console.error('History error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
