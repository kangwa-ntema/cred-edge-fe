// fe/src/services/api/tenant/clientApi.ts

import axiosInstance from "../../../services/axiosInstance";
import { type ApiResponse } from "../../../types";
import { handleApiError, createApiResponse } from "../common/apiUtils";

// Client Interfaces - ALIGNED WITH BACKEND
export interface Client {
  _id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  idNumber?: string;
  dateOfBirth?: string;
  status: "active" | "inactive" | "blacklisted";
  creditScore?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  idNumber?: string;
  dateOfBirth?: string;
  status?: "active" | "inactive" | "blacklisted";
}

export interface UpdateClientData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  idNumber?: string;
  dateOfBirth?: string;
  status?: "active" | "inactive" | "blacklisted";
}

export interface ClientFilters {
  status?: string;
  search?: string;
}

// Client Management API Functions
export const getAllClients = async (filters?: ClientFilters): Promise<ApiResponse<{clients: Client[], overallSummary: any}>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await axiosInstance.get(`/tenant/clients?${params}`);
    
    console.log("Get clients response structure:", response.data);

    let clients = [];
    let overallSummary = {};

    // Your backend returns: { success, data, pagination, message }
    if (response.data.success && response.data.data) {
      clients = response.data.data;
      
      // Calculate summary from the actual client data
      overallSummary = {
        totalClients: response.data.pagination?.total || clients.length,
        active: clients.filter((c: Client) => c.status === 'active').length,
        inactive: clients.filter((c: Client) => c.status === 'inactive').length,
        blacklisted: clients.filter((c: Client) => c.status === 'blacklisted').length
      };
    } else {
      // Fallback if structure is different
      clients = response.data.data || response.data || [];
      overallSummary = {
        totalClients: clients.length,
        active: clients.filter((c: Client) => c.status === 'active').length,
        inactive: clients.filter((c: Client) => c.status === 'inactive').length,
        blacklisted: clients.filter((c: Client) => c.status === 'blacklisted').length
      };
    }
    
    return createApiResponse(
      true,
      { clients, overallSummary },
      response.data.message || "Clients retrieved successfully"
    );
  } catch (error: any) {
    console.error("Get clients error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const getClientById = async (clientId: string): Promise<ApiResponse<Client>> => {
  try {
    const response = await axiosInstance.get(`/tenant/clients/${clientId}`);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Client retrieved successfully"
    );
  } catch (error: any) {
    console.error("Get client error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const createClient = async (clientData: CreateClientData): Promise<ApiResponse<Client>> => {
  try {
    console.log("Sending client data:", clientData);
    
    const response = await axiosInstance.post(`/tenant/clients`, clientData);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Client created successfully"
    );
  } catch (error: any) {
    console.error("=== FULL ERROR DETAILS ===");
    console.error("Error object:", error);
    console.error("Response data:", error.response?.data);
    
    // SPECIFICALLY LOG THE ERRORS ARRAY
    if (error.response?.data?.errors) {
      console.error("Validation errors:", error.response.data.errors);
      console.error("First error:", error.response.data.errors[0]);
    }
    
    console.error("Response status:", error.response?.status);
    console.error("=== END ERROR DETAILS ===");
    
    // Extract the actual validation error message
    let errorMessage = 'Failed to create client';
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      errorMessage = error.response.data.errors[0]; // Get the first error
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    return createApiResponse(
      false,
      undefined,
      errorMessage,
      errorMessage
    );
  }
};

export const updateClient = async (clientId: string, clientData: UpdateClientData): Promise<ApiResponse<Client>> => {
  try {
    const response = await axiosInstance.put(`/tenant/clients/${clientId}`, clientData);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Client updated successfully"
    );
  } catch (error: any) {
    console.error("Update client error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const deleteClient = async (clientId: string): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.delete(`/tenant/clients/${clientId}`);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || "Client deleted successfully"
    );
  } catch (error: any) {
    console.error("Delete client error:", error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};