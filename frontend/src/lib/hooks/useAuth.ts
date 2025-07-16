/**
 * Enhanced Authentication Hooks for TechCare
 * Integrates with the API service layer
 */

import { useState, useCallback } from 'react';
import { apiService, ApiError } from '@/lib/services/api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { apiRoleToUserRole } from '@/lib/utils';
import type {
  LoginRequest,
  SignUpRequest,
  TechnicianSignUpRequest,
  PasswordChangeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User as ApiUser,
} from '@/types/api';
import type { User } from '@/lib/contexts/AuthContext';

// Helper function to convert API user to Context user
function convertApiUserToContextUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.fullName,
    email: apiUser.email,
    phone: apiUser.phoneNumber,
    avatar: apiUser.profileImage,
    role: apiRoleToUserRole(apiUser.role),
    status: apiUser.status.toLowerCase() as 'active' | 'inactive' | 'pending',
    createdAt: apiUser.createdAt,
    lastLogin: apiUser.lastLogin,
  };
}
// Custom hook for login
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useAuth();

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.auth.login(credentials);
      
      if (response.success && response.data) {
        // Store auth data
        apiService.setAuthData(response.data.user, response.data.token);
        
        // Convert API user to context user and update context
        const contextUser = convertApiUserToContextUser(response.data.user);
        updateUser(contextUser);
        
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  return { login, isLoading, error };
}

// Custom hook for customer registration
export function useCustomerRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useAuth();

  const register = useCallback(async (userData: SignUpRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.auth.registerCustomer(userData);
      
      if (response.success && response.data) {
        // Store auth data if auto-login after registration
        if (response.data.token) {
          apiService.setAuthData(response.data.user, response.data.token);
          const contextUser = convertApiUserToContextUser(response.data.user);
          updateUser(contextUser);
        }
        
        return { 
          success: true, 
          user: response.data.user,
          verificationRequired: response.data.verificationRequired 
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  return { register, isLoading, error };
}

// Custom hook for technician registration with file upload progress
export function useTechnicianRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useAuth();

  const register = useCallback(async (userData: TechnicianSignUpRequest) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await apiService.auth.registerTechnician(
        userData,
        (progress) => setUploadProgress(progress)
      );
      
      if (response.success && response.data) {
        // Note: Technician might need approval, so no auto-login
        return { 
          success: true, 
          user: response.data.user,
          verificationRequired: response.data.verificationRequired 
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }, [updateUser]);

  return { register, isLoading, uploadProgress, error };
}

// Custom hook for logout
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const { logout: contextLogout } = useAuth();

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      // Attempt to logout on server (best effort)
      const user = apiService.getCurrentUser();
      if (user) {
        if (user.role === 'CUSTOMER') {
          await apiService.customer.logout();
        } else if (user.role === 'ADMIN') {
          await apiService.admin.logout();
        }
      }
    } catch (error) {
      // Log error but continue with local logout
      console.error('Server logout failed:', error);
    } finally {
      // Always clear local auth data
      apiService.clearAuthData();
      contextLogout();
      setIsLoading(false);
    }
  }, [contextLogout]);

  return { logout, isLoading };
}

// Custom hook for password change
export function usePasswordChange() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = useCallback(async (data: PasswordChangeRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiService.customer.changePassword(data);
      
      if (response.success) {
        setSuccess(true);
        return { success: true };
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Password change failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { changePassword, isLoading, error, success };
}

// Custom hook for forgot password
export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestReset = useCallback(async (data: ForgotPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiService.auth.forgotPassword(data);
      
      if (response.success) {
        setSuccess(true);
        return { success: true };
      } else {
        throw new Error(response.message || 'Password reset request failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Password reset request failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { requestReset, isLoading, error, success };
}

// Custom hook for reset password
export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiService.auth.resetPassword(data);
      
      if (response.success) {
        setSuccess(true);
        return { success: true };
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Password reset failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { resetPassword, isLoading, error, success };
}

// Custom hook for auth status check
export function useAuthCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser, logout } = useAuth();

  const checkAuth = useCallback(async () => {
    if (!apiService.isAuthenticated() || !user) {
      return { isAuthenticated: false };
    }

    setIsLoading(true);

    try {
      let response;
      
      if (user.role === 'customer') {
        response = await apiService.customer.checkAuth();
      } else if (user.role === 'admin') {
        response = await apiService.admin.checkAuth();
      } else {
        // For technicians, we might not have a specific check endpoint yet
        return { isAuthenticated: true };
      }

      if (response?.success && response.data?.isAuthenticated) {
        return { isAuthenticated: true };
      } else {
        // Token is invalid, logout
        logout();
        return { isAuthenticated: false };
      }
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        // Unauthorized, clear auth data
        logout();
        return { isAuthenticated: false };
      }
      
      // Network error or other issues, assume still authenticated
      console.error('Auth check failed:', err);
      return { isAuthenticated: true };
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser, logout]);

  return { checkAuth, isLoading };
}

// Custom hook for profile management
export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useAuth();

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      let response;
      
      if (user.role === 'customer') {
        // Convert context user data to API format
        const apiData: any = {
          fullName: data.name,
          phoneNumber: data.phone,
          // Handle file upload if needed
        };
        response = await apiService.customer.updateProfile(apiData);
      } else if (user.role === 'admin') {
        // Admin profile update would go here when implemented
        throw new Error('Admin profile update not implemented');
      } else {
        throw new Error('Profile update not available for this user type');
      }

      if (response.success && response.data) {
        const contextUser = convertApiUserToContextUser(response.data);
        updateUser(contextUser);
        return { success: true, user: contextUser };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Profile update failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser]);

  return { updateProfile, isLoading, error };
}