import React, { useState, useEffect } from 'react';
import { Flame, Clock, TrendingDown, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface DealsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ products, onSelectProduct }) => {
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
    <section className="py-10 border-b border-white/10 bg-gradient-to-b from-rose-950/20 via-obsidian-900 to-obsidian-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <Flame size={20} className="animate-bounce" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
                <span>Günün Kelepirleri & Çakılan Fiyatlar</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Son 6 ayın en dip seviyesine inen ve zincir mağazalara göre devasa tasarruf yaratan ürünler
            </p>
          </div>

          {/* Countdown Clock with JetBrains Mono */}
          <div className="flex items-center gap-2.5 bg-obsidian-950/90 border border-rose-500/30 px-4 py-2 rounded-2xl shadow-xl shadow-rose-500/5">
            <Clock size={16} className="text-rose-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-mono font-medium">Kalan Süre:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm text-white">
              <span className="bg-obsidian-900 px-2.5 py-1 rounded-lg border border-white/10 text-rose-300">
                {String(timeLeft.hours).padStart(2, '0')}s
              </span>
              <span className="text-rose-400">:</span>
              <span className="bg-obsidian-900 px-2.5 py-1 rounded-lg border border-white/10 text-rose-300">
                {String(timeLeft.minutes).padStart(2, '0')}d
              </span>
              <span className="text-rose-400">:</span>
              <span className="bg-obsidian-900 px-2.5 py-1 rounded-lg border border-white/10 text-rose-300">
                {String(timeLeft.seconds).padStart(2, '0')}s
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
                className="group relative bg-obsidian-850/90 rounded-3xl border border-rose-500/30 p-5 hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Badges */}
                <div className="flex items-center justify-between mb-3 font-mono">
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow">
                    <TrendingDown size={12} />
                    -%{product.discountPercentage || 20} DÜŞÜŞ
                  </span>
                  <span className="text-[10px] font-bold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/20 px-2 py-0.5 rounded-lg">
                    DİP FİYAT
                  </span>
                </div>

                {/* Product Image Stage */}
                <div className="relative w-full h-40 bg-gradient-to-b from-obsidian-950 to-obsidian-900/60 rounded-2xl flex items-center justify-center p-3 mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                    {product.brand}
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-rose-300 transition-colors font-display">
                    {product.title}
                  </h3>
                </div>

                {/* Pricing Block */}
                <div className="mt-4 pt-3.5 border-t border-white/8">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                    <span className="text-slate-400">Piyasa Farkı:</span>
                    <span className="font-bold text-cyber-emerald">₺{savings.toLocaleString('tr-TR')} kâr</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-black text-rose-400 font-mono tracking-tight">
                        ₺{product.lowestPrice.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-[10px] text-slate-500 line-through font-mono">
                        ₺{product.highestPrice.toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <button className="p-2.5 bg-rose-500 group-hover:bg-rose-400 text-white rounded-xl shadow transition-all">
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
