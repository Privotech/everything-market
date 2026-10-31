export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'BACKORDER_ALLOWED';

export interface InventorySnapshot {
  variantId: string;
  quantityOnHand: number;
  quantityReserved: number;
  availableQuantity: number;
  reorderThreshold: number;
  allowBackorders: boolean;
  status: StockStatus;
}

export interface StockAllocationResult {
  isAllocated: boolean;
  variantId: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  remainingAvailable: number;
  rejectionReason?: string;
}
