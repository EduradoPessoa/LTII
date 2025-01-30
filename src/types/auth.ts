export interface Profile {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: number;
}

export interface Subscription {
  id: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled';
  startDate: number;
  endDate: number;
  maxProfiles: number;
  price: number;
  autoRenew: boolean;
  lastPayment?: {
    date: number;
    amount: number;
    status: 'success' | 'failed' | 'pending';
  };
}

export interface User {
  id: string;
  email: string;
  password: string; // Será armazenado com hash
  isAdmin: boolean;
  profiles: Profile[];
  subscription?: Subscription;
  isOwner: boolean; // indica se é o dono da conta (pagante)
  createdAt: number;
  updatedAt: number;
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
