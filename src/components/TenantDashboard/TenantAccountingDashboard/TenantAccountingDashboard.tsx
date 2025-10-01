// fe/src/components/TenantDashboard/AccountingDashboard/AccountingDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import {
  getChartOfAccounts,
  getJournalEntries,
  getFinancialStatement,
  createJournalEntry,
} from '../../../services/api/tenant/tenantAccountingApi';
import { loanService } from '../../../services/api/tenant/loanService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TenantAccountingDashboard.scss';

// Components
import RevenueAnalysisCard from './RevenueAnalysisCard/RevenueAnalysisCard';
import ExpenseAnalysisCard from './ExpenseAnalysisCard/ExpenseAnalysisCard';
import AccountBalancesCard from './AccountBalancesCard/AccountBalancesCard';
import JournalEntryModal from './JournalEntryModal/JournalEntryModal';
import TransactionSummaryCard from './TransactionSummaryCard/TransactionSummaryCard';

const TenantAccountingDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for financial data
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
  const [recentJournalEntries, setRecentJournalEntries] = useState<any[]>([]);
  const [accountBalances, setAccountBalances] = useState<any[]>([]);
  const [loanStats, setLoanStats] = useState<any>(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchAccountingData = useCallback(async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const [coaResult, journalResult, trialBalanceResult, incomeResult, loanStatsResult] = await Promise.all([
        getChartOfAccounts(),
        getJournalEntries({
          page: 1,
          limit: 10,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        getFinancialStatement('trial-balance', { endDate: dateRange.endDate }),
        getFinancialStatement('income-statement', {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        loanService.getLoanStats()
      ]);

      // Handle Chart of Accounts
      if (coaResult.success) {
        setChartOfAccounts(coaResult.data || []);
        const balances = (coaResult.data || []).map(account => ({
          accountNumber: account.accountNumber,
          accountName: account.accountName,
          accountType: account.accountType,
          balance: account.balance || 0,
          normalBalance: account.normalBalance
        }));
        setAccountBalances(balances);
      }

      // Handle Journal Entries
      if (journalResult.success) {
        setRecentJournalEntries(journalResult.data || []);
      }

      // Handle Loan Statistics
      if (loanStatsResult) {
        setLoanStats(loanStatsResult);
      }

      // Handle Financial Summary
      if (incomeResult.success && trialBalanceResult.success) {
        const incomeData = incomeResult.data;
        const trialBalanceData = trialBalanceResult.data;
        
        setFinancialSummary({
          totalRevenue: incomeData?.revenue?.total || 0,
          totalExpenses: incomeData?.expenses?.total || 0,
          netIncome: incomeData?.netIncome || 0,
          totalAssets: trialBalanceData?.assets?.total || 0,
          totalLiabilities: trialBalanceData?.liabilities?.total || 0,
          totalEquity: trialBalanceData?.equity?.total || 0,
          activeAccounts: chartOfAccounts.filter(acc => acc.isActive).length,
          postedEntries: recentJournalEntries.filter(entry => entry.status === 'posted').length
        });
      }

    } catch (error) {
      toast.error('Failed to fetch accounting data');
      console.error('Error fetching accounting data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, dateRange]);

  const handleCreateJournal = async (journalData: any) => {
    if (!user?.token) return;

    try {
      const result = await createJournalEntry(journalData);
      if (result.success) {
        toast.success('Journal entry created successfully');
        await fetchAccountingData();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create journal entry');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create journal entry');
      console.error('Error creating journal entry:', error);
      throw error;
    }
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const navigateToFinancialHub = () => {
    navigate('/tenant/accounting/financial-hub');
  };

  useEffect(() => {
    fetchAccountingData();
  }, [fetchAccountingData]);

  if (loading) {
    return <div className="accountingDashboard loading">Loading accounting data...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="accountingDashboard">
      {/* Header with Navigation - Inspired by old version */}
      <div className="dashboardHeader">
        <div className="headerLeft">
          <Link to="/tenant/dashboard" className="backLink">
            ← Back to Main Dashboard
          </Link>
          <h1>Accounting Overview</h1>
        </div>
        <div className="headerActions">
          <div className="dateFilter">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
            />
            <span>to</span>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowJournalModal(true)}
          >
            New Journal Entry
          </button>
        </div>
      </div>

      {/* Navigation Panel - From old version */}
      <div className="accountingNavigation">
        <Link to="/tenant/accounting/chart-of-accounts" className="navLink">
          Chart Of Accounts
        </Link>
        <Link to="/tenant/accounting/journal-entries" className="navLink">
          Journal Entries
        </Link>
        <Link to="/tenant/accounting/general-ledger" className="navLink">
          General Ledger
        </Link>
        <Link to="/tenant/accounting/trial-balance" className="navLink">
          Trial Balance
        </Link>
        <Link to="/tenant/accounting/income-statement" className="navLink">
          Income Statement
        </Link>
        <Link to="/tenant/accounting/balance-sheet" className="navLink">
          Balance Sheet
        </Link>
      </div>

      {/* Summary Cards - Hybrid approach */}
      <div className="dashboardSummary">
        <div className="summaryCards">
          {/* Business Operations Cards */}
          <TransactionSummaryCard 
            title="Total Loans Receivable"
            value={loanStats?.totalLoanPortfolio || 0}
            type="receivable"
            formatCurrency={formatCurrency}
          />
          <TransactionSummaryCard 
            title="Active Loans"
            value={loanStats?.activeLoans || 0}
            type="count"
          />
          <TransactionSummaryCard 
            title="Pending Payments"
            value={loanStats?.pendingPayments || 0}
            type="pending"
            formatCurrency={formatCurrency}
          />
          <TransactionSummaryCard 
            title="Overdue Payments"
            value={loanStats?.overduePayments || 0}
            type="overdue"
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="dashboardContent">
        <div className="contentRow">
          <RevenueAnalysisCard 
            financialSummary={financialSummary} 
            accountBalances={accountBalances}
          />
          <ExpenseAnalysisCard 
            financialSummary={financialSummary}
            accountBalances={accountBalances}
          />
        </div>
        
        <div className="contentRow">
          <AccountBalancesCard 
            accountBalances={accountBalances}
            onViewDetails={navigateToFinancialHub}
          />
          
          {/* Quick Actions Card - From old version concept */}
          <div className="quickActionsCard">
            <div className="cardHeader">
              <h3>Quick Actions</h3>
            </div>
            <div className="cardContent">
              <div className="actionButtons">
                <button onClick={() => setShowJournalModal(true)} className="actionButton">
                  <i className="icon-journal"></i>
                  <span>Create Journal Entry</span>
                </button>
                <button onClick={navigateToFinancialHub} className="actionButton">
                  <i className="icon-ledger"></i>
                  <span>View General Ledger</span>
                </button>
                <button onClick={navigateToFinancialHub} className="actionButton">
                  <i className="icon-balance"></i>
                  <span>Run Trial Balance</span>
                </button>
                <button onClick={navigateToFinancialHub} className="actionButton">
                  <i className="icon-statement"></i>
                  <span>Financial Statements</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Journal Entries Section */}
        <div className="contentRow fullWidth">
          <div className="recentEntriesCard">
            <div className="cardHeader">
              <h3>Recent Journal Entries</h3>
              <button onClick={navigateToFinancialHub} className="btn-small">
                View All
              </button>
            </div>
            <div className="entriesList">
              {recentJournalEntries.slice(0, 5).map(entry => (
                <div key={entry._id} className="entryItem">
                  <div className="entryInfo">
                    <span className="entryNumber">{entry.entryNumber}</span>
                    <span className="entryDescription">{entry.description}</span>
                    <span className="entryDate">
                      {new Date(entry.entryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="entryMeta">
                    <span className={`status ${entry.status}`}>
                      {entry.status}
                    </span>
                    <span className="entryAmount">
                      {formatCurrency(entry.totalDebit)}
                    </span>
                  </div>
                </div>
              ))}
              {recentJournalEntries.length === 0 && (
                <div className="noEntries">
                  <p>No recent journal entries</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <JournalEntryModal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
        onSaveJournal={handleCreateJournal}
        chartOfAccounts={chartOfAccounts}
      />

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default TenantAccountingDashboard;