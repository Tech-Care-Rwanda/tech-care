"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserRole } from '@/lib/utils'
import { authService, User as BackendUser, CustomerSignupData, TechnicianSignupData } from '@/lib/services/authService'

// Re-export backend User type with some frontend-specific extensions
export interface User extends BackendUser {
  // Frontend-specific fields for compatibility
  name?: string
  avatar?: string
  status?: 'active' | 'inactive' | 'pending'
  lastLogin?: string
  // Customer specific
  totalBookings?: number
  completedServices?: number
  savedTechnicians?: number
  totalSpent?: number
  // Technician specific
  rating?: number
  totalJobs?: number
  monthlyEarnings?: number
  specialties?: string[]
  isAvailable?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  customerRegister: (userData: CustomerSignupData) => Promise<{ success: boolean; error?: string }>
  technicianRegister: (userData: TechnicianSignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load and validate user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser()
        const storedToken = authService.getStoredToken()

        if (storedUser && storedToken) {
          // Verify with backend
          const response = await authService.getCurrentUser()

          if (response.success && response.data) {
            // Transform backend user to frontend user format
            const transformedUser: User = {
              ...response.data,
              id: response.data.id.toString(),
              name: response.data.fullName,
              phone: response.data.phoneNumber,
              status: response.data.isActive ? 'active' : 'inactive',
              lastLogin: new Date().toISOString(),
              // Add role-specific defaults
              ...(response.data.role === 'CUSTOMER' && {
                totalBookings: 0,
                completedServices: 0,
                savedTechnicians: 0,
                totalSpent: 0
              }),
              ...(response.data.role === 'TECHNICIAN' && {
                rating: response.data.technicianDetails?.rate || 0,
                totalJobs: 0,
                monthlyEarnings: 0,
                specialties: response.data.technicianDetails?.specialization ? [response.data.technicianDetails.specialization] : [],
                isAvailable: response.data.technicianDetails?.isAvailable || false
              })
            }

            setUser(transformedUser)
          } else {
            // Invalid/expired token, clear storage
            await authService.logout()
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        await authService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })

      if (response.success && response.data) {
        // Transform backend user to frontend user format
        const transformedUser: User = {
          ...response.data.user,
          id: response.data.user.id.toString(),
          name: response.data.user.fullName,
          phone: response.data.user.phoneNumber,
          status: response.data.user.isActive ? 'active' : 'inactive',
          lastLogin: new Date().toISOString(),
          // Add role-specific defaults
          ...(response.data.user.role === 'CUSTOMER' && {
            totalBookings: 0,
            completedServices: 0,
            savedTechnicians: 0,
            totalSpent: 0
          }),
          ...(response.data.user.role === 'TECHNICIAN' && {
            rating: response.data.user.technicianDetails?.rate || 0,
            totalJobs: 0,
            monthlyEarnings: 0,
            specialties: response.data.user.technicianDetails?.specialization ? [response.data.user.technicianDetails.specialization] : [],
            isAvailable: response.data.user.technicianDetails?.isAvailable || false
          })
        }

        setUser(transformedUser)
        return { success: true }
      }

      return {
        success: false,
        error: response.error || 'Login failed. Please try again.'
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const customerRegister = async (userData: CustomerSignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await authService.customerSignup(userData)

      if (response.success && response.data) {
        // Transform and set user after successful registration
        const transformedUser: User = {
          ...response.data.user,
          id: response.data.user.id.toString(),
          name: response.data.user.fullName,
          phone: response.data.user.phoneNumber,
          status: response.data.user.isActive ? 'active' : 'inactive',
          lastLogin: new Date().toISOString(),
          totalBookings: 0,
          completedServices: 0,
          savedTechnicians: 0,
          totalSpent: 0
        }

        setUser(transformedUser)
        return { success: true }
      }

      return {
        success: false,
        error: response.error || 'Registration failed. Please try again.'
      }
    } catch (error) {
      console.error('Customer registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const technicianRegister = async (userData: TechnicianSignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await authService.technicianSignup(userData)

      if (response.success && response.data) {
        // Transform and set user after successful registration
        const transformedUser: User = {
          ...response.data.user,
          id: response.data.user.id.toString(),
          name: response.data.user.fullName,
          phone: response.data.user.phoneNumber,
          status: response.data.user.isActive ? 'active' : 'inactive',
          lastLogin: new Date().toISOString(),
          rating: response.data.user.technicianDetails?.rate || 0,
          totalJobs: 0,
          monthlyEarnings: 0,
          specialties: response.data.user.technicianDetails?.specialization ? [response.data.user.technicianDetails.specialization] : [],
          isAvailable: response.data.user.technicianDetails?.isAvailable || false
        }

        setUser(transformedUser)
        return { success: true }
      }

      return {
        success: false,
        error: response.error || 'Registration failed. Please try again.'
      }
    } catch (error) {
      console.error('Technician registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear user even if logout API fails
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    // Update localStorage with new user data
    localStorage.setItem('techcare-user', JSON.stringify(updatedUser))
  }

  const refreshUser = async (): Promise<void> => {
    if (!authService.isAuthenticated()) return

    try {
      const response = await authService.getCurrentUser()

      if (response.success && response.data) {
        const transformedUser: User = {
          ...response.data,
          id: response.data.id.toString(),
          name: response.data.fullName,
          phone: response.data.phoneNumber,
          status: response.data.isActive ? 'active' : 'inactive',
          lastLogin: new Date().toISOString(),
          // Add role-specific defaults
          ...(response.data.role === 'CUSTOMER' && {
            totalBookings: 0,
            completedServices: 0,
            savedTechnicians: 0,
            totalSpent: 0
          }),
          ...(response.data.role === 'TECHNICIAN' && {
            rating: response.data.technicianDetails?.rate || 0,
            totalJobs: 0,
            monthlyEarnings: 0,
            specialties: response.data.technicianDetails?.specialization ? [response.data.technicianDetails.specialization] : [],
            isAvailable: response.data.technicianDetails?.isAvailable || false
          })
        }

        setUser(transformedUser)
      } else {
        // Invalid session, logout
        await logout()
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      await logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    customerRegister,
    technicianRegister,
    logout,
    updateUser,
    refreshUser
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

// Helper hook for getting current user role safely
export function useUserRole(): UserRole {
  const { user } = useAuth()
  return user?.role || null
}

// Helper hook for checking specific permissions
export function usePermissions() {
  const { user } = useAuth()

  return {
    canCreateBookings: user?.role === 'customer',
    canManageJobs: user?.role === 'technician',
    canAccessAdmin: user?.role === 'admin',
    canEditProfile: !!user,
    canViewDashboard: !!user
  }
} 