import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { data: search, error } = await supabase
      .from('property_searches')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      )
    }

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
