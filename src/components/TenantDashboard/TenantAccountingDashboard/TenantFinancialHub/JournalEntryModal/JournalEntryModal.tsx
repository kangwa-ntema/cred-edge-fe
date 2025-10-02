// fe/src/components/TenantDashboard/FinancialHub/JournalEntryModal/JournalEntryModal.tsx
import React, { useState, useEffect } from 'react';
import { type JournalEntry, type ChartOfAccount } from '../../../../../types/accounting';

interface JournalEntryModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  chartOfAccounts: ChartOfAccount[];
  entry?: JournalEntry | null;
}

const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  show,
  onClose,
  onSave,
  chartOfAccounts,
  entry
}) => {
  const [formData, setFormData] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    lines: [{ account: '', debit: 0, credit: 0, description: '' }]
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (entry) {
      setFormData({
        entryDate: entry.entryDate.split('T')[0],
        description: entry.description,
        reference: entry.reference || '',
        lines: entry.lines.map(line => ({
          account: line.account._id || line.account,
          debit: line.debit || 0,
          credit: line.credit || 0,
          description: line.description || ''
        }))
      });
    } else {
      setFormData({
        entryDate: new Date().toISOString().split('T')[0],
        description: '',
        reference: '',
        lines: [{ account: '', debit: 0, credit: 0, description: '' }]
      });
    }
    setErrors({});
  }, [entry, show]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.lines.length < 2) {
      newErrors.lines = 'At least two lines are required';
    }

    const totalDebit = formData.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      newErrors.balance = `Debit and Credit totals must be equal (Debit: ${totalDebit}, Credit: ${totalCredit})`;
    }

    formData.lines.forEach((line, index) => {
      if (!line.account) {
        newErrors[`line-${index}-account`] = 'Account is required';
      }
      if (line.debit && line.credit) {
        newErrors[`line-${index}-both`] = 'Cannot have both debit and credit';
      }
      if (!line.debit && !line.credit) {
        newErrors[`line-${index}-amount`] = 'Either debit or credit is required';
      }
      if (line.debit < 0 || line.credit < 0) {
        newErrors[`line-${index}-negative`] = 'Amount cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, { account: '', debit: 0, credit: 0, description: '' }]
    }));
  };

  const removeLine = (index: number) => {
    if (formData.lines.length > 1) {
      setFormData(prev => ({
        ...prev,
        lines: prev.lines.filter((_, i) => i !== index)
      }));
    }
  };

  const updateLine = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  // Calculate totals
  const totalDebit = formData.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = formData.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h3>{entry ? 'Edit Journal Entry' : 'New Journal Entry'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.entryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reference</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="Optional reference number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter journal entry description"
                required
              />
              {errors.description && <span className="error">{errors.description}</span>}
            </div>

            <div className="journal-lines">
              <div className="lines-header">
                <h4>Journal Lines</h4>
                <div className="totals">
                  <span className={`total-debit ${!isBalanced ? 'unbalanced' : ''}`}>
                    Total Debit: {totalDebit.toFixed(2)}
                  </span>
                  <span className={`total-credit ${!isBalanced ? 'unbalanced' : ''}`}>
                    Total Credit: {totalCredit.toFixed(2)}
                  </span>
                  <span className={`balance-status ${isBalanced ? 'balanced' : 'unbalanced'}`}>
                    {isBalanced ? '✓ Balanced' : '✗ Unbalanced'}
                  </span>
                </div>
              </div>
              
              {errors.lines && <span className="error">{errors.lines}</span>}
              {errors.balance && <span className="error">{errors.balance}</span>}
              
              {formData.lines.map((line, index) => (
                <div key={index} className="journal-line">
                  <div className="form-group">
                    <label>Account *</label>
                    <select
                      value={line.account}
                      onChange={(e) => updateLine(index, 'account', e.target.value)}
                      required
                    >
                      <option value="">Select Account</option>
                      {chartOfAccounts
                        .filter(acc => acc.isActive)
                        .map(account => (
                        <option key={account._id} value={account._id}>
                          {account.accountNumber} - {account.accountName}
                        </option>
                      ))}
                    </select>
                    {errors[`line-${index}-account`] && (
                      <span className="error">{errors[`line-${index}-account`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Debit</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.debit || ''}
                      onChange={(e) => updateLine(index, 'debit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label>Credit</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.credit || ''}
                      onChange={(e) => updateLine(index, 'credit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => updateLine(index, 'description', e.target.value)}
                      placeholder="Line description (optional)"
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-remove-line"
                    onClick={() => removeLine(index)}
                    disabled={formData.lines.length <= 1}
                  >
                    Remove
                  </button>

                  {(errors[`line-${index}-both`] || errors[`line-${index}-amount`] || errors[`line-${index}-negative`]) && (
                    <span className="error">
                      {errors[`line-${index}-both`] || errors[`line-${index}-amount`] || errors[`line-${index}-negative`]}
                    </span>
                  )}
                </div>
              ))}

              <button type="button" className="btn-add-line" onClick={addLine}>
                + Add Line
              </button>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!isBalanced}>
                {entry ? 'Update' : 'Create'} Journal Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryModal;