// fe/src/components/PlatformAdminDashboard/AccountingManagement/GeneralJournal.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/authContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../AccountingManagement.scss';

interface GeneralJournalProps {
  switchView: (view: string) => void;
}

const GeneralJournal: React.FC<GeneralJournalProps> = ({ switchView }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock journal entries data
    const mockEntries = [
      {
        id: 1,
        entryNumber: 'JRNL-001',
        date: '2024-01-15',
        description: 'Office rent payment',
        lines: [
          { account: 'Rent Expense', debit: 1500, credit: 0 },
          { account: 'Cash', debit: 0, credit: 1500 }
        ],
        status: 'posted'
      },
      {
        id: 2,
        entryNumber: 'JRNL-002',
        date: '2024-01-20',
        description: 'Service revenue',
        lines: [
          { account: 'Cash', debit: 5000, credit: 0 },
          { account: 'Service Revenue', debit: 0, credit: 5000 }
        ],
        status: 'posted'
      }
    ];
    
    setEntries(mockEntries);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading Journal Entries...</div>;
  }

  return (
    <div className="accountingSection">
      <div className="sectionHeader">
        <h2>General Journal</h2>
        <button className="btn-primary" onClick={() => {/* Add new entry logic */}}>
          New Journal Entry
        </button>
      </div>

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Entry #</th>
              <th>Date</th>
              <th>Description</th>
              <th>Debit Total</th>
              <th>Credit Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.entryNumber}</td>
                <td>{entry.date}</td>
                <td>{entry.description}</td>
                <td>${entry.lines.reduce((sum: number, line: any) => sum + line.debit, 0)}</td>
                <td>${entry.lines.reduce((sum: number, line: any) => sum + line.credit, 0)}</td>
                <td>
                  <span className={`status-badge status-${entry.status}`}>
                    {entry.status}
                  </span>
                </td>
                <td>
                  <button className="btn-secondary">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default GeneralJournal;