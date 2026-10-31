import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  Check,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { formatMoney } from '@/lib/money.ts';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartTotalCount,
    cartSubtotalCents,
    cartShippingCents,
    cartDiscountCents,
    cartTaxCents,
    cartFinalTotalCents,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    currency,
    setIsCheckoutOpen,
  } = useMarketplace();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  // Free shipping threshold: $35.00 (3500 cents)
  const freeShippingThresholdCents = 3500;
  const freeShippingRemainingCents = Math.max(0, freeShippingThresholdCents - cartSubtotalCents);
  const freeShippingPercent = Math.min(
    100,
    Math.round((cartSubtotalCents / freeShippingThresholdCents) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-orange-400" />
              <h2 className="text-base font-bold text-white">
                Your Shopping Cart ({cartTotalCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Truck className="h-4 w-4 text-emerald-400" />
                {freeShippingRemainingCents === 0 ? (
                  <span className="text-emerald-400 font-bold">
                    🎉 You unlocked FREE Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatMoney(freeShippingRemainingCents, currency)}</strong> more for FREE Shipping!
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-slate-400">{freeShippingPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-800/60">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.title}
                    className="h-20 w-20 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white line-clamp-2">
                          {item.product.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.variant.title}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="font-bold text-sm text-white">
                        {formatMoney(item.unitPriceCents * item.quantity, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <ShoppingBag className="h-12 w-12 text-slate-600" />
                <div className="text-sm font-bold text-white">Your cart is empty</div>
                <p className="text-xs text-slate-400 max-w-xs">
                  Browse our multi-vendor flash drops, wholesale lots, or search 10,000+ items to add products.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Cart Footer & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-slate-800 bg-slate-950 p-5 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. JUMIA20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs uppercase text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-900/40">
                    <span className="flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Applied: <strong>{appliedCoupon.code}</strong> ({appliedCoupon.description})
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <div className="text-[11px] text-rose-400">{couponError}</div>
                )}
              </form>

              {/* Price Breakdown (Strict Integer Cents) */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatMoney(cartSubtotalCents, currency)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="font-medium text-white">
                    {cartShippingCents === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatMoney(cartShippingCents, currency)
                    )}
                  </span>
                </div>

                {cartDiscountCents > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Discount</span>
                    <span>-{formatMoney(cartDiscountCents, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Estimated Sales Tax (8.25%)</span>
                  <span className="text-white font-medium">{formatMoney(cartTaxCents, currency)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-orange-400">{formatMoney(cartFinalTotalCents, currency)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-xs font-black text-white shadow-xl shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted Checkout & Buyer Protection</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
