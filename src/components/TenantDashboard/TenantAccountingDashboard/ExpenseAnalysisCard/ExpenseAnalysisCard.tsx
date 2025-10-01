// fe/src/components/TenantDashboard/AccountingDashboard/ExpenseAnalysisCard/ExpenseAnalysisCard.tsx
import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

interface ExpenseAnalysisCardProps {
  financialSummary: any;
  accountBalances: any[];
}

const ExpenseAnalysisCard: React.FC<ExpenseAnalysisCardProps> = ({ 
  financialSummary,
  accountBalances 
}) => {
  const expenseAccounts = accountBalances.filter(acc => 
    acc.accountType === 'expense' && acc.balance !== 0
  );

  const totalExpenses = financialSummary?.totalExpenses || 0;

  return (
    <div className="dashboardCard expenseAnalysisCard">
      <div className="cardHeader">
        <h3>Expense Analysis</h3>
      </div>
      
      <div className="expenseSummary">
        <div className="summaryItem">
          <span className="label">Total Expenses</span>
          <span className="value negative">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>
      
      <div className="expenseChart">
        <h4>Expenses by Account</h4>
        <div className="chartBars">
          {expenseAccounts.map((account, index) => {
            const barWidth = totalExpenses > 0 ? (account.balance / totalExpenses) * 100 : 0;
            
            return (
              <div key={index} className="chartBarContainer">
                <div className="chartBarLabel">
                  {account.accountNumber} - {account.accountName}
                </div>
                <div className="chartBar">
                  <div 
                    className="barExpense" 
                    style={{ width: `${barWidth}%` }}
                  >
                    <span className="barLabel">{formatCurrency(account.balance)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {expenseAccounts.length === 0 && (
          <div className="no-data">
            <p>No expense data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseAnalysisCard;