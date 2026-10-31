/**
 * Everything Market — Development Seed Dataset
 *
 * Fully compliant, realistic multi-vendor catalog data with exact monetary
 * representations (integer cents) and inventory counts.
 */

export const SEED_USERS = [
  {
    id: 'usr_admin_001',
    email: 'admin@everythingmarket.dev',
    firstName: 'Platform',
    lastName: 'Admin',
    role: 'ADMIN' as const,
    isActive: true,
  },
  {
    id: 'usr_moderator_001',
    email: 'moderator@everythingmarket.dev',
    firstName: 'Alex',
    lastName: 'Vance',
    role: 'MODERATOR' as const,
    isActive: true,
  },
  {
    id: 'usr_seller_apex',
    email: 'vendor.apex@everythingmarket.dev',
    firstName: 'Marcus',
    lastName: 'Chen',
    role: 'SELLER' as const,
    isActive: true,
  },
  {
    id: 'usr_seller_nordic',
    email: 'vendor.nordic@everythingmarket.dev',
    firstName: 'Astrid',
    lastName: 'Lindholm',
    role: 'SELLER' as const,
    isActive: true,
  },
  {
    id: 'usr_seller_summit',
    email: 'vendor.summit@everythingmarket.dev',
    firstName: 'David',
    lastName: 'Kowalski',
    role: 'SELLER' as const,
    isActive: true,
  },
  {
    id: 'usr_buyer_jane',
    email: 'buyer.jane@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'BUYER' as const,
    isActive: true,
  },
];

export const SEED_SELLERS = [
  {
    id: 'sel_apex_001',
    userId: 'usr_seller_apex',
    storeName: 'Apex Audio Labs',
    storeSlug: 'apex-audio-labs',
    storeDescription: 'High-fidelity acoustic hardware, planar magnetic headphones, and precision studio monitoring gear.',
    businessNumber: 'EIN-84-9281729',
    verificationStatus: 'APPROVED' as const,
    commissionRateBps: 1000, // 10.00%
    payoutAccountEmail: 'payouts@apexaudio.example',
    supportEmail: 'support@apexaudio.example',
    supportPhone: '+1-555-019-2831',
    isActive: true,
  },
  {
    id: 'sel_nordic_002',
    userId: 'usr_seller_nordic',
    storeName: 'Nordic Roast Co.',
    storeSlug: 'nordic-roast-co',
    storeDescription: 'Direct-trade single-origin specialty coffees, precision burr grinders, and handcrafted brewing equipment.',
    businessNumber: 'EIN-73-1948201',
    verificationStatus: 'APPROVED' as const,
    commissionRateBps: 800, // 8.00%
    payoutAccountEmail: 'finance@nordicroast.example',
    supportEmail: 'care@nordicroast.example',
    supportPhone: '+1-555-018-7744',
    isActive: true,
  },
  {
    id: 'sel_summit_003',
    userId: 'usr_seller_summit',
    storeName: 'Summit Trail Outfitters',
    storeSlug: 'summit-trail-outfitters',
    storeDescription: 'Ultralight backpacking equipment, titanium cooksets, and all-weather alpine technical gear.',
    businessNumber: 'EIN-91-3829104',
    verificationStatus: 'APPROVED' as const,
    commissionRateBps: 1200, // 12.00%
    payoutAccountEmail: 'treasury@summittrail.example',
    supportEmail: 'help@summittrail.example',
    supportPhone: '+1-555-014-9912',
    isActive: true,
  },
];

export const SEED_CATEGORIES = [
  // Top-Level Categories
  {
    id: 'cat_electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Precision consumer electronics, acoustics, audio hardware, and gadgets.',
    parentId: null,
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat_home_kitchen',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Artisan kitchenware, specialty coffee tools, and ergonomic home goods.',
    parentId: null,
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat_outdoor_gear',
    name: 'Outdoors & Gear',
    slug: 'outdoors-gear',
    description: 'Alpine mountaineering, ultralight hiking, and high-performance expedition gear.',
    parentId: null,
    displayOrder: 3,
    isActive: true,
  },
  // Subcategories
  {
    id: 'cat_audio_headphones',
    name: 'Audio & Headphones',
    slug: 'audio-headphones',
    description: 'Studio monitoring headphones, wireless earbuds, and DAC amplifiers.',
    parentId: 'cat_electronics',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat_coffee_brewing',
    name: 'Specialty Coffee & Tea',
    slug: 'coffee-brewing',
    description: 'Manual espresso machines, flat burr grinders, and pour-over kettles.',
    parentId: 'cat_home_kitchen',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat_camp_kitchen',
    name: 'Camp Kitchen & Hydration',
    slug: 'camp-kitchen',
    description: 'Ultralight titanium cookware, micro-stoves, and insulated trail flasks.',
    parentId: 'cat_outdoor_gear',
    displayOrder: 1,
    isActive: true,
  },
];

export const SEED_PRODUCTS = [
  {
    id: 'prd_apex_planar_x1',
    sellerId: 'sel_apex_001',
    categoryId: 'cat_audio_headphones',
    title: 'Apex Planar-X Reference Headphones',
    slug: 'apex-planar-x-reference-headphones',
    shortDescription: 'Open-back planar magnetic headphones engineered for master-grade studio monitoring and audiophile playback.',
    fullDescription: 'The Apex Planar-X features proprietary 100mm ultra-thin planar drivers delivering sub-bass extension down to 10Hz with near-zero harmonic distortion. CNC-machined aerospace aluminum chassis with lambskin memory foam ear pads for all-day comfort.',
    status: 'ACTIVE' as const,
    basePriceCents: 49900, // $499.00
    currency: 'USD',
    brand: 'Apex Audio Labs',
    skuPrefix: 'APX-PLX',
    isTaxExempt: false,
    variants: [
      {
        id: 'var_apex_plx_blk',
        sku: 'APX-PLX-BLK-32',
        title: 'Matte Obsidian Black / 32 Ohm',
        priceCents: 49900, // $499.00
        compareAtPriceCents: 54900, // $549.00
        costPriceCents: 21000,
        barcode: '849201948201',
        weightGrams: 420,
        attributes: { color: 'Matte Obsidian Black', impedance: '32 Ohm', cable: '3.5mm braided with 6.3mm adapter' },
        inventory: {
          quantityOnHand: 45,
          quantityReserved: 3,
          reorderThreshold: 10,
          warehouseLocation: 'Zone-A / Shelf-12B',
        },
      },
      {
        id: 'var_apex_plx_slv',
        sku: 'APX-PLX-SLV-250',
        title: 'Brushed Silver / 250 Ohm High-Impedance',
        priceCents: 52900, // $529.00
        compareAtPriceCents: 57900, // $579.00
        costPriceCents: 22500,
        barcode: '849201948218',
        weightGrams: 435,
        attributes: { color: 'Brushed Silver', impedance: '250 Ohm Studio', cable: '4-pin balanced XLR included' },
        inventory: {
          quantityOnHand: 18,
          quantityReserved: 1,
          reorderThreshold: 5,
          warehouseLocation: 'Zone-A / Shelf-12C',
        },
      },
    ],
    images: [
      {
        id: 'img_apex_plx_1',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
        altText: 'Apex Planar-X Reference Headphones in matte black with aluminum frame',
        displayOrder: 1,
        isThumbnail: true,
      },
      {
        id: 'img_apex_plx_2',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
        altText: 'Apex Planar-X detailed view of open-back planar acoustic magnetic driver housing',
        displayOrder: 2,
        isThumbnail: false,
      },
    ],
  },
  {
    id: 'prd_nordic_burr_grinder',
    sellerId: 'sel_nordic_002',
    categoryId: 'cat_coffee_brewing',
    title: 'Nordic Precision Conical Burr Coffee Grinder',
    slug: 'nordic-precision-conical-burr-coffee-grinder',
    shortDescription: 'Stepless manual hand coffee grinder with 48mm titanium-coated stainless steel burrs for Turkish to French Press.',
    fullDescription: 'Crafted in Copenhagen, the Nordic Precision grinder pairs an ergonomic dual-bearing stabilization shaft with titanium carbon-nitride coated burrs. Features external micrometer click adjustment providing 12.5 microns per click for unmatched particle size consistency.',
    status: 'ACTIVE' as const,
    basePriceCents: 18500, // $185.00
    currency: 'USD',
    brand: 'Nordic Roast Co.',
    skuPrefix: 'NRC-BGR',
    isTaxExempt: false,
    variants: [
      {
        id: 'var_nordic_bgr_ash',
        sku: 'NRC-BGR-ASH-48',
        title: 'Nordic Ash Wood & Matte Gunmetal',
        priceCents: 18500, // $185.00
        compareAtPriceCents: 21000,
        costPriceCents: 8200,
        barcode: '731948201011',
        weightGrams: 680,
        attributes: { finish: 'Nordic Ash', burrSize: '48mm Titanium', hopperCapacity: '35g' },
        inventory: {
          quantityOnHand: 84,
          quantityReserved: 5,
          reorderThreshold: 15,
          warehouseLocation: 'Zone-C / Bay-04',
        },
      },
      {
        id: 'var_nordic_bgr_walnut',
        sku: 'NRC-BGR-WAL-48',
        title: 'Dark American Walnut & Ceramic Black',
        priceCents: 19500, // $195.00
        compareAtPriceCents: 22000,
        costPriceCents: 8600,
        barcode: '731948201028',
        weightGrams: 695,
        attributes: { finish: 'Dark Walnut', burrSize: '48mm Titanium', hopperCapacity: '35g' },
        inventory: {
          quantityOnHand: 32,
          quantityReserved: 2,
          reorderThreshold: 10,
          warehouseLocation: 'Zone-C / Bay-05',
        },
      },
    ],
    images: [
      {
        id: 'img_nordic_bgr_1',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
        altText: 'Nordic precision hand coffee grinder on a wooden brew bar',
        displayOrder: 1,
        isThumbnail: true,
      },
    ],
  },
  {
    id: 'prd_summit_titanium_pot',
    sellerId: 'sel_summit_003',
    categoryId: 'cat_camp_kitchen',
    title: 'Summit Trail Ultralight Titanium Cookset (900ml)',
    slug: 'summit-trail-ultralight-titanium-cookset-900ml',
    shortDescription: 'Grade-1 Japanese titanium camp pot with strainer lid, folding insulated handles, and volumetric graduations.',
    fullDescription: 'Weighing only 118 grams, the Summit Trail 900ml titanium pot nests a standard 230g isobutane fuel canister and ultralight micro-stove. Corrosion-proof, biocompatible, and designed for high-altitude boiling efficiency.',
    status: 'ACTIVE' as const,
    basePriceCents: 4800, // $48.00
    currency: 'USD',
    brand: 'Summit Trail Outfitters',
    skuPrefix: 'STO-TIT',
    isTaxExempt: false,
    variants: [
      {
        id: 'var_summit_tit_900',
        sku: 'STO-TIT-900ML',
        title: '900ml Ultralight Pot with Vented Lid',
        priceCents: 4800, // $48.00
        compareAtPriceCents: 5800,
        costPriceCents: 1800,
        barcode: '913829104014',
        weightGrams: 118,
        attributes: { capacity: '900ml', material: 'Grade 1 Pure Titanium', includes: 'Mesh stuff sack' },
        inventory: {
          quantityOnHand: 120,
          quantityReserved: 8,
          reorderThreshold: 20,
          warehouseLocation: 'Zone-B / Shelf-01',
        },
      },
      {
        id: 'var_summit_tit_1300',
        sku: 'STO-TIT-1300ML',
        title: '1300ml Expedition Group Pot with Frypan Lid',
        priceCents: 6200, // $62.00
        compareAtPriceCents: 7400,
        costPriceCents: 2400,
        barcode: '913829104021',
        weightGrams: 165,
        attributes: { capacity: '1300ml', material: 'Grade 1 Pure Titanium', includes: 'Frying pan lid + sack' },
        inventory: {
          quantityOnHand: 60,
          quantityReserved: 4,
          reorderThreshold: 15,
          warehouseLocation: 'Zone-B / Shelf-02',
        },
      },
    ],
    images: [
      {
        id: 'img_summit_tit_1',
        url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
        altText: 'Ultralight titanium cookware on an alpine camping expedition',
        displayOrder: 1,
        isThumbnail: true,
      },
    ],
  },
];
