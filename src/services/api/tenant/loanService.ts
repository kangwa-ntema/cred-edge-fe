// fe/src/services/api/tenant/loanService.ts

import axiosInstance from '../../axiosInstance';
import { 
  type LoanProduct, 
  type LoanApplication, 
  type LoanAccount, 
  type PaymentSchedule, 
  type LoanStats,
  type CreateLoanProductData,
  type CreateLoanApplicationData,
  type ApproveLoanApplicationData 
} from '../../../types/loans';

export const loanService = {
  // Loan Products
  getLoanProducts: async (params?: { page?: number; limit?: number; search?: string }): Promise<{ data: LoanProduct[]; pagination: any }> => {
    const response = await axiosInstance.get('/tenant/loans/products', { params });
    return response.data;
  },

  getLoanProduct: async (id: string): Promise<LoanProduct> => {
    const response = await axiosInstance.get(`/tenant/loans/products/${id}`);
    return response.data.data;
  },

  createLoanProduct: async (data: CreateLoanProductData): Promise<LoanProduct> => {
    const response = await axiosInstance.post('/tenant/loans/products', data);
    return response.data.data;
  },

  updateLoanProduct: async (id: string, data: Partial<CreateLoanProductData>): Promise<LoanProduct> => {
    const response = await axiosInstance.put(`/tenant/loans/products/${id}`, data);
    return response.data.data;
  },

  deleteLoanProduct: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tenant/loans/products/${id}`);
  },

  // Loan Applications
  getLoanApplications: async (params?: { page?: number; limit?: number; status?: string }): Promise<{ data: LoanApplication[]; pagination: any }> => {
    const response = await axiosInstance.get('/tenant/loans/applications', { params });
    return response.data;
  },

  getLoanApplication: async (id: string): Promise<LoanApplication> => {
    const response = await axiosInstance.get(`/tenant/loans/applications/${id}`);
    return response.data.data;
  },

  createLoanApplication: async (data: CreateLoanApplicationData): Promise<LoanApplication> => {
    const response = await axiosInstance.post('/tenant/loans/applications', data);
    return response.data.data;
  },

  updateLoanApplication: async (id: string, data: Partial<CreateLoanApplicationData>): Promise<LoanApplication> => {
    const response = await axiosInstance.put(`/tenant/loans/applications/${id}`, data);
    return response.data.data;
  },

  approveLoanApplication: async (id: string, data: ApproveLoanApplicationData): Promise<LoanApplication> => {
    const response = await axiosInstance.post(`/tenant/loans/applications/${id}/approve`, data);
    return response.data.data;
  },

  rejectLoanApplication: async (id: string, rejectionReason: string): Promise<LoanApplication> => {
    const response = await axiosInstance.post(`/tenant/loans/applications/${id}/reject`, { rejectionReason });
    return response.data.data;
  },

  // Loan Accounts
  getLoanAccounts: async (params?: { page?: number; limit?: number; status?: string }): Promise<{ data: LoanAccount[]; pagination: any }> => {
    const response = await axiosInstance.get('/tenant/loans/accounts', { params });
    return response.data;
  },

  getLoanAccount: async (id: string): Promise<LoanAccount> => {
    const response = await axiosInstance.get(`/tenant/loans/accounts/${id}`);
    return response.data.data;
  },

  disburseLoan: async (applicationId: string, disbursementDate: string): Promise<LoanAccount> => {
    const response = await axiosInstance.post('/tenant/loans/accounts/disburse', { applicationId, disbursementDate });
    return response.data.data;
  },

  // Payment Schedules
  getPaymentSchedules: async (loanAccountId: string, params?: { page?: number; limit?: number }): Promise<{ data: PaymentSchedule[]; pagination: any }> => {
    const response = await axiosInstance.get(`/tenant/loans/${loanAccountId}/payments`, { params });
    return response.data;
  },

  processPayment: async (paymentId: string, paidAmount: number, paidDate?: string): Promise<PaymentSchedule> => {
    const response = await axiosInstance.post(`/tenant/loans/payments/${paymentId}/process`, { paidAmount, paidDate });
    return response.data.data;
  },

  generatePaymentSchedule: async (loanAccountId: string): Promise<PaymentSchedule[]> => {
    const response = await axiosInstance.post(`/tenant/loans/${loanAccountId}/generate-schedule`);
    return response.data.data;
  },

  // Dashboard Stats
getLoanStats: async (): Promise<LoanStats> => {
  try {
    console.log('Fetching loan statistics from backend...');
    const response = await axiosInstance.get('/tenant/loans/statistics');
    console.log('Loan stats response:', response.data);
    
    // Handle different response structures
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      // Direct data structure
      return response.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching loan statistics:', error);
    
    // Fallback to mock data if backend is not ready
    console.warn('Using fallback mock data for loan statistics');
    return {
      totalApplications: 0,
      activeLoans: 0,
      pendingPayments: 0,
      overduePayments: 0,
      totalLoanPortfolio: 0,
      recentActivities: []
    };
  }
}
};