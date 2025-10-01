// fe/src/services/api/index.ts
// Re-export all APIs in a structured way

// Common utilities
export * from './api/common/apiUtils';

// Authentication APIs
export * from './api/common/authApi';

// Platform-specific APIs
export * from './api/platform/platformUserApi';
export * from './api/platform/packageApi';
export * from './api/platform/paymentApi';
export {
  getChartOfAccounts as getPlatformChartOfAccounts,
  createCOAAccount as createPlatformCOAAccount,
  updateCOAAccount as updatePlatformCOAAccount,
  deleteCOAAccount as deletePlatformCOAAccount,
  getJournalEntries as getPlatformJournalEntries,
  createJournalEntry as createPlatformJournalEntry,
  updateJournalEntry as updatePlatformJournalEntry,
  deleteJournalEntry as deletePlatformJournalEntry,
  postJournalEntry as postPlatformJournalEntry,
  getPlatformRevenueReport,
  getTenantPaymentStatus,
  getPlatformFinancialSummary,
  getPackagePerformance,
  createManualPayment
} from './api/platform/platformAccountingApi';
export * from './api/platform/tenantUserApi'; 

// Tenant-specific APIs  
export * from './api/tenant/tenantUserApi';
export * from './api/tenant/tenantAccountingApi';
export * from './api/tenant/clientApi';
export * from './api/tenant/loanApi';
export * from './api/tenant/projectApi';

// Specialized APIs
export * from './api/common/reportApi';
export * from './api/common/systemApi';

// Combined APIs (avoid circular imports)
export { default as userManagementApi } from './api/common/combinedUserManagement';