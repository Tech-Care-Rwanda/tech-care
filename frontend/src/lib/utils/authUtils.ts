import { ApiRole } from '@/types/api'

/**
 * Determines the correct dashboard route based on user role
 */
export function getRoleBasedDashboardRoute(role: ApiRole): string {
    switch (role) {
        case 'CUSTOMER':
            return '/dashboard'
        case 'TECHNICIAN':
            return '/dashboard/technician'
        case 'ADMIN':
            return '/dashboard' // Admin uses the same dashboard as customer for now
        default:
            return '/dashboard'
    }
}

/**
 * Determines the appropriate redirect route after login
 */
export function getPostLoginRedirect(role: ApiRole): string {
    // Redirect all users to the landing page after login
    return '/'
}

/**
 * Determines the appropriate redirect route after signup
 */
export function getPostSignupRedirect(role: ApiRole): string {
    switch (role) {
        case 'CUSTOMER':
            return '/dashboard'
        case 'TECHNICIAN':
            // Technicians need admin approval, so redirect to pending page
            return '/signup/pending-approval'
        case 'ADMIN':
            return '/dashboard'
        default:
            return '/dashboard'
    }
}

/**
 * Checks if a user should be automatically logged in after signup
 */
export function shouldAutoLoginAfterSignup(role: ApiRole): boolean {
    switch (role) {
        case 'CUSTOMER':
            return true
        case 'TECHNICIAN':
            return false // Technicians need admin approval
        case 'ADMIN':
            return true
        default:
            return false
    }
} 