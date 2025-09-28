// fe/src/components/TenantDashboard/clientManagement/EditClientForm/EditClientForm/tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/authContext";
import {
  getClientById,
  updateClient,
  type Client,
  type UpdateClientData,
} from "../../../../services/api/tenant/clientApi";

const EditClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState<UpdateClientData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    dateOfBirth: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!id) {
        setError("Client ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getClientById(id);
        if (response.success && response.data) {
          const client = response.data;

          // Enhanced tenant validation
          const clientTenantId =
            typeof client.tenant === "object"
              ? client.tenant._id
              : client.tenant;

          const userTenantId = currentUser?.tenant?._id;

          if (userTenantId && clientTenantId !== userTenantId) {
            toast.error("Access denied: Client not found in your tenant");
            navigate("/tenant/client-management");
            return;
          }

          setFormData({
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email || "",
            phone: client.phone,
            address: client.address || "",
            idNumber: client.idNumber || "",
            dateOfBirth: formatDateForInput(client.dateOfBirth),
            status: client.status,
          });
        } else {
          throw new Error(response.error || "Failed to load client details");
        }
      } catch (err: any) {
        console.error("Error fetching client details:", err);
        setError(err.message || "Failed to load client details");
        toast.error(`Error loading client: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id, currentUser, navigate]);

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
      setError("First name, last name, and phone are required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!id) {
      setError("Client ID is missing");
      return;
    }

    setSubmitting(true);
    try {
      const response = await updateClient(id, formData);
      if (response.success) {
        toast.success("Client updated successfully!");
        navigate(`/tenant/clients/${id}`);
      } else {
        throw new Error(response.error || "Failed to update client");
      }
    } catch (err: any) {
      console.error("Error updating client:", err);
      setError(err.message || "Failed to update client");
      toast.error(`Error updating client: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pageContainer">
        <div className="loadingMessage">Loading client details...</div>
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <div className="pageContent">
        <Link
          to={`/tenant/clients/${id}`}
          className="backLink"
        >
          ← Back to Client Details
        </Link>

        <h1>
          Edit Client: {formData.firstName} {formData.lastName}
        </h1>

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
              {submitting ? "Updating..." : "Update Client"}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(`/tenant/client-management/clients/${id}`)
              }
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

export default EditClientForm;
