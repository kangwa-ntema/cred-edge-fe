import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import { loanService } from '../../../services/api/tenant/loanService';
import { type LoanStats } from '../../../types/loans';
import { 
  FaFileAlt, 
  FaMoneyCheckAlt, 
  FaClock, 
  FaExclamationTriangle,
  FaPlus,
  FaBox,
  FaList,
  FaWallet
} from 'react-icons/fa';
import styles from './LoanManagementDashboard.module.scss';

const LoanManagementDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<LoanStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await loanService.getLoanStats();
        setStats(statsData);
      } catch (err) {
        setError('Failed to load loan statistics');
        console.error('Error fetching loan stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loanManagementHeader}>
          <div className={`${styles.loanManagementTitle} ${styles.skeleton}`}></div>
          <div className={`${styles.loanManagementSubtitle} ${styles.skeleton}`}></div>
        </div>
        <div className={styles.statsGrid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${styles.statCard} ${styles.skeleton}`}>
              <div className={styles.statCardContent}>
                <div className={styles.statIconContainer}></div>
                <div className={styles.statInfo}>
                  <div className={styles.statLabel}></div>
                  <div className={styles.statValue}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.loanManagementContainer}>
      {/* Header */}
      <div className={styles.loanManagementHeader}>
        <h1 className={styles.loanManagementTitle}>Loan Management</h1>
        <p className={styles.loanManagementSubtitle}>Manage loans, applications, and payments</p>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div className={`${styles.statIconContainer} ${styles.applications}`}>
              <FaFileAlt className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Total Applications</p>
              <p className={styles.statValue}>{stats?.totalApplications || 0}</p>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div className={`${styles.statIconContainer} ${styles.activeLoans}`}>
              <FaMoneyCheckAlt className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Active Loans</p>
              <p className={styles.statValue}>{stats?.activeLoans || 0}</p>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div className={`${styles.statIconContainer} ${styles.pendingPayments}`}>
              <FaClock className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Pending Payments</p>
              <p className={styles.statValue}>{stats?.pendingPayments || 0}</p>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div className={`${styles.statIconContainer} ${styles.overdue}`}>
              <FaExclamationTriangle className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Overdue</p>
              <p className={styles.statValue}>{stats?.overduePayments || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className={styles.dashboardGrid}>
        {/* Quick Actions */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>
          <div className={styles.actionsGrid}>
            <Link to="/tenant/loans/applications/new" className={styles.actionLink}>
              <div className={`${styles.actionIconContainer} ${styles.newApplication}`}>
                <FaPlus className={styles.actionIcon} />
              </div>
              <div className={styles.actionText}>
                <p className={styles.actionTitle}>New Application</p>
                <p className={styles.actionDescription}>Create loan application</p>
              </div>
            </Link>

            <Link to="/tenant/loans/products" className={styles.actionLink}>
              <div className={`${styles.actionIconContainer} ${styles.loanProducts}`}>
                <FaBox className={styles.actionIcon} />
              </div>
              <div className={styles.actionText}>
                <p className={styles.actionTitle}>Loan Products</p>
                <p className={styles.actionDescription}>Manage products</p>
              </div>
            </Link>

            <Link to="/tenant/loans/applications" className={styles.actionLink}>
              <div className={`${styles.actionIconContainer} ${styles.applications}`}>
                <FaList className={styles.actionIcon} />
              </div>
              <div className={styles.actionText}>
                <p className={styles.actionTitle}>Applications</p>
                <p className={styles.actionDescription}>View all applications</p>
              </div>
            </Link>

            <Link to="/tenant/loans/accounts" className={styles.actionLink}>
              <div className={`${styles.actionIconContainer} ${styles.loanAccounts}`}>
                <FaWallet className={styles.actionIcon} />
              </div>
              <div className={styles.actionText}>
                <p className={styles.actionTitle}>Loan Accounts</p>
                <p className={styles.actionDescription}>Manage active loans</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
          </div>
          <div className={styles.activityList}>
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityContent}>
                    <div className={`${styles.activityIconContainer} ${styles[activity.type] || styles.default}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className={styles.activityText}>
                      <p className={styles.activityDescription}>{activity.description}</p>
                      <p className={styles.activityDate}>{activity.date}</p>
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[activity.status] || styles.default}`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <p className={styles.noActivity}>No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for activity icons
const getActivityIcon = (type: string) => {
  const icons = {
    application: <FaFileAlt className={styles.activityIcon} />,
    approval: <FaMoneyCheckAlt className={styles.activityIcon} />,
    disbursement: <FaWallet className={styles.activityIcon} />,
    payment: <FaMoneyCheckAlt className={styles.activityIcon} />
  };
  return icons[type as keyof typeof icons] || <FaFileAlt className={styles.activityIcon} />;
};

export default LoanManagementDashboard;