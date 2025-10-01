// fe/src/components/platformAdminDashboard/AccountingDashboard/PackagePerformanceCard/PackagePerformanceCard.tsx

import React from "react";
import { formatCurrency, formatPercentage } from "../../../../utils/formatters";

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

interface PackagePerformanceCardProps {
  packagePerformance: PackagePerformance[] | any; // Allow any type for safety
}

const PackagePerformanceCard: React.FC<PackagePerformanceCardProps> = ({
  packagePerformance,
}) => {
  // Safely handle different data structures
  const getPackagesArray = (): PackagePerformance[] => {
    if (Array.isArray(packagePerformance)) {
      return packagePerformance;
    }

    console.log("Raw packagePerformance data:", packagePerformance);

    // Handle nested data structure
    if (packagePerformance && packagePerformance.data) {
      if (Array.isArray(packagePerformance.data)) {
        return packagePerformance.data;
      } else if (
        packagePerformance.data.data &&
        Array.isArray(packagePerformance.data.data)
      ) {
        return packagePerformance.data.data;
      }
    }

    // Handle direct array
    if (Array.isArray(packagePerformance)) {
      return packagePerformance;
    }

    console.warn(
      "Unexpected packagePerformance structure:",
      packagePerformance
    );
    return [];
  };

  const packagesArray = getPackagesArray();

  if (!packagesArray || packagesArray.length === 0) {
    return (
      <div className="dashboardCard packagePerformanceCard">
        <div className="cardHeader">
          <h3>Package Performance</h3>
        </div>
        <div className="cardContent">
          <p>No package performance data available</p>
        </div>
      </div>
    );
  }

  const totalRevenue = packagesArray.reduce(
    (sum, pkg) => sum + (pkg.totalRevenue || pkg.monthlyRevenue || 0),
    0
  );

  const totalSubscriptions = packagesArray.reduce(
    (sum, pkg) => sum + (pkg.activeTenants || pkg.activeSubscriptions || 0),
    0
  );

  return (
    <div className="dashboardCard packagePerformanceCard">
      <div className="cardHeader">
        <h3>Package Performance</h3>
      </div>

      <div className="performanceSummary">
        <div className="summaryStats">
          <div className="statItem">
            <span className="label">Total Packages</span>
            <span className="value">{packagesArray.length}</span>
          </div>
          <div className="statItem">
            <span className="label">Total Revenue</span>
            <span className="value">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="statItem">
            <span className="label">Total Subscriptions</span>
            <span className="value">{totalSubscriptions}</span>
          </div>
        </div>
      </div>

      <div className="packagesList">
        <h4>Package Details</h4>
        <div className="packagesTable">
          <div className="tableHeader">
            <span>Package</span>
            <span>Subscriptions</span>
            <span>Revenue</span>
            <span>Growth</span>
          </div>
          {packagesArray.map((pkg) => (
            <div key={pkg._id} className="tableRow">
              <span className="packageName">
                {pkg.name || pkg.packageName || "Unknown Package"}
              </span>
              <span className="subscriptions">
                {pkg.activeTenants || pkg.activeSubscriptions || 0}
              </span>
              <span className="revenue">
                {formatCurrency(pkg.totalRevenue || pkg.monthlyRevenue || 0)}
              </span>
              <span
                className={`growth ${
                  (pkg.growthPercentage || 0) >= 0 ? "positive" : "negative"
                }`}
              >
                {formatPercentage(pkg.growthPercentage || 0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackagePerformanceCard;
