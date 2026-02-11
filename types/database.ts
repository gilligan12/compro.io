export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          subscription_tier: 'free' | 'pro' | 'premium'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: 'active' | 'canceled' | 'past_due'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          subscription_tier?: 'free' | 'pro' | 'premium'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_tier?: 'free' | 'pro' | 'premium'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          month: string
          searches_used: number
          searches_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          searches_used?: number
          searches_limit: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          searches_used?: number
          searches_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      property_searches: {
        Row: {
          id: string
          user_id: string
          property_address: string
          property_data: Record<string, unknown>
          comparables_count: number
          comparables_data: Record<string, unknown>[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_address: string
          property_data: Record<string, unknown>
          comparables_count: number
          comparables_data: Record<string, unknown>[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_address?: string
          property_data?: Record<string, unknown>
          comparables_count?: number
          comparables_data?: Record<string, unknown>[]
          created_at?: string
        }
      }
      subscription_events: {
        Row: {
          id: string
          user_id: string
          event_type: 'created' | 'updated' | 'canceled'
          stripe_event_id: string
          event_data: Record<string, unknown>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: 'created' | 'updated' | 'canceled'
          stripe_event_id: string
          event_data: Record<string, unknown>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: 'created' | 'updated' | 'canceled'
          stripe_event_id?: string
          event_data?: Record<string, unknown>
          created_at?: string
        }
      }
    }
  }
}
