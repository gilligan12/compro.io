import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

    const { data: profileData } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const profile = profileData as Profile

    return NextResponse.json({
      subscription: {
        tier: profile.subscription_tier,
        status: profile.subscription_status,
        stripeCustomerId: profile.stripe_customer_id,
      },
    })
  } catch (error: any) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
