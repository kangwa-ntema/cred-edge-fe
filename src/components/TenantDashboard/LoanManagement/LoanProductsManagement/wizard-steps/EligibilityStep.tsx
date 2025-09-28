// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/wizard-steps/EligibilityStep.tsx
import React, { useState } from 'react';
import './WizardSteps.scss'

const EligibilityStep = ({ data, onChange }) => {
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDocIndex, setEditingDocIndex] = useState(null);

  const employmentTypes = [
    { value: 'formal', label: 'Formal Employment', icon: '💼' },
    { value: 'informal', label: 'Informal Employment', icon: '🛒' },
    { value: 'self_employed', label: 'Self-Employed', icon: '👨‍💼' },
    { value: 'unemployed', label: 'Unemployed', icon: '🏠' },
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'retired', label: 'Retired', icon: '👴' }
  ];

  const riskCategories = [
    { value: 'low', label: 'Low Risk', color: 'green', description: 'Prime borrowers, stable income' },
    { value: 'medium', label: 'Medium Risk', color: 'blue', description: 'Standard borrowers, reliable income' },
    { value: 'high', label: 'High Risk', color: 'orange', description: 'Higher risk, may need guarantors' },
    { value: 'very_high', label: 'Very High Risk', color: 'red', description: 'Special approval required' }
  ];

  const addOrUpdateDocument = (docData) => {
    const currentDocs = data.configuration.eligibility.requiredDocuments || [];
    
    if (editingDocIndex !== null) {
      const updatedDocs = [...currentDocs];
      updatedDocs[editingDocIndex] = docData;
      onChange({
        configuration: {
          ...data.configuration,
          eligibility: { 
            ...data.configuration.eligibility, 
            requiredDocuments: updatedDocs 
          }
        }
      });
    } else {
      onChange({
        configuration: {
          ...data.configuration,
          eligibility: { 
            ...data.configuration.eligibility, 
            requiredDocuments: [...currentDocs, docData] 
          }
        }
      });
    }
    
    setShowDocForm(false);
    setEditingDocIndex(null);
  };

  return (
    <div className="wizard-step-content">
      <h3>🎯 Eligibility & Risk Assessment</h3>
      <p className="step-description">Define who qualifies for this loan and risk parameters</p>

      {/* Basic Eligibility Criteria */}
      <div className="config-section">
        <h4>👤 Basic Client Eligibility</h4>
        
        <div className="form-grid-3">
          <div className="form-group">
            <label>Minimum Age</label>
            <input
              type="number"
              value={data.configuration.eligibility.minAge}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  eligibility: { 
                    ...data.configuration.eligibility, 
                    minAge: parseInt(e.target.value) 
                  }
                }
              })}
              min="18"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Maximum Age</label>
            <input
              type="number"
              value={data.configuration.eligibility.maxAge}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  eligibility: { 
                    ...data.configuration.eligibility, 
                    maxAge: parseInt(e.target.value) 
                  }
                }
              })}
              min="18"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Minimum Monthly Income (ZMW)</label>
            <input
              type="number"
              value={data.configuration.eligibility.minIncome}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  eligibility: { 
                    ...data.configuration.eligibility, 
                    minIncome: parseFloat(e.target.value) 
                  }
                }
              })}
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Accepted Employment Types</label>
          <div className="employment-type-grid">
            {employmentTypes.map(type => (
              <div 
                key={type.value}
                className={`employment-type-card ${
                  data.configuration.eligibility.employmentTypes?.includes(type.value) ? 'selected' : ''
                }`}
                onClick={() => {
                  const currentTypes = data.configuration.eligibility.employmentTypes || [];
                  const newTypes = currentTypes.includes(type.value)
                    ? currentTypes.filter(t => t !== type.value)
                    : [...currentTypes, type.value];
                  
                  onChange({
                    configuration: {
                      ...data.configuration,
                      eligibility: { 
                        ...data.configuration.eligibility, 
                        employmentTypes: newTypes 
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
      </div>

      {/* Business Eligibility (for business loans) */}
      {(data.productCategory === 'business' || data.productCategory === 'agricultural') && (
        <div className="config-section">
          <h4>🏢 Business Eligibility</h4>
          <div className="form-group">
            <label>Minimum Business Age (months)</label>
            <input
              type="number"
              value={data.configuration.eligibility.businessAgeMonths || 0}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  eligibility: { 
                    ...data.configuration.eligibility, 
                    businessAgeMonths: parseInt(e.target.value) 
                  }
                }
              })}
              min="0"
            />
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      <div className="config-section">
        <h4>📊 Risk Assessment</h4>
        
        <div className="risk-category-selector">
          {riskCategories.map(category => (
            <div 
              key={category.value}
              className={`risk-category-card ${data.configuration.riskConfig.riskCategory === category.value ? 'active' : ''}`}
              onClick={() => onChange({
                configuration: {
                  ...data.configuration,
                  riskConfig: { 
                    ...data.configuration.riskConfig, 
                    riskCategory: category.value 
                  }
                }
              })}
            >
              <div className={`risk-indicator ${category.color}`}></div>
              <div className="risk-info">
                <h5>{category.label}</h5>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Maximum Debt-to-Income Ratio (%)</label>
            <input
              type="number"
              value={data.configuration.riskConfig.maxDebtToIncomeRatio}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  riskConfig: { 
                    ...data.configuration.riskConfig, 
                    maxDebtToIncomeRatio: parseFloat(e.target.value) 
                  }
                }
              })}
              min="0"
              max="100"
              step="1"
            />
            <small>Maximum percentage of income that can go toward debt repayment</small>
          </div>

          <div className="form-group">
            <label>Minimum Credit Score</label>
            <input
              type="number"
              value={data.configuration.eligibility.minCreditScore || 0}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  eligibility: { 
                    ...data.configuration.eligibility, 
                    minCreditScore: parseInt(e.target.value) 
                  }
                }
              })}
              min="0"
              max="1000"
            />
          </div>
        </div>

        {/* Guarantor Requirements */}
        <div className="form-group">
          <label>Number of Guarantors Required</label>
          <input
            type="number"
            value={data.configuration.riskConfig.requiredGuarantors || 0}
            onChange={(e) => onChange({
              configuration: {
                ...data.configuration,
                riskConfig: { 
                  ...data.configuration.riskConfig, 
                  requiredGuarantors: parseInt(e.target.value) 
                }
              }
            })}
            min="0"
            max="5"
          />
        </div>
      </div>

      {/* Required Documents */}
      <div className="config-section">
        <div className="section-header">
          <h4>📋 Required Documentation</h4>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setShowDocForm(true)}
          >
            + Add Document
          </button>
        </div>

        {data.configuration.eligibility.requiredDocuments?.map((doc, index) => (
          <div key={index} className="document-item">
            <div className="document-content">
              <input
                type="checkbox"
                checked={doc.isMandatory}
                onChange={(e) => {
                  const updatedDocs = [...data.configuration.eligibility.requiredDocuments];
                  updatedDocs[index].isMandatory = e.target.checked;
                  onChange({
                    configuration: {
                      ...data.configuration,
                      eligibility: { 
                        ...data.configuration.eligibility, 
                        requiredDocuments: updatedDocs 
                      }
                    }
                  });
                }}
              />
              <div className="document-details">
                <h5>{doc.documentType} {doc.isMandatory && <span className="mandatory-badge">Required</span>}</h5>
                <p>{doc.description}</p>
              </div>
            </div>
            <div className="document-actions">
              <button 
                type="button"
                onClick={() => {
                  setEditingDocIndex(index);
                  setShowDocForm(true);
                }}
              >
                Edit
              </button>
              <button 
                type="button"
                onClick={() => {
                  const updatedDocs = data.configuration.eligibility.requiredDocuments.filter((_, i) => i !== index);
                  onChange({
                    configuration: {
                      ...data.configuration,
                      eligibility: { 
                        ...data.configuration.eligibility, 
                        requiredDocuments: updatedDocs 
                      }
                    }
                  });
                }}
                className="danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {(!data.configuration.eligibility.requiredDocuments || data.configuration.eligibility.requiredDocuments.length === 0) && (
          <div className="empty-state">
            <p>No documents required. Add ID, proof of income, or other verification documents.</p>
          </div>
        )}
      </div>

      {/* Document Form Modal */}
      {showDocForm && (
        <DocumentFormModal
          document={editingDocIndex !== null ? data.configuration.eligibility.requiredDocuments[editingDocIndex] : null}
          onSubmit={addOrUpdateDocument}
          onCancel={() => {
            setShowDocForm(false);
            setEditingDocIndex(null);
          }}
        />
      )}

      {/* Eligibility Preview */}
      <div className="config-preview">
        <h4>🎯 Eligibility Summary</h4>
        <div className="preview-card">
          <p><strong>Age Range:</strong> {data.configuration.eligibility.minAge} - {data.configuration.eligibility.maxAge} years</p>
          <p><strong>Minimum Income:</strong> {data.configuration.eligibility.minIncome.toLocaleString()} ZMW/month</p>
          <p><strong>Risk Category:</strong> {riskCategories.find(r => r.value === data.configuration.riskConfig.riskCategory)?.label}</p>
          <p><strong>Documents:</strong> {data.configuration.eligibility.requiredDocuments?.length || 0} required</p>
        </div>
      </div>
    </div>
  );
};

// Document Form Modal Component
const DocumentFormModal = ({ document, onSubmit, onCancel }) => {
  const [docData, setDocData] = useState(document || {
    documentType: '',
    description: '',
    isMandatory: true
  });

  const commonDocuments = [
    'National ID',
    'Passport',
    'Driver License',
    'Proof of Income',
    'Bank Statements',
    'Utility Bill',
    'Business Registration',
    'Tax Returns',
    'Pay Slips',
    'Employment Letter'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{document ? 'Edit Document' : 'Add Required Document'}</h3>
        
        <div className="form-group">
          <label>Document Type *</label>
          <input
            type="text"
            value={docData.documentType}
            onChange={(e) => setDocData({ ...docData, documentType: e.target.value })}
            placeholder="e.g., National ID Card"
            list="common-documents"
          />
          <datalist id="common-documents">
            {commonDocuments.map(doc => <option key={doc} value={doc} />)}
          </datalist>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={docData.description}
            onChange={(e) => setDocData({ ...docData, description: e.target.value })}
            placeholder="e.g., Copy of valid national identification card"
            rows="3"
          />
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            checked={docData.isMandatory}
            onChange={(e) => setDocData({ ...docData, isMandatory: e.target.checked })}
          />
          <label>This document is mandatory for application</label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="button" onClick={() => onSubmit(docData)}>Save Document</button>
        </div>
      </div>
    </div>
  );
};

export default EligibilityStep;