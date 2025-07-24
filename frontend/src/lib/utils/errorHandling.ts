/**
 * Error Handling and Loading State Patterns for TechCare
 * Provides consistent error handling and loading states across the application
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// Simple ApiError class (replaces deleted one)
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

// Error Types
export interface AppError {
  message: string;
  code?: string;
  type: 'network' | 'api' | 'validation' | 'auth' | 'unknown';
  statusCode?: number;
  field?: string;
  details?: Record<string, any>;
  timestamp: number;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number;
}

// Result wrapper for API operations
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
}

/**
 * Convert various error types to standardized AppError
 */
export function normalizeError(error: unknown): AppError {
  const timestamp = Date.now();

  if (error instanceof ApiError) {
    let type: AppError['type'] = 'api';

    if (error.statusCode === 401 || error.statusCode === 403) {
      type = 'auth';
    } else if (error.statusCode === 400 && error.code === 'VALIDATION_ERROR') {
      type = 'validation';
    } else if (error.statusCode === 0 || error.code === 'NETWORK_ERROR') {
      type = 'network';
    }

    return {
      message: error.message,
      code: error.code,
      type,
      statusCode: error.statusCode,
      details: error.details,
      timestamp,
    };
  }

  if (error instanceof Error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        type: 'network',
        timestamp,
      };
    }

    return {
      message: error.message,
      type: 'unknown',
      timestamp,
    };
  }

  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred',
    type: 'unknown',
    timestamp,
  };
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case 'network':
      return 'Connection problem. Please check your internet and try again.';

    case 'auth':
      if (error.statusCode === 401) {
        return 'Your session has expired. Please sign in again.';
      }
      if (error.statusCode === 403) {
        return 'You don\'t have permission to perform this action.';
      }
      return error.message || 'Authentication failed';

    case 'validation':
      return error.message || 'Please check your input and try again.';

    case 'api':
      if (error.statusCode === 429) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      if (error.statusCode && error.statusCode >= 500) {
        return 'Server error. Please try again later.';
      }
      return error.message || 'Something went wrong. Please try again.';

    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Hook for managing async operations with loading and error states
 */
export function useAsyncOperation<T = any>() {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: AppError | null;
    progress?: number;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (
    operation: () => Promise<T>,
    options?: {
      onProgress?: (progress: number) => void;
      abortable?: boolean;
    }
  ): Promise<OperationResult<T>> => {
    // Cancel previous operation if abortable
    if (options?.abortable && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller if abortable
    if (options?.abortable) {
      abortControllerRef.current = new AbortController();
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      progress: 0,
    }));

    try {
      // Set up progress callback
      if (options?.onProgress) {
        const progressInterval = setInterval(() => {
          setState(prev => ({
            ...prev,
            progress: Math.min((prev.progress || 0) + 10, 90),
          }));
        }, 100);

        // Clear interval when done
        setTimeout(() => clearInterval(progressInterval), 1000);
      }

      const result = await operation();

      setState({
        data: result,
        loading: false,
        error: null,
        progress: 100,
      });

      return { success: true, data: result };
    } catch (error) {
      const normalizedError = normalizeError(error);

      setState({
        data: null,
        loading: false,
        error: normalizedError,
        progress: 0,
      });

      return { success: false, error: normalizedError };
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      data: null,
      loading: false,
      error: null,
      progress: 0,
    });
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
    abort,
  };
}

/**
 * Hook for managing multiple concurrent operations
 */
export function useAsyncQueue() {
  const [operations, setOperations] = useState<Map<string, LoadingState>>(new Map());
  const [errors, setErrors] = useState<Map<string, AppError>>(new Map());

  const addOperation = useCallback((id: string, operation?: string) => {
    setOperations(prev => new Map(prev).set(id, {
      isLoading: true,
      operation,
      progress: 0,
    }));

    // Clear any previous error for this operation
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(id);
      return newErrors;
    });
  }, []);

  const updateProgress = useCallback((id: string, progress: number) => {
    setOperations(prev => {
      const newOps = new Map(prev);
      const existing = newOps.get(id);
      if (existing) {
        newOps.set(id, { ...existing, progress });
      }
      return newOps;
    });
  }, []);

  const completeOperation = useCallback((id: string) => {
    setOperations(prev => {
      const newOps = new Map(prev);
      newOps.delete(id);
      return newOps;
    });
  }, []);

  const failOperation = useCallback((id: string, error: unknown) => {
    const normalizedError = normalizeError(error);

    setOperations(prev => {
      const newOps = new Map(prev);
      newOps.delete(id);
      return newOps;
    });

    setErrors(prev => new Map(prev).set(id, normalizedError));
  }, []);

  const clearError = useCallback((id: string) => {
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(id);
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors(new Map());
  }, []);

  const isLoading = operations.size > 0;
  const hasErrors = errors.size > 0;
  const allErrors = Array.from(errors.values());

  return {
    operations: Array.from(operations.entries()).map(([id, state]) => ({ id, ...state })),
    errors: Array.from(errors.entries()).map(([id, error]) => ({ id, error })),
    isLoading,
    hasErrors,
    allErrors,
    addOperation,
    updateProgress,
    completeOperation,
    failOperation,
    clearError,
    clearAllErrors,
  };
}

/**
 * Hook for retry logic with exponential backoff
 */
export function useRetry() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      delay?: number;
      backoffFactor?: number;
      retryOn?: (error: AppError) => boolean;
    } = {}
  ): Promise<OperationResult<T>> => {
    const {
      maxRetries = 3,
      delay = 1000,
      backoffFactor = 2,
      retryOn = (error) => error.type === 'network' || error.statusCode === 429,
    } = options;

    let lastError: AppError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          setIsRetrying(true);
          setRetryCount(attempt);

          // Wait with exponential backoff
          const waitTime = delay * Math.pow(backoffFactor, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        const result = await operation();

        // Success - reset retry state
        setRetryCount(0);
        setIsRetrying(false);

        return { success: true, data: result };
      } catch (error) {
        lastError = normalizeError(error);

        // Check if we should retry
        if (attempt < maxRetries && retryOn(lastError)) {
          continue;
        }

        // Max retries reached or shouldn't retry
        break;
      }
    }

    setIsRetrying(false);
    return { success: false, error: lastError! };
  }, []);

  return {
    retry,
    retryCount,
    isRetrying,
  };
}

/**
 * Global error boundary context for handling uncaught errors
 */
export interface ErrorBoundaryState {
  errors: AppError[];
  addError: (error: unknown) => void;
  clearError: (index: number) => void;
  clearAllErrors: () => void;
}

/**
 * Hook for managing global application errors
 */
export function useErrorBoundary(): ErrorBoundaryState {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = useCallback((error: unknown) => {
    const normalizedError = normalizeError(error);
    setErrors(prev => [...prev, normalizedError]);
  }, []);

  const clearError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    clearError,
    clearAllErrors,
  };
}

/**
 * Utility for creating consistent loading states
 */
export function createLoadingState(
  operation: string,
  progress?: number
): LoadingState {
  return {
    isLoading: true,
    operation,
    progress,
  };
}

/**
 * Utility for handling form validation errors
 */
export function extractValidationErrors(error: AppError): Record<string, string> {
  if (error.type === 'validation' && error.details?.errors) {
    return error.details.errors;
  }

  if (error.field) {
    return { [error.field]: error.message };
  }

  return {};
}