// fe/src/components/TenantDashboard/LoanManagement/LoanAccountsManagement/LoanAccountsManagement.tsx

import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import { loanService } from "../../../../services/api/tenant/loanService";
import { type LoanAccount } from "../../../../types/loan";
import { toast } from "react-toastify";
import './LoanAccountsManagement.scss'


const LoanAccountsManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<LoanAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAccounts();
  }, [filter]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const response = await loanService.getLoanAccounts(params);
      setAccounts(response.data);
    } catch (error) {
      toast.error("Failed to fetch loan accounts");
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
      defaulted: "bg-red-100 text-red-800",
      written_off: "bg-orange-100 text-orange-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const calculateProgress = (account: LoanAccount) => {
    const total = account.principalAmount;
    const paid = account.totalPrincipalPaid;
    return Math.round((paid / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Loan Accounts</h1>
          <p className="text-gray-600">
            Manage active loans and monitor repayments
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex space-x-4">
            {["all", "active", "closed", "defaulted", "written_off"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded capitalize ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div key={account._id} className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {account.loanNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {account.loanProduct.name}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    account.status
                  )} capitalize`}
                >
                  {account.status.replace("_", " ")}
                </span>
              </div>

              {/* Client Info */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {account.client.firstName} {account.client.lastName}
                </p>
                <p className="text-sm text-gray-600">{account.client.phone}</p>
              </div>

              {/* Loan Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Principal:</span>
                  <span className="text-sm font-medium">
                    ${account.principalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Outstanding:</span>
                  <span className="text-sm font-medium text-red-600">
                    ${account.outstandingBalance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interest Rate:</span>
                  <span className="text-sm font-medium">
                    {account.interestRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Term:</span>
                  <span className="text-sm font-medium">
                    {account.term} months
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Repayment Progress</span>
                  <span>{calculateProgress(account)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${calculateProgress(account)}%` }}
                  ></div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                <div>
                  <div>Disbursed:</div>
                  <div className="font-medium">
                    {new Date(account.disbursementDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div>Matures:</div>
                  <div className="font-medium">
                    {new Date(account.maturityDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  to={`/tenant/loans/${account._id}/payments`}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors text-center"
                >
                  Payments
                </Link>
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No loan accounts
            </h3>
            <p className="text-gray-600">
              {filter !== "all"
                ? `No accounts with status "${filter}"`
                : "No active loan accounts found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanAccountsManagement;
