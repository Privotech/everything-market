export interface SellerSummary {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  storeDescription?: string | null;
  businessNumber?: string | null;
  verificationStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
  commissionRateBps: number;
  commissionPercentage: number;
  isActive: boolean;
}
