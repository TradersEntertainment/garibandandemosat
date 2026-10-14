import React from 'react';
import { Star, Bell, ArrowRight, ShieldCheck, TrendingDown, Store, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onSetAlert: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onSetAlert,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const priceDifference = product.highestPrice - product.lowestPrice;
  const bestOffer = product.offers[0];

  // Gariban Score Badge Color
  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'from-emerald-500 to-teal-500 text-white shadow-emerald-500/20';
    if (score >= 8.0) return 'from-teal-600 to-cyan-600 text-white shadow-cyan-500/20';
    if (score >= 6.5) return 'from-amber-500 to-yellow-600 text-slate-950 shadow-amber-500/20';
    return 'from-rose-600 to-red-600 text-white shadow-rose-500/20';
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-slate-900/80 rounded-2xl border border-slate-800/90 overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
    >
      {/* Top badges bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Gariban Score Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black shadow-lg bg-gradient-to-r ${getScoreColor(
            product.garibanScore
          )}`}
        >
          <Sparkles size={12} className="animate-spin-slow" />
          <span>{product.garibanScore}</span>
          <span className="text-[10px] font-medium opacity-90">/ 10</span>
        </div>

        {/* Discount Badge if available */}
        <div className="flex items-center gap-1.5">
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="flex items-center gap-0.5 bg-rose-500/95 text-white text-xs font-black px-2 py-1 rounded-xl shadow-md">
              <TrendingDown size={12} />
              -%{product.discountPercentage}
            </span>
          )}

          {/* Quick Alert Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetAlert(product);
            }}
            title="Fiyat Alarmı Kur"
            className="pointer-events-auto p-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-emerald-400 hover:bg-slate-900 border border-slate-700/60 transition-colors"
          >
            <Bell size={14} />
          </button>
        </div>
      </div>

      {/* Image Container with hover zoom */}
      <div className="relative w-full pt-[80%] bg-slate-950/60 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-6 transform group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Free Shipping pill */}
        {product.freeShippingAvailable && (
          <div className="absolute bottom-2 left-3 bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-800/80 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
            <ShieldCheck size={11} />
            Ücretsiz Kargo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Reviews */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-200">{product.rating}</span>
              <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
            {product.title}
          </h3>

          {/* Verdict Tag */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              ✓ {product.garibanVerdict}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Store size={11} />
              {product.storesCount} mağaza
            </span>
          </div>
        </div>

        {/* Pricing & Footer Block */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          {/* Price Difference callout */}
          {priceDifference > 0 && (
            <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
              <span>Mağaza Farkı:</span>
              <span className="font-semibold text-emerald-400">
                ₺{priceDifference.toLocaleString('tr-TR')} cepte!
              </span>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">En Dip Fiyat</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-emerald-400">
                  ₺{product.lowestPrice.toLocaleString('tr-TR')}
                </span>
                {product.previousPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ₺{product.previousPrice.toLocaleString('tr-TR')}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                {bestOffer ? bestOffer.storeName : 'Amazon TR'}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              <span>İncele</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
