import axios from 'axios';

// We'll define a base URL, which you can later configure with environment variables.
// The base URL for your API is now simply the server address.
const API_BASE_URL = 'http://localhost:5000/api'; 

// Create a new Axios instance with a base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Handles user login by sending a POST request to the backend.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} - The response data from the backend.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    // We now use the correct endpoint that matches your backend's routing: /auth/login
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    // We re-throw the error so the component can handle it.
    throw error;
  }
};
