import { createClient } from '@/lib/supabase/server'
import { SubscriptionTier, SUBSCRIPTION_TIERS } from '@/types/subscription'
import { Database } from '@/types/database'

type UsageTracking = Database['public']['Tables']['usage_tracking']['Row']

export async function getCurrentMonthUsage(userId: string): Promise<UsageTracking | null> {
  const supabase = await createClient()
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .eq('month', firstDayOfMonth.toISOString().split('T')[0])
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error
  }
  
  return data as UsageTracking | null
}

export async function initializeMonthlyUsage(
  userId: string,
  tier: SubscriptionTier
): Promise<UsageTracking> {
  const supabase = await createClient()
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const limits = SUBSCRIPTION_TIERS[tier]
  
  const insertData: Database['public']['Tables']['usage_tracking']['Insert'] = {
    user_id: userId,
    month: firstDayOfMonth.toISOString().split('T')[0],
    searches_used: 0,
    searches_limit: limits.searchesPerMonth ?? 999999, // Use large number for unlimited
  }
  
  const { data, error } = await (supabase
    .from('usage_tracking') as any)
    .insert(insertData)
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  if (!data) {
    throw new Error('Failed to initialize monthly usage')
  }
  
  return data as UsageTracking
}

export async function incrementSearchUsage(userId: string) {
  const supabase = await createClient()
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const { error } = await supabase.rpc('increment_search_usage', {
    p_user_id: userId,
    p_month: firstDayOfMonth.toISOString().split('T')[0],
  })
  
  if (error) {
    // Fallback to manual update if RPC doesn't exist
    const current = await getCurrentMonthUsage(userId)
    if (current) {
      const { error: updateError } = await supabase
        .from('usage_tracking')
        .update({ searches_used: current.searches_used + 1 })
        .eq('id', current.id)
      
      if (updateError) {
        throw updateError
      }
    } else {
      throw error
    }
  }
}
