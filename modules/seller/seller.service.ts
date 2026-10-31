import { SEED_SELLERS } from '@/prisma/seed-data.ts';
import { SellerSummary } from './types.ts';

export function getVerifiedSellers(): SellerSummary[] {
  return SEED_SELLERS.map((s) => ({
    id: s.id,
    userId: s.userId,
    storeName: s.storeName,
    storeSlug: s.storeSlug,
    storeDescription: s.storeDescription,
    businessNumber: s.businessNumber,
    verificationStatus: s.verificationStatus,
    commissionRateBps: s.commissionRateBps,
    commissionPercentage: s.commissionRateBps / 100,
    isActive: s.isActive,
  }));
}

export function getSellerBySlug(storeSlug: string): SellerSummary | null {
  const sellers = getVerifiedSellers();
  return sellers.find((s) => s.storeSlug === storeSlug) ?? null;
}
