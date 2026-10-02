import {
  Coupon,
  EditorialLook,
  Order,
  Moodboard,
  SavedOutfit,
  PriceAlert,
  VeloraRewards,
  NotificationItem,
} from '@/types';
import { INITIAL_PRODUCTS } from './products';

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'VELORA15',
    description: '15% off on orders above ₹4,999',
    discountType: 'percentage',
    discountValue: 15,
    minCartAmount: 4999,
    expiryDate: '2026-12-31',
    isActive: true,
  },
  {
    code: 'FIRST500',
    description: 'Flat ₹500 off on your first purchase above ₹2,999',
    discountType: 'fixed',
    discountValue: 500,
    minCartAmount: 2999,
    expiryDate: '2026-12-31',
    isActive: true,
  },
  {
    code: 'LUXE20',
    description: 'Exclusive 20% off on luxury tailoring above ₹10,000',
    discountType: 'percentage',
    discountValue: 20,
    minCartAmount: 10000,
    expiryDate: '2026-11-30',
    isActive: true,
  },
];

export const INITIAL_EDITORIAL_LOOKS: EditorialLook[] = [
  {
    id: 'look-1',
    title: 'The Contemporary Power Edit',
    subtitle: 'Autumn / Winter Sartorial Focus',
    description:
      'A sharp intersection of sculptural tailoring, fluid silk undertones, and architectural calfskin accents. Designed for high-stakes presence from morning boardroom to evening soiree.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    season: 'A/W 2026',
    productIds: ['prod-w-001', 'prod-w-004', 'prod-a-001', 'prod-f-004'],
  },
  {
    id: 'look-2',
    title: 'Neapolitan Suede & Tailoring',
    subtitle: 'Men’s Autumn Campaign',
    description:
      'Unstructured cashmere drape paired with tapered flannel trousers and burnished Tuscan suede loafers. A study in quiet European elegance.',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    season: 'Fall/Winter 2026',
    productIds: ['prod-m-001', 'prod-m-003', 'prod-f-002', 'prod-a-004'],
  },
  {
    id: 'look-3',
    title: 'Minimalist Riviera Dusk',
    subtitle: 'Resort & Evening Escape',
    description:
      'Pure silk charmeuse draped on the bias, punctuated by gold vermeil chains and modern sculpted mules. Understated luxury that commands attention.',
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80',
    season: 'Resort Collection',
    productIds: ['prod-w-002', 'prod-a-003', 'prod-f-004', 'prod-a-006'],
  },
  {
    id: 'look-4',
    title: 'Urban Architect Streetwear',
    subtitle: 'Modern Essentials Campaign',
    description:
      'Heavyweight Japanese selvedge denim layered with dense boiled wool outerwear and lugged commando boots. Utilitarian restraint made luxurious.',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
    season: 'Urban 2026',
    productIds: ['prod-m-004', 'prod-m-006', 'prod-f-001', 'prod-a-002'],
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'VEL-2026-9841',
    createdAt: '2026-09-28T14:30:00Z',
    items: [
      {
        productId: 'prod-w-001',
        name: 'Atelier Double-Breasted Wool Blazer',
        brand: 'VELORA Studio',
        image:
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
        price: 12999,
        size: 'M',
        color: 'Oatmeal Taupe',
        quantity: 1,
      },
      {
        productId: 'prod-a-003',
        name: 'Solis 18k Vermeil Chain Necklace',
        brand: 'Aura Nouveaux',
        image:
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
        price: 5499,
        size: '45cm',
        color: '18k Warm Gold',
        quantity: 1,
      },
    ],
    customer: {
      name: 'Aditi Sharma',
      email: 'aditi.sharma@example.com',
      phone: '+91 98201 45678',
    },
    shippingAddress: {
      fullName: 'Aditi Sharma',
      street: '402 Regency Heights, Altamount Road',
      apartment: 'Floor 4, Wing B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      phone: '+91 98201 45678',
      country: 'India',
    },
    deliveryMethod: {
      id: 'express',
      name: 'White-Glove Express Courier',
      price: 0,
      estimatedDays: '1-2 Business Days',
    },
    paymentMethod: {
      type: 'demo_card',
      label: 'Demo Card (ending in •••• 4242)',
    },
    subtotal: 18498,
    discount: 2774,
    couponCode: 'VELORA15',
    shippingFee: 0,
    tax: 1887,
    total: 17611,
    status: 'Shipped',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2026-09-28 14:30',
        note: 'Order placed and authenticated.',
        completed: true,
      },
      {
        status: 'Confirmed',
        timestamp: '2026-09-28 15:10',
        note: 'Atelier team verified inventory and prepared items.',
        completed: true,
      },
      {
        status: 'Packed',
        timestamp: '2026-09-29 09:45',
        note: 'Garments packaged in signature VELORA gift box with garment bag.',
        completed: true,
      },
      {
        status: 'Shipped',
        timestamp: '2026-09-29 16:20',
        note: 'Dispatched via BlueDart Express (Waybill #BD8892104).',
        completed: true,
      },
      {
        status: 'Out for Delivery',
        timestamp: 'Pending',
        note: 'Courier agent scheduled for local delivery.',
        completed: false,
      },
      {
        status: 'Delivered',
        timestamp: 'Estimated Oct 3, 2026',
        note: 'Package signed and delivered.',
        completed: false,
      },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'VEL-2026-8712',
    createdAt: '2026-09-15T11:00:00Z',
    items: [
      {
        productId: 'prod-f-002',
        name: 'Amalfi Suede Penny Loafers',
        brand: 'Calzature Nardi',
        image:
          'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=80',
        price: 9499,
        size: '42',
        color: 'Warm Taupe',
        quantity: 1,
      },
    ],
    customer: {
      name: 'Aditi Sharma',
      email: 'aditi.sharma@example.com',
      phone: '+91 98201 45678',
    },
    shippingAddress: {
      fullName: 'Aditi Sharma',
      street: '402 Regency Heights, Altamount Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      phone: '+91 98201 45678',
      country: 'India',
    },
    deliveryMethod: {
      id: 'standard',
      name: 'Standard Insured Shipping',
      price: 0,
      estimatedDays: '3-4 Business Days',
    },
    paymentMethod: {
      type: 'upi_demo',
      label: 'Demo UPI (velora@upi)',
    },
    subtotal: 9499,
    discount: 500,
    couponCode: 'FIRST500',
    shippingFee: 0,
    tax: 1080,
    total: 10079,
    status: 'Delivered',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2026-09-15 11:00',
        note: 'Order placed.',
        completed: true,
      },
      {
        status: 'Confirmed',
        timestamp: '2026-09-15 11:45',
        note: 'Order confirmed.',
        completed: true,
      },
      {
        status: 'Packed',
        timestamp: '2026-09-15 16:30',
        note: 'Handcrafted shoe dust bags applied.',
        completed: true,
      },
      {
        status: 'Shipped',
        timestamp: '2026-09-16 10:00',
        note: 'Shipped via priority air.',
        completed: true,
      },
      {
        status: 'Out for Delivery',
        timestamp: '2026-09-18 08:30',
        note: 'Out for delivery with courier.',
        completed: true,
      },
      {
        status: 'Delivered',
        timestamp: '2026-09-18 13:40',
        note: 'Successfully delivered to customer.',
        completed: true,
      },
    ],
  },
];

export const INITIAL_MOODBOARDS: Moodboard[] = [
  {
    id: 'mb-1',
    title: 'Winter Wardrobe',
    description: 'Tactile layers, plush cashmere knits, and tailored outerwear for cooler months.',
    coverImage:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80',
    productIds: ['prod-w-003', 'prod-w-005', 'prod-a-008', 'prod-f-001'],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-25T12:00:00Z',
  },
  {
    id: 'mb-2',
    title: 'Office Essentials',
    description: 'Polished power silhouettes, sharp pleats, and everyday luxury totes.',
    coverImage:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
    productIds: ['prod-w-001', 'prod-w-004', 'prod-a-001', 'prod-f-002'],
    createdAt: '2026-09-10T14:00:00Z',
    updatedAt: '2026-09-28T09:30:00Z',
  },
  {
    id: 'mb-3',
    title: 'Resort & Wedding Season',
    description: 'Golden hour silk slips, baroque pearls, and statement evening heels.',
    coverImage:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80',
    productIds: ['prod-w-002', 'prod-a-003', 'prod-a-007', 'prod-f-004'],
    createdAt: '2026-09-18T16:00:00Z',
    updatedAt: '2026-09-29T18:15:00Z',
  },
];

export const INITIAL_SAVED_OUTFITS: SavedOutfit[] = [
  {
    id: 'outfit-saved-1',
    name: 'Metropolitan Editorial Look',
    description: 'A structured blazer matched with wide trousers and loafers.',
    occasion: 'Office',
    style: 'Elegant',
    items: {
      top: INITIAL_PRODUCTS.find((p) => p.id === 'prod-w-001'),
      bottom: INITIAL_PRODUCTS.find((p) => p.id === 'prod-w-004'),
      shoes: INITIAL_PRODUCTS.find((p) => p.id === 'prod-f-002'),
      accessory: INITIAL_PRODUCTS.find((p) => p.id === 'prod-a-001'),
    },
    totalPrice: 42996,
    createdAt: '2026-09-20T10:00:00Z',
  },
];

export const INITIAL_PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'alert-1',
    productId: 'prod-w-001',
    productName: 'Atelier Double-Breasted Wool Blazer',
    productImage:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
    originalPrice: 15999,
    currentPrice: 12999,
    targetPrice: 12500,
    createdAt: '2026-09-22T08:00:00Z',
    isTriggered: false,
  },
  {
    id: 'alert-2',
    productId: 'prod-f-001',
    productName: 'Florence Chelsea Lug-Sole Boots',
    productImage:
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80',
    originalPrice: 14500,
    currentPrice: 11999,
    targetPrice: 12000,
    createdAt: '2026-09-24T11:00:00Z',
    isTriggered: true, // Triggered demo alert!
  },
];

export const INITIAL_REWARDS: VeloraRewards = {
  pointsBalance: 1450,
  tier: 'Gold',
  lifetimePoints: 2850,
  history: [
    {
      id: 'rw-1',
      date: '2026-09-28',
      description: 'Points earned from Order #VEL-2026-9841',
      points: 880,
      type: 'earned',
    },
    {
      id: 'rw-2',
      date: '2026-09-20',
      description: 'Redeemed ₹500 VIP Privilege Voucher',
      points: -500,
      type: 'redeemed',
    },
    {
      id: 'rw-3',
      date: '2026-09-15',
      description: 'Points earned from Order #VEL-2026-8712',
      points: 470,
      type: 'earned',
    },
    {
      id: 'rw-4',
      date: '2026-09-01',
      description: 'Welcome to Velora Rewards bonus',
      points: 600,
      type: 'earned',
    },
  ],
  unlockedBadges: [
    {
      id: 'b-connoisseur',
      title: 'Style Connoisseur',
      description: 'Unlocked Gold VIP Tier with over ₹25,000 in simulated wardrobe curations.',
      icon: 'Crown',
      unlockedAt: '2026-09-28',
    },
    {
      id: 'b-curator',
      title: 'Moodboard Master',
      description: 'Created 3 bespoke moodboard collections.',
      icon: 'Sparkles',
      unlockedAt: '2026-09-25',
    },
    {
      id: 'b-early',
      title: 'First Look Patron',
      description: 'Among the inaugural members of the Velora Private Atelier.',
      icon: 'ShieldCheck',
      unlockedAt: '2026-09-01',
    },
  ],
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'price_drop',
    title: 'Price Drop Alert',
    message: 'Florence Chelsea Lug-Sole Boots dropped to ₹11,999 (matches your target ₹12,000)!',
    timestamp: '2026-10-02T10:15:00Z',
    read: false,
    link: '/deals',
  },
  {
    id: 'notif-2',
    type: 'order_update',
    title: 'Order Shipped',
    message: 'Order #VEL-2026-9841 is in transit via BlueDart Express.',
    timestamp: '2026-09-29T16:20:00Z',
    read: false,
    link: '/orders/ord-1001',
  },
  {
    id: 'notif-3',
    type: 'reward',
    title: 'Gold Tier Status Achieved',
    message: 'Congratulations! You unlocked Gold Tier VIP perks including complimentary gift boxing and personal styling.',
    timestamp: '2026-09-28T14:35:00Z',
    read: true,
    link: '/rewards',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Welcome to VELORA',
    message: 'Explore the AI Personal Stylist and interactive Outfit Builder to craft your looks.',
    timestamp: '2026-09-01T09:00:00Z',
    read: true,
    link: '/ai-stylist',
  },
];
