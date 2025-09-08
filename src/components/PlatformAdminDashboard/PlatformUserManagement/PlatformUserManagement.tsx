import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/authContext';
import {
  getAllPlatformUsers,
  createPlatformUser,
  deletePlatformUser,
  updatePlatformUser,
} from '../../../services/api/platformApi';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import './PlatformUserManagement.scss';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const PlatformUserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'platform_employee',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.token) {
        throw new Error("User token not found.");
      }
      const response = await getAllPlatformUsers(user.token);
      console.log('API Response:', response);
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setError('Received invalid data from the server. Please check the API.');
        setUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch platform users:', err);
      setError('Failed to fetch platform users.');
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
    setFormData({ username: '', email: '', password: '', role: 'platform_employee' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- REFACTORED: COMBINED CREATE AND UPDATE LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    setLoading(true);
    setError(null);
    try {
      if (editingUserId) {
        // If editingUserId is set, we're updating an existing user
        await updatePlatformUser(editingUserId, formData, user.token);
      } else {
        // Otherwise, we're creating a new user
        await createPlatformUser(formData, user.token);
      }
      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      console.error(`Failed to ${editingUserId ? 'update' : 'create'} user:`, err);
      setError(`Failed to ${editingUserId ? 'update' : 'create'} user. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  // ---------------------------------------------------

  const handleConfirmDelete = (userId: string) => {
    setUserToDeleteId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDeleteId(null);
  };

  const handleDeleteUser = async () => {
    if (!user?.token || !userToDeleteId) return;

    setLoading(true);
    setError(null);
    try {
      await deletePlatformUser(userToDeleteId, user.token);
      await fetchUsers();
      handleCancelDelete();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (userToEdit: User) => {
    setEditingUserId(userToEdit._id);
    setFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      password: '', // Do not pre-fill password for security
      role: userToEdit.role,
    });
    handleOpenModal();
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
                  <th scope="col" className="tableHeaderCell">Username</th>
                  <th scope="col" className="tableHeaderCell">Email</th>
                  <th scope="col" className="tableHeaderCell">Role</th>
                  <th scope="col" className="tableHeaderCell">Actions</th>
                </tr>
              </thead>
              <tbody className="tableBody">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="tableCellPrimary">{u.username}</td>
                    <td className="tableCellSecondary">{u.email}</td>
                    <td className="tableCellSecondary">{u.role}</td>
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
              <h2 className="modalTitle">{editingUserId ? 'Edit User' : 'Create New User'}</h2>
              <button className="closeButton" onClick={handleCloseModal}>&times;</button>
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
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="formInput"
                >
                  <option value="platform_employee">Platform Employee</option>
                  <option value="platform_admin">Platform Admin</option>
                  <option value="platform_superadmin">Platform Superadmin</option>
                </select>
              </div>
              <div className="formActions">
                <button
                  type="submit"
                  className="submitButton"
                >
                  {editingUserId ? 'Update User' : 'Create User'}
                </button>
              </div>
              {loading && <ClipLoader size={20} color="#4F46E5" />}
              {error && <p className="errorMessage">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modalBackdrop">
          <div className="modalContainer smallModal">
            <h2 className="modalTitle">Confirm Deletion</h2>
            <p className="modalText">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="modalActions">
              <button onClick={handleDeleteUser} className="deleteButton">Delete</button>
              <button onClick={handleCancelDelete} className="cancelButton">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformUserManagement;
