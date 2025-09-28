// fe/src/components/PlatformAdminDashboard/AccountingDashboard/BalanceSheetTab/BalanceSheetTab.tsx
import React from 'react';
import { type FinancialStatement } from '../../../../../types/accounting';

interface BalanceSheetTabProps {
  balanceSheet: FinancialStatement | null;
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

// Helper interface for statement line items
interface StatementLineItem {
  accountId: string;
  accountName: string;
  amount: number;
}

const BalanceSheetTab: React.FC<BalanceSheetTabProps> = ({ 
  balanceSheet, 
  loading, 
  formatCurrency 
}) => {
  if (loading) {
    return <div className="tab-content loading">Loading Balance Sheet...</div>;
  }

  if (!balanceSheet) {
    return <div className="tab-content">No balance sheet data available</div>;
  }

  // For now, we'll use placeholder data since the backend implementation is pending
  const assets: StatementLineItem[] = [
    { accountId: '1', accountName: 'Cash', amount: balanceSheet.assets * 0.4 },
    { accountId: '2', accountName: 'Accounts Receivable', amount: balanceSheet.assets * 0.3 },
    { accountId: '3', accountName: 'Inventory', amount: balanceSheet.assets * 0.2 },
    { accountId: '4', accountName: 'Property & Equipment', amount: balanceSheet.assets * 0.1 }
  ];

  const liabilities: StatementLineItem[] = [
    { accountId: '5', accountName: 'Accounts Payable', amount: balanceSheet.liabilities * 0.6 },
    { accountId: '6', accountName: 'Loans Payable', amount: balanceSheet.liabilities * 0.4 }
  ];

  const equity: StatementLineItem[] = [
    { accountId: '7', accountName: 'Common Stock', amount: balanceSheet.equity * 0.7 },
    { accountId: '8', accountName: 'Retained Earnings', amount: balanceSheet.equity * 0.3 }
  ];

  return (
    <div className="balance-sheet-tab">
      <div className="tab-header">
        <h2>Balance Sheet</h2>
        <span className="as-of-date">As of {new Date().toLocaleDateString()}</span>
      </div>
      
      <div className="financial-statement">
        <div className="assets-section">
          <h3>Assets</h3>
          {assets.map(item => (
            <div key={item.accountId} className="statement-line">
              <span>{item.accountName}</span>
              <span className="amount">{formatCurrency(item.amount || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Assets</span>
            <span className="amount">{formatCurrency(balanceSheet.assets || 0)}</span>
          </div>
        </div>
        
        <div className="liabilities-section">
          <h3>Liabilities</h3>
          {liabilities.map(item => (
            <div key={item.accountId} className="statement-line">
              <span>{item.accountName}</span>
              <span className="amount">{formatCurrency(item.amount || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Liabilities</span>
            <span className="amount">{formatCurrency(balanceSheet.liabilities || 0)}</span>
          </div>
        </div>
        
        <div className="equity-section">
          <h3>Equity</h3>
          {equity.map(item => (
            <div key={item.accountId} className="statement-line">
              <span>{item.accountName}</span>
              <span className="amount">{formatCurrency(item.amount || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Equity</span>
            <span className="amount">{formatCurrency(balanceSheet.equity || 0)}</span>
          </div>
        </div>
        
        <div className="balance-check">
          <div className="statement-line total">
            <span>Assets = Liabilities + Equity</span>
            <span className="amount">
              {formatCurrency(balanceSheet.assets || 0)} = {formatCurrency((balanceSheet.liabilities || 0) + (balanceSheet.equity || 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetTab;