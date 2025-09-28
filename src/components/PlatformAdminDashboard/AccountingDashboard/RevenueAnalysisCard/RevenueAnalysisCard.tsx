// fe/src/components/platformAdminDashboard/AccountingDashboard/RevenueAnalysisCard/RevenueAnalysisCard.tsx

import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

export interface RevenueReport {
  revenueByPackage?: Array<{
    packageName: string;
    revenue: number;
    percentage?: number;
  }>;
  monthlyRevenue?: Array<{
    month: string;
    revenue: number;
    expenses?: number;
    netIncome?: number;
  }>;
  paymentMethods?: Array<{
    method: string;
    count: number;
    totalAmount: number;
    percentage?: number;
  }>;
  periods?: Array<{
    packageName?: string;
    revenue?: number;
    expenses?: number;
    netIncome?: number;
  }>;
}

interface RevenueAnalysisCardProps {
  revenueReport: RevenueReport | null | undefined;
}

const RevenueAnalysisCard: React.FC<RevenueAnalysisCardProps> = ({ revenueReport }) => {
  // Handle all possible undefined/null cases
  const revenueData = revenueReport?.revenueByPackage || revenueReport?.periods || [];
  const hasValidData = Array.isArray(revenueData) && revenueData.length > 0;
  
  if (!hasValidData) {
    return (
      <div className="dashboardCard revenueAnalysisCard">
        <div className="cardHeader">
          <h3>Revenue Analysis</h3>
        </div>
        <div className="cardContent">
          <p>No revenue data available</p>
        </div>
      </div>
    );
  }

  const totalRevenue = revenueData.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + (Number(item.expenses) || 0), 0);
  const totalNetIncome = totalRevenue - totalExpenses;

  return (
    <div className="dashboardCard revenueAnalysisCard">
      <div className="cardHeader">
        <h3>Revenue Analysis</h3>
      </div>
      
      <div className="revenueSummary">
        <div className="summaryItem">
          <span className="label">Total Revenue</span>
          <span className="value positive">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="summaryItem">
          <span className="label">Total Expenses</span>
          <span className="value negative">{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="summaryItem">
          <span className="label">Net Income</span>
          <span className={`value ${totalNetIncome >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(totalNetIncome)}
          </span>
        </div>
      </div>
      
      <div className="revenueChart">
        <h4>Revenue by Package</h4>
        <div className="chartBars">
          {revenueData.map((item, index) => {
            const itemRevenue = Number(item.revenue) || 0;
            const barWidth = totalRevenue > 0 ? (itemRevenue / totalRevenue) * 100 : 0;
            
            return (
              <div key={index} className="chartBarContainer">
                <div className="chartBarLabel">{item.packageName || 'Unknown Package'}</div>
                <div className="chartBar">
                  <div 
                    className="barRevenue" 
                    style={{ width: `${barWidth}%` }}
                  >
                    <span className="barLabel">{formatCurrency(itemRevenue)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalysisCard;