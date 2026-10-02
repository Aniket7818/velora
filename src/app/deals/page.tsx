'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Tag,
  Clock,
  Bell,
  Trash2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency } from '@/lib/utils/formatters';
import { ProductCard } from '@/components/product/ProductCard';

export default function DealsAndPriceWatchPage() {
  const { products, priceAlerts, removePriceAlert, addNotification } = useVeloraStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [testAlertTriggered, setTestAlertTriggered] = useState(false);

  // Deal Countdown Timer (Simulated 48-Hour Archive Drop)
  const [timeLeft, setTimeLeft] = useState({
    hours: 28,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 48, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter discounted items
  const discountedProducts = products.filter((p) => {
    if (!p.isSale && !p.discount) return false;
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    return true;
  });

  // Simulated Price Drop trigger button
  const handleSimulateDrop = () => {
    addNotification({
      type: 'price_drop',
      title: 'Flash Atelier Price Drop!',
      message: 'Atelier Double-Breasted Wool Blazer was just reduced by an additional 10%!',
      link: '/product/atelier-double-breasted-wool-blazer',
    });
    setTestAlertTriggered(true);
    setTimeout(() => setTestAlertTriggered(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2D8] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
            <Tag className="w-4 h-4" />
            <span>Market Radar &amp; Watchlist</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
            Price Watch &amp; Deal Radar
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track historical valuations, set price drop triggers, and explore limited seasonal archive discounts.
          </p>
        </div>

        <button
          onClick={handleSimulateDrop}
          className="px-4 py-2 bg-white border border-[#702C3B] hover:bg-[#702C3B] hover:text-white text-[#702C3B] text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{testAlertTriggered ? 'Alert Dispatched!' : 'Simulate Price Drop Event'}</span>
        </button>
      </div>

      {/* 48-Hour Archive Flash Event Countdown Box */}
      <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-sm border border-[#2A2A2A] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#702C3B] text-white text-[10px] font-mono uppercase tracking-widest rounded-xs">
            <span>Autumn Atelier Flash Access</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light">
            Seasonal Archive Privilege Drop
          </h2>
          <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
            Up to 25% off selected Italian tailoring, French linen vests, and Tuscan suede footwear.
            Prices revert automatically when the atelier timer concludes.
          </p>
        </div>

        <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-3 text-center font-mono">
          <div className="bg-stone-900 border border-stone-800 p-3 rounded-xs min-w-16">
            <span className="font-serif text-2xl font-bold text-white block">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-stone-400">Hours</span>
          </div>
          <span className="text-stone-500 font-bold">:</span>
          <div className="bg-stone-900 border border-stone-800 p-3 rounded-xs min-w-16">
            <span className="font-serif text-2xl font-bold text-white block">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-stone-400">Mins</span>
          </div>
          <span className="text-stone-500 font-bold">:</span>
          <div className="bg-stone-900 border border-stone-800 p-3 rounded-xs min-w-16">
            <span className="font-serif text-2xl font-bold text-[#E9E2D8] block">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-stone-400">Secs</span>
          </div>
        </div>
      </div>

      {/* Active Price Alerts Tracker */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9E2D8] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#702C3B]" />
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Active Price Watch Alerts ({priceAlerts.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Monitored in local browser session
          </span>
        </div>

        {priceAlerts.length === 0 ? (
          <div className="bg-white border border-[#E9E2D8] p-8 text-center rounded-sm text-stone-500">
            <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2 stroke-[1.2]" />
            <p className="font-serif text-base text-stone-800">No Active Price Watches</p>
            <p className="text-xs text-stone-400 mt-1">
              Visit any garment detail page and click &quot;Watch Price&quot; to set target drop notifications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {priceAlerts.map((alert) => {
              const diff = alert.currentPrice - alert.targetPrice;
              const isMet = alert.currentPrice <= alert.targetPrice;

              return (
                <div
                  key={alert.id}
                  className="bg-white border border-[#E9E2D8] p-4 rounded-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-18 relative rounded-xs overflow-hidden bg-stone-100 shrink-0">
                      <Image
                        src={alert.productImage}
                        alt={alert.productName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-medium text-stone-900 line-clamp-1">
                        {alert.productName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-mono mt-1">
                        <span className="text-stone-500">
                          Current: {formatCurrency(alert.currentPrice)}
                        </span>
                        <span>•</span>
                        <span className="text-[#702C3B] font-semibold">
                          Target: {formatCurrency(alert.targetPrice)}
                        </span>
                      </div>
                      <div className="mt-1">
                        {isMet ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                            Target Price Reached!
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-stone-400">
                            {formatCurrency(diff)} above your target
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removePriceAlert(alert.id)}
                    className="p-2 text-stone-400 hover:text-red-700 transition-colors"
                    title="Remove alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Discounted Catalog Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2D8] pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
              Live Deals
            </span>
            <h3 className="font-serif text-2xl text-stone-900 font-normal mt-0.5">
              Current Seasonal Reductions ({discountedProducts.length})
            </h3>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['All', 'Women', 'Men', 'Accessories', 'Footwear'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'border-[#171717] bg-[#171717] text-white'
                    : 'border-[#E9E2D8] bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
