'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  category: 'Women' | 'Men' | 'Accessories' | 'Collections' | null;
  onClose: () => void;
}

export function MegaMenu({ category, onClose }: MegaMenuProps) {
  if (!category) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#F8F6F1] border-b border-[#E9E2D8] shadow-2xl py-8 px-6 z-40 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {category === 'Women' && (
          <>
            <div className="col-span-3 border-r border-[#E9E2D8] pr-6">
              <h4 className="text-xs uppercase tracking-widest font-mono text-[#702C3B] mb-4">
                Apparel Atelier
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-700">
                <li>
                  <Link
                    href="/shop?category=Women&sub=Blazers"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Tailored Blazers & Suiting
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Women&sub=Dresses"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Silk Charmeuse & Evening Dresses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Women&sub=Knitwear"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Mongolian Cashmere & Merino Knits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Women&sub=Trousers"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Pleated Wide-Leg Trousers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Women&sub=Outerwear"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Gabardine Trench & Overcoats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Women&sub=Tops"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    French Linen Waistcoats & Tops
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-3 border-r border-[#E9E2D8] pr-6">
              <h4 className="text-xs uppercase tracking-widest font-mono text-stone-500 mb-4">
                Curated Edits
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-700">
                <li>
                  <Link
                    href="/shop?category=Women&filter=new"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors font-medium flex items-center justify-between"
                  >
                    <span>Autumn / Winter New In</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#702C3B] text-white">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Women&filter=bestseller"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    The Atelier Icons (Best Sellers)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/looks"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Editorial Lookbooks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/outfit-studio"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors flex items-center gap-1.5 text-[#702C3B]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Interactive Outfit Studio
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-6 grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden bg-stone-200 h-56 rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
                  alt="Tailored Blazer"
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest text-stone-300 font-mono">
                    Signature Edit
                  </span>
                  <p className="font-serif text-base font-medium">The Double-Breasted Wool Blazer</p>
                  <Link
                    href="/product/atelier-double-breasted-wool-blazer"
                    onClick={onClose}
                    className="text-xs text-stone-200 hover:text-white mt-1 underline flex items-center gap-1"
                  >
                    Explore Piece <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="relative group overflow-hidden bg-stone-200 h-56 rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"
                  alt="Silk Charmeuse"
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest text-stone-300 font-mono">
                    Evening Wear
                  </span>
                  <p className="font-serif text-base font-medium">Lucerne Bias-Cut Silk</p>
                  <Link
                    href="/product/lucerne-bias-cut-silk-slip-dress"
                    onClick={onClose}
                    className="text-xs text-stone-200 hover:text-white mt-1 underline flex items-center gap-1"
                  >
                    Explore Piece <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {category === 'Men' && (
          <>
            <div className="col-span-3 border-r border-[#E9E2D8] pr-6">
              <h4 className="text-xs uppercase tracking-widest font-mono text-[#702C3B] mb-4">
                Sartorial Tailoring
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-700">
                <li>
                  <Link
                    href="/shop?category=Men&sub=Blazers"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Deconstructed Cashmere Blazers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Men&sub=Shirts"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Supima Oxford & Camp-Collar Silks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Men&sub=Knitwear"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Fine-Knit Silk Polos & Ribbed Turtlenecks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Men&sub=Trousers"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Kyoto Flannel & Irish Linen Trousers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Men&sub=Outerwear"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Boiled Wool Overcoats & Suede Bombers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-3 border-r border-[#E9E2D8] pr-6">
              <h4 className="text-xs uppercase tracking-widest font-mono text-stone-500 mb-4">
                The Heritage Series
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-700">
                <li>
                  <Link
                    href="/shop?category=Men&filter=new"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors font-medium flex items-center justify-between"
                  >
                    <span>Neapolitan Autumn Drop</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#702C3B] text-white">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Men&filter=bestseller"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Sartorial Essentials
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ai-stylist"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors flex items-center gap-1.5 text-[#702C3B]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Personal Stylist
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-6 grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden bg-stone-200 h-56 rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
                  alt="Men's Blazer"
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest text-stone-300 font-mono">
                    Homme Sartorial
                  </span>
                  <p className="font-serif text-base font-medium">Deconstructed Cashmere Blazer</p>
                  <Link
                    href="/product/savile-deconstructed-cashmere-blazer"
                    onClick={onClose}
                    className="text-xs text-stone-200 hover:text-white mt-1 underline flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="relative group overflow-hidden bg-stone-200 h-56 rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
                  alt="Suede Bomber"
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest text-stone-300 font-mono">
                    Kid Suede Craft
                  </span>
                  <p className="font-serif text-base font-medium">Oxford Fine Suede Bomber</p>
                  <Link
                    href="/product/oxford-fine-suede-bomber-jacket"
                    onClick={onClose}
                    className="text-xs text-stone-200 hover:text-white mt-1 underline flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {category === 'Accessories' && (
          <>
            <div className="col-span-3 border-r border-[#E9E2D8] pr-6">
              <h4 className="text-xs uppercase tracking-widest font-mono text-[#702C3B] mb-4">
                Leather Goods & Handbags
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-700">
                <li>
                  <Link
                    href="/shop?category=Accessories&sub=Bags"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Palais Sculptural Leather Totes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Accessories&sub=Bags"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Luna Curved Crescent Crossbodies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Accessories&sub=Belts"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Hand-Braided Calfskin Belts
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-3 border-r border-[#E9E2D8] pr-6">
              <h4 className="text-xs uppercase tracking-widest font-mono text-stone-500 mb-4">
                Jewelry & Accents
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-700">
                <li>
                  <Link
                    href="/shop?category=Accessories&sub=Jewelry"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    18k Vermeil Herringbone Chains
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Accessories&sub=Jewelry"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Baroque Pearl Drop Earrings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Accessories&sub=Eyewear"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Mazzucchelli Acetate Sunglasses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Accessories&sub=Scarves"
                    onClick={onClose}
                    className="hover:text-[#702C3B] transition-colors"
                  >
                    Lake Como Silk Twill Scarves
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-6 grid grid-cols-2 gap-4">
              <div className="relative group overflow-hidden bg-stone-200 h-56 rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
                  alt="Leather Bag"
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest text-stone-300 font-mono">
                    Artisanal Leather
                  </span>
                  <p className="font-serif text-base font-medium">Palais Sculptural Tote</p>
                  <Link
                    href="/product/palais-sculptural-leather-tote"
                    onClick={onClose}
                    className="text-xs text-stone-200 hover:text-white mt-1 underline flex items-center gap-1"
                  >
                    Shop Item <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="relative group overflow-hidden bg-stone-200 h-56 rounded-sm">
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
                  alt="Gold Vermeil"
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-widest text-stone-300 font-mono">
                    Fine Jewelry
                  </span>
                  <p className="font-serif text-base font-medium">Solis 18k Vermeil Chain</p>
                  <Link
                    href="/product/solis-vermeil-chain-necklace"
                    onClick={onClose}
                    className="text-xs text-stone-200 hover:text-white mt-1 underline flex items-center gap-1"
                  >
                    Shop Item <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {category === 'Collections' && (
          <div className="col-span-12 grid grid-cols-4 gap-6">
            <Link
              href="/looks"
              onClick={onClose}
              className="group block relative overflow-hidden h-64 bg-stone-200 rounded-sm"
            >
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80"
                alt="The Contemporary Power Edit"
                fill
                sizes="300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest font-mono text-stone-300">
                  Editorial Campaign
                </span>
                <h4 className="font-serif text-lg font-medium">The Contemporary Power Edit</h4>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                  Sharply tailored blazers, fluid silk, and architectural leather.
                </p>
              </div>
            </Link>

            <Link
              href="/looks"
              onClick={onClose}
              className="group block relative overflow-hidden h-64 bg-stone-200 rounded-sm"
            >
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
                alt="Neapolitan Suede"
                fill
                sizes="300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest font-mono text-stone-300">
                  Men’s Editorial
                </span>
                <h4 className="font-serif text-lg font-medium">Neapolitan Suede & Tailoring</h4>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                  Unstructured cashmere silhouettes and Tuscan leathercraft.
                </p>
              </div>
            </Link>

            <Link
              href="/looks"
              onClick={onClose}
              className="group block relative overflow-hidden h-64 bg-stone-200 rounded-sm"
            >
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80"
                alt="Riviera Dusk"
                fill
                sizes="300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest font-mono text-stone-300">
                  Evening & Resort
                </span>
                <h4 className="font-serif text-lg font-medium">Minimalist Riviera Dusk</h4>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                  Mulberry silk slip dresses and 18k vermeil jewelry.
                </p>
              </div>
            </Link>

            <Link
              href="/outfit-studio"
              onClick={onClose}
              className="group block relative overflow-hidden h-64 bg-[#702C3B] rounded-sm p-6 text-white flex flex-col justify-between"
            >
              <div>
                <Sparkles className="w-8 h-8 text-[#E9E2D8] mb-3" />
                <span className="text-[10px] uppercase tracking-widest font-mono text-stone-300">
                  Signature Innovation
                </span>
                <h4 className="font-serif text-xl font-medium mt-1">Outfit Builder Studio</h4>
                <p className="text-xs text-stone-200 mt-2 leading-relaxed">
                  Mix and match blazers, bottoms, shoes, and accents on an interactive live canvas.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider underline underline-offset-4">
                Launch Studio <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
