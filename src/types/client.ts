export interface Client {
  _id: string;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  tenant?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListResponse {
  clients: Client[];
  overallSummary: any;
  data?: any;
  pagination?: any;
}