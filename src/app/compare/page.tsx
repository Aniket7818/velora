'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Scale,
  Trash2,
  X,
  Star,
  ShoppingBag,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency } from '@/lib/utils/formatters';

export default function ComparePage() {
  const { comparisonList, removeFromComparison, clearComparison, products, addToCart } =
    useVeloraStore();

  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  const comparedProducts = comparisonList
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as (typeof products)[0][];

  // Highlights
  const lowestPrice =
    comparedProducts.length > 0 ? Math.min(...comparedProducts.map((p) => p.price)) : 0;
  const highestRating =
    comparedProducts.length > 0 ? Math.max(...comparedProducts.map((p) => p.rating)) : 0;

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard', 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleAddSample = (id: string) => {
    useVeloraStore.getState().toggleComparison(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2D8] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
            <Scale className="w-4 h-4" />
            <span>Side-by-Side Evaluation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
            Smart Product Comparison
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Compare up to 4 atelier creations on materials, tailoring specifications, and ratings.
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-mono uppercase text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="rounded border-stone-300 text-[#702C3B] focus:ring-[#702C3B]"
              />
              <span>Highlight Differences</span>
            </label>

            <button
              onClick={clearComparison}
              className="text-xs font-mono uppercase text-stone-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear ({comparedProducts.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {comparedProducts.length === 0 ? (
        <div className="bg-white border border-[#E9E2D8] p-12 text-center rounded-sm space-y-4 max-w-2xl mx-auto">
          <Scale className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2]" />
          <h3 className="font-serif text-2xl text-stone-900 font-normal">
            Your Comparison Atelier is Empty
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Select the scale icon on any product card or detail page to evaluate materials,
            pricing, and sizing specifications side-by-side.
          </p>

          <div className="pt-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 block mb-3">
              Add Suggested Pieces to Compare:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleAddSample('prod-w-001')}
                className="px-3 py-1.5 bg-[#E9E2D8] text-xs text-stone-800 rounded-xs hover:bg-[#B6A99A]/50 transition-colors"
              >
                + Atelier Wool Blazer
              </button>
              <button
                onClick={() => handleAddSample('prod-w-002')}
                className="px-3 py-1.5 bg-[#E9E2D8] text-xs text-stone-800 rounded-xs hover:bg-[#B6A99A]/50 transition-colors"
              >
                + Silk Slip Dress
              </button>
              <button
                onClick={() => handleAddSample('prod-m-001')}
                className="px-3 py-1.5 bg-[#E9E2D8] text-xs text-stone-800 rounded-xs hover:bg-[#B6A99A]/50 transition-colors"
              >
                + Savile Cashmere Blazer
              </button>
            </div>

            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Comparison Table / Grid */
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[800px] bg-white border border-[#E9E2D8] rounded-sm divide-y divide-[#E9E2D8]">
            {/* Row 1: Imagery, Titles, Quick Add */}
            <div className="grid grid-cols-5 p-6 gap-6 items-start bg-[#F8F6F1]/50">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-500 pt-2">
                Atelier Piece
              </div>

              {comparedProducts.map((p) => (
                <div key={p.id} className="space-y-3 relative group">
                  <button
                    onClick={() => removeFromComparison(p.id)}
                    className="absolute -top-2 -right-2 p-1 bg-white border border-[#E9E2D8] hover:border-black rounded-full text-stone-400 hover:text-black z-10 shadow-xs"
                    title="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative aspect-3/4 rounded-xs overflow-hidden bg-stone-100 border border-[#E9E2D8]">
                    <Image src={p.images[0]} alt={p.name} fill sizes="250px" className="object-cover" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-stone-400">{p.brand}</span>
                    <Link
                      href={`/product/${p.slug}`}
                      className="font-serif text-base font-medium text-stone-900 block hover:text-[#702C3B] line-clamp-1"
                    >
                      {p.name}
                    </Link>
                  </div>

                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={addedItems[p.id]}
                    className="w-full py-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    {addedItems[p.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>In Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              ))}

              {/* Add more column placeholder if < 4 */}
              {comparedProducts.length < 4 && (
                <div className="border-2 border-dashed border-[#E9E2D8] rounded-xs aspect-3/4 flex flex-col items-center justify-center p-4 text-center">
                  <Link
                    href="/shop"
                    className="text-xs text-stone-500 hover:text-[#702C3B] flex flex-col items-center gap-1"
                  >
                    <Scale className="w-6 h-6 stroke-[1.2]" />
                    <span className="font-mono uppercase text-[10px]">Add Another Piece</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Row 2: Price & Valuation */}
            <div className="grid grid-cols-5 p-4 gap-6 items-center">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Atelier Price
              </span>
              {comparedProducts.map((p) => {
                const isLowest = p.price === lowestPrice && comparedProducts.length > 1;
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-lg font-medium text-stone-900">
                        {formatCurrency(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatCurrency(p.originalPrice)}
                        </span>
                      )}
                    </div>
                    {isLowest && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 bg-[#2E7658]/10 text-[#2E7658] font-bold rounded">
                        Lowest Price
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Row 3: Client Rating */}
            <div className="grid grid-cols-5 p-4 gap-6 items-center">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Client Rating
              </span>
              {comparedProducts.map((p) => {
                const isHighest = p.rating === highestRating && comparedProducts.length > 1;
                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-stone-800">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-semibold">{p.rating}</span>
                      <span className="text-stone-400 font-mono text-[10px]">
                        ({p.reviewCount} reviews)
                      </span>
                    </div>
                    {isHighest && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-50 text-amber-800 font-bold rounded">
                        Highest Rated
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Row 4: Material Composition */}
            <div
              className={`grid grid-cols-5 p-4 gap-6 items-start ${
                highlightDifferences ? 'bg-amber-50/40' : ''
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Noble Fibers
              </span>
              {comparedProducts.map((p) => (
                <div key={p.id} className="text-xs text-stone-700 leading-relaxed">
                  {p.material}
                </div>
              ))}
            </div>

            {/* Row 5: Available Sizes */}
            <div className="grid grid-cols-5 p-4 gap-6 items-center">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Available Sizes
              </span>
              {comparedProducts.map((p) => (
                <div key={p.id} className="flex flex-wrap gap-1">
                  {p.sizes.map((sz) => (
                    <span
                      key={sz}
                      className="px-2 py-0.5 bg-stone-100 border border-[#E9E2D8] text-[10px] font-mono text-stone-700 rounded-xs"
                    >
                      {sz}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Row 6: Color Palette */}
            <div className="grid grid-cols-5 p-4 gap-6 items-center">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Colorways
              </span>
              {comparedProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5">
                  {p.colors.map((c) => (
                    <span
                      key={c.name}
                      className="w-4 h-4 rounded-full border border-stone-300"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Row 7: Occasions & Style */}
            <div className="grid grid-cols-5 p-4 gap-6 items-start">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Occasions
              </span>
              {comparedProducts.map((p) => (
                <div key={p.id} className="flex flex-wrap gap-1">
                  {p.occasion.map((occ) => (
                    <span
                      key={occ}
                      className="text-[10px] font-mono px-2 py-0.5 bg-[#F8F6F1] border border-[#E9E2D8] text-stone-600 rounded-xs"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Row 8: Care Protocol */}
            <div className="grid grid-cols-5 p-4 gap-6 items-start">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Care Protocol
              </span>
              {comparedProducts.map((p) => (
                <div key={p.id} className="text-[11px] text-stone-500 leading-relaxed">
                  {p.care}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
