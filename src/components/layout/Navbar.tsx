import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Zap,
  Boxes,
  Tag,
  Package,
  Store,
  Heart,
  MapPin,
  ChevronDown,
  Globe,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { SupportedCurrency, formatMoney } from '@/lib/money.ts';

const LOCATIONS = [
  'New York, USA',
  'Lagos, Nigeria',
  'Nairobi, Kenya',
  'London, United Kingdom',
  'Frankfurt, Germany',
  'Dubai, UAE',
];

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    cartTotalCount,
    cartSubtotalCents,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    currency,
    setCurrency,
    deliveryLocation,
    setDeliveryLocation,
  } = useMarketplace();

  const [locationDropdown, setLocationDropdown] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-slate-950 border-b border-slate-800">
      {/* Top Banner (Jumia / Temu / Alibaba Flash Sales Bar) */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-4 py-1.5 text-xs text-white font-medium">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1 rounded bg-black/20 px-1.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              <Zap className="h-3 w-3 fill-amber-300 text-amber-300" />
              Flash Sale
            </span>
            <span>Up to 70% Off Electronics & Gear! Free Worldwide Shipping on orders over $35</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs">
            {/* Delivery Location Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationDropdown(!locationDropdown)}
                className="flex items-center gap-1 hover:text-amber-200 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Deliver to: <strong>{deliveryLocation}</strong></span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {locationDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900 py-1.5 shadow-2xl z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Destination
                  </div>
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setDeliveryLocation(loc);
                        setLocationDropdown(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-800 ${
                        deliveryLocation === loc ? 'text-amber-400 font-bold' : 'text-slate-200'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1 rounded bg-black/25 px-2 py-0.5 hover:bg-black/40 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {currencyDropdown && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-2xl z-50">
                  {(['USD', 'EUR', 'NGN', 'KES', 'GBP'] as SupportedCurrency[]).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => {
                        setCurrency(curr);
                        setCurrencyDropdown(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-800 ${
                        currency === curr ? 'text-amber-400 font-bold' : 'text-slate-200'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="flex items-center gap-1 text-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Buyer Protection
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav (Search, Brand, Actions) */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('shop');
            setSelectedCategory(null);
            setSearchQuery('');
          }}
          className="flex items-center gap-2 group text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                Everything<span className="text-orange-400">Market</span>
              </span>
              <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-orange-400 border border-orange-500/30">
                GLOBAL
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 hidden sm:block">
              Jumia • Temu • Alibaba Mega-Commerce
            </p>
          </div>
        </button>

        {/* Global Mega Search Bar */}
        <div className="flex flex-1 max-w-2xl mx-2">
          <div className="relative flex w-full items-center rounded-xl border border-slate-700 bg-slate-900 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
            {/* Category Filter selector in Search */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="hidden lg:block h-full rounded-l-xl border-r border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search 10,000+ items, wireless earbuds, GaN chargers, titanium gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2.5 pl-4 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-r-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Action Buttons: Wishlist, Cart, Seller Hub */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-rose-400 transition-colors"
            title="Wishlist"
          >
            <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button with Live Subtotal */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-orange-600">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] uppercase font-normal text-orange-100">Cart</span>
              <span className="font-extrabold">{formatMoney(cartSubtotalCents, currency)}</span>
            </div>
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Secondary E-Commerce Navigation Bar (Jumia & Alibaba Style Tabs) */}
      <div className="border-t border-slate-800/80 bg-slate-900/90 px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('shop');
                setSelectedCategory(null);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'shop'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              🛒 Shop All
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flash')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'flash'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              ⚡ Flash Deals (Temu Drops)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wholesale')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'wholesale'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Boxes className="h-3.5 w-3.5" />
              🏭 Wholesale B2B (Alibaba MOQs)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('under25')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'under25'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              💰 Under $25 Bargains
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-400 hover:bg-indigo-500/10'
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              📦 Track Orders
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seller')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'seller'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-400 hover:bg-purple-500/10'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              💼 Seller Center
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
            <span>Location: <strong>{deliveryLocation}</strong></span>
            <span>Currency: <strong>{currency}</strong></span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('shop');
                setMobileMenuOpen(false);
              }}
              className="rounded-lg bg-slate-900 p-2.5 text-left text-white"
            >
              🛒 Shop All
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('flash');
                setMobileMenuOpen(false);
              }}
              className="rounded-lg bg-rose-500/10 p-2.5 text-left text-rose-400"
            >
              ⚡ Flash Deals
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('wholesale');
                setMobileMenuOpen(false);
              }}
              className="rounded-lg bg-amber-500/10 p-2.5 text-left text-amber-400"
            >
              🏭 Wholesale B2B
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('under25');
                setMobileMenuOpen(false);
              }}
              className="rounded-lg bg-emerald-500/10 p-2.5 text-left text-emerald-400"
            >
              💰 Under $25
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('orders');
                setMobileMenuOpen(false);
              }}
              className="rounded-lg bg-indigo-500/10 p-2.5 text-left text-indigo-400"
            >
              📦 Track Orders
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('seller');
                setMobileMenuOpen(false);
              }}
              className="rounded-lg bg-purple-500/10 p-2.5 text-left text-purple-400"
            >
              💼 Seller Center
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
