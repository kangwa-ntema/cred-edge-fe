// src/Pages/PlatformDashboard/TenantUserManagementPage/RegisterTenantUserForm/RegisterTenantUserForm.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Remove useParams
import { toast } from "react-toastify";
import { createTenantUser } from "../../../services/api/tenant/tenantUserApi";
import { useAuth } from "../../../context/authContext"; // Add useAuth
import { type CreateTenantUserData } from "../../../services/api/tenant/tenantUserApi";

const RegisterTenantUserForm = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // Get current user

  // Get tenant from current user (tenant admin)
  const tenant = currentUser?.tenant;

  const [formData, setFormData] = useState<CreateTenantUserData>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "employee",
    employeeId: "",
    department: "",
    position: "",
    isActive: true,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Remove tenantId fetching logic since we get it from current user

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    if (!tenant) {
      setError("Tenant information not available");
      toast.error("Tenant information not available");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setSubmitting(true);
    try {
      // Remove tenantId parameter - API uses auth context
      const response = await createTenantUser(formData);
      if (response.success) {
        toast.success("User registered successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phone: "",
          role: "employee",
          employeeId: "",
          department: "",
          position: "",
          isActive: true,
        });
        setConfirmPassword("");
        setTimeout(() => navigate("/tenant/user-management"), 1500);
      } else {
        setError(response.error || "Failed to register user");
        toast.error(response.error || "Failed to register user");
      }
    } catch (err: any) {
      setError(err.message || "Failed to register user");
      toast.error("Failed to register user");
      console.error("Registration failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!tenant) {
    return (
      <div className="registerTenantUserContainer">
        <div className="registerTenantUserErrorMessage">
          Tenant information not available. Please make sure you are logged in
          as a tenant administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="registerTenantUserContainer">
      {/* Update back link to tenant user management */}
      <Link to="/tenant/user-management" className="registerTenantUserBackLink">
        Back to User List
      </Link>

      <h2 className="registerTenantUserHeadline">
        Register New User - {tenant.companyName}
      </h2>

      {error && <p className="registerTenantUserErrorMessage">{error}</p>}

      <form onSubmit={handleSubmit} className="registerTenantUserForm">
        {/* Rest of your form remains the same */}
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

        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="tenant_superadmin">Superadmin</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>

        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>
        </div>

        <div className="formGroup">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        <div className="formCheckboxGroup">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            disabled={submitting}
          />
          <label htmlFor="isActive">Active User</label>
        </div>

        <button type="submit" disabled={submitting} className="submitButton">
          {submitting ? "Registering..." : "Register User"}
        </button>
      </form>
    </div>
  );
};

export default RegisterTenantUserForm;
