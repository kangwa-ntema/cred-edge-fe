import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { updateUserProfile, changeUserPassword } from '../../services/api/common/combinedUserManagement';
import './SettingsPages.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Type definitions for form data and user state
interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// Modal component
const Modal = ({ show, onClose, title, children }: any) => {
  if (!show) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();

  // State for modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // State for form data
  const [profileData, setProfileData] = useState<UserData>({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State for UI messages and loading indicators
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);

  // Update form data when user context changes
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      if (!user?.token) {
        throw new Error('Authentication token is missing.');
      }
      const result = await updateUserProfile(user.token, profileData);
      
      if (result.success) {
        // Update the user context with the new data from the API
        if (result.data) {
          updateUser({
            ...user,
            ...result.data
          });
        }
        toast.success('Profile updated successfully!');
        setShowProfileModal(false);
      } else {
        toast.error(result.error || 'Failed to update profile. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning('New passwords do not match.');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      if (!user?.token) {
        throw new Error('Authentication token is missing.');
      }
      const result = await changeUserPassword(user.token, passwordData);
      
      if (result.success) {
        toast.success(result.data.message);
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Clear form
      } else {
        toast.error(result.error || 'Failed to change password. Please check your current password.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="settingsPageContainer">
      <div className="settingsPageHeader">
        <h1 className="settingsPageTitle">User Settings</h1>
        <button onClick={logout} className="logoutButton">Log Out</button>
      </div>

      <p className="settingsPageSubtitle">
        Manage your profile and account settings.
      </p>

      {message && (
        <div className={`messageBox ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settingsCardGrid">
        {/* Profile Card */}
        <div className="settingsCard">
          <h2 className="cardTitle">Personal Information</h2>
          <p className="cardDescription">View and edit your profile details.</p>
          <button className="cardButton" onClick={() => setShowProfileModal(true)}>
            Edit Profile
          </button>
        </div>

        {/* Change Password Card */}
        <div className="settingsCard">
          <h2 className="cardTitle">Change Password</h2>
          <p className="cardDescription">Update your password to keep your account secure.</p>
          <button className="cardButton" onClick={() => setShowPasswordModal(true)}>
            Change Password
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal show={showProfileModal} onClose={() => setShowProfileModal(false)} title="Edit Profile">
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
            />
          </div>
          <button type="submit" className="submitButton" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="submitButton" disabled={isUpdatingPassword}>
            {isUpdatingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default SettingsPage;
