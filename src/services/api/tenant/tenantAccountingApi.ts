// fe/src/services/api/tenant/tenantAccountingApi.ts

import axiosInstance from '../../../services/axiosInstance';
import { type ApiResponse } from '../../../types';

// A generic function to handle common API errors and return a consistent ApiResponse
const handleApiError = (error: any): ApiResponse<any> => {
  if (error.code === 'ERR_NETWORK') {
    return {
      success: false,
      error: 'Network error - cannot connect to server',
      message: 'Cannot connect to server. Please check your connection.',
    };
  }
  const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       'An unexpected error occurred. Please try again.';
  return {
    success: false,
    error: errorMessage,
    message: errorMessage,
  };
};

// ========== JOURNAL ENTRIES ==========

export const getJournalEntries = async (params = {}): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get('/tenant/accounting/journal-entries', { params });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Journal entries fetched successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const createJournalEntry = async (journalData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.post('/tenant/accounting/journal-entries', journalData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Journal entry created successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const postJournalEntry = async (journalId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.post(`/tenant/accounting/journal-entries/${journalId}/post`);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Journal entry posted successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getJournalEntryById = async (journalId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get(`/tenant/accounting/journal-entries/${journalId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Journal entry fetched successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const updateJournalEntry = async (journalId: string, journalData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.put(`/tenant/accounting/journal-entries/${journalId}`, journalData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Journal entry updated successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const deleteJournalEntry = async (journalId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.delete(`/tenant/accounting/journal-entries/${journalId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Journal entry deleted successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ========== CHART OF ACCOUNTS ==========

export const getChartOfAccounts = async (params = {}): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get('/tenant/accounting/coa', { params });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Chart of accounts fetched successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const createCOAAccount = async (accountData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.post('/tenant/accounting/coa', accountData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Account created successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const getCOAAccountById = async (accountId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get(`/tenant/accounting/coa/${accountId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Account fetched successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const updateCOAAccount = async (accountId: string, accountData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.put(`/tenant/accounting/coa/${accountId}`, accountData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Account updated successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const deleteCOAAccount = async (accountId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.delete(`/tenant/accounting/coa/${accountId}`);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Account deleted successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ========== ACCOUNTS RECEIVABLE ==========

export const getAccountsReceivable = async (params = {}): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get('/tenant/accounting/ar', { params });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Accounts receivable fetched successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ========== ACCOUNTS PAYABLE ==========

export const getAccountsPayable = async (params = {}): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get('/tenant/accounting/ap', { params });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Accounts payable fetched successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};

// ========== REVENUE RECOGNITION ==========

export const getRevenueRecognitions = async (params = {}): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get('/tenant/accounting/revenue-recognition', { params });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Revenue recognitions fetched successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};


// Financial Statements
export const getFinancialStatement = async (type: string, params = {}): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get(`/tenant/accounting/financial-statements/${type}`, { params });
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Financial statement fetched successfully!',
    };
  } catch (error: any) {
    return handleApiError(error);
  }
};