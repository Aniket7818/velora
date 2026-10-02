import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs text-stone-700 leading-relaxed">
      <div className="border-b border-[#E9E2D8] pb-6 space-y-2">
        <Link href="/" className="text-xs font-mono uppercase text-stone-500 hover:text-black flex items-center gap-1.5 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal Transparency</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Privacy Policy
        </h1>
        <p className="text-stone-500 font-mono text-[11px]">Last Updated: October 2026</p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xs text-amber-900 space-y-1">
        <span className="font-semibold block font-mono text-[11px] uppercase">Portfolio Demo Notice</span>
        <p>
          VELORA is a conceptual luxury fashion platform created for demonstration purposes.
          All client sessions, moodboards, cart items, and order references are stored strictly
          within your browser&apos;s LocalStorage. No real payment or identity data is collected or transmitted.
        </p>
      </div>

      <div className="space-y-6 bg-white border border-[#E9E2D8] p-8 rounded-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-stone-900">1. Client Data Persistence</h2>
          <p>
            When utilizing our interactive features (AI Stylist, Outfit Builder Studio, Moodboards, and
            Product Comparison), state is maintained entirely client-side. You retain full control to
            export or reset this data at any point via My Account &gt; Settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-stone-900">2. Simulated Payment Tokens</h2>
          <p>
            The checkout sequence does not require, accept, or process real payment credentials. Pre-filled
            demo credentials represent visual simulations intended to showcase production UI/UX workflows.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-stone-900">3. Agency &amp; Attribution</h2>
          <p>
            Conceptualized, designed, and developed by{' '}
            <a href={SITE_CONFIG.creator.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-stone-900 underline">
              {SITE_CONFIG.creator.name}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
