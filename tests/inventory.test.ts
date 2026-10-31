import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStockStatus,
  createInventorySnapshot,
  evaluateStockAllocation,
} from '../modules/inventory/inventory.service.ts';

describe('Inventory Subsystem (Stock & Allocation Verification)', () => {
  it('determines correct stock status based on available units and thresholds', () => {
    // 50 on hand, 5 reserved -> 45 available (> threshold 5) -> IN_STOCK
    assert.equal(calculateStockStatus(50, 5, 5), 'IN_STOCK');

    // 8 on hand, 4 reserved -> 4 available (<= threshold 5) -> LOW_STOCK
    assert.equal(calculateStockStatus(8, 4, 5), 'LOW_STOCK');

    // 10 on hand, 10 reserved -> 0 available, no backorders -> OUT_OF_STOCK
    assert.equal(calculateStockStatus(10, 10, 5, false), 'OUT_OF_STOCK');

    // 0 on hand, 0 reserved, backorders allowed -> BACKORDER_ALLOWED
    assert.equal(calculateStockStatus(0, 0, 5, true), 'BACKORDER_ALLOWED');
  });

  it('creates an inventory snapshot with non-negative available quantity', () => {
    const snapshot = createInventorySnapshot({
      variantId: 'var_test_1',
      quantityOnHand: 20,
      quantityReserved: 3,
      reorderThreshold: 5,
    });

    assert.equal(snapshot.variantId, 'var_test_1');
    assert.equal(snapshot.availableQuantity, 17);
    assert.equal(snapshot.status, 'IN_STOCK');
  });

  it('allocates requested stock when available units are sufficient', () => {
    const snapshot = createInventorySnapshot({
      variantId: 'var_test_2',
      quantityOnHand: 15,
      quantityReserved: 5, // 10 available
    });

    const result = evaluateStockAllocation(snapshot, 4);
    assert.equal(result.isAllocated, true);
    assert.equal(result.allocatedQuantity, 4);
    assert.equal(result.remainingAvailable, 6);
  });

  it('rejects allocation when requested quantity exceeds available stock', () => {
    const snapshot = createInventorySnapshot({
      variantId: 'var_test_3',
      quantityOnHand: 10,
      quantityReserved: 8, // only 2 available
      allowBackorders: false,
    });

    const result = evaluateStockAllocation(snapshot, 5);
    assert.equal(result.isAllocated, false);
    assert.equal(result.allocatedQuantity, 0);
    assert.match(result.rejectionReason || '', /Insufficient stock/);
  });

  it('rejects non-positive and fractional quantities', () => {
    const snapshot = createInventorySnapshot({
      variantId: 'var_test_4',
      quantityOnHand: 20,
      quantityReserved: 0,
    });

    assert.equal(evaluateStockAllocation(snapshot, 0).isAllocated, false);
    assert.equal(evaluateStockAllocation(snapshot, -2).isAllocated, false);
    assert.equal(evaluateStockAllocation(snapshot, 1.5).isAllocated, false);
  });
});
