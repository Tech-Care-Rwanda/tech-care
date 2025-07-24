"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'

interface RoleBasedRedirectProps {
  children?: React.ReactNode
}

/**
 * Component that redirects authenticated users to their role-appropriate dashboard
 * Used on the home page and other public pages to provide seamless navigation
 */
export function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const { user, profile, loading } = useSupabaseAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect while loading or if user is not authenticated
    if (loading || !user || !profile) return

    // Define role-based redirects
    const roleRedirects = {
      CUSTOMER: '/dashboard',
      TECHNICIAN: '/technician/dashboard',
      ADMIN: '/admin/dashboard' // TODO: Create admin dashboard
    }

    // Get redirect path for user's role
    const redirectPath = roleRedirects[profile.role as keyof typeof roleRedirects]
    
    if (redirectPath) {
      console.log(`Redirecting ${profile.role} to ${redirectPath}`)
      router.push(redirectPath)
    }
  }, [user, profile, loading, router])

  // Show children (usually the public page content) while not authenticated or loading
  return <>{children}</>
}

/**
 * Higher-order component for role-based routing
 */
export function withRoleBasedRedirect<P extends object>(
  Component: React.ComponentType<P>
) {
  return function RoleBasedComponent(props: P) {
    return (
      <RoleBasedRedirect>
        <Component {...props} />
      </RoleBasedRedirect>
    )
  }
}

/**
 * Hook for getting role-based redirect paths
 */
export function useRoleBasedRedirect() {
  const { profile } = useSupabaseAuth()

  const getRoleRedirectPath = (role?: string) => {
    const roleRedirects = {
      CUSTOMER: '/dashboard',
      TECHNICIAN: '/technician/dashboard',
      ADMIN: '/admin/dashboard'
    }

    return roleRedirects[role as keyof typeof roleRedirects] || '/dashboard'
  }

  const getCurrentUserRedirectPath = () => {
    return profile ? getRoleRedirectPath(profile.role) : null
  }

  return {
    getRoleRedirectPath,
    getCurrentUserRedirectPath
  }
}