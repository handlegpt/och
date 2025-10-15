import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

// 安全检查：确保必要的环境变量存在
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET')
  throw new Error('Supabase configuration is incomplete')
}

// 创建 Supabase 客户端
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : null

// 在开发环境中将 Supabase 客户端暴露到 window 对象，方便调试
if (typeof window !== 'undefined' && supabase) {
  ;(window as any).supabase = supabase
  console.log('🔧 Supabase client exposed to window.supabase for debugging')
}

// 数据库类型定义
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'basic' | 'pro' | 'max' | 'admin'
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'basic' | 'pro' | 'max' | 'admin'
          is_admin?: boolean
        }
        Update: {
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'basic' | 'pro' | 'max' | 'admin'
          is_admin?: boolean
        }
      }
      ai_generations: {
        Row: {
          id: string
          user_id: string
          transformation_type: string
          input_image_url: string | null
          output_image_url: string | null
          content_url: string | null
          prompt: string | null
          custom_prompt: string | null
          title: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          tokens_used: number
          processing_time_ms: number | null
          created_at: string
        }
        Insert: {
          user_id: string
          transformation_type: string
          input_image_url?: string | null
          output_image_url?: string | null
          content_url?: string | null
          prompt?: string | null
          custom_prompt?: string | null
          title?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          tokens_used?: number
          processing_time_ms?: number | null
        }
        Update: {
          output_image_url?: string | null
          content_url?: string | null
          title?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          tokens_used?: number
          processing_time_ms?: number | null
        }
      }
      usage_stats: {
        Row: {
          id: string
          user_id: string
          date: string
          generations_count: number
          tokens_used: number
          created_at: string
        }
        Insert: {
          user_id: string
          date: string
          generations_count?: number
          tokens_used?: number
        }
        Update: {
          generations_count?: number
          tokens_used?: number
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          price_monthly: number
          price_yearly: number
          daily_limit: number
          features: any[]
          is_active: boolean
          created_at: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'cancelled' | 'expired' | 'past_due'
          current_period_start: string | null
          current_period_end: string | null
          stripe_subscription_id: string | null
          created_at: string
        }
      }
    }
  }
}

// 类型化的 Supabase 客户端
export type TypedSupabaseClient =
  typeof supabase extends ReturnType<typeof createClient<infer Database>>
    ? ReturnType<typeof createClient<Database>>
    : null
