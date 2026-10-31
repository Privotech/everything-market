import React, { useState } from 'react';
import { CatalogProduct, CatalogVariant } from '@/modules/catalog/types.ts';
import { formatMoney, calculateDiscountPercent } from '@/lib/money.ts';
import { ShieldCheck, Check, AlertCircle, Box } from 'lucide-react';

interface ProductCardProps {
  product: CatalogProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );

  const selectedVariant: CatalogVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const priceCents = selectedVariant?.priceCents ?? product.basePriceCents;
  const compareAtPriceCents = selectedVariant?.compareAtPriceCents;
  const discountPercent = calculateDiscountPercent(priceCents, compareAtPriceCents);
  const availableStock = selectedVariant?.availableStock ?? 0;

  // Determine stock visual status
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;

  const thumbnail = product.images.find((img) => img.isThumbnail) || product.images[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
        {thumbnail ? (
          <img
            src={thumbnail.url}
            alt={thumbnail.altText || product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-700">
            <Box className="h-12 w-12" />
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-bold text-slate-950 shadow">
            SAVE {discountPercent}%
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 rounded-md bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-800">
          {product.category.name}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        {/* Merchant & Brand */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">{product.brand || 'Original Brand'}</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            {product.seller.storeName}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.fullDescription}
          </p>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Select Variant ({product.variants.length} available):
            </label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} — {formatMoney(v.priceCents, product.currency)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pricing & Stock Status (Strict integer-cents calculation) */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-white">
                {formatMoney(priceCents, product.currency)}
              </span>
              {compareAtPriceCents && compareAtPriceCents > priceCents && (
                <span className="text-xs text-slate-500 line-through">
                  {formatMoney(compareAtPriceCents, product.currency)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500">
              SKU: {selectedVariant?.sku}
            </span>
          </div>

          {/* Stock Indicator */}
          <div>
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-3 w-3" />
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
                <AlertCircle className="h-3 w-3" />
                Only {availableStock} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                <Check className="h-3 w-3" />
                {availableStock} in Stock
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Intent Button (Phase 3 Hook) */}
        <button
          type="button"
          disabled={isOutOfStock}
          className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isOutOfStock ? 'Sold Out' : 'Select & Add to Cart'}
        </button>
      </div>
    </div>
  );
}
