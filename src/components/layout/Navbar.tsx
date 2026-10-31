import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  ShieldCheck,
  Store,
  Layers,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Bar: Governance & Compliance Banner */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Merchant Network
            </span>
            <span className="text-slate-600">|</span>
            <span>Permitted Goods Compliance Enforced</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-200 transition-colors">Phase 1 & 2 Foundation</span>
            <span>PostgreSQL + Prisma ORM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Everything Market
              <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                PROD-READY
              </span>
            </span>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Modular-Monolith Multi-Vendor Platform
            </p>
          </div>
        </a>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search compliant catalog (SKU, brand, category)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Quick Nav & Badges */}
        <div className="flex items-center gap-3">
          <a
            href="#architecture"
            className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            Architecture & Specs
          </a>

          <a
            href="#catalog"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Live Catalog
          </a>

          {/* Cart Icon */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            aria-label="View Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              0
            </span>
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>
          <div className="flex flex-col gap-2 pt-2 text-sm text-slate-300">
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1.5 hover:text-indigo-400"
            >
              <Layers className="h-4 w-4 text-indigo-400" />
              Architecture & Database Specs
            </a>
            <a
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1.5 hover:text-emerald-400"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Permitted Products Catalog
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
