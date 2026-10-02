'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the VELORA AI Stylist synthesize outfits?',
      a: 'The AI Stylist evaluates your selected occasion, aesthetic parameters, and chromatic preferences using a deterministic rule engine that analyzes fabric drape, color pairings, and category compatibility from our local luxury catalog.',
    },
    {
      q: 'Are the products authentic and made from real noble fibers?',
      a: 'In our simulated luxury portfolio narrative, VELORA creations are sourced from certified Italian mills, Mongolian cashmere herders, and French flax growers. All fiber specifications are detailed on each product showcase.',
    },
    {
      q: 'How does the Smart Size & Fit Finder calculate recommendations?',
      a: 'The fit calculator compares your height, weight distribution, and preferred silhouette drape (Slim, Regular, or Relaxed) against standard pattern blocks to estimate optimal sizing with a percentage confidence index.',
    },
    {
      q: 'Can I save custom outfits created in the Outfit Studio?',
      a: 'Yes. Every look you create on the interactive 4-slot canvas can be saved with a custom name to your local browser storage, reopened at any time, renamed, or added to your shopping bag with one click.',
    },
    {
      q: 'How does the Price Watch & Deal Radar work?',
      a: 'You can set target prices on any garment. In this demo, simulated price drops can be triggered on the Deal Radar page to demonstrate notification center alerts and automated status updates.',
    },
    {
      q: 'What are the privileges of the Velora Rewards Club?',
      a: 'Patrons earn reward points with every purchase and can ascend from Silver to Platinum tier. Accumulated points can be redeemed directly for privilege promo vouchers (₹500, ₹1,200, or ₹2,500 off).',
    },
    {
      q: 'How do I test the simulated return workflow?',
      a: 'Navigate to the Returns Portal or select "Request Return" from your orders history. Choose an order, pick the garment and reason, and submit to generate a unique return reference.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-[#E9E2D8] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <HelpCircle className="w-4 h-4" />
          <span>Concierge Inquiries</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-stone-500">
          Everything you need to know about the VELORA shopping experience, tailoring, and styling technology.
        </p>
      </div>

      <div className="bg-white border border-[#E9E2D8] rounded-sm divide-y divide-[#E9E2D8]">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="p-5 sm:p-6 transition-colors">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4"
              >
                <span className="font-serif text-base font-medium text-stone-900">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform ${
                    isOpen ? 'rotate-180 text-[#702C3B]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="text-xs text-stone-600 mt-3 leading-relaxed animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-[#F8F6F1] border border-[#E9E2D8] rounded-sm text-center space-y-3">
        <h3 className="font-serif text-xl font-medium text-stone-900">Have an Unanswered Question?</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Our client concierge is on call to assist with styling advice, sizing questions, or demo inquiries.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors"
        >
          <span>Contact Atelier Concierge</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
