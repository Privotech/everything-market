import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { formatMoney } from '@/lib/money.ts';
import { ShippingAddress } from '@/modules/catalog/types.ts';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalCents,
    cartShippingCents,
    cartDiscountCents,
    cartTaxCents,
    cartFinalTotalCents,
    placeOrder,
    currency,
  } = useMarketplace();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Jane Doe',
    email: 'shopper@everythingmarket.dev',
    phone: '+1 (555) 234-5678',
    street: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState('Standard Express (3-5 business days)');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'mobile'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Complete order
      setIsSubmitting(true);
      setTimeout(() => {
        const paymentLabel =
          paymentMethod === 'card'
            ? 'Credit Card (ending in •••• 4242)'
            : paymentMethod === 'cod'
            ? 'Cash on Delivery (Pay upon arrival)'
            : 'Mobile Money / Digital Wallet';

        placeOrder(address, shippingMethod, paymentLabel);
        setIsSubmitting(false);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-400" />
            <h2 className="text-lg font-black text-white">
              Secure Multi-Vendor Checkout
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div
            className={`rounded-xl p-2.5 border transition-all ${
              step === 1
                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                : 'border-slate-800 bg-slate-950 text-slate-400'
            }`}
          >
            1. Shipping Address
          </div>
          <div
            className={`rounded-xl p-2.5 border transition-all ${
              step === 2
                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                : 'border-slate-800 bg-slate-950 text-slate-400'
            }`}
          >
            2. Delivery Method
          </div>
          <div
            className={`rounded-xl p-2.5 border transition-all ${
              step === 3
                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                : 'border-slate-800 bg-slate-950 text-slate-400'
            }`}
          >
            3. Payment & Confirm
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleNext} className="space-y-6">
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <MapPin className="h-4 w-4 text-orange-400" />
                Shipping Destination & Contact Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Full Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Phone Number (For Courier SMS)</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-semibold">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">State / Region / Postal</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 font-semibold">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="United States">United States</option>
                    <option value="Nigeria">Nigeria (Jumia Express Hub)</option>
                    <option value="Kenya">Kenya (Jumia Express Hub)</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Option */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Truck className="h-4 w-4 text-orange-400" />
                Select Preferred Delivery Method
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Standard Express (3-5 business days)',
                    desc: 'Fully tracked door-to-door courier dispatch with SMS updates.',
                    price: cartShippingCents === 0 ? 'FREE' : formatMoney(cartShippingCents, currency),
                  },
                  {
                    title: 'Priority Overnight Air (1-2 business days)',
                    desc: 'First flight out with signature delivery.',
                    price: formatMoney(1200, currency),
                  },
                  {
                    title: 'Factory Direct Freight (Alibaba B2B Logistics)',
                    desc: 'Consolidated maritime/air pallet freight with customs clearance.',
                    price: 'Included for bulk',
                  },
                ].map((m) => (
                  <label
                    key={m.title}
                    className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                      shippingMethod === m.title
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === m.title}
                        onChange={() => setShippingMethod(m.title)}
                        className="text-orange-500 focus:ring-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{m.title}</div>
                        <div className="text-[11px] text-slate-400">{m.desc}</div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">{m.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Summary */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <CreditCard className="h-4 w-4 text-orange-400" />
                Select Payment Method
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-500/10 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <CreditCard className="h-6 w-6 mb-2 text-orange-400" />
                  <span className="text-xs">Credit / Debit Card</span>
                  <span className="text-[10px] text-slate-500">Visa, Mastercard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-500/10 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Banknote className="h-6 w-6 mb-2 text-emerald-400" />
                  <span className="text-xs">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500">Pay at doorstep</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                    paymentMethod === 'mobile'
                      ? 'border-orange-500 bg-orange-500/10 text-white font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Smartphone className="h-6 w-6 mb-2 text-indigo-400" />
                  <span className="text-xs">Mobile Money</span>
                  <span className="text-[10px] text-slate-500">M-Pesa, OPay, Apple Pay</span>
                </button>
              </div>

              {/* Order Receipt Summary */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Items Subtotal ({cart.length} items):</span>
                  <span className="text-white">{formatMoney(cartSubtotalCents, currency)}</span>
                </div>
                {cartDiscountCents > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Coupon Savings:</span>
                    <span>-{formatMoney(cartDiscountCents, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping Fee:</span>
                  <span className="text-emerald-400 font-bold">
                    {cartShippingCents === 0 ? 'FREE' : formatMoney(cartShippingCents, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sales Tax:</span>
                  <span className="text-white">{formatMoney(cartTaxCents, currency)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Grand Total:</span>
                  <span className="text-orange-400">{formatMoney(cartFinalTotalCents, currency)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-xs font-black text-white shadow-xl shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Processing Order...'
              ) : step === 3 ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Place Order ({formatMoney(cartFinalTotalCents, currency)})
                </>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
