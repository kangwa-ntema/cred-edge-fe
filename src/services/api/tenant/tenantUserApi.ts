// fe/src/services/api/tenant/tenantUserApi.ts
import axiosInstance from "../../../services/axiosInstance";
import { type ApiResponse } from "../../../types";
import { handleApiError, createApiResponse } from "../common/apiUtils";

// Tenant User Interfaces
export interface TenantUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "tenant_superadmin" | "admin" | "employee" | "client";
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

export interface CreateTenantUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "tenant_superadmin" | "admin" | "employee" | "client";
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
  role?: "tenant_superadmin" | "admin" | "employee" | "client";
  employeeId?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
}

export interface TenantUserFilters {
  role?: string;
  isActive?: boolean;
  department?: string;
  search?: string;
}

// Tenant User Management API Functions - NO tenantId parameter needed (uses auth context)
export const getAllTenantUsers = async (filters?: TenantUserFilters): Promise<ApiResponse<{users: TenantUser[], overallSummary: any}>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.department) params.append('department', filters.department);
    if (filters?.search) params.append('search', filters.search);

    const response = await axiosInstance.get(`/tenant/users?${params}`);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Tenant users retrieved successfully"
    );
  } catch (error: any) {
    console.error("Get tenant users error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const getTenantUserById = async (userId: string): Promise<ApiResponse<TenantUser>> => {
  try {
    const response = await axiosInstance.get(`/tenant/users/${userId}`);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Tenant user retrieved successfully"
    );
  } catch (error: any) {
    console.error("Get tenant user error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const createTenantUser = async (userData: CreateTenantUserData): Promise<ApiResponse<TenantUser>> => {
  try {
    const response = await axiosInstance.post(`/tenant/users`, userData);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Tenant user created successfully"
    );
  } catch (error: any) {
    console.error("Create tenant user error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const updateTenantUser = async (userId: string, userData: UpdateTenantUserData): Promise<ApiResponse<TenantUser>> => {
  try {
    const response = await axiosInstance.put(`/tenant/users/${userId}`, userData);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Tenant user updated successfully"
    );
  } catch (error: any) {
    console.error("Update tenant user error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const deleteTenantUser = async (userId: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.delete(`/tenant/users/${userId}`);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Tenant user deleted successfully"
    );
  } catch (error: any) {
    console.error("Delete tenant user error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const changeTenantUserPassword = async (userId: string, newPassword: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.patch(`/tenant/users/${userId}/password`, { newPassword });
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Password changed successfully"
    );
  } catch (error: any) {
    console.error("Change tenant user password error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};