// fe/src/components/TenantDashboard/FinancialHub/IncomeStatementTab/IncomeStatementTab.tsx
import React from 'react';
import { type FinancialStatement } from '../../../../../types/accounting';

interface IncomeStatementTabProps {
  incomeStatement: FinancialStatement | null;
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

const IncomeStatementTab: React.FC<IncomeStatementTabProps> = ({ 
  incomeStatement, 
  loading, 
  formatCurrency 
}) => {
  if (loading) {
    return <div className="tab-content loading">Loading Income Statement...</div>;
  }

  if (!incomeStatement) {
    return (
      <div className="tab-content no-data">
        <div className="empty-state">
          <h3>No Income Statement Data</h3>
          <p>Generate an income statement by selecting a date range.</p>
        </div>
      </div>
    );
  }

  const revenue = incomeStatement.revenue || 0;
  const expenses = incomeStatement.expenses || 0;
  const netIncome = revenue - expenses;

  return (
    <div className="income-statement-tab">
      <div className="tab-header">
        <h2>Income Statement</h2>
        <span className="period">
          {incomeStatement.period?.startDate && incomeStatement.period?.endDate 
            ? `For the period ${new Date(incomeStatement.period.startDate).toLocaleDateString()} to ${new Date(incomeStatement.period.endDate).toLocaleDateString()}`
            : 'Current Period'
          }
        </span>
      </div>
      
      <div className="financial-statement">
        <div className="statement-section revenue-section">
          <h3>Revenue</h3>
          {incomeStatement.revenueAccounts?.map((account: any) => (
            <div key={account._id} className="statement-line">
              <span>{account.accountName}</span>
              <span className="amount">{formatCurrency(account.balance || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Revenue</span>
            <span className="amount">{formatCurrency(revenue)}</span>
          </div>
        </div>
        
        <div className="statement-section expenses-section">
          <h3>Expenses</h3>
          {incomeStatement.expenseAccounts?.map((account: any) => (
            <div key={account._id} className="statement-line">
              <span>{account.accountName}</span>
              <span className="amount">{formatCurrency(account.balance || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Expenses</span>
            <span className="amount">{formatCurrency(expenses)}</span>
          </div>
        </div>
        
        <div className="statement-section net-income-section">
          <div className="statement-line total net-income">
            <span>Net Income</span>
            <span className={`amount ${netIncome >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(netIncome)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatementTab;