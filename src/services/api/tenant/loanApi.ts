// src/services/api/tenant/loanApi.ts

import axiosInstance from '../../../services/axiosInstance';

// ========== LOAN PRODUCTS ==========

export const getLoanProducts = async (params = {}) => {
  const response = await axiosInstance.get('/tenant/loan-products', { params });
  return response.data;
};

export const getLoanProductById = async (productId: string) => {
  const response = await axiosInstance.get(`/tenant/loan-products/${productId}`);
  return response.data;
};

export const createLoanProduct = async (productData: any) => {
  const response = await axiosInstance.post('/tenant/loan-products', productData);
  return response.data;
};

export const updateLoanProduct = async (productId: string, productData: any) => {
  const response = await axiosInstance.put(`/tenant/loan-products/${productId}`, productData);
  return response.data;
};

export const deleteLoanProduct = async (productId: string) => {
  const response = await axiosInstance.delete(`/tenant/loan-products/${productId}`);
  return response.data;
};

// ========== LOAN APPLICATIONS ==========

export const getLoanApplications = async (params = {}) => {
  const response = await axiosInstance.get('/api/tenant/loan-applications', { params });
  return response.data;
};

export const getLoanApplicationById = async (applicationId: string) => {
  const response = await axiosInstance.get(`/api/tenant/loan-applications/${applicationId}`);
  return response.data;
};

export const createLoanApplication = async (applicationData: any) => {
  const response = await axiosInstance.post('/api/tenant/loan-applications', applicationData);
  return response.data;
};

export const updateLoanApplication = async (applicationId: string, applicationData: any) => {
  const response = await axiosInstance.put(`/api/tenant/loan-applications/${applicationId}`, applicationData);
  return response.data;
};

export const approveLoanApplication = async (applicationId: string, approvalData: any) => {
  const response = await axiosInstance.post(`/api/tenant/loan-applications/${applicationId}/approve`, approvalData);
  return response.data;
};

export const rejectLoanApplication = async (applicationId: string, rejectionData: any) => {
  const response = await axiosInstance.post(`/api/tenant/loan-applications/${applicationId}/reject`, rejectionData);
  return response.data;
};

// ========== LOAN ACCOUNTS ==========

export const getLoanAccounts = async (params = {}) => {
  const response = await axiosInstance.get('/api/tenant/loan-accounts', { params });
  return response.data;
};

export const getLoanAccountById = async (accountId: string) => {
  const response = await axiosInstance.get(`/api/tenant/loan-accounts/${accountId}`);
  return response.data;
};

export const disburseLoan = async (disbursementData: any) => {
  const response = await axiosInstance.post('/api/tenant/loan-accounts/disburse', disbursementData);
  return response.data;
};

export const updateLoanAccount = async (accountId: string, accountData: any) => {
  const response = await axiosInstance.put(`/api/tenant/loan-accounts/${accountId}`, accountData);
  return response.data;
};

export const closeLoanAccount = async (accountId: string, closureData: any) => {
  const response = await axiosInstance.post(`api/tenant/loan-accounts/${accountId}/close`, closureData);
  return response.data;
};

// ========== PAYMENT SCHEDULES ==========

export const getPaymentSchedules = async (loanAccountId: string, params = {}) => {
  const response = await axiosInstance.get(`/tenant/loan-accounts/${loanAccountId}/payment-schedules`, { params });
  return response.data;
};

export const getPaymentScheduleById = async (paymentId: string) => {
  const response = await axiosInstance.get(`/tenant/payment-schedules/${paymentId}`);
  return response.data;
};

export const processPayment = async (paymentId: string, paymentData: any) => {
  const response = await axiosInstance.post(`/tenant/payment-schedules/${paymentId}/process`, paymentData);
  return response.data;
};

export const generatePaymentSchedule = async (loanAccountId: string) => {
  const response = await axiosInstance.post(`/tenant/loan-accounts/${loanAccountId}/generate-schedule`);
  return response.data;
};

export const getLoanStatistics = async () => {
  const response = await axiosInstance.get('/tenant/loans/statistics');
  return response.data;
};

export const getLoanApplicationsByClientId = async (clientId: string, params = {}) => {
  const response = await axiosInstance.get('/tenant/loan-applications', { params: { clientId, ...params } });
  return response.data;
};

export const getLoanAccountsByClientId = async (clientId: string, params = {}) => {
  const response = await axiosInstance.get('/tenant/loan-accounts', { params: { clientId, ...params } });
  return response.data;
};

export default {
  getLoanProducts,
  getLoanProductById,
  createLoanProduct,
  updateLoanProduct,
  deleteLoanProduct,
  getLoanApplications,
  getLoanApplicationById,
  createLoanApplication,
  updateLoanApplication,
  approveLoanApplication,
  rejectLoanApplication,
  getLoanAccounts,
  getLoanAccountById,
  disburseLoan,
  updateLoanAccount,
  closeLoanAccount,
  getPaymentSchedules,
  getPaymentScheduleById,
  processPayment,
  generatePaymentSchedule,
  getLoanStatistics,
  getLoanApplicationsByClientId,
  getLoanAccountsByClientId,
};