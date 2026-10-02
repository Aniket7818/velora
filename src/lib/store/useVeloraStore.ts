'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Product,
  CartItem,
  Moodboard,
  SavedOutfit,
  PriceAlert,
  Order,
  OrderStatus,
  ReturnRequest,
  Coupon,
  VeloraRewards,
  NotificationItem,
  ShippingAddress,
} from '@/types';
import { INITIAL_PRODUCTS } from '../data/products';
import {
  INITIAL_COUPONS,
  INITIAL_MOODBOARDS,
  INITIAL_SAVED_OUTFITS,
  INITIAL_PRICE_ALERTS,
  INITIAL_ORDERS,
  INITIAL_REWARDS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface VeloraState {
  // Products (Storefront + Admin CRUD)
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;

  // Comparison (2 to 4 products)
  comparisonList: string[]; // product IDs
  toggleComparison: (productId: string) => { success: boolean; message?: string };
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;

  // Moodboards
  moodboards: Moodboard[];
  createMoodboard: (title: string, description: string, coverImage?: string) => string;
  updateMoodboard: (id: string, updates: Partial<Moodboard>) => void;
  deleteMoodboard: (id: string) => void;
  addProductToMoodboard: (moodboardId: string, productId: string) => void;
  removeProductFromMoodboard: (moodboardId: string, productId: string) => void;
  reorderMoodboardProducts: (moodboardId: string, productIds: string[]) => void;

  // Saved Outfits
  savedOutfits: SavedOutfit[];
  saveOutfit: (outfit: Omit<SavedOutfit, 'id' | 'createdAt'>) => string;
  deleteOutfit: (id: string) => void;
  renameOutfit: (id: string, newName: string) => void;

  // Price Alerts
  priceAlerts: PriceAlert[];
  addPriceAlert: (product: Product, targetPrice: number) => void;
  removePriceAlert: (alertId: string) => void;

  // Orders & Checkout
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Returns
  returns: ReturnRequest[];
  submitReturnRequest: (
    orderId: string,
    orderNumber: string,
    item: CartItem | any,
    reason: string,
    notes?: string
  ) => ReturnRequest;

  // Rewards Club
  rewards: VeloraRewards;
  addRewardsPoints: (points: number, reason: string) => void;
  redeemCouponWithPoints: (pointsCost: number, couponDiscount: number) => boolean;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;

  // Recently Viewed & Search History
  recentlyViewed: string[]; // product IDs
  addRecentlyViewed: (productId: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Coupons Manager (Admin)
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  toggleCouponActive: (code: string) => void;

  // Demo User Session & Addresses
  user: {
    name: string;
    email: string;
    phone: string;
    isLoggedIn: boolean;
    addresses: ShippingAddress[];
  };
  updateUserProfile: (profile: Partial<VeloraState['user']>) => void;
  addAddress: (address: ShippingAddress) => void;
  removeAddress: (index: number) => void;

  // Maintenance & Demo Reset
  resetDemoData: () => void;
  exportDemoData: () => string;
  importDemoData: (jsonStr: string) => { success: boolean; message: string };
}

export const useVeloraStore = create<VeloraState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      cart: [],
      appliedCoupon: null,
      wishlist: ['prod-w-001', 'prod-w-002', 'prod-a-001'],
      comparisonList: [],
      moodboards: INITIAL_MOODBOARDS,
      savedOutfits: INITIAL_SAVED_OUTFITS,
      priceAlerts: INITIAL_PRICE_ALERTS,
      orders: INITIAL_ORDERS,
      returns: [],
      rewards: INITIAL_REWARDS,
      notifications: INITIAL_NOTIFICATIONS,
      recentlyViewed: ['prod-w-001', 'prod-w-003', 'prod-m-001'],
      recentSearches: ['Cashmere Blazer', 'Silk Dress', 'Lug Sole Boots', 'Linen'],
      coupons: INITIAL_COUPONS,
      user: {
        name: 'Aditi Sharma',
        email: 'aditi.sharma@example.com',
        phone: '+91 98201 45678',
        isLoggedIn: true,
        addresses: [
          {
            fullName: 'Aditi Sharma',
            street: '402 Regency Heights, Altamount Road',
            apartment: 'Floor 4, Wing B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400026',
            phone: '+91 98201 45678',
            country: 'India',
          },
        ],
      },

      // Product actions
      addProduct: (product) => {
        set((state) => ({ products: [product, ...state.products] }));
      },
      updateProduct: (id, updated) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      // Cart actions
      addToCart: (product, size, color, quantity = 1) => {
        const cartItemId = `${product.id}-${size}-${color}`;
        const existing = get().cart.find((item) => item.id === cartItemId);

        if (existing) {
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          set((state) => ({
            cart: [
              ...state.cart,
              {
                id: cartItemId,
                productId: product.id,
                product,
                size,
                color,
                quantity,
              },
            ],
          }));
        }

        get().addNotification({
          type: 'cart_reminder',
          title: 'Added to Cart',
          message: `${product.name} (${size}) was added to your shopping bag.`,
          link: '/cart',
        });
      },

      removeFromCart: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        }));
      },

      updateCartQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      applyCoupon: (code) => {
        const found = get().coupons.find(
          (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
        );
        if (!found) {
          return { success: false, message: 'Invalid or inactive promo code.' };
        }

        const subtotal = get().cart.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        if (subtotal < found.minCartAmount) {
          return {
            success: false,
            message: `Requires a minimum cart value of ₹${found.minCartAmount.toLocaleString('en-IN')}`,
          };
        }

        set({ appliedCoupon: found });
        return {
          success: true,
          message: `Coupon ${found.code} applied successfully!`,
        };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      clearCart: () => {
        set({ cart: [], appliedCoupon: null });
      },

      // Wishlist actions
      toggleWishlist: (productId) => {
        const current = get().wishlist;
        const exists = current.includes(productId);
        if (exists) {
          set({ wishlist: current.filter((id) => id !== productId) });
          return false;
        } else {
          set({ wishlist: [...current, productId] });
          const prod = get().products.find((p) => p.id === productId);
          if (prod) {
            get().addNotification({
              type: 'system',
              title: 'Saved to Wishlist',
              message: `${prod.name} saved to your wishlist.`,
              link: '/wishlist',
            });
          }
          return true;
        }
      },

      isInWishlist: (productId) => get().wishlist.includes(productId),

      // Comparison (2-4 items)
      toggleComparison: (productId) => {
        const current = get().comparisonList;
        if (current.includes(productId)) {
          set({ comparisonList: current.filter((id) => id !== productId) });
          return { success: true };
        }
        if (current.length >= 4) {
          return {
            success: false,
            message: 'You can compare up to 4 items simultaneously.',
          };
        }
        set({ comparisonList: [...current, productId] });
        return { success: true };
      },

      removeFromComparison: (productId) => {
        set((state) => ({
          comparisonList: state.comparisonList.filter((id) => id !== productId),
        }));
      },

      clearComparison: () => {
        set({ comparisonList: [] });
      },

      isInComparison: (productId) => get().comparisonList.includes(productId),

      // Moodboards
      createMoodboard: (title, description, coverImage) => {
        const newId = `mb-${Date.now()}`;
        const newBoard: Moodboard = {
          id: newId,
          title,
          description,
          coverImage,
          productIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ moodboards: [...state.moodboards, newBoard] }));
        return newId;
      },

      updateMoodboard: (id, updates) => {
        set((state) => ({
          moodboards: state.moodboards.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
          ),
        }));
      },

      deleteMoodboard: (id) => {
        set((state) => ({
          moodboards: state.moodboards.filter((b) => b.id !== id),
        }));
      },

      addProductToMoodboard: (moodboardId, productId) => {
        set((state) => ({
          moodboards: state.moodboards.map((b) => {
            if (b.id !== moodboardId) return b;
            if (b.productIds.includes(productId)) return b;
            return {
              ...b,
              productIds: [...b.productIds, productId],
              coverImage: b.coverImage || state.products.find((p) => p.id === productId)?.images[0],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      removeProductFromMoodboard: (moodboardId, productId) => {
        set((state) => ({
          moodboards: state.moodboards.map((b) =>
            b.id === moodboardId
              ? {
                  ...b,
                  productIds: b.productIds.filter((id) => id !== productId),
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        }));
      },

      reorderMoodboardProducts: (moodboardId, productIds) => {
        set((state) => ({
          moodboards: state.moodboards.map((b) =>
            b.id === moodboardId ? { ...b, productIds, updatedAt: new Date().toISOString() } : b
          ),
        }));
      },

      // Saved Outfits
      saveOutfit: (outfit) => {
        const newId = `outfit-${Date.now()}`;
        const newOutfit: SavedOutfit = {
          ...outfit,
          id: newId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ savedOutfits: [newOutfit, ...state.savedOutfits] }));
        get().addNotification({
          type: 'system',
          title: 'Outfit Saved',
          message: `"${outfit.name}" saved to your styling wardrobe.`,
          link: '/outfit-studio',
        });
        return newId;
      },

      deleteOutfit: (id) => {
        set((state) => ({
          savedOutfits: state.savedOutfits.filter((o) => o.id !== id),
        }));
      },

      renameOutfit: (id, newName) => {
        set((state) => ({
          savedOutfits: state.savedOutfits.map((o) =>
            o.id === id ? { ...o, name: newName } : o
          ),
        }));
      },

      // Price Alerts
      addPriceAlert: (product, targetPrice) => {
        const newAlert: PriceAlert = {
          id: `pa-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          productImage: product.images[0],
          originalPrice: product.originalPrice || product.price,
          currentPrice: product.price,
          targetPrice,
          createdAt: new Date().toISOString(),
          isTriggered: product.price <= targetPrice,
        };
        set((state) => ({ priceAlerts: [newAlert, ...state.priceAlerts] }));
        get().addNotification({
          type: 'price_drop',
          title: 'Price Watch Set',
          message: `Target alert set for ${product.name} at ₹${targetPrice.toLocaleString('en-IN')}.`,
          link: '/deals',
        });
      },

      removePriceAlert: (alertId) => {
        set((state) => ({
          priceAlerts: state.priceAlerts.filter((a) => a.id !== alertId),
        }));
      },

      // Orders
      createOrder: (orderData) => {
        const id = `ord-${Date.now()}`;
        const orderNumber = `VEL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const newOrder: Order = {
          ...orderData,
          id,
          orderNumber,
          createdAt: new Date().toISOString(),
          status: 'Order Placed',
          timeline: [
            {
              status: 'Order Placed',
              timestamp: nowStr,
              note: 'Order successfully authorized and received.',
              completed: true,
            },
            {
              status: 'Confirmed',
              timestamp: 'Processing',
              note: 'Atelier verifying stock and packaging.',
              completed: false,
            },
            {
              status: 'Packed',
              timestamp: 'Pending',
              note: 'Packed in signature luxury casing.',
              completed: false,
            },
            {
              status: 'Shipped',
              timestamp: 'Pending',
              note: 'Dispatched with insured courier.',
              completed: false,
            },
            {
              status: 'Out for Delivery',
              timestamp: 'Pending',
              note: 'Local courier out for final handover.',
              completed: false,
            },
            {
              status: 'Delivered',
              timestamp: 'Pending',
              note: 'Delivered to recipient.',
              completed: false,
            },
          ],
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        // Reward points: 5% of order value in points
        const pointsEarned = Math.round(orderData.total * 0.05);
        get().addRewardsPoints(
          pointsEarned,
          `Earned points from Order #${orderNumber}`
        );

        // Add Notification
        get().addNotification({
          type: 'order_update',
          title: 'Order Placed Successfully',
          message: `Your demo order #${orderNumber} for ₹${orderData.total.toLocaleString('en-IN')} is confirmed.`,
          link: `/orders/${id}`,
        });

        get().clearCart();
        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus) => {
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const statusOrder: OrderStatus[] = [
          'Order Placed',
          'Confirmed',
          'Packed',
          'Shipped',
          'Out for Delivery',
          'Delivered',
        ];

        const targetIndex = statusOrder.indexOf(newStatus);

        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            return {
              ...order,
              status: newStatus,
              timeline: order.timeline.map((step) => {
                const stepIndex = statusOrder.indexOf(step.status);
                if (stepIndex <= targetIndex) {
                  return {
                    ...step,
                    completed: true,
                    timestamp: step.completed ? step.timestamp : nowStr,
                  };
                }
                return { ...step, completed: false };
              }),
            };
          }),
        }));
      },

      // Returns
      submitReturnRequest: (orderId, orderNumber, item, reason, notes) => {
        const newReturn: ReturnRequest = {
          id: `ret-${Date.now()}`,
          orderId,
          orderNumber,
          item,
          reason,
          notes,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          refundAmount: item.price * item.quantity,
        };

        set((state) => ({ returns: [newReturn, ...state.returns] }));
        get().addNotification({
          type: 'system',
          title: 'Return Request Registered',
          message: `Return submitted for ${item.name}. Reference: ${newReturn.id}`,
          link: '/account?tab=returns',
        });
        return newReturn;
      },

      // Rewards
      addRewardsPoints: (points, reason) => {
        set((state) => {
          const newBalance = state.rewards.pointsBalance + points;
          const newLifetime = state.rewards.lifetimePoints + points;
          let tier = state.rewards.tier;
          if (newLifetime >= 5000) tier = 'Platinum';
          else if (newLifetime >= 2000) tier = 'Gold';
          else tier = 'Silver';

          return {
            rewards: {
              ...state.rewards,
              pointsBalance: newBalance,
              lifetimePoints: newLifetime,
              tier,
              history: [
                {
                  id: `rw-${Date.now()}`,
                  date: new Date().toISOString().substring(0, 10),
                  description: reason,
                  points,
                  type: 'earned',
                },
                ...state.rewards.history,
              ],
            },
          };
        });
      },

      redeemCouponWithPoints: (pointsCost, couponDiscount) => {
        if (get().rewards.pointsBalance < pointsCost) return false;

        const code = `VIP-${Math.floor(100 + Math.random() * 900)}`;
        const newCoupon: Coupon = {
          code,
          description: `VIP Privilege Voucher: ₹${couponDiscount} Off`,
          discountType: 'fixed',
          discountValue: couponDiscount,
          minCartAmount: couponDiscount * 3,
          expiryDate: '2026-12-31',
          isActive: true,
        };

        set((state) => ({
          rewards: {
            ...state.rewards,
            pointsBalance: state.rewards.pointsBalance - pointsCost,
            history: [
              {
                id: `rw-${Date.now()}`,
                date: new Date().toISOString().substring(0, 10),
                description: `Redeemed ${pointsCost} points for ₹${couponDiscount} Voucher`,
                points: -pointsCost,
                type: 'redeemed',
              },
              ...state.rewards.history,
            ],
          },
          coupons: [newCoupon, ...state.coupons],
        }));

        get().addNotification({
          type: 'reward',
          title: 'Coupon Unlocked!',
          message: `Use code ${code} for ₹${couponDiscount} off on your next purchase.`,
          link: '/cart',
        });

        return true;
      },

      // Notifications
      addNotification: (notification) => {
        const item: NotificationItem = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({ notifications: [item, ...state.notifications] }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      // Recently viewed
      addRecentlyViewed: (productId) => {
        set((state) => ({
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 8),
        }));
      },

      // Searches
      addRecentSearch: (query) => {
        if (!query.trim()) return;
        set((state) => ({
          recentSearches: [
            query.trim(),
            ...state.recentSearches.filter(
              (s) => s.toLowerCase() !== query.trim().toLowerCase()
            ),
          ].slice(0, 8),
        }));
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      // Coupons (Admin)
      addCoupon: (coupon) => {
        set((state) => ({ coupons: [coupon, ...state.coupons] }));
      },

      deleteCoupon: (code) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== code),
        }));
      },

      toggleCouponActive: (code) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code === code ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      // User profile & addresses
      updateUserProfile: (profile) => {
        set((state) => ({ user: { ...state.user, ...profile } }));
      },

      addAddress: (address) => {
        set((state) => ({
          user: {
            ...state.user,
            addresses: [...state.user.addresses, address],
          },
        }));
      },

      removeAddress: (index) => {
        set((state) => ({
          user: {
            ...state.user,
            addresses: state.user.addresses.filter((_, i) => i !== index),
          },
        }));
      },

      // Reset & JSON Sync
      resetDemoData: () => {
        set({
          products: INITIAL_PRODUCTS,
          cart: [],
          appliedCoupon: null,
          wishlist: ['prod-w-001', 'prod-w-002', 'prod-a-001'],
          comparisonList: [],
          moodboards: INITIAL_MOODBOARDS,
          savedOutfits: INITIAL_SAVED_OUTFITS,
          priceAlerts: INITIAL_PRICE_ALERTS,
          orders: INITIAL_ORDERS,
          returns: [],
          rewards: INITIAL_REWARDS,
          notifications: INITIAL_NOTIFICATIONS,
          recentlyViewed: ['prod-w-001', 'prod-w-003', 'prod-m-001'],
          coupons: INITIAL_COUPONS,
        });
      },

      exportDemoData: () => {
        const state = get();
        const exportObj = {
          products: state.products,
          orders: state.orders,
          moodboards: state.moodboards,
          savedOutfits: state.savedOutfits,
          priceAlerts: state.priceAlerts,
          rewards: state.rewards,
          coupons: state.coupons,
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importDemoData: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (!parsed.products || !Array.isArray(parsed.products)) {
            return { success: false, message: 'Invalid format: missing products array.' };
          }
          set((state) => ({
            products: parsed.products || state.products,
            orders: parsed.orders || state.orders,
            moodboards: parsed.moodboards || state.moodboards,
            savedOutfits: parsed.savedOutfits || state.savedOutfits,
            priceAlerts: parsed.priceAlerts || state.priceAlerts,
            rewards: parsed.rewards || state.rewards,
            coupons: parsed.coupons || state.coupons,
          }));
          return { success: true, message: 'Demo data imported successfully!' };
        } catch {
          return { success: false, message: 'Failed to parse JSON file.' };
        }
      },
    }),
    {
      name: 'velora_storage_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        cart: state.cart,
        appliedCoupon: state.appliedCoupon,
        wishlist: state.wishlist,
        comparisonList: state.comparisonList,
        moodboards: state.moodboards,
        savedOutfits: state.savedOutfits,
        priceAlerts: state.priceAlerts,
        orders: state.orders,
        returns: state.returns,
        rewards: state.rewards,
        notifications: state.notifications,
        recentlyViewed: state.recentlyViewed,
        recentSearches: state.recentSearches,
        coupons: state.coupons,
        user: state.user,
      }),
    }
  )
);

// Safe SSR / Client Hydration Hook
import { useState, useEffect } from 'react';

export function useStoreHydration() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
