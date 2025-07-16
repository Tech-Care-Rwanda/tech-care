/**
 * Admin-specific hooks for TechCare
 * Handles admin dashboard functionality and technician management
 */

import { useState, useCallback, useEffect } from 'react';
import { apiService, ApiError } from '@/lib/services/api';
import { useAsyncOperation, normalizeError } from '@/lib/utils/errorHandling';
import type {
  Admin,
  Technician,
  AdminGetTechniciansParams,
  PaginatedResponse,
} from '@/types/api';

/**
 * Hook for admin profile management
 */
export function useAdminProfile() {
  const [profile, setProfile] = useState<Admin | null>(null);
  const { loading, error, execute } = useAsyncOperation<Admin>();

  const fetchProfile = useCallback(async () => {
    const result = await execute(async () => {
      const response = await apiService.admin.getProfile();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch profile');
    });

    if (result.success && result.data) {
      setProfile(result.data);
    }

    return result;
  }, [execute]);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiService.admin.checkAuth();
      return {
        success: response.success,
        isAuthenticated: response.success && response.data?.isAuthenticated
      };
    } catch (err) {
      return { success: false, isAuthenticated: false };
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    checkAuth,
  };
}

/**
 * Hook for getting individual technician details
 */
export function useTechnicianDetails(technicianId: string) {
  const [technician, setTechnician] = useState<Technician | null>(null);
  const { loading, error, execute } = useAsyncOperation<Technician>();

  const fetchTechnicianDetails = useCallback(async () => {
    const result = await execute(async () => {
      const response = await apiService.admin.getTechnicianDetails(technicianId);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch technician details');
    });

    if (result.success && result.data) {
      setTechnician(result.data);
    }

    return result;
  }, [execute, technicianId]);

  return {
    technician,
    loading,
    error,
    fetchTechnicianDetails,
  };
}

/**
 * Hook for managing technicians (approval, rejection, etc.)
 */
export function useTechnicianManagement() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Technician>['pagination'] | null>(null);
  const { loading, error, execute } = useAsyncOperation<PaginatedResponse<Technician>>();

  const fetchTechnicians = useCallback(async (params?: AdminGetTechniciansParams) => {
    const result = await execute(async () => {
      const response = await apiService.admin.getTechnicians(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch technicians');
    });

    if (result.success && result.data) {
      setTechnicians(result.data.data);
      setPagination(result.data.pagination);
    }

    return result;
  }, [execute]);

  const getTechnicianDetails = useCallback(async (technicianId: string) => {
    // This method is deprecated, use useTechnicianDetails hook instead
    console.warn('getTechnicianDetails is deprecated, use useTechnicianDetails hook instead');
    return { success: false, error: 'Use useTechnicianDetails hook instead' };
  }, []);

  return {
    technicians,
    pagination,
    loading,
    error,
    fetchTechnicians,
    getTechnicianDetails,
  };
}

/**
 * Hook for technician approval/rejection actions
 */
export function useTechnicianActions() {
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  const approveTechnician = useCallback(async (technicianId: string) => {
    setActionLoading(prev => ({ ...prev, [technicianId]: true }));
    setActionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[technicianId];
      return newErrors;
    });

    try {
      const response = await apiService.admin.approveTechnician(technicianId);
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to approve technician');
      }
    } catch (error) {
      const normalizedError = normalizeError(error);
      setActionErrors(prev => ({ 
        ...prev, 
        [technicianId]: normalizedError.message 
      }));
      return { success: false, error: normalizedError.message };
    } finally {
      setActionLoading(prev => ({ ...prev, [technicianId]: false }));
    }
  }, []);

  const rejectTechnician = useCallback(async (
    technicianId: string, 
    reason?: string
  ) => {
    setActionLoading(prev => ({ ...prev, [technicianId]: true }));
    setActionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[technicianId];
      return newErrors;
    });

    try {
      const response = await apiService.admin.rejectTechnician(technicianId, reason);
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to reject technician');
      }
    } catch (error) {
      const normalizedError = normalizeError(error);
      setActionErrors(prev => ({ 
        ...prev, 
        [technicianId]: normalizedError.message 
      }));
      return { success: false, error: normalizedError.message };
    } finally {
      setActionLoading(prev => ({ ...prev, [technicianId]: false }));
    }
  }, []);

  const clearError = useCallback((technicianId: string) => {
    setActionErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[technicianId];
      return newErrors;
    });
  }, []);

  return {
    actionLoading,
    actionErrors,
    approveTechnician,
    rejectTechnician,
    clearError,
  };
}

/**
 * Hook for customer promotion to admin
 */
export function useCustomerPromotion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promoteCustomer = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.admin.promoteCustomerToAdmin(customerId);
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to promote customer');
      }
    } catch (error) {
      const normalizedError = normalizeError(error);
      setError(normalizedError.message);
      return { success: false, error: normalizedError.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    promoteCustomer,
    loading,
    error,
  };
}

/**
 * Hook for admin dashboard statistics
 */
export function useAdminDashboard() {
  const [stats, setStats] = useState<{
    totalTechnicians: number;
    pendingApprovals: number;
    activeTechnicians: number;
    totalCustomers: number;
    recentActivity: any[];
  } | null>(null);

  const { loading, error, execute } = useAsyncOperation();

  const fetchDashboardStats = useCallback(async () => {
    const result = await execute(async () => {
      // This would be a dedicated dashboard endpoint when implemented
      // For now, we'll fetch technicians to get some stats
      const techResponse = await apiService.admin.getTechnicians();
      
      if (techResponse.success && techResponse.data) {
        const allTechnicians = techResponse.data.data;
        
        const stats = {
          totalTechnicians: allTechnicians.length,
          pendingApprovals: allTechnicians.filter(t => t.status === 'PENDING').length,
          activeTechnicians: allTechnicians.filter(t => t.status === 'ACTIVE').length,
          totalCustomers: 0, // Would come from a customers endpoint
          recentActivity: [], // Would come from an activity log endpoint
        };
        
        return stats;
      }
      
      throw new Error('Failed to fetch dashboard data');
    });

    if (result.success && result.data) {
      setStats(result.data);
    }

    return result;
  }, [execute]);

  return {
    stats,
    loading,
    error,
    fetchDashboardStats,
  };
}

/**
 * Hook for filtering and searching technicians
 */
export function useTechnicianFilters() {
  const [filters, setFilters] = useState<AdminGetTechniciansParams>({
    status: undefined,
    page: 1,
    limit: 10,
    search: '',
  });

  const updateFilter = useCallback((key: keyof AdminGetTechniciansParams, value: any) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      // Reset to first page when changing filters
      ...(key !== 'page' && { page: 1 })
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: undefined,
      page: 1,
      limit: 10,
      search: '',
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
}

/**
 * Hook for bulk actions on technicians
 */
export function useBulkTechnicianActions() {
  const [selectedTechnicians, setSelectedTechnicians] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const toggleSelection = useCallback((technicianId: string) => {
    setSelectedTechnicians(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(technicianId)) {
        newSelection.delete(technicianId);
      } else {
        newSelection.add(technicianId);
      }
      return newSelection;
    });
  }, []);

  const selectAll = useCallback((technicianIds: string[]) => {
    setSelectedTechnicians(new Set(technicianIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTechnicians(new Set());
  }, []);

  const bulkApprove = useCallback(async () => {
    if (selectedTechnicians.size === 0) return { success: false, error: 'No technicians selected' };

    setBulkLoading(true);
    setBulkError(null);

    try {
      const promises = Array.from(selectedTechnicians).map(id => 
        apiService.admin.approveTechnician(id)
      );

      const results = await Promise.allSettled(promises);
      const failures = results.filter(r => r.status === 'rejected').length;

      if (failures > 0) {
        throw new Error(`${failures} approvals failed`);
      }

      clearSelection();
      return { success: true };
    } catch (error) {
      const normalizedError = normalizeError(error);
      setBulkError(normalizedError.message);
      return { success: false, error: normalizedError.message };
    } finally {
      setBulkLoading(false);
    }
  }, [selectedTechnicians, clearSelection]);

  const bulkReject = useCallback(async (reason?: string) => {
    if (selectedTechnicians.size === 0) return { success: false, error: 'No technicians selected' };

    setBulkLoading(true);
    setBulkError(null);

    try {
      const promises = Array.from(selectedTechnicians).map(id => 
        apiService.admin.rejectTechnician(id, reason)
      );

      const results = await Promise.allSettled(promises);
      const failures = results.filter(r => r.status === 'rejected').length;

      if (failures > 0) {
        throw new Error(`${failures} rejections failed`);
      }

      clearSelection();
      return { success: true };
    } catch (error) {
      const normalizedError = normalizeError(error);
      setBulkError(normalizedError.message);
      return { success: false, error: normalizedError.message };
    } finally {
      setBulkLoading(false);
    }
  }, [selectedTechnicians, clearSelection]);

  return {
    selectedTechnicians: Array.from(selectedTechnicians),
    selectedCount: selectedTechnicians.size,
    toggleSelection,
    selectAll,
    clearSelection,
    bulkApprove,
    bulkReject,
    bulkLoading,
    bulkError,
  };
}