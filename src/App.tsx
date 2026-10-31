import React, { useEffect, useState } from 'react';
import Navbar from '@/src/components/layout/Navbar.tsx';
import Footer from '@/src/components/layout/Footer.tsx';
import HeroSection from '@/src/components/marketplace/HeroSection.tsx';
import ProductCatalog from '@/src/components/marketplace/ProductCatalog.tsx';
import ArchitecturePanel from '@/src/components/marketplace/ArchitecturePanel.tsx';
import { getCategories, getFeaturedProducts } from '@/modules/catalog/catalog.service.ts';
import { CatalogCategory, CatalogProduct } from '@/modules/catalog/types.ts';

export default function App() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getFeaturedProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load catalog data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Shared Marketplace Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 space-y-16 pb-24">
        {/* Hero Section */}
        <HeroSection />

        {/* Content Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Permitted Goods Catalog */}
          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent align-[-0.125em]" />
              <p className="mt-4 text-xs font-medium">Initializing Everything Market Catalog...</p>
            </div>
          ) : (
            <ProductCatalog
              initialCategories={categories}
              initialProducts={products}
            />
          )}

          {/* Architecture, Schema & Automated Checks Console */}
          <ArchitecturePanel />
        </div>
      </main>

      {/* Shared Marketplace Footer */}
      <Footer />
    </div>
  );
}
