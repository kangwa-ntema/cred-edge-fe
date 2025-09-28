// fe/src/components/PlatformAdminDashboard/AccountingDashboard/FinancialHub/FinancialHub.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import {
  getChartOfAccounts,
  getJournalEntries,
  getGeneralLedger,
  getTrialBalance,
  getIncomeStatement,
  getBalanceSheet,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  createCOAAccount,
  updateCOAAccount,
  deleteCOAAccount,
  postJournalEntry
} from '../../../../services/api/platform/platformAccountingApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FinancialHub.scss';

// Components
import COATab from './COATab/COATab';
import JournalTab from './GeneralJournal/JournalTab/JournalTab';
import LedgerTab from './LedgerTab/LedgerTab';
import TrialBalanceTab from './TrialBalanceTab/TrialBalanceTab';
import IncomeStatementTab from './IncomeStatementTab/IncomeStatementTab';
import BalanceSheetTab from './BalanceSheetTab/BalanceSheetTab';
import JournalEntryModal from './GeneralJournal/JournalTab/JournalEntryModal/JournalEntryModal';
import COAModal from './COATab/COAEntryModal/COAModal'; // FIXED IMPORT PATH

const FinancialHub: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('coa');
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [generalLedger, setGeneralLedger] = useState<any[]>([]);
  const [trialBalance, setTrialBalance] = useState<any>(null);
  const [incomeStatement, setIncomeStatement] = useState<any>(null);
  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showCOAModal, setShowCOAModal] = useState(false);
  const [editingJournal, setEditingJournal] = useState<any>(null);
  const [editingCOA, setEditingCOA] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchFinancialData = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      switch (activeTab) {
        case 'coa':
          const coaResult = await getChartOfAccounts();
          if (coaResult.success) setChartOfAccounts(coaResult.data || []);
          break;
        case 'journal':
          const journalResult = await getJournalEntries({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          });
          if (journalResult.success) setJournalEntries(journalResult.data?.entries || []);
          break;
        case 'ledger':
          const ledgerResult = await getGeneralLedger({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          });
          if (ledgerResult.success) setGeneralLedger(ledgerResult.data?.entries || []);
          break;
        case 'trial-balance':
          const tbResult = await getTrialBalance(dateRange.endDate);
          if (tbResult.success) setTrialBalance(tbResult.data || null);
          break;
        case 'income-statement':
          const isResult = await getIncomeStatement(dateRange.startDate, dateRange.endDate);
          if (isResult.success) setIncomeStatement(isResult.data || null);
          break;
        case 'balance-sheet':
          const bsResult = await getBalanceSheet(dateRange.endDate);
          if (bsResult.success) setBalanceSheet(bsResult.data || null);
          break;
      }
    } catch (error) {
      toast.error(`Failed to fetch ${activeTab} data`);
      console.error(`Error fetching ${activeTab} data:`, error);
    }
    setLoading(false);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateJournal = () => {
    setEditingJournal(null);
    setShowJournalModal(true);
  };

  const handleEditJournal = (entry: any) => {
    setEditingJournal(entry);
    setShowJournalModal(true);
  };

  const handleDeleteJournal = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        const result = await deleteJournalEntry(entryId);
        if (result.success) {
          toast.success('Journal entry deleted successfully');
          fetchFinancialData();
        } else {
          toast.error(result.error || 'Failed to delete journal entry');
        }
      } catch (error) {
        toast.error('Failed to delete journal entry');
      }
    }
  };

  const handlePostJournal = async (entryId: string) => {
    try {
      const result = await postJournalEntry(entryId);
      if (result.success) {
        toast.success('Journal entry posted successfully');
        fetchFinancialData();
      } else {
        toast.error(result.error || 'Failed to post journal entry');
      }
    } catch (error) {
      toast.error('Failed to post journal entry');
    }
  };

  const handleCreateCOA = () => {
    setEditingCOA(null);
    setShowCOAModal(true);
  };

  const handleEditCOA = (account: any) => {
    setEditingCOA(account);
    setShowCOAModal(true);
  };

  const handleDeleteCOA = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const result = await deleteCOAAccount(accountId);
        if (result.success) {
          toast.success('Account deleted successfully');
          fetchFinancialData();
        } else {
          toast.error(result.error || 'Failed to delete account');
        }
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const handleSaveJournal = async (journalData: any) => {
    try {
      let result;
      if (editingJournal) {
        result = await updateJournalEntry(editingJournal._id, journalData);
      } else {
        result = await createJournalEntry(journalData);
      }
      
      if (result.success) {
        toast.success(`Journal entry ${editingJournal ? 'updated' : 'created'} successfully`);
        setShowJournalModal(false);
        fetchFinancialData();
      } else {
        toast.error(result.error || `Failed to ${editingJournal ? 'update' : 'create'} journal entry`);
      }
    } catch (error) {
      toast.error(`Failed to ${editingJournal ? 'update' : 'create'} journal entry`);
    }
  };

  const handleSaveCOA = async (coaData: any) => {
    try {
      let result;
      if (editingCOA) {
        result = await updateCOAAccount(editingCOA._id, coaData);
      } else {
        result = await createCOAAccount(coaData);
      }
      
      if (result.success) {
        toast.success(`Account ${editingCOA ? 'updated' : 'created'} successfully`);
        setShowCOAModal(false);
        fetchFinancialData();
      } else {
        toast.error(result.error || `Failed to ${editingCOA ? 'update' : 'create'} account`);
      }
    } catch (error) {
      toast.error(`Failed to ${editingCOA ? 'update' : 'create'} account`);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [activeTab, user, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="financialHub">
      <div className="hubHeader">
        <h1>Financial Management Hub</h1>
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
          {activeTab === 'journal' && (
            <button className="btn-primary" onClick={handleCreateJournal}>
              New Journal Entry
            </button>
          )}
          {activeTab === 'coa' && (
            <button className="btn-primary" onClick={handleCreateCOA}>
              New Account
            </button>
          )}
        </div>
      </div>

      <div className="hubTabs">
        <button className={activeTab === 'coa' ? 'active' : ''} onClick={() => setActiveTab('coa')}>
          Chart of Accounts
        </button>
        <button className={activeTab === 'journal' ? 'active' : ''} onClick={() => setActiveTab('journal')}>
          General Journal
        </button>
        <button className={activeTab === 'ledger' ? 'active' : ''} onClick={() => setActiveTab('ledger')}>
          General Ledger
        </button>
        <button className={activeTab === 'trial-balance' ? 'active' : ''} onClick={() => setActiveTab('trial-balance')}>
          Trial Balance
        </button>
        <button className={activeTab === 'income-statement' ? 'active' : ''} onClick={() => setActiveTab('income-statement')}>
          Income Statement
        </button>
        <button className={activeTab === 'balance-sheet' ? 'active' : ''} onClick={() => setActiveTab('balance-sheet')}>
          Balance Sheet
        </button>
      </div>

      <div className="hubContent">
        {activeTab === 'coa' && (
          <COATab 
            chartOfAccounts={chartOfAccounts} 
            loading={loading}
            formatCurrency={formatCurrency}
            onEdit={handleEditCOA}
            onDelete={handleDeleteCOA}
          />
        )}
        {activeTab === 'journal' && (
          <JournalTab 
            journalEntries={journalEntries} 
            loading={loading}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onEdit={handleEditJournal}
            onDelete={handleDeleteJournal}
            onPost={handlePostJournal}
          />
        )}
        {activeTab === 'ledger' && (
          <LedgerTab 
            generalLedger={generalLedger} 
            loading={loading}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )}
        {activeTab === 'trial-balance' && (
          <TrialBalanceTab 
            trialBalance={trialBalance} 
            loading={loading}
            formatCurrency={formatCurrency}
          />
        )}
        {activeTab === 'income-statement' && (
          <IncomeStatementTab 
            incomeStatement={incomeStatement} 
            loading={loading}
            formatCurrency={formatCurrency}
          />
        )}
        {activeTab === 'balance-sheet' && (
          <BalanceSheetTab 
            balanceSheet={balanceSheet} 
            loading={loading}
            formatCurrency={formatCurrency}
          />
        )}
      </div>

      {showJournalModal && (
        <JournalEntryModal
          show={showJournalModal}
          onClose={() => setShowJournalModal(false)}
          onSave={handleSaveJournal}
          chartOfAccounts={chartOfAccounts}
          entry={editingJournal}
        />
      )}

      {showCOAModal && (
        <COAModal
          show={showCOAModal}
          onClose={() => setShowCOAModal(false)}
          onSave={handleSaveCOA}
          account={editingCOA}
          chartOfAccounts={chartOfAccounts}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default FinancialHub;