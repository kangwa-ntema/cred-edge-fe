// fe/src/components/TenantDashboard/LoanManagement/LoanApplicationsManagement/CreateLoanApplication.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loanService } from "../../../../services/api/tenant/loanService";
import {
  getAllClients,
  type Client,
} from "../../../../services/api/tenant/clientApi";
import { type LoanProduct } from "../../../../types/loans";
import { toast } from "react-toastify";
import './CreateLoanApplication.scss'

const CreateLoanApplication: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    loanProductId: "",
    requestedAmount: "",
    requestedTerm: "",
    purpose: "",
  });

  useEffect(() => {
    fetchClientsAndProducts();
  }, []);

  const fetchClientsAndProducts = async () => {
    try {
      setLoading(true);
      const [clientsResponse, productsResponse] = await Promise.all([
        getAllClients(), // Use the direct function import
        loanService.getLoanProducts(),
      ]);

      if (clientsResponse.success) {
        setClients(clientsResponse.data.clients || []);
      }

      setProducts(productsResponse.data);
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await loanService.createLoanApplication({
        clientId: formData.clientId,
        loanProductId: formData.loanProductId,
        requestedAmount: Number(formData.requestedAmount),
        requestedTerm: Number(formData.requestedTerm),
        purpose: formData.purpose,
      });

      toast.success("Loan application created successfully");
      navigate("/tenant/loans/applications");
    } catch (error) {
      toast.error("Failed to create loan application");
      console.error("Error creating application:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(
    (p) => p._id === formData.loanProductId
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create Loan Application
            </h1>
            <p className="text-gray-600">
              Fill in the details to create a new loan application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Client *
              </label>
              <select
                required
                value={formData.clientId}
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.firstName} {client.lastName} - {client.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Loan Product *
              </label>
              <select
                required
                value={formData.loanProductId}
                onChange={(e) =>
                  setFormData({ ...formData, loanProductId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a loan product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - {product.interestRate}% interest
                  </option>
                ))}
              </select>
            </div>

            {/* Product Details */}
            {selectedProduct && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Product Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Amount Range:</span>
                    <div className="font-medium">
                      ${selectedProduct.minLoanAmount.toLocaleString()} - $
                      {selectedProduct.maxLoanAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700">Term Range:</span>
                    <div className="font-medium">
                      {selectedProduct.minTerm} - {selectedProduct.maxTerm}{" "}
                      months
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requested Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Amount ($) *
              </label>
              <input
                type="number"
                required
                min={selectedProduct?.minLoanAmount || 0}
                max={selectedProduct?.maxLoanAmount || 1000000}
                value={formData.requestedAmount}
                onChange={(e) =>
                  setFormData({ ...formData, requestedAmount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter requested amount"
              />
            </div>

            {/* Requested Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Term (months) *
              </label>
              <input
                type="number"
                required
                min={selectedProduct?.minTerm || 1}
                max={selectedProduct?.maxTerm || 120}
                value={formData.requestedTerm}
                onChange={(e) =>
                  setFormData({ ...formData, requestedTerm: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter loan term in months"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the purpose of the loan"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/tenant/loans/applications")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLoanApplication;
