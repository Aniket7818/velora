'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  Bookmark,
  Check,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { INITIAL_EDITORIAL_LOOKS } from '@/lib/data/initialData';
import { formatCurrency } from '@/lib/utils/formatters';

export default function ShopTheLookPage() {
  const { products, addToCart, saveOutfit } = useVeloraStore();

  const [addedLookId, setAddedLookId] = useState<string | null>(null);
  const [savedLookId, setSavedLookId] = useState<string | null>(null);

  const handleAddLookToCart = (lookId: string, itemIds: string[]) => {
    const lookItems = itemIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    lookItems.forEach((item) => {
      if (item) {
        addToCart(item, item.sizes[0] || 'M', item.colors[0]?.name || 'Standard', 1);
      }
    });

    setAddedLookId(lookId);
    setTimeout(() => setAddedLookId(null), 2500);
  };

  const handleSaveLook = (look: (typeof INITIAL_EDITORIAL_LOOKS)[0]) => {
    const lookItems = look.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    const totalPrice = lookItems.reduce((s, p) => s + (p?.price || 0), 0);

    saveOutfit({
      name: look.title,
      description: look.description,
      occasion: 'Editorial',
      style: 'Luxury',
      items: {
        top: lookItems[0],
        bottom: lookItems[1],
        shoes: lookItems[2],
        accessory: lookItems[3],
      },
      totalPrice,
    });

    setSavedLookId(look.id);
    setTimeout(() => setSavedLookId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E9E2D8] rounded-full text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atelier Campaigns</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Shop The Look
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Comprehensive seasonal ensembles composed by our master stylists. Acquire the complete
          look with a single click or explore individual tailored components.
        </p>
      </div>

      {/* Editorial Looks List */}
      <div className="space-y-16">
        {INITIAL_EDITORIAL_LOOKS.map((look, index) => {
          const lookItems = look.productIds
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean) as (typeof products)[0][];

          const total = lookItems.reduce((s, p) => s + p.price, 0);
          const isEven = index % 2 === 0;

          return (
            <div
              key={look.id}
              className="bg-white border border-[#E9E2D8] rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs"
            >
              {/* Editorial Photography */}
              <div
                className={`lg:col-span-6 relative aspect-4/5 lg:aspect-auto min-h-[460px] bg-stone-900 ${
                  isEven ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <Image
                  src={look.image}
                  alt={look.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#171717]/90 text-white text-[10px] font-mono tracking-widest px-3 py-1 uppercase backdrop-blur-xs">
                  {look.season}
                </div>
              </div>

              {/* Look Info & Breakdown */}
              <div
                className={`lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#702C3B] font-semibold">
                      {look.subtitle}
                    </span>
                    <h2 className="font-serif text-3xl text-stone-900 font-normal mt-1">
                      {look.title}
                    </h2>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{look.description}</p>

                  {/* Included Items */}
                  <div className="pt-4 border-t border-[#E9E2D8] space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                      Ensemble Breakdown ({lookItems.length} Pieces)
                    </span>

                    <div className="divide-y divide-[#E9E2D8]">
                      {lookItems.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 relative rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-[#E9E2D8]">
                              <Image src={item.images[0]} alt="" fill sizes="40px" className="object-cover" />
                            </div>
                            <div>
                              <Link
                                href={`/product/${item.slug}`}
                                className="font-medium text-stone-900 hover:text-[#702C3B] transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <span className="text-[10px] font-mono text-stone-400 uppercase">
                                {item.subcategory}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-medium text-stone-900">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Total & Actions */}
                <div className="pt-6 mt-6 border-t border-[#E9E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                      Complete Look Total
                    </span>
                    <span className="font-serif text-2xl font-medium text-stone-900">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleSaveLook(look)}
                      disabled={savedLookId === look.id}
                      className="flex-1 sm:flex-none px-4 py-2.5 border border-stone-400 hover:border-black text-stone-800 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      {savedLookId === look.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save Look</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleAddLookToCart(look.id, look.productIds)}
                      disabled={addedLookId === look.id}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      {addedLookId === look.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Shop Full Look</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
