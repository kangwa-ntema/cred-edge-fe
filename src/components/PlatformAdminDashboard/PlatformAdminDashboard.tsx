import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './PlatformAdminDashboard.scss';

const PlatformAdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <h1 className="dashboardTitle">Platform Admin Dashboard</h1>
        <button
          onClick={logout}
          className="logoutButton"
        >
          Log Out
        </button>
      </div>

      <p className="dashboardSubtitle">
        Welcome, <span className="usernameHighlight">{user?.username}</span>! From here, you can manage different aspects of the platform.
      </p>

      <div className="dashboardCardGrid">
        <Link to="/platform/user-management" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">User Management</h2>
            <p className="cardDescription">Create, view, and manage platform-level users.</p>
          </div>
        </Link>

        <Link to="/platform/package-management" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">Package Management</h2>
            <p className="cardDescription">Define and manage subscription packages for tenants.</p>
          </div>
        </Link>

        <Link to="/platform/tenant-management" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">Tenant Management</h2>
            <p className="cardDescription">Manage tenants and their subscription status.</p>
          </div>
        </Link>
        
        {/* NEW: Link to the user settings page */}
        <Link to="/settings" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">My Settings</h2>
            <p className="cardDescription">Edit your personal information and change your password.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
