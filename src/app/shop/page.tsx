'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCategory } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products } = useVeloraStore();

  // URL query params
  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSubcategory = searchParams.get('sub');
  const initialFilter = searchParams.get('filter'); // 'new' | 'bestseller' | 'trending' | 'sale'
  const initialSearch = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || 'All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(30000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(initialFilter === 'sale');
  const [newOnly, setNewOnly] = useState<boolean>(initialFilter === 'new');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Dynamic filter options extracted from catalog
  const availableBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))),
    [products]
  );
  const availableSizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))),
    [products]
  );
  const availableColors = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.colors.map((c) => c.name)))),
    [products]
  );

  // Filter application logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Subcategory
      if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) {
        return false;
      }

      // Quick tab filters
      if (newOnly && !p.isNew) return false;
      if (onSaleOnly && !p.isSale) return false;

      // Price
      if (p.price > priceRange) return false;

      // Size
      if (selectedSizes.length > 0 && !p.sizes.some((sz) => selectedSizes.includes(sz))) {
        return false;
      }

      // Color
      if (selectedColors.length > 0 && !p.colors.some((c) => selectedColors.includes(c.name))) {
        return false;
      }

      // Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Rating
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // In stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    newOnly,
    onSaleOnly,
    priceRange,
    selectedSizes,
    selectedColors,
    selectedBrands,
    minRating,
    inStockOnly,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'featured':
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange(30000);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setNewOnly(false);
    setSearchQuery('');
    setSortBy('featured');
    router.replace('/shop');
  };

  const activeFilterChips = [
    ...(selectedCategory !== 'All' ? [{ label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory('All') }] : []),
    ...(selectedSubcategory !== 'All' ? [{ label: `Style: ${selectedSubcategory}`, onRemove: () => setSelectedSubcategory('All') }] : []),
    ...(newOnly ? [{ label: 'New In', onRemove: () => setNewOnly(false) }] : []),
    ...(onSaleOnly ? [{ label: 'Sale Items', onRemove: () => setOnSaleOnly(false) }] : []),
    ...(priceRange < 30000 ? [{ label: `Under ${formatCurrency(priceRange)}`, onRemove: () => setPriceRange(30000) }] : []),
    ...selectedSizes.map((sz) => ({ label: `Size: ${sz}`, onRemove: () => setSelectedSizes(selectedSizes.filter((s) => s !== sz)) })),
    ...selectedBrands.map((b) => ({ label: `Brand: ${b}`, onRemove: () => setSelectedBrands(selectedBrands.filter((item) => item !== b)) })),
    ...(searchQuery ? [{ label: `“${searchQuery}”`, onRemove: () => setSearchQuery('') }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <span>VELORA Atelier</span>
          <span>/</span>
          <span>Collection Catalog</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            {selectedCategory === 'All' ? 'The Complete Wardrobe' : `${selectedCategory} Collection`}
          </h1>
          <span className="text-xs font-mono text-stone-500">
            Showing {sortedProducts.length} pieces
          </span>
        </div>
      </div>

      {/* Top Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E9E2D8]">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {(['All', 'Women', 'Men', 'Accessories', 'Footwear'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory('All');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white border border-[#E9E2D8] text-stone-700 hover:border-stone-400'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setNewOnly(!newOnly)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all shrink-0 ${
              newOnly
                ? 'bg-[#702C3B] text-white'
                : 'bg-white border border-[#E9E2D8] text-stone-700 hover:border-stone-400'
            }`}
          >
            ✦ New Arrivals
          </button>
          <button
            onClick={() => setOnSaleOnly(!onSaleOnly)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all shrink-0 ${
              onSaleOnly
                ? 'bg-[#702C3B] text-white'
                : 'bg-white border border-[#E9E2D8] text-stone-700 hover:border-stone-400'
            }`}
          >
            % Archive Sale
          </button>
        </div>

        {/* Right side controls: Mobile filter trigger & Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E9E2D8] rounded text-xs font-medium text-stone-800"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({activeFilterChips.length})</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-500 uppercase tracking-wider hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E9E2D8] text-xs font-medium text-stone-800 px-3 py-1.5 rounded-sm focus:outline-none focus:border-[#702C3B]"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Inquired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-4 border-b border-[#E9E2D8]">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
            Active:
          </span>
          {activeFilterChips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E9E2D8] text-xs text-stone-800 rounded-full"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="text-stone-400 hover:text-stone-800"
                aria-label="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetAllFilters}
            className="text-xs font-mono text-[#702C3B] hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-6 border-r border-[#E9E2D8]">
          {/* Search within catalog */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-stone-900 font-semibold mb-2">
              Filter by Keyword
            </h4>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Silk, blazer, boots..."
                className="w-full bg-white border border-[#E9E2D8] px-3 py-2 text-xs text-stone-900 rounded-sm focus:outline-none focus:border-[#702C3B]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <h4 className="uppercase font-mono tracking-widest text-stone-900 font-semibold">
                Price Cap
              </h4>
              <span className="font-mono text-stone-600 font-medium">
                {formatCurrency(priceRange)}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="30000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#702C3B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1">
              <span>₹2,000</span>
              <span>₹30,000</span>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-stone-900 font-semibold mb-3">
              Size &amp; Fit
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSizes(
                        active ? selectedSizes.filter((s) => s !== sz) : [...selectedSizes, sz]
                      );
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-sm border transition-all ${
                      active
                        ? 'border-[#171717] bg-[#171717] text-white'
                        : 'border-[#E9E2D8] bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-stone-900 font-semibold mb-3">
              Maison &amp; Atelier
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {availableBrands.map((brand) => {
                const checked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-2 text-xs text-stone-700 hover:text-black cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setSelectedBrands(
                          checked
                            ? selectedBrands.filter((b) => b !== brand)
                            : [...selectedBrands, brand]
                        );
                      }}
                      className="rounded border-stone-300 text-[#702C3B] focus:ring-[#702C3B]"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Availability & Rating */}
          <div className="pt-2 border-t border-[#E9E2D8] space-y-3">
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-stone-300 text-[#702C3B] focus:ring-[#702C3B]"
              />
              <span>In Stock Only</span>
            </label>

            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-stone-600 block mb-1.5">
                Minimum Rating:
              </span>
              <div className="flex gap-2">
                {[0, 4.5, 4.8].map((rt) => (
                  <button
                    key={rt}
                    onClick={() => setMinRating(rt)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-sm border ${
                      minRating === rt
                        ? 'border-[#702C3B] bg-[#702C3B] text-white'
                        : 'border-[#E9E2D8] bg-white text-stone-600'
                    }`}
                  >
                    {rt === 0 ? 'All' : `${rt}+ ★`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {displayedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#E9E2D8] rounded-sm p-8">
              <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif text-2xl text-stone-800">No Atelier Pieces Match</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-2 leading-relaxed">
                We couldn’t find garments matching your exact combination of criteria. Try relaxing your
                price cap or size selection.
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-6 px-6 py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < sortedProducts.length && (
                <div className="text-center pt-12">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-8 py-3 bg-white border border-[#171717] hover:bg-[#171717] hover:text-white text-stone-900 text-xs font-mono uppercase tracking-widest transition-all font-semibold rounded-xs shadow-xs"
                  >
                    Load More Curations ({sortedProducts.length - visibleCount} Remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#F8F6F1] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E9E2D8]">
                <h3 className="font-serif text-lg font-medium">Filter Catalog</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-stone-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price Cap */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono uppercase text-stone-600">Price Cap</span>
                  <span className="font-mono">{formatCurrency(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="30000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#702C3B]"
                />
              </div>

              {/* Sizes */}
              <div>
                <span className="text-xs font-mono uppercase text-stone-600 block mb-2">Sizes</span>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() =>
                        setSelectedSizes(
                          selectedSizes.includes(sz)
                            ? selectedSizes.filter((s) => s !== sz)
                            : [...selectedSizes, sz]
                        )
                      }
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedSizes.includes(sz)
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-[#E9E2D8]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E9E2D8] flex gap-2">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2.5 text-xs font-mono uppercase border border-stone-400 text-stone-800 rounded-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs font-mono uppercase bg-[#171717] text-white rounded-xs"
              >
                Apply ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="font-serif text-xl text-stone-600">Loading VELORA Atelier Catalog...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
