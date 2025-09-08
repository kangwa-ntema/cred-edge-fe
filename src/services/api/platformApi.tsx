import axios from "axios";

// CORRECT: Use base URL without /api
const API_URL = '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthHeader = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAllPlatformUsers = async (token: string) => {
  try {
    setAuthHeader(token);
    // CORRECT: Remove duplicate /api prefix
    const response = await api.get('/api/platform/users');
    console.log('Raw API Response:', response.data);
    
    if (response.data && response.data.success && response.data.data) {
      return { success: true, data: response.data.data };
    } else {
      return { success: true, data: response.data };
    }
  } catch (error: any) {
    console.error("Error fetching platform users:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch users' };
  }
};

// Update all other functions similarly by removing the duplicate /api prefix
export const getPlatformUserById = async (userId: string, token: string) => {
  try {
    setAuthHeader(token);
    const response = await api.get(`/api/platform/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch user",
    };
  }
};

export const createPlatformUser = async (userData: any, token: string) => {
  try {
    setAuthHeader(token);
    const response = await api.post("/api/platform/users", userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error creating platform user:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create user",
    };
  }
};

export const updatePlatformUser = async (userId: string, userData: any, token: string) => {
  try {
    setAuthHeader(token);
    const response = await api.put(`/api/platform/users/${userId}`, userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Error updating user with ID ${userId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update user",
    };
  }
};

export const deletePlatformUser = async (userId: string, token: string) => {
  try {
    setAuthHeader(token);
    const response = await api.delete(`/api/platform/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete user",
    };
  }
};