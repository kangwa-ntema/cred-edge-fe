  // fe/src/components/platformAdminDashboard/TenantManagement/TenantManagement.tsx

  import React, { useState, useEffect } from "react";
  import { useAuth } from "../../../context/authContext";
  import {
    getAllTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    getTenantById,
    type Tenant,
    type CreateTenantData,
    type UpdateTenantData,
  } from "../../../services/index";
  import { getPackages, type PackageData } from "../../../services/api/platform/packageApi";
  import { toast } from "react-toastify";
  import { ClipLoader } from "react-spinners";
  import TenantModal from "./TenantModal/TenantModal"; // FIXED: Correct import path
  import TenantDetailsModal from "./TenantDetailsModal/TenantDetailsModal"; // FIXED: Correct import
  import DeleteConfirmationModal from "./DeleteConfirmationModal/DeleteConfirmationModal";
  import "./TenantManagement.scss";

  const TenantManagement: React.FC = () => {
    const { user } = useAuth();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [tenantToDelete, setTenantToDelete] = useState<string | null>(null);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<CreateTenantData & UpdateTenantData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [tenantsResult, packagesResult] = await Promise.all([
          getAllTenants(),
          getPackages(),
        ]);

        if (tenantsResult.success && tenantsResult.data) {
          setTenants(tenantsResult.data);
        } else {
          toast.error(tenantsResult.error || "Failed to fetch tenants.");
        }

        if (packagesResult.success && packagesResult.data) {
          setPackages(packagesResult.data);
        } else {
          toast.warn("Could not load packages. Tenant creation may be limited.");
        }
      } catch (error: any) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchAllData();
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSuperadminFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleCreateTenant = () => {
      setFormData({});
      setIsCreateModalOpen(true);
    };

    const handleEditTenant = (tenant: Tenant) => {
      setCurrentTenant(tenant);
      setFormData({
        companyName: tenant.companyName,
        companyEmail: tenant.companyEmail,
        companyPhone: tenant.companyPhone,
        companyAddress: tenant.companyAddress,
        status: tenant.status,
        packageId: tenant.package._id,
        superadminFirstName: tenant.superadmin?.firstName,
        superadminLastName: tenant.superadmin?.lastName,
        superadminEmail: tenant.superadmin?.email,
        superadminPhone: tenant.superadmin?.phone,
      });
      setIsEditModalOpen(true);
    };

  const handleViewTenant = async (tenant: Tenant) => {
    setIsViewModalOpen(true);
    setIsModalLoading(true);

    try {
      const result = await getTenantById(tenant._id);
      console.log('Tenant details response:', result); // Add debug logging
      
      if (result.success && result.data) {
        setCurrentTenant(result.data);
      } else {
        toast.error(result.error || "Failed to fetch tenant details.");
        setCurrentTenant(null); // FIX: Explicitly set to null on error
      }
    } catch (error: any) {
      console.error("Failed to fetch tenant details:", error);
      toast.error("Failed to load tenant details.");
      setCurrentTenant(null); // FIX: Explicitly set to null on error
    } finally {
      setIsModalLoading(false);
    }
  };

    const handleDeleteTenant = (tenantId: string) => {
      setTenantToDelete(tenantId);
      setIsDeleteConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
      if (!tenantToDelete) return;

      setLoading(true);
      try {
        const result = await deleteTenant(tenantToDelete);
        if (result.success) {
          toast.success("Tenant deleted successfully!");
          await fetchAllData();
        } else {
          toast.error(result.error || "Failed to delete tenant.");
        }
      } catch (error: any) {
        console.error("Failed to delete tenant:", error);
        toast.error("Failed to delete tenant.");
      } finally {
        setIsDeleteConfirmModalOpen(false);
        setTenantToDelete(null);
        setLoading(false);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        let result;
        if (isCreateModalOpen) {
          const payload: CreateTenantData = {
            tenantId: formData.tenantId!,
            companyName: formData.companyName!,
            companyEmail: formData.companyEmail!,
            companyPhone: formData.companyPhone,
            companyAddress: formData.companyAddress,
            companyNumber: formData.companyNumber,
            packageId: formData.packageId!,
            password: formData.password!,
            superadminUsername: formData.superadminUsername!,
            superadminFirstName: formData.superadminFirstName!,
            superadminLastName: formData.superadminLastName!,
            superadminEmail: formData.superadminEmail!,
            superadminPhone: formData.superadminPhone,
          };

          result = await createTenant(payload);
        } else if (isEditModalOpen && currentTenant) {
          const payload: UpdateTenantData = {
            companyName: formData.companyName,
            companyEmail: formData.companyEmail,
            companyPhone: formData.companyPhone,
            companyAddress: formData.companyAddress,
            status: formData.status,
            packageId: formData.packageId,
            superadminFirstName: formData.superadminFirstName,
            superadminLastName: formData.superadminLastName,
            superadminEmail: formData.superadminEmail,
            superadminPhone: formData.superadminPhone,
          };

          result = await updateTenant(currentTenant._id, payload);
        }

        if (result?.success) {
          toast.success(`Tenant ${isCreateModalOpen ? "created" : "updated"} successfully!`);
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          await fetchAllData();
        } else {
          toast.error(result?.error || "An error occurred. Please try again.");
        }
      } catch (error: any) {
        console.error("Failed to submit form:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (loading) {
      return (
        <div className="loadingState">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
          <p>Loading tenants...</p>
        </div>
      );
    }

    return (
      <div className="platformTenantManagementContainer">
        <div className="header">
          <h1>Platform Tenant Management</h1>
          <p className="subtitle">Manage tenants, view their status, and create new ones.</p>
        </div>

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
                  <div className="tenantCardHeader">
                    <h3>{tenant.companyName || tenant.tenantId}</h3>
                    <span className={`statusBadge ${tenant.status}`}>
                      {tenant.status}
                    </span>
                  </div>
                  <div className="tenantDetails">
                    <p><strong>Tenant ID:</strong> {tenant.tenantId}</p>
                    <p>
                      <strong>Super Admin:</strong>
                      {tenant.superadmin
                        ? ` ${tenant.superadmin.firstName} ${tenant.superadmin.lastName} (${tenant.superadmin.username})`
                        : " N/A"}
                    </p>
                    <p><strong>Package:</strong> {tenant.package.name}</p>
                    <p><strong>Email:</strong> {tenant.companyEmail}</p>
                    <p><strong>Created:</strong> {new Date(tenant.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="cardActions">
                    <button className="viewButton" onClick={() => handleViewTenant(tenant)}>
                      View Details
                    </button>
                    <button className="editButton" onClick={() => handleEditTenant(tenant)}>
                      Edit
                    </button>
                    <button 
                      className="deleteButton" 
                      onClick={() => handleDeleteTenant(tenant._id)}
                      disabled={tenant.status === 'active'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="emptyState">
                <h3>No tenants found</h3>
                <p>Get started by registering your first tenant.</p>
                <button className="createButton" onClick={handleCreateTenant}>
                  Register First Tenant
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Tenant Modal */}
        <TenantModal
          show={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Register New Tenant"
          isEditing={false}
          packages={packages}
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
          onSuperadminChange={handleSuperadminFormChange}
          isSubmitting={isSubmitting}
        />

        {/* Edit Tenant Modal */}
        <TenantModal
          show={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit ${currentTenant?.companyName || "Tenant"}`}
          isEditing={true}
          packages={packages}
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
          onSuperadminChange={handleSuperadminFormChange}
          isSubmitting={isSubmitting}
        />

        {/* View Tenant Details Modal */}
        <TenantDetailsModal
          show={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          tenant={currentTenant}
          loading={isModalLoading}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          show={isDeleteConfirmModalOpen}
          onClose={() => setIsDeleteConfirmModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this tenant? This action cannot be undone and will remove all associated data."
        />
      </div>
    );
  };

  export default TenantManagement;