"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserRole } from '@/lib/utils'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
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
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  switchRole: (newRole: UserRole) => void // For demo purposes
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: 'customer-1',
    name: 'John Doe',
    email: 'john@customer.com',
    phone: '+250 788 123 456',
    role: 'customer',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: new Date().toISOString(),
    totalBookings: 12,
    completedServices: 15,
    savedTechnicians: 8,
    totalSpent: 125000
  },
  {
    id: 'technician-1', 
    name: 'Marie Uwimana',
    email: 'marie@technician.com',
    phone: '+250 788 654 321',
    role: 'technician',
    status: 'active',
    createdAt: '2024-01-10',
    lastLogin: new Date().toISOString(),
    rating: 4.8,
    totalJobs: 42,
    monthlyEarnings: 85000,
    specialties: ['Computer Repair', 'Network Setup'],
    isAvailable: true
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@techcare.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString()
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const storedUser = localStorage.getItem('techcare-user')
        const storedToken = localStorage.getItem('techcare-token')
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser)
          // Validate stored user data
          if (userData.id && userData.email && userData.role) {
            setUser(userData)
          } else {
            // Invalid stored data, clear it
            localStorage.removeItem('techcare-user')
            localStorage.removeItem('techcare-token')
          }
        }
      } catch (error) {
        console.error('Error loading stored user:', error)
        // Clear invalid stored data
        localStorage.removeItem('techcare-user')
        localStorage.removeItem('techcare-token')
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredUser()
  }, [])

  const login = async (email: string, password: string, role?: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Find user in mock data
      let foundUser = MOCK_USERS.find(u => u.email === email)
      
      if (!foundUser) {
        return { success: false, error: 'User not found' }
      }

      // If role specified, check if user has that role
      if (role && foundUser.role !== role) {
        return { success: false, error: `This email is not registered as a ${role}` }
      }

      // Mock password validation (in real app, this would be handled by backend)
      if (password.length < 3) {
        return { success: false, error: 'Invalid password' }
      }

      // Update last login
      foundUser = { ...foundUser, lastLogin: new Date().toISOString() }

      // Store user data
      setUser(foundUser)
      localStorage.setItem('techcare-user', JSON.stringify(foundUser))
      localStorage.setItem('techcare-token', `mock-token-${foundUser.id}`)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email)
      if (existingUser) {
        return { success: false, error: 'Email already registered' }
      }

      // Create new user
      const newUser: User = {
        id: `${userData.role}-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        // Initialize role-specific data
        ...(userData.role === 'customer' && {
          totalBookings: 0,
          completedServices: 0, 
          savedTechnicians: 0,
          totalSpent: 0
        }),
        ...(userData.role === 'technician' && {
          rating: 0,
          totalJobs: 0,
          monthlyEarnings: 0,
          specialties: [],
          isAvailable: true
        })
      }

      // Add to mock users (in real app, this would be API call)
      MOCK_USERS.push(newUser)

      // Auto-login after registration
      setUser(newUser)
      localStorage.setItem('techcare-user', JSON.stringify(newUser))
      localStorage.setItem('techcare-token', `mock-token-${newUser.id}`)
      
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('techcare-user')
    localStorage.removeItem('techcare-token')
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('techcare-user', JSON.stringify(updatedUser))
  }

  const switchRole = (newRole: UserRole) => {
    if (!user) return
    
    // Find or create user with new role
    let newUser = MOCK_USERS.find(u => u.email === user.email && u.role === newRole)
    
    if (!newUser) {
      // Create new user instance with different role
      newUser = {
        ...user,
        id: `${newRole}-${Date.now()}`,
        role: newRole,
        // Reset role-specific data
        ...(newRole === 'customer' && {
          totalBookings: 0,
          completedServices: 0,
          savedTechnicians: 0,
          totalSpent: 0
        }),
        ...(newRole === 'technician' && {
          rating: 0,
          totalJobs: 0,
          monthlyEarnings: 0,
          specialties: [],
          isAvailable: true
        })
      }
      MOCK_USERS.push(newUser)
    }

    setUser(newUser)
    localStorage.setItem('techcare-user', JSON.stringify(newUser))
    localStorage.setItem('techcare-token', `mock-token-${newUser.id}`)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register, 
    logout,
    updateUser,
    switchRole
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