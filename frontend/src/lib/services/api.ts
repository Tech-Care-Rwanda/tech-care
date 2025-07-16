/**
 * Core API Service for TechCare Frontend
 * Handles communication with Node.js/Express backend
 */

import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  TechnicianSignUpRequest,
  SignUpResponse,
  User,
  Technician,
  Customer,
  Admin,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AdminGetTechniciansParams,
  TechnicianApprovalRequest,
  CustomerPromotionRequest,
  PaginatedResponse,
  FileUploadResponse,
} from '@/types/api';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TIMEOUT = 30000; // 30 seconds

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Core API Client with authentication and error handling
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get authorization header with JWT token
   */
  private getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    
    const token = localStorage.getItem('techcare-token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      throw new ApiError(
        'Invalid response format',
        response.status,
        'INVALID_RESPONSE_FORMAT'
      );
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Request failed',
        response.status,
        data.error,
        data.errors
      );
    }

    return data;
  }

  /**
   * Make authenticated HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...options.headers,
      },
      signal: AbortSignal.timeout(API_TIMEOUT),
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          throw new ApiError('Request timeout', 408, 'TIMEOUT');
        }
        throw new ApiError(
          'Network error occurred',
          0,
          'NETWORK_ERROR',
          { originalError: error.message }
        );
      }
      
      throw new ApiError('Unknown error occurred', 0, 'UNKNOWN_ERROR');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Upload file(s) with multipart/form-data
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Handle progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      // Handle completion
      xhr.addEventListener('load', async () => {
        try {
          const response = new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: new Headers({
              'content-type': xhr.getResponseHeader('content-type') || 'application/json',
            }),
          });
          
          const result = await this.handleResponse<T>(response);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new ApiError('Upload failed', 0, 'UPLOAD_ERROR'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new ApiError('Upload timeout', 408, 'TIMEOUT'));
      });

      // Configure request
      xhr.timeout = API_TIMEOUT;
      xhr.open('POST', url);
      
      // Add auth header
      const authHeader = this.getAuthHeader();
      if (authHeader.Authorization) {
        xhr.setRequestHeader('Authorization', authHeader.Authorization);
      }

      // Send request
      xhr.send(formData);
    });
  }
}

/**
 * Authentication Service
 */
export class AuthService {
  constructor(private api: ApiClient) {}

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.api.post<LoginResponse>('/auth/login', credentials);
  }

  async registerCustomer(userData: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
    return this.api.post<SignUpResponse>('/auth/customer/signup', userData);
  }

  async registerTechnician(
    userData: TechnicianSignUpRequest,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<SignUpResponse>> {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && !(value instanceof File)) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Add files
    if (userData.profileImage) {
      formData.append('profileImage', userData.profileImage);
    }
    if (userData.certificateDocument) {
      formData.append('certificateDocument', userData.certificateDocument);
    }

    return this.api.upload<SignUpResponse>('/auth/technician/signup', formData, onProgress);
  }

  async logout(): Promise<void> {
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('techcare-token');
      localStorage.removeItem('techcare-user');
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return this.api.post<void>('/auth/forgot-password', data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return this.api.post<void>('/auth/reset-password', data);
  }
}

/**
 * Customer Service
 */
export class CustomerService {
  constructor(private api: ApiClient) {}

  async getProfile(): Promise<ApiResponse<Customer>> {
    return this.api.get<Customer>('/customer/profile');
  }

  async checkAuth(): Promise<ApiResponse<{ isAuthenticated: boolean }>> {
    return this.api.get<{ isAuthenticated: boolean }>('/customer/check-auth');
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<ApiResponse<Customer>> {
    if (data.profileImage) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      return this.api.upload<Customer>('/customer/profile', formData);
    }
    
    return this.api.put<Customer>('/customer/profile', data);
  }

  async changePassword(data: PasswordChangeRequest): Promise<ApiResponse<void>> {
    return this.api.post<void>('/customer/change-password', data);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.api.get<void>('/customer/logout');
  }
}

/**
 * Admin Service
 */
export class AdminService {
  constructor(private api: ApiClient) {}

  async getProfile(): Promise<ApiResponse<Admin>> {
    return this.api.get<Admin>('/admin/profile');
  }

  async checkAuth(): Promise<ApiResponse<{ isAuthenticated: boolean }>> {
    return this.api.get<{ isAuthenticated: boolean }>('/admin/check-isAuth');
  }

  async getTechnicians(params?: AdminGetTechniciansParams): Promise<ApiResponse<PaginatedResponse<Technician>>> {
    return this.api.get<PaginatedResponse<Technician>>('/admin/get-technicians', params);
  }

  async getTechnicianDetails(technicianId: string): Promise<ApiResponse<Technician>> {
    return this.api.get<Technician>(`/admin/technicians/${technicianId}`);
  }

  async approveTechnician(technicianId: string): Promise<ApiResponse<void>> {
    return this.api.put<void>(`/admin/technicians/${technicianId}/approve`);
  }

  async rejectTechnician(technicianId: string, reason?: string): Promise<ApiResponse<void>> {
    return this.api.put<void>(`/admin/technicians/${technicianId}/reject`, { rejectionReason: reason });
  }

  async promoteCustomerToAdmin(customerId: string): Promise<ApiResponse<void>> {
    return this.api.put<void>(`/admin/customer-to-admin/${customerId}`);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.api.get<void>('/admin/logout');
  }
}

/**
 * Main API Service Instance
 */
class TechCareApiService {
  private apiClient: ApiClient;
  
  public auth: AuthService;
  public customer: CustomerService;
  public admin: AdminService;

  constructor() {
    this.apiClient = new ApiClient();
    
    this.auth = new AuthService(this.apiClient);
    this.customer = new CustomerService(this.apiClient);
    this.admin = new AdminService(this.apiClient);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('techcare-token');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('techcare-user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Store authentication data
   */
  setAuthData(user: User, token: string): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('techcare-user', JSON.stringify(user));
    localStorage.setItem('techcare-token', token);
  }

  /**
   * Clear authentication data
   */
  clearAuthData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('techcare-user');
    localStorage.removeItem('techcare-token');
  }
}

// Export singleton instance
export const apiService = new TechCareApiService();
export default apiService;