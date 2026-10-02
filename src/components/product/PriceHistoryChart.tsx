'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PricePoint } from '@/types';
import { formatCurrency } from '@/lib/utils/formatters';

interface PriceHistoryChartProps {
  priceHistory: PricePoint[];
  currentPrice: number;
}

export function PriceHistoryChart({ priceHistory, currentPrice }: PriceHistoryChartProps) {
  if (!priceHistory || priceHistory.length === 0) return null;

  return (
    <div className="bg-white border border-[#E9E2D8] p-5 rounded-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-serif text-sm font-medium text-stone-900">
            Price History &amp; Trajectory
          </h4>
          <p className="text-[11px] text-stone-500">
            Historical price index over recent quarters (Simulated Demo Index)
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-stone-400 block">Current</span>
          <span className="font-medium text-sm text-[#702C3B]">
            {formatCurrency(currentPrice)}
          </span>
        </div>
      </div>

      <div className="h-44 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceHistory} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" />
            <XAxis
              dataKey="date"
              stroke="#A8A29E"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#E9E2D8' }}
            />
            <YAxis
              stroke="#A8A29E"
              fontSize={10}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tickLine={false}
              axisLine={{ stroke: '#E9E2D8' }}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value) || 0), 'Price']}
              contentStyle={{
                backgroundColor: '#171717',
                borderColor: '#2A2A2A',
                borderRadius: '2px',
                color: '#FFFFFF',
                fontSize: '11px',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#702C3B"
              strokeWidth={2}
              dot={{ r: 3, fill: '#702C3B' }}
              activeDot={{ r: 5, fill: '#171717' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
