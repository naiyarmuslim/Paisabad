export function formatCurrency(cents: number, currency: string = 'EUR'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const amount = parseFloat(cleaned);
  return Math.round(amount * 100); // Convert to cents
}

export function formatCompactCurrency(cents: number, currency: string = 'EUR'): string {
  const amount = cents / 100;
  if (Math.abs(amount) >= 1000000) {
    return formatCurrency(Math.round(amount / 10000) * 1000000, currency).replace('.00', 'M');
  } else if (Math.abs(amount) >= 1000) {
    return formatCurrency(Math.round(amount / 100) * 10000, currency).replace('.00', 'K');
  }
  return formatCurrency(cents, currency);
}