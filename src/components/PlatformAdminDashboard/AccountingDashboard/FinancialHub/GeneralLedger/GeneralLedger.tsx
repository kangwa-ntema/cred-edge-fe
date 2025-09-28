// fe/src/components/PlatformAdminDashboard/AccountingManagement/GeneralLedger.tsx

import React from 'react';
import { type GeneralLedgerEntry } from '../../../../../types/accounting';

interface LedgerTabProps {
  generalLedger: GeneralLedgerEntry[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const LedgerTab: React.FC<LedgerTabProps> = ({ 
  generalLedger, 
  loading, 
  formatCurrency, 
  formatDate 
}) => {
  if (loading) {
    return <div className="tab-content loading">Loading General Ledger...</div>;
  }

  return (
    <div className="ledger-tab">
      <div className="tab-header">
        <h2>General Ledger</h2>
        <span className="record-count">{generalLedger.length} entries</span>
      </div>
      
      <div className="table-container">
        <table className="financial-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Account</th>
              <th>Description</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th className="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {generalLedger.map(entry => (
              <tr key={entry._id}>
                <td>{formatDate(entry.date)}</td>
                <td>{entry.accountName} ({entry.accountNumber})</td>
                <td className="entry-description">{entry.description}</td>
                <td className="text-right debit">
                  {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                </td>
                <td className="text-right credit">
                  {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                </td>
                <td className="text-right balance">{formatCurrency(entry.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerTab;