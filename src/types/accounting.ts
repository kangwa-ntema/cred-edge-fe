export interface ChartOfAccount {
  _id: string;
  accountNumber: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  normalBalance: 'debit' | 'credit';
  description?: string;
  isActive: boolean;
  parentAccount?: ChartOfAccount | string;
  balance: number;
  tenant?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JournalEntryLine {
  account: string | ChartOfAccount;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntry {
  _id: string;
  entryNumber: string;
  entryDate: string;
  description: string;
  reference?: string;
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'cancelled';
  postedBy?: string;
  postedAt?: string;
  tenant?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrialBalanceAccount {
  account: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface TrialBalance {
  accounts: TrialBalanceAccount[];
  totals: {
    totalDebit: number;
    totalCredit: number;
  };
  balanceCheck: boolean;
  asOfDate: string;
}

export interface FinancialStatement {
  revenue: number;
  expenses: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
  period?: {
    startDate: string;
    endDate: string;
  };
  asOfDate?: string;
  revenueAccounts?: any[];
  expenseAccounts?: any[];
  assetAccounts?: any[];
  liabilityAccounts?: any[];
  equityAccounts?: any[];
}

export interface RevenueReport {
  revenueByPackage: Array<{
    packageName: string;
    revenue: number;
    percentage?: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    paymentCount: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    totalAmount: number;
    percentage?: number;
  }>;
  totalRevenue: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface TenantPaymentStatus {
  _id: string;
  tenantId: string;
  companyName: string;
  status: string;
  package: string;
  monthlyPrice: number;
  lastPayment: string | null;
  totalPayments: number;
  paymentCount: number;
  amountDue: number;
  dueDate: string;
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
  growthPercentage: number;
}