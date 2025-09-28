// fe/src/types/loanTypes.ts

// src/types/loanTypes.ts - Add missing properties
export interface LoanProduct {
  _id?: string;
  name: string;
  code: string;
  description: string;
  productCategory: string;
  loanType: string;
  configuration: any; // Use a more specific type if available
  approvalWorkflow: any;
  status: string;
  // Add other missing properties
}

export interface CreateLoanProductData {
  name: string;
  code: string;
  description: string;
  productCategory: string; // Add this missing property
  loanType: string;
  configuration: any;
  approvalWorkflow: any;
  status: string;
}

export interface LoanProduct {
  _id: string;
  name: string;
  code: string;
  description?: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRate: number;
  interestMethod: 'flat' | 'reducing' | 'annuity';
  interestFrequency: 'monthly' | 'quarterly' | 'annually';
  processingFee: number;
  processingFeeType: 'fixed' | 'percentage';
  isActive: boolean;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  _id: string;
  applicationNumber: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  loanProduct: {
    _id: string;
    name: string;
    code: string;
    interestRate: number;
  };
  requestedAmount: number;
  requestedTerm: number;
  purpose?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'canceled';
  approvedAmount?: number;
  approvedTerm?: number;
  approvedInterestRate?: number;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approvalDate?: string;
  rejectionReason?: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoanAccount {
  _id: string;
  loanNumber: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  loanProduct: {
    _id: string;
    name: string;
    code: string;
    interestRate: number;
    interestMethod: string;
  };
  loanApplication: {
    _id: string;
    applicationNumber: string;
    purpose?: string;
  };
  principalAmount: number;
  term: number;
  interestRate: number;
  interestMethod: string;
  disbursementDate: string;
  maturityDate: string;
  outstandingBalance: number;
  totalPaid: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  status: 'active' | 'closed' | 'defaulted' | 'written_off';
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSchedule {
  _id: string;
  loanAccount: string;
  installmentNumber: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount: number;
  paidDate?: string;
  daysOverdue: number;
  lateFee: number;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

export interface LoanStats {
  totalApplications: number;
  activeLoans: number;
  pendingPayments: number;
  overduePayments: number;
  totalLoanPortfolio: number;
  recentActivities: Array<{
    type: string;
    description: string;
    date: string;
    status: string;
  }>;
}

export interface CreateLoanProductData {
  name: string;
  code: string;
  description?: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRate: number;
  interestMethod: 'flat' | 'reducing' | 'annuity';
  interestFrequency: 'monthly' | 'quarterly' | 'annually';
  processingFee?: number;
  processingFeeType?: 'fixed' | 'percentage';
}

export interface CreateLoanApplicationData {
  clientId: string;
  loanProductId: string;
  requestedAmount: number;
  requestedTerm: number;
  purpose?: string;
}

export interface ApproveLoanApplicationData {
  approvedAmount: number;
  approvedTerm: number;
  approvedInterestRate: number;
}