'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    try {
      const existing = JSON.parse(localStorage.getItem('velora_newsletter_subscribers') || '[]');
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem('velora_newsletter_subscribers', JSON.stringify(existing));
      }
    } catch {}
  };

  return (
    <footer className="bg-[#171717] text-[#F8F6F1] border-t border-stone-800">
      {/* Guarantees Bar */}
      <div className="border-b border-stone-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#B6A99A]" />
            </div>
            <div>
              <h5 className="font-serif text-sm font-medium">Complimentary Courier</h5>
              <p className="text-xs text-stone-400">Insured delivery on orders above ₹2,499</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-[#B6A99A]" />
            </div>
            <div>
              <h5 className="font-serif text-sm font-medium">14-Day Atelier Returns</h5>
              <p className="text-xs text-stone-400">Effortless pickup and digital credit</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#B6A99A]" />
            </div>
            <div>
              <h5 className="font-serif text-sm font-medium">Authenticity Guaranteed</h5>
              <p className="text-xs text-stone-400">Crafted from certified noble materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Intro & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.3em] font-semibold text-white">
                VELORA
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-[#B6A99A] font-mono mt-0.5">
                {SITE_CONFIG.tagline}
              </span>
            </Link>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              An elevated sartorial destination merging timeless tailoring, noble fibers, and
              intelligent styling technology.
            </p>

            <div className="pt-2">
              <h5 className="text-xs uppercase font-mono tracking-widest text-stone-200 mb-2">
                Join the Private Atelier Gazette
              </h5>
              <p className="text-[11px] text-stone-400 mb-3">
                Receive inaugural seasonal collection previews, private sales, and styling editorials.
              </p>

              {subscribed ? (
                <div className="p-3 bg-stone-900 border border-[#2E7658] rounded text-[#2E7658] flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Welcome to VELORA. Your privilege invitation has been logged.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-1">
                  <div className="flex max-w-sm">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="bg-stone-900 border border-stone-700 text-xs px-3 py-2.5 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#B6A99A] flex-1 rounded-l-sm"
                    />
                    <button
                      type="submit"
                      className="bg-[#702C3B] hover:bg-[#5A232F] text-white px-4 py-2.5 text-xs font-mono uppercase tracking-wider rounded-r-sm transition-colors flex items-center gap-1 shrink-0"
                    >
                      Subscribe <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
                </form>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-xs uppercase font-mono tracking-widest text-stone-200 mb-4">
              Atelier Shop
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/shop?category=Women" className="hover:text-white transition-colors">
                  Women’s Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Men" className="hover:text-white transition-colors">
                  Men’s Sartorial
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Accessories" className="hover:text-white transition-colors">
                  Leather Goods & Accents
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Footwear" className="hover:text-white transition-colors">
                  Handcrafted Footwear
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-[#B6A99A] transition-colors">
                  Deal Radar & Archive Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs uppercase font-mono tracking-widest text-stone-200 mb-4">
              Client Care
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping & Handling
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Client FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Concierge & Contact
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-white transition-colors">
                  Velora Rewards Club
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors font-mono text-stone-300">
                  Admin Dashboard (Demo)
                </Link>
              </li>
            </ul>
          </div>

          {/* Experiences & Innovation */}
          <div>
            <h5 className="text-xs uppercase font-mono tracking-widest text-stone-200 mb-4">
              Fashion Tech
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/ai-stylist" className="hover:text-white transition-colors">
                  AI Personal Stylist
                </Link>
              </li>
              <li>
                <Link href="/outfit-studio" className="hover:text-white transition-colors">
                  Outfit Builder Studio
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Smart Product Compare
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Curated Moodboards
                </Link>
              </li>
              <li>
                <Link href="/gift-finder" className="hover:text-white transition-colors">
                  Gift Discovery Tool
                </Link>
              </li>
              <li>
                <Link href="/looks" className="hover:text-white transition-colors">
                  Shop the Look
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Disclaimer notice */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 text-[11px] text-stone-500 leading-relaxed">
          <p>
            <span className="font-semibold text-stone-400">Fictional Portfolio Demo:</span> {SITE_CONFIG.demoNotice} All brands, personas, and merchandise depicted herein are conceptual.
          </p>
        </div>

        {/* Bottom Bar with MANDATORY CREATOR CREDIT */}
        <div className="mt-6 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="font-serif tracking-wide text-stone-300">
            © {SITE_CONFIG.creator.copyrightYear} {SITE_CONFIG.name}. All rights reserved.
          </p>

          {/* Mandatory Creator Credit to Infinvo Tech */}
          <div className="flex items-center gap-1 font-mono text-[11px] tracking-wider">
            <span>Designed &amp; Developed by</span>
            <a
              href={SITE_CONFIG.creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E9E2D8] hover:text-white underline underline-offset-4 font-semibold transition-colors ml-1"
            >
              {SITE_CONFIG.creator.name}
            </a>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
