// fe/src/utils

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ZMW'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatPercentage = (value: number | undefined | null): string => {
  if (value === null || typeof value === 'undefined' || isNaN(value)) {
    return '0%';
  }
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};
