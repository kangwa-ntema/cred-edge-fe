import React from 'react';
import { useAuth } from '../context/authContext';
import PlatformAdminDashboard from './PlatformAdminDashboard/PlatformAdminDashboard';
import TenantDashboard from './TenantDashboard/TenantDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  // Conditionally render based on user role
  if (user.role === 'platform_superadmin' || user.role === 'platform_admin') {
    return <PlatformAdminDashboard />;
  } else if (user.role === 'tenant_superadmin' || user.role === 'tenant_admin' || user.role === 'tenant_employee') {
    return <TenantDashboard />;
  }

  return (
    <div>
      <p>Your role is not recognized. Please contact support.</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default Dashboard;
