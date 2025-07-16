/**
 * Integration Test for TechCare API Service
 * Tests the API integration layer with mock backend responses
 */

import { apiService } from '@/lib/services/api';
import type { LoginRequest, SignUpRequest } from '@/types/api';

// Mock fetch for testing
global.fetch = jest.fn();

describe('TechCare API Integration', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset fetch mock
    (fetch as jest.Mock).mockReset();
  });

  describe('Authentication Service', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 'user-123',
            fullName: 'Test User',
            email: 'test@example.com',
            role: 'CUSTOMER',
            status: 'ACTIVE',
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'jwt-token-123',
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await apiService.auth.login(credentials);

      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe('test@example.com');
      expect(result.data?.token).toBe('jwt-token-123');
    });

    it('should handle login errors', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const credentials: LoginRequest = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      try {
        await apiService.auth.login(credentials);
        fail('Expected login to throw an error');
      } catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Invalid credentials');
      }
    });

    it('should handle customer registration', async () => {
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            id: 'user-456',
            fullName: 'New User',
            email: 'newuser@example.com',
            role: 'CUSTOMER',
            status: 'ACTIVE',
            emailVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'jwt-token-456',
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const userData: SignUpRequest = {
        fullName: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        phoneNumber: '+250788123456',
      };

      const result = await apiService.auth.registerCustomer(userData);

      expect(result.success).toBe(true);
      expect(result.data?.user.fullName).toBe('New User');
      expect(result.data?.user.role).toBe('CUSTOMER');
    });
  });

  describe('API Client', () => {
    it('should include Authorization header when token is present', async () => {
      // Set up token in localStorage
      localStorage.setItem('techcare-token', 'test-token-123');

      const mockResponse = {
        success: true,
        data: { message: 'Authenticated request successful' },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await apiService.customer.getProfile();

      // Check that fetch was called with Authorization header
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/customer/profile'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-123',
          }),
        })
      );
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      try {
        await apiService.customer.getProfile();
        fail('Expected network error to be thrown');
      } catch (error) {
        expect(error.message).toBe('Network error occurred');
        expect(error.code).toBe('NETWORK_ERROR');
      }
    });

    it('should handle timeout errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(
        Object.assign(new Error('Timeout'), { name: 'AbortError' })
      );

      try {
        await apiService.customer.getProfile();
        fail('Expected timeout error to be thrown');
      } catch (error) {
        expect(error.message).toBe('Request timeout');
        expect(error.code).toBe('TIMEOUT');
      }
    });
  });

  describe('Admin Service', () => {
    beforeEach(() => {
      // Set up admin token
      localStorage.setItem('techcare-token', 'admin-token-123');
    });

    it('should fetch technicians list', async () => {
      const mockResponse = {
        success: true,
        data: {
          data: [
            {
              id: 'tech-1',
              fullName: 'Tech User',
              email: 'tech@example.com',
              role: 'TECHNICIAN',
              status: 'PENDING',
              specialties: ['Computer Repair'],
              experience: 3,
              rating: 0,
              totalJobs: 0,
              completedJobs: 0,
              monthlyEarnings: 0,
              isAvailable: true,
              emailVerified: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await apiService.admin.getTechnicians();

      expect(result.success).toBe(true);
      expect(result.data?.data).toHaveLength(1);
      expect(result.data?.data[0].role).toBe('TECHNICIAN');
    });

    it('should approve technician', async () => {
      const mockResponse = {
        success: true,
        message: 'Technician approved successfully',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await apiService.admin.approveTechnician('tech-123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Technician approved successfully');

      // Verify correct endpoint was called
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/technicians/tech-123/approve'),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  });

  describe('Auth Data Management', () => {
    it('should store and retrieve auth data', () => {
      const user = {
        id: 'user-123',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'CUSTOMER' as const,
        status: 'ACTIVE' as const,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = 'jwt-token-123';

      apiService.setAuthData(user, token);

      expect(apiService.isAuthenticated()).toBe(true);
      expect(apiService.getCurrentUser()).toEqual(user);
      expect(localStorage.getItem('techcare-token')).toBe(token);
    });

    it('should clear auth data', () => {
      // Set up initial data
      apiService.setAuthData(
        {
          id: 'user-123',
          fullName: 'Test User',
          email: 'test@example.com',
          role: 'CUSTOMER',
          status: 'ACTIVE',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'jwt-token-123'
      );

      // Clear data
      apiService.clearAuthData();

      expect(apiService.isAuthenticated()).toBe(false);
      expect(apiService.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('techcare-token')).toBeNull();
    });
  });
});

// Export for use in component tests
export { apiService };