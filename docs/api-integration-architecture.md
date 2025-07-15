# TechCare Frontend-Backend Integration Architecture

## Overview

This document outlines the comprehensive API integration layer design for TechCare Rwanda, facilitating communication between the React/Next.js frontend and Node.js/Express backend.

## Architecture Components

### 1. Service Layer (`/src/lib/services/`)

#### API Service (`api.ts`)
The core service layer providing:
- **ApiClient**: Base HTTP client with authentication, error handling, and request management
- **AuthService**: Authentication operations (login, registration, password management)
- **CustomerService**: Customer-specific operations
- **AdminService**: Admin dashboard and technician management

**Key Features:**
- JWT token management with automatic header injection
- Request timeout handling (30 seconds)
- File upload support with progress tracking
- Consistent error handling and response normalization
- TypeScript-first design with full type safety

```typescript
// Usage Example
import { apiService } from '@/lib/services/api';

const result = await apiService.auth.login({
  email: 'user@example.com',
  password: 'password'
});
```

### 2. Type Definitions (`/src/types/api.ts`)

Comprehensive TypeScript interfaces covering:
- **Authentication**: Login, registration, password management
- **User Types**: Customer, Technician, Admin with role-specific properties
- **API Responses**: Standardized response structure with error handling
- **Pagination**: Consistent pagination patterns
- **File Uploads**: File upload response structure

**Key Types:**
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';
  // ... other properties
}
```

### 3. Authentication Management

#### Enhanced AuthContext
Builds upon existing context with real API integration:
- Maintains backward compatibility with existing mock data
- Integrates with actual backend endpoints
- Handles token storage and validation
- Supports role-based authentication

#### Authentication Hooks (`/src/lib/hooks/useAuth.ts`)
Specialized hooks for different auth operations:
- `useLogin()`: User authentication with error handling
- `useCustomerRegistration()`: Customer signup flow
- `useTechnicianRegistration()`: Technician signup with file uploads
- `useLogout()`: Secure logout with server notification
- `usePasswordChange()`: Password management
- `useForgotPassword()` / `useResetPassword()`: Password recovery

**Usage Example:**
```typescript
function LoginComponent() {
  const { login, isLoading, error } = useLogin();
  
  const handleSubmit = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Handle success
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {/* form fields */}
      <button disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### 4. Error Handling & Loading States (`/src/lib/utils/errorHandling.ts`)

#### Standardized Error Management
- **AppError Interface**: Unified error structure across the application
- **Error Normalization**: Converts various error types to consistent format
- **User-Friendly Messages**: Contextual error messages for different scenarios

#### Advanced Loading State Management
- **useAsyncOperation()**: Individual operation state management
- **useAsyncQueue()**: Multiple concurrent operations
- **useRetry()**: Automatic retry with exponential backoff

**Error Types:**
- `network`: Connection issues
- `api`: Server-side errors
- `validation`: Input validation errors
- `auth`: Authentication/authorization errors
- `unknown`: Unexpected errors

#### Usage Patterns:
```typescript
function DataComponent() {
  const { data, loading, error, execute } = useAsyncOperation();
  
  const fetchData = () => execute(async () => {
    const response = await apiService.customer.getProfile();
    return response.data;
  });
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  return <DataDisplay data={data} />;
}
```

### 5. Admin Management (`/src/lib/hooks/useAdmin.ts`)

Specialized hooks for admin functionality:
- **useTechnicianManagement()**: Fetch and manage technician applications
- **useTechnicianActions()**: Approve/reject individual technicians
- **useBulkTechnicianActions()**: Bulk operations on multiple technicians
- **useAdminDashboard()**: Dashboard statistics and analytics
- **useCustomerPromotion()**: Promote customers to admin role

## API Endpoint Mapping

### Authentication Endpoints
| Frontend Hook | Backend Route | Method | Purpose |
|---------------|---------------|---------|---------|
| `useLogin()` | `/auth/login` | POST | User authentication |
| `useCustomerRegistration()` | `/auth/customer/signup` | POST | Customer registration |
| `useTechnicianRegistration()` | `/auth/technician/signup` | POST | Technician registration with files |
| `useForgotPassword()` | `/auth/forgot-password` | POST | Password reset request |
| `useResetPassword()` | `/auth/reset-password` | POST | Password reset with token |

### Customer Endpoints
| Frontend Hook | Backend Route | Method | Purpose |
|---------------|---------------|---------|---------|
| `useProfile()` | `/customer/profile` | GET/PUT | Profile management |
| `useAuthCheck()` | `/customer/check-auth` | GET | Authentication verification |
| `usePasswordChange()` | `/customer/change-password` | POST | Password update |
| `useLogout()` | `/customer/logout` | GET | Secure logout |

### Admin Endpoints
| Frontend Hook | Backend Route | Method | Purpose |
|---------------|---------------|---------|---------|
| `useAdminProfile()` | `/admin/profile` | GET | Admin profile |
| `useTechnicianManagement()` | `/admin/get-technicians` | GET | List technicians with filters |
| `useTechnicianActions()` | `/admin/technicians/:id/approve` | PUT | Approve technician |
| `useTechnicianActions()` | `/admin/technicians/:id/reject` | PUT | Reject technician |
| `useCustomerPromotion()` | `/admin/customer-to-admin/:id` | PUT | Promote customer |

## Integration Patterns

### 1. Data Fetching Pattern
```typescript
// Standard data fetching with error handling
const { data, loading, error, execute } = useAsyncOperation();

useEffect(() => {
  execute(async () => {
    const response = await apiService.customer.getProfile();
    if (!response.success) throw new Error(response.message);
    return response.data;
  });
}, []);
```

### 2. Form Submission Pattern
```typescript
// Form with validation and error handling
const { register, isLoading, error } = useCustomerRegistration();

const handleSubmit = async (formData) => {
  const result = await register(formData);
  if (result.success) {
    router.push('/dashboard');
  }
  // Error is automatically handled by the hook
};
```

### 3. File Upload Pattern
```typescript
// File upload with progress tracking
const { register, isLoading, uploadProgress, error } = useTechnicianRegistration();

const handleTechnicianSignup = async (data) => {
  const result = await register({
    ...data,
    profileImage: selectedFile,
    certificateDocument: certificateFile
  });
};

// Progress is automatically tracked in uploadProgress (0-100)
```

### 4. Error Boundary Pattern
```typescript
// Global error handling
const { errors, addError, clearError } = useErrorBoundary();

// Component-level error recovery
const { retry, retryCount, isRetrying } = useRetry();

const handleRetry = () => retry(
  () => apiService.customer.getProfile(),
  { maxRetries: 3, retryOn: error => error.type === 'network' }
);
```

## Security Considerations

### Token Management
- JWT tokens stored in localStorage (client-side)
- Automatic token inclusion in API requests
- Token validation on protected routes
- Secure logout with server-side session invalidation

### Request Security
- CORS configuration for cross-origin requests
- Request timeout to prevent hanging requests
- Input validation on both frontend and backend
- File upload size and type restrictions

### Error Handling Security
- Sensitive error details not exposed to frontend
- Generic error messages for security-related issues
- Proper handling of authentication failures

## Performance Optimizations

### Request Optimization
- Request deduplication for concurrent identical requests
- Automatic retry with exponential backoff for failed requests
- Request abortion for cancelled operations
- Connection pooling through browser's native fetch

### State Management
- Minimal re-renders through careful hook dependencies
- Memoized callbacks and values where appropriate
- Efficient error and loading state updates
- Cleanup of resources on component unmount

### File Upload Optimization
- Progress tracking for user feedback
- Chunked uploads for large files (future enhancement)
- File type and size validation before upload
- Graceful handling of upload failures

## Testing Strategy

### Unit Testing
- Mock API service for component testing
- Test error handling scenarios
- Validate loading states and user feedback
- Test form validation and submission

### Integration Testing
- End-to-end authentication flows
- File upload functionality
- Error recovery mechanisms
- Cross-browser compatibility

### API Testing
- Validate request/response formats
- Test error response handling
- Verify authentication flows
- Load testing for concurrent operations

## Future Enhancements

### Real-time Features
- WebSocket integration for live updates
- Push notifications for admin actions
- Real-time technician status updates

### Advanced Error Handling
- Offline support with request queuing
- Background sync for failed operations
- Enhanced retry strategies

### Performance Improvements
- Request caching strategies
- Optimistic updates for better UX
- Background data prefetching

### Security Enhancements
- Refresh token implementation
- Enhanced CSRF protection
- Rate limiting awareness

## Migration Guide

### From Mock to Real API
1. Update environment variables (`NEXT_PUBLIC_API_URL`)
2. Configure backend CORS settings
3. Update authentication flows to use real endpoints
4. Test file upload functionality
5. Validate error handling with real server responses

### Existing Code Compatibility
- Existing AuthContext remains functional
- Gradual migration approach supported
- Backward compatibility maintained during transition
- No breaking changes to existing components

## Configuration

### Environment Variables
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key

# Backend (.env)
JWT_SECRET_KEY=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

### API Client Configuration
```typescript
// Configurable timeout and base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TIMEOUT = 30000; // 30 seconds
```

This integration architecture provides a robust, type-safe, and scalable foundation for frontend-backend communication in TechCare Rwanda, ensuring consistent error handling, optimal user experience, and maintainable code structure.