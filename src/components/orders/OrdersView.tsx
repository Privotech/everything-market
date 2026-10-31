import React from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShoppingBag,
  RotateCcw,
  Copy,
} from 'lucide-react';
import { useMarketplace } from '@/src/context/MarketplaceContext.tsx';
import { formatMoney } from '@/lib/money.ts';

export default function OrdersView() {
  const { orders, setActiveTab, currency } = useMarketplace();

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
        <Package className="mx-auto h-16 w-16 text-slate-600" />
        <h3 className="text-xl font-bold text-white">No orders placed yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          You haven't placed any orders yet. Explore our flash drops, wholesale deals, or daily bargains to place an order!
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('shop')}
          className="rounded-xl bg-orange-500 px-6 py-3 text-xs font-bold text-white hover:bg-orange-600 transition-all shadow-lg"
        >
          Explore Catalog Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-orange-400" />
            My Orders & Tracking Portal
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time live multi-vendor dispatch status, tracking codes, and receipts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('shop')}
          className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
        >
          Continue Shopping <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          return (
            <div
              key={order.id}
              className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl"
            >
              {/* Order Header */}
              <div className="bg-slate-950 p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-white">
                      Order #{order.orderNumber}
                    </span>
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Placed: {order.createdAt} • Delivery: <strong>{order.estimatedDelivery}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</div>
                  <div className="text-lg font-black text-orange-400">
                    {formatMoney(order.totalCents, currency)}
                  </div>
                </div>
              </div>

              {/* Live Tracking Progress Bar */}
              <div className="p-6 bg-slate-900/60 border-b border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold pb-2">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-orange-400" />
                    Tracking Code: <span className="font-mono text-orange-400">{order.trackingNumber}</span>
                  </span>
                  <span className="text-slate-400">{order.deliveryMethod}</span>
                </div>

                {/* Timeline Stepper */}
                <div className="grid grid-cols-4 gap-2 pt-3 text-center text-[11px]">
                  <div className="flex flex-col items-center space-y-1 text-emerald-400 font-bold">
                    <div className="h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                    <span>Order Placed</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 text-emerald-400 font-bold">
                    <div className="h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                    <span>Processing</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 text-orange-400 font-bold animate-pulse">
                    <div className="h-3 w-3 rounded-full bg-orange-400 ring-4 ring-orange-400/20" />
                    <span>Shipped / In Transit</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 text-slate-500 font-medium">
                    <div className="h-3 w-3 rounded-full bg-slate-700" />
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Items in this Shipment ({order.items.length})
                </h4>
                <div className="divide-y divide-slate-800/80">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-16 w-16 rounded-xl object-cover bg-slate-950 border border-slate-800"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-400">
                            {item.variantTitle} • Qty: {item.quantity}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            SKU: {item.sku}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {formatMoney(item.priceCents * item.quantity, currency)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatMoney(item.priceCents, currency)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Footer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-950 p-4 text-xs text-slate-300 mt-4 border border-slate-800/60">
                  <div>
                    <span className="font-bold text-white block mb-1">Delivered To:</span>
                    <div>{order.shippingAddress.fullName}</div>
                    <div className="text-slate-400">{order.shippingAddress.street}</div>
                    <div className="text-slate-400">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </div>
                    <div className="text-slate-400">{order.shippingAddress.country}</div>
                  </div>

                  <div>
                    <span className="font-bold text-white block mb-1">Payment Method:</span>
                    <div>{order.paymentMethod}</div>
                    <div className="text-emerald-400 font-bold mt-1">Paid in Full • Invoice Ready</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
