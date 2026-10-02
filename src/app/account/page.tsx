'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Package,
  Heart,
  MapPin,
  Layers,
  Bell,
  Crown,
  RotateCcw,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ShippingAddress } from '@/types';

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const {
    user,
    updateUserProfile,
    addAddress,
    removeAddress,
    orders,
    wishlist,
    savedOutfits,
    moodboards,
    priceAlerts,
    rewards,
    returns,
    resetDemoData,
    exportDemoData,
    importDemoData,
  } = useVeloraStore();

  // Profile Edit Form State
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileSaved, setProfileSaved] = useState(false);

  // New Address Modal State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: user.name,
    street: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: user.phone,
    country: 'India',
  });

  // Settings status
  const [importJsonText, setImportJsonText] = useState('');
  const [maintenanceMsg, setMaintenanceMsg] = useState<{ text: string; isError?: boolean } | null>(
    null
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) return;
    addAddress(newAddr);
    setIsAddAddressOpen(false);
    setNewAddr({
      fullName: user.name,
      street: '',
      apartment: '',
      city: '',
      state: '',
      pincode: '',
      phone: user.phone,
      country: 'India',
    });
  };

  const handleExportData = () => {
    const dataStr = exportDemoData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `velora-demo-export-${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMaintenanceMsg({ text: 'Atelier demo data exported successfully as JSON!' });
    setTimeout(() => setMaintenanceMsg(null), 3000);
  };

  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const res = importDemoData(importJsonText);
    if (res.success) {
      setMaintenanceMsg({ text: res.message });
      setImportJsonText('');
    } else {
      setMaintenanceMsg({ text: res.message, isError: true });
    }
    setTimeout(() => setMaintenanceMsg(null), 4000);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all demo data (orders, catalog changes, rewards, moodboards) to initial defaults?')) {
      resetDemoData();
      setMaintenanceMsg({ text: 'All demo data has been reset to factory defaults.' });
      setTimeout(() => setMaintenanceMsg(null), 3000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Client Profile', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: `Orders (${orders.length})`, icon: <Package className="w-4 h-4" /> },
    { id: 'addresses', label: `Addresses (${user.addresses.length})`, icon: <MapPin className="w-4 h-4" /> },
    { id: 'outfits', label: `Saved Outfits (${savedOutfits.length})`, icon: <Layers className="w-4 h-4" /> },
    { id: 'rewards', label: `Rewards (${rewards.pointsBalance} pts)`, icon: <Crown className="w-4 h-4" /> },
    { id: 'returns', label: `Returns (${returns.length})`, icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'settings', label: 'Data & Maintenance', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E9E2D8] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#702C3B] font-semibold">
            Private Client Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-0.5">
            My Account
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Simulated client session for {user.name} ({rewards.tier} Tier Patron).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Atelier Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Tabbed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1 bg-white border border-[#E9E2D8] p-3 rounded-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-medium text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-[#F8F6F1] hover:text-black'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-white border border-[#E9E2D8] p-6 sm:p-8 rounded-sm">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <div className="border-b border-[#E9E2D8] pb-3">
                <h3 className="font-serif text-xl font-medium text-stone-900">
                  Client Profile Coordinates
                </h3>
                <p className="text-xs text-stone-500">
                  Manage your personal details for orders and concierge invitations.
                </p>
              </div>

              {profileSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9E2D8] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Order History ({orders.length})
                  </h3>
                  <p className="text-xs text-stone-500">Track and review previous wardrobe commissions.</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-6">No orders placed yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="border border-[#E9E2D8] p-4 sm:p-5 rounded-xs space-y-4 bg-[#F8F6F1]/40"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9E2D8] pb-3 text-xs">
                        <div>
                          <span className="font-mono font-bold text-stone-900 text-sm">
                            {ord.orderNumber}
                          </span>
                          <span className="text-stone-400 font-mono block text-[10px]">
                            Placed on {formatDate(ord.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 bg-[#2E7658]/10 text-[#2E7658] font-mono text-xs font-semibold rounded">
                            {ord.status}
                          </span>
                          <span className="font-serif font-semibold text-stone-900 text-sm">
                            {formatCurrency(ord.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {ord.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-2 bg-white border border-[#E9E2D8] rounded-xs shrink-0 max-w-xs"
                          >
                            <div className="w-10 h-14 relative rounded-xs overflow-hidden bg-stone-100 shrink-0">
                              <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                            </div>
                            <div className="min-w-0 text-xs">
                              <p className="font-medium text-stone-900 truncate">{item.name}</p>
                              <span className="text-[10px] text-stone-400 font-mono">
                                Size: {item.size} • Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                          href={`/returns?orderId=${ord.id}`}
                          className="px-3 py-1.5 border border-[#E9E2D8] hover:border-black text-stone-700 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors"
                        >
                          Request Return
                        </Link>
                        <Link
                          href={`/orders/${ord.id}`}
                          className="px-4 py-1.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors"
                        >
                          Track Journey →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9E2D8] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Saved Shipping Addresses
                  </h3>
                  <p className="text-xs text-stone-500">Coordinates for courier dispatches.</p>
                </div>

                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="px-3 py-1.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs space-y-2 text-xs relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{addr.fullName}</span>
                      {user.addresses.length > 1 && (
                        <button
                          onClick={() => removeAddress(idx)}
                          className="text-stone-400 hover:text-red-700"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-stone-600">{addr.street}</p>
                    {addr.apartment && <p className="text-stone-600">{addr.apartment}</p>}
                    <p className="text-stone-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="font-mono text-stone-400 text-[11px] pt-1">{addr.phone}</p>
                  </div>
                ))}
              </div>

              {/* Add Address Dialog */}
              {isAddAddressOpen && (
                <form
                  onSubmit={handleAddAddressSubmit}
                  className="mt-6 p-4 border border-[#702C3B] bg-white rounded-xs space-y-3"
                >
                  <h4 className="font-serif text-base font-medium">New Address</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="col-span-2 bg-[#F8F6F1] p-2 border border-[#E9E2D8] rounded-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="bg-[#F8F6F1] p-2 border border-[#E9E2D8] rounded-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="bg-[#F8F6F1] p-2 border border-[#E9E2D8] rounded-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      className="bg-[#F8F6F1] p-2 border border-[#E9E2D8] rounded-xs"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="bg-[#F8F6F1] p-2 border border-[#E9E2D8] rounded-xs"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(false)}
                      className="px-3 py-1.5 border border-stone-300 text-xs font-mono uppercase rounded-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#702C3B] text-white text-xs font-mono uppercase rounded-xs"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: SAVED OUTFITS */}
          {activeTab === 'outfits' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9E2D8] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Saved Outfits ({savedOutfits.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Ensembles composed in the Outfit Studio or generated by AI Stylist.
                  </p>
                </div>
                <Link
                  href="/outfit-studio"
                  className="px-3 py-1.5 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
                >
                  Open Studio
                </Link>
              </div>

              {savedOutfits.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-6">No saved outfits found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedOutfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      className="p-4 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-base font-medium text-stone-900">
                          {outfit.name}
                        </h4>
                        <span className="font-mono text-xs font-semibold text-stone-900">
                          {formatCurrency(outfit.totalPrice)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {Object.values(outfit.items)
                          .filter(Boolean)
                          .map((item, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-16 relative rounded-xs overflow-hidden bg-stone-100 border border-[#E9E2D8]"
                            >
                              <Image src={item!.images[0]} alt="" fill sizes="48px" className="object-cover" />
                            </div>
                          ))}
                      </div>

                      <Link
                        href="/outfit-studio"
                        className="inline-block text-xs font-mono uppercase text-[#702C3B] hover:underline"
                      >
                        Open in Studio →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: REWARDS */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9E2D8] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Rewards Club Tier &amp; Points
                  </h3>
                  <p className="text-xs text-stone-500">
                    Current balance: {rewards.pointsBalance} Points • Tier: {rewards.tier}
                  </p>
                </div>
                <Link
                  href="/rewards"
                  className="px-3 py-1.5 bg-[#702C3B] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
                >
                  Redeem Rewards
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">Balance</span>
                  <span className="font-serif text-2xl font-bold text-stone-900">{rewards.pointsBalance}</span>
                </div>
                <div className="p-4 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">Tier</span>
                  <span className="font-serif text-2xl font-bold text-[#702C3B]">{rewards.tier}</span>
                </div>
                <div className="p-4 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">Lifetime</span>
                  <span className="font-serif text-2xl font-bold text-stone-900">{rewards.lifetimePoints}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RETURNS */}
          {activeTab === 'returns' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9E2D8] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Return Inquiries ({returns.length})
                  </h3>
                  <p className="text-xs text-stone-500">Doorstep pickups and digital credits.</p>
                </div>
                <Link
                  href="/returns"
                  className="px-3 py-1.5 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
                >
                  File Return
                </Link>
              </div>

              {returns.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-6">No return requests submitted.</p>
              ) : (
                <div className="space-y-3">
                  {returns.map((ret) => (
                    <div
                      key={ret.id}
                      className="p-4 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-stone-900">{ret.id}</span>
                        <p className="font-medium text-stone-800">{ret.item.name}</p>
                        <p className="text-[11px] text-stone-500">Reason: {ret.reason}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-mono text-[10px] font-bold rounded">
                          {ret.status}
                        </span>
                        <span className="font-mono text-stone-700 block mt-1">
                          {formatCurrency(ret.refundAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SETTINGS & MAINTENANCE (Reset, Export, Import) */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="border-b border-[#E9E2D8] pb-3">
                <h3 className="font-serif text-xl font-medium text-stone-900">
                  Demo Data Maintenance &amp; Synchronization
                </h3>
                <p className="text-xs text-stone-500">
                  Backup your custom moodboards and orders, import scenarios, or restore the initial portfolio catalog.
                </p>
              </div>

              {maintenanceMsg && (
                <div
                  className={`p-3 text-xs rounded-xs flex items-center gap-2 ${
                    maintenanceMsg.isError
                      ? 'bg-red-50 border border-red-300 text-red-800'
                      : 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                  }`}
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{maintenanceMsg.text}</span>
                </div>
              )}

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-[#E9E2D8] bg-[#F8F6F1] rounded-xs space-y-2">
                  <div className="flex items-center gap-2 font-serif text-base font-medium">
                    <Download className="w-4 h-4 text-[#702C3B]" />
                    <h4>Export Demo JSON</h4>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Download an offline copy of all your custom outfits, orders, price watches, and moodboards.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="mt-2 px-4 py-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>

                <div className="p-5 border border-red-200 bg-red-50/50 rounded-xs space-y-2">
                  <div className="flex items-center gap-2 font-serif text-base font-medium text-red-900">
                    <RefreshCw className="w-4 h-4 text-red-700" />
                    <h4>Reset Demo Data</h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Restore the application state to original factory defaults (clears orders &amp; reverts catalog edits).
                  </p>
                  <button
                    onClick={handleResetData}
                    className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Data</span>
                  </button>
                </div>
              </div>

              {/* Import JSON Form */}
              <div className="border border-[#E9E2D8] p-5 rounded-xs space-y-3">
                <div className="flex items-center gap-2 font-serif text-base font-medium">
                  <Upload className="w-4 h-4 text-[#702C3B]" />
                  <h4>Import Demo JSON Payload</h4>
                </div>
                <p className="text-xs text-stone-500">
                  Paste a previously exported VELORA JSON payload below to reconstruct state.
                </p>

                <form onSubmit={handleImportData} className="space-y-3">
                  <textarea
                    rows={4}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"products": [...], "orders": [...]}'
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-xs font-mono rounded-xs focus:outline-none focus:border-[#702C3B]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import State</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="font-serif text-xl text-stone-600">Accessing Client Portal...</p>
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
