/**
 * Supabase Authentication Hooks for TechCare
 * Integrates Supabase Auth with existing user role system
 */

import { useState, useEffect } from 'react'
import { User as SupabaseUser, AuthError, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { User } from '@/lib/supabase'

export interface AuthState {
    user: SupabaseUser | null
    profile: User | null
    session: Session | null
    loading: boolean
    error: string | null
}

export interface AuthActions {
    signUp: (email: string, password: string, userData: SignUpData) => Promise<{ success: boolean; error?: string }>
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signOut: () => Promise<void>
    updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
    updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
}

export interface SignUpData {
    fullName: string
    phoneNumber: string
    role?: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN'
    // Technician specific fields
    gender?: string
    age?: number
    dateOfBirth?: string
    experience?: string
    specialization?: string
}

export function useSupabaseAuth(): AuthState & AuthActions {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [profile, setProfile] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Initialize auth state
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchUserProfile(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user) {
                await fetchUserProfile(session.user.id)
            } else {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    // Fetch user profile from database
    const fetchUserProfile = async (supabaseUserId: string) => {
        try {
            setError(null)
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('supabase_user_id', supabaseUserId)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                setError('Failed to fetch user profile')
            } else {
                setProfile(data)
            }
        } catch (err) {
            console.error('Profile fetch error:', err)
            setError('Failed to fetch user profile')
        } finally {
            setLoading(false)
        }
    }

    // Sign up new user
    const signUp = async (email: string, password: string, userData: SignUpData) => {
        try {
            setLoading(true)
            setError(null)

            // Create Supabase auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            })

            if (authError) throw authError

            if (authData.user) {
                // Create user profile in database
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({
                        supabase_user_id: authData.user.id,
                        email,
                        full_name: userData.fullName,
                        phone_number: userData.phoneNumber,
                        role: userData.role || 'CUSTOMER',
                        is_active: true,
                    })

                if (profileError) {
                    console.error('Profile creation error:', profileError)
                    // Clean up auth user if profile creation fails
                    await supabase.auth.admin.deleteUser(authData.user.id)
                    throw new Error('Failed to create user profile')
                }

                // Create technician details if role is TECHNICIAN
                if (userData.role === 'TECHNICIAN' && userData.specialization) {
                    const userProfile = await supabase
                        .from('users')
                        .select('id')
                        .eq('supabase_user_id', authData.user.id)
                        .single()

                    if (userProfile.data) {
                        await supabase
                            .from('technician_details')
                            .insert({
                                user_id: userProfile.data.id,
                                gender: userData.gender || '',
                                age: userData.age || 0,
                                date_of_birth: userData.dateOfBirth || new Date().toISOString(),
                                experience: userData.experience || '',
                                specialization: userData.specialization,
                                certificate_url: '', // Will be updated later
                                approval_status: 'PENDING',
                            })
                    }
                }

                return { success: true }
            }

            throw new Error('No user returned from signup')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Signup failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    // Sign in user
    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true)
            setError(null)

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            return { success: true }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    // Sign out user
    const signOut = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        setProfile(null)
        setLoading(false)
    }

    // Update user profile
    const updateProfile = async (updates: Partial<User>) => {
        try {
            if (!user || !profile) throw new Error('No user logged in')

            setError(null)
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('supabase_user_id', user.id)

            if (error) throw error

            // Update local profile state
            setProfile(prev => prev ? { ...prev, ...updates } : null)
            return { success: true }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Update failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        }
    }

    // Reset password
    const resetPassword = async (email: string) => {
        try {
            setError(null)
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error
            return { success: true }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Reset failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        }
    }

    // Update password
    const updatePassword = async (newPassword: string) => {
        try {
            setError(null)
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (error) throw error
            return { success: true }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Password update failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        }
    }

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
    }
}

// Helper hook for role checking
export function useUserRole() {
    const { profile } = useSupabaseAuth()

    return {
        role: profile?.role || null,
        isCustomer: profile?.role === 'CUSTOMER',
        isTechnician: profile?.role === 'TECHNICIAN',
        isAdmin: profile?.role === 'ADMIN',
        isAuthenticated: !!profile,
    }
} 