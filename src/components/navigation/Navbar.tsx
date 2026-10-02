'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Scale,
  Sparkles,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { MegaMenu } from './MegaMenu';
import { SearchOverlay } from './SearchOverlay';
import { NotificationCenter } from './NotificationCenter';
import { MobileDrawer } from './MobileDrawer';

export function Navbar() {
  const pathname = usePathname();
  const [activeMegaCategory, setActiveMegaCategory] = useState<
    'Women' | 'Men' | 'Accessories' | 'Collections' | null
  >(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { wishlist, cart, comparisonList } = useVeloraStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setActiveMegaCategory(null);
  }, [pathname]);

  const navLinks = [
    { label: 'New In', href: '/shop?filter=new', showOnLg: false },
    { label: 'Women', href: '/shop?category=Women', mega: 'Women' as const, showOnLg: true },
    { label: 'Men', href: '/shop?category=Men', mega: 'Men' as const, showOnLg: true },
    { label: 'Accessories', href: '/shop?category=Accessories', mega: 'Accessories' as const, showOnLg: true },
    { label: 'Collections', href: '/looks', mega: 'Collections' as const, showOnLg: true },
  ];

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F6F1]/95 backdrop-blur-md shadow-xs border-b border-[#E9E2D8]'
            : 'bg-[#F8F6F1] border-b border-[#E9E2D8]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 relative">
            {/* Left Column: Luxury Menu Button (Mobile) & Desktop Navigation */}
            <div className="flex items-center lg:flex-1 justify-start">
              {/* Luxury Menu Trigger Button (Smooth Drawer Opener) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-stone-800 hover:text-[#702C3B] hover:bg-stone-200/50 rounded-full transition-colors flex items-center gap-2 group"
                aria-label="Open menu navigation"
                title="Open menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between py-0.5">
                  <span className="w-5 h-[1.5px] bg-stone-800 rounded-full transition-all group-hover:bg-[#702C3B] group-hover:w-4" />
                  <span className="w-3.5 h-[1.5px] bg-stone-800 rounded-full transition-all group-hover:bg-[#702C3B] group-hover:w-5" />
                  <span className="w-5 h-[1.5px] bg-stone-800 rounded-full transition-all group-hover:bg-[#702C3B]" />
                </div>
                <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest font-mono text-stone-600 group-hover:text-[#702C3B]">
                  Menu
                </span>
              </button>

              {/* Desktop Mega Navigation - Balanced & Spaced */}
              <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
                {navLinks.map((link) => (
                  <div
                    key={link.label}
                    onMouseEnter={() => link.mega && setActiveMegaCategory(link.mega)}
                    className={`relative py-6 ${!link.showOnLg ? 'hidden xl:block' : 'block'}`}
                  >
                    <Link
                      href={link.href}
                      className={`text-xs uppercase font-medium tracking-[0.14em] transition-colors relative ${
                        pathname.startsWith(link.href.split('?')[0]) &&
                        link.href.split('?')[0] !== '/shop'
                          ? 'text-[#702C3B]'
                          : 'text-stone-800 hover:text-[#702C3B]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            {/* Center: Brand Wordmark (Strictly Centered on Viewport) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
              <Link href="/" className="group flex flex-col items-center text-center">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-[0.22em] sm:tracking-[0.28em] font-semibold text-[#171717] block transition-transform group-hover:scale-[1.01] whitespace-nowrap">
                  VELORA
                </span>
                <span className="text-[7.5px] sm:text-[9px] tracking-[0.22em] text-[#702C3B] uppercase font-mono block -mt-0.5 sm:-mt-1 font-medium whitespace-nowrap">
                  Style Beyond Ordinary
                </span>
              </Link>
            </div>

            {/* Right Column: Actions (Aligned with Consistent Spacing) */}
            <div className="flex items-center justify-end gap-1 sm:gap-2 lg:flex-1">
              {/* AI Stylist Highlight Link (Desktop) */}
              <Link
                href="/ai-stylist"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 mr-1 rounded-full text-xs uppercase font-medium tracking-wider bg-white border border-[#E9E2D8] text-[#702C3B] hover:border-[#702C3B] hover:shadow-2xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#702C3B]" />
                <span>AI Stylist</span>
              </Link>

              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors"
                aria-label="Search items"
                title="Search (Press / to search)"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Notification Center (visible on desktop/tablet) */}
              <div className="hidden sm:block">
                <NotificationCenter />
              </div>

              {/* Compare Pill (shows when items are in compare, desktop) */}
              <Link
                href="/compare"
                className="relative w-9 h-9 sm:w-10 sm:h-10 items-center justify-center text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors hidden md:flex"
                title="Product Comparison"
                aria-label="Compare products"
              >
                <Scale className="w-5 h-5" />
                {comparisonList.length > 0 && (
                  <span className="absolute 1 top-1 right-1 min-w-[15px] h-[15px] px-1 bg-[#171717] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {comparisonList.length}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors"
                aria-label="Wishlist"
                title="Wishlist & Moodboards"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 bg-[#702C3B] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-2xs pointer-events-none">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account (hidden on mobile, accessible in mobile drawer) */}
              <Link
                href="/account"
                className="w-9 h-9 sm:w-10 sm:h-10 items-center justify-center text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors hidden sm:flex"
                aria-label="User account"
                title="My Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Shopping Bag / Cart */}
              <Link
                href="/cart"
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors"
                aria-label="Shopping bag"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 bg-[#171717] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-2xs pointer-events-none">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* MegaMenu Dropdown */}
        <MegaMenu
          category={activeMegaCategory}
          onClose={() => setActiveMegaCategory(null)}
        />
      </header>

      {/* Live Search Modal Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Smooth Animated Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
}
