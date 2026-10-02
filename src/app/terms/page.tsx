import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs text-stone-700 leading-relaxed">
      <div className="border-b border-[#E9E2D8] pb-6 space-y-2">
        <Link href="/" className="text-xs font-mono uppercase text-stone-500 hover:text-black flex items-center gap-1.5 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <FileText className="w-4 h-4" />
          <span>Client Agreement</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Terms of Service
        </h1>
        <p className="text-stone-500 font-mono text-[11px]">Effective: October 2026</p>
      </div>

      <div className="space-y-6 bg-white border border-[#E9E2D8] p-8 rounded-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-stone-900">1. Portfolio Showcase Scope</h2>
          <p>
            VELORA represents an agency showcase application engineered to exhibit high-caliber frontend
            architecture, editorial aesthetics, and interactive fashion technology. No legal commercial
            contracts, financial obligations, or inventory delivery agreements are formed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-stone-900">2. Intellectual Property &amp; Craft</h2>
          <p>
            All interface layouts, styling algorithms, and application designs are the exclusive
            work of {SITE_CONFIG.creator.name}. Curated editorial imagery is utilized under
            permissive photography licenses for portfolio presentation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-medium text-stone-900">3. Inquiries &amp; Portfolio Collaboration</h2>
          <p>
            For prospective client collaborations, custom e-commerce architecture, or bespoke digital
            experiences, consult our agency portfolio at{' '}
            <a href={SITE_CONFIG.creator.url} target="_blank" rel="noopener noreferrer" className="text-[#702C3B] font-semibold underline">
              {SITE_CONFIG.creator.url}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
