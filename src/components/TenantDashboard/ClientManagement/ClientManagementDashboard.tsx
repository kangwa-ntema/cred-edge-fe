// fe/src/components/TenantDashboard/ClientManagement/ClientManagementDashboard.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/authContext";
import {
  getAllClients,
  deleteClient,
  type Client,
} from "../../../services/api/tenant/clientApi";

const ClientManagementDashboard = () => {
  const { user: currentUser, hasRole } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [overallSummary, setOverallSummary] = useState<any>({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const tenant = currentUser?.tenant;

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: any = {};
        if (statusFilter !== "all") {
          filters.status = statusFilter;
        }

        const response = await getAllClients(filters);

        console.log("API Response:", response); // Add this to see the actual structure

        if (response.success) {
          // Handle different response structures
          let clientsData = [];
          let summaryData = {};

          if (response.data && response.data.clients) {
            // Expected structure
            clientsData = response.data.clients;
            summaryData = response.data.overallSummary || {};
          } else if (Array.isArray(response.data)) {
            // If data is directly the clients array
            clientsData = response.data;
            summaryData = {
              totalClients: clientsData.length,
              active: clientsData.filter((c) => c.status === "active").length,
              inactive: clientsData.filter((c) => c.status === "inactive")
                .length,
              blacklisted: clientsData.filter((c) => c.status === "blacklisted")
                .length,
            };
          } else if (response.data && Array.isArray(response.data.data)) {
            // Paginated structure
            clientsData = response.data.data;
            summaryData = response.data.pagination || {};
          }

          setClients(clientsData);
          setOverallSummary(summaryData);
        } else {
          setError(response.error || "Failed to fetch clients");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch clients");
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [statusFilter, location.pathname]);

  const confirmDelete = (clientId: string, clientName: string) => {
    setClientToDelete(clientId);
    setModalMessage(`Are you sure you want to delete client "${clientName}"?`);
    setShowConfirmModal(true);
  };

  const executeDelete = async () => {
    if (!clientToDelete) return;

    setShowConfirmModal(false);
    try {
      const response = await deleteClient(clientToDelete);
      if (response.success) {
        toast.success("Client deleted successfully!");
        // Refresh the list instead of navigating
        setClients(clients.filter((client) => client._id !== clientToDelete));
        // Update summary counts
        setOverallSummary((prev) => ({
          ...prev,
          totalClients: (prev.totalClients || 1) - 1,
          [clients.find((c) => c._id === clientToDelete)?.status || "active"]:
            Math.max(
              (prev[
                clients.find((c) => c._id === clientToDelete)?.status ||
                  "active"
              ] || 1) - 1,
              0
            ),
        }));
      } else {
        toast.error(response.error || "Failed to delete client");
      }
    } catch (err: any) {
      toast.error(`Failed to delete client: ${err.message || "Network error"}`);
      console.error("Error deleting client:", err);
    } finally {
      setClientToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboardContainer">
        <div>Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboardContainer">
        <div className="errorMessage">Error: {error}</div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="dashboardContainer">
        <div>Tenant information not available</div>
      </div>
    );
  }

  return (
    <div className="dashboardContainer">
      <Link to="/tenant/dashboard">
        <button className="backButton">Back to Dashboard</button>
      </Link>

      <h2>CLIENT MANAGEMENT - {tenant.companyName}</h2>
      <h3>Tenant ID: {tenant.tenantId}</h3>

      <div className="dashboardContent">
        <div className="panelContainer">
          {hasRole(["tenant_superadmin", "admin"]) && (
            <Link to="/tenant/clients/register">
              <button className="primaryButton">+ Register New Client</button>
            </Link>
          )}

          <div className="summaryPanel">
            <section className="summarySection">
              <div className="summaryCards">
                <div className="summaryCard">
                  <h3>Total Clients:</h3>
                  <p>{overallSummary.totalClients || 0}</p>
                </div>
                <div className="summaryCard">
                  <h3>Active:</h3>
                  <p>{overallSummary.active || 0}</p>
                </div>
                <div className="summaryCard">
                  <h3>Inactive:</h3>
                  <p>{overallSummary.inactive || 0}</p>
                </div>
                <div className="summaryCard">
                  <h3>Blacklisted:</h3>
                  <p>{overallSummary.blacklisted || 0}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="contentContainer">
          <div className="filterSection">
            <h3>Filters</h3>
            <div className="filterControls">
              <div className="filterGroup">
                <label>Filter by Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filterSelect"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
              </div>
            </div>
          </div>

          <div className="listSection">
            <h3>All Clients List</h3>
            {clients.length === 0 ? (
              <p>No clients found matching the current filters.</p>
            ) : (
              <div className="tableContainer">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Client ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>ID Number</th>
                      <th>Status</th>
                      <th>Credit Score</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id}>
                        <td>{client.clientId}</td>
                        <td>{client.firstName}</td>
                        <td>{client.lastName}</td>
                        <td>{client.email || "N/A"}</td>
                        <td>{client.phone}</td>
                        <td>{client.idNumber || "N/A"}</td>
                        <td>
                          <span className={`status ${client.status}`}>
                            {client.status}
                          </span>
                        </td>
                        <td>{client.creditScore || "N/A"}</td>
                        <td>
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <Link
                            to={`/tenant/clients/${client._id}`}
                          >
                            <button className="viewButton">Details</button>
                          </Link>
                          {hasRole(["tenant_superadmin", "admin"]) && (
                            <Link
                              to={`/tenant/clients/${client._id}/edit`}
                            >
                              <button className="editButton">Edit</button>
                            </Link>
                          )}
                          {hasRole(["tenant_superadmin"]) && (
                            <button
                              onClick={() =>
                                confirmDelete(
                                  client._id,
                                  `${client.firstName} ${client.lastName}`
                                )
                              }
                              className="deleteButton"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Confirm Action</h3>
            <p>{modalMessage}</p>
            <div className="modalActions">
              <button onClick={executeDelete} className="confirmButton">
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="cancelButton"
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

export default ClientManagementDashboard;
