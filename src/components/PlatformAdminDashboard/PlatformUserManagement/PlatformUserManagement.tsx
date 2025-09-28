// fe/src/components/PlatformAdminDashboard/PlatformUserManagement/PlatformUserManagement.tsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import {
  getPlatformUsers,
  createPlatformUser,
  updatePlatformUser,
  deletePlatformUser,
  type PlatformUser,
} from "../../../services/api/platform/platformUserApi";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import "./PlatformUserManagement.scss";

const PlatformUserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "platform_employee" as const,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPlatformUsers();
      console.log("Fetched users response:", response);

      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        const errorMsg = response.error || "Failed to fetch platform users.";
        setError(errorMsg);
        setUsers([]);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      console.error("Failed to fetch platform users:", err);
      const errorMessage = err.message || "Failed to fetch platform users.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "platform_employee",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started!');
    console.log("Current user:", user);
    console.log("Submitting form with data:", formData);

    setLoading(true);
    setError(null);
    try {
      let response;
      if (editingUserId) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        response = await updatePlatformUser(editingUserId, updateData);
      } else {
        response = await createPlatformUser(formData);
      }

      if (response.success) {
        toast.success(response.message || (editingUserId ? "User updated successfully!" : "User created successfully!"));
        await fetchUsers();
        handleCloseModal();
      } else {
        const errorMessage = response.error || `Failed to ${editingUserId ? "update" : "create"} user.`;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error(`Failed to ${editingUserId ? "update" : "create"} user:`, err);
      const errorMessage = err.message || `Failed to ${editingUserId ? "update" : "create"} user. Please try again.`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (userId: string) => {
    setUserToDeleteId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDeleteId(null);
  };

const handleDeleteUser = async () => {
    if (!userToDeleteId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await deletePlatformUser(userToDeleteId);
      
      if (response.success) {
        toast.success(response.message || "User deleted successfully!");
        await fetchUsers();
        handleCancelDelete();
      } else {
        const errorMessage = response.error || "Failed to delete user.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      const errorMessage = err.message || "Failed to delete user. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleEditClick = (userToEdit: PlatformUser) => {
    setEditingUserId(userToEdit._id);
    setFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      password: "", // Do not pre-fill password for security
      firstName: userToEdit.firstName || "",
      lastName: userToEdit.lastName || "",
      phone: userToEdit.phone || "",
      role: userToEdit.role,
    });
    handleOpenModal();
  };

  const formatRole = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      platform_superadmin: "Platform Super Admin",
      platform_admin: "Platform Admin",
      platform_employee: "Platform Employee",
    };
    return roleMap[role] || role;
  };

  return (
    <div className="userManagementContainer">
      <div className="header">
        <h1 className="pageTitle">Platform User Management</h1>
        <Link to="/platform/dashboard" className="backButton">
          Back to Dashboard
        </Link>
      </div>

      <p className="pageSubtitle">
        View, create, and manage platform users here.
      </p>

      <div className="contentCard">
        <div className="contentHeader">
          <h2 className="sectionTitle">User List</h2>
          <button
            onClick={() => {
              setEditingUserId(null);
              handleOpenModal();
            }}
            className="createButton"
          >
            Create New User
          </button>
        </div>

        {loading ? (
          <div className="loadingSpinner">
            <ClipLoader size={50} color="#4F46E5" />
          </div>
        ) : (
          <div className="userTableContainer">
            <table className="userTable">
              <thead className="tableHeader">
                <tr>
                  <th scope="col" className="tableHeaderCell">
                    Username
                  </th>
                  <th scope="col" className="tableHeaderCell">
                    Email
                  </th>
                  <th scope="col" className="tableHeaderCell">
                    Name
                  </th>
                  <th scope="col" className="tableHeaderCell">
                    Phone
                  </th>
                  <th scope="col" className="tableHeaderCell">
                    Role
                  </th>
                  <th scope="col" className="tableHeaderCell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="tableBody">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="tableCellPrimary">{u.username}</td>
                    <td className="tableCellSecondary">{u.email}</td>
                    <td className="tableCellSecondary">
                      {u.firstName || u.lastName
                        ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
                        : "-"}
                    </td>
                    <td className="tableCellSecondary">{u.phone || "-"}</td>
                    <td className="tableCellSecondary">{formatRole(u.role)}</td>
                    <td className="tableActions">
                      <button
                        onClick={() => handleEditClick(u)}
                        className="editButton"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(u._id)}
                        className="deleteButton"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modalBackdrop">
          <div className="modalContainer">
            <div className="modalHeader">
              <h2 className="modalTitle">
                {editingUserId ? "Edit User" : "Create New User"}
              </h2>
              <button className="closeButton" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="userForm">
              <div className="formGrid">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="formInput"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="formInput"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (required for new user)"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUserId}
                  className="formInput"
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="formInput"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="formInput"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="formInput"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="formInput"
                  required
                >
                  <option value="platform_employee">Platform Employee</option>
                  <option value="platform_admin">Platform Admin</option>
                  <option value="platform_superadmin">
                    Platform Superadmin
                  </option>
                </select>
              </div>
              <div className="formActions">
                <button
                  type="submit"
                  className="submitButton"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={20} color="#ffffff" />
                  ) : editingUserId ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
              {error && <p className="errorMessage">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modalBackdrop">
          <div className="modalContainer smallModal">
            <h2 className="modalTitle">Confirm Deletion</h2>
            <p className="modalText">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="modalActions">
              <button
                onClick={handleDeleteUser}
                className="deleteButton"
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="#ffffff" /> : "Delete"}
              </button>
              <button
                onClick={handleCancelDelete}
                className="cancelButton"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformUserManagement;
