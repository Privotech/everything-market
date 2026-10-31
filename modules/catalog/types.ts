export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  subcategories?: CatalogCategory[];
}

export interface CatalogVariant {
  id: string;
  sku: string;
  title: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  barcode?: string | null;
  weightGrams?: number | null;
  isActive: boolean;
  attributes?: Record<string, string | number> | null;
  availableStock?: number;
}

export interface CatalogImage {
  id: string;
  url: string;
  altText: string;
  displayOrder: number;
  isThumbnail: boolean;
}

export interface CatalogProduct {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  fullDescription: string;
  basePriceCents: number;
  currency: string;
  brand?: string | null;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'ARCHIVED' | 'SUSPENDED';
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    storeName: string;
    storeSlug: string;
    verificationStatus: string;
  };
  variants: CatalogVariant[];
  images: CatalogImage[];
}
