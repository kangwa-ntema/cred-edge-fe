// fe/src/services/api/common/apiUtils.ts

import { type ApiResponse } from '../../../types';

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export const handleApiResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }
  
  return {
    data: data.data || data,
    message: data.message,
    success: data.success !== false
  }
}

export const handleApiError = (error: any) => {
  console.error("Full API Error:", error);
  
  // Check for validation errors with details
  if (error.response?.status === 422) {
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      return {
        message: error.response.data.errors.join(', ')
      };
    }
    return {
      message: error.response?.data?.message || 'Validation failed'
    };
  }
  
  if (error.response?.data?.message) {
    return { message: error.response.data.message };
  }
  
  return { message: error.message || 'An unexpected error occurred' };
};

export const standardizeApiResponse = <T>(response: any): ApiResponse<T> => {
  // Handle different response structures consistently
  if (response.data && typeof response.data === 'object') {
    return {
      success: response.data.success ?? true,
      data: response.data.data ?? response.data,
      message: response.data.message,
      error: response.data.error
    };
  }
  
  return {
    success: true,
    data: response.data,
    message: 'Operation completed successfully'
  };
};

export const createApiResponse = <T>(
  success: boolean, 
  data?: T, 
  message?: string, 
  error?: string
): ApiResponse<T> => ({
  success,
  data,
  message,
  error
});

// Unified API call wrapper
export const apiCall = async <T>(
  apiFunction: () => Promise<any>,
  successMessage?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiFunction();
    return createApiResponse(
      true,
      response.data?.data ?? response.data,
      successMessage || response.data?.message
    );
  } catch (error: any) {
    const errorInfo = handleApiError(error);
    return createApiResponse(false, undefined, errorInfo.message, errorInfo.message);
  }
};


