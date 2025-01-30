export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          encrypted_password: string
          is_admin: boolean
          is_owner: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          encrypted_password: string
          is_admin?: boolean
          is_owner?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          encrypted_password?: string
          is_admin?: boolean
          is_owner?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'basic' | 'premium' | 'enterprise'
          status: 'active' | 'inactive' | 'cancelled'
          start_date: string
          end_date: string | null
          max_profiles: number
          price: number
          auto_renew: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'basic' | 'premium' | 'enterprise'
          status: 'active' | 'inactive' | 'cancelled'
          start_date: string
          end_date?: string | null
          max_profiles: number
          price: number
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'basic' | 'premium' | 'enterprise'
          status?: 'active' | 'inactive' | 'cancelled'
          start_date?: string
          end_date?: string | null
          max_profiles?: number
          price?: number
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          subscription_id: string
          amount: number
          status: 'success' | 'failed' | 'pending'
          payment_date: string
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          amount: number
          status: 'success' | 'failed' | 'pending'
          payment_date: string
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          amount?: number
          status?: 'success' | 'failed' | 'pending'
          payment_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
