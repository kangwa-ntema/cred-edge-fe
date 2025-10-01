// fe/src/components/platformAdminDashboard/AccountingDashboard/AccountingDashboard.tsx

// fe/src/components/platformAdminDashboard/AccountingDashboard/AccountingDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import {
  getPlatformRevenueReport,
  getTenantPaymentStatus,
  getPlatformFinancialSummary,
  getPackagePerformance,
  createManualPayment,
} from '../../../services/api/platform/platformAccountingApi.ts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountingDashboard.scss';

// Components
import RevenueAnalysisCard from './RevenueAnalysisCard/RevenueAnalysisCard';
import TenantPaymentsCard from './TenantPaymentsCard/TenantPaymentsCard';
import PackagePerformanceCard from './PackagePerformanceCard/PackagePerformanceCard';
import AddPaymentModal from './AddPaymentModal/AddPaymentModal';

const AccountingDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [tenantPayments, setTenantPayments] = useState<any[]>([]);
  const [packagePerformance, setPackagePerformance] = useState<any[]>([]);
  const [revenueReport, setRevenueReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

const fetchAccountingData = async () => {
  if (!user?.token) return;

  setLoading(true);
  try {
    const [revenueResult, tenantsResult, summaryResult, performanceResult] = await Promise.all([
      getPlatformRevenueReport(dateRange.startDate, dateRange.endDate),
      getTenantPaymentStatus(),
      getPlatformFinancialSummary(),
      getPackagePerformance()
    ]);

    // ✅ Handle the new response structure
    if (revenueResult.success) {
      console.log('Revenue report data:', revenueResult.data);
      setRevenueReport(revenueResult.data);
    }

    if (tenantsResult.success) {
      console.log('Tenant payments data:', tenantsResult.data);
      // Backend now returns array directly in data property
      setTenantPayments(tenantsResult.data || []);
    }

    if (summaryResult.success) {
      console.log('Financial summary data:', summaryResult.data);
      setFinancialSummary(summaryResult.data);
    }

    if (performanceResult.success) {
      console.log('Package performance data:', performanceResult.data);
      setPackagePerformance(performanceResult.data || []);
    }

  } catch (error) {
    toast.error('Failed to fetch accounting data');
    console.error('Error fetching accounting data:', error);
  } finally {
    setLoading(false);
  }
};

  const handleAddPayment = async (paymentData: any) => {
    if (!user?.token) return;

    try {
      const result = await createManualPayment(paymentData);
      if (result.success) {
        toast.success('Payment added successfully');
        // Refresh the data
        await fetchAccountingData();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to add payment');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add payment');
      console.error('Error adding payment:', error);
      throw error;
    }
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const navigateToFinancialHub = () => {
    navigate('/platform/accounting/financial-hub');
  };

  useEffect(() => {
    fetchAccountingData();
  }, [user, dateRange]);

  if (loading) {
    return <div className="accountingDashboard loading">Loading accounting data...</div>;
  }

  return (
    <div className="accountingDashboard">
      <div className="dashboardHeader">
        <h1>Platform Accounting Dashboard</h1>
        <div className="headerActions">
          <div className="dateFilter">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              placeholder="Start Date"
            />
            <span>to</span>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              placeholder="End Date"
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowAddPaymentModal(true)}
          >
            Add Payment
          </button>
          <button
            className="btn-secondary"
            onClick={navigateToFinancialHub}
          >
            Financial Hub
          </button>
        </div>
      </div>

      <div className="dashboardSummary">
        <div className="summaryCards">
          <div className="summaryCard totalRevenue">
            <h3>Total Revenue</h3>
            <p>${financialSummary?.totalRevenue?.toLocaleString() || '0'}</p>
          </div>
          <div className="summaryCard totalExpenses">
            <h3>Total Expenses</h3>
            <p>${financialSummary?.totalExpenses?.toLocaleString() || '0'}</p>
          </div>
          <div className="summaryCard netIncome">
            <h3>Net Income</h3>
            <p>${financialSummary?.netIncome?.toLocaleString() || '0'}</p>
          </div>
          <div className="summaryCard activeTenants">
            <h3>Active Tenants</h3>
            <p>{financialSummary?.activeTenants || '0'}</p>
          </div>
        </div>
      </div>

      <div className="dashboardContent">
        <div className="contentRow">
          <RevenueAnalysisCard revenueReport={revenueReport} />
          <TenantPaymentsCard 
            tenantPayments={tenantPayments} 
            onAddPayment={() => setShowAddPaymentModal(true)}
          />
        </div>
        
        <div className="contentRow">
          <PackagePerformanceCard packagePerformance={packagePerformance} />
          
          <div className="financialHubCard">
            <div className="cardHeader">
              <h3>Financial Management</h3>
            </div>
            <div className="cardContent">
              <p>Access advanced financial tools and reports</p>
              <div className="financialTools">
                <button onClick={navigateToFinancialHub} className="toolButton">
                  <i className="icon-ledger"></i>
                  <span>General Ledger</span>
                </button>
                <button onClick={navigateToFinancialHub} className="toolButton">
                  <i className="icon-journal"></i>
                  <span>Journal Entries</span>
                </button>
                <button onClick={navigateToFinancialHub} className="toolButton">
                  <i className="icon-balance"></i>
                  <span>Trial Balance</span>
                </button>
                <button onClick={navigateToFinancialHub} className="toolButton">
                  <i className="icon-statement"></i>
                  <span>Financial Statements</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddPaymentModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onAddPayment={handleAddPayment}
      />

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AccountingDashboard;