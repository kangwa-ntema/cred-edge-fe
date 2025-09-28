// fe/src/services/api/common/systemApi.ts

import axiosInstance from '../../../services/axiosInstance';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  components: {
    database: { status: string; responseTime: number };
    api: { status: string; responseTime: number };
    cache: { status: string; responseTime: number };
    storage: { status: string; responseTime: number };
  };
}

export interface PerformanceMetrics {
  cpu: { usage: number; cores: number };
  memory: { total: number; used: number; free: number };
  uptime: number;
  responseTimes: { p50: number; p95: number; p99: number };
  requests: { total: number; perSecond: number };
}

export interface DatabaseStats {
  totalDocuments: number;
  collections: number;
  storageSize: number;
  indexes: number;
  connections: { current: number; available: number };
}

export interface ServerInfo {
  nodeVersion: string;
  platform: string;
  arch: string;
  uptime: number;
  environment: string;
}

export const getSystemHealth = async () => {
  const response = await axiosInstance.get('/platform/system/health');
  return response.data;
};

export const getPerformanceMetrics = async () => {
  const response = await axiosInstance.get('/platform/system/metrics');
  return response.data;
};

export const getDatabaseStats = async () => {
  const response = await axiosInstance.get('/platform/system/database-stats');
  return response.data;
};

export const getServerInfo = async () => {
  const response = await axiosInstance.get('/platform/system/server-info');
  return response.data;
};

export const runDiagnostics = async () => {
  const response = await axiosInstance.post('/platform/system/diagnostics');
  return response.data;
};

export const clearCache = async (cacheType?: string) => {
  const response = await axiosInstance.post('/platform/system/clear-cache', { cacheType });
  return response.data;
};

export const restartService = async (service: string) => {
  const response = await axiosInstance.post('/platform/system/restart', { service });
  return response.data;
};

export default {
  getSystemHealth,
  getPerformanceMetrics,
  getDatabaseStats,
  getServerInfo,
  runDiagnostics,
  clearCache,
  restartService
};