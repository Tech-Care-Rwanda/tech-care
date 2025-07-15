/**
 * Core API Service for TechCare Frontend
 * Handles all HTTP requests to the backend with proper error handling
 */

import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS } from '@/lib/config/api'

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    error?: string
    status?: number
}

export interface ApiError {
    message: string
    status: number
    details?: any
}

class ApiService {
    private baseURL: string

    constructor() {
        this.baseURL = API_CONFIG.API_BASE
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`

            // Get token from localStorage
            const token = localStorage.getItem('techcare-token')

            const config: RequestInit = {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...options.headers,
                },
                timeout: API_CONFIG.TIMEOUT,
            }

            const response = await fetch(url, config)
            const data = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error || 'Request failed',
                    status: response.status
                }
            }

            return {
                success: true,
                data,
                status: response.status
            }
        } catch (error) {
            console.error('API Request Error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
                status: 0
            }
        }
    }

    // POST request
    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    // GET request
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'GET',
        })
    }

    // PUT request
    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        })
    }

    // DELETE request
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        })
    }

    // File upload request
    async uploadFiles<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`
            const token = localStorage.getItem('techcare-token')

            const config: RequestInit = {
                method: 'POST',
                body: formData,
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                }
            }

            const response = await fetch(url, config)
            const data = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error || 'Upload failed',
                    status: response.status
                }
            }

            return {
                success: true,
                data,
                status: response.status
            }
        } catch (error) {
            console.error('File Upload Error:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Upload error',
                status: 0
            }
        }
    }

    // Health check
    async healthCheck(): Promise<ApiResponse> {
        return this.get(API_ENDPOINTS.HEALTH)
    }
}

export const apiService = new ApiService()
export default apiService 