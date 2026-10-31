import React, { useState, useEffect } from 'react';
import { Zap, Flame, Clock, ShoppingCart, Eye } from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { formatMoney, calculateDiscountPercent } from '@/lib/money.ts';
import { CatalogProduct } from '@/modules/catalog/types.ts';

export default function FlashDealsSection() {
  const { products, addToCart, setActiveProductModal, currency } = useMarketplace();

  // Ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashDeal || p.flashDiscountPercent);

  if (flashProducts.length === 0) return null;

  return (
    <section className="rounded-3xl border border-rose-900/40 bg-gradient-to-b from-rose-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Flash Header & Live Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-900/40 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 shadow-lg shadow-rose-500/30 animate-pulse">
            <Zap className="h-6 w-6 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                ⚡ Flash Drops & Lightning Deals
              </h2>
              <span className="rounded-md bg-rose-500 px-2 py-0.5 text-xs font-black uppercase text-white tracking-wider">
                TEMU / JUMIA SPECIAL
              </span>
            </div>
            <p className="text-xs text-rose-300 font-medium">
              Limited-time inventory allocations at factory direct price drops. Sells out fast!
            </p>
          </div>
        </div>

        {/* Countdown Timer Badges */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-rose-900/50">
          <Clock className="h-4 w-4 text-rose-400" />
          <span className="text-xs font-bold text-slate-400">Ends in:</span>
          <div className="flex items-center gap-1 font-mono font-black text-sm text-white">
            <span className="rounded-md bg-rose-600 px-2 py-1 shadow">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="rounded-md bg-rose-600 px-2 py-1 shadow">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="rounded-md bg-rose-600 px-2 py-1 shadow">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Flash Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {flashProducts.map((product) => {
          const variant = product.variants[0];
          const priceCents = variant?.priceCents || product.basePriceCents;
          const compareAtPriceCents = variant?.compareAtPriceCents;
          const discount = calculateDiscountPercent(priceCents, compareAtPriceCents);
          const percentClaimed = Math.min(94, 65 + (product.title.length % 28));

          return (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-rose-900/30 bg-slate-900 hover:border-rose-500/60 transition-all hover:shadow-xl hover:shadow-rose-500/10"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                <img
                  src={product.images[0]?.url}
                  alt={product.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Slashed Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-black text-white shadow-md">
                    <Flame className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    SAVE {discount}%
                  </div>
                )}

                {/* Quick View Button on Image */}
                <button
                  type="button"
                  onClick={() => setActiveProductModal(product)}
                  className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Quick View"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    {product.brand}
                  </span>
                  <h3
                    onClick={() => setActiveProductModal(product)}
                    className="cursor-pointer text-sm font-bold text-white line-clamp-1 hover:text-rose-300 transition-colors"
                  >
                    {product.title}
                  </h3>
                </div>

                {/* Pricing in Chosen Currency */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-rose-400">
                    {formatMoney(priceCents, currency)}
                  </span>
                  {compareAtPriceCents && (
                    <span className="text-xs text-slate-500 line-through font-medium">
                      {formatMoney(compareAtPriceCents, currency)}
                    </span>
                  )}
                </div>

                {/* Progress Bar (Temu / Jumia Lightning Claimed Bar) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-rose-400 flex items-center gap-1">
                      <Flame className="h-3 w-3 fill-rose-500 text-rose-500" />
                      {percentClaimed}% Claimed
                    </span>
                    <span className="text-slate-400">
                      {variant.availableStock ? `Only ${variant.availableStock} left` : 'Few left'}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-500"
                      style={{ width: `${percentClaimed}%` }}
                    />
                  </div>
                </div>

                {/* Fast Action: Instant Add to Cart */}
                <button
                  type="button"
                  onClick={() => addToCart(product, variant, 1)}
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 py-2.5 text-xs font-black text-white shadow-md hover:from-rose-500 hover:to-orange-500 active:scale-95 transition-all"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Grab Flash Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
