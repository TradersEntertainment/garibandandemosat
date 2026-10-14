import React from 'react';
import { ShieldCheck, Zap, TrendingDown, ShoppingBag, EyeOff, Sparkles, ArrowDown } from 'lucide-react';

interface HeroProps {
  onQuickSearch: (query: string) => void;
  onOpenMarketBasket: () => void;
  onFilterKelepir: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onQuickSearch,
  onOpenMarketBasket,
  onFilterKelepir,
}) => {
  const trendingTags = [
    'iPhone 16 Pro',
    'Dyson V15',
    'Airfryer XXL',
    'PlayStation 5 Slim',
    'AirPods Pro 2',
    'Zeytinyağı 5L',
    'MacBook Air M3',
    'Fairy 115 Yıkama',
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-10 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Top Mini Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-5 shadow-lg">
          <Sparkles size={14} className="text-emerald-400 animate-spin-slow" />
          <span>Cimri'den 10 Kat Daha Hızlı & Sıfır Sahte İndirim</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Aynı Ürüne Fazla Para Vermek <br />
          <span className="text-gradient-gariban">Zenginlerin İşi.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Garibandan.com milyonlarca ürünü <strong>Trendyol, Hepsiburada, Amazon</strong> ve 50+ mağazada aynı anda tarar; komisyonsuz, gerçek <strong>en dip fiyatı</strong> saniyeler içinde bulur.
        </p>

        {/* Trending Search Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs text-slate-400 font-semibold mr-1">Popüler Aramalar:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onQuickSearch(tag)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 3 Pillars / USPs */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <EyeOff size={20} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">0 Reklam, %100 Şeffaf Sıralama</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diğer siteler gibi parayı veren mağazayı değil; cebinizi düşünen, gerçekten en ucuz olan mağazayı ilk sıraya yerleştiririz.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <TrendingDown size={20} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Fiyat Şişirme Dedektörü</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              İndirimden hemen önce fiyatı katlayıp "%50 indirim yaptık" diyen satıcıların 6 aylık fiyat grafiğiyle foyasını ortaya çıkarırız.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={onOpenMarketBasket}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md hover:border-yellow-500/40 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag size={20} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
              <span>Market Sepeti Karşılaştırıcı</span>
              <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded font-bold">Dene</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Migros, Carrefour, ŞOK ve A101 sepetini anında karşılaştırıp hangisinden alırsanız ne kadar kâr edeceğinizi hesaplar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
