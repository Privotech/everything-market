import React from 'react';
import { MarketplaceProvider, useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import Navbar from '@/src/components/layout/Navbar.tsx';
import Footer from '@/src/components/layout/Footer.tsx';
import HeroSection from '@/src/components/marketplace/HeroSection.tsx';
import FlashDealsSection from '@/src/components/marketplace/FlashDealsSection.tsx';
import WholesaleSection from '@/src/components/marketplace/WholesaleSection.tsx';
import ProductCatalog from '@/src/components/marketplace/ProductCatalog.tsx';
import ProductDetailModal from '@/src/components/marketplace/ProductDetailModal.tsx';
import CartDrawer from '@/src/components/cart/CartDrawer.tsx';
import CheckoutModal from '@/src/components/checkout/CheckoutModal.tsx';
import WishlistModal from '@/src/components/wishlist/WishlistModal.tsx';
import OrdersView from '@/src/components/orders/OrdersView.tsx';
import SellerDashboard from '@/src/components/seller/SellerDashboard.tsx';

function MarketplaceMain() {
  const { activeTab, loading } = useMarketplace();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent" />
        <div className="text-sm font-bold text-slate-300">
          Loading Everything Market Global Catalog...
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 pb-24 space-y-12">
      {/* Tab: Shop All (Complete Marketplace Experience) */}
      {activeTab === 'shop' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 pt-4">
          <HeroSection />
          <FlashDealsSection />
          <WholesaleSection />
          <ProductCatalog />
        </div>
      )}

      {/* Tab: Flash Deals Focused View */}
      {activeTab === 'flash' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
          <FlashDealsSection />
          <ProductCatalog />
        </div>
      )}

      {/* Tab: Wholesale B2B Focused View */}
      {activeTab === 'wholesale' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
          <WholesaleSection />
          <ProductCatalog />
        </div>
      )}

      {/* Tab: Under $25 Bargains (Temu style) */}
      {activeTab === 'under25' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
          <div className="rounded-3xl border border-emerald-900/40 bg-gradient-to-r from-emerald-950/40 to-slate-900 p-8 text-white space-y-2">
            <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-black uppercase text-slate-950">
              TEMU BARGAIN ZONE
            </span>
            <h1 className="text-3xl font-black">Under $25 Mega Price Drops</h1>
            <p className="text-xs text-emerald-300">
              High-utility tech, thermal baselayers, tactical flasks, and everyday essentials direct from factories.
            </p>
          </div>
          <ProductCatalog />
        </div>
      )}

      {/* Tab: My Orders Tracking Portal */}
      {activeTab === 'orders' && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6">
          <OrdersView />
        </div>
      )}

      {/* Tab: Seller Center Merchant Portal */}
      {activeTab === 'seller' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <SellerDashboard />
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
        {/* Global Mega Header */}
        <Navbar />

        {/* Dynamic Multi-Tab Content */}
        <MarketplaceMain />

        {/* Modals & Slide-over Panels */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <WishlistModal />

        {/* Mega Footer */}
        <Footer />
      </div>
    </MarketplaceProvider>
  );
}
