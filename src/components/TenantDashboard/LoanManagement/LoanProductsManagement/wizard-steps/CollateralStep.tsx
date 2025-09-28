// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/wizard-steps/CollateralStep.tsx

import React from 'react';
import './WizardSteps.scss'


const CollateralStep = ({ data, onChange }) => {
  const collateralTypes = [
    { value: 'real_estate', label: 'Real Estate', icon: '🏠' },
    { value: 'vehicle', label: 'Vehicle', icon: '🚗' },
    { value: 'equipment', label: 'Equipment', icon: '⚙️' },
    { value: 'savings_account', label: 'Savings Account', icon: '💰' },
    { value: 'guarantor', label: 'Personal Guarantor', icon: '👤' },
    { value: 'land', label: 'Land', icon: '🌳' },
    { value: 'inventory', label: 'Inventory', icon: '📦' },
    { value: 'receivables', label: 'Receivables', icon: '🧾' },
    { value: 'jewelry', label: 'Jewelry', icon: '💎' },
    { value: 'livestock', label: 'Livestock', icon: '🐄' }
  ];

  const valuationMethods = [
    { value: 'market_value', label: 'Market Value' },
    { value: 'appraisal', label: 'Professional Appraisal' },
    { value: 'forced_sale', label: 'Forced Sale Value' },
    { value: 'book_value', label: 'Book Value' },
    { value: 'custom', label: 'Custom Valuation' }
  ];

  return (
    <div className="wizard-step-content">
      <h3>🛡️ Collateral & Security</h3>
      <p className="step-description">Define collateral requirements and security measures</p>

      {/* Collateral Requirement Toggle */}
      <div className="config-section">
        <div className="toggle-section">
          <div className="toggle-header">
            <h4>Collateral Requirement</h4>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.configuration.collateralConfig.isRequired}
                onChange={(e) => onChange({
                  configuration: {
                    ...data.configuration,
                    collateralConfig: { 
                      ...data.configuration.collateralConfig, 
                      isRequired: e.target.checked 
                    }
                  }
                })}
              />
              <span className="slider"></span>
            </label>
          </div>
          <p className="toggle-description">
            {data.configuration.collateralConfig.isRequired 
              ? 'This loan requires collateral security'
              : 'This is an unsecured loan (no collateral required)'
            }
          </p>
        </div>
      </div>

      {/* Collateral Configuration (only show if required) */}
      {data.configuration.collateralConfig.isRequired && (
        <>
          {/* Accepted Collateral Types */}
          <div className="config-section">
            <h4>Accepted Collateral Types</h4>
            <p>Select what types of assets can be used as collateral</p>
            
            <div className="collateral-type-grid">
              {collateralTypes.map(type => (
                <div 
                  key={type.value}
                  className={`collateral-type-card ${
                    data.configuration.collateralConfig.collateralTypes?.includes(type.value) ? 'selected' : ''
                  }`}
                  onClick={() => {
                    const currentTypes = data.configuration.collateralConfig.collateralTypes || [];
                    const newTypes = currentTypes.includes(type.value)
                      ? currentTypes.filter(t => t !== type.value)
                      : [...currentTypes, type.value];
                    
                    onChange({
                      configuration: {
                        ...data.configuration,
                        collateralConfig: { 
                          ...data.configuration.collateralConfig, 
                          collateralTypes: newTypes 
                        }
                      }
                    });
                  }}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Loan-to-Value Ratio */}
          <div className="config-section">
            <h4>📊 Loan-to-Value (LTV) Ratio</h4>
            <p>Maximum loan amount as percentage of collateral value</p>
            
            <div className="ltv-config">
              <div className="ltv-range">
                <div className="form-group">
                  <label>Minimum LTV Ratio (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={data.configuration.collateralConfig.minLtvRatio}
                    onChange={(e) => onChange({
                      configuration: {
                        ...data.configuration,
                        collateralConfig: { 
                          ...data.configuration.collateralConfig, 
                          minLtvRatio: parseInt(e.target.value) 
                        }
                      }
                    })}
                  />
                  <span className="range-value">{data.configuration.collateralConfig.minLtvRatio}%</span>
                </div>

                <div className="form-group">
                  <label>Maximum LTV Ratio (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={data.configuration.collateralConfig.maxLtvRatio}
                    onChange={(e) => onChange({
                      configuration: {
                        ...data.configuration,
                        collateralConfig: { 
                          ...data.configuration.collateralConfig, 
                          maxLtvRatio: parseInt(e.target.value) 
                        }
                      }
                    })}
                  />
                  <span className="range-value">{data.configuration.collateralConfig.maxLtvRatio}%</span>
                </div>
              </div>

              <div className="ltv-preview">
                <div className="ltv-indicator">
                  <div 
                    className="ltv-fill"
                    style={{ width: `${data.configuration.collateralConfig.maxLtvRatio}%` }}
                  ></div>
                </div>
                <p>Loan amount: up to {data.configuration.collateralConfig.maxLtvRatio}% of collateral value</p>
              </div>
            </div>
          </div>

          {/* Valuation & Insurance */}
          <div className="config-section">
            <h4>🔍 Valuation & Insurance</h4>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label>Valuation Method</label>
                <select
                  value={data.configuration.collateralConfig.valuationMethod}
                  onChange={(e) => onChange({
                    configuration: {
                      ...data.configuration,
                      collateralConfig: { 
                        ...data.configuration.collateralConfig, 
                        valuationMethod: e.target.value 
                      }
                    }
                  })}
                >
                  {valuationMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Collateral Management Fee (ZMW)</label>
                <input
                  type="number"
                  value={data.configuration.collateralConfig.collateralManagementFee || 0}
                  onChange={(e) => onChange({
                    configuration: {
                      ...data.configuration,
                      collateralConfig: { 
                        ...data.configuration.collateralConfig, 
                        collateralManagementFee: parseFloat(e.target.value) 
                      }
                    }
                  })}
                  min="0"
                />
              </div>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                checked={data.configuration.collateralConfig.insuranceRequired}
                onChange={(e) => onChange({
                  configuration: {
                    ...data.configuration,
                    collateralConfig: { 
                      ...data.configuration.collateralConfig, 
                      insuranceRequired: e.target.checked 
                    }
                  }
                })}
              />
              <label>Require insurance coverage on collateral</label>
            </div>
          </div>
        </>
      )}

      {/* Security Preview */}
      <div className="config-preview">
        <h4>🛡️ Security Summary</h4>
        <div className="preview-card">
          <p>
            <strong>Collateral:</strong> {
              data.configuration.collateralConfig.isRequired 
                ? `Required (${data.configuration.collateralConfig.collateralTypes?.length || 0} type(s) accepted)`
                : 'Not required'
            }
          </p>
          {data.configuration.collateralConfig.isRequired && (
            <>
              <p><strong>LTV Ratio:</strong> {data.configuration.collateralConfig.minLtvRatio}% - {data.configuration.collateralConfig.maxLtvRatio}%</p>
              <p><strong>Valuation:</strong> {valuationMethods.find(m => m.value === data.configuration.collateralConfig.valuationMethod)?.label}</p>
              <p><strong>Insurance:</strong> {data.configuration.collateralConfig.insuranceRequired ? 'Required' : 'Not required'}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollateralStep;