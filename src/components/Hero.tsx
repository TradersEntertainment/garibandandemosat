import React from 'react';
import { EyeOff, TrendingDown, ShoppingBag, Sparkles, Terminal, Activity, ArrowDown } from 'lucide-react';
import { ThreeProductViewer } from './ThreeProductViewer';

interface HeroProps {
  onQuickSearch: (query: string) => void;
  onOpenMarketBasket: () => void;
  onSelectProductDetails: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onQuickSearch,
  onOpenMarketBasket,
  onSelectProductDetails,
}) => {
  const trendingTags = [
    'iPhone 16 Pro',
    'Dyson V15',
    'Airfryer XXL',
    'PlayStation 5 Slim',
    'AirPods Pro 2',
    'Zeytinyağı 5L',
    'MacBook Air M3',
    'Samba OG',
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-12 border-b border-white/10 bg-[#05070c] bg-grid-cyber bg-radial-vignette">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyber-emerald/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-cyber-indigo/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Telemetry Ticker Line */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 pb-6 border-b border-white/8 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping"></span>
            <span className="text-white font-bold uppercase tracking-wider">GARIBAN_RADAR // v2.6.4</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyber-emerald font-semibold">Tüm Perakende Ağları Canlı</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] sm:text-[11px]">
            <span>NODES: <strong className="text-white">52 MAĞAZA</strong></span>
            <span>GÜNCELLEME: <strong className="text-cyber-emerald">1.2 SANİYE ÖNCE</strong></span>
            <span>TOPLAM TASARRUF: <strong className="text-white">₺5.420.000+</strong></span>
          </div>
        </div>

        {/* Hero Main Header Content */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-950 border border-cyber-emerald/40 text-cyber-emerald text-xs font-mono font-bold mb-5 shadow-2xl shadow-cyber-emerald/10">
            <Sparkles size={14} className="text-cyber-emerald animate-pulse" />
            <span>YENİ NESİL 3D FİYAT RADARI & ARBİTRAJ MOTORU</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] font-display">
            Aynı Ürüne Fazla Para Vermek <br />
            <span className="bg-gradient-to-r from-cyber-emerald via-cyber-mint to-cyan-400 bg-clip-text text-transparent">
              Zenginlerin İşi.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Milyonlarca ürünü <strong>Trendyol, Hepsiburada, Amazon</strong> ve 50+ mağazada aynı anda tarayın; 3D ürün simülatörü ve sahte indirim dedektörüyle gerçek <strong>en dip fiyatı</strong> saniyeler içinde yakalayın.
          </p>

          {/* Quick Search Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
              <Terminal size={12} className="text-cyber-emerald" />
              Popüler:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onQuickSearch(tag)}
                className="text-xs font-mono px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-cyber-emerald/15 text-slate-300 hover:text-cyber-emerald border border-white/8 hover:border-cyber-emerald/40 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 3D Showcase Arena (The Crown Jewel) */}
        <div className="my-8">
          <ThreeProductViewer onSelectProductDetails={onSelectProductDetails} />
        </div>

        {/* 3 Value Pillars */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-obsidian-850/70 border border-white/8 backdrop-blur-md hover:border-cyber-emerald/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyber-emerald/10 border border-cyber-emerald/30 flex items-center justify-center text-cyber-emerald mb-3">
              <EyeOff size={18} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 font-display">0 Reklam, %100 Şeffaf Sıralama</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Parayı veren mağaza değil; cebinizi düşünen, gerçekten en ucuz teklifi sunan satıcı ilk sıraya yerleşir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-obsidian-850/70 border border-white/8 backdrop-blur-md hover:border-cyber-indigo/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyber-indigo/15 border border-cyber-indigo/30 flex items-center justify-center text-cyber-indigo mb-3">
              <TrendingDown size={18} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 font-display">Fiyat Şişirme Dedektörü</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              İndirimden hemen önce fiyatı ikiye katlayıp "sahte indirim" uygulayan satıcıların 6 aylık fiyat geçmişiyle foyasını döker.
            </p>
          </div>

          <div
            onClick={onOpenMarketBasket}
            className="p-5 rounded-2xl bg-obsidian-850/70 border border-white/8 backdrop-blur-md hover:border-amber-400/40 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag size={18} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 font-display flex items-center justify-between">
              <span>Market Sepeti Karşılaştırıcı</span>
              <span className="text-[10px] font-mono bg-amber-400 text-obsidian-950 font-black px-1.5 py-0.5 rounded">DENEYİN</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Migros, Carrefour, ŞOK ve A101 sepetini anında karşılaştırıp hangi kombinasyonla ne kadar kâr edeceğinizi hesaplar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
