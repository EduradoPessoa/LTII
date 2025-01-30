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
          created_at: string
          updated_at: string
          user_id: string
          name: string
          email: string
          is_active: boolean
          is_admin: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          email: string
          is_active?: boolean
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          email?: string
          is_active?: boolean
          is_admin?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          plan: string
          status: string
          start_date: string
          end_date: string
          max_profiles: number
          price: number
          auto_renew: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          plan: string
          status?: string
          start_date: string
          end_date: string
          max_profiles: number
          price: number
          auto_renew?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          plan?: string
          status?: string
          start_date?: string
          end_date?: string
          max_profiles?: number
          price?: number
          auto_renew?: boolean
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
