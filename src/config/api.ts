// fe/src/config/api.ts

// Environment detection
export const IS_DEVELOPMENT = import.meta.env.DEV;
export const IS_PRODUCTION = import.meta.env.PROD;
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Smart API configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
} as const;

// Helper to check if we're in mobile debug mode
export const isMobileDebug = () => {
  return IS_DEVELOPMENT && API_BASE_URL?.includes('://10.211.109.96');
};