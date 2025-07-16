/**
 * API Configuration for TechCare Frontend
 * Centralizes all API endpoints and configuration
 */

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
    TIMEOUT: 10000, // 10 seconds

    get API_BASE() {
        return `${this.BASE_URL}/api/${this.VERSION}`
    }
} as const

export const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        LOGIN: '/auth/login',
        CUSTOMER_SIGNUP: '/auth/customer/signup',
        TECHNICIAN_SIGNUP: '/auth/technician/signup',
        LOGOUT: '/auth/logout'
    },

    // Customer endpoints
    CUSTOMER: {
        PROFILE: '/customer/profile',
        CHECK_AUTH: '/customer/check-auth',
        LOGOUT: '/customer/logout',
        FORGOT_PASSWORD: '/customer/forgot-password',
        RESET_PASSWORD: '/customer/reset-password',
        CHANGE_PASSWORD: '/customer/change-password'
    },

    // Admin endpoints  
    ADMIN: {
        PROFILE: '/admin/profile',
        CHECK_AUTH: '/admin/check-isAuth',
        LOGOUT: '/admin/logout',
        GET_TECHNICIANS: '/admin/get-technicians',
        APPROVE_TECHNICIAN: (id: string) => `/admin/technicians/${id}/approve`,
        REJECT_TECHNICIAN: (id: string) => `/admin/technicians/${id}/reject`,
        GET_TECHNICIAN_DETAILS: (id: string) => `/admin/technicians/${id}`,
        PROMOTE_TO_ADMIN: (id: string) => `/admin/customer-to-admin/${id}`
    },

    // Health check
    HEALTH: '/health'
} as const

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
} as const 