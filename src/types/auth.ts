import { Database } from '../lib/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export interface User {
  id: string;
  email: string;
  is_admin: boolean;
  profiles: Profile[];
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
