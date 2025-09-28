// fe/src/components/TenantDashboard/ClientManagement/ViewClientForm/ViewClientForm.tsx

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/authContext";
import { getClientById } from "../../../../services/api/tenant/clientApi";
import { type Client } from "../../../../services/api/tenant/clientApi";

const ViewClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole, user: currentUser } = useAuth();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error("Client ID is required");
        }

        const response = await getClientById(id);
        if (response.success && response.data) {
          const clientData = response.data;

          // Enhanced tenant validation
          const clientTenantId =
            typeof clientData.tenant === "object"
              ? clientData.tenant._id
              : clientData.tenant;

          const userTenantId = currentUser?.tenant?._id;

          if (userTenantId && clientTenantId !== userTenantId) {
            toast.error("Access denied: Client not found in your tenant");
            navigate("/tenant/client-management");
            return;
          }

          setClient(clientData);
        } else {
          throw new Error(response.error || "Failed to fetch client details");
        }
      } catch (err: any) {
        console.error("Error fetching client details:", err);
        const errorMessage = err.message || "Failed to fetch client details.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientDetails();
    }
  }, [id, currentUser, navigate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="pageContainer">
        <div className="loadingMessage">Loading client details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pageContainer">
        <div className="errorMessage">Error: {error}</div>
        <Link to="/tenant/client-management" className="backLink">
          Back to Clients List
        </Link>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="pageContainer">
        <div className="message">Client not found.</div>
        <Link to="/tenant/client-management" className="backLink">
          Back to Clients List
        </Link>
      </div>
    );
  }

  return (
    <div className="pageContainer">
      <div className="pageContent">
        <Link to="/tenant/client-management" className="backLink">
          ← Back to Clients List
        </Link>

        <h1>
          Client Details: {client.firstName} {client.lastName}
        </h1>

        <div className="detailsSections">
          <section className="infoSection card">
            <h3>Personal Information</h3>
            <div className="infoGrid">
              <div className="infoItem">
                <strong>Client ID:</strong> <span>{client.clientId}</span>
              </div>
              <div className="infoItem">
                <strong>First Name:</strong> <span>{client.firstName}</span>
              </div>
              <div className="infoItem">
                <strong>Last Name:</strong> <span>{client.lastName}</span>
              </div>
              <div className="infoItem">
                <strong>Email:</strong> <span>{client.email || "N/A"}</span>
              </div>
              <div className="infoItem">
                <strong>Phone:</strong> <span>{client.phone}</span>
              </div>
              <div className="infoItem">
                <strong>ID Number:</strong>{" "}
                <span>{client.idNumber || "N/A"}</span>
              </div>
              <div className="infoItem addressItem">
                <strong>Address:</strong> <span>{client.address || "N/A"}</span>
              </div>
              <div className="infoItem">
                <strong>Date of Birth:</strong>{" "}
                <span>{formatDate(client.dateOfBirth)}</span>
              </div>
              <div className="infoItem">
                <strong>Status:</strong>{" "}
                <span className={`status ${client.status}`}>
                  {client.status.charAt(0).toUpperCase() +
                    client.status.slice(1)}
                </span>
              </div>
              <div className="infoItem">
                <strong>Credit Score:</strong>{" "}
                <span>{client.creditScore || "N/A"}</span>
              </div>
              <div className="infoItem">
                <strong>Date Created:</strong>{" "}
                <span>{formatDate(client.createdAt)}</span>
              </div>
              <div className="infoItem">
                <strong>Last Updated:</strong>{" "}
                <span>{formatDate(client.updatedAt)}</span>
              </div>
              <div className="infoItem">
                <strong>Created By:</strong>{" "}
                <span>
                  {client.createdBy
                    ? `${client.createdBy.firstName} ${client.createdBy.lastName}`
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="actionButtons">
              {hasRole(["tenant_superadmin", "admin"]) && (
                <button
                  onClick={() =>
                    navigate(
                      `/tenant/client-management/clients/${client._id}/edit`
                    )
                  }
                  className="editButton"
                >
                  Edit Client
                </button>
              )}
              {/* Activity logs would go here when implemented */}
              {/* <Link to={`/tenant/client-management/clients/${client._id}/activity`} className="logsButton">
                                View Activity Log
                            </Link> */}
            </div>
          </section>

          {/* Placeholder for future loan integration */}
          <section className="placeholderSection card">
            <h3>Loan Information</h3>
            <p className="placeholderMessage">
              Loan management functionality will be integrated in a future
              update.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ViewClientForm;
