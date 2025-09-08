import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, loginUser } from '../services/api/authApi';

// Define the shape of the user object
interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  token: string;
  tenant?: {
    _id: string;
    tenantName: string;
  };
}

// Define the shape of the Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Login function now only handles authentication, not navigation
  const login = async (email: string, password: string) => {
    try {
      const { success, data, error } = await loginUser(email, password);
      if (success && data && data.token) {
        localStorage.setItem('userToken', data.token);
        // CRITICAL FIX: Await the fetchCurrentUser call to ensure user data is ready
        await fetchCurrentUser(data.token);
      } else {
        console.error('Login failed:', error);
        throw new Error(error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUser } : null));
  };

  const fetchCurrentUser = async (token: string) => {
    setLoading(true);
    try {
      const { success, data, error } = await getCurrentUser(token);
      if (success && data) {
        setUser({ ...data, token });
      } else {
        console.error('Failed to fetch current user:', error);
        logout();
      }
    } catch (err) {
      console.error('An error occurred while fetching the current user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 