// fe/src/services/api/platform/tenantUserApi.ts

import axiosInstance from "../../axiosInstance";
import { type ApiResponse } from "../../../types";
import { handleApiError, createApiResponse } from "../common/apiUtils";

// Tenant Management Interfaces (Platform managing tenant organizations)
export interface Tenant {
  _id: string;
  tenantId: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  companyNumber?: string;
  status: "active" | "suspended" | "trial" | "cancelled";
  isActive: boolean;
  package: {
    _id: string;
    name: string;
  };
  superadmin?: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  trialEndsAt?: string;
}

export interface CreateTenantData {
  tenantId: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  companyNumber?: string;
  packageId: string;
  password: string;
  superadminUsername: string;
  superadminFirstName: string;
  superadminLastName: string;
  superadminEmail: string;
  superadminPhone?: string;
}

export interface UpdateTenantData {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  status?: "active" | "suspended" | "trial" | "cancelled";
  packageId?: string;
  superadminFirstName?: string;
  superadminLastName?: string;
  superadminEmail?: string;
  superadminPhone?: string;
}

// Platform Tenant Management API Functions (Managing tenant organizations)
export const getAllTenants = async (): Promise<ApiResponse<Tenant[]>> => {
    try {
        const response = await axiosInstance.get('/platform/tenants');
        return createApiResponse(
            true,
            response.data.data || response.data,
            response.data.message
        );
    } catch (error: any) {
        console.error('Error fetching tenants:', error);
        const errorInfo = handleApiError(error);
        return createApiResponse(
            false,
            undefined,
            errorInfo.message,
            errorInfo.message
        );
    }
};

export const getTenantById = async (id: string): Promise<ApiResponse<Tenant>> => {
    try {
        const response = await axiosInstance.get(`/platform/tenants/${id}`);
        return createApiResponse(
            true,
            response.data.data || response.data,
            response.data.message
        );
    } catch (error: any) {
        console.error('Error fetching tenant:', error);
        const errorInfo = handleApiError(error);
        return createApiResponse(
            false,
            undefined,
            errorInfo.message,
            errorInfo.message
        );
    }
};

export const createTenant = async (tenantData: CreateTenantData): Promise<ApiResponse<Tenant>> => {
  try {
    const response = await axiosInstance.post("/platform/tenants", tenantData);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Tenant created successfully"
    );
  } catch (error: any) {
    console.error("Create tenant error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const updateTenant = async (tenantId: string, tenantData: UpdateTenantData): Promise<ApiResponse<Tenant>> => {
  try {
    const response = await axiosInstance.put(`/platform/tenants/${tenantId}`, tenantData);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Tenant updated successfully"
    );
  } catch (error: any) {
    console.error("Update tenant error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const deleteTenant = async (tenantId: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.delete(`/platform/tenants/${tenantId}`);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Tenant deleted successfully"
    );
  } catch (error: any) {
    console.error("Delete tenant error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};