// fe/src/types/accounting.ts

export interface ChartOfAccount {
  _id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  normalBalance: 'debit' | 'credit';
  balance: number;
  parentAccount?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  _id: string;
  entryDate: string;
  referenceNumber: string;
  description: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted';
  createdBy: string;
  postedBy?: string;
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalLine {
  _id: string;
  account: string;
  accountNumber?: string;
  accountName?: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface GeneralLedgerEntry {
  _id: string;
  date: string;
  journalEntry: string;
  referenceNumber: string;
  account: string;
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
  description: string;
}

export interface TrialBalanceAccount {
  account: string;
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface TrialBalance {
  asOfDate: string;
  accounts: TrialBalanceAccount[];
  totalDebit: number;
  totalCredit: number;
}

export interface FinancialStatement {
  period: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
}

export interface RevenueReport {
  revenueByPackage: RevenueByPackage[];
  monthlyRevenue: MonthlyRevenue[];
  paymentMethods: PaymentMethodStats[];
}

export interface RevenueByPackage {
  packageName: string;
  revenue: number;
  percentage: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

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

export interface PackagePerformance {
  _id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  tenantCount: number;
  activeTenants: number;
  totalRevenue: number;
  paymentCount: number;
  avgRevenuePerTenant: number;
  packageName?: string;
  activeSubscriptions?: number;
  monthlyRevenue?: number;
  growthPercentage?: number;
}