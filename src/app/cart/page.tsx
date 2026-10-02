'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Heart,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency, calculateCartTotals } from '@/lib/utils/formatters';
import { SITE_CONFIG } from '@/config/site';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    products,
    addToCart,
  } = useVeloraStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const totals = calculateCartTotals(cart, appliedCoupon);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleSaveForLater = (productId: string, cartItemId: string) => {
    toggleWishlist(productId);
    removeFromCart(cartItemId);
  };

  // Add-ons suggestions (accessories or jewelry)
  const addOns = products
    .filter((p) => p.category === 'Accessories')
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E9E2D8] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Shopping Bag
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {cart.length === 0
            ? 'Your shopping bag is currently empty.'
            : `${cart.reduce((s, i) => s + i.quantity, 0)} atelier items reserved.`}
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-[#E9E2D8] p-12 text-center rounded-sm space-y-4 max-w-xl mx-auto">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2]" />
          <h2 className="font-serif text-2xl text-stone-900 font-normal">
            Your Bag is Awaiting Selections
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
            Explore our ready-to-wear tailoring, virgin wool overcoats, and handcrafted footwear.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
            >
              <span>Explore Wardrobe Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Progress Indicator */}
            <div className="bg-white border border-[#E9E2D8] p-4 rounded-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-stone-800">
                  <Truck className="w-4 h-4 text-[#702C3B]" />
                  {totals.amountNeededForFreeShipping === 0 ? (
                    <span className="text-[#2E7658] font-semibold">
                      You have unlocked complimentary white-glove shipping!
                    </span>
                  ) : (
                    <span>
                      Add{' '}
                      <strong>{formatCurrency(totals.amountNeededForFreeShipping)}</strong> more to
                      qualify for complimentary shipping.
                    </span>
                  )}
                </span>
                <span className="font-mono text-stone-500 text-[11px]">
                  Goal: {formatCurrency(SITE_CONFIG.freeShippingThreshold)}
                </span>
              </div>
              <div className="w-full bg-[#E9E2D8] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#702C3B] h-full transition-all duration-300"
                  style={{ width: `${totals.freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items Table */}
            <div className="bg-white border border-[#E9E2D8] rounded-xs divide-y divide-[#E9E2D8]">
              {cart.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start justify-between">
                  <div className="flex gap-4 min-w-0">
                    <div className="w-20 h-28 relative rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-[#E9E2D8]">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-stone-400">
                        {item.product.brand}
                      </span>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-serif text-base font-medium text-stone-900 block hover:text-[#702C3B] truncate"
                      >
                        {item.product.name}
                      </Link>

                      <div className="flex flex-wrap gap-2 text-xs text-stone-600 pt-1 font-mono">
                        <span className="px-2 py-0.5 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs">
                          Size: {item.size}
                        </span>
                        <span className="px-2 py-0.5 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs">
                          Color: {item.color}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 pt-3">
                        <button
                          onClick={() => handleSaveForLater(item.productId, item.id)}
                          className="text-stone-400 hover:text-black text-xs flex items-center gap-1 transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Save for Later</span>
                        </button>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-700 text-xs flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Price */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                    <div className="flex items-center border border-[#E9E2D8] rounded-xs bg-[#F8F6F1]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-stone-600 hover:text-black text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-stone-600 hover:text-black text-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-lg font-medium text-stone-900 block">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] font-mono text-stone-400 block">
                          {formatCurrency(item.product.price)} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Add-ons */}
            <div className="pt-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-semibold block mb-3">
                Complete Your Package: Suggested Accents
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {addOns.map((add) => (
                  <div
                    key={add.id}
                    className="p-3 bg-white border border-[#E9E2D8] rounded-xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-14 relative rounded-xs overflow-hidden bg-stone-100 shrink-0">
                        <Image src={add.images[0]} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-stone-900 truncate">{add.name}</p>
                        <span className="text-[11px] font-mono text-[#702C3B]">
                          {formatCurrency(add.price)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(add, add.sizes[0] || 'One Size', add.colors[0]?.name || 'Standard', 1)}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#171717] hover:bg-[#2A2A2A] text-white rounded-xs shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-6 shadow-xs">
            <h2 className="font-serif text-xl font-medium text-stone-900 pb-3 border-b border-[#E9E2D8]">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-stone-600 block">
                Privilege Code
              </span>
              {appliedCoupon ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      <strong>{appliedCoupon.code}</strong> applied
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-red-700"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. VELORA15"
                      className="bg-[#F8F6F1] border border-[#E9E2D8] text-xs px-3 py-2 text-stone-900 placeholder:text-stone-400 flex-1 rounded-l-xs uppercase font-mono focus:outline-none focus:border-[#702C3B]"
                    />
                    <button
                      type="submit"
                      className="bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase px-4 py-2 rounded-r-xs transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-600">{couponError}</p>}
                  {couponSuccess && <p className="text-[10px] text-emerald-600">{couponSuccess}</p>}
                  <p className="text-[10px] text-stone-400 font-mono">
                    Try demo code: <span className="underline cursor-pointer" onClick={() => setCouponInput('VELORA15')}>VELORA15</span>
                  </p>
                </form>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-[#E9E2D8] text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Atelier Subtotal</span>
                <span className="font-mono font-medium text-stone-900">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-[#702C3B]">
                  <span>Privilege Discount</span>
                  <span className="font-mono font-medium">-{formatCurrency(totals.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Insured Courier</span>
                <span className="font-mono font-medium">
                  {totals.shipping === 0 ? (
                    <span className="text-[#2E7658] font-bold">COMPLIMENTARY</span>
                  ) : (
                    formatCurrency(totals.shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated GST (12% Demo)</span>
                <span className="font-mono font-medium text-stone-900">
                  {formatCurrency(totals.tax)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E9E2D8] flex justify-between items-baseline">
                <span className="font-serif text-base font-medium text-stone-900">
                  Estimated Total
                </span>
                <span className="font-serif text-2xl font-medium text-stone-900">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="pt-2 space-y-3">
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-[#702C3B] hover:bg-[#5A232F] text-white py-3.5 px-6 text-xs font-mono uppercase tracking-widest font-semibold rounded-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/shop"
                className="w-full py-2.5 text-center text-xs font-mono uppercase tracking-wider text-stone-600 hover:text-black block"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
