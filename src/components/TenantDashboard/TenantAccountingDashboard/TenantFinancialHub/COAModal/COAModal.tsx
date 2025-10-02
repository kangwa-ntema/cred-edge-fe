// fe/src/components/TenantDashboard/FinancialHub/COAModal/COAModal.tsx

import React, { useState, useEffect } from 'react';
import { type ChartOfAccount } from '../../../../../types/accounting';

interface COAModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  account?: ChartOfAccount | null;
  chartOfAccounts: ChartOfAccount[];
}

const COAModal: React.FC<COAModalProps> = ({
  show,
  onClose,
  onSave,
  account,
  chartOfAccounts
}) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    accountType: '',
    normalBalance: '',
    description: '',
    parentAccount: '',
    isActive: true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (account) {
      setFormData({
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        accountType: account.accountType,
        normalBalance: account.normalBalance,
        description: account.description || '',
        parentAccount: account.parentAccount?._id || '',
        isActive: account.isActive !== false
      });
    } else {
      setFormData({
        accountNumber: '',
        accountName: '',
        accountType: '',
        normalBalance: '',
        description: '',
        parentAccount: '',
        isActive: true
      });
    }
    setErrors({});
  }, [account, show]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^[0-9]+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must contain only numbers';
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required';
    }

    if (!formData.normalBalance) {
      newErrors.normalBalance = 'Normal balance is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set normal balance based on account type
    if (field === 'accountType') {
      const normalBalance = getDefaultNormalBalance(value as string);
      if (normalBalance) {
        setFormData(prev => ({ ...prev, normalBalance }));
      }
    }
  };

  const getDefaultNormalBalance = (accountType: string): string => {
    const defaults: { [key: string]: string } = {
      asset: 'debit',
      expense: 'debit',
      liability: 'credit',
      equity: 'credit',
      revenue: 'credit'
    };
    return defaults[accountType] || '';
  };

  const getAccountTypeOptions = () => [
    { value: '', label: 'Select Account Type' },
    { value: 'asset', label: 'Asset' },
    { value: 'liability', label: 'Liability' },
    { value: 'equity', label: 'Equity' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'expense', label: 'Expense' }
  ];

  const getNormalBalanceOptions = () => [
    { value: '', label: 'Select Normal Balance' },
    { value: 'debit', label: 'Debit' },
    { value: 'credit', label: 'Credit' }
  ];

  const getParentAccountOptions = () => {
    const parentAccounts = chartOfAccounts.filter(acc => 
      ['asset', 'liability', 'equity'].includes(acc.accountType) && acc.isActive
    );
    
    return [
      { value: '', label: 'No Parent Account' },
      ...parentAccounts.map(acc => ({
        value: acc._id,
        label: `${acc.accountNumber} - ${acc.accountName}`
      }))
    ];
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{account ? 'Edit Account' : 'New Account'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Account Number *</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  placeholder="e.g., 1000"
                  required
                />
                {errors.accountNumber && <span className="error">{errors.accountNumber}</span>}
              </div>

              <div className="form-group">
                <label>Status</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Active Account
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Account Name *</label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => handleChange('accountName', e.target.value)}
                placeholder="e.g., Cash, Accounts Payable"
                required
              />
              {errors.accountName && <span className="error">{errors.accountName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Account Type *</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleChange('accountType', e.target.value)}
                  required
                >
                  {getAccountTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.accountType && <span className="error">{errors.accountType}</span>}
              </div>

              <div className="form-group">
                <label>Normal Balance *</label>
                <select
                  value={formData.normalBalance}
                  onChange={(e) => handleChange('normalBalance', e.target.value)}
                  required
                >
                  {getNormalBalanceOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.normalBalance && <span className="error">{errors.normalBalance}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Parent Account</label>
              <select
                value={formData.parentAccount}
                onChange={(e) => handleChange('parentAccount', e.target.value)}
              >
                {getParentAccountOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                placeholder="Optional account description..."
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {account ? 'Update' : 'Create'} Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default COAModal;