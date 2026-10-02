'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ArrowRight, Sparkles, Clock, Trash2 } from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency } from '@/lib/utils/formatters';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const { products, recentSearches, addRecentSearch, clearRecentSearches } = useVeloraStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResults = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  const handleSelectQuery = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
    router.push(`/shop?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query);
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const trendingTerms = [
    'Cashmere Knitwear',
    'Double-Breasted Wool Blazer',
    'Silk Slip Dress',
    'Lug-Sole Boots',
    'Suede Loafers',
    'French Linen Vest',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#171717]/80 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      {/* Top search bar container */}
      <div className="w-full bg-[#F8F6F1] border-b border-[#E9E2D8] shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#B6A99A]/40">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
              <Search className="w-6 h-6 text-[#702C3B] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cashmere, silk dresses, tailoring, footwear..."
                className="w-full text-lg sm:text-2xl font-light text-[#171717] placeholder:text-stone-400 bg-transparent outline-none focus:ring-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>

            <button
              onClick={onClose}
              className="ml-4 p-2 text-stone-500 hover:text-black rounded-full hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase"
            >
              <span>ESC</span>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick suggestions when query is empty */}
          {!query && (
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs tracking-widest uppercase text-stone-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#702C3B]" />
                    Recent Inquiries
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={clearRecentSearches}
                      className="text-stone-400 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.length === 0 ? (
                    <p className="text-sm text-stone-400 italic">No recent searches yet.</p>
                  ) : (
                    recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectQuery(term)}
                        className="text-xs font-medium px-3 py-1.5 bg-[#E9E2D8]/70 hover:bg-[#B6A99A]/50 text-stone-800 rounded-sm transition-colors text-left"
                      >
                        {term}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-3 text-xs tracking-widest uppercase text-stone-500 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#702C3B]" />
                  Curated Editorial Trends
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTerms.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectQuery(term)}
                      className="text-xs font-medium px-3 py-1.5 bg-white border border-[#E9E2D8] hover:border-[#702C3B] hover:text-[#702C3B] text-stone-700 rounded-sm transition-colors text-left"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live Search Results */}
          {query.trim() && (
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
                  {searchResults.length} Products Found
                </span>
                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs text-[#702C3B] font-medium hover:underline flex items-center gap-1"
                  >
                    View all matching results <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-stone-700 font-serif text-lg">
                    No atelier pieces matched “{query}”
                  </p>
                  <p className="text-stone-500 text-xs mt-1">
                    Try searching for cashmere, wool, dress, footwear, or exploring our categories.
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleSelectQuery('Women')}
                      className="text-xs px-3 py-1.5 bg-[#E9E2D8] text-stone-800 rounded-sm hover:bg-[#B6A99A]/50"
                    >
                      Women’s Collection
                    </button>
                    <button
                      onClick={() => handleSelectQuery('Men')}
                      className="text-xs px-3 py-1.5 bg-[#E9E2D8] text-stone-800 rounded-sm hover:bg-[#B6A99A]/50"
                    >
                      Men’s Collection
                    </button>
                    <button
                      onClick={() => handleSelectQuery('Accessories')}
                      className="text-xs px-3 py-1.5 bg-[#E9E2D8] text-stone-800 rounded-sm hover:bg-[#B6A99A]/50"
                    >
                      Accessories
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2 bg-white/60 hover:bg-white rounded border border-[#E9E2D8] hover:border-[#B6A99A] transition-all group"
                    >
                      <div className="w-16 h-20 relative bg-stone-100 shrink-0 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-mono">
                          {product.brand}
                        </span>
                        <h4 className="text-sm font-medium text-stone-900 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-stone-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-stone-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dimmed backdrop area (click to close) */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
