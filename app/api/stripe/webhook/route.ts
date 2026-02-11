import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type SubscriptionEventInsert = Database['public']['Tables']['subscription_events']['Insert']

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const userId = session.metadata?.userId

        if (userId) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // Determine tier based on price ID
          const priceId = subscription.items.data[0]?.price.id
          let tier: 'pro' | 'premium' = 'pro'
          
          if (priceId && priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
            tier = 'premium'
          }

          // Update user profile
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: session.customer,
              stripe_subscription_id: subscription.id,
              subscription_tier: tier,
              subscription_status: 'active',
            })
            .eq('id', userId)

          // Log event
          await supabase.from('subscription_events').insert({
            user_id: userId,
            event_type: 'created',
            stripe_event_id: event.id,
            event_data: event.data.object,
          } as SubscriptionEventInsert)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        // Find user by customer ID
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profileData) {
          const profile = profileData as Profile
          const priceId = subscription.items.data[0]?.price.id
          let tier: 'pro' | 'premium' = 'pro'
          
          if (priceId && priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
            tier = 'premium'
          }

          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_status: subscription.status === 'active' ? 'active' : 'canceled',
            })
            .eq('id', profile.id)

          await supabase.from('subscription_events').insert({
            user_id: profile.id,
            event_type: 'updated',
            stripe_event_id: event.id,
            event_data: event.data.object,
          } as SubscriptionEventInsert)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profileData) {
          const profile = profileData as Profile
          
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'free',
              subscription_status: 'canceled',
            })
            .eq('id', profile.id)

          await supabase.from('subscription_events').insert({
            user_id: profile.id,
            event_type: 'canceled',
            stripe_event_id: event.id,
            event_data: event.data.object,
          } as SubscriptionEventInsert)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
