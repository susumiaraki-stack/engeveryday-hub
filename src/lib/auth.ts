import { getSupabaseClient } from './supabase';
import type { UserProfile } from '../types';

export const signInWithGoogle = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not connected');
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  if (error) throw error;
};

export const signUpWithEmail = async (email: string, password: string, profile: Partial<UserProfile>) => {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not connected');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: profile.name,
        grade: profile.grade,
        studentNumber: profile.studentNumber,
        avatar: profile.avatar || '👩‍🎓'
      }
    }
  });
  
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not connected');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const getCurrentSession = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
