// fe/src/services/api/platform/packageApi.ts

import axiosInstance from "../../../services/axiosInstance";
import { type ApiResponse } from "../../../types";

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

// Helper function to handle API responses consistently
const handleApiResponse = (response: any): ApiResponse<any> => {
  if (response.data && response.data.success !== undefined) {
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error
    };
  }
  
  // Fallback for different response structures
  return {
    success: true,
    data: response.data,
    message: "Operation completed successfully"
  };
};

export const getPackages = async (
  params = {}
): Promise<ApiResponse<PackageData[]>> => {
  try {
    const response = await axiosInstance.get("/platform/packages", { params });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error("Get packages error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch packages";

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

export const getPackageById = async (
  packageId: string
): Promise<ApiResponse<PackageData>> => {
  try {
    const response = await axiosInstance.get(`/platform/packages/${packageId}`);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error("Get package error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch package";

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

export const createPackage = async (
  packageData: PackageData
): Promise<ApiResponse<PackageData>> => {
  try {
    const response = await axiosInstance.post("/platform/packages", packageData);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error("Create package error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to create package";

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

export const updatePackage = async (
  packageId: string,
  packageData: Partial<PackageData>
): Promise<ApiResponse<PackageData>> => {
  try {
    const response = await axiosInstance.put(
      `/platform/packages/${packageId}`,
      packageData
    );
    return handleApiResponse(response);
  } catch (error: any) {
    console.error("Update package error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to update package";

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

export const deletePackage = async (
  packageId: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.delete(`/platform/packages/${packageId}`);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error("Delete package error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to delete package";

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

export const getPackagesWithTenantCount = async (): Promise<
  ApiResponse<any>
> => {
  try {
    const response = await axiosInstance.get("/platform/packages/with-tenant-count");
    return handleApiResponse(response);
  } catch (error: any) {
    console.error("Get packages with tenant count error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch packages with tenant count";

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

export const getActivePackages = async (): Promise<
  ApiResponse<PackageData[]>
> => {
  try {
    const response = await axiosInstance.get("/platform/packages", {
      params: { isActive: true },
    });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error("Get active packages error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch active packages";

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};

export const getPackagesPaginated = async (
  page = 1,
  limit = 10,
  filters = {}
): Promise<ApiResponse<PackageData[]>> => {
  try {
    const params = { page, limit, ...filters };
    const response = await axiosInstance.get("/platform/packages", { params });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error("Get paginated packages error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch packages";

    return {
      success: false,
      error: errorMessage,
      message: errorMessage,
    };
  }
};