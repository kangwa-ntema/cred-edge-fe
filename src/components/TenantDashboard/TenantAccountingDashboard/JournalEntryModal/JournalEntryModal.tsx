// fe/src/components/TenantDashboard/AccountingDashboard/JournalEntryModal/JournalEntryModal.tsx
import React, { useState } from 'react';

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveJournal: (journalData: any) => Promise<void>;
  chartOfAccounts: any[];
}

const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  isOpen,
  onClose,
  onSaveJournal,
  chartOfAccounts
}) => {
  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    lines: [
      { account: '', debit: 0, credit: 0, description: '' },
      { account: '', debit: 0, credit: 0, description: '' }
    ]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSaveJournal(formData);
      setFormData({
        entryDate: new Date().toISOString().split('T')[0],
        description: '',
        reference: '',
        lines: [
          { account: '', debit: 0, credit: 0, description: '' },
          { account: '', debit: 0, credit: 0, description: '' }
        ]
      });
      onClose();
    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    const updatedLines = [...formData.lines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    setFormData(prev => ({ ...prev, lines: updatedLines }));
  };

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, { account: '', debit: 0, credit: 0, description: '' }]
    }));
  };

  const removeLine = (index: number) => {
    if (formData.lines.length > 2) {
      const updatedLines = formData.lines.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, lines: updatedLines }));
    }
  };

  const calculateTotals = () => {
    const totalDebit = formData.lines.reduce((sum, line) => sum + (parseFloat(line.debit.toString()) || 0), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + (parseFloat(line.credit.toString()) || 0), 0);
    return { totalDebit, totalCredit, isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 };
  };

  const { totalDebit, totalCredit, isBalanced } = calculateTotals();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>New Journal Entry</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Entry Date:</label>
            <input
              type="date"
              value={formData.entryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter journal entry description"
              required
            />
          </div>

          <div className="form-group">
            <label>Reference:</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Optional reference"
            />
          </div>

          <div className="journal-lines">
            <h4>Journal Lines</h4>
            {formData.lines.map((line, index) => (
              <div key={index} className="journal-line">
                <div className="line-header">
                  <h5>Line {index + 1}</h5>
                  {formData.lines.length > 2 && (
                    <button type="button" onClick={() => removeLine(index)} className="btn-remove">
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="line-fields">
                  <div className="form-group">
                    <label>Account:</label>
                    <select
                      value={line.account}
                      onChange={(e) => handleLineChange(index, 'account', e.target.value)}
                      required
                    >
                      <option value="">Select Account</option>
                      {chartOfAccounts.map(account => (
                        <option key={account._id} value={account._id}>
                          {account.accountNumber} - {account.accountName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Debit:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={line.debit}
                      onChange={(e) => handleLineChange(index, 'debit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label>Credit:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={line.credit}
                      onChange={(e) => handleLineChange(index, 'credit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label>Line Description:</label>
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                      placeholder="Optional line description"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={addLine} className="btn-add-line">
              Add Another Line
            </button>
          </div>

          <div className="totals-section">
            <div className={`total-display ${isBalanced ? 'balanced' : 'unbalanced'}`}>
              <span>Total Debit: ${totalDebit.toFixed(2)}</span>
              <span>Total Credit: ${totalCredit.toFixed(2)}</span>
              <span>Status: {isBalanced ? '✓ Balanced' : '✗ Unbalanced'}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !isBalanced || !formData.description}>
              {loading ? 'Creating...' : 'Create Journal Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalEntryModal;