import { supabase } from '../lib/supabase';
import { User, Profile } from '../types/auth';

export async function signUp(email: string, password: string): Promise<User> {
  const { data: auth, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  if (!auth.user) throw new Error('Failed to create user');

  const profile: Profile = {
    id: crypto.randomUUID(),
    user_id: auth.user.id,
    name: email.split('@')[0],
    email,
    is_active: true,
    is_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabase
    .from('profiles')
    .insert(profile);

  if (profileError) throw profileError;

  return {
    id: auth.user.id,
    email,
    is_admin: false,
    profiles: [profile],
  };
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data: auth, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!auth.user) throw new Error('Failed to sign in');

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', auth.user.id);

  if (profileError) throw profileError;
  if (!profiles.length) throw new Error('No profile found');

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', auth.user.id)
    .single();

  const mainProfile = profiles.find(p => p.is_admin) || profiles[0];

  return {
    id: auth.user.id,
    email: mainProfile.email,
    is_admin: mainProfile.is_admin,
    profiles,
    subscription: subscription || undefined,
  };
}

export async function updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to update profile');

  return data;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
