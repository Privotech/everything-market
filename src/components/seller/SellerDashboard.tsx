import React, { useState } from 'react';
import {
  Store,
  DollarSign,
  Package,
  TrendingUp,
  Star,
  Plus,
  Check,
  Edit2,
  Box,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { formatMoney, dollarsToCents } from '@/lib/money.ts';

export default function SellerDashboard() {
  const { products, addNewProduct, updateProductStock, categories, currency, setActiveTab } =
    useMarketplace();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(categories[1]?.id || 'cat_electronics');
  const [newPrice, setNewPrice] = useState('39.99');
  const [newBrand, setNewBrand] = useState('Apex OEM');
  const [newStock, setNewStock] = useState('75');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'
  );
  const [newDesc, setNewDesc] = useState('High-performance factory direct hardware item.');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === newCategory) || categories[1];

    addNewProduct({
      title: newTitle,
      shortDescription: newDesc,
      fullDescription: newDesc,
      basePriceCents: dollarsToCents(newPrice),
      brand: newBrand,
      category: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      },
      images: [
        {
          id: `img_${Date.now()}`,
          url: newImageUrl,
          altText: newTitle,
          displayOrder: 1,
          isThumbnail: true,
        },
      ],
    });

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setShowAddForm(false);
      setNewTitle('');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Seller Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-600/30">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                💼 Merchant & Seller Center Portal
              </h2>
              <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-xs font-black text-purple-300 border border-purple-500/30">
                VERIFIED GOLD VENDOR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage multi-vendor storefront catalog, inventory allocation, and factory listings.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-purple-500 transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Close Form' : 'Publish New Product'}
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Today's Payout Volume</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {formatMoney(482000, currency)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +18.4% from last week
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Active Products</span>
            <Box className="h-4 w-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white">{products.length} Items</div>
          <div className="text-[11px] text-slate-400">Across 6 Global Categories</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Orders Dispatched</span>
            <Package className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">1,420</div>
          <div className="text-[11px] text-emerald-400">99.8% on-time delivery</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Supplier Rating</span>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">4.9 / 5.0</div>
          <div className="text-[11px] text-slate-400">Based on 12,400+ reviews</div>
        </div>
      </div>

      {/* Add New Product Form Modal/Panel */}
      {showAddForm && (
        <form
          onSubmit={handleCreateProduct}
          className="rounded-3xl border border-purple-500/40 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-400" />
              Publish Item to Everything Market
            </h3>
            <span className="text-xs text-purple-300">Live instantly to shoppers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-300">Product Title</label>
              <input
                type="text"
                required
                placeholder="e.g. UltraGlide Ergonomic Wireless Mouse 4000 DPI"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Base Price (USD $)</label>
              <input
                type="number"
                step="0.01"
                min="0.50"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Brand Name</label>
              <input
                type="text"
                required
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Initial Stock Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="font-bold text-slate-300">Image URL</label>
              <input
                type="url"
                required
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="font-bold text-slate-300">Description</label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-purple-500"
            >
              {publishSuccess ? (
                <>
                  <Check className="h-4 w-4" /> Published!
                </>
              ) : (
                'Confirm & Publish to Catalog'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Inventory & Product Catalog Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl space-y-4">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Warehouse Stock & Inventory Manager
            </h3>
            <p className="text-xs text-slate-400">
              Live updates directly sync with customer checkout carts and inventory reservation locks.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock on Hand</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {products.map((p) => {
                const variant = p.variants[0];
                const stock = variant?.availableStock ?? 50;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img
                        src={p.images[0]?.url}
                        alt={p.title}
                        className="h-10 w-10 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white line-clamp-1">{p.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          SKU: {variant?.sku}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {p.category.name}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {formatMoney(variant?.priceCents || p.basePriceCents, currency)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={stock}
                          onChange={(e) =>
                            updateProductStock(p.id, variant.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-400">units</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {stock > 5 ? (
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      ) : stock > 0 ? (
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                          Low Stock
                        </span>
                      ) : (
                        <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('shop');
                        }}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300"
                      >
                        View in Store
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
