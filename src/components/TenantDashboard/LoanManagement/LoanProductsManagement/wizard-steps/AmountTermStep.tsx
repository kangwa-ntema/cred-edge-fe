// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/wizard-steps/AmountTermStep.tsx

import React from 'react';
import './WizardSteps.scss'

const AmountTermStep = ({ data, onChange }) => {
  const amountTypes = [
    { value: 'range', label: 'Amount Range', description: 'Client chooses within min/max' },
    { value: 'fixed', label: 'Fixed Amount', description: 'Same amount for all clients' },
    { value: 'tiered', label: 'Tiered Amounts', description: 'Different amounts for different client tiers' },
    { value: 'formula', label: 'Formula-Based', description: 'Calculate based on client income/assets' }
  ];

  const termUnits = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' }
  ];

  return (
    <div className="wizard-step-content">
      <h3>💰 Amount & Term Configuration</h3>
      <p className="step-description">Define how much clients can borrow and for how long</p>

      {/* Amount Configuration */}
      <div className="config-section">
        <h4>Loan Amount Settings</h4>
        
        <div className="amount-type-selector">
          {amountTypes.map(type => (
            <div 
              key={type.value}
              className={`amount-type-card ${data.configuration.amountConfig.type === type.value ? 'active' : ''}`}
              onClick={() => onChange({
                configuration: {
                  ...data.configuration,
                  amountConfig: { ...data.configuration.amountConfig, type: type.value }
                }
              })}
            >
              <div className="type-icon">💳</div>
              <div className="type-info">
                <h5>{type.label}</h5>
                <p>{type.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Amount Configuration Based on Type */}
        {data.configuration.amountConfig.type === 'range' && (
          <div className="amount-range-config">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Minimum Amount (ZMW)</label>
                <input
                  type="number"
                  value={data.configuration.amountConfig.minAmount}
                  onChange={(e) => onChange({
                    configuration: {
                      ...data.configuration,
                      amountConfig: { 
                        ...data.configuration.amountConfig, 
                        minAmount: parseInt(e.target.value) 
                      }
                    }
                  })}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Maximum Amount (ZMW)</label>
                <input
                  type="number"
                  value={data.configuration.amountConfig.maxAmount}
                  onChange={(e) => onChange({
                    configuration: {
                      ...data.configuration,
                      amountConfig: { 
                        ...data.configuration.amountConfig, 
                        maxAmount: parseInt(e.target.value) 
                      }
                    }
                  })}
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {data.configuration.amountConfig.type === 'fixed' && (
          <div className="form-group">
            <label>Fixed Loan Amount (ZMW)</label>
            <input
              type="number"
              value={data.configuration.amountConfig.fixedAmount || 0}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  amountConfig: { 
                    ...data.configuration.amountConfig, 
                    fixedAmount: parseInt(e.target.value) 
                  }
                }
              })}
              min="0"
            />
          </div>
        )}

        {data.configuration.amountConfig.type === 'formula' && (
          <div className="formula-config">
            <div className="form-group">
              <label>Amount Calculation Formula</label>
              <div className="formula-builder">
                <input
                  type="text"
                  value={data.configuration.amountConfig.amountFormula || ''}
                  onChange={(e) => onChange({
                    configuration: {
                      ...data.configuration,
                      amountConfig: { 
                        ...data.configuration.amountConfig, 
                        amountFormula: e.target.value 
                      }
                    }
                  })}
                  placeholder="e.g., client.monthlyIncome * 3"
                />
                <div className="formula-variables">
                  <span>Available variables: </span>
                  <button type="button" onClick={() => onChange({
                    configuration: {
                      ...data.configuration,
                      amountConfig: { 
                        ...data.configuration.amountConfig, 
                        amountFormula: (data.configuration.amountConfig.amountFormula || '') + 'client.monthlyIncome'
                      }
                    }
                  })}>monthlyIncome</button>
                  <button type="button" onClick={() => onChange({
                    configuration: {
                      ...data.configuration,
                      amountConfig: { 
                        ...data.configuration.amountConfig, 
                        amountFormula: (data.configuration.amountConfig.amountFormula || '') + 'collateral.value'
                      }
                    }
                  })}>collateralValue</button>
                  <button type="button" onClick={() => onChange({
                    configuration: {
                      ...data.configuration,
                      amountConfig: { 
                        ...data.configuration.amountConfig, 
                        amountFormula: (data.configuration.amountConfig.amountFormula || '') + 'business.ageMonths'
                      }
                    }
                  })}>businessAge</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Term Configuration */}
      <div className="config-section">
        <h4>⏰ Loan Term Settings</h4>
        
        <div className="form-grid-2">
          <div className="form-group">
            <label>Minimum Term</label>
            <input
              type="number"
              value={data.configuration.termConfig.minTerm}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  termConfig: { 
                    ...data.configuration.termConfig, 
                    minTerm: parseInt(e.target.value) 
                  }
                }
              })}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Maximum Term</label>
            <input
              type="number"
              value={data.configuration.termConfig.maxTerm}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  termConfig: { 
                    ...data.configuration.termConfig, 
                    maxTerm: parseInt(e.target.value) 
                  }
                }
              })}
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Term Unit</label>
          <select
            value={data.configuration.termConfig.termUnit}
            onChange={(e) => onChange({
              configuration: {
                ...data.configuration,
                termConfig: { 
                  ...data.configuration.termConfig, 
                  termUnit: e.target.value 
                }
              }
            })}
          >
            {termUnits.map(unit => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            checked={data.configuration.termConfig.allowCustomTerm || false}
            onChange={(e) => onChange({
              configuration: {
                ...data.configuration,
                termConfig: { 
                  ...data.configuration.termConfig, 
                  allowCustomTerm: e.target.checked 
                }
              }
            })}
          />
          <label>Allow clients to choose custom terms within range</label>
        </div>
      </div>

      {/* Preview */}
      <div className="config-preview">
        <h4>📊 Configuration Preview</h4>
        <div className="preview-card">
          <p><strong>Amount:</strong> {
            data.configuration.amountConfig.type === 'range' 
              ? `${data.configuration.amountConfig.minAmount.toLocaleString()} - ${data.configuration.amountConfig.maxAmount.toLocaleString()} ZMW`
              : data.configuration.amountConfig.type === 'fixed'
              ? `${data.configuration.amountConfig.fixedAmount?.toLocaleString()} ZMW (Fixed)`
              : 'Formula-based amount'
          }</p>
          <p><strong>Term:</strong> {data.configuration.termConfig.minTerm}-{data.configuration.termConfig.maxTerm} {data.configuration.termConfig.termUnit}</p>
        </div>
      </div>
    </div>
  );
};

export default AmountTermStep;