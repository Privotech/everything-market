import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { formatMoney } from '@/lib/money.ts';

export default function WishlistModal() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    currency,
  } = useMarketplace();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl p-6 text-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            <h2 className="text-lg font-bold text-white">
              My Saved Wishlist ({wishlistedProducts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="space-y-3 divide-y divide-slate-800">
            {wishlistedProducts.map((p) => {
              const variant = p.variants[0];
              const priceCents = variant.priceCents;

              return (
                <div key={p.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]?.url}
                      alt={p.title}
                      className="h-16 w-16 rounded-xl object-cover bg-slate-950 border border-slate-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{p.title}</h4>
                      <div className="text-[11px] text-slate-400">{p.brand}</div>
                      <div className="text-sm font-black text-white mt-1">
                        {formatMoney(priceCents, currency)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addToCart(p, variant, 1)}
                      className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Heart className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="text-sm font-bold text-white">Your wishlist is empty</h3>
            <p className="text-xs text-slate-400">
              Tap the heart icon on any product to save items for later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
