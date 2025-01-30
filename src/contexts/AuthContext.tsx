import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, db, type User } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createProfile: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUser = async (userId: string) => {
    try {
      const userData = await db.users.getWithRelations(userId);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Buscar usuário pelo email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error('Email ou senha inválidos');
      }

      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, userData.encrypted_password);
      if (!passwordMatch) {
        throw new Error('Email ou senha inválidos');
      }

      // Fazer login no Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Carregar dados completos do usuário
      await loadUser(userData.id);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (name: string, email: string, password: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      setLoading(true);

      // Verificar limite de perfis
      if (user.subscription?.max_profiles && user.profiles?.length >= user.subscription.max_profiles) {
        throw new Error('Limite de perfis atingido para sua assinatura');
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar perfil
      const newProfile = await db.profiles.create(user.id, name, email);

      // Atualizar estado local
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          profiles: [...(prev.profiles || []), newProfile],
        };
      });

      // Enviar email de boas-vindas
      await fetch(`${import.meta.env.VITE_API_URL}/api/email/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    createProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
