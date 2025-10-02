// fe/src/services/axiosInstance.ts
import axios from 'axios';
import { API_CONFIG, isMobileDebug } from '../config/api';

const axiosInstance = axios.create(API_CONFIG);

// Enhanced request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add environment context
    config.headers['X-Environment'] = import.meta.env.MODE;
    config.headers['X-Request-ID'] = Date.now().toString();
    
    // Log for mobile debugging
    if (isMobileDebug()) {
      console.log('🔄 API Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL
      });
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful mobile requests
    if (isMobileDebug()) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('🚨 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      environment: import.meta.env.MODE
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;