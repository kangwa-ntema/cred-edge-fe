// fe/src/components/TenantDashboard/ClientManagement/RegisterClientForm/RegisterClientForm.tsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createClient } from "../../../../services/api/tenant/clientApi";
import { useAuth } from "../../../../context/authContext";
import { type CreateClientData } from "../../../../services/api/tenant/clientApi";

const RegisterClientForm = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const tenant = currentUser?.tenant;

  const [formData, setFormData] = useState<CreateClientData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    dateOfBirth: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Enhanced validation
    if (
      !formData.firstName?.trim() ||
      !formData.lastName?.trim() ||
      !formData.phone?.trim()
    ) {
      setError("First name, last name, and phone are required");
      toast.error("Please fill in all required fields");
      return;
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError(
        "Phone number must be at least 10 digits and can include +, -, (, )"
      );
      toast.error("Invalid phone number format");
      return;
    }

    // Email validation (if provided)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      toast.error("Invalid email format");
      return;
    }

    if (!tenant) {
      setError("Tenant information not available");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createClient(formData);
      if (response.success) {
        toast.success("Client registered successfully!");
        navigate("/tenant/client-management");
      } else {
        setError(response.error || "Failed to register client");
      }
    } catch (err: any) {
      setError(err.message || "Failed to register client");
      console.error("Registration failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!tenant) {
    return (
      <div className="pageContainer">
        <div className="errorMessage">Tenant information not available</div>
        <Link to="/tenant/client-management" className="backLink">
          ← Back to Client List
        </Link>
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <div className="pageContent">
        <Link to="/tenant/client-management" className="backLink">
          ← Back to Client List
        </Link>

        <h1>Register New Client - {tenant.companyName}</h1>

        {error && <div className="errorMessage">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
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
                placeholder="Enter first name"
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
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                placeholder="optional@email.com"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={submitting}
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="idNumber">ID Number</label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Optional"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              disabled={submitting}
              placeholder="Optional address information"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>

          <div className="formActions">
            <button
              type="submit"
              disabled={submitting}
              className="submitButton"
            >
              {submitting ? "Registering..." : "Register Client"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/tenant/client-management")}
              disabled={submitting}
              className="cancelButton"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterClientForm;
