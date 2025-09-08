import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import LoginForm from './components/auth/LoginForm';

// Import dashboard components for each role
import PlatformDashboard from './components/PlatformAdminDashboard/PlatformAdminDashboard';
import TenantDashboard from './components/TenantDashboard/TenantDashboard';

// NEW: Import the PlatformUserManagement component
import PlatformUserManagement from './components/PlatformAdminDashboard/PlatformUserManagement/PlatformUserManagement';

// NEW: Import the SettingsPage component
import SettingsPage from './components/common/SettingsPage';

// NEW: Import the PackagesPage component
import PackageManagement from './components/PlatformAdminDashboard/PackageManagement/PackageManagement';

// NEW: Import the new Tenant Management component
import PlatformTenantManagement from './components/PlatformAdminDashboard/TenantManagement/PlatformTenantManagement';

// The single, centralized route guard and redirection handler
const ProtectedRoute = ({ children, roles }: { children: JSX.Element, roles: string[] }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run this effect after authentication status has been determined
    if (!loading) {
      if (!user) {
        // Case 1: No user, redirect to login
        navigate('/login');
      } else if (roles && !roles.includes(user.role)) {
        // Case 2: User is logged in but not authorized for this specific page.
        // Redirect them to their appropriate default dashboard.
        console.warn(`Access denied for role: ${user.role} on this page.`);
        if (user.role.startsWith('platform')) {
          navigate('/platform/dashboard');
        } else if (user.role.startsWith('tenant')) {
          navigate('/tenant/dashboard');
        } else {
          // Fallback for unexpected roles
          navigate('/login');
        }
      }
    }
  }, [user, loading, roles, navigate]);

  // Show a loading indicator while auth status is being determined.
  // We check for `user` here to prevent rendering a protected page's content
  // before the user is confirmed.
  if (loading || !user || (roles && !roles.includes(user.role))) {
    return <div>Loading...</div>; 
  }

  // If the user is authenticated and authorized, render the children
  return children;
};

// This new component handles the initial redirection from the root path.
// It must be rendered inside the <Router> to use the navigate hook.
const RootRedirector = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role.startsWith('platform')) {
          navigate('/platform/dashboard', { replace: true });
        } else if (user.role.startsWith('tenant')) {
          navigate('/tenant/dashboard', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);
  
  return <div>Loading...</div>;
};

// Main App Component with routing
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Root route now uses the new redirector component */}
          <Route path="/" element={<RootRedirector />} />
          
          {/* Main dashboard routes are now directly protected */}
          <Route 
            path="/platform/dashboard" 
            element={
              <ProtectedRoute roles={['platform_superadmin', 'platform_admin', 'platform_employee']}>
                <PlatformDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected route for Platform User Management */}
          <Route 
            path="/platform/user-management" 
            element={
              <ProtectedRoute roles={['platform_superadmin', 'platform_admin']}>
                <PlatformUserManagement />
              </ProtectedRoute>
            } 
          />

          {/* Protected route for Package Management */}
          <Route 
            path="/platform/package-management" 
            element={
              <ProtectedRoute roles={['platform_superadmin', 'platform_admin']}>
                <PackageManagement />
              </ProtectedRoute>
            } 
          />

          {/* NEW: Protected route for Tenant Management */}
          <Route 
            path="/platform/tenant-management" 
            element={
              <ProtectedRoute roles={['platform_superadmin']}>
                <PlatformTenantManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tenant/dashboard" 
            element={
              <ProtectedRoute roles={['tenant_superadmin', 'tenant_admin', 'tenant_employee']}>
                <TenantDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected route for the Settings Page, accessible by all user roles */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute 
                roles={[
                  'platform_superadmin', 
                  'platform_admin', 
                  'platform_employee', 
                  'tenant_superadmin', 
                  'tenant_admin', 
                  'tenant_employee'
                ]}
              >
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Add a catch-all for unknown routes */}
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
