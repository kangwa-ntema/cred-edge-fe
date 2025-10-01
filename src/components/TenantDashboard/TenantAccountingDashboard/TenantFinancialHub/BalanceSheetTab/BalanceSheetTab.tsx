// fe/src/components/TenantDashboard/FinancialHub/BalanceSheetTab/BalanceSheetTab.tsx
import React from 'react';
import { type FinancialStatement } from '../../../../../types/accounting';

interface BalanceSheetTabProps {
  balanceSheet: FinancialStatement | null;
  loading: boolean;
  formatCurrency: (amount: number) => string;
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
    return (
      <div className="tab-content no-data">
        <div className="empty-state">
          <h3>No Balance Sheet Data</h3>
          <p>Generate a balance sheet by selecting a date.</p>
        </div>
      </div>
    );
  }

  const totalAssets = balanceSheet.assets || 0;
  const totalLiabilities = balanceSheet.liabilities || 0;
  const totalEquity = balanceSheet.equity || 0;
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

  return (
    <div className="balance-sheet-tab">
      <div className="tab-header">
        <h2>Balance Sheet</h2>
        <span className="as-of-date">
          As of {new Date(balanceSheet.asOfDate || Date.now()).toLocaleDateString()}
        </span>
      </div>
      
      <div className="financial-statement">
        <div className="statement-section assets-section">
          <h3>Assets</h3>
          {balanceSheet.assetAccounts?.map((account: any) => (
            <div key={account._id} className="statement-line">
              <span>{account.accountName}</span>
              <span className="amount">{formatCurrency(account.balance || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Assets</span>
            <span className="amount">{formatCurrency(totalAssets)}</span>
          </div>
        </div>
        
        <div className="statement-section liabilities-section">
          <h3>Liabilities</h3>
          {balanceSheet.liabilityAccounts?.map((account: any) => (
            <div key={account._id} className="statement-line">
              <span>{account.accountName}</span>
              <span className="amount">{formatCurrency(account.balance || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Liabilities</span>
            <span className="amount">{formatCurrency(totalLiabilities)}</span>
          </div>
        </div>
        
        <div className="statement-section equity-section">
          <h3>Equity</h3>
          {balanceSheet.equityAccounts?.map((account: any) => (
            <div key={account._id} className="statement-line">
              <span>{account.accountName}</span>
              <span className="amount">{formatCurrency(account.balance || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Equity</span>
            <span className="amount">{formatCurrency(totalEquity)}</span>
          </div>
        </div>
        
        <div className={`balance-check ${isBalanced ? 'balanced' : 'unbalanced'}`}>
          <div className="statement-line total">
            <span>Assets = Liabilities + Equity</span>
            <span className="amount">
              {formatCurrency(totalAssets)} = {formatCurrency(totalLiabilities + totalEquity)}
              {isBalanced ? ' ✓' : ' ✗'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetTab;