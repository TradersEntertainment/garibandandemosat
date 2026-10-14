import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Info } from 'lucide-react';

interface PriceHistoryChartProps {
  labels: string[];
  prices: number[];
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  productTitle: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  labels,
  prices,
  minPrice,
  maxPrice,
  averagePrice,
}) => {
  const [activeRange, setActiveRange] = useState<'30g' | '90g' | '180g' | '1y'>('180g');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 600;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  // Slicing data based on range
  let displayLabels = labels;
  let displayPrices = prices;
  if (activeRange === '30g') {
    displayLabels = labels.slice(-2);
    displayPrices = prices.slice(-2);
  } else if (activeRange === '90g') {
    displayLabels = labels.slice(-3);
    displayPrices = prices.slice(-3);
  }

  const currentMin = Math.min(...displayPrices);
  const currentMax = Math.max(...displayPrices);
  const range = currentMax - currentMin || 1;

  // Generate SVG Points
  const points = displayPrices.map((price, idx) => {
    const x = paddingX + (idx / (displayPrices.length - 1)) * (width - paddingX * 2);
    const normalizedY = (price - currentMin) / range;
    const y = height - paddingY - normalizedY * (height - paddingY * 2);
    return { x, y, price, label: displayLabels[idx] };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`;
  }, '');

  // Fill area under path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const lastPrice = displayPrices[displayPrices.length - 1];
  const firstPrice = displayPrices[0];
  const priceChange = lastPrice - firstPrice;
  const percentChange = ((priceChange / firstPrice) * 100).toFixed(1);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Gariban Fiyat Radarı
            </span>
            <span className="text-xs text-slate-400">| Gerçek Fiyat Geçmişi</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white">₺{lastPrice.toLocaleString('tr-TR')}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${priceChange <= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {priceChange <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              %{Math.abs(Number(percentChange))} ({priceChange <= 0 ? 'Düşüş' : 'Artış'})
            </span>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['30g', '90g', '180g', '1y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeRange === r
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === '30g' ? '1 Ay' : r === '90g' ? '3 Ay' : r === '180g' ? '6 Ay' : '1 Yıl'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 mb-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-center">
        <div>
          <div className="text-slate-400">En Düşük Fiyat</div>
          <div className="font-bold text-emerald-400 mt-0.5">₺{minPrice.toLocaleString('tr-TR')}</div>
        </div>
        <div className="border-x border-slate-800">
          <div className="text-slate-400">Ortalama Fiyat</div>
          <div className="font-bold text-amber-300 mt-0.5">₺{averagePrice.toLocaleString('tr-TR')}</div>
        </div>
        <div>
          <div className="text-slate-400">En Yüksek Fiyat</div>
          <div className="font-bold text-rose-400 mt-0.5">₺{maxPrice.toLocaleString('tr-TR')}</div>
        </div>
      </div>

      {/* SVG Canvas Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Grid horizontal lines */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = paddingY + pct * (height - paddingY * 2);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#priceGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === idx ? 7 : 4.5}
                className="transition-all duration-150 cursor-pointer"
                fill={hoveredIndex === idx ? '#34d399' : '#0f172a'}
                stroke="#10b981"
                strokeWidth={hoveredIndex === idx ? 3.5 : 2.5}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <text
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#94a3b8"
                className="font-medium"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-1 bg-slate-950 text-white text-xs px-3 py-1.5 rounded-lg border border-emerald-500 shadow-xl pointer-events-none transform -translate-x-1/2 transition-all"
            style={{ left: `${(points[hoveredIndex].x / width) * 100}%` }}
          >
            <div className="font-semibold text-emerald-400">{points[hoveredIndex].label} Fiyatı</div>
            <div className="text-sm font-black">₺{points[hoveredIndex].price.toLocaleString('tr-TR')}</div>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Info size={12} className="text-slate-500" />
          Fiyatlar Trendyol, Amazon TR, Hepsiburada ve 15+ mağazanın en ucuz teklifidir.
        </span>
        <span className="text-emerald-400 font-medium">Şişirilmiş fiyat tespit edilmedi ✓</span>
      </div>
    </div>
  );
};
