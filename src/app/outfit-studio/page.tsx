'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Layers,
  ShoppingBag,
  Bookmark,
  RotateCcw,
  Plus,
  X,
  Trash2,
  Check,
  Edit2,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';

export default function OutfitStudioPage() {
  const { products, addToCart, savedOutfits, saveOutfit, deleteOutfit, renameOutfit } =
    useVeloraStore();

  // Active outfit slots
  const [selectedTop, setSelectedTop] = useState<Product | null>(
    products.find((p) => p.id === 'prod-w-001') || null
  );
  const [selectedBottom, setSelectedBottom] = useState<Product | null>(
    products.find((p) => p.id === 'prod-w-004') || null
  );
  const [selectedShoes, setSelectedShoes] = useState<Product | null>(
    products.find((p) => p.id === 'prod-f-002') || null
  );
  const [selectedAccessory, setSelectedAccessory] = useState<Product | null>(
    products.find((p) => p.id === 'prod-a-001') || null
  );

  // Tab in product selector: Tops, Bottoms, Shoes, Accessories
  const [activeTab, setActiveTab] = useState<'tops' | 'bottoms' | 'shoes' | 'accessories'>('tops');

  // Modals & Drawers
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [lookName, setLookName] = useState('Autumn Sartorial Look');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Rename outfit inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Total price calculation
  const currentItems = [selectedTop, selectedBottom, selectedShoes, selectedAccessory].filter(
    Boolean
  ) as Product[];

  const totalPrice = currentItems.reduce((sum, p) => sum + p.price, 0);

  // Filter products by tab
  const tabProducts = products.filter((p) => {
    if (activeTab === 'tops') {
      return ['Blazers', 'Tops', 'Knitwear', 'Outerwear', 'Shirts', 'Dresses'].includes(
        p.subcategory
      );
    }
    if (activeTab === 'bottoms') {
      return ['Trousers', 'Skirts'].includes(p.subcategory);
    }
    if (activeTab === 'shoes') {
      return p.category === 'Footwear';
    }
    if (activeTab === 'accessories') {
      return p.category === 'Accessories';
    }
    return false;
  });

  const handleEquipProduct = (product: Product) => {
    if (activeTab === 'tops') setSelectedTop(product);
    if (activeTab === 'bottoms') setSelectedBottom(product);
    if (activeTab === 'shoes') setSelectedShoes(product);
    if (activeTab === 'accessories') setSelectedAccessory(product);
  };

  const handleResetOutfit = () => {
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedShoes(null);
    setSelectedAccessory(null);
  };

  const handleSaveLookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookName.trim() || currentItems.length === 0) return;

    saveOutfit({
      name: lookName.trim(),
      description: 'Custom ensemble built in VELORA Outfit Studio',
      items: {
        top: selectedTop || undefined,
        bottom: selectedBottom || undefined,
        shoes: selectedShoes || undefined,
        accessory: selectedAccessory || undefined,
      },
      totalPrice,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSaveModalOpen(false);
    }, 1500);
  };

  const handleAddOutfitToCart = () => {
    if (currentItems.length === 0) return;
    currentItems.forEach((item) => {
      addToCart(item, item.sizes[0] || 'M', item.colors[0]?.name || 'Standard', 1);
    });
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2000);
  };

  const handleLoadSavedOutfit = (saved: (typeof savedOutfits)[0]) => {
    setSelectedTop(saved.items.top || null);
    setSelectedBottom(saved.items.bottom || null);
    setSelectedShoes(saved.items.shoes || null);
    setSelectedAccessory(saved.items.accessory || null);
    setIsSavedDrawerOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2D8] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
            <Layers className="w-4 h-4" />
            <span>Interactive Styling Workspace</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
            Outfit Builder Studio
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Mix and match silhouettes on the live editorial canvas to construct cohesive looks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSavedDrawerOpen(true)}
            className="px-4 py-2 bg-white border border-[#E9E2D8] hover:border-stone-400 text-stone-800 text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#702C3B]" />
            <span>Saved Looks ({savedOutfits.length})</span>
          </button>

          <button
            onClick={handleResetOutfit}
            className="p-2 border border-[#E9E2D8] hover:bg-stone-100 text-stone-600 rounded-xs transition-colors"
            title="Reset Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: Canvas (Left) + Selection Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Outfit Canvas */}
        <div className="lg:col-span-7 bg-white border border-[#E9E2D8] rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
              Live Atelier Canvas
            </span>
            <span className="text-xs font-mono text-[#702C3B]">
              {currentItems.length} of 4 Slots Equipped
            </span>
          </div>

          {/* 4-Slot Canvas Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Slot 1: Top / Blazer */}
            <div className="relative aspect-3/4 rounded-xs border-2 border-dashed border-[#E9E2D8] bg-[#F8F6F1] flex flex-col items-center justify-center p-3 text-center group overflow-hidden">
              {selectedTop ? (
                <>
                  <Image
                    src={selectedTop.images[0]}
                    alt={selectedTop.name}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => setSelectedTop(null)}
                      className="p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                      title="Remove top"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2.5 bg-black/75 backdrop-blur-xs text-white text-left">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-stone-300 block">
                      Layer / Top
                    </span>
                    <p className="text-xs font-medium truncate">{selectedTop.name}</p>
                    <span className="text-xs font-mono text-[#E9E2D8]">
                      {formatCurrency(selectedTop.price)}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => setActiveTab('tops')}
                  className="cursor-pointer flex flex-col items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors p-4"
                >
                  <Plus className="w-6 h-6 stroke-[1.5]" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    Equip Top / Blazer
                  </span>
                  <span className="text-[10px] text-stone-400">Click to choose from catalog</span>
                </div>
              )}
            </div>

            {/* Slot 2: Bottom / Trousers */}
            <div className="relative aspect-3/4 rounded-xs border-2 border-dashed border-[#E9E2D8] bg-[#F8F6F1] flex flex-col items-center justify-center p-3 text-center group overflow-hidden">
              {selectedBottom ? (
                <>
                  <Image
                    src={selectedBottom.images[0]}
                    alt={selectedBottom.name}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => setSelectedBottom(null)}
                      className="p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                      title="Remove bottom"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2.5 bg-black/75 backdrop-blur-xs text-white text-left">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-stone-300 block">
                      Bottom / Trousers
                    </span>
                    <p className="text-xs font-medium truncate">{selectedBottom.name}</p>
                    <span className="text-xs font-mono text-[#E9E2D8]">
                      {formatCurrency(selectedBottom.price)}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => setActiveTab('bottoms')}
                  className="cursor-pointer flex flex-col items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors p-4"
                >
                  <Plus className="w-6 h-6 stroke-[1.5]" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    Equip Trousers / Skirt
                  </span>
                  <span className="text-[10px] text-stone-400">Click to choose from catalog</span>
                </div>
              )}
            </div>

            {/* Slot 3: Footwear */}
            <div className="relative aspect-3/4 rounded-xs border-2 border-dashed border-[#E9E2D8] bg-[#F8F6F1] flex flex-col items-center justify-center p-3 text-center group overflow-hidden">
              {selectedShoes ? (
                <>
                  <Image
                    src={selectedShoes.images[0]}
                    alt={selectedShoes.name}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => setSelectedShoes(null)}
                      className="p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                      title="Remove footwear"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2.5 bg-black/75 backdrop-blur-xs text-white text-left">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-stone-300 block">
                      Handcrafted Footwear
                    </span>
                    <p className="text-xs font-medium truncate">{selectedShoes.name}</p>
                    <span className="text-xs font-mono text-[#E9E2D8]">
                      {formatCurrency(selectedShoes.price)}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => setActiveTab('shoes')}
                  className="cursor-pointer flex flex-col items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors p-4"
                >
                  <Plus className="w-6 h-6 stroke-[1.5]" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    Equip Footwear
                  </span>
                  <span className="text-[10px] text-stone-400">Click to choose from catalog</span>
                </div>
              )}
            </div>

            {/* Slot 4: Accessory */}
            <div className="relative aspect-3/4 rounded-xs border-2 border-dashed border-[#E9E2D8] bg-[#F8F6F1] flex flex-col items-center justify-center p-3 text-center group overflow-hidden">
              {selectedAccessory ? (
                <>
                  <Image
                    src={selectedAccessory.images[0]}
                    alt={selectedAccessory.name}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => setSelectedAccessory(null)}
                      className="p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                      title="Remove accessory"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2.5 bg-black/75 backdrop-blur-xs text-white text-left">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-stone-300 block">
                      Leather / Accessory
                    </span>
                    <p className="text-xs font-medium truncate">{selectedAccessory.name}</p>
                    <span className="text-xs font-mono text-[#E9E2D8]">
                      {formatCurrency(selectedAccessory.price)}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => setActiveTab('accessories')}
                  className="cursor-pointer flex flex-col items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors p-4"
                >
                  <Plus className="w-6 h-6 stroke-[1.5]" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    Equip Accessory
                  </span>
                  <span className="text-[10px] text-stone-400">Click to choose from catalog</span>
                </div>
              )}
            </div>
          </div>

          {/* Canvas Bottom Action Controls */}
          <div className="pt-4 border-t border-[#E9E2D8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                Total Outfit Value
              </span>
              <span className="font-serif text-3xl font-medium text-stone-900">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsSaveModalOpen(true)}
                disabled={currentItems.length === 0}
                className="flex-1 sm:flex-none px-5 py-3 border border-[#171717] hover:bg-[#171717] hover:text-white text-stone-900 text-xs font-mono uppercase tracking-widest font-semibold rounded-xs transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Look</span>
              </button>

              <button
                onClick={handleAddOutfitToCart}
                disabled={currentItems.length === 0 || cartSuccess}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#702C3B] hover:bg-[#5A232F] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs shadow-md transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {cartSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added {currentItems.length} Items</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Complete Look to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Wardrobe Selector Panel */}
        <div className="lg:col-span-5 bg-white border border-[#E9E2D8] rounded-sm p-6 space-y-6">
          <div className="border-b border-[#E9E2D8] pb-4">
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Wardrobe Catalog Picker
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click any piece to equip it to the corresponding canvas slot.
            </p>

            {/* Selector Category Tabs */}
            <div className="grid grid-cols-4 gap-1 mt-4 p-1 bg-[#F8F6F1] rounded-xs text-xs font-mono uppercase tracking-wider text-center">
              <button
                onClick={() => setActiveTab('tops')}
                className={`py-2 rounded-xs transition-all ${
                  activeTab === 'tops'
                    ? 'bg-[#171717] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                Tops
              </button>
              <button
                onClick={() => setActiveTab('bottoms')}
                className={`py-2 rounded-xs transition-all ${
                  activeTab === 'bottoms'
                    ? 'bg-[#171717] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                Bottoms
              </button>
              <button
                onClick={() => setActiveTab('shoes')}
                className={`py-2 rounded-xs transition-all ${
                  activeTab === 'shoes'
                    ? 'bg-[#171717] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                Shoes
              </button>
              <button
                onClick={() => setActiveTab('accessories')}
                className={`py-2 rounded-xs transition-all ${
                  activeTab === 'accessories'
                    ? 'bg-[#171717] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                Accs
              </button>
            </div>
          </div>

          {/* Product Items List for Active Tab */}
          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {tabProducts.map((p) => {
              const isEquipped =
                selectedTop?.id === p.id ||
                selectedBottom?.id === p.id ||
                selectedShoes?.id === p.id ||
                selectedAccessory?.id === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => handleEquipProduct(p)}
                  className={`p-2.5 rounded-xs border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isEquipped
                      ? 'border-[#702C3B] bg-[#702C3B]/5 ring-1 ring-[#702C3B]'
                      : 'border-[#E9E2D8] hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-18 relative rounded-xs overflow-hidden bg-stone-100 shrink-0">
                      <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-stone-400 block">
                        {p.brand}
                      </span>
                      <h4 className="text-xs font-medium text-stone-900 truncate">{p.name}</h4>
                      <p className="text-[11px] font-mono text-stone-600 mt-0.5">
                        {formatCurrency(p.price)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquipProduct(p);
                    }}
                    className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-xs transition-colors shrink-0 ${
                      isEquipped
                        ? 'bg-[#702C3B] text-white'
                        : 'bg-stone-100 hover:bg-[#171717] hover:text-white text-stone-800'
                    }`}
                  >
                    {isEquipped ? 'Equipped' : 'Equip'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Look Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsSaveModalOpen(false)} />
          <div className="relative bg-[#F8F6F1] p-6 rounded-sm max-w-md w-full border border-[#E9E2D8] shadow-2xl z-10">
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-1">
              Save Look to Wardrobe
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Name this combination so you can review, reopen, or add it to bag at any time.
            </p>

            {saveSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Outfit saved to your styling wardrobe!</span>
              </div>
            ) : (
              <form onSubmit={handleSaveLookSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                    Ensemble Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lookName}
                    onChange={(e) => setLookName(e.target.value)}
                    placeholder="e.g. Winter Gala Power Suit"
                    className="w-full bg-white border border-[#E9E2D8] px-3 py-2 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(false)}
                    className="flex-1 py-2 text-xs font-mono uppercase border border-stone-400 text-stone-800 rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-mono uppercase bg-[#702C3B] hover:bg-[#5A232F] text-white rounded-xs font-semibold"
                  >
                    Save Outfit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Saved Looks Drawer */}
      {isSavedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsSavedDrawerOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-[#F8F6F1] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E9E2D8]">
                <h3 className="font-serif text-xl font-medium text-stone-900">
                  Saved Outfits ({savedOutfits.length})
                </h3>
                <button
                  onClick={() => setIsSavedDrawerOpen(false)}
                  className="p-1 text-stone-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mt-6">
                {savedOutfits.length === 0 ? (
                  <p className="text-xs text-stone-500 italic text-center py-10">
                    No custom outfits saved yet. Build one on the canvas!
                  </p>
                ) : (
                  savedOutfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      className="bg-white border border-[#E9E2D8] p-4 rounded-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        {editingId === outfit.id ? (
                          <div className="flex items-center gap-1.5 flex-1 mr-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="text-xs border border-stone-400 px-2 py-1 rounded-xs w-full"
                            />
                            <button
                              onClick={() => {
                                renameOutfit(outfit.id, editingName);
                                setEditingId(null);
                              }}
                              className="text-xs text-[#2E7658] font-bold"
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-serif text-base font-medium text-stone-900">
                              {outfit.name}
                            </h4>
                            <span className="text-[11px] font-mono text-stone-500">
                              {formatCurrency(outfit.totalPrice)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(outfit.id);
                              setEditingName(outfit.name);
                            }}
                            className="text-stone-400 hover:text-black"
                            title="Rename"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteOutfit(outfit.id)}
                            className="text-stone-400 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Item Thumbnails */}
                      <div className="flex gap-2">
                        {Object.values(outfit.items)
                          .filter(Boolean)
                          .map((item, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-16 relative rounded-xs overflow-hidden border border-[#E9E2D8] bg-stone-100"
                            >
                              <Image src={item!.images[0]} alt="" fill sizes="48px" className="object-cover" />
                            </div>
                          ))}
                      </div>

                      <button
                        onClick={() => handleLoadSavedOutfit(outfit)}
                        className="w-full py-2 bg-stone-100 hover:bg-[#171717] hover:text-white text-stone-800 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Load on Canvas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E9E2D8]">
              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="w-full py-2.5 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
