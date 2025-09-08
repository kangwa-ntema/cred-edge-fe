import axios from "axios";

// Define the shape of the data for creating/updating a package
export interface PackageData {
  name: string;
  description: string;
  price: number;
  period: 'month' | 'year';
  bestFor: string;
  features: string[];
}

// Define the shape of the API response for consistency
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Using a reusable axios instance with the base URL and headers
const api = axios.create({
  baseURL: '', // You should configure this in a .env file or similar
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

/**
 * @desc    Fetch all packages from the API.
 * @access  Public
 * @returns {Promise<ApiResponse<PackageData[]>>}
 */
export const getAllPackages = async (): Promise<ApiResponse<PackageData[]>> => {
  try {
    // Note: This is a public route, so no token is needed.
    const response = await api.get('/api/packages');
    return { success: true, data: response.data.data };
  } catch (error: any) {
    console.error("Error fetching packages:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch packages' };
  }
};

/**
 * @desc    Create a new package.
 * @param   {PackageData} packageData - The data for the new package.
 * @param   {string} token - The user's authentication token.
 * @access  Private (Platform Superadmin)
 * @returns {Promise<ApiResponse<PackageData>>}
 */
export const createPackage = async (packageData: PackageData, token: string): Promise<ApiResponse<PackageData>> => {
  try {
    setAuthHeader(token);
    const response = await api.post("/api/packages", packageData);
    return { success: true, data: response.data.data };
  } catch (error: any) {
    console.error("Error creating package:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to create package' };
  }
};

/**
 * @desc    Update an existing package.
 * @param   {string} packageId - The ID of the package to update.
 * @param   {PackageData} packageData - The updated data for the package.
 * @param   {string} token - The user's authentication token.
 * @access  Private (Platform Superadmin)
 * @returns {Promise<ApiResponse<PackageData>>}
 */
export const updatePackage = async (packageId: string, packageData: Partial<PackageData>, token: string): Promise<ApiResponse<PackageData>> => {
  try {
    setAuthHeader(token);
    const response = await api.put(`/api/packages/${packageId}`, packageData);
    return { success: true, data: response.data.data };
  } catch (error: any) {
    console.error(`Error updating package with ID ${packageId}:`, error);
    return { success: false, error: error.response?.data?.message || "Failed to update package" };
  }
};

/**
 * @desc    Delete a package.
 * @param   {string} packageId - The ID of the package to delete.
 * @param   {string} token - The user's authentication token.
 * @access  Private (Platform Superadmin)
 * @returns {Promise<ApiResponse<{ message: string }>>}
 */
export const deletePackage = async (packageId: string, token: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    setAuthHeader(token);
    const response = await api.delete(`/api/packages/${packageId}`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error(`Error deleting package with ID ${packageId}:`, error);
    return { success: false, error: error.response?.data?.message || "Failed to delete package" };
  }
};
