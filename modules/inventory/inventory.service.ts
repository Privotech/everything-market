import { InventorySnapshot, StockAllocationResult, StockStatus } from './types.ts';

/**
 * Determine stock status based on available units and reorder thresholds.
 */
export function calculateStockStatus(
  quantityOnHand: number,
  quantityReserved: number,
  reorderThreshold: number = 5,
  allowBackorders: boolean = false
): StockStatus {
  const available = Math.max(0, quantityOnHand - quantityReserved);

  if (available === 0) {
    return allowBackorders ? 'BACKORDER_ALLOWED' : 'OUT_OF_STOCK';
  }

  if (available <= reorderThreshold) {
    return 'LOW_STOCK';
  }

  return 'IN_STOCK';
}

/**
 * Create an inventory snapshot representing current stock availability.
 */
export function createInventorySnapshot(params: {
  variantId: string;
  quantityOnHand: number;
  quantityReserved: number;
  reorderThreshold?: number;
  allowBackorders?: boolean;
}): InventorySnapshot {
  const threshold = params.reorderThreshold ?? 5;
  const backorders = params.allowBackorders ?? false;
  const available = Math.max(0, params.quantityOnHand - params.quantityReserved);
  const status = calculateStockStatus(
    params.quantityOnHand,
    params.quantityReserved,
    threshold,
    backorders
  );

  return {
    variantId: params.variantId,
    quantityOnHand: params.quantityOnHand,
    quantityReserved: params.quantityReserved,
    availableQuantity: available,
    reorderThreshold: threshold,
    allowBackorders: backorders,
    status,
  };
}

/**
 * Pure business logic for verifying and calculating stock allocation for an order line item.
 * Strictly checks that quantity requested is positive and does not exceed available stock.
 */
export function evaluateStockAllocation(
  snapshot: InventorySnapshot,
  requestedQuantity: number
): StockAllocationResult {
  if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
    return {
      isAllocated: false,
      variantId: snapshot.variantId,
      requestedQuantity,
      allocatedQuantity: 0,
      remainingAvailable: snapshot.availableQuantity,
      rejectionReason: 'Requested quantity must be a positive integer greater than 0',
    };
  }

  if (snapshot.availableQuantity >= requestedQuantity) {
    return {
      isAllocated: true,
      variantId: snapshot.variantId,
      requestedQuantity,
      allocatedQuantity: requestedQuantity,
      remainingAvailable: snapshot.availableQuantity - requestedQuantity,
    };
  }

  if (snapshot.allowBackorders) {
    return {
      isAllocated: true,
      variantId: snapshot.variantId,
      requestedQuantity,
      allocatedQuantity: requestedQuantity,
      remainingAvailable: 0,
    };
  }

  return {
    isAllocated: false,
    variantId: snapshot.variantId,
    requestedQuantity,
    allocatedQuantity: 0,
    remainingAvailable: snapshot.availableQuantity,
    rejectionReason: `Insufficient stock. Only ${snapshot.availableQuantity} unit(s) available.`,
  };
}
