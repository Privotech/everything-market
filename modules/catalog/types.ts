export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
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

export interface WholesaleTier {
  minQty: number;
  priceCents: number;
  discountPercent: number;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
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
  skuPrefix?: string | null;
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
    rating?: number;
    responseRate?: string;
    yearsActive?: number;
  };
  variants: CatalogVariant[];
  images: CatalogImage[];
  // Rich marketplace attributes
  rating: number;
  reviewCount: number;
  soldCount: number;
  isFlashDeal?: boolean;
  flashDiscountPercent?: number;
  isWholesale?: boolean;
  moq?: number;
  wholesaleTiers?: WholesaleTier[];
  freeShipping?: boolean;
  tags?: string[];
  specifications?: Record<string, string | undefined>;
  reviews?: ProductReview[];
}

export interface CartItem {
  id: string;
  product: CatalogProduct;
  variant: CatalogVariant;
  quantity: number;
  unitPriceCents: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: {
    title: string;
    variantTitle: string;
    sku: string;
    quantity: number;
    priceCents: number;
    image: string;
  }[];
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  paymentMethod: string;
  trackingNumber: string;
  estimatedDelivery: string;
}
