export type ProductCategory = 'Women' | 'Men' | 'Accessories' | 'Footwear';

export type ProductOccasion = 'Casual' | 'Office' | 'Party' | 'Wedding' | 'Vacation' | 'Date Night' | 'Everyday';

export type ProductStyleTag = 'Minimal' | 'Classic' | 'Streetwear' | 'Elegant' | 'Contemporary' | 'Bold';

export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discount?: number; // percentage
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  material: string;
  care: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isSale?: boolean;
  occasion: ProductOccasion[];
  styleTag: ProductStyleTag[];
  fit?: 'Slim' | 'Regular' | 'Relaxed';
  priceHistory: PricePoint[];
  featured?: boolean;
  targetPriceAlert?: number;
}

export interface CartItem {
  id: string; // unique item id: productId-size-color
  productId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Moodboard {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  productIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedOutfit {
  id: string;
  name: string;
  description?: string;
  occasion?: string;
  style?: string;
  items: {
    top?: Product;
    bottom?: Product;
    shoes?: Product;
    accessory?: Product;
  };
  totalPrice: number;
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minCartAmount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  originalPrice: number;
  targetPrice: number;
  currentPrice: number;
  createdAt: string;
  isTriggered: boolean;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: ShippingAddress;
  deliveryMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: {
    type: 'demo_card' | 'cod' | 'upi_demo';
    label: string;
  };
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
    completed: boolean;
  }[];
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  item: OrderItem;
  reason: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Picked Up' | 'Refunded';
  createdAt: string;
  refundAmount: number;
}

export type LoyaltyTier = 'Silver' | 'Gold' | 'Platinum';

export interface RewardTransaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
}

export interface VeloraRewards {
  pointsBalance: number;
  tier: LoyaltyTier;
  lifetimePoints: number;
  history: RewardTransaction[];
  unlockedBadges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}

export interface NotificationItem {
  id: string;
  type: 'price_drop' | 'order_update' | 'reward' | 'cart_reminder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface EditorialLook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  season: string;
  productIds: string[];
}
