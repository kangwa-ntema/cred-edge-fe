// fe/src/services/api/platform/packageService.ts

// fe/src/services/api/packageService.ts
import axiosInstance from "../../axiosInstance";
import { type ApiResponse } from "../../../types";
/* 
export interface PackageData {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  bestFor: string;
  monthlyPrice: number;
  annualPrice: number;
  features: {
    name: string;
    description?: string;
    included: boolean;
  }[];
  limits: {
    maxClients: number;
    maxLoans: number;
    maxUsers: number;
    storageGB: number;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
 */
// Unified response handler
const handleApiResponse = <T>(response: any): ApiResponse<T> => {
  if (response.data && response.data.success !== undefined) {
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error
    };
  }
  
  return {
    success: true,
    data: response.data,
    message: "Operation completed successfully"
  };
};

// Core API functions that return ApiResponse<T>
export const packageApi = {
  // Get packages with full ApiResponse structure (for admin/management)
  getPackages: async (params = {}): Promise<ApiResponse<PackageData[]>> => {
    try {
      const response = await axiosInstance.get("/platform/packages", { params });
      return handleApiResponse<PackageData[]>(response);
    } catch (error: any) {
      console.error("Get packages error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch packages";
      return { success: false, error: errorMessage, message: errorMessage };
    }
  },

  // Get packages as simple array (for public pages)
  getPackagesList: async (params = {}): Promise<PackageData[]> => {
    try {
      const response = await axiosInstance.get("/platform/packages", { params });
      
      // Handle different response structures
      if (response.data && response.data.success !== undefined) {
        return response.data.data || [];
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("Get packages list error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch packages");
    }
  },

  // Get active packages only (for public pages)
  getActivePackages: async (): Promise<PackageData[]> => {
    try {
      const response = await axiosInstance.get("/platform/packages", {
        params: { isActive: true },
      });
      
      if (response.data && response.data.success !== undefined) {
        return response.data.data || [];
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("Get active packages error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch packages");
    }
  },

  // Admin-only operations (return ApiResponse)
  getPackageById: async (packageId: string): Promise<ApiResponse<PackageData>> => {
    try {
      const response = await axiosInstance.get(`/platform/packages/${packageId}`);
      return handleApiResponse<PackageData>(response);
    } catch (error: any) {
      console.error("Get package error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch package";
      return { success: false, error: errorMessage, message: errorMessage };
    }
  },

  createPackage: async (packageData: PackageData): Promise<ApiResponse<PackageData>> => {
    try {
      const response = await axiosInstance.post("/platform/packages", packageData);
      return handleApiResponse<PackageData>(response);
    } catch (error: any) {
      console.error("Create package error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create package";
      return { success: false, error: errorMessage, message: errorMessage };
    }
  },

  updatePackage: async (packageId: string, packageData: Partial<PackageData>): Promise<ApiResponse<PackageData>> => {
    try {
      const response = await axiosInstance.put(`/platform/packages/${packageId}`, packageData);
      return handleApiResponse<PackageData>(response);
    } catch (error: any) {
      console.error("Update package error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update package";
      return { success: false, error: errorMessage, message: errorMessage };
    }
  },

  deletePackage: async (packageId: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.delete(`/platform/packages/${packageId}`);
      return handleApiResponse(response);
    } catch (error: any) {
      console.error("Delete package error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete package";
      return { success: false, error: errorMessage, message: errorMessage };
    }
  }
};

// Export types and the main service
export type { PackageData };
export default packageApi;