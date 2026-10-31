import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CatalogProduct,
  CatalogCategory,
  CatalogVariant,
  CartItem,
  Order,
  ShippingAddress,
} from '@/modules/catalog/types.ts';
import { SupportedCurrency, CURRENCY_RATES } from '@/lib/money.ts';
import { getCategories, getFeaturedProducts } from '@/modules/catalog/catalog.service.ts';

export interface Coupon {
  code: string;
  discountPercent?: number;
  fixedDiscountCents?: number;
  description: string;
  minSubtotalCents?: number;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'JUMIA20',
    discountPercent: 20,
    description: '20% Off Your Entire Order (Jumia Special)',
  },
  {
    code: 'TEMU10',
    fixedDiscountCents: 1000,
    description: '$10 Off Orders over $30 (Temu Lightning)',
    minSubtotalCents: 3000,
  },
  {
    code: 'ALIBABA50',
    fixedDiscountCents: 5000,
    description: '$50 Off Wholesale Orders over $150',
    minSubtotalCents: 15000,
  },
  {
    code: 'FREESHIP',
    discountPercent: 10,
    description: 'Free Shipping + 10% Extra Discount',
  },
];

interface MarketplaceContextType {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  loading: boolean;
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  activeTab: 'shop' | 'flash' | 'wholesale' | 'under25' | 'orders' | 'seller';
  setActiveTab: (tab: 'shop' | 'flash' | 'wholesale' | 'under25' | 'orders' | 'seller') => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  addToCart: (product: CatalogProduct, variant?: CatalogVariant, quantity?: number) => void;
  updateCartQty: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotalCents: number;
  cartDiscountCents: number;
  cartShippingCents: number;
  cartTaxCents: number;
  cartFinalTotalCents: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  orders: Order[];
  placeOrder: (shippingAddress: ShippingAddress, deliveryMethod: string, paymentMethod: string) => Order;
  activeProductModal: CatalogProduct | null;
  setActiveProductModal: (p: CatalogProduct | null) => void;
  addNewProduct: (newProd: Partial<CatalogProduct>) => void;
  updateProductStock: (productId: string, variantId: string, newStock: number) => void;
  deliveryLocation: string;
  setDeliveryLocation: (loc: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [activeTab, setActiveTab] = useState<'shop' | 'flash' | 'wholesale' | 'under25' | 'orders' | 'seller'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [activeProductModal, setActiveProductModal] = useState<CatalogProduct | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState('New York, USA');

  // Load initial catalog data
  useEffect(() => {
    async function init() {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getFeaturedProducts()]);
        setCategories(cats);
        setProducts(prods);

        // Prepopulate with a sample previous order so "My Orders" has realistic tracking data immediately
        if (prods.length > 0) {
          const sampleProduct = prods[0];
          const sampleVariant = sampleProduct.variants[0];
          setOrders([
            {
              id: 'ord_sample_9841',
              orderNumber: 'EM-849201',
              createdAt: 'Yesterday, 14:32',
              status: 'SHIPPED',
              items: [
                {
                  title: sampleProduct.title,
                  variantTitle: sampleVariant?.title || 'Standard',
                  sku: sampleVariant?.sku || 'EM-SKU',
                  quantity: 1,
                  priceCents: sampleVariant?.priceCents || sampleProduct.basePriceCents,
                  image: sampleProduct.images[0]?.url || '',
                },
              ],
              subtotalCents: sampleVariant?.priceCents || sampleProduct.basePriceCents,
              shippingCents: 0,
              discountCents: 0,
              taxCents: Math.round(((sampleVariant?.priceCents || sampleProduct.basePriceCents) * 825) / 10000),
              totalCents:
                (sampleVariant?.priceCents || sampleProduct.basePriceCents) +
                Math.round(((sampleVariant?.priceCents || sampleProduct.basePriceCents) * 825) / 10000),
              shippingAddress: {
                fullName: 'Jane Doe',
                email: 'shopper@everythingmarket.dev',
                phone: '+1 (555) 234-5678',
                street: '742 Evergreen Terrace',
                city: 'Springfield',
                state: 'OR',
                zipCode: '97477',
                country: 'United States',
              },
              deliveryMethod: 'Express Air Freight (2-4 business days)',
              paymentMethod: 'Credit Card (ending in •••• 4242)',
              trackingNumber: 'TRK-984210492EM',
              estimatedDelivery: 'Tomorrow by 5:00 PM',
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load initial marketplace data:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Cart operations
  const addToCart = (product: CatalogProduct, variant?: CatalogVariant, quantity: number = 1) => {
    const selectedVar = variant || product.variants[0];
    const itemId = `${product.id}-${selectedVar.id}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          variant: selectedVar,
          quantity,
          unitPriceCents: selectedVar.priceCents,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateCartQty = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotalCents = cart.reduce((sum, item) => {
    // Check wholesale volume discounts if applicable
    let unitPrice = item.unitPriceCents;
    if (item.product.isWholesale && item.product.wholesaleTiers) {
      for (const tier of item.product.wholesaleTiers) {
        if (item.quantity >= tier.minQty) {
          unitPrice = tier.priceCents;
        }
      }
    }
    return sum + unitPrice * item.quantity;
  }, 0);

  // Free shipping threshold: $35.00 (3500 cents)
  const cartShippingCents = cartSubtotalCents === 0 || cartSubtotalCents >= 3500 ? 0 : 499;

  let cartDiscountCents = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      cartDiscountCents = Math.round((cartSubtotalCents * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.fixedDiscountCents) {
      cartDiscountCents = Math.min(appliedCoupon.fixedDiscountCents, cartSubtotalCents);
    }
  }

  const taxableAmount = Math.max(0, cartSubtotalCents - cartDiscountCents);
  const cartTaxCents = Math.round((taxableAmount * 825) / 10000); // 8.25% sales tax
  const cartFinalTotalCents = taxableAmount + cartShippingCents + cartTaxCents;

  // Coupon handling
  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!coupon) {
      setCouponError('Invalid coupon code. Try JUMIA20, TEMU10, or ALIBABA50');
      return false;
    }

    if (coupon.minSubtotalCents && cartSubtotalCents < coupon.minSubtotalCents) {
      setCouponError(`Requires minimum order of $${(coupon.minSubtotalCents / 100).toFixed(2)}`);
      return false;
    }

    setAppliedCoupon(coupon);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Wishlist handling
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Checkout & Order Placement
  const placeOrder = (
    shippingAddress: ShippingAddress,
    deliveryMethod: string,
    paymentMethod: string
  ): Order => {
    const randomOrderNumber = `EM-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomTracking = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}EM`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: randomOrderNumber,
      createdAt: 'Just now',
      status: 'PROCESSING',
      items: cart.map((item) => ({
        title: item.product.title,
        variantTitle: item.variant.title,
        sku: item.variant.sku,
        quantity: item.quantity,
        priceCents: item.unitPriceCents,
        image: item.product.images[0]?.url || '',
      })),
      subtotalCents: cartSubtotalCents,
      shippingCents: cartShippingCents,
      discountCents: cartDiscountCents,
      taxCents: cartTaxCents,
      totalCents: cartFinalTotalCents,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      trackingNumber: randomTracking,
      estimatedDelivery: 'Arriving in 3-5 business days',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setActiveTab('orders'); // Jump directly to My Orders to show tracking timeline!
    return newOrder;
  };

  // Seller Center: Add new product
  const addNewProduct = (newProd: Partial<CatalogProduct>) => {
    const price = newProd.basePriceCents || 1999;
    const prodId = `prd_${Date.now()}`;
    const variantId = `var_${Date.now()}`;

    const createdProduct: CatalogProduct = {
      id: prodId,
      title: newProd.title || 'New Merchant Item',
      slug: (newProd.title || 'new-product').toLowerCase().replace(/\s+/g, '-'),
      shortDescription: newProd.shortDescription || 'Verified merchant listing',
      fullDescription: newProd.fullDescription || 'High quality factory-direct goods.',
      basePriceCents: price,
      currency: 'USD',
      brand: newProd.brand || 'Merchant Brand',
      status: 'ACTIVE',
      category: newProd.category || {
        id: 'cat_electronics',
        name: 'Electronics & Gadgets',
        slug: 'electronics',
      },
      seller: {
        id: 'sel_merchant_custom',
        storeName: 'Your Verified Store',
        storeSlug: 'your-verified-store',
        verificationStatus: 'APPROVED',
        rating: 5.0,
        responseRate: '100%',
        yearsActive: 1,
      },
      variants: [
        {
          id: variantId,
          sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          title: 'Standard Edition',
          priceCents: price,
          compareAtPriceCents: Math.round(price * 1.3),
          isActive: true,
          availableStock: 50,
        },
      ],
      images: newProd.images?.length
        ? newProd.images
        : [
            {
              id: `img_${Date.now()}`,
              url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
              altText: newProd.title || 'Merchant Product',
              displayOrder: 1,
              isThumbnail: true,
            },
          ],
      rating: 5.0,
      reviewCount: 1,
      soldCount: 0,
      freeShipping: true,
      tags: ['NEW_ARRIVAL', 'VERIFIED_MERCHANT'],
      specifications: {
        'Supplier': 'Official Store',
        'Condition': 'Brand New 100% Authentic',
      },
      reviews: [],
    };

    setProducts((prev) => [createdProduct, ...prev]);
  };

  // Seller Center: Update stock
  const updateProductStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          variants: p.variants.map((v) =>
            v.id === variantId ? { ...v, availableStock: Math.max(0, newStock) } : v
          ),
        };
      })
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        categories,
        loading,
        currency,
        setCurrency,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotalCents,
        cartDiscountCents,
        cartShippingCents,
        cartTaxCents,
        cartFinalTotalCents,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        orders,
        placeOrder,
        activeProductModal,
        setActiveProductModal,
        addNewProduct,
        updateProductStock,
        deliveryLocation,
        setDeliveryLocation,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
