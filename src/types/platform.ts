// fe/src/types/platform.ts

export interface PackageData {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  bestFor: string;
  monthlyPrice: number;
  annualPrice: number;
  features: {
    name: string;
    description?: string;
    included: boolean;
  }[];
  limits: {
    maxClients: number;
    maxLoans: number;
    maxUsers: number;
    storageGB: number;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackagePerformance {
  _id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  tenantCount: number;
  activeTenants: number;
  totalRevenue: number;
  paymentCount: number;
  avgRevenuePerTenant: number;
  growthPercentage: number;
}

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