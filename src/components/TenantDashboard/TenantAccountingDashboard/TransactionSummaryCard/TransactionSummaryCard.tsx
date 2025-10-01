// fe/src/components/TenantDashboard/AccountingDashboard/TransactionSummaryCard/TransactionSummaryCard.tsx
import React from 'react';

interface TransactionSummaryCardProps {
  title: string;
  value: number;
  type: 'receivable' | 'count' | 'pending' | 'overdue';
  formatCurrency?: (amount: number) => string;
}

const TransactionSummaryCard: React.FC<TransactionSummaryCardProps> = ({ 
  title, 
  value, 
  type,
  formatCurrency 
}) => {
  const getCardClass = () => {
    switch (type) {
      case 'receivable': return 'summaryCard loansReceivable';
      case 'count': return 'summaryCard activeLoans';
      case 'pending': return 'summaryCard pendingPayments';
      case 'overdue': return 'summaryCard overduePayments';
      default: return 'summaryCard';
    }
  };

  const displayValue = type === 'count' ? value : (formatCurrency ? formatCurrency(value) : `$${value.toFixed(2)}`);

  return (
    <div className={getCardClass()}>
      <h3>{title}</h3>
      <p>{displayValue}</p>
    </div>
  );
};

export default TransactionSummaryCard;