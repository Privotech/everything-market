import React, { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  Check,
  Eye,
  ShieldCheck,
  Flame,
  Truck,
} from 'lucide-react';
import { CatalogProduct, CatalogVariant } from '@/modules/catalog/types.ts';
import { formatMoney, calculateDiscountPercent } from '@/lib/money.ts';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';

interface ProductCardProps {
  product: CatalogProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, setActiveProductModal, currency } = useMarketplace();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant: CatalogVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const priceCents = selectedVariant?.priceCents ?? product.basePriceCents;
  const compareAtPriceCents = selectedVariant?.compareAtPriceCents;
  const discountPercent = calculateDiscountPercent(priceCents, compareAtPriceCents);
  const availableStock = selectedVariant?.availableStock ?? 50;

  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;
  const isWishlisted = isInWishlist(product.id);

  const thumbnail = product.images.find((img) => img.isThumbnail) || product.images[0];

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
        <img
          src={thumbnail?.url}
          alt={thumbnail?.altText || product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {discountPercent > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-black text-white shadow-md">
              <Flame className="h-3 w-3 fill-amber-300 text-amber-300" />
              -{discountPercent}%
            </div>
          )}
          {product.isFlashDeal && (
            <div className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950 shadow-md">
              ⚡ FLASH DROP
            </div>
          )}
          {product.freeShipping && (
            <div className="rounded-md bg-emerald-600/90 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm flex items-center gap-1">
              <Truck className="h-2.5 w-2.5" /> FREE DELIVERY
            </div>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 backdrop-blur-md text-white hover:text-rose-400 hover:bg-slate-900 transition-all z-10"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button (Hover reveal) */}
        <button
          type="button"
          onClick={() => setActiveProductModal(product)}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 z-10"
        >
          <Eye className="h-3.5 w-3.5" /> Quick View
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-4 space-y-3">
        {/* Brand & Ratings */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-400 truncate max-w-[120px]">
            {product.brand || 'Official Store'}
          </span>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-[10px] text-slate-500 font-normal">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => setActiveProductModal(product)}
          className="cursor-pointer text-sm font-bold text-white line-clamp-2 hover:text-orange-400 transition-colors leading-snug"
        >
          {product.title}
        </h3>

        {/* Sold Count & Verified Supplier */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="text-orange-400 font-medium">
            🔥 {product.soldCount.toLocaleString()} sold
          </span>
          <span className="flex items-center gap-1 text-emerald-400 truncate">
            <ShieldCheck className="h-3 w-3" />
            {product.seller.storeName}
          </span>
        </div>

        {/* Variant Picker (if multiple variants exist) */}
        {product.variants.length > 1 && (
          <div className="pt-1">
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] font-medium text-slate-300 focus:border-orange-500 focus:outline-none"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pricing in Real-Time Converted Currency */}
        <div className="mt-auto pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-white">
              {formatMoney(priceCents, currency)}
            </span>
            {compareAtPriceCents && compareAtPriceCents > priceCents && (
              <span className="text-xs text-slate-500 line-through">
                {formatMoney(compareAtPriceCents, currency)}
              </span>
            )}
          </div>

          {/* Stock Tag */}
          <div>
            {isOutOfStock ? (
              <span className="text-[10px] font-bold text-rose-400">Sold Out</span>
            ) : isLowStock ? (
              <span className="text-[10px] font-bold text-amber-400">Only {availableStock} left!</span>
            ) : (
              <span className="text-[10px] font-medium text-emerald-400">In Stock</span>
            )}
          </div>
        </div>

        {/* Instant Add to Cart Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all shadow-md ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> Added to Cart!
            </>
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
