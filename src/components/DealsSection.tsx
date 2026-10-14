import React, { useState, useEffect } from 'react';
import { Flame, Clock, TrendingDown, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface DealsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ products, onSelectProduct }) => {
  // Flash deal countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const kelepirProducts = products.filter((p) => p.isKelepir).slice(0, 4);

  return (
    <section className="py-8 border-b border-slate-800/80 bg-gradient-to-b from-rose-950/20 via-slate-950 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Flame size={20} className="animate-bounce" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Günün Kelepirleri & Çakılan Fiyatlar</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Son 6 ayın en dip seviyesine inen ve piyasaya göre devasa fark yaratan ürünler
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-900 border border-rose-500/30 px-3.5 py-2 rounded-2xl shadow-lg shadow-rose-500/5">
            <Clock size={16} className="text-rose-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-semibold">Günün Fırsatları Bitiş:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm text-white">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-rose-300">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              :
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-rose-300">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              :
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-rose-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Kelepir Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kelepirProducts.map((product) => {
            const savings = product.highestPrice - product.lowestPrice;
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-slate-900/90 rounded-2xl border border-rose-500/30 p-4 hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/10 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                    <TrendingDown size={12} />
                    -%{product.discountPercentage || 20} DÜŞÜŞ
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    DİP FİYAT
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative w-full h-36 bg-slate-950/80 rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">{product.brand}</div>
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-rose-300 transition-colors">
                    {product.title}
                  </h3>
                </div>

                {/* Price block */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Piyasadan:</span>
                    <span className="font-bold text-emerald-400">₺{savings.toLocaleString('tr-TR')} daha ucuz</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-lg font-black text-rose-400">
                        ₺{product.lowestPrice.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-[10px] text-slate-500 line-through">
                        ₺{product.highestPrice.toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <button className="p-2 bg-rose-500 group-hover:bg-rose-400 text-white rounded-xl shadow transition-all">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
