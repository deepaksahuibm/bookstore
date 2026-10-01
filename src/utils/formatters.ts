export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateShipping = (subtotal: number): number => {
  if (subtotal === 0) return 0;
  // Free shipping over $50
  return subtotal >= 50 ? 0 : 4.99;
};

export const calculateTax = (subtotal: number, taxRate = 0.08): number => {
  return Number((subtotal * taxRate).toFixed(2));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
