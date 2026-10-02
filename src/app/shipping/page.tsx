import Link from 'next/link';
import { Truck, ShieldCheck, Clock, PackageCheck, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { formatCurrency } from '@/lib/utils/formatters';

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-[#E9E2D8] pb-6 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#702C3B] font-semibold">
          Client Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Shipping &amp; Delivery Information
        </h1>
        <p className="text-xs text-stone-500">
          White-glove courier handling, signature verification, and delivery estimates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-[#E9E2D8] rounded-sm space-y-2">
          <Truck className="w-5 h-5 text-[#702C3B]" />
          <h3 className="font-serif text-base font-medium text-stone-900">Complimentary Courier</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            All orders above {formatCurrency(SITE_CONFIG.freeShippingThreshold)} receive complimentary priority dispatch.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E9E2D8] rounded-sm space-y-2">
          <Clock className="w-5 h-5 text-[#702C3B]" />
          <h3 className="font-serif text-base font-medium text-stone-900">1–3 Business Days</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Metro destinations (Mumbai, Delhi NCR, Bengaluru, Chennai) delivered within 48 hours.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E9E2D8] rounded-sm space-y-2">
          <ShieldCheck className="w-5 h-5 text-[#702C3B]" />
          <h3 className="font-serif text-base font-medium text-stone-900">Insured Handover</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Garments are sealed in weather-proof custom cases with direct recipient authentication.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs text-stone-700 leading-relaxed bg-white border border-[#E9E2D8] p-8 rounded-sm">
        <h2 className="font-serif text-xl font-medium text-stone-900">Atelier Packaging Standards</h2>
        <p>
          Each VELORA piece is hand-pressed before dispatch and enveloped in breathable organic cotton
          garment bags. Structured jackets and overcoats arrive suspended from contoured FSC-certified
          wooden hangers to preserve shoulder architecture in transit.
        </p>

        <h3 className="font-serif text-base font-medium text-stone-900 pt-4">Simulated Tracking Information</h3>
        <p>
          Once dispatched, a live tracking waybill is linked directly into your Client Portal. You can
          view simulated transit waypoints from our central atelier hub to your doorstep on our Order
          Journey screen.
        </p>

        <div className="pt-6 border-t border-[#E9E2D8] flex items-center justify-between">
          <Link href="/account?tab=orders" className="text-[#702C3B] font-mono uppercase text-xs hover:underline flex items-center gap-1">
            <span>View Active Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/returns" className="text-stone-500 font-mono uppercase text-xs hover:text-black">
            Return Policy Guidelines →
          </Link>
        </div>
      </div>
    </div>
  );
}
