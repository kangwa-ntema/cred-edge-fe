// src/services/api/common/reportApi.ts

import axiosInstance from '../../../services/axiosInstance';

// ========== PLATFORM REPORTS ==========

export const getPlatformTenantTrialBalance = async (tenantId: string, params = {}) => {
  const response = await axiosInstance.get(`/platform/reports/tenants/${tenantId}/trial-balance`, { params });
  return response.data;
};

export const getPlatformTenantIncomeStatement = async (tenantId: string, params = {}) => {
  const response = await axiosInstance.get(`/platform/reports/tenants/${tenantId}/income-statement`, { params });
  return response.data;
};

export const getPlatformTenantBalanceSheet = async (tenantId: string, params = {}) => {
  const response = await axiosInstance.get(`/platform/reports/tenants/${tenantId}/balance-sheet`, { params });
  return response.data;
};

// ========== TENANT REPORTS ==========

export const getTenantTrialBalance = async (params = {}) => {
  const response = await axiosInstance.get('/tenant/reports/trial-balance', { params });
  return response.data;
};

export const getTenantIncomeStatement = async (params = {}) => {
  const response = await axiosInstance.get('/tenant/reports/income-statement', { params });
  return response.data;
};

export const getTenantBalanceSheet = async (params = {}) => {
  const response = await axiosInstance.get('/tenant/reports/balance-sheet', { params });
  return response.data;
};

export const generateCustomReport = async (reportType: string, params = {}) => {
  const response = await axiosInstance.get(`/tenant/reports/${reportType}`, { params });
  return response.data;
};

export const exportReport = async (reportType: string, format = 'csv', params = {}) => {
  const response = await axiosInstance.get(`/tenant/reports/${reportType}/export`, {
    params: { format, ...params },
    responseType: 'blob'
  });
  return response.data;
};

export const getReportTemplates = async () => {
  const response = await axiosInstance.get('/tenant/reports/templates');
  return response.data;
};

export const saveReportConfig = async (configData: any) => {
  const response = await axiosInstance.post('/tenant/reports/config', configData);
  return response.data;
};

export default {
  getPlatformTenantTrialBalance,
  getPlatformTenantIncomeStatement,
  getPlatformTenantBalanceSheet,
  getTenantTrialBalance,
  getTenantIncomeStatement,
  getTenantBalanceSheet,
  generateCustomReport,
  exportReport,
  getReportTemplates,
  saveReportConfig,
};