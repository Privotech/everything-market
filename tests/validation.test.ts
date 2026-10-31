import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePriceCents,
  validateSku,
  generateSlug,
  validateInventory,
  checkPermittedProduct,
} from '../lib/validation.ts';

describe('Domain Validation & Business Integrity Rules', () => {
  it('validates price cents boundaries strictly', () => {
    // Valid price ($29.99 = 2999 cents)
    assert.equal(validatePriceCents(2999).isValid, true);

    // Below 50 cents ($0.50 minimum)
    assert.equal(validatePriceCents(49).isValid, false);

    // Fractional cents (floating-point violation)
    assert.equal(validatePriceCents(29.99).isValid, false);

    // Negative price
    assert.equal(validatePriceCents(-100).isValid, false);

    // Compare-at price must be greater than active price
    assert.equal(validatePriceCents(2000, 2500).isValid, true);
    assert.equal(validatePriceCents(2000, 1500).isValid, false);
    assert.equal(validatePriceCents(2000, 2000).isValid, false);
  });

  it('validates SKU format standards', () => {
    assert.equal(validateSku('APX-PLX-BLK-32'), true);
    assert.equal(validateSku('NRC-BGR-48'), true);
    assert.equal(validateSku('bad'), false);
    assert.equal(validateSku(''), false);
  });

  it('generates clean URL slugs', () => {
    assert.equal(
      generateSlug('Apex Planar-X Reference Headphones!'),
      'apex-planar-x-reference-headphones'
    );
    assert.equal(
      generateSlug('Specialty Coffee & Burr Grinder 100%'),
      'specialty-coffee-burr-grinder-100'
    );
  });

  it('enforces non-negative inventory balances with reserved <= onHand', () => {
    assert.equal(validateInventory(50, 5).isValid, true);
    assert.equal(validateInventory(-1, 0).isValid, false);
    assert.equal(validateInventory(5, 10).isValid, false); // Reserved cannot exceed on hand
  });

  it('identifies prohibited catalog goods', () => {
    assert.equal(
      checkPermittedProduct('Alpine Backpack', 'Durable waterproof hiking bag').isPermitted,
      true
    );
    assert.equal(
      checkPermittedProduct('Military firearm accessory', 'Stock for weapon').isPermitted,
      false
    );
  });
});
