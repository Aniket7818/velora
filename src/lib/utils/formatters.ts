import { CartItem, Coupon } from '@/types';
import { SITE_CONFIG } from '@/config/site';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(SITE_CONFIG.currency.locale, {
    style: 'currency',
    currency: SITE_CONFIG.currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  } catch {
    return dateString;
  }
}

export function calculateDiscount(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;
}

export function calculateCartTotals(
  items: CartItem[],
  coupon: Coupon | null = null,
  deliveryFee: number = 0
): CartTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discount = 0;
  if (coupon && coupon.isActive && subtotal >= coupon.minCartAmount) {
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }
  }

  const freeShippingThreshold = SITE_CONFIG.freeShippingThreshold;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = isFreeShipping ? 0 : (deliveryFee || 199);
  
  // Demo standard 12% GST simulation
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.12);
  const total = Math.max(0, taxableAmount + shipping + tax);

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const amountNeededForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
    freeShippingProgress,
    amountNeededForFreeShipping,
  };
}
