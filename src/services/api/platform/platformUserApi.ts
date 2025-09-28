// fe/src/services/api/platform/platformUserApi.ts
import axiosInstance from '../../../services/axiosInstance';
import { type ApiResponse } from '../../../types';
import { handleApiError, createApiResponse } from '../common/apiUtils';

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

export const getPlatformUsers = async (params = {}): Promise<ApiResponse<PlatformUser[]>> => {
  try {
    console.log('Fetching platform users with params:', params);
    const response = await axiosInstance.get('/platform/users', { params });
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || 'Platform users fetched successfully'
    );
  } catch (error: any) {
    console.error('Get platform users error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const getPlatformUserById = async (userId: string): Promise<ApiResponse<PlatformUser>> => {
  try {
    console.log('Fetching platform user:', userId);
    const response = await axiosInstance.get(`/platform/users/${userId}`);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || 'Platform user fetched successfully'
    );
  } catch (error: any) {
    console.error('Get platform user error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const createPlatformUser = async (userData: CreatePlatformUserData): Promise<ApiResponse<PlatformUser>> => {
  try {
    console.log('Creating platform user:', userData);
    const response = await axiosInstance.post('/platform/users', userData);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || 'Platform user created successfully'
    );
  } catch (error: any) {
    console.error('Create platform user error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const updatePlatformUser = async (userId: string, userData: UpdatePlatformUserData): Promise<ApiResponse<PlatformUser>> => {
  try {
    console.log('Updating platform user:', userId, userData);
    const response = await axiosInstance.put(`/platform/users/${userId}`, userData);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || 'Platform user updated successfully'
    );
  } catch (error: any) {
    console.error('Update platform user error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const deletePlatformUser = async (userId: string): Promise<ApiResponse> => {
  try {
    console.log('Deleting platform user:', userId);
    const response = await axiosInstance.delete(`/platform/users/${userId}`);
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || 'Platform user deleted successfully'
    );
  } catch (error: any) {
    console.error('Delete platform user error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};

export const getPlatformUsersPaginated = async (page = 1, limit = 10, filters = {}): Promise<ApiResponse<PlatformUser[]>> => {
  try {
    const params = { page, limit, ...filters };
    console.log('Fetching paginated platform users:', params);
    const response = await axiosInstance.get('/platform/users', { params });
    
    return createApiResponse(
      true,
      response.data.data || response.data,
      response.data.message || 'Platform users fetched successfully'
    );
  } catch (error: any) {
    console.error('Get paginated platform users error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false,
      undefined,
      errorInfo.message,
      errorInfo.message
    );
  }
};