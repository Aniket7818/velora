'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Gift,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';

export default function GiftFinderPage() {
  const { products, addToCart, toggleWishlist, isInWishlist } = useVeloraStore();

  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('Partner');
  const [occasion, setOccasion] = useState('Anniversary');
  const [budgetCap, setBudgetCap] = useState(15000);
  const [categoryPref, setCategoryPref] = useState('Accessories');

  const [recommendations, setRecommendations] = useState<
    { product: Product; reason: string }[]
  >([]);

  const recipients = [
    { label: 'Partner / Spouse', value: 'Partner', desc: 'Romantic cashmere, silk slip dresses, or fine jewelry' },
    { label: 'Friend or Host', value: 'Friend', desc: 'Lake Como silk scarves, bio-acetate eyewear, or leather belts' },
    { label: 'Parent or Family', value: 'Parent', desc: 'Plush cashmere knitwear, heritage overcoats, or Italian boots' },
    { label: 'Colleague / Executive', value: 'Colleague', desc: 'Sculptural leather totes, classic Supima shirts, or cardigans' },
  ];

  const occasions = ['Anniversary', 'Birthday', 'Holiday Season', 'Wedding', 'Appreciation & Milestone'];

  const categories = ['Accessories', 'Jewelry & Silk', 'Knitwear', 'Footwear', 'Outerwear & Tailoring'];

  const handleCalculateGifts = () => {
    let pool = products.filter((p) => p.price <= budgetCap);

    if (categoryPref === 'Jewelry & Silk') {
      pool = pool.filter((p) => ['Jewelry', 'Scarves', 'Dresses'].includes(p.subcategory));
    } else if (categoryPref === 'Accessories') {
      pool = pool.filter((p) => p.category === 'Accessories');
    } else if (categoryPref === 'Knitwear') {
      pool = pool.filter((p) => p.subcategory === 'Knitwear');
    } else if (categoryPref === 'Footwear') {
      pool = pool.filter((p) => p.category === 'Footwear');
    }

    if (pool.length < 3) {
      pool = products.filter((p) => p.price <= budgetCap);
    }

    const recs = pool.slice(0, 4).map((product) => {
      let reason = `Ideal for ${recipient} on ${occasion}. Crafted from premium ${product.material.split(';')[0]} and arrives in signature gift packaging.`;
      if (product.category === 'Accessories') {
        reason = `A timeless keepsake for your ${recipient.toLowerCase()}. Handcrafted with refined hardware suitable for everyday celebration.`;
      }
      return { product, reason };
    });

    setRecommendations(recs);
    setStep(5);
  };

  const [addedItemIds, setAddedItemIds] = useState<{ [key: string]: boolean }>({});

  const handleQuickAdd = (p: Product) => {
    addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard', 1);
    setAddedItemIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedItemIds((prev) => ({ ...prev, [p.id]: false })), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E9E2D8] rounded-full text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <Gift className="w-3.5 h-3.5" />
          <span>Concierge Curation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Luxury Gift Discovery
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Finding the quintessential gift is an art. Answer a few guided questions to discover
          handcrafted pieces tailored to your recipient’s taste.
        </p>
      </div>

      {/* Stepper indicator if < 5 */}
      {step < 5 && (
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between text-xs font-mono uppercase text-stone-400 mb-2">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Recipient'}
              {step === 2 && 'Occasion'}
              {step === 3 && 'Category Preference'}
              {step === 4 && 'Budget Range'}
            </span>
          </div>
          <div className="w-full bg-[#E9E2D8] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#702C3B] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: RECIPIENT */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 font-medium">
            Who is this distinguished gift for?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recipients.map((r) => (
              <button
                key={r.value}
                onClick={() => setRecipient(r.value)}
                className={`p-4 rounded-xs border text-left transition-all ${
                  recipient === r.value
                    ? 'border-[#702C3B] bg-[#702C3B]/5 ring-1 ring-[#702C3B]'
                    : 'border-[#E9E2D8] hover:border-stone-400 bg-white'
                }`}
              >
                <span className="font-serif text-lg font-medium text-stone-900 block">{r.label}</span>
                <span className="text-xs text-stone-500 mt-1 block">{r.desc}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
            >
              <span>Next: Occasion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: OCCASION */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 font-medium">
            What milestone are you commemorating?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {occasions.map((occ) => (
              <button
                key={occ}
                onClick={() => setOccasion(occ)}
                className={`p-4 rounded-xs border text-left transition-all ${
                  occasion === occ
                    ? 'border-[#702C3B] bg-[#702C3B]/5 ring-1 ring-[#702C3B]'
                    : 'border-[#E9E2D8] hover:border-stone-400 bg-white'
                }`}
              >
                <span className="font-serif text-base font-medium text-stone-900 block">{occ}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-[#E9E2D8] text-xs font-mono uppercase rounded-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
            >
              <span>Next: Category Preference</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CATEGORY PREFERENCE */}
      {step === 3 && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 font-medium">
            Which category best fits their taste?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryPref(c)}
                className={`p-4 rounded-xs border text-left transition-all ${
                  categoryPref === c
                    ? 'border-[#702C3B] bg-[#702C3B]/5 ring-1 ring-[#702C3B]'
                    : 'border-[#E9E2D8] hover:border-stone-400 bg-white'
                }`}
              >
                <span className="font-serif text-base font-medium text-stone-900 block">{c}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-[#E9E2D8] text-xs font-mono uppercase rounded-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
            >
              <span>Next: Set Budget</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: BUDGET CAP */}
      {step === 4 && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E9E2D8] p-8 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl text-stone-900 font-medium">
            Gift Investment Budget Cap
          </h2>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-stone-600">Maximum Price</span>
              <span className="font-serif text-2xl font-medium text-[#702C3B]">
                {formatCurrency(budgetCap)}
              </span>
            </div>

            <input
              type="range"
              min="3000"
              max="25000"
              step="1000"
              value={budgetCap}
              onChange={(e) => setBudgetCap(Number(e.target.value))}
              className="w-full accent-[#702C3B]"
            />

            <div className="flex justify-between text-xs font-mono text-stone-400">
              <span>₹3,000 (Silk &amp; Small Leather)</span>
              <span>₹15,000 (Fine Jewelry &amp; Cashmere)</span>
              <span>₹25,000+ (Atelier Icons)</span>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-[#E9E2D8]">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 border border-[#E9E2D8] text-xs font-mono uppercase rounded-xs"
            >
              Back
            </button>
            <button
              onClick={handleCalculateGifts}
              className="px-8 py-3 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Reveal Gift Matches</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: RESULTS SCREEN */}
      {step === 5 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-white border border-[#E9E2D8] p-6 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#702C3B] font-semibold">
                Curated For You
              </span>
              <h3 className="font-serif text-2xl text-stone-900 font-normal mt-0.5">
                {recipient} • {occasion} Selection
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Showing matching noble pieces within {formatCurrency(budgetCap)}.
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs font-mono uppercase tracking-wider text-stone-600 hover:text-black flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Discovery</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(({ product, reason }) => {
              const isWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#E9E2D8] rounded-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-3/4 bg-stone-100 overflow-hidden">
                    <Image src={product.images[0]} alt={product.name} fill sizes="250px" className="object-cover" />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-xs text-stone-600 hover:text-[#702C3B]"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-[#702C3B] text-[#702C3B]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-stone-400">
                        {product.brand}
                      </span>
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-serif text-base font-medium text-stone-900 hover:text-[#702C3B] block line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <span className="font-serif text-base font-medium text-stone-900 block mt-1">
                        {formatCurrency(product.price)}
                      </span>

                      {/* Gift Rationale */}
                      <div className="mt-2 p-2 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs text-[11px] text-stone-600 leading-relaxed">
                        <span className="font-semibold text-stone-800 block text-[10px] font-mono uppercase">
                          Why It Fits:
                        </span>
                        {reason}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      disabled={addedItemIds[product.id]}
                      className="w-full py-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      {addedItemIds[product.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Gift Wrap &amp; Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
