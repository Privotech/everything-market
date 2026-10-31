import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Heart,
  Boxes,
  Check,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { formatMoney, calculateDiscountPercent } from '@/lib/money.ts';
import { CatalogVariant } from '@/modules/catalog/types.ts';

export default function ProductDetailModal() {
  const {
    activeProductModal,
    setActiveProductModal,
    addToCart,
    toggleWishlist,
    isInWishlist,
    currency,
    setIsCheckoutOpen,
  } = useMarketplace();

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(product.moq || 1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [addedNotice, setAddedNotice] = useState(false);

  const selectedVariant: CatalogVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  // Check wholesale tier pricing based on chosen quantity
  let unitPriceCents = selectedVariant.priceCents;
  let activeDiscountPercent = 0;
  if (product.isWholesale && product.wholesaleTiers) {
    for (const tier of product.wholesaleTiers) {
      if (quantity >= tier.minQty) {
        unitPriceCents = tier.priceCents;
        activeDiscountPercent = tier.discountPercent;
      }
    }
  }

  const compareAtPriceCents = selectedVariant.compareAtPriceCents;
  const discountPercent = calculateDiscountPercent(unitPriceCents, compareAtPriceCents);
  const lineTotalCents = unitPriceCents * quantity;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setActiveProductModal(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 p-6 sm:p-8 space-y-8 scrollbar-thin">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setActiveProductModal(null)}
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Product Hero: Gallery + Purchasing Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
              <img
                src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 rounded-xl bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-lg">
                  SAVE {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-orange-500 scale-105'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="Thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 p-3 border border-slate-800">
                <Truck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Express Delivery in 2-4 days</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 p-3 border border-slate-800">
                <RotateCcw className="h-4 w-4 text-orange-400 shrink-0" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right: Buy Box & Options */}
          <div className="flex flex-col space-y-5">
            {/* Brand, Title & Social Proof */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  {product.brand}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {product.seller.storeName}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {product.title}
              </h2>

              <div className="flex items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">
                    ({product.reviewCount} customer reviews)
                  </span>
                </div>
                <span className="text-slate-600">|</span>
                <span className="text-orange-400 font-semibold">
                  🔥 {product.soldCount.toLocaleString()} orders completed
                </span>
              </div>
            </div>

            {/* Price Header */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  {formatMoney(unitPriceCents, currency)}
                </span>
                {compareAtPriceCents && (
                  <span className="text-base text-slate-500 line-through">
                    {formatMoney(compareAtPriceCents, currency)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="rounded-lg bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-400">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                Tax included where applicable • Server-verified minor unit pricing
              </div>
            </div>

            {/* Wholesale Tiers (if applicable) */}
            {product.wholesaleTiers && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Boxes className="h-3.5 w-3.5" />
                  Alibaba B2B Volume Pricing Tiers:
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {product.wholesaleTiers.map((t, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl border p-2 text-center ${
                        quantity >= t.minQty
                          ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <div className="text-amber-400">{formatMoney(t.priceCents, currency)}</div>
                      <div className="text-[10px]">{t.minQty}+ units</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selector */}
            {product.variants.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Model / Variant:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`flex flex-col text-left rounded-xl p-3 border transition-all text-xs ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/10 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{v.title}</span>
                        <span className="text-[11px] text-orange-400 mt-1">
                          {formatMoney(v.priceCents, currency)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Live Subtotal */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-300">Quantity:</label>
                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(product.moq || 1, q - 1))}
                    className="px-3 py-1.5 text-base font-bold text-slate-300 hover:text-white"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-base font-bold text-slate-300 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">Total Price:</div>
                <div className="text-lg font-black text-white">
                  {formatMoney(lineTotalCents, currency)}
                </div>
              </div>
            </div>

            {/* Add to Cart & Buy Now Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black shadow-lg transition-all ${
                  addedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="h-4 w-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-xs font-black text-slate-950 shadow-lg hover:from-amber-400 hover:to-orange-400 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4" /> Buy Now (Instant)
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-slate-300 hover:text-rose-400 transition-colors"
                title="Save to Wishlist"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Overview, Specs Sheet, Verified Customer Reviews */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-2 text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('desc')}
              className={`pb-2 transition-colors ${
                activeTab === 'desc'
                  ? 'border-b-2 border-orange-500 text-orange-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Product Description
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-2 transition-colors ${
                activeTab === 'specs'
                  ? 'border-b-2 border-orange-500 text-orange-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Specifications Sheet
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-orange-500 text-orange-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Verified Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {/* Description Tab */}
          {activeTab === 'desc' && (
            <div className="text-xs text-slate-300 leading-relaxed space-y-3">
              <p>{product.fullDescription}</p>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <span className="font-bold text-white text-xs">Verified Supplier Credentials:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
                  <div>Store: <strong className="text-white">{product.seller.storeName}</strong></div>
                  <div>Rating: <strong className="text-amber-400">{product.seller.rating || 4.9} ★</strong></div>
                  <div>Response Rate: <strong className="text-emerald-400">{product.seller.responseRate || '99%'}</strong></div>
                  <div>Years Active: <strong className="text-white">{product.seller.yearsActive || 3} Years</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Specs Sheet Tab */}
          {activeTab === 'specs' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody>
                  {product.specifications &&
                    Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-transparent'}
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-400 w-1/3 border-b border-slate-800/60">
                          {key}
                        </td>
                        <td className="py-2.5 px-4 text-white border-b border-slate-800/60">
                          {val}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-400">Brand / OEM</td>
                    <td className="py-2.5 px-4 text-white">{product.brand || 'Original Brand'}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-400">SKU Prefix</td>
                    <td className="py-2.5 px-4 text-white font-mono">{product.skuPrefix || selectedVariant.sku}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Customer Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{rev.author}</span>
                        {rev.verifiedBuyer && (
                          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[10px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <h4 className="font-bold text-white text-xs">{rev.title}</h4>
                    <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  Be the first to review this verified product!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
