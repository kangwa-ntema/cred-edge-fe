// src/Pages/PlatformDashboard/TenantUserManagementPage/TenantUserManagementDashboard/TenantUserManagementDashboard.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/authContext";
import { getAllTenantUsers, deleteTenantUser, type TenantUser } from "../../../services/api/tenant/tenantUserApi";
//import './TenantUserManagementDashboard.scss';

const TenantUserManagementDashboard = () => {
    const { user: currentUser, hasRole } = useAuth();
    console.log('Current User:', currentUser);
    console.log('User Tenant:', currentUser?.tenant);
    const [users, setUsers] = useState<TenantUser[]>([]);
    const [overallSummary, setOverallSummary] = useState<any>({});
    const [roleFilter, setRoleFilter] = useState("all");
    const [isActiveFilter, setIsActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState('');

    // Get tenant info from current user (tenant admin)
    const tenant = currentUser?.tenant;

    // ✅ FIXED: Use location.pathname to ensure data is fetched when navigating back to the page
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const filters: any = {};
                if (roleFilter !== "all") {
                    filters.role = roleFilter;
                }
                if (isActiveFilter !== "all") {
                    filters.isActive = isActiveFilter === "true";
                }

                const response = await getAllTenantUsers(filters);

                if (response.success && response.data) {
                    setUsers(response.data.users || []);
                    setOverallSummary(response.data.overallSummary || {});
                } else {
                    if (response.error?.includes('Tenant context')) {
                        setError("Authentication issue: Please log out and log in again");
                    } else {
                        setError(response.error || "Failed to fetch users");
                    }
                }
            } catch (err: any) {
                if (err.message?.includes('Tenant context') || err.response?.status === 400) {
                    setError("Authentication issue: Please log out and log in again to refresh your session");
                } else {
                    setError(err.message || "Failed to fetch users");
                }
                console.error("Error fetching tenant users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [roleFilter, isActiveFilter, location.pathname]);

    const confirmDelete = (userId: string, username: string) => {
        if (currentUser && currentUser._id === userId) {
            toast.error("You cannot delete your own user account from here.");
            return;
        }
        setUserToDelete(userId);
        setModalMessage(`Are you sure you want to delete user "${username}"? This action cannot be undone.`);
        setShowConfirmModal(true);
    };

    const executeDelete = async () => {
        if (!userToDelete) return;

        setShowConfirmModal(false);
        try {
            const response = await deleteTenantUser(userToDelete);
            if (response.success) {
                toast.success("User deleted successfully!");
                // Re-fetch users after a successful delete
                navigate(location.pathname);
            } else {
                toast.error(response.error || "Failed to delete user");
            }
        } catch (err: any) {
            toast.error(`Failed to delete user: ${err.message || 'Network error'}`);
            console.error("Error deleting user:", err);
        } finally {
            setUserToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="tenantUsersDashboardContainer">
                <div className="tenantUsersMessage">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tenantUsersDashboardContainer">
                <div className="tenantUsersErrorMessage">Error: {error}</div>
            </div>
        );
    }

    if (!tenant) {
        return (
            <div className="tenantUsersDashboardContainer">
                <div className="tenantUsersErrorMessage">Tenant information not available</div>
            </div>
        );
    }

    return (
        <div className="tenantUsersDashboardContainer">
            <Link to="/tenant/dashboard">
                <button className="tenantUsersDashboardBackLink">
                    Back to Dashboard
                </button>
            </Link>

            <h2 className="tenantUsersDashboardHeadline">
                USER MANAGEMENT - {tenant.companyName}
            </h2>
            <h3 className="tenantUsersDashboardSubHeadline">Tenant ID: {tenant.tenantId}</h3>

            <div className="tenantUsersDashboard">
                <div className="tenantUsersDashboardPanelContainer">
                    {hasRole(["tenant_superadmin", "admin"]) && (
                        <Link to="/tenant/users/register">
                            <button className="registerNewUserBtn">+ Register New User</button>
                        </Link>
                    )}

                    <div className="tenantUsersDashboardPanel">
                        <section className="userSummarySection">
                            <div className="userSummaryCards">
                                <div className="userSummaryCard">
                                    <h3 className="userSummaryCardTitle">Total Users:</h3>
                                    <p className="userSummaryCardValue">
                                        {overallSummary.totalUsers || 0}
                                    </p>
                                </div>
                                <div className="userSummaryCard">
                                    <h3 className="userSummaryCardTitle">Superadmins:</h3>
                                    <p className="userSummaryCardValue">
                                        {overallSummary.tenant_superadmins || 0}
                                    </p>
                                </div>
                                <div className="userSummaryCard">
                                    <h3 className="userSummaryCardTitle">Admins:</h3>
                                    <p className="userSummaryCardValue">
                                        {overallSummary.admins || 0}
                                    </p>
                                </div>
                                <div className="userSummaryCard">
                                    <h3 className="userSummaryCardTitle">Employees:</h3>
                                    <p className="userSummaryCardValue">
                                        {overallSummary.employees || 0}
                                    </p>
                                </div>
                                <div className="userSummaryCard">
                                    <h3 className="userSummaryCardTitle">Clients:</h3>
                                    <p className="userSummaryCardValue">
                                        {overallSummary.clients || 0}
                                    </p>
                                </div>
                                <div className="userSummaryCard">
                                    <h3 className="userSummaryCardTitle">Active Users:</h3>
                                    <p className="userSummaryCardValue">
                                        {overallSummary.activeUsers || 0}
                                    </p>
                                </div>
                                <div className="userSummaryCard">
                                    <h3 className="userSummaryCardTitle">Inactive Users:</h3>
                                    <p className="userSummaryCardValue">
                                        {overallSummary.inactiveUsers || 0}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="tenantUserDashboardContentContainer">
                    <div className="DashboardPanelFilter">
                        <h3 className="usersFilterBtnHeadline">Filters</h3>
                        <div className="usersFilterButtons">
                            <div className="usersFilterButton">
                                <label className="usersFilterBtnSubHeadline">
                                    Filter by Role:
                                </label>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="usersFilterSelect"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="tenant_superadmin">Superadmin</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                    <option value="client">Client</option>
                                </select>
                            </div>
                            <div className="usersFilterButton">
                                <label className="usersFilterBtnSubHeadline">
                                    Filter by Status:
                                </label>
                                <select
                                    value={isActiveFilter}
                                    onChange={(e) => setIsActiveFilter(e.target.value)}
                                    className="usersFilterSelect"
                                >
                                    <option value="all">All</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="tenantUserDashboardContent">
                        <section className="userListSection">
                            <h3 className="usersListHeadline">All Users List</h3>
                            {users.length === 0 ? (
                                <p className="usersNoDataMessage">No users found matching the current filters.</p>
                            ) : (
                                <div className="usersTableContainer">
                                    <table className="usersTable">
                                        <thead className="usersTableHead">
                                            <tr>
                                                <th>Username</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Employee ID</th>
                                                <th>Department</th>
                                                <th>Created At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id}>
                                                    <td>{user.username}</td>
                                                    <td>{user.role}</td>
                                                    <td>{user.isActive ? "Active" : "Inactive"}</td>
                                                    <td>{user.firstName || "N/A"}</td>
                                                    <td>{user.lastName || "N/A"}</td>
                                                    <td>{user.email || "N/A"}</td>
                                                    <td>{user.employeeId || "N/A"}</td>
                                                    <td>{user.department || "N/A"}</td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        {hasRole(["tenant_superadmin", "admin"]) && (
                                                            <>
                                                                <Link to={`/tenant/users/${user._id}`}>
                                                                    <button className="viewUserDetailsLink">Details</button>
                                                                </Link>
                                                                <Link to={`/tenant/users/${user._id}/edit`}>
                                                                    <button className="editUserBtn">Edit</button>
                                                                </Link>
                                                                {hasRole(["tenant_superadmin"]) && (
                                                                    <button
                                                                        className="deleteUserBtn"
                                                                        onClick={() => confirmDelete(user._id, user.username)}
                                                                        disabled={loading}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                                <Link to={`/tenant/users/${user._id}/change-password`}>
                                                                    <button className="changeUserPasswordBtn">Change Password</button>
                                                                </Link>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h3>Confirm Action</h3>
                        <p>{modalMessage}</p>
                        <div className="modalActions">
                            <button onClick={executeDelete} className="modalConfirmBtn">Yes, Delete</button>
                            <button onClick={() => setShowConfirmModal(false)} className="modalCancelBtn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantUserManagementDashboard;
