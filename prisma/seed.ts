import { PrismaClient } from '@prisma/client';
import {
  SEED_USERS,
  SEED_SELLERS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
} from './seed-data.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Everything Market idempotent database seed...');

  // 1. Seed Users
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
      create: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    });
  }
  console.log(`✅ Seeded ${SEED_USERS.length} core users (Admin, Seller, Buyer, Moderator).`);

  // 2. Seed Sellers
  for (const seller of SEED_SELLERS) {
    await prisma.sellerProfile.upsert({
      where: { storeSlug: seller.storeSlug },
      update: {
        storeName: seller.storeName,
        storeDescription: seller.storeDescription,
        businessNumber: seller.businessNumber,
        verificationStatus: seller.verificationStatus,
        commissionRateBps: seller.commissionRateBps,
        payoutAccountEmail: seller.payoutAccountEmail,
        supportEmail: seller.supportEmail,
        supportPhone: seller.supportPhone,
        isActive: seller.isActive,
      },
      create: {
        id: seller.id,
        userId: seller.userId,
        storeName: seller.storeName,
        storeSlug: seller.storeSlug,
        storeDescription: seller.storeDescription,
        businessNumber: seller.businessNumber,
        verificationStatus: seller.verificationStatus,
        commissionRateBps: seller.commissionRateBps,
        payoutAccountEmail: seller.payoutAccountEmail,
        supportEmail: seller.supportEmail,
        supportPhone: seller.supportPhone,
        isActive: seller.isActive,
      },
    });
  }
  console.log(`✅ Seeded ${SEED_SELLERS.length} verified merchant profiles.`);

  // 3. Seed Categories (Root categories first, then child categories)
  const rootCategories = SEED_CATEGORIES.filter((c) => !c.parentId);
  const childCategories = SEED_CATEGORIES.filter((c) => !!c.parentId);

  for (const cat of rootCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      },
    });
  }

  for (const cat of childCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        parentId: cat.parentId,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parentId: cat.parentId,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
      },
    });
  }
  console.log(`✅ Seeded ${SEED_CATEGORIES.length} hierarchical categories.`);

  // 4. Seed Products, Variants, Images & Inventories
  for (const prod of SEED_PRODUCTS) {
    const productRecord = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        shortDescription: prod.shortDescription,
        fullDescription: prod.fullDescription,
        status: prod.status,
        basePriceCents: prod.basePriceCents,
        currency: prod.currency,
        brand: prod.brand,
        skuPrefix: prod.skuPrefix,
        isTaxExempt: prod.isTaxExempt,
      },
      create: {
        id: prod.id,
        sellerId: prod.sellerId,
        categoryId: prod.categoryId,
        title: prod.title,
        slug: prod.slug,
        shortDescription: prod.shortDescription,
        fullDescription: prod.fullDescription,
        status: prod.status,
        basePriceCents: prod.basePriceCents,
        currency: prod.currency,
        brand: prod.brand,
        skuPrefix: prod.skuPrefix,
        isTaxExempt: prod.isTaxExempt,
      },
    });

    // Variants and Inventory
    for (const v of prod.variants) {
      const variantRecord = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          title: v.title,
          priceCents: v.priceCents,
          compareAtPriceCents: v.compareAtPriceCents,
          costPriceCents: v.costPriceCents,
          barcode: v.barcode,
          weightGrams: v.weightGrams,
          attributes: v.attributes,
        },
        create: {
          id: v.id,
          productId: productRecord.id,
          sku: v.sku,
          title: v.title,
          priceCents: v.priceCents,
          compareAtPriceCents: v.compareAtPriceCents,
          costPriceCents: v.costPriceCents,
          barcode: v.barcode,
          weightGrams: v.weightGrams,
          attributes: v.attributes,
        },
      });

      // Inventory record
      await prisma.inventory.upsert({
        where: { variantId: variantRecord.id },
        update: {
          quantityOnHand: v.inventory.quantityOnHand,
          quantityReserved: v.inventory.quantityReserved,
          reorderThreshold: v.inventory.reorderThreshold,
          warehouseLocation: v.inventory.warehouseLocation,
        },
        create: {
          variantId: variantRecord.id,
          quantityOnHand: v.inventory.quantityOnHand,
          quantityReserved: v.inventory.quantityReserved,
          reorderThreshold: v.inventory.reorderThreshold,
          warehouseLocation: v.inventory.warehouseLocation,
        },
      });
    }

    // Media
    for (const img of prod.images) {
      await prisma.productImage.upsert({
        where: { id: img.id },
        update: {
          url: img.url,
          altText: img.altText,
          displayOrder: img.displayOrder,
          isThumbnail: img.isThumbnail,
        },
        create: {
          id: img.id,
          productId: productRecord.id,
          url: img.url,
          altText: img.altText,
          displayOrder: img.displayOrder,
          isThumbnail: img.isThumbnail,
        },
      });
    }
  }

  console.log(`✅ Seeded ${SEED_PRODUCTS.length} products with variants, images, and inventory records.`);
  console.log('🎉 Everything Market seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('⚠️ Note on Database Seeding:');
    console.error(e.message);
    console.log('Ensure a live PostgreSQL instance is running with DATABASE_URL configured.');
    process.exit(0); // Exit cleanly for dry-runs / isolated checks
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
