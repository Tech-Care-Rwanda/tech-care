/**
 * Protected Route Component for Role-based Access Control
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: ('CUSTOMER' | 'TECHNICIAN' | 'ADMIN')[]
    redirectTo?: string
    requireAuth?: boolean
}

export function ProtectedRoute({
    children,
    allowedRoles,
    redirectTo = '/login',
    requireAuth = true
}: ProtectedRouteProps) {
    const { user, profile, loading } = useSupabaseAuth()
    const router = useRouter()

    useEffect(() => {
        if (loading) return // Wait for auth state to load

        // Check if authentication is required
        if (requireAuth && !user) {
            router.push(redirectTo)
            return
        }

        // Check role-based access
        if (allowedRoles && profile) {
            if (!allowedRoles.includes(profile.role)) {
                // Redirect based on user role
                const roleRedirects = {
                    CUSTOMER: '/dashboard',
                    TECHNICIAN: '/technician/dashboard',
                    ADMIN: '/admin/dashboard'
                }
                router.push(roleRedirects[profile.role] || '/dashboard')
                return
            }
        }
    }, [user, profile, loading, router, allowedRoles, redirectTo, requireAuth])

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#FF385C]" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Show nothing if redirecting
    if (requireAuth && !user) {
        return null
    }

    // Show nothing if wrong role (will redirect)
    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        return null
    }

    return <>{children}</>
}

// Higher-order component version
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    options?: Omit<ProtectedRouteProps, 'children'>
) {
    return function AuthenticatedComponent(props: P) {
        return (
            <ProtectedRoute {...options}>
                <Component {...props} />
            </ProtectedRoute>
        )
    }
}

// Role-specific route components
export function CustomerRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
            {children}
        </ProtectedRoute>
    )
}

export function TechnicianRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['TECHNICIAN']}>
            {children}
        </ProtectedRoute>
    )
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            {children}
        </ProtectedRoute>
    )
}

// Component that shows different content based on role
interface RoleBasedContentProps {
    customer?: React.ReactNode
    technician?: React.ReactNode
    admin?: React.ReactNode
    fallback?: React.ReactNode
}

export function RoleBasedContent({
    customer,
    technician,
    admin,
    fallback
}: RoleBasedContentProps) {
    const { profile } = useSupabaseAuth()

    switch (profile?.role) {
        case 'CUSTOMER':
            return <>{customer || fallback}</>
        case 'TECHNICIAN':
            return <>{technician || fallback}</>
        case 'ADMIN':
            return <>{admin || fallback}</>
        default:
            return <>{fallback}</>
    }
} 