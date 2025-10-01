// fe/src/components/TenantDashboard/FinancialHub/JournalTab/JournalTab.tsx
import React from 'react';
import { type JournalEntry } from '../../../../../types/accounting';

interface JournalTabProps {
  journalEntries: JournalEntry[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
  onPost: (entryId: string) => void;
}

const JournalTab: React.FC<JournalTabProps> = ({ 
  journalEntries = [], 
  loading, 
  formatCurrency, 
  formatDate,
  onEdit,
  onDelete,
  onPost
}) => {
  if (loading) {
    return <div className="tab-content loading">Loading Journal Entries...</div>;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'draft', label: 'Draft' },
      posted: { class: 'posted', label: 'Posted' },
      cancelled: { class: 'cancelled', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'draft', label: status };
    return <span className={`status-badge status-${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="journal-tab">
      <div className="tab-header">
        <h2>General Journal</h2>
        <span className="record-count">{journalEntries.length} entries</span>
      </div>
      
      <div className="table-container">
        <table className="financial-table">
          <thead>
            <tr>
              <th>Entry #</th>
              <th>Date</th>
              <th>Description</th>
              <th>Reference</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {journalEntries.map(entry => (
              <tr key={entry._id} className={`entry-${entry.status}`}>
                <td className="entry-number">{entry.entryNumber}</td>
                <td>{formatDate(entry.entryDate)}</td>
                <td className="entry-description">{entry.description}</td>
                <td className="entry-reference">{entry.reference || '-'}</td>
                <td className="text-right debit">
                  {formatCurrency(entry.totalDebit || 0)}
                </td>
                <td className="text-right credit">
                  {formatCurrency(entry.totalCredit || 0)}
                </td>
                <td>
                  {getStatusBadge(entry.status)}
                </td>
                <td className="actions">
                  {entry.status === 'draft' && (
                    <>
                      <button 
                        className="btn-edit"
                        onClick={() => onEdit(entry)}
                        title="Edit Entry"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-post"
                        onClick={() => onPost(entry._id)}
                        title="Post Entry"
                      >
                        ✅
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => onDelete(entry._id)}
                        title="Delete Entry"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                  {entry.status === 'posted' && (
                    <span className="view-only">View Only</span>
                  )}
                  {entry.status === 'cancelled' && (
                    <span className="cancelled">Cancelled</span>
                  )}
                </td>
              </tr>
            ))}
            {journalEntries.length === 0 && (
              <tr>
                <td colSpan={8} className="no-data">
                  No journal entries found. Create your first entry to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JournalTab;