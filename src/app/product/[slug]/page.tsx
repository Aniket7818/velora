'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Heart,
  Scale,
  Bell,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Ruler,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency } from '@/lib/utils/formatters';
import { SizeFitFinderModal } from '@/components/product/SizeFitFinderModal';
import { PriceHistoryChart } from '@/components/product/PriceHistoryChart';
import { ProductCard } from '@/components/product/ProductCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleComparison,
    isInComparison,
    addPriceAlert,
    addRecentlyViewed,
  } = useVeloraStore();

  const product = products.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [targetAlertPrice, setTargetAlertPrice] = useState<number>(0);
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Review submission state (demo)
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sync viewed product & set initial defaults
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0]?.name || '');
      setTargetAlertPrice(Math.round(product.price * 0.9));
    }
  }, [product, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl text-stone-800">Piece Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">
          The requested garment is currently unavailable or has been archived from our catalog.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block px-6 py-3 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
        >
          Return to Wardrobe Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInComparison(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size to proceed.');
      return;
    }
    setSizeError('');
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError('Please select a size to proceed.');
      return;
    }
    setSizeError('');
    addToCart(product, selectedSize, selectedColor, quantity);
    router.push('/checkout');
  };

  const handleCreatePriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAlertPrice || targetAlertPrice <= 0) return;
    addPriceAlert(product, targetAlertPrice);
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setIsPriceAlertOpen(false);
    }, 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviewSubmitted(true);
    setReviewName('');
    setReviewComment('');
  };

  // Cross-sell items
  const completeTheLookItems = products
    .filter((p) => p.category !== product.category && p.id !== product.id)
    .slice(0, 3);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-300" />
        <Link href="/shop" className="hover:text-black">
          Atelier
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-300" />
        <Link href={`/shop?category=${product.category}`} className="hover:text-black">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-300" />
        <span className="text-stone-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery (Thumbnails + Hero Image) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-18 h-24 sm:w-20 sm:h-28 rounded-xs overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#702C3B] ring-1 ring-[#702C3B]'
                      : 'border-[#E9E2D8] opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Primary Viewport Image */}
          <div className="relative aspect-3/4 flex-1 rounded-sm overflow-hidden bg-white border border-[#E9E2D8] group">
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.isSale && (
              <span className="absolute top-4 left-4 bg-[#702C3B] text-white text-[10px] font-mono tracking-widest px-3 py-1 uppercase shadow-sm">
                Sale {product.discount}% Off
              </span>
            )}
          </div>
        </div>

        {/* Right: Buy Box & Product Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-stone-700">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-stone-400 font-mono">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-4 pb-4 border-b border-[#E9E2D8]">
              <span className="font-serif text-2xl font-medium text-stone-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-stone-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-mono font-medium text-[#702C3B] bg-[#702C3B]/10 px-2 py-0.5 rounded">
                  Save {product.discount}%
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono uppercase tracking-wider text-stone-600">
                Color Palette:
              </span>
              <span className="font-medium text-stone-900">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                    selectedColor === c.name
                      ? 'border-[#702C3B] scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  title={c.name}
                >
                  <span
                    className="block w-full h-full rounded-full border border-stone-300 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono uppercase tracking-wider text-stone-600">
                Select Size:
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[#702C3B] hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Smart Size &amp; Fit Finder</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    setSelectedSize(sz);
                    setSizeError('');
                  }}
                  className={`min-w-12 px-3 py-2 text-xs font-medium rounded-xs border transition-all ${
                    selectedSize === sz
                      ? 'border-[#171717] bg-[#171717] text-white'
                      : 'border-[#E9E2D8] bg-white text-stone-800 hover:border-stone-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
            {sizeError && <p className="text-xs text-red-600 mt-1">{sizeError}</p>}
          </div>

          {/* Quantity & Actions */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E9E2D8] bg-white rounded-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-600 hover:text-black text-sm"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-600 hover:text-black text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedNotice || product.stock === 0}
                className="flex-1 bg-[#171717] hover:bg-[#2A2A2A] text-white py-3 px-6 text-xs font-mono uppercase tracking-widest font-semibold transition-all rounded-xs flex items-center justify-center gap-2"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : product.stock === 0 ? (
                  <span>Temporarily Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Buy Now Button (Quick Checkout) */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full bg-[#702C3B] hover:bg-[#5A232F] text-white py-3 px-6 text-xs font-mono uppercase tracking-widest font-semibold transition-all rounded-xs flex items-center justify-center gap-2"
            >
              <span>Instant Checkout (Demo)</span>
            </button>

            {/* Utility Bar: Wishlist, Compare, Price Alert */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`py-2 px-3 border rounded-xs text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                  isWishlisted
                    ? 'border-[#702C3B] text-[#702C3B] bg-[#702C3B]/5'
                    : 'border-[#E9E2D8] text-stone-700 bg-white hover:border-stone-400'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#702C3B]' : ''}`} />
                <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>

              <button
                onClick={() => toggleComparison(product.id)}
                className={`py-2 px-3 border rounded-xs text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                  isCompared
                    ? 'border-[#171717] bg-[#171717] text-white'
                    : 'border-[#E9E2D8] text-stone-700 bg-white hover:border-stone-400'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
              </button>

              <button
                onClick={() => setIsPriceAlertOpen(true)}
                className="py-2 px-3 border border-[#E9E2D8] bg-white hover:border-stone-400 text-stone-700 rounded-xs text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Watch Price</span>
              </button>
            </div>
          </div>

          {/* Guarantees Accordion Details */}
          <div className="pt-6 border-t border-[#E9E2D8] space-y-3 text-xs text-stone-600">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#702C3B] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  Complimentary White-Glove Courier
                </span>
                <span>Delivered within 2–3 business days with custom luxury garment packaging.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-4 h-4 text-[#702C3B] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  14-Day Complimentary Returns
                </span>
                <span>Effortless courier doorstep pickup and immediate store credit simulation.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#702C3B] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  Noble Material Certification
                </span>
                <span>{product.material}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Material, Care, Price History Chart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#E9E2D8]">
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-medium text-stone-900">
            Material Composition &amp; Care
          </h3>
          <div className="bg-white border border-[#E9E2D8] p-5 rounded-xs space-y-3 text-xs text-stone-700">
            <div>
              <span className="font-mono uppercase text-stone-400 text-[10px] block">
                Primary Fiber
              </span>
              <p className="font-medium text-stone-900 mt-0.5">{product.material}</p>
            </div>
            <div className="pt-2 border-t border-[#E9E2D8]">
              <span className="font-mono uppercase text-stone-400 text-[10px] block">
                Atelier Care Protocol
              </span>
              <p className="text-stone-600 mt-0.5 leading-relaxed">{product.care}</p>
            </div>
            <div className="pt-2 border-t border-[#E9E2D8]">
              <span className="font-mono uppercase text-stone-400 text-[10px] block">
                Fit Silhouette
              </span>
              <p className="text-stone-900 font-medium mt-0.5">{product.fit || 'Regular'} Fit</p>
            </div>
          </div>
        </div>

        <div>
          <PriceHistoryChart
            priceHistory={product.priceHistory}
            currentPrice={product.price}
          />
        </div>
      </div>

      {/* Complete The Look (Cross-Sell Ensembles) */}
      {completeTheLookItems.length > 0 && (
        <section className="pt-10 border-t border-[#E9E2D8]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
                Sartorial Synergy
              </span>
              <h3 className="font-serif text-2xl text-stone-900 font-normal mt-1">
                Complete The Look
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {completeTheLookItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="pt-10 border-t border-[#E9E2D8]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-semibold">
              Client Feedback
            </span>
            <h3 className="font-serif text-2xl text-stone-900 font-normal mt-1">
              Atelier Reviews ({product.reviewCount})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <span className="font-serif text-xl font-medium">{product.rating} out of 5.0</span>
          </div>
        </div>

        {/* Existing verified reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-[#E9E2D8] p-5 rounded-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900">Dr. Meera Sen</span>
              <span className="text-stone-400 font-mono">Verified Patron • 2 weeks ago</span>
            </div>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              “The wool and silk weight has that rare bespoke drape you typically only find in Savile
              Row or Parisian ateliers. Impeccable shoulder construction and horn buttons.”
            </p>
          </div>

          <div className="bg-white border border-[#E9E2D8] p-5 rounded-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-900">Vikram Malhotra</span>
              <span className="text-stone-400 font-mono">Verified Patron • 1 month ago</span>
            </div>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-500" />
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              “Purchased for an autumn gala in New Delhi. Sizing matched the Smart Size calculator
              accurately. The material feels deeply substantial yet breathable.”
            </p>
          </div>
        </div>

        {/* Write a Demo Review Form */}
        <div className="bg-white border border-[#E9E2D8] p-6 rounded-xs max-w-xl">
          <h4 className="font-serif text-base font-medium text-stone-900 mb-1">
            Write a Client Review (Demo)
          </h4>
          <p className="text-[11px] text-stone-500 mb-4">
            Share your fit, material, and styling impressions with the VELORA community.
          </p>

          {reviewSubmitted ? (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your verified client review has been recorded.</span>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Radhika Roy"
                  className="w-full bg-[#F8F6F1] border border-[#E9E2D8] px-3 py-2 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">
                  Rating
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-[#F8F6F1] border border-[#E9E2D8] px-3 py-2 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Highly Satisfied)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">
                  Your Impressions
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Comment on fit, fabric texture, and craftsmanship..."
                  className="w-full bg-[#F8F6F1] border border-[#E9E2D8] px-3 py-2 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-[#E9E2D8]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
                More from {product.category}
              </span>
              <h3 className="font-serif text-2xl text-stone-900 font-normal mt-1">
                Related Atelier Pieces
              </h3>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs uppercase font-mono tracking-wider text-[#702C3B] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Price Alert Dialog Modal */}
      {isPriceAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsPriceAlertOpen(false)} />
          <div className="relative bg-[#F8F6F1] p-6 rounded-sm max-w-md w-full border border-[#E9E2D8] shadow-2xl z-10">
            <h4 className="font-serif text-xl font-medium text-stone-900 mb-1">
              Set Price Watch Alert
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              Get notified immediately in your client notification center when{' '}
              <strong>{product.name}</strong> drops to your target price.
            </p>

            {alertSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Price watch alert activated for {formatCurrency(targetAlertPrice)}!</span>
              </div>
            ) : (
              <form onSubmit={handleCreatePriceAlert} className="space-y-4">
                <div>
                  <span className="text-xs text-stone-600 block mb-1">Current Atelier Price</span>
                  <div className="text-lg font-medium text-stone-900">
                    {formatCurrency(product.price)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                    Your Target Price (₹)
                  </label>
                  <input
                    type="number"
                    value={targetAlertPrice}
                    onChange={(e) => setTargetAlertPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPriceAlertOpen(false)}
                    className="flex-1 py-2 text-xs font-mono uppercase border border-stone-400 text-stone-800 rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-mono uppercase bg-[#702C3B] hover:bg-[#5A232F] text-white rounded-xs"
                  >
                    Activate Watch
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Size Fit Finder Modal */}
      <SizeFitFinderModal
        category={product.category}
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </div>
  );
}
