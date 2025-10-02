// fe/src/types/auth.ts

export interface User {
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

export interface PlatformUser {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'platform_superadmin' | 'platform_admin' | 'platform_employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'tenant_superadmin' | 'admin' | 'employee' | 'client';
  isActive: boolean;
  employeeId?: string;
  department?: string;
  position?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    username: string;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreatePlatformUserData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'platform_superadmin' | 'platform_admin' | 'platform_employee';
}

export interface UpdatePlatformUserData {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'platform_superadmin' | 'platform_admin' | 'platform_employee';
  isActive?: boolean;
}

export interface CreateTenantUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'tenant_superadmin' | 'admin' | 'employee' | 'client';
  employeeId?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
}

export interface UpdateTenantUserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'tenant_superadmin' | 'admin' | 'employee' | 'client';
  employeeId?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
}