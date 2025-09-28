// fe/src/types/index.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  tenant?: {
    _id: string;
    tenantId: string;
    companyName: string;
  };
  isPlatformUser: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface PackageData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  period: 'month' | 'year';
  bestFor: string;
  features: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tenant {
  _id: string;
  tenantId: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  status: string;
  isActive: boolean;
  package?: string;
  trialEndsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformUser {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'platform_superadmin' | 'platform_admin' | 'platform_employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  isActive: boolean;
  createdAt: string;
}

export interface LoanApplication {
  _id: string;
  applicationNumber: string;
  client: Client;
  loanProduct: LoanProduct;
  requestedAmount: number;
  requestedTerm: number;
  purpose?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  approvedAmount?: number;
  approvedTerm?: number;
  createdAt: string;
}

export interface LoanAccount {
  _id: string;
  loanNumber: string;
  client: Client;
  loanProduct: LoanProduct;
  principalAmount: number;
  term: number;
  interestRate: number;
  outstandingBalance: number;
  status: 'active' | 'closed' | 'defaulted';
  disbursementDate: string;
  maturityDate: string;
}