// fe/src/components/TenantDashboard/TenantDashboard.tsx

import React from 'react';
import { useAuth } from '../../context/authContext';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="dashboardContainer">
      <h1 className="dashboardHeading">Welcome, {user.username}!</h1>
      <p>This is your tenant dashboard.</p>
      <p>Your role: {user.role}</p>
      <button onClick={logout} className="logoutButton">Log Out</button>
    </div>
  );
};

export default TenantDashboard;
