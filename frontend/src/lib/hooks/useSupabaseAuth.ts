/**
 * Supabase Authentication Hooks for TechCare
 * Integrates Supabase Auth with existing user role system
 */

import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/supabase';

export interface AuthState {
  user: SupabaseUser | null;
  profile: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  signUp: (
    email: string,
    password: string,
    userData: SignUpData,
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export interface SignUpData {
  full_name: string;
  phone_number: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  // Technician specific fields
  gender?: string;
  age?: number;
  date_of_birth?: string;
  experience?: string;
  specialization?: string;
}

export function useSupabaseAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user && !session.user.is_anonymous) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.id);

      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_OUT') {
        // Explicitly clear all state on sign out
        setProfile(null);
        setUser(null);
        setSession(null);
        setLoading(false);
        console.log('✅ Cleared auth state after sign out');
      } else if (session?.user && !session.user.is_anonymous) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (supabaseUserId: string) => {
    try {
      setError(null);
      console.log('Fetching profile for user ID:', supabaseUserId);

      // Fetch the user profile based on id (not user_id)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUserId)
        .single();

      if (error) {
        console.log('Profile fetch error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          queriedUserId: supabaseUserId,
          userIdType: typeof supabaseUserId,
          userIdLength: supabaseUserId?.length,
        });

        // Handle missing profile (PGRST116 = no rows returned)
        if (error.code === 'PGRST116') {
          console.log('❌ No profile found for user:', supabaseUserId);
          console.log('🔍 This could mean:');
          console.log('  1. Profile was not created in database');
          console.log('  2. UUID mismatch between auth and profile');
          console.log('  3. Database caching issue');
          setProfile(null);
        } else {
          console.error('Unexpected error fetching profile:', error);
          setError('Failed to fetch user profile');
        }
      } else {
        console.log('✅ Profile found successfully:', data);
        setProfile(data);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  // Sign up new user
  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      setLoading(true);
      setError(null);

      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        phone: userData.phone_number,
        options: {
          data: {
            full_name: userData.full_name.trim(),
            role: userData.role || 'CUSTOMER',
            is_active: true,
          }
        }
      });

      if (authError) {
        console.log('signup error: ', authError.message, authError.status, authError.code);
        throw authError;
      }

      if (authData.user) {
        // Validate required fields
        if (!userData.full_name?.trim()) {
          throw new Error('Full name is required');
        }
        if (!userData.phone_number?.trim()) {
          throw new Error('Phone number is required');
        }
        if (!email?.trim()) {
          throw new Error('Email is required');
        }

        // Prepare user profile data with current timestamp
        const now = new Date().toISOString();
        const profileData = {
          id: authData.user.id,
          email: email.toLowerCase().trim(),
          full_name: userData.full_name.trim(),
          phone_number: userData.phone_number.trim(),
          role: userData.role || 'CUSTOMER',
          is_active: true,
          created_at: now,
          updated_at: now,
        } satisfies User;

        console.log('Attempting to insert profile data:', profileData);

        // First test if we can access the users table
        const { error: accessError } = await supabase.from('users').select('id').limit(1);

        if (accessError) {
          console.error('Cannot access users table:', accessError);
          throw new Error(`Database access error: ${accessError.message}`);
        }

        // Create user profile in database using UPSERT to handle existing records
        let insertedProfile = null;
        const { data: insertedProfileData, error: profileError } = await supabase
          .from('users')
          .upsert(profileData, {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();

        insertedProfile = insertedProfileData;

        // If email conflict, try updating by email instead
        if (profileError && profileError.code === '23505' && profileError.message.includes('email')) {
          console.log('Email conflict detected, trying update by email...');
          const { data: updatedProfile, error: updateError } = await supabase
            .from('users')
            .update({
              ...profileData,
              updated_at: new Date().toISOString(),
            })
            .eq('email', profileData.email)
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }
          insertedProfile = updatedProfile;
        } else if (profileError) {
          throw profileError;
        }

        if (insertedProfile) {
          // For technicians, also create technician_details record
          if (userData.role === 'TECHNICIAN') {
            const technicianDetailsData = {
              user_id: insertedProfile.id, // user_id in technician_details references users.id
              gender: userData.gender,
              age: userData.age,
              date_of_birth: userData.date_of_birth,
              experience: userData.experience || '',
              specialization: userData.specialization || '',
              is_available: true,
              rate: 15000, // Default rate
              created_at: now,
              updated_at: now,
            };

            const { error: techError } = await supabase
              .from('technician_details')
              .insert(technicianDetailsData);

            if (techError) {
              console.error('Error creating technician details:', techError);
              // Don't fail the whole signup for this
            }
          }

          console.log('✅ Profile created successfully:', insertedProfile);
          setProfile(insertedProfile);
          return { success: true };
        } else {
          throw new Error('Failed to create user profile');
        }
      } else {
        throw new Error('Failed to create user profile');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed');
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 Attempting to sign in with email:', email, password, data, error);

      if (error) throw error;

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clear all local state first
      setUser(null);
      setProfile(null);
      setSession(null);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      console.log('✅ Successfully signed out');

      // Force a page reload to clear any cached state
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign out failed:', error);
      setError('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      setError(null);

      if (!user || !profile) {
        throw new Error('No user logged in');
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local profile state
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Reset failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    profile,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
  };
}

// Helper hook for role checking
export function useUserRole() {
  const { profile } = useSupabaseAuth();

  return {
    role: profile?.role || null,
    isCustomer: profile?.role === 'CUSTOMER',
    isTechnician: profile?.role === 'TECHNICIAN',
    isAdmin: profile?.role === 'ADMIN',
    isAuthenticated: !!profile,
  };
}
