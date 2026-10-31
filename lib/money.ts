/**
 * Monetary Arithmetic & Formatting Engine
 *
 * All amounts are stored and handled as minor currency integer units (e.g. cents).
 * Floating-point representation is strictly prohibited in business logic to avoid
 * IEEE 754 precision errors in pricing, taxes, and vendor commissions.
 */

export type SupportedCurrency = 'USD' | 'EUR' | 'NGN' | 'GBP' | 'KES';

export const CURRENCY_RATES: Record<SupportedCurrency, { rate: number; symbol: string; locale: string }> = {
  USD: { rate: 1.0, symbol: '$', locale: 'en-US' },
  EUR: { rate: 0.92, symbol: '€', locale: 'de-DE' },
  NGN: { rate: 1450.0, symbol: '₦', locale: 'en-NG' },
  GBP: { rate: 0.79, symbol: '£', locale: 'en-GB' },
  KES: { rate: 130.0, symbol: 'KSh ', locale: 'en-KE' },
};

export interface FormattedMoneyOptions {
  locale?: string;
  currency?: string;
  showCurrencyCode?: boolean;
}

/**
 * Format minor integer units (cents) into a localized currency string.
 * e.g., formatMoney(1999, 'USD') -> "$19.99"
 */
export function formatMoney(
  cents: number,
  currency: string = 'USD',
  options?: FormattedMoneyOptions
): string {
  if (!Number.isFinite(cents)) {
    throw new TypeError(`formatMoney: Amount must be a finite number, received ${cents}`);
  }

  const curr = (currency.toUpperCase() as SupportedCurrency) || 'USD';
  const currInfo = CURRENCY_RATES[curr];

  if (curr === 'USD') {
    const locale = options?.locale || 'en-US';
    const majorUnits = cents / 100;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: options?.showCurrencyCode ? 'code' : 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(majorUnits);
  }

  if (currInfo) {
    // Converted to target currency
    const convertedMajor = (cents / 100) * currInfo.rate;
    const isAfricanCurrency = curr === 'NGN' || curr === 'KES';
    return new Intl.NumberFormat(options?.locale || currInfo.locale, {
      style: 'currency',
      currency: curr,
      currencyDisplay: options?.showCurrencyCode ? 'code' : 'symbol',
      minimumFractionDigits: isAfricanCurrency ? 0 : 2,
      maximumFractionDigits: isAfricanCurrency ? 0 : 2,
    }).format(convertedMajor);
  }

  const locale = options?.locale || 'en-US';
  const majorUnits = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: options?.showCurrencyCode ? 'code' : 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorUnits);
}

/**
 * Convert major units (e.g., dollars "19.99" or 19.99) to minor integer units (cents).
 * Uses integer rounding to guarantee exact values.
 */
export function dollarsToCents(amount: number | string): number {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!Number.isFinite(numeric)) {
    throw new TypeError(`dollarsToCents: Input must be a valid finite number, received ${amount}`);
  }
  return Math.round(numeric * 100);
}

/**
 * Convert minor integer units (cents) to major units (dollars) for display or API boundaries.
 */
export function centsToDollars(cents: number): number {
  if (!Number.isFinite(cents)) {
    throw new TypeError(`centsToDollars: Input must be a valid finite number, received ${cents}`);
  }
  return cents / 100;
}

/**
 * Calculate percentage discount between regular price and compare-at price.
 * Returns an integer percentage from 0 to 100.
 */
export function calculateDiscountPercent(
  priceCents: number,
  compareAtPriceCents: number | null | undefined
): number {
  if (!compareAtPriceCents || compareAtPriceCents <= priceCents) {
    return 0;
  }
  const discount = ((compareAtPriceCents - priceCents) / compareAtPriceCents) * 100;
  return Math.round(discount);
}

/**
 * Calculate marketplace commission in integer cents given a basis-point rate (bps).
 * e.g., 1000 bps = 10.00%.
 * $100.00 (10000 cents) at 1000 bps -> 1000 cents ($10.00)
 */
export function calculateCommission(
  priceCents: number,
  commissionRateBps: number
): { commissionCents: number; sellerPayoutCents: number } {
  if (priceCents < 0) {
    throw new RangeError('calculateCommission: priceCents must be non-negative');
  }
  if (commissionRateBps < 0 || commissionRateBps > 10000) {
    throw new RangeError('calculateCommission: commissionRateBps must be between 0 and 10000 (0% - 100%)');
  }

  const commissionCents = Math.round((priceCents * commissionRateBps) / 10000);
  const sellerPayoutCents = priceCents - commissionCents;

  return {
    commissionCents,
    sellerPayoutCents,
  };
}

/**
 * Calculate sales tax in integer cents given a tax rate in basis points (bps).
 * e.g., 825 bps = 8.25% tax.
 */
export function calculateTax(
  subtotalCents: number,
  taxRateBps: number
): number {
  if (subtotalCents < 0) {
    throw new RangeError('calculateTax: subtotalCents must be non-negative');
  }
  if (taxRateBps < 0) {
    throw new RangeError('calculateTax: taxRateBps must be non-negative');
  }
  return Math.round((subtotalCents * taxRateBps) / 10000);
}
