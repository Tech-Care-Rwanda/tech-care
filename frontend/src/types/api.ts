/**
 * TypeScript interfaces for TechCare Backend API Responses
 * Based on Node.js/Express backend with Prisma ORM
 */

// Base API Response Structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Authentication Related Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface TechnicianSignUpRequest extends SignUpRequest {
  specialties?: string[];
  experience: number;
  profileImage: File;
  certificateDocument?: File;
  gender: string;
  age: number;
  DateOfBirth: string;
  specialization: string;
}

export interface SignUpResponse {
  user: User;
  token: string;
  verificationRequired?: boolean;
}

// User Related Types
// Role mapping utilities
export type ApiRole = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
export type UserRole = 'customer' | 'technician' | 'admin' | null;

export function apiRoleToUserRole(apiRole: ApiRole): UserRole {
  const mapping: Record<ApiRole, UserRole> = {
    'CUSTOMER': 'customer',
    'TECHNICIAN': 'technician',
    'ADMIN': 'admin',
  };
  return mapping[apiRole];
}

export function userRoleToApiRole(userRole: UserRole): ApiRole | null {
  if (!userRole) return null;
  const mapping: Record<NonNullable<UserRole>, ApiRole> = {
    'customer': 'CUSTOMER',
    'technician': 'TECHNICIAN',
    'admin': 'ADMIN',
  };
  return mapping[userRole];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: ApiRole;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';
  emailVerified: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Customer extends User {
  role: 'CUSTOMER';
  totalBookings?: number;
  completedServices?: number;
  totalSpent?: number;
  preferredPaymentMethod?: string;
}

export interface Technician extends User {
  role: 'TECHNICIAN';
  specialties: string[];
  experience: number;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  monthlyEarnings: number;
  isAvailable: boolean;
  certificationDocuments?: string[];
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface Admin extends User {
  role: 'ADMIN';
  permissions: string[];
}

// Profile Related Types
export interface ProfileUpdateRequest {
  fullName?: string;
  phoneNumber?: string;
  profileImage?: File;
  // Technician specific
  specialties?: string[];
  isAvailable?: boolean;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Admin Related Types
export interface AdminGetTechniciansParams {
  status?: 'PENDING' | 'ACTIVE' | 'REJECTED';
  page?: number;
  limit?: number;
  search?: string;
}

export interface TechnicianApprovalRequest {
  technicianId: string;
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

export interface CustomerPromotionRequest {
  customerId: string;
}

// Service/Booking Related Types (future expansion)
export interface ServiceRequest {
  id: string;
  customerId: string;
  technicianId?: string;
  serviceType: string;
  description: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  scheduledDate: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  estimatedPrice?: number;
  finalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// File Upload Types
export interface FileUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
}

// Notification Types (future expansion)
export interface Notification {
  id: string;
  userId: string;
  type: 'SERVICE_REQUEST' | 'BOOKING_UPDATE' | 'PAYMENT' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

// Search/Filter Types
export interface TechnicianSearchParams {
  location?: string;
  specialties?: string[];
  rating?: number;
  availability?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  radius?: number; // in kilometers
}

export interface ServiceSearchParams {
  serviceType?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
}