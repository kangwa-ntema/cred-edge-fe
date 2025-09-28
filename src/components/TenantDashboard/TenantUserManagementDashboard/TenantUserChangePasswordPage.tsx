// fe/src/components/PlatformAdminDashboard/TenantUserManagement/TenantUserChangePasswordPage/TenantUserChangePasswordPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTenantUserById, changeTenantUserPassword } from '../../../services/api/tenant/tenantUserApi';
import { getTenantById } from '../../../services/api/platform/tenantUserApi';
//import './TenantUserChangePasswordPage.scss';

const TenantUserChangePasswordPage = () => {
    const { tenantId, id } = useParams<{ tenantId: string; id: string }>();
    const navigate = useNavigate();

    const [tenant, setTenant] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
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
                    setUser(userResponse.data);
                } else {
                    setError(userResponse.error || "Failed to load user data");
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tenantId, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenantId || !id) return;

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const response = await changeTenantUserPassword(tenantId, id, newPassword);
            if (response.success) {
                toast.success('Password changed successfully!');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => navigate(`/platform/tenants/${tenantId}/users`), 1500);
            } else {
                setError(response.error || 'Failed to change password');
                toast.error(response.error || 'Failed to change password');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
            toast.error('Failed to change password');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="tenantUserChangePasswordContainer"><div className="tenantUserChangePasswordMessage">Loading...</div></div>;
    }

    if (error && (!tenant || !user)) {
        return <div className="tenantUserChangePasswordContainer"><div className="tenantUserChangePasswordErrorMessage">Error: {error}</div></div>;
    }

    if (!tenant || !user) {
        return <div className="tenantUserChangePasswordContainer"><div className="tenantUserChangePasswordMessage">Tenant or user not found</div></div>;
    }

    return (
        <div className="tenantUserChangePasswordContainer">
            <Link to={`/platform/tenants/${tenantId}/users`} className="tenantUserChangePasswordBackLink">
                Back to User List
            </Link>
            
            <h2 className="tenantUserChangePasswordHeadline">
                Change Password for {user.username} - {tenant.companyName}
            </h2>

            {error && <p className="tenantUserChangePasswordErrorMessage">{error}</p>}

            <form onSubmit={handleSubmit} className="tenantUserChangePasswordForm">
                <div className="formGroup">
                    <label htmlFor="newPassword">New Password *</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={submitting}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={submitting}
                    />
                </div>
                <button type="submit" disabled={submitting} className="submitButton">
                    {submitting ? 'Changing...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default TenantUserChangePasswordPage;