// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/wizard-steps/InterestFeesStep.tsx

import React, { useState } from 'react';
import './WizardSteps.scss'

// Move feeTypes to module level so both components can access it
const feeTypes = [
  { value: 'processing', label: 'Processing Fee', icon: '📋' },
  { value: 'insurance', label: 'Insurance Fee', icon: '🛡️' },
  { value: 'legal', label: 'Legal Fee', icon: '⚖️' },
  { value: 'valuation', label: 'Valuation Fee', icon: '💰' },
  { value: 'late_payment', label: 'Late Payment Fee', icon: '⏰' },
  { value: 'early_settlement', label: 'Early Settlement Fee', icon: '🎯' }
];

const interestMethods = [
  { value: 'reducing_balance', label: 'Reducing Balance', description: 'Interest calculated on remaining balance' },
  { value: 'flat', label: 'Flat Rate', description: 'Interest calculated on original principal' },
  { value: 'annuity', label: 'Annuity', description: 'Equal monthly payments including principal + interest' },
  { value: 'simple', label: 'Simple Interest', description: 'Interest calculated only on principal' }
];

const InterestFeesStep = ({ data, onChange }) => {
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [editingFeeIndex, setEditingFeeIndex] = useState(null);

  const addOrUpdateFee = (feeData) => {
    const currentFees = data.configuration.fees || [];
    
    if (editingFeeIndex !== null) {
      // Update existing fee
      const updatedFees = [...currentFees];
      updatedFees[editingFeeIndex] = feeData;
      onChange({
        configuration: {
          ...data.configuration,
          fees: updatedFees
        }
      });
    } else {
      // Add new fee
      onChange({
        configuration: {
          ...data.configuration,
          fees: [...currentFees, feeData]
        }
      });
    }
    
    setShowFeeForm(false);
    setEditingFeeIndex(null);
  };

  const removeFee = (index) => {
    const updatedFees = data.configuration.fees.filter((_, i) => i !== index);
    onChange({
      configuration: {
        ...data.configuration,
        fees: updatedFees
      }
    });
  };

  return (
    <div className="wizard-step-content">
      <h3>📈 Interest & Fees Configuration</h3>
      <p className="step-description">Set interest rates and applicable fees</p>

      {/* Interest Configuration */}
      <div className="config-section">
        <h4>💵 Interest Rate Settings</h4>
        
        <div className="interest-method-selector">
          {interestMethods.map(method => (
            <div 
              key={method.value}
              className={`method-card ${data.configuration.interestConfig.calculationMethod === method.value ? 'active' : ''}`}
              onClick={() => onChange({
                configuration: {
                  ...data.configuration,
                  interestConfig: { 
                    ...data.configuration.interestConfig, 
                    calculationMethod: method.value 
                  }
                }
              })}
            >
              <div className="method-info">
                <h5>{method.label}</h5>
                <p>{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Annual Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={data.configuration.interestConfig.baseRate}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  interestConfig: { 
                    ...data.configuration.interestConfig, 
                    baseRate: parseFloat(e.target.value) 
                  }
                }
              })}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Compounding Frequency</label>
            <select
              value={data.configuration.interestConfig.compoundingFrequency}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  interestConfig: { 
                    ...data.configuration.interestConfig, 
                    compoundingFrequency: e.target.value 
                  }
                }
              })}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
              <option value="none">None (Simple)</option>
            </select>
          </div>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            checked={data.configuration.interestConfig.isInterestCapitalized}
            onChange={(e) => onChange({
              configuration: {
                ...data.configuration,
                interestConfig: { 
                  ...data.configuration.interestConfig, 
                  isInterestCapitalized: e.target.checked 
                }
              }
            })}
          />
          <label>Capitalize interest (add to principal)</label>
        </div>
      </div>

      {/* Fees Configuration */}
      <div className="config-section">
        <div className="section-header">
          <h4>💰 Fees & Charges</h4>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setShowFeeForm(true)}
          >
            + Add Fee
          </button>
        </div>

        {data.configuration.fees?.map((fee, index) => (
          <div key={index} className="fee-item">
            <div className="fee-content">
              <span className="fee-icon">{feeTypes.find(f => f.value === fee.feeType)?.icon || '💰'}</span>
              <div className="fee-details">
                <h5>{fee.name}</h5>
                <p>
                  {fee.calculationType === 'fixed' 
                    ? `${fee.amount?.toLocaleString()} ZMW` 
                    : `${fee.percentage}% of loan amount`
                  } • {fee.timing}
                </p>
              </div>
            </div>
            <div className="fee-actions">
              <button 
                type="button"
                onClick={() => {
                  setEditingFeeIndex(index);
                  setShowFeeForm(true);
                }}
              >
                Edit
              </button>
              <button 
                type="button"
                onClick={() => removeFee(index)}
                className="danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {(!data.configuration.fees || data.configuration.fees.length === 0) && (
          <div className="empty-state">
            <p>No fees added yet. Click "Add Fee" to include processing, insurance, or other charges.</p>
          </div>
        )}
      </div>

      {/* Fee Form Modal */}
      {showFeeForm && (
        <FeeFormModal
          fee={editingFeeIndex !== null ? data.configuration.fees[editingFeeIndex] : null}
          onSubmit={addOrUpdateFee}
          onCancel={() => {
            setShowFeeForm(false);
            setEditingFeeIndex(null);
          }}
        />
      )}

      {/* Interest Calculation Preview */}
      <div className="config-preview">
        <h4>🧮 Calculation Preview</h4>
        <div className="preview-card">
          <p><strong>Method:</strong> {interestMethods.find(m => m.value === data.configuration.interestConfig.calculationMethod)?.label}</p>
          <p><strong>Rate:</strong> {data.configuration.interestConfig.baseRate}% per annum</p>
          <p><strong>Compounding:</strong> {data.configuration.interestConfig.compoundingFrequency}</p>
          <p><strong>Fees:</strong> {data.configuration.fees?.length || 0} fee(s) configured</p>
        </div>
      </div>
    </div>
  );
};

// Fee Form Modal Component
const FeeFormModal = ({ fee, onSubmit, onCancel }) => {
  const [feeData, setFeeData] = useState(fee || {
    name: '',
    feeType: 'processing',
    calculationType: 'fixed',
    amount: 0,
    percentage: 0,
    timing: 'upfront',
    isRefundable: false
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{fee ? 'Edit Fee' : 'Add New Fee'}</h3>
        
        <div className="form-grid-2">
          <div className="form-group">
            <label>Fee Name *</label>
            <input
              type="text"
              value={feeData.name}
              onChange={(e) => setFeeData({ ...feeData, name: e.target.value })}
              placeholder="e.g., Processing Fee"
            />
          </div>

          <div className="form-group">
            <label>Fee Type</label>
            <select
              value={feeData.feeType}
              onChange={(e) => setFeeData({ ...feeData, feeType: e.target.value })}
            >
              {feeTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Calculation Method</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="fixed"
                checked={feeData.calculationType === 'fixed'}
                onChange={(e) => setFeeData({ ...feeData, calculationType: e.target.value })}
              />
              Fixed Amount
            </label>
            <label>
              <input
                type="radio"
                value="percentage"
                checked={feeData.calculationType === 'percentage'}
                onChange={(e) => setFeeData({ ...feeData, calculationType: e.target.value })}
              />
              Percentage of Loan
            </label>
          </div>
        </div>

        {feeData.calculationType === 'fixed' ? (
          <div className="form-group">
            <label>Amount (ZMW)</label>
            <input
              type="number"
              value={feeData.amount}
              onChange={(e) => setFeeData({ ...feeData, amount: parseFloat(e.target.value) })}
              min="0"
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Percentage (%)</label>
            <input
              type="number"
              value={feeData.percentage}
              onChange={(e) => setFeeData({ ...feeData, percentage: parseFloat(e.target.value) })}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        )}

        <div className="form-group">
          <label>When is this fee charged?</label>
          <select
            value={feeData.timing}
            onChange={(e) => setFeeData({ ...feeData, timing: e.target.value })}
          >
            <option value="upfront">Upfront (at disbursement)</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
            <option value="at_maturity">At Maturity</option>
            <option value="on_late_payment">On Late Payment</option>
          </select>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            checked={feeData.isRefundable}
            onChange={(e) => setFeeData({ ...feeData, isRefundable: e.target.checked })}
          />
          <label>This fee is refundable</label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="button" onClick={() => onSubmit(feeData)}>Save Fee</button>
        </div>
      </div>
    </div>
  );
};

export default InterestFeesStep;