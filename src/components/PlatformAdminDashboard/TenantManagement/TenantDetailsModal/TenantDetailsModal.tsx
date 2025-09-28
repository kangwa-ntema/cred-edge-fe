// fe/src/components/platformAdminDashboard/TenantManagement/TenantModal/TenantModal.tsx
import React from 'react';
import { type Tenant } from '../../../../services/index';
import { ClipLoader } from 'react-spinners';

interface TenantDetailsModalProps {
  show: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  loading: boolean;
}

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({
  show,
  onClose,
  tenant,
  loading
}) => {
  if (!show) return null;

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3 className="modal-title">Loading Tenant Details</h3>
            <button className="modal-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="loadingState">
              <ClipLoader size={30} color={"#123abc"} loading={loading} />
              <p>Loading tenant details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FIX: Add proper null/undefined check
  if (!tenant) {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3 className="modal-title">Tenant Not Found</h3>
            <button className="modal-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>Tenant details could not be loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{tenant.companyName} Details</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="tenant-details">
            <h4>Company Information</h4>
            <div className="detail-row">
              <strong>Tenant ID:</strong>
              <span>{tenant.tenantId || 'N/A'}</span> {/* FIX: Add fallback */}
            </div>
            <div className="detail-row">
              <strong>Company Name:</strong>
              <span>{tenant.companyName || 'N/A'}</span> {/* FIX: Add fallback */}
            </div>
            <div className="detail-row">
              <strong>Email:</strong>
              <span>{tenant.companyEmail || 'N/A'}</span> {/* FIX: Add fallback */}
            </div>
            <div className="detail-row">
              <strong>Phone:</strong>
              <span>{tenant.companyPhone || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <strong>Address:</strong>
              <span>{tenant.companyAddress || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <strong>Status:</strong>
              <span className={`statusBadge ${tenant.status}`}>
                {tenant.status || 'N/A'} {/* FIX: Add fallback */}
              </span>
            </div>
            <div className="detail-row">
              <strong>Package:</strong>
              <span>{tenant.package?.name || 'N/A'}</span> {/* FIX: Safe access */}
            </div>
            <div className="detail-row">
              <strong>Created:</strong>
              <span>{tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}</span> {/* FIX: Safe access */}
            </div>

            <h4>Superadmin Information</h4>
            {tenant.superadmin ? (
              <>
                <div className="detail-row">
                  <strong>Name:</strong>
                  <span>{tenant.superadmin.firstName} {tenant.superadmin.lastName}</span>
                </div>
                <div className="detail-row">
                  <strong>Username:</strong>
                  <span>{tenant.superadmin.username || 'N/A'}</span> {/* FIX: Add fallback */}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong>
                  <span>{tenant.superadmin.email || 'N/A'}</span> {/* FIX: Add fallback */}
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong>
                  <span>{tenant.superadmin.phone || 'N/A'}</span>
                </div>
              </>
            ) : (
              <p>No superadmin information available.</p>
            )}

            {tenant.trialEndsAt && (
              <div className="detail-row">
                <strong>Trial Ends:</strong>
                <span>{new Date(tenant.trialEndsAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsModal;