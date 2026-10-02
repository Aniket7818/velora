'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Heart, Check, ArrowRight, ShieldCheck, Ruler } from 'lucide-react';
import { Product } from '@/types';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency } from '@/lib/utils/formatters';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSizeGuide?: () => void;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onOpenSizeGuide,
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const { addToCart, toggleWishlist, isInWishlist } = useVeloraStore();

  if (!isOpen || !product) return null;

  const currentSize = selectedSize || product.sizes[0];
  const currentColor = selectedColor || product.colors[0]?.name;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!currentSize) {
      setError('Please select a size.');
      return;
    }
    setError('');
    addToCart(product, currentSize, currentColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-label="Close modal overlay"
      />

      <div className="relative bg-[#F8F6F1] rounded-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E9E2D8] z-10 grid grid-cols-1 md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-black bg-white/80 rounded-full hover:bg-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Imagery */}
        <div className="p-6 flex flex-col gap-3 bg-white border-r border-[#E9E2D8]">
          <div className="relative w-full aspect-3/4 rounded overflow-hidden bg-stone-100">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              className="object-cover"
            />
            {product.isSale && (
              <span className="absolute top-3 left-3 bg-[#702C3B] text-white text-[10px] font-mono tracking-widest px-2 py-0.5 uppercase">
                Sale {product.discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-20 rounded overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-[#702C3B]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-widest text-[#702C3B]">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-xs text-stone-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-stone-400 font-mono">({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="font-serif text-2xl text-stone-900 font-medium mt-1">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3 pb-4 border-b border-[#E9E2D8]">
              <span className="text-xl font-medium text-stone-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-mono text-[#702C3B] font-medium">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 mt-4 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mt-5">
              <div className="text-xs uppercase font-mono tracking-wider text-stone-500 mb-2">
                Color: <span className="text-stone-900 font-medium">{currentColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                      currentColor === c.name
                        ? 'border-[#702C3B] scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-stone-300"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono tracking-wider text-stone-500">
                  Select Size
                </span>
                {onOpenSizeGuide && (
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-[11px] text-[#702C3B] hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    Size Guide
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      setError('');
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${
                      currentSize === sz
                        ? 'border-[#171717] bg-[#171717] text-white'
                        : 'border-[#E9E2D8] bg-white text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
            </div>

            {/* Quantity */}
            <div className="mt-5 flex items-center gap-4">
              <span className="text-xs uppercase font-mono tracking-wider text-stone-500">
                Quantity
              </span>
              <div className="flex items-center border border-[#E9E2D8] bg-white rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-sm text-stone-600 hover:text-black"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-sm text-stone-600 hover:text-black"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3 pt-4 border-t border-[#E9E2D8]">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="flex-1 bg-[#171717] hover:bg-[#2A2A2A] text-white py-3 px-4 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-sm"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Shopping Bag</span>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 border rounded-sm transition-colors ${
                  isWishlisted
                    ? 'border-[#702C3B] text-[#702C3B] bg-[#702C3B]/5'
                    : 'border-[#E9E2D8] text-stone-600 hover:text-black hover:border-stone-400 bg-white'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#702C3B]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7658]" />
                In Stock & Authentic
              </span>
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="text-[#702C3B] hover:underline flex items-center gap-1 font-medium"
              >
                Full Product Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
