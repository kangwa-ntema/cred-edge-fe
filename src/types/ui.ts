import { LoanApplication, LoanProduct, Client, Tenant } from './';

// Component Props Types
export interface LoanManagementDashboardProps {
  stats: any;
  loading: boolean;
  onRefresh: () => void;
}

export interface ClientManagementProps {
  clients: Client[];
  loading: boolean;
  onClientUpdate: (client: Client) => void;
  onClientDelete: (clientId: string) => void;
}

export interface TenantManagementProps {
  tenants: Tenant[];
  packages: any[];
  loading: boolean;
  onTenantCreate: (data: any) => void;
  onTenantUpdate: (id: string, data: any) => void;
}

// Form Types
export interface LoanApplicationFormData {
  clientId: string;
  loanProductId: string;
  requestedAmount: number;
  requestedTerm: number;
  purpose?: string;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Table Types
export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}