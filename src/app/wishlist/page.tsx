'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  FolderPlus,
  Trash2,
  ShoppingBag,
  Share2,
  Check,
  Edit2,
  ArrowRight,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency } from '@/lib/utils/formatters';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistAndMoodboardsPage() {
  const {
    wishlist,
    products,
    moodboards,
    createMoodboard,
    deleteMoodboard,
    updateMoodboard,
    removeProductFromMoodboard,
    reorderMoodboardProducts,
    addToCart,
  } = useVeloraStore();

  const [activeTab, setActiveTab] = useState<'wishlist' | 'moodboards'>('wishlist');
  const [selectedBoardId, setSelectedBoardId] = useState<string>(moodboards[0]?.id || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [addAllSuccess, setAddAllSuccess] = useState(false);

  // Rename moodboard state
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  const wishlistedProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as (typeof products)[0][];

  const activeMoodboard = moodboards.find((b) => b.id === selectedBoardId) || moodboards[0];

  const activeMoodboardProducts = activeMoodboard
    ? (activeMoodboard.productIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as (typeof products)[0][])
    : [];

  const boardTotalValue = activeMoodboardProducts.reduce((sum, p) => sum + p.price, 0);

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newId = createMoodboard(newTitle.trim(), newDesc.trim());
    setSelectedBoardId(newId);
    setNewTitle('');
    setNewDesc('');
    setIsCreateModalOpen(false);
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    if (!activeMoodboard) return;
    const items = [...activeMoodboard.productIds];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const temp = items[index];
    items[index] = items[target];
    items[target] = temp;
    reorderMoodboardProducts(activeMoodboard.id, items);
  };

  const handleAddAllBoardToCart = () => {
    if (activeMoodboardProducts.length === 0) return;
    activeMoodboardProducts.forEach((p) => {
      addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard', 1);
    });
    setAddAllSuccess(true);
    setTimeout(() => setAddAllSuccess(false), 2000);
  };

  const handleCopyShareSummary = () => {
    if (!activeMoodboard) return;
    const text = `VELORA Curated Moodboard: "${activeMoodboard.title}"\n${
      activeMoodboard.description
    }\nPieces:\n${activeMoodboardProducts
      .map((p) => `• ${p.name} (${formatCurrency(p.price)})`)
      .join('\n')}\nTotal Curation Value: ${formatCurrency(
      boardTotalValue
    )}\n(Simulated Local Demo Link: https://velora.demo/wishlist?board=${activeMoodboard.id})`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2D8] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
            <Heart className="w-4 h-4" />
            <span>Private Curations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
            Wishlist &amp; Moodboards
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Organize personal wardrobe aspirations, create themed moodboards, and shop coordinated looks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xs transition-all ${
              activeTab === 'wishlist'
                ? 'bg-[#171717] text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            All Saved ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('moodboards')}
            className={`px-4 py-2 rounded-xs transition-all ${
              activeTab === 'moodboards'
                ? 'bg-[#171717] text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            Curated Moodboards ({moodboards.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ALL WISHLISTED PRODUCTS */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white border border-[#E9E2D8] p-12 text-center rounded-sm space-y-4 max-w-xl mx-auto">
              <Heart className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2]" />
              <h3 className="font-serif text-2xl text-stone-900 font-normal">
                Your Wishlist is Quiet
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Save pieces you adore while browsing to revisit them later or organize them into
                custom seasonal moodboards.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
                >
                  <span>Explore Atelier Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CURATED MOODBOARDS */}
      {activeTab === 'moodboards' && (
        <div className="space-y-8">
          {/* Moodboard Selector Bar + Create Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#E9E2D8] rounded-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-stone-400 mr-2">Collections:</span>
              {moodboards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBoardId(b.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-xs border transition-all ${
                    (selectedBoardId || moodboards[0]?.id) === b.id
                      ? 'border-[#702C3B] bg-[#702C3B] text-white'
                      : 'border-[#E9E2D8] bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {b.title} ({b.productIds.length})
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Create Moodboard</span>
            </button>
          </div>

          {/* Active Moodboard Detail View */}
          {activeMoodboard && (
            <div className="bg-white border border-[#E9E2D8] rounded-sm p-6 sm:p-8 space-y-8">
              {/* Moodboard Header Info */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E9E2D8]">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    {editingTitleId === activeMoodboard.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTitleText}
                          onChange={(e) => setEditingTitleText(e.target.value)}
                          className="font-serif text-2xl border border-stone-400 px-2 py-1 rounded-xs"
                        />
                        <button
                          onClick={() => {
                            updateMoodboard(activeMoodboard.id, { title: editingTitleText });
                            setEditingTitleId(null);
                          }}
                          className="text-xs px-3 py-1.5 bg-[#2E7658] text-white rounded-xs"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-serif text-3xl text-stone-900 font-normal">
                          {activeMoodboard.title}
                        </h2>
                        <button
                          onClick={() => {
                            setEditingTitleId(activeMoodboard.id);
                            setEditingTitleText(activeMoodboard.title);
                          }}
                          className="text-stone-400 hover:text-black"
                          title="Rename Moodboard"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
                    {activeMoodboard.description}
                  </p>
                </div>

                {/* Right Value & Sharing Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                      Curated Total
                    </span>
                    <span className="font-serif text-2xl font-medium text-stone-900">
                      {formatCurrency(boardTotalValue)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyShareSummary}
                      className="px-3 py-2 border border-[#E9E2D8] hover:border-black text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
                      title="Copy shareable summary"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied Summary</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share Board</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleAddAllBoardToCart}
                      disabled={activeMoodboardProducts.length === 0 || addAllSuccess}
                      className="px-4 py-2 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-wider rounded-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                    >
                      {addAllSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add Board to Bag</span>
                        </>
                      )}
                    </button>

                    {moodboards.length > 1 && (
                      <button
                        onClick={() => deleteMoodboard(activeMoodboard.id)}
                        className="p-2 text-stone-400 hover:text-red-700 border border-[#E9E2D8] rounded-xs"
                        title="Delete Moodboard"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Moodboard Product Items with Reorder Controls */}
              {activeMoodboardProducts.length === 0 ? (
                <div className="text-center py-12 text-stone-500 space-y-2">
                  <Layers className="w-8 h-8 text-stone-300 mx-auto stroke-[1.2]" />
                  <p className="font-serif text-lg text-stone-800">No Pieces in this Moodboard</p>
                  <p className="text-xs text-stone-400">
                    Add pieces from your wishlist or wardrobe catalog.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/shop"
                      className="inline-block px-4 py-2 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {activeMoodboardProducts.map((p, idx) => (
                    <div
                      key={p.id}
                      className="bg-[#F8F6F1] border border-[#E9E2D8] rounded-xs overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="relative aspect-3/4 bg-white overflow-hidden">
                        <Image src={p.images[0]} alt={p.name} fill sizes="250px" className="object-cover" />
                        
                        {/* Remove item button */}
                        <button
                          onClick={() => removeProductFromMoodboard(activeMoodboard.id, p.id)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors z-10"
                          title="Remove from moodboard"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Reorder arrows */}
                        <div className="absolute bottom-2 left-2 flex gap-1 z-10">
                          {idx > 0 && (
                            <button
                              onClick={() => handleReorder(idx, 'up')}
                              className="p-1 bg-white/90 hover:bg-white text-stone-800 rounded shadow-xs"
                              title="Move left"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < activeMoodboardProducts.length - 1 && (
                            <button
                              onClick={() => handleReorder(idx, 'down')}
                              className="p-1 bg-white/90 hover:bg-white text-stone-800 rounded shadow-xs"
                              title="Move right"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-stone-400">
                            {p.brand}
                          </span>
                          <Link
                            href={`/product/${p.slug}`}
                            className="font-serif text-sm font-medium text-stone-900 block hover:text-[#702C3B] line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          <span className="text-xs font-mono font-medium text-stone-800 block mt-0.5">
                            {formatCurrency(p.price)}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard', 1)
                          }
                          className="w-full py-1.5 bg-white border border-[#E9E2D8] hover:border-black text-stone-800 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Moodboard Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-[#F8F6F1] p-6 rounded-sm max-w-md w-full border border-[#E9E2D8] shadow-2xl z-10">
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-1">
              Create Curated Moodboard
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Gather silhouettes for upcoming travels, weddings, or capsule wardrobes.
            </p>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  Collection Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Autumn Capsule 2026"
                  className="w-full bg-white border border-[#E9E2D8] px-3 py-2 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  Aesthetic Notes / Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Virgin wool blazers, fluid silk, and Tuscan leather boots..."
                  className="w-full bg-white border border-[#E9E2D8] px-3 py-2 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2 text-xs font-mono uppercase border border-stone-400 text-stone-800 rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-mono uppercase bg-[#702C3B] hover:bg-[#5A232F] text-white rounded-xs font-semibold"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
