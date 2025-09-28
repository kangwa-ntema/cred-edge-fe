// fe/src/components/PlatformAdminDashboard/TenantUserManagement/EditTenantUserForm/EditTenantUserForm.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTenantUserById, updateTenantUser } from '../../../services/api/tenant/tenantUserApi';
import { getTenantById } from '../../../services/api/platform/tenantUserApi';
import { type UpdateTenantUserData } from '../../../services/api/tenant/tenantUserApi';
//import './EditTenantUserForm.scss';

const EditTenantUserForm = () => {
    const { tenantId, id } = useParams<{ tenantId: string; id: string }>();
    const navigate = useNavigate();

    const [tenant, setTenant] = useState<any>(null);
    const [formData, setFormData] = useState<UpdateTenantUserData>({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'employee',
        employeeId: '',
        department: '',
        position: '',
        isActive: true,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!tenantId || !id) {
            setError("Tenant ID or User ID is missing");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const [tenantResponse, userResponse] = await Promise.all([
                getTenantById(tenantId),
                getTenantUserById(tenantId, id)
            ]);

            if (tenantResponse.success && tenantResponse.data) {
                setTenant(tenantResponse.data);
            } else {
                setError("Failed to load tenant data");
            }

            if (userResponse.success && userResponse.data) {
                const user = userResponse.data;
                setFormData({
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone || '',
                    role: user.role,
                    employeeId: user.employeeId || '',
                    department: user.department || '',
                    position: user.position || '',
                    isActive: user.isActive,
                });
            } else {
                setError(userResponse.error || "Failed to load user data");
            }
        } catch (err: any) {
            setError(err.message || "Failed to fetch data");
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }, [tenantId, id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenantId || !id) return;

        setSubmitting(true);
        setError(null);
        try {
            const response = await updateTenantUser(tenantId, id, formData);
            if (response.success) {
                toast.success('User updated successfully!');
                setTimeout(() => navigate(`/platform/tenants/${tenantId}/users`), 1500);
            } else {
                setError(response.error || 'Failed to update user');
                toast.error(response.error || 'Failed to update user');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update user');
            toast.error('Failed to update user');
            console.error("Update failed:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="editTenantUserContainer"><div className="editTenantUserMessage">Loading...</div></div>;
    }

    if (error && !tenant) {
        return <div className="editTenantUserContainer"><div className="editTenantUserErrorMessage">Error: {error}</div></div>;
    }

    if (!tenant) {
        return <div className="editTenantUserContainer"><div className="editTenantUserMessage">Tenant not found</div></div>;
    }

    return (
        <div className="editTenantUserContainer">
            <Link to={`/platform/tenants/${tenantId}/users`} className="editTenantUserBackLink">
                Back to User List
            </Link>
            
            <h2 className="editTenantUserHeadline">
                Edit User - {tenant.companyName}
            </h2>

            {error && <p className="editTenantUserErrorMessage">{error}</p>}

            <form onSubmit={handleSubmit} className="editTenantUserForm">
                {/* Form fields similar to RegisterTenantUserForm but for editing */}
                <div className="formRow">
                    <div className="formGroup">
                        <label htmlFor="username">Username *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={submitting}
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={submitting}
                        />
                    </div>
                </div>

                {/* Add other form fields here */}

                <button type="submit" disabled={submitting} className="submitButton">
                    {submitting ? 'Updating...' : 'Update User'}
                </button>
            </form>
        </div>
    );
};

export default EditTenantUserForm;