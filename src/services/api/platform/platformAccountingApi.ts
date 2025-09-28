// fe/src/services/api/platform/platformAccountingApi.ts

import axiosInstance from '../../axiosInstance';
import { type ApiResponse } from '../../../types';
import {
  type ChartOfAccount,
  type JournalEntry,
  type GeneralLedgerEntry,
  type TrialBalance,
  type FinancialStatement,
  type RevenueReport,
  type TenantPaymentStatus,
  type PackagePerformance
} from '../../../types/accounting';

// Helper function for consistent response handling
const handleApiResponse = (response: any): ApiResponse<any> => {
  // If response has nested data structure
  if (response.data && response.data.data !== undefined) {
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message
    };
  }
  
  // If data is directly in response
  return {
    success: response.data.success,
    data: response.data,
    message: response.data.message
  };
};

// Chart of Accounts API
export const getChartOfAccounts = async (): Promise<ApiResponse<ChartOfAccount[]>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/coa');
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get chart of accounts error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch chart of accounts'
    };
  }
};

// Journal Entries API
export const getJournalEntries = async (params = {}): Promise<ApiResponse<{ entries: JournalEntry[]; total: number }>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/journal', { params });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get journal entries error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch journal entries'
    };
  }
};

// General Ledger API
export const getGeneralLedger = async (params = {}): Promise<ApiResponse<{ entries: GeneralLedgerEntry[]; total: number }>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/ledger', { params });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get general ledger error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch general ledger'
    };
  }
};

// Trial Balance API
export const getTrialBalance = async (asOfDate?: string): Promise<ApiResponse<TrialBalance>> => {
  try {
    const params = asOfDate ? { asOfDate } : {};
    const response = await axiosInstance.get('/platform/accounting/trial-balance', { params });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get trial balance error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch trial balance'
    };
  }
};

// Income Statement API
export const getIncomeStatement = async (startDate: string, endDate: string): Promise<ApiResponse<FinancialStatement>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/income-statement', {
      params: { startDate, endDate }
    });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get income statement error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch income statement'
    };
  }
};

// Balance Sheet API
export const getBalanceSheet = async (asOfDate?: string): Promise<ApiResponse<FinancialStatement>> => {
  try {
    const params = asOfDate ? { asOfDate } : {};
    const response = await axiosInstance.get('/platform/accounting/balance-sheet', { params });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get balance sheet error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch balance sheet'
    };
  }
};

// Platform Revenue Report
export const getPlatformRevenueReport = async (startDate: string, endDate: string): Promise<ApiResponse<RevenueReport>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/revenue-report', {
      params: { startDate, endDate }
    });
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get revenue report error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch revenue report'
    };
  }
};

// Tenant Payment Status - FIXED VERSION
export const getTenantPaymentStatus = async (): Promise<ApiResponse<TenantPaymentStatus[]>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/tenant-payments');
    return {
      success: response.data.success,
      data: response.data.data, // Access the nested data array
      message: response.data.message
    };
  } catch (error: any) {
    console.error('Get tenant payments error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch tenant payments'
    };
  }
};

// Platform Financial Summary - FIXED VERSION
export const getPlatformFinancialSummary = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/financial-summary');
    return {
      success: response.data.success,
      data: response.data, // Data is directly in response.data
      message: response.data.message
    };
  } catch (error: any) {
    console.error('Get financial summary error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch financial summary'
    };
  }
};

// Package Performance
export const getPackagePerformance = async (): Promise<ApiResponse<PackagePerformance[]>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/package-performance');
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get package performance error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch package performance'
    };
  }
};

// Create Journal Entry
export const createJournalEntry = async (entryData: Partial<JournalEntry>): Promise<ApiResponse<JournalEntry>> => {
  try {
    const response = await axiosInstance.post('/platform/accounting/journal', entryData);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Create journal entry error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create journal entry'
    };
  }
};

// Post Journal Entry
export const postJournalEntry = async (entryId: string): Promise<ApiResponse<JournalEntry>> => {
  try {
    const response = await axiosInstance.post(`/platform/accounting/journal/${entryId}/post`);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Post journal entry error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to post journal entry'
    };
  }
};

// Get Accounting Periods
export const getAccountingPeriods = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await axiosInstance.get('/platform/accounting/periods');
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Get accounting periods error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch accounting periods'
    };
  }
};

// Close Accounting Period
export const closeAccountingPeriod = async (periodId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.post(`/platform/accounting/periods/${periodId}/close`);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Close accounting period error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to close accounting period'
    };
  }
};


// fe/src/services/api/platform/platformAccountingApi.ts
// Add these CRUD functions to your existing API file



export const updateJournalEntry = async (entryId: string, entryData: any): Promise<ApiResponse<JournalEntry>> => {
  try {
    const response = await axiosInstance.put(`/platform/accounting/journal/${entryId}`, entryData);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Update journal entry error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update journal entry'
    };
  }
};

export const deleteJournalEntry = async (entryId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete(`/platform/accounting/journal/${entryId}`);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Delete journal entry error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to delete journal entry'
    };
  }
};



// COA Account CRUD
export const createCOAAccount = async (accountData: any): Promise<ApiResponse<ChartOfAccount>> => {
  try {
    const response = await axiosInstance.post('/platform/accounting/coa', accountData);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Create COA account error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create account'
    };
  }
};

export const updateCOAAccount = async (accountId: string, accountData: any): Promise<ApiResponse<ChartOfAccount>> => {
  try {
    const response = await axiosInstance.put(`/platform/accounting/coa/${accountId}`, accountData);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Update COA account error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update account'
    };
  }
};

export const deleteCOAAccount = async (accountId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete(`/platform/accounting/coa/${accountId}`);
    return handleApiResponse(response);
  } catch (error: any) {
    console.error('Delete COA account error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to delete account'
    };
  }
};