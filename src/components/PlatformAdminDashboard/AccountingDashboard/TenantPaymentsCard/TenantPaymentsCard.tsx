// fe/src/components/platformAdminDashboard/AccountingDashboard/TenantPaymentsCard/TenantPaymentsCard.tsx

import React from 'react';
import { formatCurrency, formatDate } from '../../../../utils/formatters';

export interface TenantPaymentStatus {
  _id: string;
  tenantId: string;
  companyName: string;
  status: string;
  package: string;
  monthlyPrice: number;
  lastPayment: string;
  totalPayments: number;
  paymentCount: number;
  overdue: boolean;
  tenantName?: string;
  amountDue?: number;
  dueDate?: string;
}

interface TenantPaymentsCardProps {
  tenantPayments: TenantPaymentStatus[] | any; // Allow any type for safety
  onAddPayment: () => void;
}

const TenantPaymentsCard: React.FC<TenantPaymentsCardProps> = ({ 
  tenantPayments, 
  onAddPayment 
}) => {
  // Safely handle different data structures
  const getPaymentsArray = (): TenantPaymentStatus[] => {
    if (Array.isArray(tenantPayments)) {
      return tenantPayments;
    }
    
    if (tenantPayments && Array.isArray(tenantPayments.data)) {
      return tenantPayments.data;
    }
    
    if (tenantPayments && tenantPayments.data && Array.isArray(tenantPayments.data.data)) {
      return tenantPayments.data.data;
    }
    
    console.warn('Unexpected tenantPayments structure:', tenantPayments);
    return [];
  };

  const paymentsArray = getPaymentsArray();
  const overduePayments = paymentsArray.filter(p => p.overdue || p.status === 'OVERDUE');
  const pendingPayments = paymentsArray.filter(p => p.status === 'PENDING');
  const paidPayments = paymentsArray.filter(p => p.status === 'PAID');

  console.log('Processed payments array:', paymentsArray);
  console.log('Overdue payments:', overduePayments);
  console.log('Pending payments:', pendingPayments);
  console.log('Paid payments:', paidPayments);

  return (
    <div className="dashboardCard tenantPaymentsCard">
      <div className="cardHeader">
        <h3>Tenant Payments</h3>
        <button className="btn-small" onClick={onAddPayment}>
          Add Payment
        </button>
      </div>
      
      <div className="paymentSummary">
        <div className="summaryItem overdue">
          <span className="label">Overdue</span>
          <span className="value">{overduePayments.length}</span>
        </div>
        <div className="summaryItem pending">
          <span className="label">Pending</span>
          <span className="value">{pendingPayments.length}</span>
        </div>
        <div className="summaryItem paid">
          <span className="label">Paid</span>
          <span className="value">{paidPayments.length}</span>
        </div>
      </div>
      
      <div className="recentPayments">
        <h4>Recent Payments</h4>
        <div className="paymentsList">
          {paymentsArray.slice(0, 5).map(payment => (
            <div key={payment._id} className={`paymentItem ${payment.status?.toLowerCase() || 'unknown'}`}>
              <div className="paymentInfo">
                <span className="tenantName">{payment.companyName || payment.tenantName || 'Unknown Tenant'}</span>
                <span className="amount">{formatCurrency(payment.monthlyPrice || payment.amountDue || 0)}</span>
              </div>
              <div className="paymentMeta">
                <span className={`status ${payment.status?.toLowerCase() || 'unknown'}`}>
                  {payment.status || 'UNKNOWN'}
                </span>
                {payment.dueDate && (
                  <span className="dueDate">Due: {formatDate(payment.dueDate)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {paymentsArray.length === 0 && (
          <div className="no-payments">
            <p>No payment data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantPaymentsCard;