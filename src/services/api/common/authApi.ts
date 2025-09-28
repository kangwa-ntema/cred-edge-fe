// fe/src/services/api/common/authApi.ts

import axiosInstance from '../../../services/axiosInstance';
import { type ApiResponse, type User, type LoginResponse } from '../../../types';
import { handleApiError, createApiResponse } from './apiUtils';

export const loginUser = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
    
    return createApiResponse(
      true, 
      response.data.data || response.data, 
      response.data.message
    );
  } catch (error: any) {
    console.error('Login error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false, 
      undefined, 
      errorInfo.message, 
      errorInfo.message
    );
  }
};

export const logoutUser = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    return createApiResponse(
      true, 
      response.data.data || response.data, 
      response.data.message
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false, 
      undefined, 
      errorInfo.message, 
      errorInfo.message
    );
  }
};

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return createApiResponse(
      true, 
      response.data.data || response.data, 
      response.data.message
    );
  } catch (error: any) {
    console.error('Get current user error:', error);
    const errorInfo = handleApiError(error);
    
    // Handle network errors specifically
    if (error.code === 'ERR_NETWORK') {
      return createApiResponse(
        false, 
        undefined, 
        'Cannot connect to server. Please check your connection.', 
        'Network error - cannot connect to server'
      );
    }
    
    return createApiResponse(
      false, 
      undefined, 
      errorInfo.message, 
      errorInfo.message
    );
  }
};

// Simple API functions (no error handling wrapper needed)
export const updateUserProfile = async (profileData: Partial<User>) => {
  const response = await axiosInstance.put('/users/profile', profileData);
  return response.data;
};

export const changeUserPassword = async (currentPassword: string, newPassword: string) => {
  const response = await axiosInstance.put('/users/password', { currentPassword, newPassword });
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await axiosInstance.post('/auth/verify-email', { token });
  return response.data;
};

export const refreshToken = async () => {
  const response = await axiosInstance.post('/auth/refresh-token');
  return response.data;
};

export const uploadProfilePicture = async (file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await axiosInstance.post('/users/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return createApiResponse(
      true, 
      response.data.data || response.data, 
      response.data.message || 'Profile picture uploaded successfully!'
    );
  } catch (error: any) {
    console.error('Upload profile picture error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false, 
      undefined, 
      errorInfo.message, 
      errorInfo.message
    );
  }
};

export const deleteProfilePicture = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.delete('/users/profile-picture');
    
    return createApiResponse(
      true, 
      response.data.data || response.data, 
      response.data.message || 'Profile picture deleted successfully!'
    );
  } catch (error: any) {
    console.error('Delete profile picture error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false, 
      undefined, 
      errorInfo.message, 
      errorInfo.message
    );
  }
};

export const getUserActivity = async (userId: string, params = {}): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/activity`, { params });
    
    return createApiResponse(
      true, 
      response.data.data || response.data, 
      response.data.message || 'User activity fetched successfully!'
    );
  } catch (error: any) {
    console.error('Get user activity error:', error);
    const errorInfo = handleApiError(error);
    
    return createApiResponse(
      false, 
      undefined, 
      errorInfo.message, 
      errorInfo.message
    );
  }
};

export const tokenUtils = {
  getToken: (): string | null => localStorage.getItem('userToken'),
  setToken: (token: string): void => localStorage.setItem('userToken', token),
  removeToken: (): void => localStorage.removeItem('userToken'),
  hasToken: (): boolean => !!localStorage.getItem('userToken'),
};