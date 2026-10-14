import React, { useState } from 'react';
import { X, ShoppingCart, Check, TrendingDown, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GROCERY_ITEMS } from '../data/groceryItems';

interface MarketBasketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketBasketModal: React.FC<MarketBasketModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Selected items state (initially all selected)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    GROCERY_ITEMS.map((item) => item.id)
  );

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Calculate totals
  const selectedItems = GROCERY_ITEMS.filter((item) => selectedItemIds.includes(item.id));

  const totalMigros = selectedItems.reduce((acc, curr) => acc + curr.prices.migros, 0);
  const totalCarrefour = selectedItems.reduce((acc, curr) => acc + curr.prices.carrefour, 0);
  const totalSok = selectedItems.reduce((acc, curr) => acc + curr.prices.sok, 0);
  const totalA101 = selectedItems.reduce((acc, curr) => acc + curr.prices.a101, 0);

  // Split-basket minimum
  const totalOptimal = selectedItems.reduce((acc, curr) => {
    const minP = Math.min(curr.prices.migros, curr.prices.carrefour, curr.prices.sok, curr.prices.a101);
    return acc + minP;
  }, 0);

  const marketTotals = [
    { name: 'ŞOK Market', total: totalSok, logoColor: 'text-yellow-400', badge: 'En Hesaplı Zincir' },
    { name: 'A101 Kapıda', total: totalA101, logoColor: 'text-cyan-400', badge: 'Hızlı Teslimat' },
    { name: 'Migros Sanal Market', total: totalMigros, logoColor: 'text-orange-400', badge: 'Geniş Çeşit' },
    { name: 'CarrefourSA', total: totalCarrefour, logoColor: 'text-blue-400', badge: 'Süpermarket' },
  ].sort((a, b) => a.total - b.total);

  const cheapestMarket = marketTotals[0];
  const mostExpensiveMarket = marketTotals[marketTotals.length - 1];
  const totalSaved = mostExpensiveMarket.total - cheapestMarket.total;
  const extraSplitSaved = cheapestMarket.total - totalOptimal;

  const handleApplySavings = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShoppingCart size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Gariban Market Sepeti</span>
                <span className="text-xs bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md font-extrabold">
                  Canlı Karşılaştırma
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Temel gıda ve temizlik ürünlerini 4 büyük market arasında canlı kıyasla
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Market Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {marketTotals.map((market, index) => {
              const isBest = index === 0;
              return (
                <div
                  key={market.name}
                  className={`p-4 rounded-2xl border transition-all ${
                    isBest
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold ${market.logoColor}`}>{market.name}</span>
                    {isBest && (
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                        EN UCUZ
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-white mt-1">
                    ₺{market.total.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isBest ? (
                      <span className="text-emerald-400 font-semibold">
                        ₺{totalSaved.toFixed(0)} daha kârlı!
                      </span>
                    ) : (
                      `+₺${(market.total - cheapestMarket.total).toFixed(0)} daha pahalı`
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Split Basket Callout */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles size={16} />
                <span>Akıllı Parçalı Sepet Optimizasyonu:</span>
              </div>
              <p className="text-xs text-slate-300">
                Her ürünü en ucuz olduğu marketten sipariş ederseniz sepet tutarı{' '}
                <strong className="text-emerald-300 text-sm">₺{totalOptimal.toFixed(2)}</strong> seviyesine iner.
                Tek markete göre ekstra <strong className="text-emerald-300">₺{extraSplitSaved.toFixed(0)}</strong> daha kazanırsınız!
              </p>
            </div>
            <button
              onClick={handleApplySavings}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap"
            >
              Kârı Kutla 🎉
            </button>
          </div>

          {/* Items Selector Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Sepetteki Ürünler ({selectedItems.length}/{GROCERY_ITEMS.length})</span>
              <span className="text-slate-400 font-normal">Fiyatları karşılaştırılan marketler</span>
            </div>

            <div className="divide-y divide-slate-800/70">
              {GROCERY_ITEMS.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const minPrice = Math.min(
                  item.prices.migros,
                  item.prices.carrefour,
                  item.prices.sok,
                  item.prices.a101
                );

                return (
                  <div
                    key={item.id}
                    className={`p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isSelected ? 'bg-transparent' : 'opacity-50 bg-slate-950/30'
                    }`}
                  >
                    {/* Item checkbox & info */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-700 bg-slate-900 text-transparent'
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800"
                      />

                      <div>
                        <h4 className="text-sm font-semibold text-white leading-tight">
                          {item.name}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {item.brand} • <span className="text-emerald-400">{item.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison Pills across 4 markets */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className={`p-2 rounded-xl border ${item.prices.sok === minPrice ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300'}`}>
                        <div className="text-[10px] text-slate-400">ŞOK</div>
                        <div>₺{item.prices.sok.toFixed(2)}</div>
                      </div>

                      <div className={`p-2 rounded-xl border ${item.prices.a101 === minPrice ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300'}`}>
                        <div className="text-[10px] text-slate-400">A101</div>
                        <div>₺{item.prices.a101.toFixed(2)}</div>
                      </div>

                      <div className={`p-2 rounded-xl border ${item.prices.migros === minPrice ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300'}`}>
                        <div className="text-[10px] text-slate-400">Migros</div>
                        <div>₺{item.prices.migros.toFixed(2)}</div>
                      </div>

                      <div className={`p-2 rounded-xl border ${item.prices.carrefour === minPrice ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300'}`}>
                        <div className="text-[10px] text-slate-400">Carrefour</div>
                        <div>₺{item.prices.carrefour.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
