/**
 * API Configuration for TechCare Frontend
 * Uses Supabase for authentication and Next.js API routes for additional functionality
 * NO LEGACY BACKEND ENDPOINTS - SUPABASE ONLY
 */

export const API_CONFIG = {
    // Next.js API routes (frontend API)
    BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    TIMEOUT: 10000, // 10 seconds
} as const

// Next.js API endpoints (frontend API routes only)
export const API_ENDPOINTS = {
    // Booking endpoints (Next.js API routes)
    BOOKING: {
        CREATE: '/api/bookings',
        GET_ALL: '/api/bookings',
        GET_BY_ID: (id: string) => `/api/bookings/${id}`,
        GET_BY_CUSTOMER: (customerId: string) => `/api/bookings/customer/${customerId}`,
        GET_BY_TECHNICIAN: (technicianId: string) => `/api/bookings/technician/${technicianId}`,
        UPDATE_STATUS: (id: string) => `/api/bookings/${id}/status`,
    },

    // Technician endpoints (Next.js API routes)
    TECHNICIAN: {
        GET_BY_ID: (id: string) => `/api/technicians/${id}`,
        UPDATE_AVAILABILITY: (id: string) => `/api/technicians/${id}/availability`,
    },

    // Test endpoints
    TEST: {
        SUPABASE: '/api/test-supabase',
        DB: '/api/test-db',
        SETUP_DATA: '/api/setup-test-data'
    },

    // Health check
    HEALTH: '/api/health'
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