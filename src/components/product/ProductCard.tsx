'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Eye,
  ShoppingBag,
  Scale,
  Star,
  Check,
} from 'lucide-react';
import { Product } from '@/types';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency } from '@/lib/utils/formatters';
import { QuickViewModal } from './QuickViewModal';
import { SizeFitFinderModal } from './SizeFitFinderModal';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickAdded, setQuickAdded] = useState(false);

  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleComparison,
    isInComparison,
  } = useVeloraStore();

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInComparison(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0]?.name || 'Standard';
    addToCart(product, defaultSize, defaultColor, 1);
    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 2000);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleComparison(product.id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white border border-[#E9E2D8]/80 hover:border-[#B6A99A] transition-all duration-300 rounded-sm overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Imagery Container with Aspect Ratio */}
        <div className="relative aspect-3/4 w-full bg-stone-100 overflow-hidden">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            {/* Primary Image */}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover transition-all duration-700 ease-out ${
                isHovered && product.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
            />

            {/* Hover Secondary Image */}
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover transition-all duration-700 ease-out absolute inset-0 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.isSale && (
              <span className="bg-[#702C3B] text-white text-[10px] font-mono tracking-widest px-2 py-0.5 uppercase shadow-xs">
                Sale {product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-[#171717] text-white text-[10px] font-mono tracking-widest px-2 py-0.5 uppercase shadow-xs">
                New
              </span>
            )}
            {product.stock <= 5 && (
              <span className="bg-amber-800 text-white text-[10px] font-mono tracking-widest px-2 py-0.5 uppercase shadow-xs">
                Only {product.stock} Left
              </span>
            )}
          </div>

          {/* Action Icons Overlay (Wishlist, Compare, Quick View) */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleToggleWishlist}
              aria-label="Wishlist"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                isWishlisted
                  ? 'bg-white text-[#702C3B]'
                  : 'bg-white/90 text-stone-700 hover:text-black hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#702C3B]' : ''}`} />
            </button>

            <button
              onClick={handleToggleCompare}
              aria-label="Compare"
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                isCompared
                  ? 'bg-[#171717] text-white'
                  : 'bg-white/90 text-stone-700 hover:text-black hover:bg-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleQuickView}
              aria-label="Quick View"
              title="Quick View"
              className="w-8 h-8 rounded-full bg-white/90 text-stone-700 hover:text-black hover:bg-white flex items-center justify-center transition-all shadow-md hidden sm:flex"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add Slide-Up Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 p-2.5 bg-white/95 backdrop-blur-xs border-t border-[#E9E2D8] z-10 transition-transform duration-300 flex items-center justify-between gap-2 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <button
              onClick={handleQuickAdd}
              disabled={quickAdded || product.stock === 0}
              className="w-full bg-[#171717] hover:bg-[#2A2A2A] text-white py-2 px-3 text-[11px] font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 rounded-xs"
            >
              {quickAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added</span>
                </>
              ) : product.stock === 0 ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add ({product.sizes[0]})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-white">
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-mono text-stone-500 uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-stone-700 font-medium">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-stone-400 font-mono text-[10px]">
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="group-hover:text-[#702C3B] transition-colors">
              <h3 className="font-serif text-base font-medium text-stone-900 leading-snug line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
              {product.material.split(';')[0]}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-stone-900 text-sm">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Color Swatch Dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 3).map((col, idx) => (
                  <span
                    key={idx}
                    className="w-2.5 h-2.5 rounded-full border border-stone-300"
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[10px] text-stone-400 font-mono">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onOpenSizeGuide={() => {
          setIsQuickViewOpen(false);
          setIsSizeGuideOpen(true);
        }}
      />

      {/* Size Guide Modal */}
      <SizeFitFinderModal
        category={product.category}
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </>
  );
}
