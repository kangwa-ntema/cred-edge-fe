// fe/src/components/TenantUserManagement/ViewTenantUserPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTenantUserById, deleteTenantUser, changeTenantUserPassword } from '../../../services/api/tenant/tenantUserApi';
import { useAuth } from '../../../context/authContext';
import { toast } from 'react-toastify';
import './TenantUserManagementDashboard.scss';

const ViewTenantUserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, hasRole } = useAuth();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [resettingPassword, setResettingPassword] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState('');

    const fetchUserDetails = useCallback(async () => {
        if (!id || id === 'undefined') {
            setLoading(false);
            setError("User ID is missing or invalid.");
            toast.error("Invalid user ID provided.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await getTenantUserById(id);
            setUser(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user details.');
            console.error("Error fetching user details:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const confirmDeleteAction = () => {
        if (!user) return;

        if (currentUser && currentUser._id === user._id) {
            toast.error("You cannot delete your own user account.");
            return;
        }

        setModalAction('delete');
        setModalMessage(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`);
        setShowConfirmModal(true);
    };

    const confirmResetPasswordAction = () => {
        if (!user) return;

        if (currentUser && currentUser._id === user._id) {
            toast.error("You cannot reset your own password from this interface. Please use the 'Change My Password' feature.");
            return;
        }

        setModalAction('resetPassword');
        setModalMessage(`Are you sure you want to reset the password for user "${user.username}"?`);
        setShowConfirmModal(true);
    };

    const executeConfirmedAction = async () => {
        setShowConfirmModal(false);

        if (modalAction === 'delete' && user) {
            setDeleting(true);
            try {
                await deleteTenantUser(user._id);
                toast.success('User deleted successfully!');
                navigate('/tenant/user-management');
            } catch (err: any) {
                toast.error(`Failed to delete user: ${err.message || 'Network error'}`);
                setError(err.message || 'Failed to delete user.');
            } finally {
                setDeleting(false);
            }
        } else if (modalAction === 'resetPassword' && user) {
            setResettingPassword(true);
            try {
                await changeTenantUserPassword(user._id, 'temporary-password-123');
                toast.success(`Password for ${user.username} has been reset.`);
            } catch (err: any) {
                toast.error(`Failed to reset password: ${err.message || 'Network error'}`);
                setError(err.message || 'Failed to reset password.');
            } finally {
                setResettingPassword(false);
            }
        }
        setModalAction(null);
    };

    if (loading) {
        return <div className="viewTenantUserPageContainer"><div className="viewTenantUserMessage">Loading user details...</div></div>;
    }

    if (error) {
        return <div className="viewTenantUserPageContainer"><div className="viewTenantUserErrorMessage">Error: {error}</div></div>;
    }

    if (!user) {
        return <div className="viewTenantUserPageContainer"><div className="viewTenantUserMessage">User not found or inaccessible.</div></div>;
    }

    const getRoleClass = (role: string) => {
        switch (role.toLowerCase()) {
            case 'tenant_superadmin': return 'role-tenant_superadmin';
            case 'admin': return 'role-admin';
            case 'employee': return 'role-employee';
            default: return '';
        }
    };

    const getStatusClass = (isActive: boolean) => {
        return isActive ? 'status-active' : 'status-inactive';
    };

    return (
        <div className="viewTenantUserPageContainer">
            <div className="viewTenantUserPageContent">
                <Link to="/tenant/user-management" className="viewTenantUserBackLink">
                    Back to User List
                </Link>

                <h2 className="viewTenantUserHeadline">User Profile: {user.username}</h2>

                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Username:</label>
                    <p className="viewTenantUserDetailValue">{user.username}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Role:</label>
                    <p className={`viewTenantUserDetailValue ${getRoleClass(user.role)}`}>{user.role}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Status:</label>
                    <p className={`viewTenantUserDetailValue ${getStatusClass(user.isActive)}`}>{user.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">First Name:</label>
                    <p className="viewTenantUserDetailValue">{user.firstName || 'N/A'}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Last Name:</label>
                    <p className="viewTenantUserDetailValue">{user.lastName || 'N/A'}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Email:</label>
                    <p className="viewTenantUserDetailValue">{user.email || 'N/A'}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Employee ID:</label>
                    <p className="viewTenantUserDetailValue">{user.employeeId || 'N/A'}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Phone:</label>
                    <p className="viewTenantUserDetailValue">{user.phone || 'N/A'}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Registered On:</label>
                    <p className="viewTenantUserDetailValue">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="viewTenantUserDetailGroup">
                    <label className="viewTenantUserDetailLabel">Last Updated:</label>
                    <p className="viewTenantUserDetailValue">{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="viewTenantUserActions">
                    {hasRole(["tenant_superadmin", "admin"]) && (
                        <Link to={`/tenant/user-management/${user._id}/edit`} className="viewTenantUserActionButton edit-btn">
                            Edit User
                        </Link>
                    )}

                    {hasRole(["tenant_superadmin", "admin"]) && currentUser && currentUser._id !== user._id && (
                        <button onClick={confirmResetPasswordAction} disabled={resettingPassword} className="viewTenantUserActionButton reset-password-btn">
                            {resettingPassword ? 'Resetting...' : 'Reset Password'}
                        </button>
                    )}

                    {hasRole(["tenant_superadmin"]) && currentUser && currentUser._id !== user._id && (
                        <button onClick={confirmDeleteAction} disabled={deleting} className="viewTenantUserActionButton delete-btn">
                            {deleting ? 'Deleting...' : 'Delete User'}
                        </button>
                    )}
                </div>
            </div>

            {showConfirmModal && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h3>Confirm Action</h3>
                        <p>{modalMessage}</p>
                        <div className="modalActions">
                            <button onClick={executeConfirmedAction} className="modalConfirmBtn">Confirm</button>
                            <button onClick={() => setShowConfirmModal(false)} className="modalCancelBtn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewTenantUserPage;