// fe/src/components/TenantDashboard/FinancialHub/TenantFinancialHub.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import './TenantFinancialHub.scss';

// Import tenant accounting APIs
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  postJournalEntry,
  getChartOfAccounts,
  createCOAAccount,
  updateCOAAccount,
  deleteCOAAccount,
  getFinancialStatement
} from '../../../../services/api/tenant/tenantAccountingApi';

// Import reusable components (similar to platform ones)
import COATab from './COATab/COATab';
import JournalTab from './JournalTab/JournalTab';
import TrialBalanceTab from './TrialBalanceTab/TrialBalanceTab';
import IncomeStatementTab from './IncomeStatementTab/IncomeStatementTab';
import BalanceSheetTab from './BalanceSheetTab/BalanceSheetTab';
import COAModal from './COAModal/COAModal';
import JournalEntryModal from './JournalEntryModal/JournalEntryModal';

// Types
interface FinancialData {
  chartOfAccounts: any[];
  journalEntries: any[];
  trialBalance: any;
  incomeStatement: any;
  balanceSheet: any;
}

const TenantFinancialHub: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('coa');
  const [financialData, setFinancialData] = useState<FinancialData>({
    chartOfAccounts: [],
    journalEntries: [],
    trialBalance: null,
    incomeStatement: null,
    balanceSheet: null
  });
  const [loading, setLoading] = useState(true);
  const [showCOAModal, setShowCOAModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Fetch all financial data
  const fetchFinancialData = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const [coaResult, journalResult, trialBalanceResult, incomeResult, balanceResult] = await Promise.all([
        getChartOfAccounts(),
        getJournalEntries(),
        getFinancialStatement('trial-balance', dateRange),
        getFinancialStatement('income-statement', dateRange),
        getFinancialStatement('balance-sheet', dateRange)
      ]);

      setFinancialData({
        chartOfAccounts: coaResult.success ? coaResult.data : [],
        journalEntries: journalResult.success ? journalResult.data : [],
        trialBalance: trialBalanceResult.success ? trialBalanceResult.data : null,
        incomeStatement: incomeResult.success ? incomeResult.data : null,
        balanceSheet: balanceResult.success ? balanceResult.data : null
      });

    } catch (error) {
      toast.error('Failed to fetch financial data');
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // COA Operations
  const handleCreateAccount = async (accountData: any) => {
    try {
      const result = await createCOAAccount(accountData);
      if (result.success) {
        toast.success('Account created successfully');
        setShowCOAModal(false);
        fetchFinancialData();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    }
  };

  const handleUpdateAccount = async (accountId: string, accountData: any) => {
    try {
      const result = await updateCOAAccount(accountId, accountData);
      if (result.success) {
        toast.success('Account updated successfully');
        setShowCOAModal(false);
        setSelectedAccount(null);
        fetchFinancialData();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update account');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const result = await deleteCOAAccount(accountId);
        if (result.success) {
          toast.success('Account deleted successfully');
          fetchFinancialData();
        } else {
          throw new Error(result.error);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete account');
      }
    }
  };

  // Journal Entry Operations
  const handleCreateJournalEntry = async (entryData: any) => {
    try {
      const result = await createJournalEntry(entryData);
      if (result.success) {
        toast.success('Journal entry created successfully');
        setShowJournalModal(false);
        fetchFinancialData();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create journal entry');
    }
  };

  const handlePostJournalEntry = async (entryId: string) => {
    try {
      const result = await postJournalEntry(entryId);
      if (result.success) {
        toast.success('Journal entry posted successfully');
        fetchFinancialData();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to post journal entry');
    }
  };

  const handleDeleteJournalEntry = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        const result = await deleteJournalEntry(entryId);
        if (result.success) {
          toast.success('Journal entry deleted successfully');
          fetchFinancialData();
        } else {
          throw new Error(result.error);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete journal entry');
      }
    }
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    fetchFinancialData();
  }, [user, dateRange]);

  const renderTabContent = () => {
    if (loading) {
      return <div className="tab-content loading">Loading financial data...</div>;
    }

    switch (activeTab) {
      case 'coa':
        return (
          <COATab
            chartOfAccounts={financialData.chartOfAccounts}
            loading={loading}
            formatCurrency={formatCurrency}
            onEdit={(account) => {
              setSelectedAccount(account);
              setShowCOAModal(true);
            }}
            onDelete={handleDeleteAccount}
          />
        );
      
      case 'journal':
        return (
          <JournalTab
            journalEntries={financialData.journalEntries}
            loading={loading}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onEdit={(entry) => {
              setSelectedEntry(entry);
              setShowJournalModal(true);
            }}
            onDelete={handleDeleteJournalEntry}
            onPost={handlePostJournalEntry}
          />
        );
      
      case 'trial-balance':
        return (
          <TrialBalanceTab
            trialBalance={financialData.trialBalance}
            loading={loading}
            formatCurrency={formatCurrency}
          />
        );
      
      case 'income-statement':
        return (
          <IncomeStatementTab
            incomeStatement={financialData.incomeStatement}
            loading={loading}
            formatCurrency={formatCurrency}
          />
        );
      
      case 'balance-sheet':
        return (
          <BalanceSheetTab
            balanceSheet={financialData.balanceSheet}
            loading={loading}
            formatCurrency={formatCurrency}
          />
        );
      
      default:
        return <div>Select a tab to view financial data</div>;
    }
  };

  return (
    <div className="tenant-financial-hub">
      <div className="financial-hub-header">
        <h1>Financial Hub</h1>
        <div className="header-actions">
          <div className="date-filter">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <span>to</span>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          
          {activeTab === 'coa' && (
            <button
              className="btn-primary"
              onClick={() => {
                setSelectedAccount(null);
                setShowCOAModal(true);
              }}
            >
              New Account
            </button>
          )}
          
          {activeTab === 'journal' && (
            <button
              className="btn-primary"
              onClick={() => {
                setSelectedEntry(null);
                setShowJournalModal(true);
              }}
            >
              New Journal Entry
            </button>
          )}
        </div>
      </div>

      <div className="financial-hub-tabs">
        <nav className="tab-navigation">
          {[
            { id: 'coa', label: 'Chart of Accounts' },
            { id: 'journal', label: 'General Journal' },
            { id: 'trial-balance', label: 'Trial Balance' },
            { id: 'income-statement', label: 'Income Statement' },
            { id: 'balance-sheet', label: 'Balance Sheet' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="tab-content-container">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      <COAModal
        show={showCOAModal}
        onClose={() => {
          setShowCOAModal(false);
          setSelectedAccount(null);
        }}
        onSave={(data) => {
          if (selectedAccount) {
            handleUpdateAccount(selectedAccount._id, data);
          } else {
            handleCreateAccount(data);
          }
        }}
        account={selectedAccount}
        chartOfAccounts={financialData.chartOfAccounts}
      />

      <JournalEntryModal
        show={showJournalModal}
        onClose={() => {
          setShowJournalModal(false);
          setSelectedEntry(null);
        }}
        onSave={(data) => {
          if (selectedEntry) {
            // handleUpdateJournalEntry(selectedEntry._id, data);
          } else {
            handleCreateJournalEntry(data);
          }
        }}
        chartOfAccounts={financialData.chartOfAccounts}
        entry={selectedEntry}
      />

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default TenantFinancialHub;