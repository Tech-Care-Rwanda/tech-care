/**
 * Custom React Hooks for API calls
 * Provides easy-to-use hooks for common API operations
 */

import { useState, useEffect } from 'react'
import { apiService, ApiResponse } from '@/lib/services/api'
import { authService } from '@/lib/services/authService'
import { API_ENDPOINTS } from '@/lib/config/api'

// Generic hook for API calls
export function useApiCall<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    dependencies: any[] = [],
    autoFetch = true
) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(autoFetch)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await apiCall()

            if (response.success) {
                setData(response.data || null)
            } else {
                setError(response.error || 'Unknown error occurred')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData()
        }
    }, dependencies)

    return {
        data,
        loading,
        error,
        refetch: fetchData
    }
}

// Hook for technician management (admin)
export function useTechnicians() {
    return useApiCall(
        () => apiService.get(API_ENDPOINTS.ADMIN.GET_TECHNICIANS),
        [],
        true
    )
}

// Hook for single technician details
export function useTechnicianDetails(technicianId: string) {
    return useApiCall(
        () => apiService.get(API_ENDPOINTS.ADMIN.GET_TECHNICIAN_DETAILS(technicianId)),
        [technicianId],
        !!technicianId
    )
}

// Hook for user profile
export function useUserProfile() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProfile = async () => {
        try {
            setLoading(true)
            setError(null)

            const user = authService.getStoredUser()
            if (!user) {
                setError('No authenticated user')
                return
            }

            let endpoint: string
            switch (user.role) {
                case 'CUSTOMER':
                    endpoint = API_ENDPOINTS.CUSTOMER.PROFILE
                    break
                case 'ADMIN':
                    endpoint = API_ENDPOINTS.ADMIN.PROFILE
                    break
                case 'TECHNICIAN':
                    // For now, use customer endpoint for technicians
                    endpoint = API_ENDPOINTS.CUSTOMER.PROFILE
                    break
                default:
                    setError('Invalid user role')
                    return
            }

            const response = await apiService.get(endpoint)

            if (response.success) {
                setData(response.data)
            } else {
                setError(response.error || 'Failed to fetch profile')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return {
        data,
        loading,
        error,
        refetch: fetchProfile
    }
}

// Hook for health check
export function useHealthCheck() {
    return useApiCall(
        () => apiService.healthCheck(),
        [],
        true
    )
}

// Hook for admin operations
export function useAdminOperations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const approveTechnician = async (technicianId: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await apiService.put(API_ENDPOINTS.ADMIN.APPROVE_TECHNICIAN(technicianId))

            if (!response.success) {
                setError(response.error || 'Failed to approve technician')
                return false
            }

            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error')
            return false
        } finally {
            setLoading(false)
        }
    }

    const rejectTechnician = async (technicianId: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await apiService.put(API_ENDPOINTS.ADMIN.REJECT_TECHNICIAN(technicianId))

            if (!response.success) {
                setError(response.error || 'Failed to reject technician')
                return false
            }

            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error')
            return false
        } finally {
            setLoading(false)
        }
    }

    const promoteToAdmin = async (customerId: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await apiService.put(API_ENDPOINTS.ADMIN.PROMOTE_TO_ADMIN(customerId))

            if (!response.success) {
                setError(response.error || 'Failed to promote user')
                return false
            }

            return true
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error')
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        approveTechnician,
        rejectTechnician,
        promoteToAdmin
    }
}

// Hook for password operations
export function usePasswordOperations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const forgotPassword = async (email: string) => {
        try {
            setLoading(true)
            setError(null)
            setSuccess(false)

            const response = await authService.forgotPassword({ email })

            if (response.success) {
                setSuccess(true)
                return true
            } else {
                setError(response.error || 'Failed to send reset email')
                return false
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error')
            return false
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async (token: string, newPassword: string) => {
        try {
            setLoading(true)
            setError(null)
            setSuccess(false)

            const response = await authService.resetPassword({ token, newPassword })

            if (response.success) {
                setSuccess(true)
                return true
            } else {
                setError(response.error || 'Failed to reset password')
                return false
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error')
            return false
        } finally {
            setLoading(false)
        }
    }

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            setLoading(true)
            setError(null)
            setSuccess(false)

            const response = await authService.changePassword({ currentPassword, newPassword })

            if (response.success) {
                setSuccess(true)
                return true
            } else {
                setError(response.error || 'Failed to change password')
                return false
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error')
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        success,
        forgotPassword,
        resetPassword,
        changePassword
    }
} 