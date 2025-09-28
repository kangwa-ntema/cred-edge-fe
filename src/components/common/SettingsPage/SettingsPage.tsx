// fe/src/components/common/settingPage/SettingPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import { updateUserProfile, changeUserPassword } from '../../../services/api/common/authApi';
import './SettingsPage.scss';
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
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
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
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State for UI messages and loading indicators
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  try {
    const response = await updateUserProfile(profileData);
    
    console.log('Update profile response:', response);
    
    // Handle the backend's actual response structure
    if (response._id) {
      // Backend returns the user object directly
      if (user) {
        updateUser({
          ...user,
          ...response
        });
      }
      toast.success('Profile updated successfully!');
      setShowProfileModal(false);
    } else {
      // Handle error cases or unexpected responses
      const errorMessage = response.message || 
                          'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    }
  } catch (error: any) {
    console.error('Update profile error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred. Please try again.';
    toast.error(errorMessage);
  } finally {
    setIsUpdating(false);
  }
};

// In your handleChangePassword function
const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsUpdatingPassword(true);

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.warning('New passwords do not match.');
    setIsUpdatingPassword(false);
    return;
  }

  try {
    const response = await changeUserPassword(passwordData.currentPassword, passwordData.newPassword);
    
    console.log('Change password response:', response);
    
    // Handle the backend's actual response structure
    if (response.message && response.message.includes('success')) {
      // Backend returns { message: 'Password updated successfully.' }
      toast.success(response.message);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      // Handle error cases
      const errorMessage = response.message || 
                          'Failed to change password. Please check your current password.';
      toast.error(errorMessage);
    }
  } catch (error: any) {
    console.error('Change password error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred. Please try again.';
    toast.error(errorMessage);
  } finally {
    setIsUpdatingPassword(false);
  }
};

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="settingsPageContainer">
      <div className="settingsPageHeader">
        <button onClick={handleBack} className="backButton">
          &larr; Back
        </button>
        <h1 className="settingsPageTitle">User Settings</h1>
      </div>

      <p className="settingsPageSubtitle">
        Manage your profile and account settings.
      </p>

      <div className="settingsCardGrid">
        {/* Profile Information Card (Read-only) */}
        <div className="settingsCard">
          <h2 className="cardTitle">Personal Information</h2>
          <div className="profileInfo">
            <div className="infoRow">
              <span className="infoLabel">Username:</span>
              <span className="infoValue">{user?.username || 'N/A'}</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">Email:</span>
              <span className="infoValue">{user?.email || 'N/A'}</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">First Name:</span>
              <span className="infoValue">{user?.firstName || 'N/A'}</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">Last Name:</span>
              <span className="infoValue">{user?.lastName || 'N/A'}</span>
            </div>
            <div className="infoRow">
              <span className="infoLabel">Phone:</span>
              <span className="infoValue">{user?.phone || 'N/A'}</span>
            </div>
          </div>
          <button className="cardButton" onClick={() => setShowProfileModal(true)}>
            Edit Profile
          </button>
        </div>

        {/* Security Card */}
        <div className="settingsCard">
          <h2 className="cardTitle">Security</h2>
          <p className="cardDescription">Update your password to keep your account secure.</p>
          <button className="cardButton" onClick={() => setShowPasswordModal(true)}>
            Change Password
          </button>
        </div>
      </div>

      {/* Logout Button at the bottom */}
      <div className="logoutSection">
        <button onClick={logout} className="logoutButton">Log Out</button>
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
              disabled
            />
            <small className="form-help">Email cannot be changed</small>
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
          <div className="modal-actions">
            <button type="button" className="cancelButton" onClick={() => setShowProfileModal(false)}>
              Cancel
            </button>
            <button type="submit" className="submitButton" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
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
          <div className="modal-actions">
            <button type="button" className="cancelButton" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </button>
            <button type="submit" className="submitButton" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default SettingsPage;