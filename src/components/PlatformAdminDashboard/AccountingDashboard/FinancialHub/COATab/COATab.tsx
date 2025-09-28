// fe/src/components/PlatformAdminDashboard/AccountingDashboard/COATab/COATab.tsx
import React from 'react';
import { type ChartOfAccount } from '../../../../../types/accounting';

interface COATabProps {
  chartOfAccounts: ChartOfAccount[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  onEdit: (account: ChartOfAccount) => void;
  onDelete: (accountId: string) => void;
}

const COATab: React.FC<COATabProps> = ({ 
  chartOfAccounts = [], 
  loading, 
  formatCurrency,
  onEdit,
  onDelete 
}) => {
  if (loading) {
    return <div className="tab-content loading">Loading Chart of Accounts...</div>;
  }

  const getAccountTypeColor = (type: string) => {
    const colors = {
      asset: '#e3f2fd',
      liability: '#ffebee',
      equity: '#f1f8e9',
      revenue: '#e8f5e8',
      expense: '#fff3e0'
    };
    return colors[type.toLowerCase()] || '#f5f5f5';
  };

  return (
    <div className="coa-tab">
      <div className="tab-header">
        <h2>Chart of Accounts</h2>
        <span className="record-count">{chartOfAccounts.length} accounts</span>
      </div>
      
      <div className="table-container">
        <table className="financial-table">
          <thead>
            <tr>
              <th>Account #</th>
              <th>Name</th>
              <th>Type</th>
              <th>Normal Balance</th>
              <th className="text-right">Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chartOfAccounts.map(account => (
              <tr key={account._id} style={{ backgroundColor: getAccountTypeColor(account.accountType) }}>
                <td className="account-code">{account.accountNumber}</td>
                <td className="account-name">{account.accountName}</td>
                <td>
                  <span className={`account-type ${account.accountType.toLowerCase()}`}>
                    {account.accountType}
                  </span>
                </td>
                <td>
                  <span className={`balance-type ${account.normalBalance.toLowerCase()}`}>
                    {account.normalBalance}
                  </span>
                </td>
                <td className="text-right">{formatCurrency(account.balance || 0)}</td>
                <td className="actions">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(account)}
                    title="Edit Account"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => onDelete(account._id)}
                    title="Delete Account"
                    disabled={account.balance !== 0}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default COATab;