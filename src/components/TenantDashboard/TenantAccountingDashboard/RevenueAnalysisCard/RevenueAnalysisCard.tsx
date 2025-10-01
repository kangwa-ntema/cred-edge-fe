// fe/src/components/TenantDashboard/AccountingDashboard/RevenueAnalysisCard/RevenueAnalysisCard.tsx
import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

interface RevenueAnalysisCardProps {
  financialSummary: any;
  accountBalances: any[];
}

const RevenueAnalysisCard: React.FC<RevenueAnalysisCardProps> = ({ 
  financialSummary,
  accountBalances 
}) => {
  const revenueAccounts = accountBalances.filter(acc => 
    acc.accountType === 'revenue' && acc.balance !== 0
  );

  const totalRevenue = financialSummary?.totalRevenue || 0;

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
      </div>
      
      <div className="revenueChart">
        <h4>Revenue by Account</h4>
        <div className="chartBars">
          {revenueAccounts.map((account, index) => {
            const barWidth = totalRevenue > 0 ? (account.balance / totalRevenue) * 100 : 0;
            
            return (
              <div key={index} className="chartBarContainer">
                <div className="chartBarLabel">
                  {account.accountNumber} - {account.accountName}
                </div>
                <div className="chartBar">
                  <div 
                    className="barRevenue" 
                    style={{ width: `${barWidth}%` }}
                  >
                    <span className="barLabel">{formatCurrency(account.balance)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {revenueAccounts.length === 0 && (
          <div className="no-data">
            <p>No revenue data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalysisCard;