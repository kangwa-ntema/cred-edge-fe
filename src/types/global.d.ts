// fe/src/types/global.d.ts

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Fix for React types
declare module 'react' {
  interface Attributes {
    children?: ReactNode;
  }
}

/// <reference types="vite/client" />

// React JSX types
declare namespace JSX {
  interface Element extends React.ReactElement {}
}

// Vite env variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Missing types from your errors
interface PackageData {
  _id: string
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  bestFor: string
  features: string[]
  limits: Record<string, any>
}

interface Client {
  _id: string
  name: string
  email: string
  phone: string
  tenant?: string
  // add other client properties
}

interface SystemHealth {
  status: string
  uptime: number
  // add other properties
}

interface PerformanceMetrics {
  // define based on your API response
}

interface DatabaseStats {
  // define based on your API response
}

interface ServerInfo {
  // define based on your API response
}

interface ChartOfAccount {
  _id: string
  name: string
  type: string
  // add other properties
}

interface LoanProduct {
  _id: string
  name: string
  code: string
  interestConfig: any
  amountConfig: any
  termConfig: any
  // add other properties
}