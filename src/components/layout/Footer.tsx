import React from 'react';
import {
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  PhoneCall,
  Mail,
  Lock,
  Globe,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';

export default function Footer() {
  const { setActiveTab } = useMarketplace();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      {/* Top Value Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">Global Express Freight</div>
              <div className="text-[11px] text-slate-400">Door-to-door delivery worldwide</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">100% Secure Payment</div>
              <div className="text-[11px] text-slate-400">Card, COD & Mobile Money</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">30-Day Money Back</div>
              <div className="text-[11px] text-slate-400">Zero hassle return policy</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">24/7 Dedicated Support</div>
              <div className="text-[11px] text-slate-400">Live chat & dispute center</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-sm">
                EM
              </div>
              <span className="text-lg font-black text-white">
                Everything<span className="text-orange-400">Market</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              The full-scale multi-vendor e-commerce marketplace combining Jumia consumer retail,
              Temu lightning price drops, and Alibaba factory-direct wholesale sourcing with strict integer pricing security.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-300">
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                PCI-DSS Level 1 Compliant
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-orange-400" />
                Global Multi-Currency
              </span>
            </div>
          </div>

          {/* Column 2: Shopping Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('flash')}
                  className="hover:text-orange-400 transition-colors"
                >
                  ⚡ Flash Sales
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('wholesale')}
                  className="hover:text-amber-400 transition-colors"
                >
                  🏭 Alibaba Wholesale
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('under25')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  💰 Under $25 Deals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-white transition-colors"
                >
                  🎧 Audio & Gadgets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-white transition-colors"
                >
                  ☕ Kitchenware & Brew
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="hover:text-white transition-colors"
                >
                  📦 Track Your Order
                </button>
              </li>
              <li>
                <a href="#shipping" className="hover:text-white transition-colors">
                  Shipping Rates & Policies
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-white transition-colors">
                  Refund & Return Request
                </a>
              </li>
              <li>
                <a href="#protection" className="hover:text-white transition-colors">
                  Buyer Protection Program
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-white transition-colors">
                  Help Center & FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Sell & Wholesale */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Sell on Everything Market
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('seller')}
                  className="font-bold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  💼 Merchant Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('seller')}
                  className="hover:text-white transition-colors"
                >
                  Publish New Listing
                </button>
              </li>
              <li>
                <a href="#verified" className="hover:text-white transition-colors">
                  Vendor Verification (KYC)
                </a>
              </li>
              <li>
                <a href="#rates" className="hover:text-white transition-colors">
                  Commission Rates (6-12%)
                </a>
              </li>
              <li>
                <a href="#bulk" className="hover:text-white transition-colors">
                  Factory Direct OEM Program
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Everything Market Inc. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-1 font-mono text-[10px] text-slate-400">
              VISA
            </span>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-1 font-mono text-[10px] text-slate-400">
              MASTERCARD
            </span>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-1 font-mono text-[10px] text-slate-400">
              OPAY
            </span>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-1 font-mono text-[10px] text-slate-400">
              M-PESA
            </span>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-1 font-mono text-[10px] text-slate-400">
              APPLE PAY
            </span>
            <span className="rounded bg-slate-900 border border-slate-800 px-2 py-1 font-mono text-[10px] text-emerald-400 font-bold">
              CASH ON DELIVERY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
