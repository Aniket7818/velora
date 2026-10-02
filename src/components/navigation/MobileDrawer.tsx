'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  ShoppingBag,
  Heart,
  Scale,
  Gift,
  ShieldCheck,
  Tag,
  User,
  LayoutDashboard,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { SITE_CONFIG } from '@/config/site';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export function MobileDrawer({ isOpen, onClose, onOpenSearch }: MobileDrawerProps) {
  const { wishlist, cart, comparisonList } = useVeloraStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Dimmed backdrop with smooth fade */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer content with luxury slide-in spring physics */}
          <motion.div
            key="drawer-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 280,
              mass: 0.85,
            }}
            className="relative ml-0 mr-auto w-[86vw] max-w-sm bg-[#F8F6F1] h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="p-5 flex items-center justify-between border-b border-[#E9E2D8] bg-[#F8F6F1] sticky top-0 z-10">
              <Link href="/" onClick={onClose} className="flex flex-col">
                <span className="font-serif text-2xl tracking-[0.25em] text-[#171717] font-semibold">
                  VELORA
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#702C3B] font-mono">
                  Style Beyond Ordinary
                </span>
              </Link>

              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-black rounded-full hover:bg-stone-200 transition-colors border border-stone-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Tap Button */}
            {onOpenSearch && (
              <div className="p-4 border-b border-[#E9E2D8] bg-white">
                <button
                  onClick={() => {
                    onClose();
                    onOpenSearch();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-[#F8F6F1] rounded-md text-stone-500 text-xs hover:text-stone-800 transition-colors border border-[#E9E2D8]"
                >
                  <Search className="w-4 h-4 text-stone-400" />
                  <span>Search cashmere, silk, bags, coats...</span>
                </button>
              </div>
            )}

            {/* Quick Utility Strip */}
            <div className="grid grid-cols-3 divide-x divide-[#E9E2D8] border-b border-[#E9E2D8] bg-white text-center py-3 text-xs font-medium text-stone-700">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex flex-col items-center gap-1 hover:text-[#702C3B] py-1 transition-colors"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 bg-[#171717] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span>Bag</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex flex-col items-center gap-1 hover:text-[#702C3B] py-1 transition-colors"
              >
                <div className="relative">
                  <Heart className="w-4 h-4" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 bg-[#702C3B] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </Link>

              <Link
                href="/compare"
                onClick={onClose}
                className="flex flex-col items-center gap-1 hover:text-[#702C3B] py-1 transition-colors"
              >
                <div className="relative">
                  <Scale className="w-4 h-4" />
                  {comparisonList.length > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 bg-[#702C3B] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                      {comparisonList.length}
                    </span>
                  )}
                </div>
                <span>Compare</span>
              </Link>
            </div>

            {/* Primary Navigation Links */}
            <div className="p-5 space-y-6 flex-1">
              <div>
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#702C3B] font-semibold mb-3">
                  Collections & Catalog
                </h5>
                <div className="space-y-2.5 text-base font-serif text-stone-800">
                  <Link
                    href="/shop?filter=new"
                    onClick={onClose}
                    className="flex items-center justify-between hover:text-[#702C3B] transition-colors py-1"
                  >
                    <span>New Arrivals</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#702C3B] text-white font-mono uppercase tracking-wider font-semibold rounded-2xs">
                      New
                    </span>
                  </Link>
                  <Link
                    href="/shop?category=Women"
                    onClick={onClose}
                    className="block hover:text-[#702C3B] transition-colors py-1"
                  >
                    Women’s Atelier
                  </Link>
                  <Link
                    href="/shop?category=Men"
                    onClick={onClose}
                    className="block hover:text-[#702C3B] transition-colors py-1"
                  >
                    Men’s Sartorial
                  </Link>
                  <Link
                    href="/shop?category=Accessories"
                    onClick={onClose}
                    className="block hover:text-[#702C3B] transition-colors py-1"
                  >
                    Leather & Fine Accessories
                  </Link>
                  <Link
                    href="/shop?category=Footwear"
                    onClick={onClose}
                    className="block hover:text-[#702C3B] transition-colors py-1"
                  >
                    Tuscan Footwear
                  </Link>
                  <Link
                    href="/looks"
                    onClick={onClose}
                    className="block hover:text-[#702C3B] transition-colors py-1"
                  >
                    Shop the Look (Editorials)
                  </Link>
                </div>
              </div>

              {/* Signature Interactive Experiences */}
              <div className="pt-4 border-t border-[#E9E2D8]">
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#702C3B] font-semibold mb-3">
                  Signature Experiences
                </h5>
                <div className="space-y-2.5 text-sm text-stone-800 font-medium">
                  <Link
                    href="/ai-stylist"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#E9E2D8] hover:border-[#702C3B] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#702C3B]/10 flex items-center justify-center text-[#702C3B] group-hover:bg-[#702C3B] group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 group-hover:text-[#702C3B] transition-colors">
                        AI Personal Stylist
                      </div>
                      <div className="text-[11px] text-stone-500 font-normal">
                        Occasion & palette outfit generator
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/outfit-studio"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#E9E2D8] hover:border-[#702C3B] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-[#702C3B] group-hover:text-white transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 group-hover:text-[#702C3B] transition-colors">
                        Outfit Builder Studio
                      </div>
                      <div className="text-[11px] text-stone-500 font-normal">
                        Interactive canvas mix & match
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/gift-finder"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2 text-stone-700 hover:text-[#702C3B] transition-colors"
                  >
                    <Gift className="w-4 h-4 text-[#B6A99A]" />
                    <span>Gift Finder Assistant</span>
                  </Link>

                  <Link
                    href="/deals"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2 text-stone-700 hover:text-[#702C3B] transition-colors"
                  >
                    <Tag className="w-4 h-4 text-[#B6A99A]" />
                    <span>Price Watch & Deal Radar</span>
                  </Link>

                  <Link
                    href="/rewards"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2 text-stone-700 hover:text-[#702C3B] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#B6A99A]" />
                    <span>Velora Rewards Club</span>
                  </Link>
                </div>
              </div>

              {/* Account & Administration */}
              <div className="pt-4 border-t border-[#E9E2D8]">
                <h5 className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-semibold mb-3">
                  Client Services & Management
                </h5>
                <div className="space-y-2 text-xs text-stone-700">
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-1.5 hover:text-black transition-colors"
                  >
                    <User className="w-4 h-4 text-stone-400" />
                    <span>My Client Account & Orders</span>
                  </Link>
                  <Link
                    href="/returns"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-1.5 hover:text-black transition-colors"
                  >
                    <Layers className="w-4 h-4 text-stone-400" />
                    <span>Simulated Returns Portal</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-1.5 hover:text-[#702C3B] font-semibold text-[#702C3B] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#702C3B]" />
                    <span>Atelier Admin Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer in Drawer with Mandatory Attribution */}
            <div className="p-5 border-t border-[#E9E2D8] bg-[#E9E2D8]/40 text-center space-y-1.5">
              <p className="text-[10px] text-stone-500 font-mono">
                Velora Haute Couture Demo Portfolio
              </p>
              <p className="text-[11px] text-stone-600 font-serif">
                Designed & Developed by{' '}
                <a
                  href={SITE_CONFIG.creator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-stone-900 underline underline-offset-2 hover:text-[#702C3B] inline-flex items-center gap-1"
                >
                  {SITE_CONFIG.creator.name}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
