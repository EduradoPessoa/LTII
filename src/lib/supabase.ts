import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase. Verifique .env');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Tipos para as tabelas
export interface User {
  id: string;
  email: string;
  is_admin: boolean;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile[];
  subscription?: Subscription;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled';
  start_date: string;
  end_date: string | null;
  max_profiles: number;
  price: number;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  subscription_id: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  payment_date: string;
  created_at: string;
}

// Funções auxiliares para o banco
export const db = {
  users: {
    // Buscar usuário com perfis e assinatura
    getWithRelations: async (userId: string) => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profiles (*),
          subscription:subscriptions (
            *,
            payments (*)
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as User & { profiles: Profile[]; subscription: Subscription & { payments: Payment[] } };
    },

    // Criar novo usuário
    create: async (email: string, hashedPassword: string, isAdmin = false) => {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email,
          encrypted_password: hashedPassword,
          is_admin: isAdmin,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  profiles: {
    // Criar novo perfil
    create: async (userId: string, name: string, email: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          name,
          email,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Atualizar status do perfil
    updateStatus: async (profileId: string, isActive: boolean) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  subscriptions: {
    // Criar nova assinatura
    create: async (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscription)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Atualizar status da assinatura
    updateStatus: async (subscriptionId: string, status: Subscription['status']) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },
};
