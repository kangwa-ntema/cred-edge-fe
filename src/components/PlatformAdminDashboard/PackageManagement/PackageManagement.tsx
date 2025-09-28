// fe/src/components/platformAdminDashboard/PackageManagement/PackageManagement.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import { 
  getPackages, 
  createPackage, 
  updatePackage, 
  deletePackage,
  type PackageData 
} from '../../../services/api/platform/packageApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import './PackageManagement.scss';

const PackageManagement: React.FC = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [packageToDeleteId, setPackageToDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(true);
  const [currentPackage, setCurrentPackage] = useState<Partial<PackageData>>({});
  const [refresh, setRefresh] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPackages();
      console.log("Fetched packages response:", response);

      if (response.success && response.data) {
        setPackages(response.data);
        toast.success(response.message || "Packages loaded successfully!");
      } else {
        const errorMsg = response.error || "Failed to fetch packages.";
        setError(errorMsg);
        setPackages([]);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      console.error("Failed to fetch packages:", err);
      const errorMessage = err.message || "Failed to fetch packages.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [refresh]);

  const handleCreateClick = () => {
    setIsCreating(true);
    setCurrentPackage({
      name: "",
      slug: "",
      description: "",
      bestFor: "",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [],
      limits: {
        maxClients: -1,
        maxLoans: -1,
        maxUsers: 1,
        storageGB: 1
      },
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (pkg: PackageData) => {
    setIsCreating(false);
    setCurrentPackage({...pkg});
    setIsModalOpen(true);
  };

  const handleDeleteClick = (packageId: string) => {
    if (!user || user.role !== 'platform_superadmin') {
      toast.error('You are not authorized to delete packages.');
      return;
    }
    setPackageToDeleteId(packageId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (packageToDeleteId) {
      setFormLoading(true);
      const response = await deletePackage(packageToDeleteId);
      
      if (response.success) {
        setRefresh(prev => !prev);
        toast.success(response.message || 'Package deleted successfully.');
      } else {
        setError(response.error || 'Failed to delete package.');
        toast.error(response.error || 'Failed to delete package.');
      }
      setIsConfirmModalOpen(false);
      setPackageToDeleteId(null);
      setFormLoading(false);
    }
  };

  const handleSavePackage = async (packageData: Partial<PackageData>) => {
    if (!user || (user.role !== 'platform_superadmin' && user.role !== 'platform_admin')) {
      toast.error('You are not authorized to create or update packages.');
      return;
    }
  
    setFormLoading(true);
    let response;
    
    try {
      if (isCreating) {
        response = await createPackage(packageData as PackageData);
      } else {
        response = await updatePackage(packageData._id as string, packageData);
      }
    
      if (response.success) {
        setIsModalOpen(false);
        setRefresh(prev => !prev);
        toast.success(response.message || `Package ${isCreating ? 'created' : 'updated'} successfully.`);
      } else {
        setError(response.error || `Failed to ${isCreating ? 'create' : 'update'} package.`);
        toast.error(response.error || `Failed to ${isCreating ? 'create' : 'update'} package.`);
      }
    } catch (err: any) {
      console.error('Save package error:', err);
      toast.error(err.message || 'An error occurred while saving the package.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentPackage(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPackage(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPackage(prev => ({
      ...prev,
      limits: {
        ...prev.limits!,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  const handleFeatureToggle = (index: number) => {
    setCurrentPackage(prev => {
      const features = [...(prev.features || [])];
      if (features[index]) {
        features[index].included = !features[index].included;
      }
      return { ...prev, features };
    });
  };

  const addFeature = () => {
    setCurrentPackage(prev => ({
      ...prev,
      features: [...(prev.features || []), { name: '', description: '', included: true }]
    }));
  };

  const removeFeature = (index: number) => {
    setCurrentPackage(prev => {
      const features = [...(prev.features || [])];
      features.splice(index, 1);
      return { ...prev, features };
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    setCurrentPackage(prev => {
      const features = [...(prev.features || [])];
      if (features[index]) {
        features[index] = { ...features[index], [field]: value };
      }
      return { ...prev, features };
    });
  };

  const Modal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{isCreating ? 'Create New Package' : 'Edit Package'}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSavePackage(currentPackage);
        }} className="modal-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={currentPackage.name || ''}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={currentPackage.slug || ''}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={currentPackage.description || ''}
            onChange={handleInputChange}
            className="form-input"
            rows={3}
          />
          <textarea
            name="bestFor"
            placeholder="Best For"
            value={currentPackage.bestFor || ''}
            onChange={handleInputChange}
            className="form-input"
            rows={2}
          />
          
          <div className="input-group">
            <input
              type="number"
              name="monthlyPrice"
              placeholder="Monthly Price"
              value={currentPackage.monthlyPrice || ''}
              onChange={handleNumberInputChange}
              className="form-input"
              min="0"
              step="0.01"
              required
            />
            <input
              type="number"
              name="annualPrice"
              placeholder="Annual Price"
              value={currentPackage.annualPrice || ''}
              onChange={handleNumberInputChange}
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="limits-section">
            <h3>Limits</h3>
            <div className="input-group">
              <input
                type="number"
                name="maxClients"
                placeholder="Max Clients (-1 for unlimited)"
                value={currentPackage.limits?.maxClients || ''}
                onChange={handleLimitChange}
                className="form-input"
                min="-1"
                required
              />
              <input
                type="number"
                name="maxLoans"
                placeholder="Max Loans (-1 for unlimited)"
                value={currentPackage.limits?.maxLoans || ''}
                onChange={handleLimitChange}
                className="form-input"
                min="-1"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="number"
                name="maxUsers"
                placeholder="Max Users"
                value={currentPackage.limits?.maxUsers || ''}
                onChange={handleLimitChange}
                className="form-input"
                min="1"
                required
              />
              <input
                type="number"
                name="storageGB"
                placeholder="Storage GB"
                value={currentPackage.limits?.storageGB || ''}
                onChange={handleLimitChange}
                className="form-input"
                min="1"
                required
              />
            </div>
          </div>

          <div className="features-section">
            <h3>Features</h3>
            <button type="button" onClick={addFeature} className="add-feature-btn">
              + Add Feature
            </button>
            {currentPackage.features?.map((feature, index) => (
              <div key={index} className="feature-input-group">
                <input
                  type="text"
                  placeholder="Feature name"
                  value={feature.name}
                  onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={feature.description || ''}
                  onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                  className="form-input"
                />
                <label className="feature-toggle">
                  <input
                    type="checkbox"
                    checked={feature.included}
                    onChange={() => handleFeatureToggle(index)}
                  />
                  Included
                </label>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="remove-feature-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              name="isActive"
              checked={currentPackage.isActive || false}
              onChange={(e) => setCurrentPackage(prev => ({ ...prev, isActive: e.target.checked }))}
              className="form-checkbox"
            />
            <label className="form-check-label">Active</label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cancel-btn"
              disabled={formLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={formLoading}
            >
              {formLoading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : isCreating ? (
                'Create'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ConfirmModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Confirm Deletion</h2>
        <p>Are you sure you want to delete this package? This action cannot be undone.</p>
        <div className="modal-actions">
          <button onClick={() => setIsConfirmModalOpen(false)} className="cancel-btn" disabled={formLoading}>
            Cancel
          </button>
          <button onClick={confirmDelete} className="delete-btn" disabled={formLoading}>
            {formLoading ? <ClipLoader size={20} color="#ffffff" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="message loading">Loading packages...</div>;
  if (error) return <div className="message error">Error: {error}</div>;

  return (
    <div className="packages-page-container">
      <div className="packages-header">
        <h1 className="page-title">Package Management</h1>
        {user && (user.role === 'platform_superadmin' || user.role === 'platform_admin') && (
          <button
            onClick={handleCreateClick}
            className="create-btn"
            disabled={loading}
          >
            Create New Package
          </button>
        )}
      </div>

      <div className="packages-grid">
        {packages.length === 0 ? (
          <div className="no-packages">
            <p>No packages found. Create your first package to get started.</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              <div className="package-content">
                <h2 className="package-name">{pkg.name}</h2>
                <p className="package-description">{pkg.description}</p>
                <div className="package-price">
                  ${pkg.monthlyPrice}
                  <span className="price-period"> / mo</span>
                  {pkg.annualPrice > 0 && (
                    <span className="annual-price"> (${pkg.annualPrice}/year)</span>
                  )}
                </div>
                <p className="package-bestfor">{pkg.bestFor}</p>

                <div className="package-limits">
                  <h4>Limits:</h4>
                  <p>Users: {pkg.limits.maxUsers === -1 ? 'Unlimited' : pkg.limits.maxUsers}</p>
                  <p>Clients: {pkg.limits.maxClients === -1 ? 'Unlimited' : pkg.limits.maxClients}</p>
                  <p>Loans: {pkg.limits.maxLoans === -1 ? 'Unlimited' : pkg.limits.maxLoans}</p>
                  <p>Storage: {pkg.limits.storageGB}GB</p>
                </div>

                <div className="package-features">
                  <h4>Features:</h4>
                  <ul className="feature-list">
                    {pkg.features && pkg.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className={`feature-indicator ${feature.included ? 'included' : 'excluded'}`}>
                          {feature.included ? '✓' : '✗'}
                        </span>
                        {feature.name}
                        {feature.description && (
                          <span className="feature-description"> - {feature.description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="package-status">
                  <span className={`status-badge ${pkg.isActive ? 'active' : 'inactive'}`}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              {user && (user.role === 'platform_superadmin' || user.role === 'platform_admin') && (
                <div className="card-actions">
                  <button
                    onClick={() => handleEditClick(pkg)}
                    className="edit-btn"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  {user.role === 'platform_superadmin' && (
                    <button
                      onClick={() => handleDeleteClick(pkg._id!)}
                      className="delete-btn"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && <Modal />}
      {isConfirmModalOpen && <ConfirmModal />}
    </div>
  );
};

export default PackageManagement;