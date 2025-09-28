// fe/src/components/platformAdminDashboard/AccountingDashboard/AddPaymentModal/AddPaymentModal.tsx

import React, { useState, useEffect } from 'react';
import { getAllTenants } from '../../../../services/api/platform/tenantUserApi';
import { getActivePackages } from '../../../../services/api/platform/packageApi';
import { type Tenant } from '../../../../services/api/platform/tenantUserApi';
import { type PackageData } from '../../../../services/api/platform/packageApi';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (paymentData: any) => Promise<void>;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, onAddPayment }) => {
  const [formData, setFormData] = useState({
    tenantId: '',
    packageId: '',
    amount: '',
    paymentMethod: 'manual',
    dueDate: '',
    billingPeriod: {
      startDate: '',
      endDate: ''
    },
    notes: ''
  });

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // Fetch tenants and packages when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    setFetchingData(true);
    try {
      const [tenantsResult, packagesResult] = await Promise.all([
        getAllTenants(),
        getActivePackages()
      ]);

      if (tenantsResult.success) {
        setTenants(tenantsResult.data || []);
      }

      if (packagesResult.success) {
        setPackages(packagesResult.data || []);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    } finally {
      setFetchingData(false);
    }
  };

  // Auto-calculate amount when package is selected
  useEffect(() => {
    if (formData.packageId) {
      const selectedPackage = packages.find(pkg => pkg._id === formData.packageId);
      if (selectedPackage) {
        setFormData(prev => ({
          ...prev,
          amount: selectedPackage.monthlyPrice.toString()
        }));
      }
    }
  }, [formData.packageId, packages]);

  // Auto-calculate billing period end and due date
  useEffect(() => {
    if (formData.billingPeriod.startDate) {
      const startDate = new Date(formData.billingPeriod.startDate);
      
      // Calculate billing period end (start date + 30 days)
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);
      
      // Calculate due date (end date + 15 days)
      const dueDate = new Date(endDate);
      dueDate.setDate(dueDate.getDate() + 15);

      setFormData(prev => ({
        ...prev,
        billingPeriod: {
          ...prev.billingPeriod,
          endDate: endDate.toISOString().split('T')[0]
        },
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.billingPeriod.startDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddPayment({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      // Reset form
      setFormData({
        tenantId: '',
        packageId: '',
        amount: '',
        paymentMethod: 'manual',
        dueDate: '',
        billingPeriod: {
          startDate: '',
          endDate: ''
        },
        notes: ''
      });
      onClose();
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('billingPeriod.')) {
      const periodField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingPeriod: {
          ...prev.billingPeriod,
          [periodField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getSelectedPackagePrice = () => {
    if (!formData.packageId) return 0;
    const selectedPackage = packages.find(pkg => pkg._id === formData.packageId);
    return selectedPackage ? selectedPackage.monthlyPrice : 0;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add Manual Payment</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {fetchingData ? (
          <div className="modal-loading">
            <p>Loading tenants and packages...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {/* Tenant Dropdown */}
            <div className="form-group">
              <label>Tenant:</label>
              <select
                name="tenantId"
                value={formData.tenantId}
                onChange={handleChange}
                required
              >
                <option value="">Select a Tenant</option>
                {tenants.map(tenant => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.companyName} ({tenant.tenantId})
                  </option>
                ))}
              </select>
            </div>

            {/* Package Dropdown */}
            <div className="form-group">
              <label>Package:</label>
              <select
                name="packageId"
                value={formData.packageId}
                onChange={handleChange}
                required
              >
                <option value="">Select a Package</option>
                {packages.map(pkg => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name} - ${pkg.monthlyPrice}/month
                  </option>
                ))}
              </select>
            </div>

            {/* Amount (auto-calculated but editable) */}
            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                required
                placeholder="Will auto-fill from package price"
              />
              {formData.packageId && (
                <small className="helper-text">
                  Package price: ${getSelectedPackagePrice().toFixed(2)}
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Payment Method:</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="manual">Manual</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {/* Billing Period Start (triggers auto-calculation) */}
            <div className="form-group">
              <label>Billing Period Start:</label>
              <input
                type="date"
                name="billingPeriod.startDate"
                value={formData.billingPeriod.startDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Billing Period End (auto-calculated) */}
            <div className="form-group">
              <label>Billing Period End:</label>
              <input
                type="date"
                name="billingPeriod.endDate"
                value={formData.billingPeriod.endDate}
                onChange={handleChange}
                required
                readOnly
              />
              <small className="helper-text">
                Auto-calculated (30 days from start)
              </small>
            </div>

            {/* Due Date (auto-calculated) */}
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                readOnly
              />
              <small className="helper-text">
                Auto-calculated (15 days after billing period end)
              </small>
            </div>

            <div className="form-group">
              <label>Notes:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Optional notes about this payment"
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" disabled={loading || fetchingData}>
                {loading ? 'Adding...' : 'Add Payment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddPaymentModal;