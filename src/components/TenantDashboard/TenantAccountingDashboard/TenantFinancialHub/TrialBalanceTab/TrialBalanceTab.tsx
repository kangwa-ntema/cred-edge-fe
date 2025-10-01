// fe/src/components/TenantDashboard/FinancialHub/TrialBalanceTab/TrialBalanceTab.tsx
import React from 'react';
import { type TrialBalance } from '../../../../../types/accounting';

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
    return (
      <div className="tab-content no-data">
        <div className="empty-state">
          <h3>No Trial Balance Data</h3>
          <p>Generate a trial balance by posting journal entries.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trial-balance-tab">
      <div className="tab-header">
        <h2>Trial Balance</h2>
        <span className="as-of-date">
          As of {new Date(trialBalance.asOfDate || Date.now()).toLocaleDateString()}
        </span>
      </div>
      
      <div className="balance-summary">
        <div className="balance-item">
          <span>Total Debit:</span>
          <strong>{formatCurrency(trialBalance.totals?.totalDebit || 0)}</strong>
        </div>
        <div className="balance-item">
          <span>Total Credit:</span>
          <strong>{formatCurrency(trialBalance.totals?.totalCredit || 0)}</strong>
        </div>
        <div className={`balance-check ${trialBalance.balanceCheck ? 'balanced' : 'unbalanced'}`}>
          <span>Balance Check:</span>
          <strong>{trialBalance.balanceCheck ? '✓ Balanced' : '✗ Unbalanced'}</strong>
        </div>
      </div>
      
      <div className="table-container">
        <table className="financial-table">
          <thead>
            <tr>
              <th>Account</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {trialBalance.accounts?.map((account: any) => (
              <tr key={account.account}>
                <td>
                  <div className="account-info">
                    <span className="account-number">{account.accountNumber}</span>
                    <span className="account-name">{account.accountName}</span>
                  </div>
                </td>
                <td className="text-right debit">
                  {account.debit > 0 ? formatCurrency(account.debit || 0) : '-'}
                </td>
                <td className="text-right credit">
                  {account.credit > 0 ? formatCurrency(account.credit || 0) : '-'}
                </td>
                <td className="text-right balance">
                  {formatCurrency(account.balance || 0)}
                </td>
              </tr>
            ))}
            {(!trialBalance.accounts || trialBalance.accounts.length === 0) && (
              <tr>
                <td colSpan={4} className="no-data">
                  No account balances available.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td><strong>Total</strong></td>
              <td className="text-right debit">
                <strong>{formatCurrency(trialBalance.totals?.totalDebit || 0)}</strong>
              </td>
              <td className="text-right credit">
                <strong>{formatCurrency(trialBalance.totals?.totalCredit || 0)}</strong>
              </td>
              <td className="text-right">
                <strong>-</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TrialBalanceTab;