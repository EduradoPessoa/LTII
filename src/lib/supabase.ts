import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Valores padrão para desenvolvimento local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Anon Key:', SUPABASE_ANON_KEY);

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
    async getWithRelations(userId: string) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*, profiles (*), subscription:subscriptions (*)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return user;
    },

    // Criar novo usuário
    async create(email: string, hashedPassword: string, isAdmin = false) {
      const { data: user, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            encrypted_password: hashedPassword,
            is_admin: isAdmin,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return user;
    },
  },

  profiles: {
    // Criar novo perfil
    async create(userId: string, name: string, email: string) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: userId,
            name,
            email,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return profile;
    },

    // Atualizar status do perfil
    async updateStatus(profileId: string, isActive: boolean) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return profile;
    },
  },

  subscriptions: {
    // Criar nova assinatura
    async create(subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscription])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Atualizar status da assinatura
    async updateStatus(subscriptionId: string, status: Subscription['status']) {
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
