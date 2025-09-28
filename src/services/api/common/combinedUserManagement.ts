// fe/src/services/api/common/combinedUserManagementApi.ts
// Use type-only imports to break cycles
import type { 
  PlatformUser,
  CreatePlatformUserData,
  UpdatePlatformUserData 
} from '../platform/platformUserApi';

import type { 
  TenantUser,
  CreateTenantUserData,
  UpdateTenantUserData
} from '../tenant/tenantUserApi';

import type { 
  Tenant,
  CreateTenantData,
  UpdateTenantData
} from '../platform/tenantUserApi'; // ✅ Import tenant management types from PLATFORM

import type { ApiResponse } from '../../../types';

// Import specific functions with explicit names to avoid cycles
import { 
  getPlatformUsers as fetchPlatformUsers, 
  getPlatformUserById as fetchPlatformUserById, 
  createPlatformUser as createPlatformUserFunc, 
  updatePlatformUser as updatePlatformUserFunc, 
  deletePlatformUser as deletePlatformUserFunc 
} from '../platform/platformUserApi';

// ✅ CORRECTED: Import tenant MANAGEMENT functions from PLATFORM API
import { 
  getAllTenants as fetchAllTenants, 
  getTenantById as fetchTenantById, 
  createTenant as createTenantFunc, 
  updateTenant as updateTenantFunc, 
  deleteTenant as deleteTenantFunc
} from '../platform/tenantUserApi'; // From PLATFORM, not tenant

// Import tenant USER functions from tenant API
import { 
  getAllTenantUsers as fetchAllTenantUsers,
  getTenantUserById as fetchTenantUserById,
  createTenantUser as createTenantUserFunc,
  updateTenantUser as updateTenantUserFunc,
  deleteTenantUser as deleteTenantUserFunc
} from '../tenant/tenantUserApi'; // Tenant user functions stay here

import { 
  updateUserProfile, 
  changeUserPassword, 
  uploadProfilePicture, 
  deleteProfilePicture, 
  getUserActivity 
} from './authApi';

// Re-export commonly used functions with clear names
export const getPlatformUsers = fetchPlatformUsers;
export const getPlatformUserById = fetchPlatformUserById;
export const createPlatformUser = createPlatformUserFunc;
export const updatePlatformUser = updatePlatformUserFunc;
export const deletePlatformUser = deletePlatformUserFunc;

// Tenant MANAGEMENT functions (platform managing tenant organizations)
export const getAllTenants = fetchAllTenants;
export const getTenantById = fetchTenantById;
export const createTenant = createTenantFunc;
export const updateTenant = updateTenantFunc;
export const deleteTenant = deleteTenantFunc;

// Tenant USER functions (tenants managing their own users)
export const getAllTenantUsers = fetchAllTenantUsers;
export const getTenantUserById = fetchTenantUserById;
export const createTenantUser = createTenantUserFunc;
export const updateTenantUser = updateTenantUserFunc;
export const deleteTenantUser = deleteTenantUserFunc;

export const updateProfile = updateUserProfile;
export const updatePassword = changeUserPassword;

// Combined user interface for easier usage
export interface CombinedUser {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  tenant?: {
    _id: string;
    tenantId: string;
    companyName: string;
  };
  isPlatformUser: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// User creation data interface
export interface UserCreateData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  employeeId?: string;
}

// User update data interface
export interface UserUpdateData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  employeeId?: string;
}

// User filter interface
export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  isActive?: boolean;
}

// Pagination response interface
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Get users based on user type (platform or tenant)
 */
export const getUsers = async (isPlatform: boolean, params: UserFilters & { page?: number; limit?: number } = {}) => {
  if (isPlatform) {
    return fetchPlatformUsers(params); // Platform users
  } else {
    return fetchAllTenantUsers(params); // ✅ FIXED: Use tenant USERS, not tenant organizations
  }
};

/**
 * Get user by ID based on user type
 */
export const getUserById = async (userId: string, isPlatform: boolean) => {
  if (isPlatform) {
    return fetchPlatformUserById(userId); // Platform user
  } else {
    return fetchTenantUserById(userId); // ✅ FIXED: Use tenant USER, not tenant organization
  }
};

/**
 * Create user based on user type
 */
export const createUser = async (userData: UserCreateData, isPlatform: boolean) => {
  if (isPlatform) {
    return createPlatformUserFunc(userData as CreatePlatformUserData);
  } else {
    return createTenantUserFunc(userData as CreateTenantUserData); // ✅ FIXED: Use tenant USER creation
  }
};

/**
 * Update user based on user type
 */
export const updateUser = async (userId: string, userData: UserUpdateData, isPlatform: boolean) => {
  if (isPlatform) {
    return updatePlatformUserFunc(userId, userData as UpdatePlatformUserData);
  } else {
    return updateTenantUserFunc(userId, userData as UpdateTenantUserData); // ✅ FIXED: Use tenant USER update
  }
};

/**
 * Delete user based on user type
 */
export const deleteUser = async (userId: string, isPlatform: boolean) => {
  if (isPlatform) {
    return deletePlatformUserFunc(userId);
  } else {
    return deleteTenantUserFunc(userId); // ✅ FIXED: Use tenant USER deletion
  }
};

/**
 * Check if user has permission to manage other users
 */
export const canManageUsers = (currentUserRole: string, targetUserRole: string): boolean => {
  const roleHierarchy: { [key: string]: string[] } = {
    'platform_superadmin': ['platform_admin', 'platform_employee', 'tenant_superadmin', 'admin', 'employee'],
    'platform_admin': ['platform_employee', 'tenant_superadmin', 'admin', 'employee'],
    'platform_employee': ['tenant_superadmin', 'admin', 'employee'],
    'tenant_superadmin': ['admin', 'employee'],
    'admin': ['employee'],
    'employee': []
  };

  return roleHierarchy[currentUserRole]?.includes(targetUserRole) || false;
};

/**
 * Get available roles for user creation based on current user's role
 */
export const getAvailableRoles = (currentUserRole: string, isPlatform: boolean): string[] => {
  const platformRoles = ['platform_superadmin', 'platform_admin', 'platform_employee'];
  const tenantRoles = ['tenant_superadmin', 'admin', 'employee'];

  const roleHierarchy: { [key: string]: string[] } = {
    'platform_superadmin': platformRoles.concat(tenantRoles),
    'platform_admin': ['platform_employee'].concat(tenantRoles),
    'platform_employee': tenantRoles,
    'tenant_superadmin': ['admin', 'employee'],
    'admin': ['employee'],
    'employee': []
  };

  return roleHierarchy[currentUserRole] || [];
};

/**
 * Format user role for display
 */
export const formatUserRole = (role: string): string => {
  const roleMap: { [key: string]: string } = {
    'platform_superadmin': 'Platform Super Admin',
    'platform_admin': 'Platform Admin',
    'platform_employee': 'Platform Employee',
    'tenant_superadmin': 'Tenant Super Admin',
    'admin': 'Admin',
    'employee': 'Employee'
  };

  return roleMap[role] || role;
};

/**
 * Check if user is a platform user
 */
export const isPlatformUser = (user: CombinedUser): boolean => {
  return user.isPlatformUser || user.role?.startsWith('platform_') || false;
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user: CombinedUser): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username || user.email || 'Unknown User';
};

// Export types for external use
export type {
  PlatformUser,
  CreatePlatformUserData,
  UpdatePlatformUserData,
  TenantUser,
  CreateTenantUserData,
  UpdateTenantUserData,
  Tenant,
  CreateTenantData,
  UpdateTenantData
};

// Default export with all functions
// Default export with all functions
const combinedUserManagementApi = {
  // Platform user functions
  getPlatformUsers: fetchPlatformUsers,
  getPlatformUserById: fetchPlatformUserById,
  createPlatformUser: createPlatformUserFunc,
  updatePlatformUser: updatePlatformUserFunc,
  deletePlatformUser: deletePlatformUserFunc,

  // Tenant MANAGEMENT functions (platform side)
  getAllTenants: fetchAllTenants,
  getTenantById: fetchTenantById,
  createTenant: createTenantFunc,
  updateTenant: updateTenantFunc,
  deleteTenant: deleteTenantFunc,

  // Tenant USER functions (tenant side)
  getAllTenantUsers: fetchAllTenantUsers,
  getTenantUserById: fetchTenantUserById,
  createTenantUser: createTenantUserFunc,
  updateTenantUser: updateTenantUserFunc,
  deleteTenantUser: deleteTenantUserFunc,

  // Profile functions
  updateUserProfile,
  changeUserPassword,
  uploadProfilePicture,
  deleteProfilePicture,
  getUserActivity,

  // Simplified names
  updateProfile,
  updatePassword,

  // Combined functions
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  // Utility functions
  canManageUsers,
  getAvailableRoles,
  formatUserRole,
  isPlatformUser,
  getUserDisplayName
};

export default combinedUserManagementApi;