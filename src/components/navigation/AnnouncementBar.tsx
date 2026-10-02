'use client';

import { useState } from 'react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
          transition={{ duration: 0.2 }}
          className="bg-[#171717] text-[#F8F6F1] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-6 border-b border-[#2A2A2A] relative z-40"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Announcement Message */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-semibold bg-[#702C3B] text-white tracking-widest uppercase rounded-2xs whitespace-nowrap">
                Privilege
              </span>
              <p className="truncate text-stone-200 text-[10.5px] sm:text-xs tracking-wide">
                Complimentary shipping on orders above ₹2,499 · Use code{' '}
                <span className="font-mono font-semibold text-white underline underline-offset-2">
                  VELORA15
                </span>
              </p>
            </div>

            {/* Right side links on desktop + dismiss button */}
            <div className="flex items-center gap-4 text-stone-400 text-[11px] tracking-wider shrink-0">
              <div className="hidden md:flex items-center gap-5">
                <Link
                  href="/deals"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#B6A99A]" />
                  <span>Deal Radar</span>
                </Link>
                <span className="text-stone-700">|</span>
                <Link
                  href="/rewards"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3 h-3 text-[#B6A99A]" />
                  <span>Velora Club</span>
                </Link>
              </div>

              <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss banner"
                className="text-stone-400 hover:text-white transition-colors p-1 rounded-full hover:bg-stone-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
