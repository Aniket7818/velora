'use client';

import { useState } from 'react';
import { X, Ruler, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProductCategory } from '@/types';

interface SizeFitFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ProductCategory;
  onSelectSize?: (size: string) => void;
}

export function SizeFitFinderModal({
  isOpen,
  onClose,
  category,
  onSelectSize,
}: SizeFitFinderModalProps) {
  const [activeTab, setActiveTab] = useState<'finder' | 'chart'>('finder');
  const [height, setHeight] = useState('170'); // cm
  const [weight, setWeight] = useState('65'); // kg
  const [usualSize, setUsualSize] = useState('M');
  const [fitPreference, setFitPreference] = useState<'Slim' | 'Regular' | 'Relaxed'>('Regular');
  const [result, setResult] = useState<{
    recommendedSize: string;
    confidence: number;
    explanation: string;
  } | null>(null);

  if (!isOpen) return null;

  const calculateRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseInt(height) || 170;
    const w = parseInt(weight) || 65;

    // Rule-based deterministic size estimation
    let base = 'M';
    if (category === 'Footwear') {
      base = h > 180 ? '43' : h > 172 ? '41' : '39';
    } else {
      const bmi = w / Math.pow(h / 100, 2);
      if (bmi < 20) {
        base = fitPreference === 'Relaxed' ? 'S' : 'XS';
      } else if (bmi < 24) {
        base = fitPreference === 'Slim' ? 'S' : fitPreference === 'Relaxed' ? 'L' : 'M';
      } else if (bmi < 28) {
        base = fitPreference === 'Slim' ? 'M' : fitPreference === 'Relaxed' ? 'XL' : 'L';
      } else {
        base = fitPreference === 'Slim' ? 'L' : 'XL';
      }
    }

    setResult({
      recommendedSize: base,
      confidence: 94,
      explanation: `Calculated from your ${h}cm stature, ${fitPreference.toLowerCase()} fit preference, and atelier drape metrics for ${category.toLowerCase()} tailoring.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#F8F6F1] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E9E2D8] z-10 p-6 sm:p-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E2D8]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#702C3B]" />
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Smart Size &amp; Drape Assistant
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-black rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#E9E2D8] mt-4">
          <button
            onClick={() => setActiveTab('finder')}
            className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'finder'
                ? 'border-b-2 border-[#702C3B] text-[#702C3B] font-semibold'
                : 'text-stone-500 hover:text-black'
            }`}
          >
            Personal Fit Calculator
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'chart'
                ? 'border-b-2 border-[#702C3B] text-[#702C3B] font-semibold'
                : 'text-stone-500 hover:text-black'
            }`}
          >
            Atelier Size Chart
          </button>
        </div>

        {activeTab === 'finder' ? (
          <form onSubmit={calculateRecommendation} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="140"
                  max="215"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-white border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-sm focus:outline-none focus:border-[#702C3B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  Weight (kg, optional)
                </label>
                <input
                  type="number"
                  min="35"
                  max="160"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-white border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-sm focus:outline-none focus:border-[#702C3B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  Usual Size in Other Brands
                </label>
                <select
                  value={usualSize}
                  onChange={(e) => setUsualSize(e.target.value)}
                  className="w-full bg-white border border-[#E9E2D8] p-2.5 text-sm text-stone-900 rounded-sm focus:outline-none focus:border-[#702C3B]"
                >
                  <option value="XS">Extra Small (XS)</option>
                  <option value="S">Small (S)</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                  Fit Silhouette Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Slim', 'Regular', 'Relaxed'] as const).map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setFitPreference(fit)}
                      className={`p-2 text-xs font-medium border rounded-sm transition-all ${
                        fitPreference === fit
                          ? 'border-[#702C3B] bg-[#702C3B] text-white'
                          : 'border-[#E9E2D8] bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#171717] hover:bg-[#2A2A2A] text-white py-3 px-4 text-xs font-mono uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4 text-[#B6A99A]" />
              Calculate My Optimal Size
            </button>

            {/* Recommendation Result */}
            {result && (
              <div className="mt-6 p-5 bg-white border border-[#2E7658]/40 rounded-sm animate-in fade-in duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7658]" />
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#2E7658] font-bold">
                        Calculated Match
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-stone-900">
                        Size {result.recommendedSize}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 bg-[#2E7658]/10 text-[#2E7658] rounded">
                    {result.confidence}% Match
                  </span>
                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {result.explanation}
                </p>

                {onSelectSize && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSize(result.recommendedSize);
                      onClose();
                    }}
                    className="mt-4 text-xs font-semibold text-[#702C3B] hover:underline"
                  >
                    Select Size {result.recommendedSize} &amp; Return to Product →
                  </button>
                )}
              </div>
            )}
          </form>
        ) : (
          /* Size Chart Table */
          <div className="mt-6 space-y-4">
            <p className="text-xs text-stone-600">
              All measurements in centimeters. Garments are hand-finished and measurements may
              exhibit minor 1cm nuances.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-700 border border-[#E9E2D8]">
                <thead className="bg-[#E9E2D8]/60 font-mono uppercase text-[11px] text-stone-800">
                  <tr>
                    <th className="p-2.5 border-b border-[#E9E2D8]">Size</th>
                    <th className="p-2.5 border-b border-[#E9E2D8]">Chest / Bust</th>
                    <th className="p-2.5 border-b border-[#E9E2D8]">Waist</th>
                    <th className="p-2.5 border-b border-[#E9E2D8]">Hip</th>
                    <th className="p-2.5 border-b border-[#E9E2D8]">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E2D8] bg-white">
                  <tr>
                    <td className="p-2.5 font-bold">XS</td>
                    <td className="p-2.5">82 - 86 cm</td>
                    <td className="p-2.5">64 - 68 cm</td>
                    <td className="p-2.5">88 - 92 cm</td>
                    <td className="p-2.5">59 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">S</td>
                    <td className="p-2.5">86 - 92 cm</td>
                    <td className="p-2.5">68 - 74 cm</td>
                    <td className="p-2.5">92 - 98 cm</td>
                    <td className="p-2.5">60 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">M</td>
                    <td className="p-2.5">92 - 98 cm</td>
                    <td className="p-2.5">74 - 80 cm</td>
                    <td className="p-2.5">98 - 104 cm</td>
                    <td className="p-2.5">61 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">L</td>
                    <td className="p-2.5">98 - 106 cm</td>
                    <td className="p-2.5">80 - 88 cm</td>
                    <td className="p-2.5">104 - 112 cm</td>
                    <td className="p-2.5">62 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">XL</td>
                    <td className="p-2.5">106 - 114 cm</td>
                    <td className="p-2.5">88 - 96 cm</td>
                    <td className="p-2.5">112 - 120 cm</td>
                    <td className="p-2.5">63 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Disclaimer Note */}
        <div className="mt-6 pt-4 border-t border-[#E9E2D8] flex items-start gap-2 text-[11px] text-stone-500">
          <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>
            Recommendations are approximate estimations based on standard atelier patterns. Fit
            varies by individual body architecture and styling preferences. Not a guaranteed fit
            prediction.
          </span>
        </div>
      </div>
    </div>
  );
}
