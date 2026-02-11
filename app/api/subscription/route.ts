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

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

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
