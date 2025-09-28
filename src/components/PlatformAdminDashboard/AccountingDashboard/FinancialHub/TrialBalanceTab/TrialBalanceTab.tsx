// fe/src/components/PlatformAdminDashboard/AccountingDashboard/TrialBalanceTab/TrialBalanceTab.tsx
import React from 'react';
import { type TrialBalance, type TrialBalanceAccount } from '../../../../../types/accounting';

interface TrialBalanceTabProps {
  trialBalance: TrialBalance | null;
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

const TrialBalanceTab: React.FC<TrialBalanceTabProps> = ({ 
  trialBalance, 
  loading, 
  formatCurrency 
}) => {
  if (loading) {
    return <div className="tab-content loading">Loading Trial Balance...</div>;
  }

  if (!trialBalance) {
    return <div className="tab-content">No trial balance data available</div>;
  }

  return (
    <div className="trial-balance-tab">
      <div className="tab-header">
        <h2>Trial Balance</h2>
        <span className="as-of-date">As of {new Date(trialBalance.asOfDate).toLocaleDateString()}</span>
      </div>
      
      <div className="table-container">
        <table className="financial-table">
          <thead>
            <tr>
              <th>Account</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
            </tr>
          </thead>
          <tbody>
            {trialBalance.accounts.map((account: TrialBalanceAccount) => (
              <tr key={account.account}>
                <td>{account.accountName} ({account.accountNumber})</td>
                <td className="text-right debit">
                  {account.debit > 0 ? formatCurrency(account.debit || 0) : '-'}
                </td>
                <td className="text-right credit">
                  {account.credit > 0 ? formatCurrency(account.credit || 0) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td><strong>Total</strong></td>
              <td className="text-right debit">
                <strong>{formatCurrency(trialBalance.totalDebit || 0)}</strong>
              </td>
              <td className="text-right credit">
                <strong>{formatCurrency(trialBalance.totalCredit || 0)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TrialBalanceTab;