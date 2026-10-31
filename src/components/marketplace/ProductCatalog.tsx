import React, { useState, useMemo } from 'react';
import { CatalogCategory, CatalogProduct } from '@/modules/catalog/types.ts';
import CategoryBar from './CategoryBar.tsx';
import ProductCard from './ProductCard.tsx';
import { ShieldCheck, Filter, AlertTriangle } from 'lucide-react';

interface ProductCatalogProps {
  initialCategories: CatalogCategory[];
  initialProducts: CatalogProduct[];
}

export default function ProductCatalog({
  initialCategories,
  initialProducts,
}: ProductCatalogProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  // Extract unique sellers from products
  const sellers = useMemo(() => {
    const map = new Map<string, { id: string; storeName: string }>();
    initialProducts.forEach((p) => {
      map.set(p.seller.id, { id: p.seller.id, storeName: p.seller.storeName });
    });
    return Array.from(map.values());
  }, [initialProducts]);

  // Filter products by category and seller
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (activeCategoryId) {
        const matchesCategory =
          product.category.id === activeCategoryId ||
          initialCategories
            .find((c) => c.id === activeCategoryId)
            ?.subcategories?.some((sub) => sub.id === product.category.id);
        if (!matchesCategory) return false;
      }
      if (selectedSellerId) {
        if (product.seller.id !== selectedSellerId) return false;
      }
      return true;
    });
  }, [initialProducts, initialCategories, activeCategoryId, selectedSellerId]);

  return (
    <section id="catalog" className="scroll-mt-20 space-y-8">
      {/* Catalog Header & Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Permitted Goods Catalog
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Multi-vendor products verified against catalog policies with deterministic pricing and real-time inventory.
            </p>
          </div>

          {/* Seller Filter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-indigo-400" />
              Filter by Merchant:
            </span>
            <select
              value={selectedSellerId || ''}
              onChange={(e) => setSelectedSellerId(e.target.value || null)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">All Verified Merchants ({sellers.length})</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.storeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <CategoryBar
          categories={initialCategories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
        />
      </div>

      {/* Catalog Results Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-400" />
          <h3 className="text-base font-semibold text-white">No products found</h3>
          <p className="text-xs text-slate-400">
            No active products match the selected category or merchant filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategoryId(null);
              setSelectedSellerId(null);
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Security & Verification Banner */}
      <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 flex items-center justify-between text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero-Trust Pricing:</strong> All line item subtotals, variant stock reservations, and tax computations are validated and committed server-side.
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-emerald-400/80">
          Strict Integer Math (Cents)
        </span>
      </div>
    </section>
  );
}
