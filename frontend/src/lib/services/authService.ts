/**
 * Authentication Service for TechCare Frontend
 * Handles login, signup, and authentication-related API calls
 */

import { apiService, ApiResponse } from './api'
import { API_ENDPOINTS } from '@/lib/config/api'

export interface LoginCredentials {
    email: string
    password: string
}

export interface CustomerSignupData {
    fullName: string
    email: string
    phoneNumber: string
    password: string
}

export interface TechnicianSignupData {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    gender: string
    age: number
    DateOfBirth: string
    experience: string
    specialization: string
    profileImage?: File
    certificateDocument?: File
}

export interface User {
    id: number
    fullName: string
    email: string
    phoneNumber: string
    role: 'CUSTOMER' | 'ADMIN' | 'TECHNICIAN'
    isActive: boolean
    createdAt: string
    updatedAt: string
    technicianDetails?: {
        id: number
        gender: string
        age: number
        DateOfBirth: string
        experience: string
        specialization: string
        imageUtl?: string
        certificateUrl: string
        isAvailable: boolean
        rate: number
        approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    }
}

export interface AuthResponse {
    user: User
    token: string
    message: string
}

export interface ForgotPasswordData {
    email: string
}

export interface ResetPasswordData {
    token: string
    newPassword: string
}

export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
}

class AuthService {
    // Login
    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
        const response = await apiService.post<AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        )

        if (response.success && response.data) {
            // Store user data and token in localStorage
            localStorage.setItem('techcare-user', JSON.stringify(response.data.user))
            localStorage.setItem('techcare-token', response.data.token)
        }

        return response
    }

    // Customer Signup
    async customerSignup(data: CustomerSignupData): Promise<ApiResponse<AuthResponse>> {
        const response = await apiService.post<AuthResponse>(
            API_ENDPOINTS.AUTH.CUSTOMER_SIGNUP,
            data
        )

        if (response.success && response.data) {
            // Auto-login after successful signup
            localStorage.setItem('techcare-user', JSON.stringify(response.data.user))
            localStorage.setItem('techcare-token', response.data.token)
        }

        return response
    }

    // Technician Signup (with file uploads)
    async technicianSignup(data: TechnicianSignupData): Promise<ApiResponse<AuthResponse>> {
        const formData = new FormData()

        // Add text fields
        formData.append('fullName', data.fullName)
        formData.append('email', data.email)
        formData.append('phoneNumber', data.phoneNumber)
        formData.append('password', data.password)
        formData.append('gender', data.gender)
        formData.append('age', data.age.toString())
        formData.append('DateOfBirth', data.DateOfBirth)
        formData.append('experience', data.experience)
        formData.append('specialization', data.specialization)

        // Add files
        if (data.profileImage) {
            formData.append('profileImage', data.profileImage)
        }
        if (data.certificateDocument) {
            formData.append('certificateDocument', data.certificateDocument)
        }

        const response = await apiService.uploadFiles<AuthResponse>(
            API_ENDPOINTS.AUTH.TECHNICIAN_SIGNUP,
            formData
        )

        if (response.success && response.data) {
            // Auto-login after successful signup
            localStorage.setItem('techcare-user', JSON.stringify(response.data.user))
            localStorage.setItem('techcare-token', response.data.token)
        }

        return response
    }

    // Get Current User Profile
    async getCurrentUser(): Promise<ApiResponse<User>> {
        // Check if user is stored locally first
        const storedUser = localStorage.getItem('techcare-user')
        const storedToken = localStorage.getItem('techcare-token')

        if (!storedUser || !storedToken) {
            return {
                success: false,
                error: 'No authenticated user found'
            }
        }

        try {
            const user = JSON.parse(storedUser) as User

            // Verify with backend based on user role
            let endpoint: string
            switch (user.role) {
                case 'CUSTOMER':
                    endpoint = API_ENDPOINTS.CUSTOMER.CHECK_AUTH
                    break
                case 'ADMIN':
                    endpoint = API_ENDPOINTS.ADMIN.CHECK_AUTH
                    break
                case 'TECHNICIAN':
                    // For now, use customer endpoint for technicians
                    endpoint = API_ENDPOINTS.CUSTOMER.CHECK_AUTH
                    break
                default:
                    endpoint = API_ENDPOINTS.CUSTOMER.CHECK_AUTH
            }

            const response = await apiService.get<{ isAuthenticated: boolean; user?: User }>(endpoint)

            if (response.success && response.data?.isAuthenticated) {
                return {
                    success: true,
                    data: response.data.user || user
                }
            }

            // If verification fails, clear stored data
            this.logout()
            return {
                success: false,
                error: 'Authentication expired'
            }
        } catch (error) {
            this.logout()
            return {
                success: false,
                error: 'Invalid user data'
            }
        }
    }

    // Logout
    async logout(): Promise<void> {
        const storedUser = localStorage.getItem('techcare-user')

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser) as User

                // Call backend logout endpoint based on user role
                let endpoint: string
                switch (user.role) {
                    case 'CUSTOMER':
                        endpoint = API_ENDPOINTS.CUSTOMER.LOGOUT
                        break
                    case 'ADMIN':
                        endpoint = API_ENDPOINTS.ADMIN.LOGOUT
                        break
                    case 'TECHNICIAN':
                        // For now, use customer endpoint for technicians
                        endpoint = API_ENDPOINTS.CUSTOMER.LOGOUT
                        break
                    default:
                        endpoint = API_ENDPOINTS.CUSTOMER.LOGOUT
                }

                await apiService.get(endpoint)
            } catch (error) {
                console.error('Error during logout:', error)
            }
        }

        // Clear local storage
        localStorage.removeItem('techcare-user')
        localStorage.removeItem('techcare-token')
    }

    // Forgot Password
    async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
        return apiService.post(API_ENDPOINTS.CUSTOMER.FORGOT_PASSWORD, data)
    }

    // Reset Password
    async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
        return apiService.post(API_ENDPOINTS.CUSTOMER.RESET_PASSWORD, data)
    }

    // Change Password
    async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
        return apiService.post(API_ENDPOINTS.CUSTOMER.CHANGE_PASSWORD, data)
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = localStorage.getItem('techcare-token')
        const user = localStorage.getItem('techcare-user')
        return !!(token && user)
    }

    // Get stored user without API call
    getStoredUser(): User | null {
        try {
            const storedUser = localStorage.getItem('techcare-user')
            return storedUser ? JSON.parse(storedUser) : null
        } catch {
            return null
        }
    }

    // Get stored token
    getStoredToken(): string | null {
        return localStorage.getItem('techcare-token')
    }
}

export const authService = new AuthService()
export default authService 