const currencyFormatter = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(amount);
};

export { currencyFormatter };
