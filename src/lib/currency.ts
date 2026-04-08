export const formatPKR = (amount: number): string =>
  `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
