/**
 * Currency formatting utilities for Indian Rupee (₹)
 * Formats numbers according to Indian numbering system
 */

export function formatCurrency(amount: number, options: {
  compact?: boolean;
  showSymbol?: boolean;
  decimals?: number;
} = {}): string {
  const { compact = true, showSymbol = true, decimals = 1 } = options;
  
  const symbol = showSymbol ? '₹' : '';
  
  if (compact) {
    if (amount >= 10000000) { // 1 Crore
      return `${symbol}${(amount / 10000000).toFixed(decimals)}Cr`;
    } else if (amount >= 100000) { // 1 Lakh
      return `${symbol}${(amount / 100000).toFixed(decimals)}L`;
    } else if (amount >= 1000) { // 1 Thousand
      return `${symbol}${(amount / 1000).toFixed(decimals)}K`;
    }
  }
  
  // Format with Indian number system (lakhs and crores)
  return `${symbol}${amount.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: amount % 1 === 0 ? 0 : decimals,
  })}`;
}

export function formatPrice(price: number): string {
  return formatCurrency(price, { compact: true, showSymbol: true, decimals: 1 });
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

export function parseCurrency(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  const numValue = parseFloat(cleanValue) || 0;
  
  // Check for multipliers
  const lowerValue = value.toLowerCase();
  if (lowerValue.includes('cr') || lowerValue.includes('crore')) {
    return numValue * 10000000;
  } else if (lowerValue.includes('l') || lowerValue.includes('lakh')) {
    return numValue * 100000;
  } else if (lowerValue.includes('k') || lowerValue.includes('thousand')) {
    return numValue * 1000;
  }
  
  return numValue;
}

export function formatArea(area: number, unit: 'sqft' | 'sqm' = 'sqft'): string {
  const formatted = area.toLocaleString('en-IN');
  return `${formatted} ${unit}`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}