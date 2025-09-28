// fe/src/components/TenantDashboard/TenantDashboard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './TenantDashboard.scss';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <h1 className="dashboardTitle">Tenant Dashboard</h1>
        <button onClick={logout} className="logoutButton">
          Log Out
        </button>
      </div>

      <p className="dashboardSubtitle">
        Welcome, <span className="usernameHighlight">{user?.username}</span>!
        Manage your loan business operations from here.
      </p>

      <div className="dashboardCardGrid">
        {/* User Management */}
        <Link to="/tenant/user-management" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">User Management</h2>
            <p className="cardDescription">
              Manage your tenant users, roles, and permissions.
            </p>
          </div>
        </Link>

        {/* Client Management */}
        <Link to="/tenant/client-management" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">Client Management</h2>
            <p className="cardDescription">
              Create, view, and manage your loan clients and their information.
            </p>
          </div>
        </Link>

        {/* Loan Management */}
        <Link to="/tenant/loans" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">Loan Management</h2>
            <p className="cardDescription">
              Manage loan products, applications, accounts, and disbursements.
            </p>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
          </div>
        </Link>

        {/* Payments and Accounting */}
        <Link to="/tenant/accounting" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">Payments & Accounting</h2>
            <p className="cardDescription">
              Process payments, track transactions, and manage financial records.
            </p>
          </div>
        </Link>

        {/* Reports and Analytics */}
        {/* <Link to="/tenant/reports" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">Reports & Analytics</h2>
            <p className="cardDescription">
              View business insights, loan performance, and financial reports.
            </p>
          </div>
        </Link> */}

        {/* My Settings */}
        <Link to="/settings" className="cardLink">
          <div className="dashboardCard">
            <h2 className="cardTitle">My Settings</h2>
            <p className="cardDescription">
              Edit your personal information and change your password.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TenantDashboard;