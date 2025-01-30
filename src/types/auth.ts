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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  activeProfile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  profileName: string;
}

export interface ProfileData {
  name: string;
  email: string;
  avatar?: string;
}
