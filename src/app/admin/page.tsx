'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Product, OrderStatus, Coupon, ProductCategory } from '@/types';

export default function AdminDashboardPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponActive,
  } = useVeloraStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons'>('overview');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    brand: 'VELORA Studio',
    category: 'Women' as ProductCategory,
    subcategory: 'Blazers',
    price: 9999,
    originalPrice: 12000,
    stock: 15,
    material: '100% Virgin Wool',
    care: 'Dry clean only.',
    description: 'Impeccable atelier craftsmanship.',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
  });

  // Coupon Add State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minCartAmount: 3000,
    expiryDate: '2026-12-31',
  });

  // Success flash
  const [adminFlash, setAdminFlash] = useState<string | null>(null);

  const showFlash = (msg: string) => {
    setAdminFlash(msg);
    setTimeout(() => setAdminFlash(null), 3000);
  };

  // Metrics
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const aov = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const lowStockProducts = useMemo(() => products.filter((p) => p.stock <= 10), [products]);

  // Analytics charts data
  const categoryData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [products]);

  const salesTrendData = [
    { month: 'Jun 26', sales: 48000 },
    { month: 'Jul 26', sales: 62000 },
    { month: 'Aug 26', sales: 89000 },
    { month: 'Sep 26', sales: 114000 },
    { month: 'Oct 26', sales: totalRevenue },
  ];

  const PIE_COLORS = ['#702C3B', '#B6A99A', '#171717', '#2E7658'];

  // Handle open add product
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdForm({
      name: '',
      brand: 'VELORA Studio',
      category: 'Women',
      subcategory: 'Blazers',
      price: 9999,
      originalPrice: 12000,
      stock: 15,
      material: '100% Virgin Wool',
      care: 'Dry clean only.',
      description: 'Impeccable atelier craftsmanship.',
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    });
    setIsProductModalOpen(true);
  };

  // Handle open edit product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock,
      material: p.material,
      care: p.care,
      description: p.description,
      imageUrl: p.images[0] || '',
    });
    setIsProductModalOpen(true);
  };

  // Submit product create/edit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodForm.name,
        brand: prodForm.brand,
        category: prodForm.category,
        subcategory: prodForm.subcategory,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        stock: Number(prodForm.stock),
        material: prodForm.material,
        care: prodForm.care,
        description: prodForm.description,
        images: [prodForm.imageUrl, prodForm.imageUrl],
      });
      showFlash(`Product "${prodForm.name}" updated successfully!`);
    } else {
      const slug = prodForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newP: Product = {
        id: `prod-custom-${Date.now()}`,
        slug,
        name: prodForm.name,
        brand: prodForm.brand,
        category: prodForm.category,
        subcategory: prodForm.subcategory,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        discount: Math.round(((prodForm.originalPrice - prodForm.price) / prodForm.originalPrice) * 100),
        rating: 5.0,
        reviewCount: 1,
        images: [prodForm.imageUrl, prodForm.imageUrl],
        description: prodForm.description,
        material: prodForm.material,
        care: prodForm.care,
        colors: [{ name: 'Classic Tone', hex: '#171717' }],
        sizes: ['XS', 'S', 'M', 'L'],
        stock: Number(prodForm.stock),
        tags: ['New Release', prodForm.category],
        isNew: true,
        occasion: ['Casual', 'Office'],
        styleTag: ['Contemporary', 'Minimal'],
        priceHistory: [{ date: 'Oct 2026', price: Number(prodForm.price) }],
      };
      addProduct(newP);
      showFlash(`Piece "${prodForm.name}" created and published to storefront!`);
    }

    setIsProductModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = (p: Product) => {
    if (confirm(`Are you sure you want to retire "${p.name}" from the atelier catalog?`)) {
      deleteProduct(p.id);
      showFlash(`Retired "${p.name}" from catalog.`);
    }
  };

  // Submit coupon
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    addCoupon({
      code: newCoupon.code.trim().toUpperCase(),
      description: newCoupon.description || 'Promotional Discount',
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minCartAmount: Number(newCoupon.minCartAmount),
      expiryDate: newCoupon.expiryDate,
      isActive: true,
    });

    showFlash(`Privilege coupon ${newCoupon.code.toUpperCase()} activated!`);
    setIsCouponModalOpen(false);
    setNewCoupon({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 15,
      minCartAmount: 3000,
      expiryDate: '2026-12-31',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Demo Notice Banner */}
      <div className="p-3 bg-stone-900 border border-stone-700 text-stone-200 rounded-xs flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>
            <strong>Atelier Admin Simulation Mode:</strong> Product edits, new coupons, and order status updates persist to LocalStorage and immediately synchronize with the storefront.
          </span>
        </div>
        <Link href="/" className="text-[#E9E2D8] hover:text-white underline hidden sm:inline">
          View Live Storefront →
        </Link>
      </div>

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2D8] pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#702C3B] font-semibold">
            Administrative Suite
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-0.5">
            VELORA Atelier Operations
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time catalog management, order fulfillment, and client privilege coupons.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-white border border-[#E9E2D8] rounded-xs text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              activeTab === 'overview' ? 'bg-[#171717] text-white font-semibold' : 'text-stone-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              activeTab === 'products' ? 'bg-[#171717] text-white font-semibold' : 'text-stone-700'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              activeTab === 'orders' ? 'bg-[#171717] text-white font-semibold' : 'text-stone-700'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3 py-1.5 rounded-xs transition-all ${
              activeTab === 'coupons' ? 'bg-[#171717] text-white font-semibold' : 'text-stone-700'
            }`}
          >
            Coupons ({coupons.length})
          </button>
        </div>
      </div>

      {/* Admin Flash Notification */}
      {adminFlash && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xs flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{adminFlash}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E9E2D8] p-5 rounded-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400">Total Revenue (Demo)</span>
              <p className="font-serif text-2xl font-bold text-stone-900">{formatCurrency(totalRevenue)}</p>
              <span className="text-[11px] text-[#2E7658] font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% vs last cycle
              </span>
            </div>

            <div className="bg-white border border-[#E9E2D8] p-5 rounded-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400">Total Commissions</span>
              <p className="font-serif text-2xl font-bold text-stone-900">{orders.length} Orders</p>
              <span className="text-[11px] text-stone-500 font-mono">
                {orders.filter((o) => o.status === 'Delivered').length} completed
              </span>
            </div>

            <div className="bg-white border border-[#E9E2D8] p-5 rounded-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400">Average Order Value</span>
              <p className="font-serif text-2xl font-bold text-stone-900">{formatCurrency(aov)}</p>
              <span className="text-[11px] text-stone-500 font-mono">Across simulated checkouts</span>
            </div>

            <div className="bg-white border border-[#E9E2D8] p-5 rounded-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400">Active Atelier Pieces</span>
              <p className="font-serif text-2xl font-bold text-stone-900">{products.length} Items</p>
              <span className="text-[11px] text-amber-700 font-mono">
                {lowStockProducts.length} low-stock alerts
              </span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Trend Chart */}
            <div className="lg:col-span-8 bg-white border border-[#E9E2D8] p-6 rounded-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D8]">
                <h3 className="font-serif text-base font-medium text-stone-900">
                  Gross Merchandise Value Trajectory
                </h3>
                <span className="text-xs font-mono text-stone-400">Monthly Index</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesTrendData}>
                    <XAxis dataKey="month" stroke="#78716C" fontSize={11} />
                    <YAxis
                      stroke="#78716C"
                      fontSize={11}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(val) => [formatCurrency(Number(val)), 'Sales']}
                      contentStyle={{
                        backgroundColor: '#171717',
                        border: 'none',
                        color: '#FFF',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="sales" fill="#702C3B" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="lg:col-span-4 bg-white border border-[#E9E2D8] p-6 rounded-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D8]">
                <h3 className="font-serif text-base font-medium text-stone-900">
                  Department Distribution
                </h3>
                <span className="text-xs font-mono text-stone-400">Inventory</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '11px', backgroundColor: '#171717', color: '#FFF' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Low Stock Alerts & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Low Stock */}
            <div className="lg:col-span-5 bg-white border border-[#E9E2D8] p-6 rounded-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E9E2D8]">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-base font-medium text-stone-900">
                  Inventory Attention Needed ({lowStockProducts.length})
                </h3>
              </div>

              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-10 relative bg-stone-100 rounded-xs overflow-hidden shrink-0">
                        <Image src={p.images[0]} alt="" fill sizes="32px" className="object-cover" />
                      </div>
                      <span className="font-medium text-stone-900 truncate max-w-[160px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-mono text-[10px] font-bold rounded">
                      Only {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="lg:col-span-7 bg-white border border-[#E9E2D8] p-6 rounded-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D8]">
                <h3 className="font-serif text-base font-medium text-stone-900">
                  Recent Commissions
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-mono text-[#702C3B] hover:underline"
                >
                  Manage All →
                </button>
              </div>

              <div className="divide-y divide-[#E9E2D8]">
                {orders.slice(0, 3).map((o) => (
                  <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-stone-900">{o.orderNumber}</span>
                      <span className="text-stone-400 font-mono block text-[10px]">
                        {o.customer.name} • {formatDate(o.createdAt)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-medium block">{formatCurrency(o.total)}</span>
                      <span className="text-[10px] font-mono text-[#2E7658]">{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT (CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Atelier Catalog ({products.length})
            </h3>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Creation</span>
            </button>
          </div>

          <div className="bg-white border border-[#E9E2D8] rounded-xs overflow-x-auto">
            <table className="w-full text-xs text-left text-stone-700">
              <thead className="bg-[#F8F6F1] font-mono uppercase text-[10px] text-stone-600 border-b border-[#E9E2D8]">
                <tr>
                  <th className="p-3">Piece</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E2D8]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-14 relative bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-[#E9E2D8]">
                        <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                      <div>
                        <span className="font-medium text-stone-900 block">{p.name}</span>
                        <span className="text-[10px] font-mono text-stone-400">{p.brand}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono">{p.category} / {p.subcategory}</td>
                    <td className="p-3 font-mono font-medium">{formatCurrency(p.price)}</td>
                    <td className="p-3 font-mono">
                      <span className={p.stock <= 10 ? 'text-amber-700 font-bold' : ''}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1.5 text-stone-600 hover:text-black hover:bg-stone-100 rounded"
                        title="Edit piece"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-stone-100 rounded"
                        title="Delete piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Client Commissions &amp; Fulfillment ({orders.length})
            </h3>
          </div>

          <div className="bg-white border border-[#E9E2D8] rounded-xs overflow-x-auto">
            <table className="w-full text-xs text-left text-stone-700">
              <thead className="bg-[#F8F6F1] font-mono uppercase text-[10px] text-stone-600 border-b border-[#E9E2D8]">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E2D8]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <Link
                        href={`/orders/${o.id}`}
                        className="font-mono font-bold text-[#702C3B] hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                      <span className="block text-[10px] text-stone-400 font-mono">
                        {formatDate(o.createdAt)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-stone-900 block">{o.customer.name}</span>
                      <span className="text-[10px] text-stone-400">{o.customer.email}</span>
                    </td>
                    <td className="p-3 font-mono font-medium">{formatCurrency(o.total)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#2E7658]/10 text-[#2E7658] font-mono text-[10px] font-bold rounded">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => {
                          updateOrderStatus(o.id, e.target.value as OrderStatus);
                          showFlash(`Order #${o.orderNumber} updated to ${e.target.value}`);
                        }}
                        className="bg-white border border-[#E9E2D8] p-1.5 text-xs rounded focus:outline-none focus:border-[#702C3B]"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Privilege Promo Codes ({coupons.length})
            </h3>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-5 bg-white border border-[#E9E2D8] rounded-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-stone-900">{c.code}</span>
                    <button
                      onClick={() => toggleCouponActive(c.code)}
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold rounded ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{c.description}</p>
                </div>

                <div className="pt-2 border-t border-[#E9E2D8] flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-500">Min Cart: {formatCurrency(c.minCartAmount)}</span>
                  <button
                    onClick={() => deleteCoupon(c.code)}
                    className="text-stone-400 hover:text-red-700"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-[#F8F6F1] p-6 rounded-sm max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E9E2D8] shadow-2xl z-10">
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-1">
              {editingProductId ? 'Edit Atelier Creation' : 'Publish New Atelier Creation'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Changes reflect across catalog, search, and checkout in real time.
            </p>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Piece Title</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                    placeholder="e.g. Atelier Silk Kimono"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Brand Maison</label>
                  <input
                    type="text"
                    required
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as ProductCategory })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={prodForm.subcategory}
                    onChange={(e) => setProdForm({ ...prodForm, subcategory: e.target.value })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                    placeholder="Blazers, Bags, Loafers..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={prodForm.originalPrice}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-600 mb-1">Image URL</label>
                <input
                  type="url"
                  value={prodForm.imageUrl}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs font-mono text-[11px]"
                  required
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-600 mb-1">Material Composition</label>
                <input
                  type="text"
                  value={prodForm.material}
                  onChange={(e) => setProdForm({ ...prodForm, material: e.target.value })}
                  className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E2D8]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-mono uppercase rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#702C3B] hover:bg-[#5A232F] text-white font-mono uppercase rounded-xs font-semibold"
                >
                  {editingProductId ? 'Update Piece' : 'Publish Piece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsCouponModalOpen(false)} />
          <div className="relative bg-[#F8F6F1] p-6 rounded-sm max-w-md w-full border border-[#E9E2D8] shadow-2xl z-10 text-xs">
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-1">
              Create Privilege Coupon
            </h3>

            <form onSubmit={handleCouponSubmit} className="space-y-3 mt-4">
              <div>
                <label className="block font-mono uppercase text-stone-600 mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXE25"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-600 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 25% off luxury outerwear"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-600 mb-1">Minimum Cart Amount (₹)</label>
                <input
                  type="number"
                  value={newCoupon.minCartAmount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minCartAmount: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E9E2D8] p-2 rounded-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#171717] text-white rounded-xs font-mono uppercase"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
