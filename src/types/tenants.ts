// fe/src/types/tenant.ts

import { User } from './auth';

export interface Tenant {
  _id: string;
  tenantId: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  isActive: boolean;
  package?: {
    _id: string;
    name: string;
  };
  superadmin?: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone?: string;
  };
  trialEndsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantData {
  tenantId: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyAddress?: string;
  companyNumber?: string;
  packageId: string;
  password: string;
  superadminUsername: string;
  superadminFirstName: string;
  superadminLastName: string;
  superadminEmail: string;
  superadminPhone?: string;
}

export interface UpdateTenantData {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  status?: 'active' | 'suspended' | 'trial' | 'cancelled';
  packageId?: string;
  superadminFirstName?: string;
  superadminLastName?: string;
  superadminEmail?: string;
  superadminPhone?: string;
}

export interface Client {
  _id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  idNumber?: string;
  dateOfBirth?: string;
  status: 'active' | 'inactive' | 'blacklisted';
  creditScore?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateClientData {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  idNumber?: string;
  dateOfBirth?: string;
  status?: 'active' | 'inactive' | 'blacklisted';
}

export interface UpdateClientData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  idNumber?: string;
  dateOfBirth?: string;
  status?: 'active' | 'inactive' | 'blacklisted';
}

export interface ClientFilters {
  status?: string;
  search?: string;
}