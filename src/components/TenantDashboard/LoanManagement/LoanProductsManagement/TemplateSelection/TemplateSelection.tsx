// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/TemplateSelection/TemplateSelection.tsx

import React from 'react';
import { LOAN_PRODUCT_TEMPLATES, TEMPLATE_CATEGORIES } from './ProductTemplates';

interface TemplateSelectionProps {
  onTemplateSelect: (template: any) => void;
  onCustomStart: () => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  onTemplateSelect,
  onCustomStart
}) => {
  const renderTemplateCard = (templateKey: string, template: any) => {
    // Safe access to nested properties with fallbacks
    const amountConfig = template?.configuration?.amountConfig || {};
    const termConfig = template?.configuration?.termConfig || {};
    const interestConfig = template?.configuration?.interestConfig || {};
    const collateralConfig = template?.configuration?.collateralConfig || {};

    const minAmount = amountConfig.minAmount || 0;
    const maxAmount = amountConfig.maxAmount || 0;
    const currency = amountConfig.currency || 'ZMW';
    const minTerm = termConfig.minTerm || 0;
    const maxTerm = termConfig.maxTerm || 0;
    const termUnit = termConfig.termUnit || 'months';
    const interestRate = interestConfig.baseRate || 0;
    const isSecured = collateralConfig.isRequired || false;

    return (
      <div key={templateKey} className="template-card" onClick={() => onTemplateSelect(template)}>
        <div className="template-icon">
          {getTemplateIcon(template?.productCategory)}
        </div>
        <div className="template-content">
          <h4>{template?.name || 'Unnamed Template'}</h4>
          <p>{minAmount.toLocaleString()} - {maxAmount.toLocaleString()} {currency}</p>
          <p>{minTerm}-{maxTerm} {termUnit}</p>
          <div className="template-features">
            <span className={`feature-tag ${isSecured ? 'secured' : 'unsecured'}`}>
              {isSecured ? 'Secured' : 'Unsecured'}
            </span>
            <span className="feature-tag interest">{interestRate}%</span>
          </div>
        </div>
      </div>
    );
  };

  const getTemplateIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      mortgage: '🏠',
      auto: '🚗',
      agricultural: '🌾',
      payslip: '💼',
      microfinance: '👥',
      business: '🏢',
      personal: '👤'
    };
    return icons[category || ''] || '📊';
  };

  // Safe template access function
  const getTemplate = (key: string) => {
    const template = LOAN_PRODUCT_TEMPLATES[key as keyof typeof LOAN_PRODUCT_TEMPLATES];
    if (!template) {
      console.warn(`Template not found: ${key}`);
      return null;
    }
    return template;
  };

  return (
    <div className="template-selection">
      <div className="template-header">
        <h2>Choose a Loan Product Template</h2>
        <p>Start with a pre-configured template or build from scratch</p>
      </div>

      <div className="template-categories">
        {/* Collateral-Based Loans */}
        <div className="template-category">
          <h3>🏠 Collateral-Based Loans</h3>
          <div className="template-grid">
            {TEMPLATE_CATEGORIES.COLLATERAL_BASED.map(key => {
              const template = getTemplate(key);
              return template ? renderTemplateCard(key, template) : null;
            })}
          </div>
        </div>

        {/* Salary-Backed Loans */}
        <div className="template-category">
          <h3>💼 Salary-Backed Loans</h3>
          <div className="template-grid">
            {(() => {
              const template = getTemplate('SALARY_ADVANCE');
              return template ? renderTemplateCard('SALARY_ADVANCE', template) : null;
            })()}
          </div>
        </div>

        {/* Agricultural Loans */}
        <div className="template-category">
          <h3>🌾 Agricultural Loans</h3>
          <div className="template-grid">
            {(() => {
              const template = getTemplate('AGRICULTURAL');
              return template ? renderTemplateCard('AGRICULTURAL', template) : null;
            })()}
          </div>
        </div>

        {/* Microfinance */}
        <div className="template-category">
          <h3>👥 Microfinance Loans</h3>
          <div className="template-grid">
            {(() => {
              const template = getTemplate('GROUP_MICROLOAN');
              return template ? renderTemplateCard('GROUP_MICROLOAN', template) : null;
            })()}
          </div>
        </div>

        {/* Business Loans */}
        <div className="template-category">
          <h3>🏢 Business Loans</h3>
          <div className="template-grid">
            {(() => {
              const template = getTemplate('SME_LOAN');
              return template ? renderTemplateCard('SME_LOAN', template) : null;
            })()}
          </div>
        </div>

        {/* Personal Loans */}
        <div className="template-category">
          <h3>👤 Personal Loans</h3>
          <div className="template-grid">
            {(() => {
              const template = getTemplate('PERSONAL_LOAN');
              return template ? renderTemplateCard('PERSONAL_LOAN', template) : null;
            })()}
          </div>
        </div>
      </div>

      <div className="custom-option">
        <div className="custom-card" onClick={onCustomStart}>
          <div className="custom-icon">⚡</div>
          <div className="custom-content">
            <h4>Custom Loan Product</h4>
            <p>Build from scratch with advanced configuration</p>
            <button className="custom-btn">Start Custom</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;