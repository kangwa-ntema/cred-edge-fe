import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import {
  getAllTenants,
  registerNewTenant,
  updateTenant,
  deleteTenant,
} from '../../../services/api/tenantApi';
import { getAllPackages } from '../../../services/api/packageApi';
import './PlatformTenantManagement.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Type definitions for tenant data
interface Tenant {
  _id: string;
  tenantName: string;
  contactEmail: string;
  status: 'active' | 'suspended';
  package: string;
  tenantId: string;
  companyName: string;
  phone?: string;
  address?: string;
}

// Type definitions for package data
interface Package {
  _id: string;
  name: string;
}

// Modal component, re-used from SettingsPage for consistency
const Modal = ({ show, onClose, title, children }: any) => {
  if (!show) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const PlatformTenantManagement: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch all tenants and packages
  const fetchAllData = async () => {
    if (!user?.token) return;

    setLoading(true);
    const [tenantsResult, packagesResult] = await Promise.all([
      getAllTenants(user.token),
      getAllPackages(),
    ]);

    if (tenantsResult.success && tenantsResult.data) {
      setTenants(tenantsResult.data);
    } else {
      toast.error(tenantsResult.error || 'Failed to fetch tenants.');
    }

    if (packagesResult.success && packagesResult.data) {
      setPackages(packagesResult.data);
    } else {
      // It's not a critical error if packages fail to load, just a warning
      toast.warn('Could not load packages. Tenant creation may be limited.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  // Handler for form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Open modal for creating a new tenant
  const handleCreateTenant = () => {
    setModalType('create');
    setFormData({}); // Reset form for new entry
    setIsModalOpen(true);
  };

  // Open modal for editing a tenant
  const handleEditTenant = (tenant: Tenant) => {
    setModalType('edit');
    setCurrentTenant(tenant);
    setFormData(tenant);
    setIsModalOpen(true);
  };

  // Delete a tenant
  const handleDeleteTenant = async (tenantId: string) => {
    if (!user?.token) return;

    if (window.confirm('Are you sure you want to delete this tenant and all its associated data? This action cannot be undone.')) {
      setLoading(true);
      const result = await deleteTenant(user.token, tenantId);
      if (result.success) {
        toast.success('Tenant deleted successfully!');
        await fetchAllData();
      } else {
        toast.error(result.error || 'Failed to delete tenant.');
        setLoading(false);
      }
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setIsSubmitting(true);
    let result;

    if (modalType === 'create') {
      // Construct the payload to match the backend API's expected fields
      // This maps the frontend form fields to the backend API contract
      const payload = {
        tenantId: formData.tenantId,
        companyName: formData.companyName,
        email: formData.superadminEmail, // Backend expects 'email' for the superadmin
        phone: formData.phone,
        address: formData.address,
        packageId: formData.packageId,
        password: formData.superadminPassword, // Backend expects 'password' for the superadmin
        superadminUsername: formData.superadminUsername,
        superadminFirstName: formData.superadminFirstName,
        superadminLastName: formData.superadminLastName,
      };

      result = await registerNewTenant(user.token, payload);
    } else if (modalType === 'edit' && currentTenant) {
      result = await updateTenant(user.token, currentTenant._id, formData);
    }

    if (result && result.success) {
      toast.success(`Tenant ${modalType === 'create' ? 'created' : 'updated'} successfully!`);
      setIsModalOpen(false);
      await fetchAllData();
    } else {
      toast.error(result?.error || 'An error occurred. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="platformTenantManagementContainer">
      <div className="header">
        <h1>Platform Tenant Management</h1>
      </div>
      <p className="subtitle">Manage tenants, view their status, and create new ones.</p>
      
      {loading ? (
        <div className="loadingState">Loading tenants...</div>
      ) : (
        <div className="content">
          <div className="actionButtons">
            <button className="createButton" onClick={handleCreateTenant}>
              Register New Tenant
            </button>
          </div>

          <div className="tenantList">
            {tenants.length > 0 ? (
              tenants.map((tenant) => (
                <div key={tenant._id} className="tenantCard">
                  <h3>{tenant.companyName || tenant.tenantName}</h3>
                  <p>Email: {tenant.contactEmail}</p>
                  <p>Status: <span className={`status-${tenant.status}`}>{tenant.status}</span></p>
                  <p>Package: {tenant.package}</p>
                  <div className="cardActions">
                    <button className="actionButton edit" onClick={() => handleEditTenant(tenant)}>Edit</button>
                    <button className="actionButton delete" onClick={() => handleDeleteTenant(tenant._id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="noTenants">No tenants found.</div>
            )}
          </div>
        </div>
      )}
      
      {/* Create/Edit Modal */}
      <Modal 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalType === 'create' ? 'Register New Tenant' : 'Edit Tenant'}
      >
        <form onSubmit={handleSubmit}>
          {modalType === 'create' ? (
            <>
              <h4>Company Information</h4>
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tenantId">Tenant ID</label>
                <input
                  type="text"
                  id="tenantId"
                  name="tenantId"
                  value={formData.tenantId || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="packageId">Select Package</label>
                <select
                  id="packageId"
                  name="packageId"
                  value={formData.packageId || ''}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">-- Select a package --</option>
                  {packages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>

              <h4>Superadmin Information</h4>
              <div className="form-group">
                <label htmlFor="superadminFirstName">First Name</label>
                <input
                  type="text"
                  id="superadminFirstName"
                  name="superadminFirstName"
                  value={formData.superadminFirstName || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="superadminLastName">Last Name</label>
                <input
                  type="text"
                  id="superadminLastName"
                  name="superadminLastName"
                  value={formData.superadminLastName || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="superadminUsername">Username</label>
                <input
                  type="text"
                  id="superadminUsername"
                  name="superadminUsername"
                  value={formData.superadminUsername || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="superadminEmail">Email</label>
                <input
                  type="email"
                  id="superadminEmail"
                  name="superadminEmail"
                  value={formData.superadminEmail || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="superadminPassword">Password</label>
                <input
                  type="password"
                  id="superadminPassword"
                  name="superadminPassword"
                  value={formData.superadminPassword || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <h4>Update Tenant</h4>
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail || ''}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleFormChange}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="trial">Trial</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </>
          )}
          <button type="submit" className="submitButton" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default PlatformTenantManagement;
