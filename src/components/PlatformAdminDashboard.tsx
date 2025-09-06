import React from 'react';
import { useAuth } from '../context/authContext';

const PlatformAdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboardContainer">
      <h1 className="dashboardHeading">Welcome, Platform Admin!</h1>
      <p>This is your platform administration dashboard.</p>
      <p>Your role: {user.role}</p>
      <button onClick={logout} className="logoutButton">Log Out</button>
    </div>
  );
};

export default PlatformAdminDashboard;
