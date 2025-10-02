// fe/src/types/index.ts


// Main type exports
export * from './api';
export * from './auth';
export * from './accounting';
export * from './loans';
export * from './tenants';
export * from './platform';
export * from './common';
export * from './ui';

// Common response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Common pagination
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

