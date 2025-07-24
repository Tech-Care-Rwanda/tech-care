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
            if (session?.user && !session.user.is_anonymous) {
                fetchUserProfile(session.user.id)
            } else {
                setProfile(null)
                setLoading(false)
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user && !session.user.is_anonymous) {
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
            console.log('Fetching profile for user ID:', supabaseUserId)

            // First, try to see if ANY users exist with this email as a sanity check
            const { data: emailCheck } = await supabase
                .from('users')
                .select('supabase_user_id, email, full_name')
                .eq('email', 'customer1@gmail.com')
                .maybeSingle()

            console.log('Email check result:', emailCheck)

            // Now try the main query
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('supabase_user_id', supabaseUserId)
                .single()

            if (error) {
                console.log('Profile fetch error details:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    queriedUserId: supabaseUserId,
                    userIdType: typeof supabaseUserId,
                    userIdLength: supabaseUserId?.length
                })

                // Handle missing profile (PGRST116 = no rows returned)
                if (error.code === 'PGRST116') {
                    console.log('❌ No profile found for user:', supabaseUserId)
                    console.log('🔍 This could mean:')
                    console.log('  1. Profile was not created in database')
                    console.log('  2. UUID mismatch between auth and profile')
                    console.log('  3. Database caching issue')
                    setProfile(null)
                } else {
                    console.error('Unexpected error fetching profile:', error)
                    setError('Failed to fetch user profile')
                }
            } else {
                console.log('✅ Profile found successfully:', data)
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
                // Prepare user profile data
                const profileData = {
                    supabase_user_id: authData.user.id,
                    email: email,
                    full_name: userData.fullName,
                    phone_number: userData.phoneNumber,
                    role: userData.role || 'CUSTOMER',
                    is_active: true
                }

                console.log('Attempting to insert profile data:', profileData)

                // First test if we can access the users table
                const { error: accessError } = await supabase
                    .from('users')
                    .select('id')
                    .limit(1)

                if (accessError) {
                    console.error('Cannot access users table:', accessError)
                    throw new Error(`Database access error: ${accessError.message}`)
                }

                // Create user profile in database
                const { error: profileError } = await supabase
                    .from('users')
                    .insert(profileData)

                if (profileError) {
                    console.error('Profile creation error details:', {
                        message: profileError.message,
                        details: profileError.details,
                        hint: profileError.hint,
                        code: profileError.code,
                        profileData: profileData
                    })

                    // Try to clean up auth user if profile creation fails
                    try {
                        console.log('Attempting to sign out due to profile creation failure...')
                        await supabase.auth.signOut()
                    } catch (cleanupError) {
                        console.error('Cleanup error:', cleanupError)
                    }

                    throw new Error(`Profile creation failed: ${profileError.message}. Check console for details.`)
                }

                console.log('Profile created successfully for user:', authData.user.id)

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