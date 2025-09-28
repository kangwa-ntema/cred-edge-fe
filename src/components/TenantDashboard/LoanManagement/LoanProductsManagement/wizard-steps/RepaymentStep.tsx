// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/wizard-steps/RepaymentStep.tsx
import React, { useState } from 'react';
import './WizardSteps.scss'

const RepaymentStep = ({ data, onChange }) => {
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const [editingHolidayIndex, setEditingHolidayIndex] = useState(null);

  const repaymentFrequencies = [
    { value: 'daily', label: 'Daily', description: 'Every day' },
    { value: 'weekly', label: 'Weekly', description: 'Every week' },
    { value: 'biweekly', label: 'Bi-weekly', description: 'Every 2 weeks' },
    { value: 'monthly', label: 'Monthly', description: 'Every month' },
    { value: 'quarterly', label: 'Quarterly', description: 'Every 3 months' },
    { value: 'annually', label: 'Annually', description: 'Every year' },
    { value: 'custom', label: 'Custom', description: 'Custom schedule' }
  ];

  const disbursementMethods = [
    { value: 'lump_sum', label: 'Lump Sum', description: 'Full amount at once' },
    { value: 'tranches', label: 'Tranches', description: 'Multiple disbursements' },
    { value: 'milestone_based', label: 'Milestone-Based', description: 'Based on project milestones' },
    { value: 'progress_based', label: 'Progress-Based', description: 'Based on work progress' }
  ];

  const addOrUpdateHoliday = (holidayData) => {
    const currentHolidays = data.configuration.repaymentConfig.repaymentHolidays || [];
    
    if (editingHolidayIndex !== null) {
      const updatedHolidays = [...currentHolidays];
      updatedHolidays[editingHolidayIndex] = holidayData;
      onChange({
        configuration: {
          ...data.configuration,
          repaymentConfig: { 
            ...data.configuration.repaymentConfig, 
            repaymentHolidays: updatedHolidays 
          }
        }
      });
    } else {
      onChange({
        configuration: {
          ...data.configuration,
          repaymentConfig: { 
            ...data.configuration.repaymentConfig, 
            repaymentHolidays: [...currentHolidays, holidayData] 
          }
        }
      });
    }
    
    setShowHolidayForm(false);
    setEditingHolidayIndex(null);
  };

  return (
    <div className="wizard-step-content">
      <h3>⏰ Repayment & Disbursement</h3>
      <p className="step-description">Configure payment schedules and fund release</p>

      {/* Repayment Configuration */}
      <div className="config-section">
        <h4>💰 Repayment Schedule</h4>
        
        <div className="form-grid-2">
          <div className="form-group">
            <label>Repayment Frequency</label>
            <select
              value={data.configuration.repaymentConfig.frequency}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  repaymentConfig: { 
                    ...data.configuration.repaymentConfig, 
                    frequency: e.target.value 
                  }
                }
              })}
            >
              {repaymentFrequencies.map(freq => (
                <option key={freq.value} value={freq.value}>{freq.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Grace Period (days)</label>
            <input
              type="number"
              value={data.configuration.repaymentConfig.gracePeriod}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  repaymentConfig: { 
                    ...data.configuration.repaymentConfig, 
                    gracePeriod: parseInt(e.target.value) 
                  }
                }
              })}
              min="0"
              max="365"
            />
            <small>Days before first payment is due</small>
          </div>
        </div>

        <div className="form-check-group">
          <div className="form-check">
            <input
              type="checkbox"
              checked={data.configuration.repaymentConfig.allowEarlyRepayment}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  repaymentConfig: { 
                    ...data.configuration.repaymentConfig, 
                    allowEarlyRepayment: e.target.checked 
                  }
                }
              })}
            />
            <label>Allow early repayment</label>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              checked={data.configuration.repaymentConfig.allowPartialPayments}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  repaymentConfig: { 
                    ...data.configuration.repaymentConfig, 
                    allowPartialPayments: e.target.checked 
                  }
                }
              })}
            />
            <label>Allow partial payments</label>
          </div>
        </div>

        {data.configuration.repaymentConfig.allowEarlyRepayment && (
          <div className="form-group">
            <label>Early Repayment Fee (%)</label>
            <input
              type="number"
              value={data.configuration.repaymentConfig.earlyRepaymentFee || 0}
              onChange={(e) => onChange({
                configuration: {
                  ...data.configuration,
                  repaymentConfig: { 
                    ...data.configuration.repaymentConfig, 
                    earlyRepaymentFee: parseFloat(e.target.value) 
                  }
                }
              })}
              min="0"
              max="10"
              step="0.1"
            />
          </div>
        )}

        {/* Late Payment Penalties */}
        <div className="form-group">
          <label>Late Payment Penalty Rate (% per month)</label>
          <input
            type="number"
            value={data.configuration.repaymentConfig.defaultPenaltyRate || 0}
            onChange={(e) => onChange({
              configuration: {
                ...data.configuration,
                repaymentConfig: { 
                  ...data.configuration.repaymentConfig, 
                  defaultPenaltyRate: parseFloat(e.target.value) 
                }
              }
            })}
            min="0"
            max="20"
            step="0.1"
          />
        </div>
      </div>

      {/* Repayment Holidays */}
      <div className="config-section">
        <div className="section-header">
          <h4>🎄 Repayment Holidays</h4>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setShowHolidayForm(true)}
          >
            + Add Holiday
          </button>
        </div>

        <p className="section-description">Periods where no payments are required (e.g., Christmas, harvest season)</p>

        {data.configuration.repaymentConfig.repaymentHolidays?.map((holiday, index) => (
          <div key={index} className="holiday-item">
            <div className="holiday-content">
              <h5>{holiday.name}</h5>
              <p>{holiday.durationDays} days • {holiday.conditions}</p>
            </div>
            <div className="holiday-actions">
              <button 
                type="button"
                onClick={() => {
                  setEditingHolidayIndex(index);
                  setShowHolidayForm(true);
                }}
              >
                Edit
              </button>
              <button 
                type="button"
                onClick={() => {
                  const updatedHolidays = data.configuration.repaymentConfig.repaymentHolidays.filter((_, i) => i !== index);
                  onChange({
                    configuration: {
                      ...data.configuration,
                      repaymentConfig: { 
                        ...data.configuration.repaymentConfig, 
                        repaymentHolidays: updatedHolidays 
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

        {(!data.configuration.repaymentConfig.repaymentHolidays || data.configuration.repaymentConfig.repaymentHolidays.length === 0) && (
          <div className="empty-state">
            <p>No repayment holidays configured. Add seasonal breaks or special occasions.</p>
          </div>
        )}
      </div>

      {/* Disbursement Configuration */}
      <div className="config-section">
        <h4>🚀 Disbursement Settings</h4>
        
        <div className="form-group">
          <label>Disbursement Method</label>
          <select
            value={data.configuration.disbursementConfig.method}
            onChange={(e) => onChange({
              configuration: {
                ...data.configuration,
                disbursementConfig: { 
                  ...data.configuration.disbursementConfig, 
                  method: e.target.value 
                }
              }
            })}
          >
            {disbursementMethods.map(method => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Maximum Disbursement Period (days)</label>
          <input
            type="number"
            value={data.configuration.disbursementConfig.maxDisbursementPeriod}
            onChange={(e) => onChange({
              configuration: {
                ...data.configuration,
                disbursementConfig: { 
                  ...data.configuration.disbursementConfig, 
                  maxDisbursementPeriod: parseInt(e.target.value) 
                }
              }
            })}
            min="1"
            max="90"
          />
          <small>Days from approval to complete disbursement</small>
        </div>

        <div className="form-group">
          <label>Disbursement Channels</label>
          <div className="channel-selector">
            {['bank_transfer', 'cash', 'mobile_money', 'cheque'].map(channel => (
              <label key={channel} className="channel-option">
                <input
                  type="checkbox"
                  checked={data.configuration.disbursementConfig.disbursementChannels?.includes(channel)}
                  onChange={(e) => {
                    const currentChannels = data.configuration.disbursementConfig.disbursementChannels || [];
                    const newChannels = e.target.checked
                      ? [...currentChannels, channel]
                      : currentChannels.filter(c => c !== channel);
                    
                    onChange({
                      configuration: {
                        ...data.configuration,
                        disbursementConfig: { 
                          ...data.configuration.disbursementConfig, 
                          disbursementChannels: newChannels 
                        }
                      }
                    });
                  }}
                />
                <span>{channel.replace('_', ' ').toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Holiday Form Modal */}
      {showHolidayForm && (
        <HolidayFormModal
          holiday={editingHolidayIndex !== null ? data.configuration.repaymentConfig.repaymentHolidays[editingHolidayIndex] : null}
          onSubmit={addOrUpdateHoliday}
          onCancel={() => {
            setShowHolidayForm(false);
            setEditingHolidayIndex(null);
          }}
        />
      )}

      {/* Schedule Preview */}
      <div className="config-preview">
        <h4>⏰ Schedule Summary</h4>
        <div className="preview-card">
          <p><strong>Repayment:</strong> {repaymentFrequencies.find(f => f.value === data.configuration.repaymentConfig.frequency)?.label}</p>
          <p><strong>Grace Period:</strong> {data.configuration.repaymentConfig.gracePeriod} days</p>
          <p><strong>Disbursement:</strong> {disbursementMethods.find(m => m.value === data.configuration.disbursementConfig.method)?.label}</p>
          <p><strong>Holidays:</strong> {data.configuration.repaymentConfig.repaymentHolidays?.length || 0} configured</p>
        </div>
      </div>
    </div>
  );
};

// Holiday Form Modal Component
const HolidayFormModal = ({ holiday, onSubmit, onCancel }) => {
  const [holidayData, setHolidayData] = useState(holiday || {
    name: '',
    durationDays: 30,
    conditions: ''
  });

  const commonHolidays = [
    { name: 'Christmas Break', durationDays: 14, conditions: 'Annual Christmas holiday period' },
    { name: 'Harvest Season', durationDays: 60, conditions: 'Agricultural harvest period' },
    { name: 'Easter Holiday', durationDays: 7, conditions: 'Easter holiday week' },
    { name: 'New Year', durationDays: 7, conditions: 'New Year holiday period' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{holiday ? 'Edit Repayment Holiday' : 'Add Repayment Holiday'}</h3>
        
        <div className="form-group">
          <label>Holiday Name *</label>
          <input
            type="text"
            value={holidayData.name}
            onChange={(e) => setHolidayData({ ...holidayData, name: e.target.value })}
            placeholder="e.g., Christmas Break"
          />
        </div>

        <div className="form-group">
          <label>Duration (days)</label>
          <input
            type="number"
            value={holidayData.durationDays}
            onChange={(e) => setHolidayData({ ...holidayData, durationDays: parseInt(e.target.value) })}
            min="1"
            max="365"
          />
        </div>

        <div className="form-group">
          <label>Conditions</label>
          <textarea
            value={holidayData.conditions}
            onChange={(e) => setHolidayData({ ...holidayData, conditions: e.target.value })}
            placeholder="e.g., Available only for agricultural loans during harvest season"
            rows="3"
          />
        </div>

        <div className="common-holidays">
          <h4>Common Holiday Templates</h4>
          <div className="common-holidays-grid">
            {commonHolidays.map((common, index) => (
              <div 
                key={index}
                className="common-holiday-card"
                onClick={() => setHolidayData({ ...common })}
              >
                <h5>{common.name}</h5>
                <p>{common.durationDays} days</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="button" onClick={() => onSubmit(holidayData)}>Save Holiday</button>
        </div>
      </div>
    </div>
  );
};

export default RepaymentStep;