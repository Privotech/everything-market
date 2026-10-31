import React, { useState } from 'react';
import { Boxes, Building2, CheckCircle2, ShoppingCart, Calculator, ArrowRight } from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { formatMoney } from '@/lib/money.ts';

export default function WholesaleSection() {
  const { products, addToCart, setActiveProductModal, currency } = useMarketplace();
  const wholesaleProducts = products.filter((p) => p.isWholesale || p.wholesaleTiers?.length);

  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>({
    'prd_gan_charger_bulk': 25,
  });

  const handleQtyChange = (productId: string, val: number) => {
    setBulkQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, val),
    }));
  };

  return (
    <section className="rounded-3xl border border-amber-900/40 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/40 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 shadow-lg shadow-amber-500/30">
            <Boxes className="h-6 w-6 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                🏭 Alibaba B2B Wholesale & Factory Direct Hub
              </h2>
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-black uppercase text-slate-950">
                OEM / ODM VERIFIED
              </span>
            </div>
            <p className="text-xs text-amber-300 font-medium">
              Source direct from certified manufacturing plants. Low MOQs, volume tiered pricing, and freight delivery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 px-4 py-2 rounded-2xl border border-amber-900/50">
          <Building2 className="h-4 w-4 text-amber-400" />
          <span>Gold Verified Suppliers: <strong>100% On-Time Delivery Guarantee</strong></span>
        </div>
      </div>

      {/* Wholesale Items List with Tiered Pricing Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {wholesaleProducts.map((product) => {
          const qty = bulkQuantities[product.id] || product.moq || 10;
          const variant = product.variants[0];

          // Determine current tier price based on bulk quantity
          let activeUnitCents = variant.priceCents;
          let activeDiscount = 0;
          if (product.wholesaleTiers) {
            for (const tier of product.wholesaleTiers) {
              if (qty >= tier.minQty) {
                activeUnitCents = tier.priceCents;
                activeDiscount = tier.discountPercent;
              }
            }
          }
          const totalBulkCents = activeUnitCents * qty;

          return (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-amber-900/30 bg-slate-900/90 hover:border-amber-500/50 transition-all shadow-lg"
            >
              {/* Product Thumbnail */}
              <div className="relative sm:w-52 aspect-square sm:aspect-auto overflow-hidden bg-slate-950 shrink-0">
                <img
                  src={product.images[0]?.url}
                  alt={product.title}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute top-2 left-2 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950">
                  MOQ: {product.moq || 2} PCS
                </div>
              </div>

              {/* Wholesale Spec & Tier Table */}
              <div className="flex flex-1 flex-col p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {product.seller.storeName}
                  </div>
                  <h3
                    onClick={() => setActiveProductModal(product)}
                    className="cursor-pointer text-base font-bold text-white hover:text-amber-300 transition-colors line-clamp-1"
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Tier Pricing Cards */}
                {product.wholesaleTiers && (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {product.wholesaleTiers.slice(0, 3).map((tier, idx) => {
                      const isCurrentTier = qty >= tier.minQty;
                      return (
                        <div
                          key={idx}
                          className={`rounded-xl border p-2 transition-all ${
                            isCurrentTier
                              ? 'border-amber-500 bg-amber-500/10 text-white'
                              : 'border-slate-800 bg-slate-950 text-slate-400'
                          }`}
                        >
                          <div className="font-extrabold text-amber-400">
                            {formatMoney(tier.priceCents, currency)}
                          </div>
                          <div className="text-[10px]">{tier.minQty}+ pcs</div>
                          {tier.discountPercent > 0 && (
                            <span className="text-[9px] font-bold text-emerald-400">
                              -{tier.discountPercent}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Live Bulk Price Simulator */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calculator className="h-3.5 w-3.5 text-amber-400" />
                      Bulk Order Calculator:
                    </span>
                    <span className="text-amber-400 font-bold">
                      Unit: {formatMoney(activeUnitCents, currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400">Qty:</label>
                      <input
                        type="number"
                        min={product.moq || 2}
                        value={qty}
                        onChange={(e) => handleQtyChange(product.id, parseInt(e.target.value) || 1)}
                        className="w-20 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Estimated Total:</div>
                      <div className="text-base font-black text-white">
                        {formatMoney(totalBulkCents, currency)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wholesale Action Buttons */}
                <div className="flex items-center gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => addToCart(product, variant, qty)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-400 active:scale-95 transition-all"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Order {qty} Units
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveProductModal(product)}
                    className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Details <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
