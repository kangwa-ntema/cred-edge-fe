// src/services/api/platform/billingPaymentApi.ts

// fe/src/services/api/platform/paymentApi.ts
import axiosInstance from '../../../services/axiosInstance';
import { type ApiResponse } from '../../../types';

export interface ManualPaymentData {
  tenantId: string;
  packageId: string;
  amount: number;
  paymentMethod: string;
  dueDate: string;
  billingPeriod: {
    startDate: string;
    endDate: string;
  };
  notes?: string;
}

export const createManualPayment = async (paymentData: ManualPaymentData): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.post('/platform/payments/manual', paymentData);
    return response.data;
  } catch (error: any) {
    console.error('Create manual payment error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create manual payment'
    };
  }
};

export const getPaymentMethods = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await axiosInstance.get('/platform/payments/methods');
    return response.data;
  } catch (error: any) {
    console.error('Get payment methods error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch payment methods'
    };
  }
};

export const getPayments = async (params = {}): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axiosInstance.get('/platform/payments', { params });
    return response.data;
  } catch (error: any) {
    console.error('Get payments error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch payments'
    };
  }
};

export const getPaymentById = async (paymentId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get(`/platform/payments/${paymentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get payment error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch payment'
    };
  }
};

export const updatePaymentStatus = async (paymentId: string, status: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.put(`/platform/payments/${paymentId}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error('Update payment status error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update payment status'
    };
  }
};

export const deletePayment = async (paymentId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.delete(`/platform/payments/${paymentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete payment error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to delete payment'
    };
  }
};

export const getPaymentStatistics = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get('/platform/payments/statistics');
    return response.data;
  } catch (error: any) {
    console.error('Get payment statistics error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch payment statistics'
    };
  }
};