// fe/src/types/system.ts

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  services: Array<{
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
  }>;
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeUsers: number;
  requestCount: number;
  errorRate: number;
  timestamp: string;
}

export interface DatabaseStats {
  totalCollections: number;
  totalDocuments: number;
  databaseSize: number;
  indexCount: number;
  connectionCount: number;
}

export interface ServerInfo {
  nodeVersion: string;
  platform: string;
  arch: string;
  uptime: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}