import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMoney,
  dollarsToCents,
  centsToDollars,
  calculateCommission,
  calculateDiscountPercent,
  calculateTax,
} from '../lib/money.ts';

describe('Monetary Subsystem (Strict Minor-Unit Integer Cents)', () => {
  it('formats minor integer cents correctly into USD currency strings', () => {
    assert.equal(formatMoney(1999, 'USD'), '$19.99');
    assert.equal(formatMoney(49900, 'USD'), '$499.00');
    assert.equal(formatMoney(0, 'USD'), '$0.00');
    assert.equal(formatMoney(50, 'USD'), '$0.50');
  });

  it('converts decimal major units to exact integer cents without IEEE 754 drift', () => {
    assert.equal(dollarsToCents(19.99), 1999);
    assert.equal(dollarsToCents('49.99'), 4999);
    assert.equal(dollarsToCents(0.1 + 0.2), 30); // Classic floating point trap: 0.30000000000000004 -> 30 cents
  });

  it('converts minor integer cents back to major units', () => {
    assert.equal(centsToDollars(1999), 19.99);
    assert.equal(centsToDollars(49900), 499);
  });

  it('calculates marketplace commission accurately in integer cents', () => {
    // $100.00 (10000 cents) at 10.00% (1000 bps)
    const res1 = calculateCommission(10000, 1000);
    assert.equal(res1.commissionCents, 1000); // $10.00 platform fee
    assert.equal(res1.sellerPayoutCents, 9000); // $90.00 merchant payout

    // $499.00 (49900 cents) at 8.00% (800 bps)
    const res2 = calculateCommission(49900, 800);
    assert.equal(res2.commissionCents, 3992); // $39.92
    assert.equal(res2.sellerPayoutCents, 45908); // $459.08
    assert.equal(res2.commissionCents + res2.sellerPayoutCents, 49900);
  });

  it('calculates discount percentage accurately', () => {
    // Regular $499.00, compare-at $549.00
    const discount = calculateDiscountPercent(49900, 54900);
    assert.equal(discount, 9); // ~9.1% rounded to 9%

    // No discount when compare-at is lower or equal
    assert.equal(calculateDiscountPercent(49900, 49900), 0);
    assert.equal(calculateDiscountPercent(49900, null), 0);
  });

  it('calculates sales tax using basis points', () => {
    // Subtotal $100.00 (10000 cents) at 8.25% (825 bps)
    assert.equal(calculateTax(10000, 825), 825);
  });

  it('throws on invalid non-finite numbers or negative commission rates', () => {
    assert.throws(() => formatMoney(NaN), TypeError);
    assert.throws(() => calculateCommission(-100, 1000), RangeError);
    assert.throws(() => calculateCommission(1000, 12000), RangeError);
  });
});
