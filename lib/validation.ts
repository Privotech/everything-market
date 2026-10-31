/**
 * Server-Side Validation & Business Integrity Rules
 *
 * Enforces zero-trust validation for inventory quantities, price boundaries,
 * SKU formats, slugs, and permitted products compliance.
 */

export const SKU_REGEX = /^[A-Z0-9]{3,}-[A-Z0-9-]{3,30}$/;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface PriceValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate product price in integer minor units (cents).
 * Minimum price: $0.50 (50 cents) to cover payment processing.
 * Maximum price: $100,000.00 (10,000,000 cents).
 */
export function validatePriceCents(
  priceCents: number,
  compareAtPriceCents?: number | null
): PriceValidationResult {
  if (!Number.isInteger(priceCents)) {
    return { isValid: false, error: 'Price must be an integer number of cents' };
  }
  if (priceCents < 50) {
    return { isValid: false, error: 'Price must be at least 50 cents ($0.50)' };
  }
  if (priceCents > 10_000_000) {
    return { isValid: false, error: 'Price exceeds maximum allowed limit ($100,000.00)' };
  }
  if (compareAtPriceCents != null) {
    if (!Number.isInteger(compareAtPriceCents)) {
      return { isValid: false, error: 'Compare-at price must be an integer number of cents' };
    }
    if (compareAtPriceCents <= priceCents) {
      return { isValid: false, error: 'Compare-at price must be strictly greater than active price' };
    }
  }
  return { isValid: true };
}

/**
 * Validate SKU uniqueness and standardized format.
 * Standard format: BRAND-ITEM-VARIANT (e.g. APEX-HD1-BLK)
 */
export function validateSku(sku: string): boolean {
  if (!sku || typeof sku !== 'string') return false;
  return SKU_REGEX.test(sku.trim().toUpperCase());
}

/**
 * Generate a URL-safe kebab-case slug.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate inventory quantities and constraints.
 */
export function validateInventory(
  quantityOnHand: number,
  quantityReserved: number
): { isValid: boolean; error?: string } {
  if (!Number.isInteger(quantityOnHand) || quantityOnHand < 0) {
    return { isValid: false, error: 'quantityOnHand must be a non-negative integer' };
  }
  if (!Number.isInteger(quantityReserved) || quantityReserved < 0) {
    return { isValid: false, error: 'quantityReserved must be a non-negative integer' };
  }
  if (quantityReserved > quantityOnHand) {
    return { isValid: false, error: 'quantityReserved cannot exceed quantityOnHand' };
  }
  return { isValid: true };
}

/**
 * Prohibited items sanity list for automated marketplace catalog compliance.
 */
export const PROHIBITED_KEYWORDS = [
  'weapon',
  'explosive',
  'firearm',
  'counterfeit',
  'prescription drug',
  'hazardous material',
  'illicit',
  'stolen',
] as const;

export function checkPermittedProduct(title: string, description: string): { isPermitted: boolean; flagReason?: string } {
  const combined = `${title} ${description}`.toLowerCase();
  for (const keyword of PROHIBITED_KEYWORDS) {
    if (combined.includes(keyword)) {
      return {
        isPermitted: false,
        flagReason: `Catalog compliance: Content contains restricted keyword '${keyword}'`,
      };
    }
  }
  return { isPermitted: true };
}
