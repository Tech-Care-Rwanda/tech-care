"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth, SignUpData } from '@/lib/hooks/useSupabaseAuth';
import type { User } from '@/lib/supabase';

// Context interface that matches the existing API for compatibility
interface AuthContextType {
  // Core auth state
  user: User | null
  supabaseUser: any // Supabase auth user
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean

  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  customerRegister: (userData: CustomerSignupData) => Promise<{ success: boolean; error?: string }>
  technicianRegister: (userData: TechnicianSignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>

  // Role helpers
  getUserRole: () => 'customer' | 'technician' | 'admin' | null
  isCustomer: boolean
  isTechnician: boolean
  isAdmin: boolean
}

// Compatibility types for existing components
export interface CustomerSignupData {
  fullName: string
  email: string
  password: string
  phoneNumber: string
}

export interface TechnicianSignupData extends CustomerSignupData {
  gender: string
  age: number
  dateOfBirth: string
  experience: string
  specialization: string
}

// Re-export User type for compatibility
export type { User }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseAuth = useSupabaseAuth()

  // Map Supabase auth state to existing interface
  const login = async (email: string, password: string) => {
    return await supabaseAuth.signIn(email, password)
  }

  const customerRegister = async (userData: CustomerSignupData) => {
    const signUpData: SignUpData = {
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      role: 'CUSTOMER'
    }
    return await supabaseAuth.signUp(userData.email, userData.password, signUpData)
  }

  const technicianRegister = async (userData: TechnicianSignupData) => {
    const signUpData: SignUpData = {
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      role: 'TECHNICIAN',
      gender: userData.gender,
      age: userData.age,
      dateOfBirth: userData.dateOfBirth,
      experience: userData.experience,
      specialization: userData.specialization
    }
    return await supabaseAuth.signUp(userData.email, userData.password, signUpData)
  }

  const logout = async () => {
    await supabaseAuth.signOut()
  }

  const updateUser = async (userData: Partial<User>) => {
    return await supabaseAuth.updateProfile(userData)
  }

  const refreshUser = async () => {
    // Supabase automatically handles session refresh
    // This method is kept for compatibility
  }

  const getUserRole = (): 'customer' | 'technician' | 'admin' | null => {
    if (!supabaseAuth.profile) return null
    return supabaseAuth.profile.role.toLowerCase() as 'customer' | 'technician' | 'admin'
  }

  const value: AuthContextType = {
    user: supabaseAuth.profile,
    supabaseUser: supabaseAuth.user,
    isAuthenticated: !!supabaseAuth.user && !!supabaseAuth.profile,
    isLoading: supabaseAuth.loading,
    isHydrated: !supabaseAuth.loading, // Supabase handles hydration differently
    login,
    customerRegister,
    technicianRegister,
    logout,
    updateUser,
    refreshUser,
    getUserRole,
    isCustomer: supabaseAuth.profile?.role === 'CUSTOMER',
    isTechnician: supabaseAuth.profile?.role === 'TECHNICIAN',
    isAdmin: supabaseAuth.profile?.role === 'ADMIN',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Transform function for backward compatibility
export function transformBackendUser(backendUser: any): User {
  return {
    id: backendUser.id,
    full_name: backendUser.fullName || backendUser.full_name,
    email: backendUser.email,
    phone_number: backendUser.phoneNumber || backendUser.phone_number,
    role: backendUser.role,
    is_active: backendUser.isActive ?? backendUser.is_active ?? true,
    created_at: backendUser.createdAt || backendUser.created_at,
    updated_at: backendUser.updatedAt || backendUser.updated_at,
    supabase_user_id: backendUser.supabase_user_id
  }
} 