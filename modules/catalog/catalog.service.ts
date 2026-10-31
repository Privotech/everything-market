import { prisma } from '@/lib/db.ts';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_SELLERS,
} from '@/prisma/seed-data.ts';
import { CatalogCategory, CatalogProduct } from './types.ts';

/**
 * Catalog Domain Service
 * Provides public catalog browsing, category hierarchy, and product detail queries.
 * Queries PostgreSQL via Prisma, falling back to seed dataset if the database is in setup state.
 */

export async function getCategories(): Promise<CatalogCategory[]> {
  if (prisma) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });

      if (categories && categories.length > 0) {
        return categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          parentId: c.parentId,
          displayOrder: c.displayOrder,
          isActive: c.isActive,
          subcategories: c.children.map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            parentId: sub.parentId,
            displayOrder: sub.displayOrder,
            isActive: sub.isActive,
          })),
        }));
      }
    } catch {
      // Database connection not initialized yet, use seed baseline
    }
  }

  // Fallback to in-memory seed categories
  const root = SEED_CATEGORIES.filter((c) => !c.parentId);
  return root.map((parent) => ({
    ...parent,
    subcategories: SEED_CATEGORIES.filter((child) => child.parentId === parent.id),
  }));
}

export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  if (prisma) {
    try {
      const products = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        include: {
          category: true,
          seller: true,
          variants: {
            where: { isActive: true },
            include: { inventory: true },
          },
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      });

    if (products && products.length > 0) {
      return products.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        basePriceCents: p.basePriceCents,
        currency: p.currency,
        brand: p.brand,
        status: p.status,
        category: {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
        },
        seller: {
          id: p.seller.id,
          storeName: p.seller.storeName,
          storeSlug: p.seller.storeSlug,
          verificationStatus: p.seller.verificationStatus,
        },
        variants: p.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          title: v.title,
          priceCents: v.priceCents,
          compareAtPriceCents: v.compareAtPriceCents,
          barcode: v.barcode,
          weightGrams: v.weightGrams,
          isActive: v.isActive,
          attributes: (v.attributes as Record<string, string | number>) ?? null,
          availableStock: v.inventory
            ? Math.max(0, v.inventory.quantityOnHand - v.inventory.quantityReserved)
            : 0,
        })),
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          displayOrder: img.displayOrder,
          isThumbnail: img.isThumbnail,
        })),
      }));
    }
  } catch {
    // Database connection not initialized yet, use seed baseline
  }
}

  // Fallback to in-memory seed products
  return SEED_PRODUCTS.map((p) => {
    const cat = SEED_CATEGORIES.find((c) => c.id === p.categoryId)!;
    const sel = SEED_SELLERS.find((s) => s.id === p.sellerId)!;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      basePriceCents: p.basePriceCents,
      currency: p.currency,
      brand: p.brand,
      status: p.status,
      category: {
        id: cat?.id || p.categoryId,
        name: cat?.name || 'General',
        slug: cat?.slug || 'general',
      },
      seller: {
        id: sel?.id || p.sellerId,
        storeName: sel?.storeName || 'Merchant',
        storeSlug: sel?.storeSlug || 'merchant',
        verificationStatus: sel?.verificationStatus || 'APPROVED',
      },
      variants: p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        title: v.title,
        priceCents: v.priceCents,
        compareAtPriceCents: v.compareAtPriceCents,
        barcode: v.barcode,
        weightGrams: v.weightGrams,
        isActive: true,
        attributes: v.attributes,
        availableStock: Math.max(0, v.inventory.quantityOnHand - v.inventory.quantityReserved),
      })),
      images: p.images,
    };
  });
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const products = await getFeaturedProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
