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

export const updateUserProfile = async (token: string, profileData: any) => {
  try {
    setAuthHeader(token);
    // CORRECT: Remove duplicate /api prefix
    const response = await api.put("/api/users/profile", profileData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.response?.data?.message || "Failed to update profile" };
  }
};

export const changeUserPassword = async (token: string, passwordData: any) => {
  try {
    setAuthHeader(token);
    // CORRECT: Remove duplicate /api prefix
    const response = await api.put("/api/users/password", passwordData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error changing password:", error);
    return { success: false, error: error.response?.data?.message || "Failed to change password" };
  }
};