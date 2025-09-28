// fe/src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const IS_DEVELOPMENT = import.meta.env.MODE === 'development';