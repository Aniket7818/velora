'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency, calculateCartTotals } from '@/lib/utils/formatters';
import { Order, ShippingAddress } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, appliedCoupon, createOrder, user } = useVeloraStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form states
  const [contact, setContact] = useState({
    name: user.name || 'Aditi Sharma',
    email: user.email || 'aditi.sharma@example.com',
    phone: user.phone || '+91 98201 45678',
  });

  const [address, setAddress] = useState<ShippingAddress>(
    user.addresses[0] || {
      fullName: 'Aditi Sharma',
      street: '402 Regency Heights, Altamount Road',
      apartment: 'Floor 4, Wing B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      phone: '+91 98201 45678',
      country: 'India',
    }
  );

  const [deliveryOption, setDeliveryOption] = useState<{
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  }>({
    id: 'express',
    name: 'White-Glove Express Courier',
    price: 0,
    estimatedDays: '1-2 Business Days',
  });

  const [paymentType, setPaymentType] = useState<'demo_card' | 'cod' | 'upi_demo'>('demo_card');

  // Confirmation result
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const totals = calculateCartTotals(cart, appliedCoupon, deliveryOption.price);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-stone-900">Your Bag is Empty</h2>
        <p className="text-xs text-stone-500">
          Add items to your shopping bag before proceeding to atelier checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    const newOrder = createOrder({
      customer: contact,
      shippingAddress: address,
      deliveryMethod: deliveryOption,
      paymentMethod: {
        type: paymentType,
        label:
          paymentType === 'demo_card'
            ? 'Demo Privilege Card (ending in •••• 4242)'
            : paymentType === 'upi_demo'
            ? 'Demo UPI (velora@privilege)'
            : 'Cash on Delivery (Simulated)',
      },
      items: cart.map((i) => ({
        productId: i.productId,
        name: i.product.name,
        brand: i.product.brand,
        image: i.product.images[0],
        price: i.product.price,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponCode: appliedCoupon?.code,
      shippingFee: totals.shipping,
      tax: totals.tax,
      total: totals.total,
    });

    setConfirmedOrder(newOrder);
    setStep(6);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E9E2D8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#702C3B] font-semibold">
            Concierge Checkout
          </span>
          <h1 className="font-serif text-3xl text-stone-900 font-normal mt-0.5">
            {step === 6 ? 'Order Confirmation' : 'Secure Atelier Checkout'}
          </h1>
        </div>

        {step < 6 && (
          <div className="flex items-center gap-1.5 text-xs text-[#2E7658] font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Demo Flow</span>
          </div>
        )}
      </div>

      {/* Stepper (Only active on steps 1-5) */}
      {step <= 5 && (
        <div className="flex justify-between items-center max-w-2xl mx-auto text-xs font-mono uppercase tracking-wider text-stone-500 border-b border-[#E9E2D8] pb-4">
          <span className={step >= 1 ? 'text-[#702C3B] font-bold' : ''}>1. Contact</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-[#702C3B] font-bold' : ''}>2. Address</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-[#702C3B] font-bold' : ''}>3. Delivery</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-[#702C3B] font-bold' : ''}>4. Review</span>
          <span>→</span>
          <span className={step >= 5 ? 'text-[#702C3B] font-bold' : ''}>5. Payment</span>
        </div>
      )}

      {/* STEP 1: CONTACT INFO */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 font-medium">
            Contact Information
          </h2>
          <p className="text-xs text-stone-500">
            We will dispatch order confirmations, digital invoices, and courier updates to these coordinates.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                Phone Number (for Courier SMS)
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs flex items-center gap-2"
            >
              <span>Continue to Shipping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SHIPPING ADDRESS */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 font-medium">
            Shipping Destination
          </h2>
          <p className="text-xs text-stone-500">
            Please specify where our white-glove logistics partner should deliver your package.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  Apartment / Suite / Floor
                </label>
                <input
                  type="text"
                  value={address.apartment || ''}
                  onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                  className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-[#E9E2D8] text-xs font-mono uppercase rounded-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs flex items-center gap-2"
            >
              <span>Continue to Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DELIVERY PREFERENCE */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 font-medium">
            Delivery Protocol
          </h2>

          <div className="space-y-3 pt-2">
            {[
              {
                id: 'express',
                name: 'White-Glove Express Courier',
                price: 0,
                estimatedDays: '1-2 Business Days',
                desc: 'Signature garment bags, wooden contoured hangers, and dedicated air courier.',
              },
              {
                id: 'standard',
                name: 'Standard Insured Courier',
                price: 0,
                estimatedDays: '3-4 Business Days',
                desc: 'Standard insured parcel delivery with recycled luxury craft packaging.',
              },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setDeliveryOption(opt)}
                className={`p-4 rounded-xs border cursor-pointer transition-all flex items-center justify-between ${
                  deliveryOption.id === opt.id
                    ? 'border-[#702C3B] bg-[#702C3B]/5 ring-1 ring-[#702C3B]'
                    : 'border-[#E9E2D8] hover:border-stone-400 bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#702C3B]" />
                    <span className="font-serif text-base font-medium text-stone-900">
                      {opt.name}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{opt.desc}</p>
                  <span className="text-[11px] font-mono text-stone-400 block">
                    ETA: {opt.estimatedDays}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#2E7658]">
                  COMPLIMENTARY
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-[#E9E2D8] text-xs font-mono uppercase rounded-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs flex items-center gap-2"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER REVIEW */}
      {step === 4 && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 font-medium">
            Review Your Order
          </h2>

          <div className="divide-y divide-[#E9E2D8] border border-[#E9E2D8] rounded-xs p-4 bg-[#F8F6F1]/50">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 relative rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-[#E9E2D8]">
                    <Image src={item.product.images[0]} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">{item.product.name}</h4>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-medium text-stone-900">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="bg-[#F8F6F1] p-4 rounded-xs text-xs space-y-2 font-mono">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-[#702C3B]">
                <span>Discount ({appliedCoupon?.code}):</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Courier:</span>
              <span className="text-[#2E7658] font-bold">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Estimated Tax (12% Demo GST):</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            <div className="pt-2 border-t border-[#E9E2D8] flex justify-between text-sm font-serif font-bold text-stone-900">
              <span>Total Payable:</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 border border-[#E9E2D8] text-xs font-mono uppercase rounded-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-3 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs flex items-center gap-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: DEMO PAYMENT */}
      {step === 5 && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <div>
            <h2 className="font-serif text-2xl text-stone-900 font-medium">
              Payment Method
            </h2>
            <div className="mt-1 p-2.5 bg-amber-50 border border-amber-200 rounded-xs text-[11px] text-amber-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Simulated Demo Environment:</strong> No real payment gateway is queried.
                Never enter actual credit card numbers.
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                type: 'demo_card' as const,
                title: 'Demo Privilege Card',
                desc: 'Simulated one-click card checkout (Pre-filled with test credentials •••• 4242)',
                icon: <CreditCard className="w-4 h-4 text-[#702C3B]" />,
              },
              {
                type: 'upi_demo' as const,
                title: 'Demo Instant UPI',
                desc: 'Simulate mobile payment via GooglePay / PhonePe / Paytm handle',
                icon: <Smartphone className="w-4 h-4 text-[#2E7658]" />,
              },
              {
                type: 'cod' as const,
                title: 'Cash on Delivery (Demo)',
                desc: 'Pay cash or card to white-glove courier upon signature handover',
                icon: <Banknote className="w-4 h-4 text-stone-700" />,
              },
            ].map((method) => (
              <div
                key={method.type}
                onClick={() => setPaymentType(method.type)}
                className={`p-4 rounded-xs border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentType === method.type
                    ? 'border-[#702C3B] bg-[#702C3B]/5 ring-1 ring-[#702C3B]'
                    : 'border-[#E9E2D8] hover:border-stone-400 bg-white'
                }`}
              >
                <div className="pt-0.5">{method.icon}</div>
                <div>
                  <h4 className="font-serif text-base font-medium text-stone-900">
                    {method.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 border border-[#E9E2D8] text-xs font-mono uppercase rounded-xs"
            >
              Back
            </button>
            <button
              onClick={handlePlaceOrder}
              className="px-8 py-3.5 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Authorize &amp; Place Order ({formatCurrency(totals.total)})</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: CONFIRMATION SCREEN */}
      {step === 6 && confirmedOrder && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E9E2D8] p-8 sm:p-12 rounded-sm space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2E7658] font-bold">
              Simulated Order Authorized
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
              Thank You for Patronizing VELORA
            </h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Your order has been registered in your client portal. An atelier specialist is reviewing
              garment availability.
            </p>
          </div>

          {/* Reference badge */}
          <div className="p-4 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-stone-400 uppercase text-[10px] block">Order Reference</span>
              <span className="text-stone-900 font-bold text-sm">{confirmedOrder.orderNumber}</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase text-[10px] block">Total Amount</span>
              <span className="text-stone-900 font-bold text-sm">
                {formatCurrency(confirmedOrder.total)}
              </span>
            </div>
            <div>
              <span className="text-stone-400 uppercase text-[10px] block">Status</span>
              <span className="text-[#2E7658] font-bold text-sm">{confirmedOrder.status}</span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-medium text-stone-900">Ordered Creations</h4>
            <div className="divide-y divide-[#E9E2D8] border border-[#E9E2D8] rounded-xs p-3">
              {confirmedOrder.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 relative rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-[#E9E2D8]">
                      <Image src={it.image} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{it.name}</p>
                      <span className="text-[10px] font-mono text-stone-400">
                        Size: {it.size} • Color: {it.color} • Qty: {it.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-medium">{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#E9E2D8]">
            <Link
              href={`/orders/${confirmedOrder.id}`}
              className="w-full sm:w-auto px-6 py-3 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs transition-colors text-center"
            >
              Track Order Journey
            </Link>

            <Link
              href="/account"
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#171717] text-stone-900 text-xs font-mono uppercase tracking-widest font-medium rounded-xs hover:bg-[#171717] hover:text-white transition-colors text-center"
            >
              Go to Client Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
