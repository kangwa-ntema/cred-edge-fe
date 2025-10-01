// fe/src/components/TenantDashboard/AccountingDashboard/AccountBalancesCard/AccountBalancesCard.tsx
import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';

interface AccountBalancesCardProps {
  accountBalances: any[];
  onViewDetails: () => void;
}

const AccountBalancesCard: React.FC<AccountBalancesCardProps> = ({ 
  accountBalances,
  onViewDetails 
}) => {
  const assetAccounts = accountBalances.filter(acc => acc.accountType === 'asset');
  const liabilityAccounts = accountBalances.filter(acc => acc.accountType === 'liability');
  const equityAccounts = accountBalances.filter(acc => acc.accountType === 'equity');

  const totalAssets = assetAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = liabilityAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalEquity = equityAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="dashboardCard accountBalancesCard">
      <div className="cardHeader">
        <h3>Account Balances</h3>
        <button className="btn-small" onClick={onViewDetails}>
          View Details
        </button>
      </div>
      
      <div className="balanceSummary">
        <div className="balanceItem assets">
          <span className="label">Total Assets</span>
          <span className="value">{formatCurrency(totalAssets)}</span>
        </div>
        <div className="balanceItem liabilities">
          <span className="label">Total Liabilities</span>
          <span className="value">{formatCurrency(totalLiabilities)}</span>
        </div>
        <div className="balanceItem equity">
          <span className="label">Total Equity</span>
          <span className="value">{formatCurrency(totalEquity)}</span>
        </div>
      </div>
      
      <div className="recentBalances">
        <h4>Key Account Balances</h4>
        <div className="balancesList">
          {accountBalances.slice(0, 5).map(account => (
            <div key={account.accountNumber} className="balanceItem">
              <div className="accountInfo">
                <span className="accountName">{account.accountNumber} - {account.accountName}</span>
                <span className={`amount ${account.balance >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(account.balance)}
                </span>
              </div>
              <div className="accountMeta">
                <span className={`type ${account.accountType}`}>
                  {account.accountType}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {accountBalances.length === 0 && (
          <div className="no-balances">
            <p>No account balance data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBalancesCard;