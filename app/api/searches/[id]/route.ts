import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type PropertySearch = Database['public']['Tables']['property_searches']['Row']

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const { data: searchData, error } = await supabase
      .from('property_searches')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !searchData) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      )
    }

    const search = searchData as PropertySearch

    return NextResponse.json({
      search,
    })
  } catch (error: any) {
    console.error('Search fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
