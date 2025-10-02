// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/ProductCreationWizard.tsx

import './ProductCreationWizard.scss';
import React, { useState } from 'react';
import { type LoanProduct, type CreateLoanProductData } from '../../../../../types/loans';

// Import all step components
import AmountTermStep from '../wizard-steps/AmountTermStep';
import CollateralStep from '../wizard-steps/CollateralStep';
import EligibilityStep from '../wizard-steps/EligibilityStep';
import InterestFeesStep from '../wizard-steps/InterestFeesStep';
import RepaymentStep from '../wizard-steps/RepaymentStep';
import ReviewStep from '../wizard-steps/ReviewStep';



interface ProductCreationWizardProps {
  onComplete: (productData: CreateLoanProductData) => void;
  onCancel: () => void;
  existingProduct?: LoanProduct;
  template?: any;
}

// Move the function outside the component or define it before useState
const getDefaultProductData = (): CreateLoanProductData => ({
  name: '',
  code: '',
  description: '',
  productCategory: 'personal',
  loanType: 'installment',
  configuration: {
    amountConfig: {
      type: 'range',
      minAmount: 0,
      maxAmount: 100000,
      currency: 'ZMW'
    },
    termConfig: {
      type: 'range',
      minTerm: 1,
      maxTerm: 36,
      termUnit: 'months'
    },
    interestConfig: {
      calculationMethod: 'reducing_balance',
      rateType: 'fixed',
      baseRate: 15,
      compoundingFrequency: 'monthly'
    },
    fees: [],
    collateralConfig: {
      isRequired: false,
      collateralTypes: [],
      minLtvRatio: 50,
      maxLtvRatio: 80
    },
    eligibility: {
      minAge: 18,
      maxAge: 65,
      minIncome: 0
    },
    repaymentConfig: {
      frequency: 'monthly',
      gracePeriod: 0,
      allowEarlyRepayment: true
    },
    riskConfig: {
      riskCategory: 'medium',
      maxDebtToIncomeRatio: 40
    },
    disbursementConfig: {
      method: 'lump_sum',
      disbursementChannels: ['bank_transfer']
    }
  },
  approvalWorkflow: {
    type: 'manual',
    requiredApprovals: 1
  },
  status: 'draft'
});

const ProductCreationWizard: React.FC<ProductCreationWizardProps> = ({
  onComplete,
  onCancel,
  existingProduct,
  template
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initialize with template data if provided, otherwise use default or existing product
  const initialData = template 
    ? { ...getDefaultProductData(), ...template } 
    : existingProduct || getDefaultProductData();
    
  const [productData, setProductData] = useState<CreateLoanProductData>(initialData);

  const steps = [
    'Product Basics',
    'Amount & Term',
    'Interest & Fees',
    'Collateral & Security',
    'Eligibility & Risk',
    'Repayment & Disbursement',
    'Review & Create'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(productData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProductData = (updates: Partial<CreateLoanProductData>) => {
    setProductData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep data={productData} onChange={updateProductData} />;
      case 1:
        return <AmountTermStep data={productData} onChange={updateProductData} />;
      case 2:
        return <InterestFeesStep data={productData} onChange={updateProductData} />;
      case 3:
        return <CollateralStep data={productData} onChange={updateProductData} />;
      case 4:
        return <EligibilityStep data={productData} onChange={updateProductData} />;
      case 5:
        return <RepaymentStep data={productData} onChange={updateProductData} />;
      case 6:
        return <ReviewStep data={productData} onEdit={setCurrentStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2>{existingProduct ? 'Edit Loan Product' : 'Create New Loan Product'}</h2>
        <div className="wizard-steps">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`wizard-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-content">
        {renderStepContent()}
      </div>

      <div className="wizard-actions">
        <button onClick={handleBack} disabled={currentStep === 0}>
          Back
        </button>
        <button onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Create Product' : 'Next'}
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

// BasicInfoStep component (keep this one as it's defined in the same file)
const BasicInfoStep = ({ data, onChange }) => (
  <div className="wizard-step-content">
    <h3>Product Basics</h3>
    <div className="form-grid">
      <div className="form-group">
        <label>Product Name *</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., Small Business Loan"
        />
      </div>
      
      <div className="form-group">
        <label>Product Code *</label>
        <input
          type="text"
          value={data.code}
          onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
          placeholder="e.g., SBL-001"
        />
      </div>
      
      <div className="form-group">
        <label>Product Category</label>
        <select
          value={data.productCategory}
          onChange={(e) => onChange({ productCategory: e.target.value })}
        >
          <option value="personal">Personal Loan</option>
          <option value="business">Business Loan</option>
          <option value="agricultural">Agricultural Loan</option>
          <option value="mortgage">Mortgage</option>
          <option value="auto">Auto Loan</option>
          <option value="collateralized">Collateralized Loan</option>
          <option value="payslip">Salary-Backed Loan</option>
          <option value="microfinance">Microfinance Loan</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Loan Type</label>
        <select
          value={data.loanType}
          onChange={(e) => onChange({ loanType: e.target.value })}
        >
          <option value="installment">Installment Loan</option>
          <option value="revolving">Revolving Credit</option>
          <option value="line_of_credit">Line of Credit</option>
          <option value="overdraft">Overdraft</option>
          <option value="payday">Payday Loan</option>
        </select>
      </div>
    </div>
  </div>
);

export default ProductCreationWizard;