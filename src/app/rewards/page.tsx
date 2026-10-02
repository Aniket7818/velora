'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Gift,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export default function RewardsClubPage() {
  const { rewards, redeemCouponWithPoints } = useVeloraStore();
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Tier calculation & progress
  const tiers = [
    { name: 'Silver', min: 0, max: 2000, perks: ['Earn 5% points on purchases', 'Seasonal private preview', 'Complimentary gift packaging'] },
    { name: 'Gold', min: 2000, max: 5000, perks: ['Earn 8% points on purchases', 'Complimentary express courier', 'Exclusive AI stylist sessions', 'Birthday privilege reward'] },
    { name: 'Platinum', min: 5000, max: 10000, perks: ['Earn 10% points on purchases', 'White-glove concierge on call', 'Bespoke tailoring consultation', 'Inaugural collection previews'] },
  ];

  const currentTierObj = tiers.find((t) => t.name === rewards.tier) || tiers[0];
  const nextTierObj = rewards.tier === 'Silver' ? tiers[1] : rewards.tier === 'Gold' ? tiers[2] : null;

  const pointsToNext = nextTierObj ? Math.max(0, nextTierObj.min - rewards.lifetimePoints) : 0;
  const progressPercent = nextTierObj
    ? Math.min(100, Math.round(((rewards.lifetimePoints - currentTierObj.min) / (nextTierObj.min - currentTierObj.min)) * 100))
    : 100;

  const redeemOptions = [
    { points: 500, discount: 500, title: '₹500 Atelier Privilege Voucher', desc: 'Valid on orders over ₹1,500' },
    { points: 1000, discount: 1200, title: '₹1,200 Luxury Wardrobe Voucher', desc: 'Valid on orders over ₹3,600' },
    { points: 2000, discount: 2500, title: '₹2,500 Sartorial VIP Voucher', desc: 'Valid on orders over ₹7,500' },
  ];

  const handleRedeem = (pointsCost: number, discountValue: number) => {
    setRedeemError(null);
    setRedeemSuccess(null);
    const success = redeemCouponWithPoints(pointsCost, discountValue);
    if (success) {
      setRedeemSuccess(`Successfully redeemed ${pointsCost} points for ₹${discountValue} voucher! Code added to your account.`);
      setTimeout(() => setRedeemSuccess(null), 5000);
    } else {
      setRedeemError(`Insufficient points. You need ${pointsCost} points to claim this privilege.`);
      setTimeout(() => setRedeemError(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-[#E9E2D8] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <Crown className="w-4 h-4" />
          <span>Privilege Society</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
          Velora Rewards Club
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Our loyalty circle rewarding patrons with bespoke privilege vouchers, private previews, and white-glove styling.
        </p>
      </div>

      {/* Member Status Card */}
      <div className="bg-[#171717] text-white p-8 sm:p-12 rounded-sm border border-[#2A2A2A] relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#702C3B] text-white text-[10px] font-mono uppercase tracking-widest rounded-xs font-bold">
                {rewards.tier} Tier Patron
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Member ID: #VEL-VIP-7049
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-light">
              Welcome back, Aditi Sharma
            </h2>

            <p className="text-xs text-stone-300 max-w-lg leading-relaxed font-light">
              You are currently enjoying <strong>{rewards.tier} Tier</strong> privileges including
              complimentary express delivery and priority atelier allocations.
            </p>

            {nextTierObj && (
              <div className="pt-2 max-w-md space-y-2">
                <div className="flex justify-between text-xs font-mono text-stone-300">
                  <span>Progress to {nextTierObj.name}</span>
                  <span>{pointsToNext} points remaining</span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B6A99A] h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center">
            <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-xs text-left lg:text-right min-w-[240px]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B6A99A] block">
                Available Reward Points
              </span>
              <span className="font-serif text-4xl font-medium text-white block mt-1">
                {rewards.pointsBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-stone-400 block mt-1 font-mono">
                Lifetime: {rewards.lifetimePoints.toLocaleString('en-IN')} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Vouchers Section */}
      <section className="space-y-6">
        <div className="border-b border-[#E9E2D8] pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
              Privilege Redemptions
            </span>
            <h3 className="font-serif text-2xl text-stone-900 font-normal mt-0.5">
              Redeem Points for Atelier Vouchers
            </h3>
          </div>
        </div>

        {redeemSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{redeemSuccess}</span>
          </div>
        )}

        {redeemError && (
          <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xs flex items-center gap-2">
            <span>{redeemError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {redeemOptions.map((opt) => {
            const canAfford = rewards.pointsBalance >= opt.points;
            return (
              <div
                key={opt.points}
                className="bg-white border border-[#E9E2D8] p-6 rounded-sm flex flex-col justify-between space-y-4 hover:border-[#B6A99A] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#F8F6F1] border border-[#E9E2D8] text-[10px] font-mono uppercase text-stone-600 rounded">
                      {opt.points} Points
                    </span>
                    <Gift className="w-4 h-4 text-[#702C3B]" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-stone-900">
                    {opt.title}
                  </h4>
                  <p className="text-xs text-stone-500">{opt.desc}</p>
                </div>

                <button
                  onClick={() => handleRedeem(opt.points, opt.discount)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 px-4 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors font-semibold ${
                    canAfford
                      ? 'bg-[#171717] hover:bg-[#2A2A2A] text-white'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem Voucher' : `Needs ${opt.points - rewards.pointsBalance} More Pts`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tier Benefits Comparison */}
      <section className="space-y-6">
        <div className="border-b border-[#E9E2D8] pb-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
            Privilege Levels
          </span>
          <h3 className="font-serif text-2xl text-stone-900 font-normal mt-0.5">
            Society Tiers &amp; Curated Privileges
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => {
            const isCurrent = t.name === rewards.tier;
            return (
              <div
                key={t.name}
                className={`p-6 rounded-sm border transition-all ${
                  isCurrent
                    ? 'bg-white border-[#702C3B] shadow-md ring-1 ring-[#702C3B]'
                    : 'bg-[#F8F6F1] border-[#E9E2D8]'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E2D8]">
                  <div>
                    <span className="font-serif text-xl font-medium text-stone-900">
                      {t.name}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 block">
                      {t.min.toLocaleString('en-IN')}+ Lifetime Points
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 bg-[#702C3B] text-white text-[9px] font-mono uppercase tracking-wider font-bold rounded">
                      Current
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-2.5 text-xs text-stone-700">
                  {t.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7658] shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Unlocked Badges & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Badges */}
        <div className="lg:col-span-5 bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E9E2D8]">
            <Award className="w-4 h-4 text-[#702C3B]" />
            <h4 className="font-serif text-lg font-medium text-stone-900">
              Curator Achievements ({rewards.unlockedBadges.length})
            </h4>
          </div>

          <div className="space-y-3">
            {rewards.unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 bg-[#F8F6F1] rounded-xs border border-[#E9E2D8] flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-[#E9E2D8] flex items-center justify-center shrink-0 text-[#702C3B]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-serif text-sm font-medium text-stone-900">
                    {badge.title}
                  </h5>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                  <span className="text-[9px] font-mono text-stone-400 mt-1 block">
                    Unlocked: {formatDate(badge.unlockedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-7 bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E2D8]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-500" />
              <h4 className="font-serif text-lg font-medium text-stone-900">
                Points Activity Log
              </h4>
            </div>
            <span className="text-xs font-mono text-stone-400">Recent Transactions</span>
          </div>

          <div className="divide-y divide-[#E9E2D8]">
            {rewards.history.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-stone-900">{tx.description}</p>
                  <span className="text-[10px] font-mono text-stone-400">
                    {formatDate(tx.date)}
                  </span>
                </div>
                <span
                  className={`font-mono font-semibold ${
                    tx.points > 0 ? 'text-[#2E7658]' : 'text-[#702C3B]'
                  }`}
                >
                  {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
