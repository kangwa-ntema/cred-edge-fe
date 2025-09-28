import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, getCurrentUser } from '../services/index.ts';
import { type User, type ApiResponse, type LoginResponse } from '../types/index.ts';

// Extend the User interface to include the token
interface AuthUser extends User {
  token: string;
}

// Define the hierarchy for client-side role validation
const roleHierarchy: Record<string, string[]> = {
  'platform_superadmin': ['platform_superadmin', 'platform_admin', 'tenant_superadmin', 'admin', 'employee'],
  'platform_admin': ['platform_admin', 'tenant_superadmin', 'admin', 'employee'],
  'platform_employee': ['platform_employee'],
  'tenant_superadmin': ['tenant_superadmin', 'admin', 'employee'],
  'admin': ['admin', 'employee'],
  'employee': ['employee']
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean; // Add this
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  hasRole: (requiredRoles: string | string[]) => boolean;
  isPlatformSuperadmin: () => boolean;
  isTenantAdminOrSuperadmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Add isAuthenticated computed property
  const isAuthenticated = !!user;

  const isPlatformSuperadmin = (): boolean => {
    return user?.role === 'platform_superadmin';
  };

  const isTenantAdminOrSuperadmin = (): boolean => {
    return user?.role === 'tenant_superadmin' || user?.role === 'admin';
  };

  // New hasRole function to check if the current user has permission
  const hasRole = (requiredRoles: string | string[]): boolean => {
    if (!user) {
      return false;
    }
    const userRole = user.role;
    const userAllowedRoles = roleHierarchy[userRole] || [];
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    return rolesArray.some(role => userAllowedRoles.includes(role));
  };
  
  const login = async (email: string, password: string) => {
    try {
      const response: ApiResponse<LoginResponse> = await loginUser(email, password);
      
      if (response.success && response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        setUser({ ...response.data.user, token: response.data.token }); 
      } else {
        console.error('Login failed:', response.error);
        throw new Error(response.error || 'Login failed');
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
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...updatedUser };
    });
  };

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        logout();
        return;
      }
      
      const response: ApiResponse<User> = await getCurrentUser();
      if (response.success && response.data) {
        setUser({ ...response.data, token });
      } else {
        console.error('Failed to fetch current user:', response.error);
        logout();
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated, // Add this to the context value
    login,
    logout,
    updateUser,
    hasRole,
    isPlatformSuperadmin,
    isTenantAdminOrSuperadmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};