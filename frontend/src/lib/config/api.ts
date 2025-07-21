/**
 * API Configuration for TechCare Frontend
 * Centralizes all API endpoints and configuration
 */

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
    TIMEOUT: 10000, // 10 seconds

    get API_BASE() {
        return `${this.BASE_URL}/api/${this.VERSION}`
    }
} as const

export const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        CUSTOMER_SIGNUP: '/api/v1/auth/customer/signup',
        TECHNICIAN_SIGNUP: '/api/v1/auth/technician/signup',
        LOGOUT: '/api/v1/auth/logout'
    },

    // Customer endpoints
    CUSTOMER: {
        PROFILE: '/api/v1/customer/profile',
        CHECK_AUTH: '/api/v1/customer/check-auth',
        LOGOUT: '/api/v1/customer/logout',
        FORGOT_PASSWORD: '/api/v1/customer/forgot-password',
        RESET_PASSWORD: '/api/v1/customer/reset-password',
        CHANGE_PASSWORD: '/api/v1/customer/change-password'
    },

    // Admin endpoints  
    ADMIN: {
        PROFILE: '/api/v1/admin/profile',
        CHECK_AUTH: '/api/v1/admin/check-isAuth',
        LOGOUT: '/api/v1/admin/logout',
        GET_TECHNICIANS: '/api/v1/admin/get-technicians',
        APPROVE_TECHNICIAN: (id: string) => `/api/v1/admin/technicians/${id}/approve`,
        REJECT_TECHNICIAN: (id: string) => `/api/v1/admin/technicians/${id}/reject`,
        GET_TECHNICIAN_DETAILS: (id: string) => `/api/v1/admin/technicians/${id}`,
        PROMOTE_TO_ADMIN: (id: string) => `/api/v1/admin/customer-to-admin/${id}`
    },

    // Technician endpoints
    TECHNICIAN: {
        PROFILE: '/api/v1/technicians/profile',
        GET_ALL: '/api/v1/technicians',
        GET_BY_ID: (id: string) => `/api/v1/technicians/${id}`,
        UPDATE_AVAILABILITY: '/api/v1/technicians/availability',
        GET_NEARBY: (lat: number, lng: number, radius = 10, limit = 20) => 
            `/api/v1/technicians/nearby?lat=${lat}&lng=${lng}&radius=${radius}&limit=${limit}`
    },

    // Booking endpoints
    BOOKING: {
        CREATE: '/api/v1/bookings',
        GET_ALL: '/api/v1/bookings',
        GET_BY_ID: (id: string) => `/api/v1/bookings/${id}`,
        UPDATE_STATUS: (id: string) => `/api/v1/bookings/${id}/status`,
        CANCEL: (id: string) => `/api/v1/bookings/${id}/cancel`
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