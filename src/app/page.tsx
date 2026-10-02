'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Crown,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Camera,
  ShoppingBag,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { ProductCard } from '@/components/product/ProductCard';
import { INITIAL_EDITORIAL_LOOKS } from '@/lib/data/initialData';
import { formatCurrency } from '@/lib/utils/formatters';

export default function HomePage() {
  const { products, recentlyViewed, addToCart } = useVeloraStore();

  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const trending = products.filter((p) => p.isTrending).slice(0, 8);

  const recentlyViewedProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  // New arrivals scroll index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Newsletter state
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubmitted, setNlSubmitted] = useState(false);
  const [nlError, setNlError] = useState('');

  const handleNlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail || !nlEmail.includes('@') || !nlEmail.includes('.')) {
      setNlError('Please provide a valid email address.');
      return;
    }
    setNlError('');
    setNlSubmitted(true);
  };

  const categories = [
    {
      name: 'Women’s Atelier',
      category: 'Women',
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      description: 'Double-breasted virgin wool tailoring & silk charmeuse evening wear',
      count: '11 Pieces',
    },
    {
      name: 'Men’s Sartorial',
      category: 'Men',
      image:
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      description: 'Deconstructed cashmere blazers & Japanese selvedge denim',
      count: '9 Pieces',
    },
    {
      name: 'Fine Accessories',
      category: 'Accessories',
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      description: 'Architectural calfskin totes, 18k vermeil jewelry & Lake Como silks',
      count: '8 Pieces',
    },
    {
      name: 'Tuscan Footwear',
      category: 'Footwear',
      image:
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      description: 'Vibram commando lug-sole boots & Blake-stitched velour suede loafers',
      count: '6 Pieces',
    },
  ];

  const igPosts = [
    {
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      tag: '@velorastyle #PowerEdit',
    },
    {
      image:
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
      tag: '@velorastyle #SilkCharmeuse',
    },
    {
      image:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      tag: '@velorastyle #UrbanArchitect',
    },
    {
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      tag: '@velorastyle #LinenVest',
    },
    {
      image:
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
      tag: '@velorastyle #CashmereSeason',
    },
    {
      image:
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
      tag: '@velorastyle #HeritageTrench',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=85"
          alt="VELORA Luxury Autumn/Winter Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65 scale-100 hover:scale-102 transition-transform duration-1000"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/30 to-[#171717]/50" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-mono uppercase tracking-[0.25em] text-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-[#E9E2D8]" />
            Autumn / Winter 2026 Collection
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.08] text-white">
            Style Beyond <span className="italic font-light">Ordinary.</span>
          </h1>

          <p className="max-w-xl mx-auto text-base sm:text-lg text-stone-200 font-light leading-relaxed">
            Discover tailored silhouettes, noble virgin wool, and pure silk charmeuse curated by
            intelligent styling technology.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#171717] hover:bg-stone-100 text-xs font-mono uppercase tracking-widest transition-all font-semibold rounded-xs shadow-lg flex items-center justify-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/ai-stylist"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-widest transition-all font-medium rounded-xs border border-white/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Your Style (AI)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. NEW ARRIVALS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-[#E9E2D8] pb-6">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
              Fresh From The Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
              New Arrivals
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/shop?filter=new"
              className="text-xs uppercase font-mono tracking-wider text-[#702C3B] hover:underline flex items-center gap-1"
            >
              View Full Drop ({newArrivals.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                disabled={carouselIndex === 0}
                className="p-2 border border-[#E9E2D8] rounded-full hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCarouselIndex(Math.min(newArrivals.length - 4, carouselIndex + 1))}
                disabled={carouselIndex >= newArrivals.length - 4}
                className="p-2 border border-[#E9E2D8] rounded-full hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(carouselIndex, carouselIndex + 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY (Editorial Asymmetric Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
            Atelier Departments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
            Shop by Category
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Engineered silhouettes in cashmere, mulberry silk, and hand-finished Tuscan leather.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.name}
              href={`/shop?category=${cat.category}`}
              className="group relative block aspect-3/4 overflow-hidden rounded-sm bg-stone-200"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-300">
                  {cat.count}
                </span>
                <h3 className="font-serif text-2xl font-normal mt-1 group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 mt-2 line-clamp-2 leading-relaxed opacity-90">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white underline underline-offset-4 font-medium">
                  <span>Explore Wardrobe</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. AI PERSONAL STYLIST PROMO TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#171717] rounded-sm p-8 sm:p-14 text-white border border-[#2A2A2A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#702C3B] rounded-full text-[10px] font-mono uppercase tracking-widest text-white">
                <Sparkles className="w-3 h-3" />
                VELORA Signature Innovation
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
                Meet Your AI Personal Stylist
              </h2>

              <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
                Tired of endless scrolling? Select your occasion, palette, and style aesthetic. Our
                deterministic curation engine crafts a harmonious, ready-to-wear ensemble from our
                luxury catalog in seconds.
              </p>

              {/* Sample criteria pills */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-stone-400">
                <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded">
                  ✦ Occasion: Date Night &amp; Office
                </span>
                <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded">
                  ✦ Palette: Earth Tones &amp; Neutrals
                </span>
                <span className="px-2.5 py-1 bg-stone-900 border border-stone-800 rounded">
                  ✦ Aesthetic: Minimalist &amp; Elegant
                </span>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/ai-stylist"
                  className="px-6 py-3 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-widest font-semibold transition-all rounded-xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch AI Stylist</span>
                </Link>

                <Link
                  href="/outfit-studio"
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-mono uppercase tracking-widest border border-stone-700 transition-all rounded-xs flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Interactive Studio</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/5 w-full rounded-sm overflow-hidden border border-stone-700 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
                  alt="AI Stylist Look Composition"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute bottom-4 inset-x-4 p-4 bg-[#171717]/90 backdrop-blur-md border border-stone-700 text-xs text-white rounded-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#B6A99A]">
                    <span>OUTFIT GENERATED</span>
                    <span>100% CATALOG MATCH</span>
                  </div>
                  <p className="font-serif text-sm font-medium mt-1">The Metropolitan Silk &amp; Blazer Look</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">4 coordinating atelier items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP THE LOOK (Editorial Complete Looks) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-[#E9E2D8] pb-6">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
              Curated Ensembles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
              Shop The Look
            </h2>
          </div>

          <Link
            href="/looks"
            className="text-xs uppercase font-mono tracking-wider text-[#702C3B] hover:underline flex items-center gap-1"
          >
            All Editorial Lookbooks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_EDITORIAL_LOOKS.slice(0, 2).map((look) => {
            const lookProducts = look.productIds
              .map((id) => products.find((p) => p.id === id))
              .filter(Boolean);
            const total = lookProducts.reduce((s, p) => s + (p?.price || 0), 0);

            return (
              <div
                key={look.id}
                className="bg-white border border-[#E9E2D8] rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 w-full bg-stone-100">
                  <Image
                    src={look.image}
                    alt={look.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#171717] text-white text-[10px] font-mono tracking-widest px-2.5 py-0.5 uppercase">
                    {look.season}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#702C3B]">
                    {look.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl text-stone-900 font-medium mt-1">
                    {look.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {look.description}
                  </p>

                  {/* Included Items Thumbnails */}
                  <div className="mt-5 pt-4 border-t border-[#E9E2D8]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-2">
                      Included Atelier Pieces:
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {lookProducts.map((p) => p && (
                        <Link
                          key={p.id}
                          href={`/product/${p.slug}`}
                          className="w-14 h-18 relative rounded overflow-hidden shrink-0 border border-[#E9E2D8] hover:border-[#702C3B] transition-colors"
                          title={`${p.name} - ${formatCurrency(p.price)}`}
                        >
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E9E2D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block">
                        Complete Look Value
                      </span>
                      <span className="font-serif text-xl font-medium text-stone-900">
                        {formatCurrency(total)}
                      </span>
                    </div>

                    <Link
                      href="/looks"
                      className="px-5 py-2.5 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider transition-colors rounded-xs flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Shop Look</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. BEST SELLERS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-[#E9E2D8] pb-6">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
              The Wardrobe Staples
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
              Best Sellers
            </h2>
          </div>

          <Link
            href="/shop?filter=bestseller"
            className="text-xs uppercase font-mono tracking-wider text-[#702C3B] hover:underline flex items-center gap-1"
          >
            Explore All Best Sellers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. EDITORIAL CAMPAIGN BANNER */}
      <section className="relative aspect-21/9 min-h-[420px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative w-full h-full min-h-[420px] rounded-sm overflow-hidden bg-stone-900">
          <Image
            src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=80"
            alt="The Autumn Trench Campaign"
            fill
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-8 sm:p-16 flex flex-col justify-center max-w-xl text-white">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B6A99A]">
              Private Atelier Gazette
            </span>
            <h3 className="font-serif text-3xl sm:text-5xl font-light leading-tight mt-2">
              The Art of Permanent Elegance
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-4 leading-relaxed font-light">
              Crafted in limited runs using time-honored European artisanal methods. Discover
              weather-resistant organic cotton gabardine and Mongolian cashmere coats designed to endure.
            </p>
            <div className="mt-6">
              <Link
                href="/shop?category=Women&sub=Outerwear"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#171717] hover:bg-stone-100 text-xs font-mono uppercase tracking-widest font-semibold transition-colors rounded-xs"
              >
                <span>Shop Outerwear Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TRENDING NOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-[#E9E2D8] pb-6">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
              In The Spotlight
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
              Trending Now
            </h2>
          </div>

          <Link
            href="/shop?filter=trending"
            className="text-xs uppercase font-mono tracking-wider text-[#702C3B] hover:underline flex items-center gap-1"
          >
            All Trending Pieces <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 9. VELORA REWARDS CLUB INTRO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E9E2D8]/50 border border-[#E9E2D8] p-8 sm:p-12 rounded-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-[#702C3B] text-xs font-mono uppercase tracking-widest font-semibold">
              <Crown className="w-4 h-4" />
              <span>Velora Privilège Society</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              Earn Points With Every Simulated Atelier Purchase
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
              Ascend from Silver to Platinum VIP tier. Unlock complimentary white-glove courier,
              private seasonal styling sessions, and redeemable privilege vouchers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
            <Link
              href="/rewards"
              className="px-6 py-3 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-widest text-center transition-colors rounded-xs font-semibold"
            >
              Explore Rewards Tier
            </Link>
            <Link
              href="/account"
              className="px-6 py-3 bg-white border border-[#E9E2D8] hover:border-stone-400 text-stone-800 text-xs font-mono uppercase tracking-widest text-center transition-colors rounded-xs font-medium"
            >
              Check My Balance
            </Link>
          </div>
        </div>
      </section>

      {/* 10. RECENTLY VIEWED PRODUCTS (If Any) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 border-b border-[#E9E2D8] pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-semibold">
                Your Browsing Atelier
              </span>
              <h3 className="font-serif text-2xl text-stone-900 font-normal mt-0.5">
                Recently Viewed
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewedProducts.map((p) => p && (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 11. INSTAGRAM EDITORIAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#702C3B] mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>#VeloraAtelier</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
            As Styled By The World
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tag @velorastyle to be featured in our seasonal lookbook.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {igPosts.map((post, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xs overflow-hidden group bg-stone-200"
            >
              <Image
                src={post.image}
                alt="Instagram Styled"
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center text-white">
                <span className="text-[11px] font-mono">{post.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. HOMEPAGE NEWSLETTER SIGNUP */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#E9E2D8] p-8 sm:p-12 text-center rounded-sm space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#702C3B] font-semibold">
            The Private Atelier Gazette
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
            Subscribe for 15% Off Your First Order
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Receive exclusive seasonal drop notifications, styling insights from our master tailors,
            and private sale invitations.
          </p>

          {nlSubmitted ? (
            <div className="p-4 bg-[#2E7658]/10 border border-[#2E7658]/30 rounded text-[#2E7658] flex items-center justify-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>You’re subscribed! Use promo code <strong>VELORA15</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleNlSubmit} className="max-w-md mx-auto space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-[#F8F6F1] border border-[#E9E2D8] text-xs px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#702C3B] flex-1 rounded-l-xs"
                />
                <button
                  type="submit"
                  className="bg-[#171717] hover:bg-[#2A2A2A] text-white px-5 py-3 text-xs font-mono uppercase tracking-wider rounded-r-xs transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
              {nlError && <p className="text-[11px] text-red-600">{nlError}</p>}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
