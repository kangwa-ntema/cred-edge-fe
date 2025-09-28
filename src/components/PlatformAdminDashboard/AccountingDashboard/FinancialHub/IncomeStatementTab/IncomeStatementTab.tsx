// fe/src/components/PlatformAdminDashboard/AccountingDashboard/IncomeStatementTab/IncomeStatementTab.tsx
import React from 'react';
import { type FinancialStatement } from '../../../../../types/accounting';

interface IncomeStatementTabProps {
  incomeStatement: FinancialStatement | null;
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

// Helper interface for statement line items
interface StatementLineItem {
  accountId: string;
  accountName: string;
  amount: number;
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
    return <div className="tab-content">No income statement data available</div>;
  }

  // For now, we'll use placeholder data since the backend implementation is pending
  const revenues: StatementLineItem[] = [
    { accountId: '1', accountName: 'Service Revenue', amount: incomeStatement.revenue * 0.8 },
    { accountId: '2', accountName: 'Product Sales', amount: incomeStatement.revenue * 0.2 }
  ];

  const expenses: StatementLineItem[] = [
    { accountId: '3', accountName: 'Salaries & Wages', amount: incomeStatement.expenses * 0.4 },
    { accountId: '4', accountName: 'Rent', amount: incomeStatement.expenses * 0.3 },
    { accountId: '5', accountName: 'Utilities', amount: incomeStatement.expenses * 0.2 },
    { accountId: '6', accountName: 'Other Expenses', amount: incomeStatement.expenses * 0.1 }
  ];

  return (
    <div className="income-statement-tab">
      <div className="tab-header">
        <h2>Income Statement</h2>
        <span className="period">For the period ended {new Date().toLocaleDateString()}</span>
      </div>
      
      <div className="financial-statement">
        <div className="revenue-section">
          <h3>Revenue</h3>
          {revenues.map(item => (
            <div key={item.accountId} className="statement-line">
              <span>{item.accountName}</span>
              <span className="amount">{formatCurrency(item.amount || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Revenue</span>
            <span className="amount">{formatCurrency(incomeStatement.revenue || 0)}</span>
          </div>
        </div>
        
        <div className="expenses-section">
          <h3>Expenses</h3>
          {expenses.map(item => (
            <div key={item.accountId} className="statement-line">
              <span>{item.accountName}</span>
              <span className="amount">{formatCurrency(item.amount || 0)}</span>
            </div>
          ))}
          <div className="statement-line total">
            <span>Total Expenses</span>
            <span className="amount">{formatCurrency(incomeStatement.expenses || 0)}</span>
          </div>
        </div>
        
        <div className="net-income-section">
          <div className="statement-line total">
            <span>Net Income</span>
            <span className="amount">{formatCurrency(incomeStatement.netIncome || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatementTab;