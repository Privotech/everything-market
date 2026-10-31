import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Zap,
  Boxes,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';

const BANNERS = [
  {
    id: 1,
    tag: '⚡ JUMIA GLOBAL MEGA SALE',
    headline: 'Mega Tech & Audio Festival',
    subheadline: 'Up to 70% off Planar Magnetic Audio, 4K Camera Drones, and GaN Power Accessories.',
    ctaText: 'Shop Tech Deals',
    tab: 'shop' as const,
    bgGradient: 'from-orange-600 via-amber-600 to-rose-700',
    badge: 'FREE DELIVERY OVER $35',
  },
  {
    id: 2,
    tag: '🏭 ALIBABA WHOLESALE B2B HUB',
    headline: 'Factory Direct Volume Pricing',
    subheadline: 'Direct from verified OEM manufacturers. Tiered discounts up to 48% off with low MOQ.',
    ctaText: 'Explore Wholesale Lots',
    tab: 'wholesale' as const,
    bgGradient: 'from-amber-600 via-yellow-600 to-orange-700',
    badge: 'VERIFIED GOLD SUPPLIERS',
  },
  {
    id: 3,
    tag: '🔥 TEMU LIGHTNING DEALS',
    headline: 'Crazy Under $25 Price Drops',
    subheadline: 'Active noise cancelling buds, tactical stainless flasks, and thermal base layers.',
    ctaText: 'Grab Bargains',
    tab: 'under25' as const,
    bgGradient: 'from-rose-600 via-pink-600 to-purple-700',
    badge: 'FLASH COUNTDOWN LIVE',
  },
];

export default function HeroSection() {
  const { setActiveTab, applyCoupon } = useMarketplace();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentSlide];

  const handleCopyCoupon = (code: string) => {
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Animated Carousel Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${banner.bgGradient} p-6 sm:p-10 text-white shadow-2xl transition-all duration-700`}>
        {/* Glow & Backdrop patterns */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-black/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/30 backdrop-blur-md px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300 border border-white/20">
                <Sparkles className="h-3.5 w-3.5" />
                {banner.tag}
              </span>
              <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                {banner.badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
              {banner.headline}
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
              {banner.subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab(banner.tab)}
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-xl hover:bg-amber-100 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="h-4 w-4 text-orange-600" />
                {banner.ctaText}
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('flash')}
                className="flex items-center gap-1.5 rounded-xl border border-white/40 bg-black/20 backdrop-blur-md px-4 py-3.5 text-sm font-bold text-white hover:bg-black/30 transition-all"
              >
                <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
                View 24h Drops
              </button>
            </div>
          </div>

          {/* Quick Click-to-Apply Coupons Box */}
          <div className="w-full md:w-80 rounded-2xl border border-white/20 bg-black/30 backdrop-blur-md p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                Live Coupons
              </span>
              <span className="text-[10px] text-white/70">Click to auto-apply</span>
            </div>

            <div className="space-y-2">
              {[
                { code: 'JUMIA20', desc: '20% OFF Everything' },
                { code: 'TEMU10', desc: '$10 OFF on $30+' },
                { code: 'ALIBABA50', desc: '$50 OFF Wholesale ($150+)' },
              ].map((c) => {
                const isCopied = copiedCode === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCopyCoupon(c.code)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs hover:bg-white/20 transition-all text-left"
                  >
                    <div>
                      <span className="font-mono font-black text-amber-300">{c.code}</span>
                      <p className="text-[10px] text-white/80">{c.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-white">
                      {isCopied ? (
                        <span className="text-emerald-300 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Applied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-white/80">
                          <Copy className="h-3.5 w-3.5" /> Apply
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next & Dots */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Value Proposition Pills (Amazon / Jumia / Alibaba service guarantees) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-white">Free Worldwide Delivery</div>
            <div className="text-[11px] text-slate-400">On all qualifying orders over $35</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-white">100% Buyer Protection</div>
            <div className="text-[11px] text-slate-400">Full refund if item not as described</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-white">Factory Direct Sourcing</div>
            <div className="text-[11px] text-slate-400">Alibaba OEM prices with low MOQs</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-white">30-Day Hassle-Free Returns</div>
            <div className="text-[11px] text-slate-400">Instant label generation & pickup</div>
          </div>
        </div>
      </div>
    </div>
  );
}
