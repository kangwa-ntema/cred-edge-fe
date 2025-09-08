import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import { getAllPackages, createPackage, updatePackage, deletePackage } from '../../../services/api/packageApi';
import './PackageManagement.scss';

// Define the shape of a package object
interface Package {
  _id: string;
  name: string;
  slug: string;
  description: string;
  bestFor: string;
  monthlyPrice: number;
  annualPrice: number;
  features: { name: string; description?: string; included: boolean }[];
  limits: {
    maxClients: number;
    maxLoans: number;
    maxUsers: number;
    storageGB: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PackagesPage: React.FC = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [packageToDeleteId, setPackageToDeleteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(true);
  const [currentPackage, setCurrentPackage] = useState<Partial<Package>>({});
  const [refresh, setRefresh] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const { success, data, error } = await getAllPackages();
      if (success) {
        setPackages(data);
      } else {
        setError(error || 'Failed to fetch packages.');
      }
      setLoading(false);
    };

    fetchPackages();
  }, [refresh]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreateClick = () => {
    setIsCreating(true);
    setCurrentPackage({});
    setIsModalOpen(true);
  };

  const handleEditClick = (pkg: Package) => {
    setIsCreating(false);
    setCurrentPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (packageId: string) => {
    if (!user || user.role !== 'platform_superadmin') {
      setNotification({ message: 'You are not authorized to delete packages.', type: 'error' });
      return;
    }
    setPackageToDeleteId(packageId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (packageToDeleteId && user) {
      const { success, error } = await deletePackage(packageToDeleteId, user.token);
      if (success) {
        setRefresh(prev => !prev);
        setNotification({ message: 'Package deleted successfully.', type: 'success' });
      } else {
        setError(error || 'Failed to delete package.');
        setNotification({ message: error || 'Failed to delete package.', type: 'error' });
      }
      setIsConfirmModalOpen(false);
      setPackageToDeleteId(null);
    }
  };

  const handleSavePackage = async (packageData: Partial<Package>) => {
    if (!user || (user.role !== 'platform_superadmin' && user.role !== 'platform_admin')) {
      setNotification({ message: 'You are not authorized to create or update packages.', type: 'error' });
      return;
    }
  
    let result;
    if (isCreating) {
      result = await createPackage(packageData as any, user.token);
    } else {
      result = await updatePackage(packageData._id as string, packageData as any, user.token);
    }
  
    if (result.success) {
      setIsModalOpen(false);
      setRefresh(prev => !prev);
      setNotification({ message: `Package ${isCreating ? 'created' : 'updated'} successfully.`, type: 'success' });
    } else {
      setError(result.error || `Failed to ${isCreating ? 'create' : 'update'} package.`);
      setNotification({ message: result.error || `Failed to ${isCreating ? 'create' : 'update'} package.`, type: 'error' });
    }
  };

  if (loading) return <div className="message loading">Loading packages...</div>;
  if (error) return <div className="message error">Error: {error}</div>;

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
            placeholder="Name"
            value={currentPackage.name || ''}
            onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Slug"
            value={currentPackage.slug || ''}
            onChange={(e) => setCurrentPackage({ ...currentPackage, slug: e.target.value })}
            className="form-input"
            required
          />
          <textarea
            placeholder="Description"
            value={currentPackage.description || ''}
            onChange={(e) => setCurrentPackage({ ...currentPackage, description: e.target.value })}
            className="form-input"
          ></textarea>
           <textarea
            placeholder="Best For"
            value={currentPackage.bestFor || ''}
            onChange={(e) => setCurrentPackage({ ...currentPackage, bestFor: e.target.value })}
            className="form-input"
          ></textarea>
          <div className="input-group">
            <input
              type="number"
              placeholder="Monthly Price"
              value={currentPackage.monthlyPrice || ''}
              onChange={(e) => setCurrentPackage({ ...currentPackage, monthlyPrice: parseFloat(e.target.value) })}
              className="form-input"
              min="0"
            />
            <input
              type="number"
              placeholder="Annual Price"
              value={currentPackage.annualPrice || ''}
              onChange={(e) => setCurrentPackage({ ...currentPackage, annualPrice: parseFloat(e.target.value) })}
              className="form-input"
              min="0"
            />
          </div>
          
          {/* Features and Limits inputs would go here. */}

          <div className="modal-actions">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
            >
              {isCreating ? 'Create' : 'Save Changes'}
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
          <button onClick={() => setIsConfirmModalOpen(false)} className="cancel-btn">
            Cancel
          </button>
          <button onClick={confirmDelete} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="packages-page-container">
      <div className="packages-header">
        <h1 className="page-title">Package Management</h1>
        {user && (user.role === 'platform_superadmin' || user.role === 'platform_admin') && (
          <button
            onClick={handleCreateClick}
            className="create-btn"
          >
            Create New Package
          </button>
        )}
      </div>

      <div className="packages-grid">
        {packages.map((pkg) => (
          <div key={pkg._id} className="package-card">
            <div>
              <h2 className="package-name">{pkg.name}</h2>
              <p className="package-description">{pkg.description}</p>
              <div className="package-price">
                ${pkg.monthlyPrice}
                <span className="price-period"> / mo</span>
              </div>
              <p className="package-bestfor">{pkg.bestFor}</p>

              <ul className="feature-list">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <svg xmlns="http://www.w3.org/2000/svg" className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
            
            {user && (user.role === 'platform_superadmin' || user.role === 'platform_admin') && (
              <div className="card-actions">
                <button
                  onClick={() => handleEditClick(pkg)}
                  className="edit-btn"
                >
                  Edit
                </button>
                {user.role === 'platform_superadmin' && (
                  <button
                    onClick={() => handleDeleteClick(pkg._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && <Modal />}
      {isConfirmModalOpen && <ConfirmModal />}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default PackagesPage;
