// fe/src/components/platformAdminDashboard/TenantManagement/TenantModal/TenantModal.tsx`

import React from 'react';
import { type PackageData } from '../../../../services/api/platform/packageApi';
import { type CreateTenantData, type UpdateTenantData } from '../../../../services/index';
import { ClipLoader } from 'react-spinners';

interface TenantModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  isEditing: boolean;
  packages: PackageData[];
  formData: Partial<CreateTenantData & UpdateTenantData>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSuperadminChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

const TenantModal: React.FC<TenantModalProps> = ({
  show,
  onClose,
  title,
  isEditing,
  packages,
  formData = {},
  onSubmit,
  onChange,
  onSuperadminChange,
  isSubmitting
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={onSubmit}>
            {!isEditing && (
              <>
                <h4>Company Information</h4>
                <input
                  type="text"
                  name="tenantId"
                  placeholder="Tenant ID"
                  value={formData.tenantId || ""}
                  onChange={onChange}
                  required
                />
              </>
            )}
            
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName || ""}
              onChange={onChange}
              required
            />
            <input
              type="email"
              name="companyEmail"
              placeholder="Company Email"
              value={formData.companyEmail || ""}
              onChange={onChange}
              required
            />
            <input
              type="text"
              name="companyPhone"
              placeholder="Company Phone"
              value={formData.companyPhone || ""}
              onChange={onChange}
            />
            <input
              type="text"
              name="companyAddress"
              placeholder="Company Address"
              value={formData.companyAddress || ""}
              onChange={onChange}
            />
            
            {!isEditing && (
              <input
                type="text"
                name="companyNumber"
                placeholder="Company Registration Number"
                value={formData.companyNumber || ""}
                onChange={onChange}
              />
            )}

            {isEditing && (
              <select name="status" value={formData.status || ""} onChange={onChange} required>
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="trial">Trial</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}

            <select name="packageId" value={formData.packageId || ""} onChange={onChange} required>
              <option value="">Select a Package</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
              ))}
            </select>

            <h4>Superadmin Information</h4>
            {!isEditing && (
              <>
                <input
                  type="email"
                  name="superadminEmail"
                  placeholder="Super Admin Email"
                  value={formData.superadminEmail || ""}
                  onChange={onChange}
                  required
                />
                <input
                  type="text"
                  name="superadminUsername"
                  placeholder="Super Admin Username"
                  value={formData.superadminUsername || ""}
                  onChange={onChange}
                  required
                />
              </>
            )}
            
            <input
              type="text"
              name="superadminFirstName"
              placeholder="Super Admin First Name"
              value={formData.superadminFirstName || ""}
              onChange={onSuperadminChange}
              required
            />
            <input
              type="text"
              name="superadminLastName"
              placeholder="Super Admin Last Name"
              value={formData.superadminLastName || ""}
              onChange={onSuperadminChange}
              required
            />
            <input
              type="text"
              name="superadminPhone"
              placeholder="Super Admin Phone"
              value={formData.superadminPhone || ""}
              onChange={onSuperadminChange}
            />

            {!isEditing && (
              <input
                type="password"
                name="password"
                placeholder="Super Admin Password"
                value={formData.password || ""}
                onChange={onChange}
                required
              />
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <ClipLoader size={20} color={"#fff"} /> : isEditing ? "Update Tenant" : "Register Tenant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantModal;