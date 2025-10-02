// fe/src/components/TenantDashboard/LoanManagement/LoanApplicationsManagement/ViewLoanApplication.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanService } from '../../../../services/api/tenant/loanService';
import { type LoanApplication } from '../../../../types/loan';
import { toast } from 'react-toastify';

const ViewLoanApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalData, setApprovalData] = useState({
    approvedAmount: '',
    approvedTerm: '',
    approvedInterestRate: '',
  });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const app = await loanService.getLoanApplication(id!);
      setApplication(app);
      
      // Pre-fill approval data with requested values
      setApprovalData({
        approvedAmount: app.requestedAmount.toString(),
        approvedTerm: app.requestedTerm.toString(),
        approvedInterestRate: app.loanProduct.interestRate.toString(),
      });
    } catch (error) {
      toast.error('Failed to fetch loan application');
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await loanService.approveLoanApplication(id!, {
        approvedAmount: Number(approvalData.approvedAmount),
        approvedTerm: Number(approvalData.approvedTerm),
        approvedInterestRate: Number(approvalData.approvedInterestRate),
      });
      toast.success('Loan application approved successfully');
      setShowApproveModal(false);
      fetchApplication(); // Refresh application data
    } catch (error) {
      toast.error('Failed to approve loan application');
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async () => {
    try {
      await loanService.rejectLoanApplication(id!, rejectionReason);
      toast.success('Loan application rejected successfully');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchApplication(); // Refresh application data
    } catch (error) {
      toast.error('Failed to reject loan application');
      console.error('Error rejecting application:', error);
    }
  };

  const handleDisburse = async () => {
    try {
      const disbursementDate = new Date().toISOString().split('T')[0];
      await loanService.disburseLoan(id!, disbursementDate);
      toast.success('Loan disbursed successfully');
      navigate('/tenant/loans/accounts');
    } catch (error) {
      toast.error('Failed to disburse loan');
      console.error('Error disbursing loan:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      canceled: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
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

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h1>
          <button
            onClick={() => navigate('/tenant/loans/applications')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Application: {application.applicationNumber}
            </h1>
            <p className="text-gray-600">Loan application details and management</p>
          </div>
          <button
            onClick={() => navigate('/tenant/loans/applications')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Applications
          </button>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(application.status)} capitalize`}>
                {application.status.replace('_', ' ')}
              </span>
              <p className="text-gray-600 mt-1">
                Created on {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              {application.status === 'under_review' && (
                <>
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              
              {application.status === 'approved' && (
                <button
                  onClick={handleDisburse}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Disburse Loan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">
                  {application.client.firstName} {application.client.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{application.client.phone}</p>
              </div>
              {application.client.email && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{application.client.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Loan Product Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Product</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Product Name</label>
                <p className="text-gray-900">{application.loanProduct.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Product Code</label>
                <p className="text-gray-900">{application.loanProduct.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Interest Rate</label>
                <p className="text-gray-900">{application.loanProduct.interestRate}%</p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Requested Amount</label>
                <p className="text-gray-900">${application.requestedAmount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Requested Term</label>
                <p className="text-gray-900">{application.requestedTerm} months</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Purpose</label>
                <p className="text-gray-900">{application.purpose || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Approval Details */}
          {(application.status === 'approved' || application.status === 'rejected') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {application.status === 'approved' ? 'Approval Details' : 'Rejection Details'}
              </h2>
              <div className="space-y-3">
                {application.status === 'approved' ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approved Amount</label>
                      <p className="text-green-600 font-medium">
                        ${application.approvedAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approved Term</label>
                      <p className="text-gray-900">{application.approvedTerm} months</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approved Interest Rate</label>
                      <p className="text-gray-900">{application.approvedInterestRate}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approved By</label>
                      <p className="text-gray-900">
                        {application.approvedBy?.firstName} {application.approvedBy?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Approval Date</label>
                      <p className="text-gray-900">
                        {application.approvalDate ? new Date(application.approvalDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rejection Reason</label>
                    <p className="text-red-600">{application.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Approve Loan Application</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approved Amount ($)
                    </label>
                    <input
                      type="number"
                      value={approvalData.approvedAmount}
                      onChange={(e) => setApprovalData({ ...approvalData, approvedAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approved Term (months)
                    </label>
                    <input
                      type="number"
                      value={approvalData.approvedTerm}
                      onChange={(e) => setApprovalData({ ...approvalData, approvedTerm: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approved Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={approvalData.approvedInterestRate}
                      onChange={(e) => setApprovalData({ ...approvalData, approvedInterestRate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Reject Loan Application</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide a reason for rejecting this application..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLoanApplication;