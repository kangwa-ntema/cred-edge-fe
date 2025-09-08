import axios from 'axios';

// Use empty string for Vite proxy
const API_URL = '';

// Create an Axios instance with the base URL and headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
 * @desc    Get a list of all tenants.
 * @param   {string} token - The user's authentication token.
 * @returns {Promise<object>} An object containing the response data or an error.
 */
export const getAllTenants = async (token: string) => {
  try {
    setAuthHeader(token);
    const response = await api.get('/api/platform/tenants');
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error fetching tenants:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch tenants.' };
  }
};

/**
 * @desc    Register a new tenant.
 * @param   {string} token - The user's authentication token.
 * @param   {object} tenantData - The data for the new tenant.
 * @returns {Promise<object>} An object containing the response data or an error.
 */
export const registerNewTenant = async (token: string, tenantData: any) => {
  try {
    setAuthHeader(token);
    const response = await api.post('/api/platform/tenants', tenantData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error registering new tenant:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to register tenant.' };
  }
};

/**
 * @desc    Update a tenant's information.
 * @param   {string} token - The user's authentication token.
 * @param   {string} tenantId - The ID of the tenant to update.
 * @param   {object} updateData - The data to update the tenant with.
 * @returns {Promise<object>} An object containing the response data or an error.
 */
export const updateTenant = async (token: string, tenantId: string, updateData: any) => {
  try {
    setAuthHeader(token);
    const response = await api.put(`/api/platform/tenants/${tenantId}`, updateData);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating tenant:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to update tenant.' };
  }
};

/**
 * @desc    Delete a tenant.
 * @param   {string} token - The user's authentication token.
 * @param   {string} tenantId - The ID of the tenant to delete.
 * @returns {Promise<object>} An object containing the response data or an error.
 */
export const deleteTenant = async (token: string, tenantId: string) => {
  try {
    setAuthHeader(token);
    const response = await api.delete(`/api/platform/tenants/${tenantId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error deleting tenant:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to delete tenant.' };
  }
};
