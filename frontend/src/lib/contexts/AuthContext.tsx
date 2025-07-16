"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '@/lib/utils';
import { apiService } from '@/lib/services/api';
import {
  User as BackendUser,
  SignUpRequest as CustomerSignupData,
  TechnicianSignUpRequest as TechnicianSignupData,
  apiRoleToUserRole,
} from '@/types/api';

// Re-export backend User type with some frontend-specific extensions
export interface User extends BackendUser {
  // Frontend-specific fields for compatibility
  name?: string
  avatar?: string
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

// Helper function to transform backend user to frontend user
function transformBackendUser(backendUser: BackendUser): User {
  return {
    ...backendUser,
    name: backendUser.fullName,
    avatar: backendUser.profileImage,
    // Add role-specific defaults
    ...(backendUser.role === 'CUSTOMER' && {
      totalBookings: 0,
      completedServices: 0,
      savedTechnicians: 0,
      totalSpent: 0
    }),
    ...(backendUser.role === 'TECHNICIAN' && {
      rating: 0,
      totalJobs: 0,
      monthlyEarnings: 0,
      specialties: [],
      isAvailable: true
    })
  };
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean
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
  const [isHydrated, setIsHydrated] = useState(false)

  // Load and validate user from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Only access localStorage on client side
        if (typeof window !== 'undefined') {
          const storedUser = apiService.getCurrentUser();
          const isAuthenticated = apiService.isAuthenticated();

          if (storedUser && isAuthenticated) {
            // Transform and set the stored user
            setUser(transformBackendUser(storedUser));
          } else {
            // Clear any invalid storage
            apiService.clearAuthData();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (typeof window !== 'undefined') {
          apiService.clearAuthData();
        }
      } finally {
        setIsLoading(false);
        setIsHydrated(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await apiService.auth.login({ email, password })

      if (response.success && response.data) {
        // Store auth data first
        apiService.setAuthData(response.data.user, response.data.token);

        // Transform backend user to frontend user format
        const transformedUser = transformBackendUser(response.data.user);
        setUser(transformedUser);
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const customerRegister = async (userData: CustomerSignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await apiService.auth.registerCustomer(userData)

      if (response.success && response.data) {
        const { user, token } = response.data;
        // Store auth data first
        apiService.setAuthData(user, token);

        // Transform and set user
        const transformedUser = transformBackendUser(user);
        setUser(transformedUser);
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const technicianRegister = async (userData: TechnicianSignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await apiService.auth.registerTechnician(userData)

      if (response.success) {
        // Technician registration requires admin approval, so no login
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await apiService.auth.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear user even if logout API fails
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const refreshUser = async (): Promise<void> => {
    if (!apiService.isAuthenticated()) return

    try {
      const response = await apiService.customer.getProfile()

      if (response.success && response.data) {
        const transformedUser = transformBackendUser(response.data);
        setUser(transformedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      // If refresh fails, user might be logged out
      await logout()
    }
  }

  const checkUserSession = () => {
    const currentUser = apiService.getCurrentUser()
    const isAuth = apiService.isAuthenticated()

    if (!currentUser || !isAuth) {
      setUser(null)
      return false
    }

    return true
  }

  const getUserRole = (): UserRole => {
    if (!user) return null

    // Convert API role to user role using the imported function
    return apiRoleToUserRole(user.role);
  }

  const isAuthenticated = isHydrated && !!user && (typeof window !== 'undefined' ? apiService.isAuthenticated() : false)

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isHydrated,
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
  return user?.role ? apiRoleToUserRole(user.role) : null
}

// Helper hook for checking specific permissions
export function usePermissions() {
  const { user } = useAuth()

  return {
    canCreateBookings: user?.role === 'CUSTOMER',
    canManageJobs: user?.role === 'TECHNICIAN',
    canAccessAdmin: user?.role === 'ADMIN',
    canEditProfile: !!user,
    canViewDashboard: !!user
  }
} 