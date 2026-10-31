import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, Check, Truck, AlertCircle } from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import CategoryBar from './CategoryBar.tsx';
import ProductCard from './ProductCard.tsx';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'best-selling';

export default function ProductCatalog() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeTab,
  } = useMarketplace();

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Extract unique merchants
  const merchants = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.seller.id, p.seller.storeName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  // Filter & sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Tab-specific filters
        if (activeTab === 'flash' && !product.isFlashDeal && !product.flashDiscountPercent) {
          return false;
        }
        if (activeTab === 'wholesale' && !product.isWholesale && !product.wholesaleTiers?.length) {
          return false;
        }
        if (activeTab === 'under25' && product.basePriceCents > 2500) {
          return false;
        }

        // Category filter
        if (selectedCategory && selectedCategory !== 'cat_all') {
          if (product.category.id !== selectedCategory && product.category.slug !== selectedCategory) {
            return false;
          }
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchBrand = (product.brand || '').toLowerCase().includes(q);
          const matchDesc = product.fullDescription.toLowerCase().includes(q);
          const matchSeller = product.seller.storeName.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchDesc && !matchSeller) {
            return false;
          }
        }

        // Merchant filter
        if (selectedMerchant && product.seller.id !== selectedMerchant) {
          return false;
        }

        // Free shipping
        if (freeShippingOnly && !product.freeShipping) {
          return false;
        }

        // In Stock
        if (inStockOnly) {
          const hasStock = product.variants.some((v) => (v.availableStock ?? 0) > 0);
          if (!hasStock) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return a.basePriceCents - b.basePriceCents;
        }
        if (sortBy === 'price-high') {
          return b.basePriceCents - a.basePriceCents;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'best-selling') {
          return b.soldCount - a.soldCount;
        }
        return 0; // featured default
      });
  }, [
    products,
    activeTab,
    selectedCategory,
    searchQuery,
    selectedMerchant,
    freeShippingOnly,
    inStockOnly,
    sortBy,
  ]);

  return (
    <section id="catalog" className="scroll-mt-24 space-y-6">
      {/* Category Pills Navigation */}
      <CategoryBar />

      {/* Filter and Sorting Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        {/* Left: Active Count & Tag */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">
            Showing <span className="text-orange-400">{filteredProducts.length}</span> Products
          </span>
          {searchQuery && (
            <span className="flex items-center gap-1 rounded-lg bg-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-400">
              Keyword: "{searchQuery}"
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-1 hover:text-white"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {/* Right: Quick Toggles and Sorters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Free Shipping Toggle */}
          <button
            type="button"
            onClick={() => setFreeShippingOnly(!freeShippingOnly)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-bold transition-all ${
              freeShippingOnly
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            Free Delivery
            {freeShippingOnly && <Check className="h-3.5 w-3.5" />}
          </button>

          {/* In Stock Only Toggle */}
          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-bold transition-all ${
              inStockOnly
                ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            In Stock
            {inStockOnly && <Check className="h-3.5 w-3.5" />}
          </button>

          {/* Merchant Filter */}
          <div className="flex items-center gap-1 bg-slate-950 rounded-xl border border-slate-800 px-2.5 py-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedMerchant}
              onChange={(e) => setSelectedMerchant(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            >
              <option value="">All Merchants</option>
              {merchants.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1 bg-slate-950 rounded-xl border border-slate-800 px-2.5 py-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="best-selling">Sort: Best Selling 🔥</option>
              <option value="rating">Sort: Highest Rated ★</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-orange-400" />
          <h3 className="text-lg font-bold text-white">No products found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No products match the selected filters or search terms. Try clearing your filters or changing categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
              setSelectedMerchant('');
              setFreeShippingOnly(false);
              setInStockOnly(false);
            }}
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
}
