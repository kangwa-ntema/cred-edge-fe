// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/wizard-steps/ReviewStep.tsx

import React from 'react';
import './WizardSteps.scss'


const ReviewStep = ({ data, onEdit }) => {
  const getProductCategoryIcon = (category) => {
    const icons = {
      personal: '👤',
      business: '🏢',
      agricultural: '🌾',
      mortgage: '🏠',
      auto: '🚗',
      collateralized: '🛡️',
      payslip: '💼',
      microfinance: '👥',
      educational: '🎓',
      emergency: '🚨',
      asset_finance: '💎',
      custom: '⚙️'
    };
    return icons[category] || '📊';
  };

  const getLoanTypeLabel = (type) => {
    const labels = {
      installment: 'Installment Loan',
      revolving: 'Revolving Credit',
      overdraft: 'Overdraft',
      line_of_credit: 'Line of Credit',
      payday: 'Payday Loan'
    };
    return labels[type] || type;
  };

  const formatAmount = (amountConfig) => {
    switch (amountConfig.type) {
      case 'range':
        return `${amountConfig.minAmount?.toLocaleString()} - ${amountConfig.maxAmount?.toLocaleString()} ${amountConfig.currency}`;
      case 'fixed':
        return `${amountConfig.fixedAmount?.toLocaleString()} ${amountConfig.currency} (Fixed)`;
      case 'formula':
        return `Formula: ${amountConfig.amountFormula}`;
      default:
        return 'Custom amount configuration';
    }
  };

  const formatTerm = (termConfig) => {
    return `${termConfig.minTerm} - ${termConfig.maxTerm} ${termConfig.termUnit}`;
  };

  return (
    <div className="wizard-step-content review-step">
      <h3>🎉 Review & Create Loan Product</h3>
      <p className="step-description">Review your configuration before creating the product</p>

      <div className="review-sections">
        {/* Product Overview */}
        <div className="review-section">
          <div className="section-header">
            <h4>📋 Product Overview</h4>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => onEdit(0)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="product-badge">
              <span className="product-icon">{getProductCategoryIcon(data.productCategory)}</span>
              <div>
                <h5>{data.name}</h5>
                <p>Code: {data.code} • {getLoanTypeLabel(data.loanType)}</p>
              </div>
            </div>
            {data.description && <p className="product-description">{data.description}</p>}
          </div>
        </div>

        {/* Amount & Term */}
        <div className="review-section">
          <div className="section-header">
            <h4>💰 Amount & Term</h4>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => onEdit(1)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="detail-row">
              <span className="label">Loan Amount:</span>
              <span className="value">{formatAmount(data.configuration.amountConfig)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Loan Term:</span>
              <span className="value">{formatTerm(data.configuration.termConfig)}</span>
            </div>
          </div>
        </div>

        {/* Interest & Fees */}
        <div className="review-section">
          <div className="section-header">
            <h4>📈 Interest & Fees</h4>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => onEdit(2)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="detail-row">
              <span className="label">Interest Rate:</span>
              <span className="value">{data.configuration.interestConfig.baseRate}% per annum</span>
            </div>
            <div className="detail-row">
              <span className="label">Calculation Method:</span>
              <span className="value">{data.configuration.interestConfig.calculationMethod.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Fees:</span>
              <span className="value">{data.configuration.fees?.length || 0} fee(s) configured</span>
            </div>
          </div>
        </div>

        {/* Collateral & Security */}
        <div className="review-section">
          <div className="section-header">
            <h4>🛡️ Collateral & Security</h4>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => onEdit(3)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="detail-row">
              <span className="label">Collateral Required:</span>
              <span className="value">{data.configuration.collateralConfig.isRequired ? 'Yes' : 'No'}</span>
            </div>
            {data.configuration.collateralConfig.isRequired && (
              <>
                <div className="detail-row">
                  <span className="label">Accepted Types:</span>
                  <span className="value">{data.configuration.collateralConfig.collateralTypes?.join(', ') || 'None'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">LTV Ratio:</span>
                  <span className="value">{data.configuration.collateralConfig.minLtvRatio}% - {data.configuration.collateralConfig.maxLtvRatio}%</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Eligibility & Risk */}
        <div className="review-section">
          <div className="section-header">
            <h4>🎯 Eligibility & Risk</h4>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => onEdit(4)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="detail-row">
              <span className="label">Age Range:</span>
              <span className="value">{data.configuration.eligibility.minAge} - {data.configuration.eligibility.maxAge} years</span>
            </div>
            <div className="detail-row">
              <span className="label">Minimum Income:</span>
              <span className="value">{data.configuration.eligibility.minIncome?.toLocaleString()} ZMW/month</span>
            </div>
            <div className="detail-row">
              <span className="label">Risk Category:</span>
              <span className="value">{data.configuration.riskConfig.riskCategory.toUpperCase()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Required Documents:</span>
              <span className="value">{data.configuration.eligibility.requiredDocuments?.length || 0} document(s)</span>
            </div>
          </div>
        </div>

        {/* Repayment & Disbursement */}
        <div className="review-section">
          <div className="section-header">
            <h4>⏰ Repayment & Disbursement</h4>
            <button 
              type="button" 
              className="edit-btn"
              onClick={() => onEdit(5)}
            >
              Edit
            </button>
          </div>
          <div className="review-content">
            <div className="detail-row">
              <span className="label">Repayment Frequency:</span>
              <span className="value">{data.configuration.repaymentConfig.frequency}</span>
            </div>
            <div className="detail-row">
              <span className="label">Grace Period:</span>
              <span className="value">{data.configuration.repaymentConfig.gracePeriod} days</span>
            </div>
            <div className="detail-row">
              <span className="label">Disbursement Method:</span>
              <span className="value">{data.configuration.disbursementConfig.method.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="detail-row">
              <span className="label">Repayment Holidays:</span>
              <span className="value">{data.configuration.repaymentConfig.repaymentHolidays?.length || 0} holiday(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final Status Selection */}
      <div className="final-actions">
        <div className="status-selection">
          <label>Product Status:</label>
          <select
            value={data.status}
            onChange={(e) => onEdit(6, { status: e.target.value })}
          >
            <option value="draft">Draft (Save for later)</option>
            <option value="active">Active (Make available immediately)</option>
          </select>
        </div>

        <div className="action-buttons">
          <button type="button" className="btn-secondary">
            Save as Draft
          </button>
          <button type="submit" className="btn-primary">
            Create Product
          </button>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="configuration-summary">
        <h4>📊 Configuration Summary</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Product Type</span>
            <span className="summary-value">{getProductCategoryIcon(data.productCategory)} {data.productCategory.toUpperCase()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Target Amount</span>
            <span className="summary-value">{formatAmount(data.configuration.amountConfig)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Interest Rate</span>
            <span className="summary-value">{data.configuration.interestConfig.baseRate}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Risk Level</span>
            <span className="summary-value">{data.configuration.riskConfig.riskCategory.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;