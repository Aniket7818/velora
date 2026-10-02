'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  RotateCcw,
  CheckCircle2,
  Package,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useVeloraStore } from '@/lib/store/useVeloraStore';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export default function ReturnsPortalPage() {
  const { orders, returns, submitReturnRequest } = useVeloraStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);
  const [reason, setReason] = useState<string>('Fit slightly too loose');
  const [notes, setNotes] = useState<string>('');
  const [submittedReturnId, setSubmittedReturnId] = useState<string | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const selectedItem = selectedOrder?.items[selectedItemIdx];

  const returnReasons = [
    'Fit slightly too loose (Request smaller size)',
    'Fit slightly too snug (Request larger size)',
    'Fabric / texture nuance differs from expectation',
    'Color tone variance in natural light',
    'Changed wardrobe preference',
  ];

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !selectedItem) return;

    const newRet = submitReturnRequest(
      selectedOrder.id,
      selectedOrder.orderNumber,
      selectedItem,
      reason,
      notes
    );

    setSubmittedReturnId(newRet.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-[#E9E2D8] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <RotateCcw className="w-4 h-4" />
          <span>Atelier Concierge Care</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1">
          Returns &amp; Exchanges Portal
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Initiate a complimentary doorstep courier pickup for unworn garments within 14 days of delivery.
        </p>
      </div>

      {submittedReturnId ? (
        <div className="bg-white border border-[#E9E2D8] p-8 sm:p-12 text-center rounded-sm space-y-4 max-w-xl mx-auto animate-in fade-in duration-300">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#2E7658] font-bold">
            Simulated Return Authorized
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
            Return Request Lodged
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your return authorization has been recorded under reference{' '}
            <strong className="font-mono text-stone-900">{submittedReturnId}</strong>. A courier
            pickup agent has been simulated for your doorstep within 48 hours.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedReturnId(null);
                setNotes('');
              }}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono uppercase tracking-wider rounded-xs"
            >
              Request Another Return
            </button>
            <Link
              href="/account"
              className="px-6 py-2.5 bg-[#171717] text-white text-xs font-mono uppercase tracking-wider rounded-xs"
            >
              View in My Account
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Request Form */}
          <div className="lg:col-span-7 bg-white border border-[#E9E2D8] p-6 sm:p-8 rounded-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E2D8]">
              <h3 className="font-serif text-xl font-medium text-stone-900">
                Submit Return Request
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                Simulated Flow
              </span>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-6">
                You have no completed orders yet. Place a demo order to test the return workflow.
              </p>
            ) : (
              <form onSubmit={handleSubmitReturn} className="space-y-5">
                {/* 1. Select Order */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 mb-1.5">
                    1. Select Order
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => {
                      setSelectedOrderId(e.target.value);
                      setSelectedItemIdx(0);
                    }}
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} ({formatDate(o.createdAt)}) • {o.items.length} Items •{' '}
                        {formatCurrency(o.total)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Select Item from Order */}
                {selectedOrder && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-600 mb-1.5">
                      2. Choose Garment to Return
                    </label>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedItemIdx(idx)}
                          className={`p-3 border rounded-xs cursor-pointer flex items-center justify-between text-xs transition-all ${
                            selectedItemIdx === idx
                              ? 'border-[#702C3B] bg-[#702C3B]/5 ring-1 ring-[#702C3B]'
                              : 'border-[#E9E2D8] bg-white hover:border-stone-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 relative rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-[#E9E2D8]">
                              <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">{item.name}</p>
                              <span className="text-[10px] font-mono text-stone-400">
                                Size: {item.size} • Color: {item.color}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-medium text-stone-900">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Reason */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 mb-1.5">
                    3. Reason for Return / Exchange
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                  >
                    {returnReasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Notes */}
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-600 mb-1.5">
                    4. Additional Atelier Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide details about fit adjustments or preferred replacement size..."
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 text-xs text-stone-900 rounded-xs focus:outline-none focus:border-[#702C3B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Authorize Return Request</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Existing Returns & Policy */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Return Requests List */}
            <div className="bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-4">
              <h4 className="font-serif text-lg font-medium text-stone-900 pb-2 border-b border-[#E9E2D8]">
                Your Return Submissions ({returns.length})
              </h4>

              {returns.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-2">
                  No active return requests logged in this session.
                </p>
              ) : (
                <div className="divide-y divide-[#E9E2D8]">
                  {returns.map((ret) => (
                    <div key={ret.id} className="py-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-stone-900">{ret.id}</span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-mono rounded font-semibold">
                          {ret.status}
                        </span>
                      </div>
                      <p className="text-stone-700 font-medium">{ret.item.name}</p>
                      <p className="text-[11px] text-stone-500">Reason: {ret.reason}</p>
                      <div className="flex justify-between text-[10px] font-mono text-stone-400 pt-1">
                        <span>Order: {ret.orderNumber}</span>
                        <span>Credit: {formatCurrency(ret.refundAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Policy Notes */}
            <div className="bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-3 text-xs text-stone-600">
              <h4 className="font-serif text-base font-medium text-stone-900">
                Atelier Return Guidelines
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7658] shrink-0 mt-0.5" />
                  <span>Garments must retain pristine security tags and original velvet garment covers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#2E7658] shrink-0 mt-0.5" />
                  <span>Doorstep pickup is coordinated within 2 business days of request submission.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-3.5 h-3.5 text-[#2E7658] shrink-0 mt-0.5" />
                  <span>Full digital credit is disbursed immediately upon inspection.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
