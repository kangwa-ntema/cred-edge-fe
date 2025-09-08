import axios from 'axios';

// Use empty string for Vite proxy
const API_URL = '';

// Create a new Axios instance with a base URL.
const api = axios.create({
  baseURL: API_URL,
});

console.log('AUTH API - Base URL:', api.defaults.baseURL);

/**
 * A helper function to add the authorization token to the request headers.
 */
const setAuthHeader = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * @desc    Logs in a user and returns a token.
 * @param   {string} email - User's email address.
 * @param   {string} password - User's password.
 * @returns {Promise<object>} An object containing the response data or an error.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Login failed:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to login. Please check your credentials.' };
  }
};

/**
 * @desc    Fetches the current user's details from the server using their token.
 * @param   {string} token - The user's authentication token.
 * @returns {Promise<object>} An object containing the current user's data or an error.
 */
export const getCurrentUser = async (token: string) => {
  try {
    setAuthHeader(token);
    const response = await api.get('/api/auth/current-user');
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Failed to fetch current user:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch current user.' };
  }
};

/**
 * @desc    Requests a password reset token.
 * @param   {string} email - The email to send the reset link to.
 * @returns {Promise<object>} An object with the status of the request.
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Forgot password failed:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to send password reset email.' };
  }
};

/**
 * @desc    Resets the user's password using a token.
 * @param   {string} resetToken - The password reset token from the URL.
 * @param   {string} newPassword - The new password.
 * @returns {Promise<object>} An object with the status of the password reset.
 */
export const resetPassword = async (resetToken: string, newPassword: string, token: string) => {
  try {
    setAuthHeader(token);
    const response = await api.put(`/api/auth/reset-password/${resetToken}`, { newPassword });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Password reset failed:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to reset password.' };
  }
};