'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const { orders } = useVeloraStore();

  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-stone-900">Order Record Not Found</h2>
        <p className="text-xs text-stone-500">
          The requested simulated order ID does not exist in your local demo store.
        </p>
        <Link
          href="/account"
          className="inline-block px-6 py-2.5 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
        >
          Return to My Account
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Order Placed', desc: 'Order received and logged in client registry' },
    { title: 'Confirmed', desc: 'Inventory authenticated by atelier' },
    { title: 'Packed', desc: 'Protected in signature luxury casing' },
    { title: 'Shipped', desc: 'Dispatched via priority insured air express' },
    { title: 'Out for Delivery', desc: 'Dedicated white-glove agent assigned' },
    { title: 'Delivered', desc: 'Direct recipient sign-off confirmed' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.title === order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2D8] pb-6">
        <div>
          <Link
            href="/account"
            className="text-xs font-mono uppercase text-stone-500 hover:text-black flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Client Account</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Order Journey: {order.orderNumber}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Placed on {formatDate(order.createdAt)} • Status:{' '}
            <span className="font-semibold text-[#2E7658]">{order.status}</span>
          </p>
        </div>

        <Link
          href={`/returns?orderId=${order.id}`}
          className="px-4 py-2 border border-[#E9E2D8] hover:border-black text-xs font-mono uppercase tracking-wider text-stone-800 rounded-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#702C3B]" />
          <span>Request Return / Exchange</span>
        </Link>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-white border border-[#E9E2D8] p-6 sm:p-10 rounded-sm space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-[#702C3B] font-semibold">
            Live Courier Stepper (Simulated)
          </span>
          <span className="text-xs font-mono text-stone-400">Waybill #BD8892104</span>
        </div>

        {/* Stepper bar */}
        <div className="relative">
          <div className="hidden sm:block absolute top-5 inset-x-8 h-0.5 bg-[#E9E2D8] z-0" />
          <div
            className="hidden sm:block absolute top-5 left-8 h-0.5 bg-[#2E7658] z-0 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 90}%`,
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 sm:gap-2 relative z-10">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.title} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                      isPast
                        ? 'bg-[#2E7658] text-white'
                        : isCurrent
                        ? 'bg-[#702C3B] text-white ring-4 ring-[#702C3B]/20'
                        : 'bg-[#F8F6F1] border border-[#E9E2D8] text-stone-400'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Truck className="w-5 h-5 animate-pulse" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h4
                      className={`text-xs font-serif font-medium ${
                        isCurrent
                          ? 'text-[#702C3B] font-bold'
                          : isPast
                          ? 'text-stone-900 font-semibold'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-stone-500 mt-0.5 hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items in Order */}
        <div className="lg:col-span-8 bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-4">
          <h3 className="font-serif text-xl font-medium text-stone-900 pb-3 border-b border-[#E9E2D8]">
            Items in This Order ({order.items.length})
          </h3>

          <div className="divide-y divide-[#E9E2D8]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-18 relative rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-[#E9E2D8]">
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-400">
                      {item.brand}
                    </span>
                    <h4 className="font-medium text-stone-900 text-sm">{item.name}</h4>
                    <p className="text-[11px] font-mono text-stone-500 mt-0.5">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif text-sm font-medium text-stone-900 block">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {formatCurrency(item.price)} each
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Shipping Address & Financials */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E9E2D8]">
              <MapPin className="w-4 h-4 text-[#702C3B]" />
              <h4 className="font-serif text-base font-medium text-stone-900">
                Delivery Address
              </h4>
            </div>

            <div className="text-xs text-stone-600 space-y-1">
              <p className="font-semibold text-stone-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.pincode}
              </p>
              <p className="font-mono pt-1 text-[11px]">{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-3 text-xs">
            <h4 className="font-serif text-base font-medium text-stone-900 pb-2 border-b border-[#E9E2D8]">
              Invoice Summary
            </h4>

            <div className="space-y-2 font-mono text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#702C3B]">
                  <span>Discount:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier:</span>
                <span className="text-[#2E7658] font-bold">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between">
                <span>GST (12% Demo):</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="pt-2 border-t border-[#E9E2D8] flex justify-between font-serif text-sm font-bold text-stone-900">
                <span>Total Paid:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-stone-400 font-mono">
              Paid via {order.paymentMethod.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
